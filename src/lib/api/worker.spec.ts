import { readdirSync } from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import {
	CASE_SLUGS,
	handle,
	resetState,
	type Deps,
	type Env
} from '../../../worker/src/handler.ts';

const SITE = 'https://wevisdemo.github.io';
const env: Env = {
	NOCODB_URL: 'https://nocodb.test',
	NOCODB_BASE: 'base1',
	NOCODB_TOKEN: 'secret-token',
	ALLOWED_ORIGINS: `${SITE},http://localhost:5173`
};

type Call = { url: string; init?: RequestInit };

/** A fake NocoDB that records calls and answers with `reply` */
function fakeNocodb(reply: () => Response = () => new Response('{}', { status: 200 })) {
	const calls: Call[] = [];
	let time = 1_000_000;
	const deps: Deps = {
		fetch: async (input, init) => {
			calls.push({ url: String(input), init });
			return reply();
		},
		now: () => time
	};
	return { calls, deps, advance: (ms: number) => (time += ms) };
}

function post(path: string, body: unknown, origin: string | null = SITE, ip = '1.1.1.1') {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'CF-Connecting-IP': ip
	};
	if (origin) headers.Origin = origin;
	return new Request(`https://api.test${path}`, {
		method: 'POST',
		headers,
		body: JSON.stringify(body)
	});
}

beforeEach(resetState);

describe('the case list', () => {
	it('names every case in src/lib/content/cases', () => {
		const files = readdirSync(new URL('../content/cases', import.meta.url))
			.filter((f) => f.endsWith('.json'))
			.map((f) => f.replace(/\.json$/, ''))
			.sort();
		expect([...CASE_SLUGS].sort()).toEqual(files);
	});
});

describe('POST /votes', () => {
	it('adds one row to NocoDB with the token', async () => {
		const { calls, deps } = fakeNocodb();
		const res = await handle(post('/votes', { poll: 'karen', choice: 'witnessed' }), env, deps);
		expect(res.status).toBe(201);
		expect(res.headers.get('Access-Control-Allow-Origin')).toBe(SITE);
		expect(calls).toHaveLength(1);
		expect(calls[0].url).toBe('https://nocodb.test/api/v1/db/data/noco/base1/poll_votes');
		expect((calls[0].init?.headers as Record<string, string>)['xc-token']).toBe('secret-token');
		expect(JSON.parse(calls[0].init?.body as string)).toEqual({
			poll: 'karen',
			choice: 'witnessed'
		});
	});

	it('takes the KP3 choices for `law`, and only those', async () => {
		const { deps } = fakeNocodb();
		expect((await handle(post('/votes', { poll: 'law', choice: 'agree' }), env, deps)).status).toBe(
			201
		);
		expect((await handle(post('/votes', { poll: 'law', choice: 'heard' }), env, deps)).status).toBe(
			400
		);
		expect(
			(await handle(post('/votes', { poll: 'karen', choice: 'agree' }), env, deps)).status
		).toBe(400);
	});

	it('rejects polls that are not cases, and malformed bodies, without calling NocoDB', async () => {
		const { calls, deps } = fakeNocodb();
		for (const body of [
			{ poll: 'nope', choice: 'heard' },
			{ poll: 'karen' },
			{ poll: 7, choice: 'heard' },
			null,
			[]
		]) {
			expect((await handle(post('/votes', body), env, deps)).status).toBe(400);
		}
		const bad = new Request('https://api.test/votes', {
			method: 'POST',
			headers: { Origin: SITE },
			body: '{not json'
		});
		expect((await handle(bad, env, deps)).status).toBe(400);
		expect(calls).toHaveLength(0);
	});

	it('refuses POSTs with no allowed Origin', async () => {
		const { calls, deps } = fakeNocodb();
		const body = { poll: 'karen', choice: 'heard' };
		expect((await handle(post('/votes', body, null), env, deps)).status).toBe(403);
		expect((await handle(post('/votes', body, 'https://evil.test'), env, deps)).status).toBe(403);
		expect(calls).toHaveLength(0);
	});

	it('answers 502 when NocoDB refuses', async () => {
		const { deps } = fakeNocodb(() => new Response('no', { status: 403 }));
		const res = await handle(post('/votes', { poll: 'karen', choice: 'heard' }), env, deps);
		expect(res.status).toBe(502);
	});

	it('limits one IP to 10 writes a minute, and lets it back in afterwards', async () => {
		const { deps, advance } = fakeNocodb();
		const vote = () => handle(post('/votes', { poll: 'karen', choice: 'heard' }), env, deps);
		for (let i = 0; i < 10; i++) expect((await vote()).status).toBe(201);
		const blocked = await vote();
		expect(blocked.status).toBe(429);
		expect(blocked.headers.get('Retry-After')).toBe('60');
		// another visitor is unaffected
		const other = await handle(
			post('/votes', { poll: 'karen', choice: 'heard' }, SITE, '2.2.2.2'),
			env,
			deps
		);
		expect(other.status).toBe(201);
		advance(61_000);
		expect((await vote()).status).toBe(201);
	});

	it('uses the Cloudflare rate-limit binding when there is one', async () => {
		const { deps } = fakeNocodb();
		const limited: Env = { ...env, RATE_LIMITER: { limit: async () => ({ success: false }) } };
		const res = await handle(post('/votes', { poll: 'karen', choice: 'heard' }), limited, deps);
		expect(res.status).toBe(429);
	});
});

