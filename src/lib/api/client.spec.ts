import { afterEach, describe, expect, it, vi } from 'vitest';

/** Loads the client with a token set (or not) and `fetch` answering `reply` */
async function load(token: string | undefined, reply?: () => Promise<Response>) {
	vi.resetModules();
	vi.stubEnv('VITE_NOCODB_TOKEN', token ?? '');
	const fetchMock = vi.fn<typeof fetch>(reply ?? (async () => new Response('{}')));
	vi.stubGlobal('fetch', fetchMock);
	return { api: await import('./client.ts'), fetchMock };
}

afterEach(() => {
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
});

const KAREN = { id: 'karen', name: 'ผู้ต้องขังชาวกะเหรี่ยงถูกบังคับตัดผม' };
const TABLES = 'https://sheets.wevis.info/api/v1/db/data/noco/pjcgtwxsuwfob3r';

describe('without a token', () => {
	it('is not configured and never calls fetch', async () => {
		const { api, fetchMock } = await load(undefined);
		expect(api.backendConfigured).toBe(false);
		expect(await api.sendVote(KAREN, 'เคยได้ยินมา')).toBe(false);
		expect(await api.loadResults('karen')).toBeUndefined();
		expect(await api.sendSurvey({ age: '18-35 ปี' })).toBe(false);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('with a token', () => {
	it('adds a vote row with the Thai case name and label, the slug and the time', async () => {
		const { api, fetchMock } = await load('tok123');
		expect(api.backendConfigured).toBe(true);
		const before = Date.now();
		expect(await api.sendVote(KAREN, 'เคยโดนกับตัว')).toBe(true);
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe(`${TABLES}/poll_votes`);
		expect(init?.method).toBe('POST');
		expect((init?.headers as Record<string, string>)['xc-token']).toBe('tok123');
		const row = JSON.parse(init?.body as string);
		expect(row).toMatchObject({
			poll: 'ผู้ต้องขังชาวกะเหรี่ยงถูกบังคับตัดผม',
			poll_id: 'karen',
			choice: 'เคยโดนกับตัว'
		});
		expect(row.CreatedAt).toMatch(/^\d{4}-\d\d-\d\dT[\d:.]+Z$/);
		expect(Date.parse(row.CreatedAt)).toBeGreaterThanOrEqual(before);
		expect(Date.parse(row.CreatedAt)).toBeLessThanOrEqual(Date.now());
	});

	it('ignores quotes around the token, as in a quoted .env value', async () => {
		const { fetchMock, api } = await load("'tok123'");
		await api.sendVote(KAREN, 'เคยได้ยินมา');
		expect((fetchMock.mock.calls[0][1]?.headers as Record<string, string>)['xc-token']).toBe(
			'tok123'
		);
	});

	it('adds a survey row to survey_responses, with the time', async () => {
		const { api, fetchMock } = await load('tok123');
		expect(await api.sendSurvey({ age: '18-35 ปี', satisfaction: 4 })).toBe(true);
		expect(fetchMock.mock.calls[0][0]).toBe(`${TABLES}/survey_responses`);
		const row = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
		expect(row).toMatchObject({ age: '18-35 ปี', satisfaction: 4 });
		expect(Date.parse(row.CreatedAt)).not.toBeNaN();
	});

	it('turns the groupby counts into percentages with one decimal', async () => {
		const rows = {
			list: [
				{ count: '2', choice: 'เคยโดนกับตัว' },
				{ count: '1', choice: 'เคยเห็นกับตา' }
			]
		};
		const { api, fetchMock } = await load('tok123', async () => Response.json(rows));
		expect(await api.loadResults('karen')).toEqual({
			total: 3,
			percent: { เคยโดนกับตัว: 66.7, เคยเห็นกับตา: 33.3 }
		});
		const url = decodeURIComponent(String(fetchMock.mock.calls[0][0]));
		expect(url).toContain('/poll_votes/groupby?column_name=choice&where=(poll_id,eq,karen)');
	});

	it('has total 0 and no shares before the first vote', async () => {
		const { api } = await load('tok123', async () => Response.json({ list: [] }));
		expect(await api.loadResults('law')).toEqual({ total: 0, percent: {} });
	});

	it('answers false/undefined on errors, timeouts and odd bodies, never throwing', async () => {
		const failing = await load('tok123', async () => new Response('no', { status: 403 }));
		expect(await failing.api.sendVote(KAREN, 'เคยได้ยินมา')).toBe(false);
		expect(await failing.api.loadResults('karen')).toBeUndefined();
		expect(await failing.api.sendSurvey({ age: '18-35 ปี' })).toBe(false);

		const offline = await load('tok123', async () => {
			throw new TypeError('Failed to fetch');
		});
		expect(await offline.api.sendVote(KAREN, 'เคยได้ยินมา')).toBe(false);
		expect(await offline.api.loadResults('karen')).toBeUndefined();

		const odd = await load('tok123', async () => new Response('<html>', { status: 200 }));
		expect(await odd.api.loadResults('karen')).toBeUndefined();
	});
});
