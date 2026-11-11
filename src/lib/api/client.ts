/**
 * The site's side of the polls/survey API (the Cloudflare Worker in /worker). The address is a
 * build-time variable, `VITE_API_URL`; when it is not set there is no backend: polls show
 * placeholder shares and the survey only remembers that it was answered in the browser.
 *
 * Every call resolves, never throws: a visitor must be able to use the page when the API is down.
 */
import type { SurveyAnswers } from '#lib/state/survey.ts';

const BASE = String(import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

export const backendConfigured = BASE !== '';

/** The share of each choice, in percent with one decimal, and how many votes that is out of */
export type Results = { total: number; percent: Record<string, number> };

const TIMEOUT_MS = 8000;

async function call(path: string, init?: RequestInit): Promise<Response | undefined> {
	if (!backendConfigured) return undefined;
	try {
		const res = await fetch(`${BASE}${path}`, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
		return res.ok ? res : undefined;
	} catch {
		return undefined;
	}
}

const post = (path: string, body: unknown) =>
	call(path, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});

export async function sendVote(poll: string, choice: string): Promise<boolean> {
	return (await post('/votes', { poll, choice })) !== undefined;
}

export async function loadResults(poll: string): Promise<Results | undefined> {
	const res = await call(`/results?poll=${encodeURIComponent(poll)}`);
	if (!res) return undefined;
	try {
		const data = (await res.json()) as Partial<Results>;
		if (typeof data.total !== 'number' || !data.percent || typeof data.percent !== 'object') {
			return undefined;
		}
		return { total: data.total, percent: data.percent };
	} catch {
		return undefined;
	}
}

export async function sendSurvey(answers: SurveyAnswers): Promise<boolean> {
	return (await post('/survey', answers)) !== undefined;
}
