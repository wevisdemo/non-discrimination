import { afterEach, describe, expect, it, vi } from 'vitest';

/** Loads the client with `VITE_API_URL` set (or not) and `fetch` answering `reply` */
async function load(url: string | undefined, reply?: () => Promise<Response>) {
	vi.resetModules();
	vi.stubEnv('VITE_API_URL', url ?? '');
	const fetchMock = vi.fn<typeof fetch>(reply ?? (async () => new Response('{}')));
	vi.stubGlobal('fetch', fetchMock);
	return { api: await import('./client.ts'), fetchMock };
}

afterEach(() => {
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
});

describe('without VITE_API_URL', () => {
	it('is not configured and never calls fetch', async () => {
		const { api, fetchMock } = await load(undefined);
		expect(api.backendConfigured).toBe(false);
		expect(await api.sendVote('karen', 'heard')).toBe(false);
		expect(await api.loadResults('karen')).toBeUndefined();
		expect(await api.sendSurvey({ age: '18-35 ปี' })).toBe(false);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('with VITE_API_URL', () => {
	it('posts a vote as JSON, ignoring a trailing slash in the address', async () => {
		const { api, fetchMock } = await load('https://api.test/');
		expect(api.backendConfigured).toBe(true);
		expect(await api.sendVote('karen', 'heard')).toBe(true);
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe('https://api.test/votes');
		expect(init?.method).toBe('POST');
		expect(JSON.parse(init?.body as string)).toEqual({ poll: 'karen', choice: 'heard' });
	});

	it('reads the results', async () => {
		const body = {
			poll: 'law',
			total: 3,
			percent: { agree: 66.7, unnecessary: 33.3, disagree: 0 }
		};
		const { api, fetchMock } = await load('https://api.test', async () => Response.json(body));
		expect(await api.loadResults('law')).toEqual({ total: 3, percent: body.percent });
		expect(fetchMock.mock.calls[0][0]).toBe('https://api.test/results?poll=law');
	});

	it('answers false/undefined on errors, timeouts and odd bodies, never throwing', async () => {
		const failing = await load('https://api.test', async () => new Response('no', { status: 502 }));
		expect(await failing.api.sendVote('karen', 'heard')).toBe(false);
		expect(await failing.api.loadResults('karen')).toBeUndefined();
		expect(await failing.api.sendSurvey({ age: '18-35 ปี' })).toBe(false);

		const offline = await load('https://api.test', async () => {
			throw new TypeError('Failed to fetch');
		});
		expect(await offline.api.sendVote('karen', 'heard')).toBe(false);
		expect(await offline.api.loadResults('karen')).toBeUndefined();

		const odd = await load('https://api.test', async () => Response.json({ hello: 1 }));
		expect(await odd.api.loadResults('karen')).toBeUndefined();
	});
});