describe('GET /results', () => {
	const groupby = (rows: { choice: string; count: string }[]) => () =>
		new Response(JSON.stringify({ list: rows }), { status: 200 });
	const get = (poll: string) =>
		new Request(`https://api.test/results?poll=${poll}`, { headers: { Origin: SITE } });

	it('turns the counts into percentages with one decimal, zero for choices nobody picked', async () => {
		const { calls, deps } = fakeNocodb(
			groupby([
				{ choice: 'experienced', count: '2' },
				{ choice: 'witnessed', count: '1' }
			])
		);
		const res = await handle(get('karen'), env, deps);
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			poll: 'karen',
			total: 3,
			percent: { experienced: 66.7, witnessed: 33.3, heard: 0, never: 0 }
		});
		expect(decodeURIComponent(calls[0].url)).toContain('where=(poll,eq,karen)');
		expect(calls[0].url).toContain('/poll_votes/groupby?column_name=choice');
	});

	it('is all zeros before the first vote', async () => {
		const { deps } = fakeNocodb(groupby([]));
		const body = (await (await handle(get('law'), env, deps)).json()) as { total: number };
		expect(body.total).toBe(0);
	});

	it('caches for a minute, and a new vote clears the cache', async () => {
		const { calls, deps, advance } = fakeNocodb(groupby([{ choice: 'agree', count: '1' }]));
		await handle(get('law'), env, deps);
		await handle(get('law'), env, deps);
		expect(calls).toHaveLength(1);
		await handle(post('/votes', { poll: 'law', choice: 'agree' }), env, deps);
		await handle(get('law'), env, deps);
		expect(calls.filter((c) => c.url.includes('groupby'))).toHaveLength(2);
		advance(61_000);
		await handle(get('law'), env, deps);
		expect(calls.filter((c) => c.url.includes('groupby'))).toHaveLength(3);
	});

	it('rejects unknown polls without calling NocoDB', async () => {
		const { calls, deps } = fakeNocodb();
		expect((await handle(get('nope'), env, deps)).status).toBe(400);
		expect((await handle(new Request('https://api.test/results'), env, deps)).status).toBe(400);
		expect(calls).toHaveLength(0);
	});
});

describe('POST /survey', () => {
	it('stores the answers it was given', async () => {
		const { calls, deps } = fakeNocodb();
		const answers = { age: '18-35 ปี', gender: 'หญิง', province: 'เชียงใหม่', satisfaction: 4 };
		const res = await handle(post('/survey', answers), env, deps);
		expect(res.status).toBe(201);
		expect(calls[0].url).toBe('https://nocodb.test/api/v1/db/data/noco/base1/survey_responses');
		expect(JSON.parse(calls[0].init?.body as string)).toEqual(answers);
	});

	it('rejects values outside the survey lists, unknown-only and empty bodies', async () => {
		const { calls, deps } = fakeNocodb();
		for (const body of [
			{ age: '999 ปี' },
			{ province: 'Atlantis' },
			{ satisfaction: 6 },
			{ satisfaction: '4' },
			{ gender: 5 },
			{ note: 'hello' },
			{},
			[]
		]) {
			expect((await handle(post('/survey', body), env, deps)).status).toBe(400);
		}
		expect(calls).toHaveLength(0);
	});

	it('does not copy fields it does not know', async () => {
		const { calls, deps } = fakeNocodb();
		await handle(post('/survey', { age: '18-35 ปี', email: 'a@b.c' }), env, deps);
		expect(JSON.parse(calls[0].init?.body as string)).toEqual({ age: '18-35 ปี' });
	});
});

describe('CORS and routing', () => {
	it('answers the preflight for the site, and refuses it for others', async () => {
		const preflight = (origin: string) =>
			handle(
				new Request('https://api.test/votes', { method: 'OPTIONS', headers: { Origin: origin } }),
				env,
				fakeNocodb().deps
			);
		const ok = await preflight(SITE);
		expect(ok.status).toBe(204);
		expect(ok.headers.get('Access-Control-Allow-Origin')).toBe(SITE);
		expect(ok.headers.get('Access-Control-Allow-Methods')).toContain('POST');
		expect((await preflight('https://evil.test')).status).toBe(403);
	});

	it('404s everything else', async () => {
		const { deps } = fakeNocodb();
		expect((await handle(new Request('https://api.test/nope'), env, deps)).status).toBe(404);
		expect((await handle(new Request('https://api.test/votes'), env, deps)).status).toBe(404);
	});
});
