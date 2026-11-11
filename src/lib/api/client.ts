/**
 * The polls and the Result survey talk to NocoDB (sheets.wevis.info) straight from the browser.
 * The token is a build-time variable, `VITE_NOCODB_TOKEN` (the `NOCODB_TOKEN` Actions secret in the
 * deploy workflow), so it ends up in the published JavaScript and anyone can read it: use a token
 * from a NocoDB account that is an Editor on this base only (see architecture.md §9).
 *
 * When there is no token there is no backend: polls show placeholder shares and the survey only
 * remembers that it was answered in the browser.
 *
 * Every call resolves, never throws: a visitor must be able to use the page when NocoDB is down.
 */
import type { SurveyAnswers } from '#lib/state/survey.ts';

const TOKEN = String(import.meta.env.VITE_NOCODB_TOKEN ?? '').replace(/^['"]|['"]$/g, '');
const URL_BASE = String(import.meta.env.VITE_NOCODB_URL ?? 'https://sheets.wevis.info').replace(
	/\/+$/,
	''
);
const BASE_ID = String(import.meta.env.VITE_NOCODB_BASE ?? 'pjcgtwxsuwfob3r');

export const backendConfigured = TOKEN !== '';

/** The share of each choice, in percent with one decimal, and how many votes that is out of */
export type Results = { total: number; percent: Record<string, number> };

const TIMEOUT_MS = 8000;

async function call(table: string, suffix = '', init: RequestInit = {}) {
	if (!backendConfigured) return undefined;
	try {
		const res = await fetch(`${URL_BASE}/api/v1/db/data/noco/${BASE_ID}/${table}${suffix}`, {
			...init,
			headers: { 'xc-token': TOKEN, 'Content-Type': 'application/json' },
			signal: AbortSignal.timeout(TIMEOUT_MS)
		});
		return res.ok ? res : undefined;
	} catch {
		return undefined;
	}
}

/** Rows carry the time they were made, which NocoDB does not fill in for rows added over its API */
const insert = (table: string, row: Record<string, unknown>) =>
	call(table, '', {
		method: 'POST',
		body: JSON.stringify({ ...row, CreatedAt: new Date().toISOString() })
	});

/**
 * A poll as the tables hold it: `id` (the case slug, or `law`) is what results are filtered on,
 * `name` the readable title (the case's Thai name) that lets a person read the table.
 */
export type PollRef = { id: string; name: string };

/** `choice` is the Thai label the visitor clicked, e.g. เคยโดนกับตัว, so the table reads on its own */
export async function sendVote(poll: PollRef, choice: string): Promise<boolean> {
	return (await insert('poll_votes', { poll: poll.name, poll_id: poll.id, choice })) !== undefined;
}

/** Shares keyed by the same Thai choice labels that `sendVote` stores */
export async function loadResults(pollId: string): Promise<Results | undefined> {
	const where = encodeURIComponent(`(poll_id,eq,${pollId})`);
	const res = await call('poll_votes', `/groupby?column_name=choice&where=${where}&limit=50`);
	if (!res) return undefined;
	try {
		const data = (await res.json()) as { list?: { choice?: string; count?: string | number }[] };
		const counts = (data.list ?? []).filter((row) => row.choice);
		const total = counts.reduce((sum, row) => sum + (Number(row.count) || 0), 0);
		const percent = Object.fromEntries(
			counts.map((row) => [
				row.choice as string,
				total ? Math.round(((Number(row.count) || 0) / total) * 1000) / 10 : 0
			])
		);
		return { total, percent };
	} catch {
		return undefined;
	}
}

export async function sendSurvey(answers: SurveyAnswers): Promise<boolean> {
	return (await insert('survey_responses', answers)) !== undefined;
}
