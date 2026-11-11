/**
 * The API behind the polls and the Result survey: a thin proxy in front of NocoDB, so the NocoDB
 * token never reaches the browser. It only does three things, and checks every value against the
 * same lists the site uses before it touches NocoDB:
 *
 *   POST /votes    { poll, choice }   add one vote
 *   GET  /results?poll=…              the share of each choice, as percentages
 *   POST /survey   { age?, … }        add one survey response
 *
 * Nothing that identifies a visitor is stored: a vote is just (poll, choice), a response is just
 * the answers.
 */
import {
	AGES,
	GENDERS,
	OCCUPATIONS,
	PROVINCES,
	SATISFACTION
} from '../../src/lib/content/survey.ts';
import { LAW_CHOICES, POLL_CHOICES } from '../../src/lib/state/poll.ts';

export interface Env {
	NOCODB_URL: string;
	NOCODB_BASE: string;
	/** Secret: `wrangler secret put NOCODB_TOKEN` */
	NOCODB_TOKEN: string;
	/** Comma-separated origins allowed to call the API from a browser */
	ALLOWED_ORIGINS: string;
	/** Optional Cloudflare rate-limit binding (see wrangler.toml); an in-memory limit is the fallback */
	RATE_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

/** Kept in step with src/lib/content/cases by worker.spec.ts */
export const CASE_SLUGS = [
	'age-limit-job',
	'cambodian-husband',
	'disability-judge',
	'disabled-police',
	'elderly-mobile-banking',
	'ex-con-job',
	'gender-promotion',
	'hate-speech',
	'hijab-school',
	'hiv-police',
	'hiv-test-job',
	'housework-gender',
	'karen',
	'katoey-police',
	'marriage-remarry',
	'prison-corruption',
	'social-security',
	'transgender-bar'
] as const;

/** What a poll id accepts: a case slug takes the ชวนคุย answers, `law` the KP3 ones */
function choicesFor(poll: string): readonly string[] | undefined {
	if (poll === 'law') return LAW_CHOICES;
	return (CASE_SLUGS as readonly string[]).includes(poll) ? POLL_CHOICES : undefined;
}

export type Deps = { fetch: typeof fetch; now: () => number };

const RESULTS_TTL_MS = 60_000;
const LIMIT_PER_MINUTE = 10;
const MAX_BODY = 2048;

const results = new Map<string, { at: number; body: unknown }>();
const hits = new Map<string, number[]>();

/** Test hook: forget the cached results and the in-memory rate limit */
export function resetState() {
	results.clear();
	hits.clear();
}

function allowedOrigin(request: Request, env: Env): string | undefined {
	const origin = request.headers.get('Origin');
	if (!origin) return undefined;
	const allowed = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
	return allowed.includes(origin) ? origin : undefined;
}

function json(body: unknown, status: number, origin?: string, extra: HeadersInit = {}) {
	const headers = new Headers({ 'Content-Type': 'application/json', ...extra });
	if (origin) {
		headers.set('Access-Control-Allow-Origin', origin);
		headers.set('Vary', 'Origin');
	}
	return new Response(JSON.stringify(body), { status, headers });
}

async function readJson(request: Request): Promise<unknown> {
	const text = await request.text();
	if (text.length > MAX_BODY) throw new Error('too large');
	return JSON.parse(text);
}

async function withinLimit(request: Request, env: Env, now: number): Promise<boolean> {
	const key = request.headers.get('CF-Connecting-IP') ?? 'unknown';
	if (env.RATE_LIMITER) return (await env.RATE_LIMITER.limit({ key })).success;
	const recent = (hits.get(key) ?? []).filter((t) => now - t < 60_000);
	if (recent.length >= LIMIT_PER_MINUTE) {
		hits.set(key, recent);
		return false;
	}
	hits.set(key, [...recent, now]);
	return true;
}

function nocodb(env: Env, table: string, query = '') {
	const url = `${env.NOCODB_URL}/api/v1/db/data/noco/${env.NOCODB_BASE}/${table}${query}`;
	return { url, headers: { 'xc-token': env.NOCODB_TOKEN, 'Content-Type': 'application/json' } };
}

async function insert(env: Env, deps: Deps, table: string, row: Record<string, unknown>) {
	const { url, headers } = nocodb(env, table);
	const res = await deps.fetch(url, { method: 'POST', headers, body: JSON.stringify(row) });
	return res.ok;
}

/** Whole-number-free percentages with one decimal, in the order of `choices` */
function shares(choices: readonly string[], counts: Map<string, number>) {
	const total = choices.reduce((sum, c) => sum + (counts.get(c) ?? 0), 0);
	const percent = Object.fromEntries(
		choices.map((c) => [c, total ? Math.round(((counts.get(c) ?? 0) / total) * 1000) / 10 : 0])
	);
	return { total, percent };
}

async function handleResults(url: URL, env: Env, deps: Deps, origin?: string) {
	const poll = url.searchParams.get('poll') ?? '';
	const choices = choicesFor(poll);
	if (!choices) return json({ error: 'unknown poll' }, 400, origin);

	const cached = results.get(poll);
	if (cached && deps.now() - cached.at < RESULTS_TTL_MS) return json(cached.body, 200, origin);

	const where = encodeURIComponent(`(poll,eq,${poll})`);
	const { url: target, headers } = nocodb(
		env,
		'poll_votes',
		`/groupby?column_name=choice&where=${where}&limit=50`
	);
	const res = await deps.fetch(target, { headers });
	if (!res.ok) return json({ error: 'upstream' }, 502, origin);
	const data = (await res.json()) as { list?: { choice?: string; count?: string | number }[] };
	const counts = new Map<string, number>();
	for (const row of data.list ?? []) {
		if (row.choice) counts.set(row.choice, Number(row.count) || 0);
	}
	const body = { poll, ...shares(choices, counts) };
	results.set(poll, { at: deps.now(), body });
	return json(body, 200, origin);
}

async function handleVote(request: Request, env: Env, deps: Deps, origin: string) {
	let body: unknown;
	try {
		body = await readJson(request);
	} catch {
		return json({ error: 'bad body' }, 400, origin);
	}
	const { poll, choice } = (body ?? {}) as { poll?: unknown; choice?: unknown };
	const choices = typeof poll === 'string' ? choicesFor(poll) : undefined;
	if (!choices || typeof choice !== 'string' || !choices.includes(choice)) {
		return json({ error: 'invalid vote' }, 400, origin);
	}
	if (!(await insert(env, deps, 'poll_votes', { poll, choice }))) {
		return json({ error: 'upstream' }, 502, origin);
	}
	// The next /results should include this vote
	results.delete(poll as string);
	return json({ ok: true }, 201, origin);
}

const SURVEY_FIELDS = {
	age: AGES,
	gender: GENDERS,
	occupation: OCCUPATIONS,
	province: PROVINCES
} as const;

async function handleSurvey(request: Request, env: Env, deps: Deps, origin: string) {
	let body: unknown;
	try {
		body = await readJson(request);
	} catch {
		return json({ error: 'bad body' }, 400, origin);
	}
	if (!body || typeof body !== 'object' || Array.isArray(body)) {
		return json({ error: 'invalid response' }, 400, origin);
	}
	const input = body as Record<string, unknown>;
	const row: Record<string, string | number> = {};
	for (const [key, allowed] of Object.entries(SURVEY_FIELDS)) {
		const value = input[key];
		if (value === undefined) continue;
		if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value)) {
			return json({ error: `invalid ${key}` }, 400, origin);
		}
		row[key] = value;
	}
	const score = input.satisfaction;
	if (score !== undefined) {
		if (!SATISFACTION.some((s) => s.score === score)) {
			return json({ error: 'invalid satisfaction' }, 400, origin);
		}
		row.satisfaction = score as number;
	}
	if (Object.keys(row).length === 0) return json({ error: 'empty response' }, 400, origin);
	if (!(await insert(env, deps, 'survey_responses', row))) {
		return json({ error: 'upstream' }, 502, origin);
	}
	return json({ ok: true }, 201, origin);
}

export async function handle(
	request: Request,
	env: Env,
	deps: Deps = { fetch: (...args) => fetch(...args), now: () => Date.now() }
): Promise<Response> {
	const url = new URL(request.url);
	const origin = allowedOrigin(request, env);

	if (request.method === 'OPTIONS') {
		if (!origin) return new Response(null, { status: 403 });
		return new Response(null, {
			status: 204,
			headers: {
				'Access-Control-Allow-Origin': origin,
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
				'Access-Control-Max-Age': '86400',
				Vary: 'Origin'
			}
		});
	}

	if (request.method === 'GET' && url.pathname === '/results') {
		return handleResults(url, env, deps, origin);
	}

	if (request.method === 'POST' && (url.pathname === '/votes' || url.pathname === '/survey')) {
		// Browsers always send Origin on a cross-site POST; anything without an allowed one is not us
		if (!origin) return json({ error: 'forbidden' }, 403);
		if (!(await withinLimit(request, env, deps.now()))) {
			return json({ error: 'slow down' }, 429, origin, { 'Retry-After': '60' });
		}
		return url.pathname === '/votes'
			? handleVote(request, env, deps, origin)
			: handleSurvey(request, env, deps, origin);
	}

	return json({ error: 'not found' }, 404, origin);
}
