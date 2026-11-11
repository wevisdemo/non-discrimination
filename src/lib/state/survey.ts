import { backendConfigured, sendSurvey } from '#lib/api/client.ts';
import { AGES, GENDERS, OCCUPATIONS, PROVINCES, SATISFACTION } from '#lib/content/survey.ts';
import { readCookie, writeCookie } from './cookie.ts';

/** One visitor's answers to the Result survey (every field optional, as in the design). */
export type SurveyAnswers = {
	age?: string;
	gender?: string;
	occupation?: string;
	province?: string;
	satisfaction?: number;
};

/**
 * Where survey answers go: NocoDB (for สำนักงาน กสม.) when the build has a token
 * (VITE_NOCODB_TOKEN), otherwise nowhere, and the browser only remembers that this visitor
 * answered. Either way the answers are sent once.
 */
export interface SurveyStore {
	submitted(): boolean;
	/** What this browser chose so far, so a refresh still shows it */
	answers(): SurveyAnswers;
	saveAnswers(answers: SurveyAnswers): void;
	/** False if they could not be sent, so the visitor can try again */
	submit(answers: SurveyAnswers): Promise<boolean>;
}

const COOKIE = 'nd-survey';
const ANSWERS = 'nd-survey-answers';

const OPTIONS = {
	age: AGES,
	gender: GENDERS,
	occupation: OCCUPATIONS,
	province: PROVINCES
} as const;

/** A cookie remembers that this browser has answered, so the survey is sent once */
export class CookieSurveyStore implements SurveyStore {
	submitted() {
		return readCookie(COOKIE) === '1';
	}

	/** The choices made so far, as the cookie holds them, minus anything that is not one of the options */
	answers() {
		const kept: SurveyAnswers = {};
		try {
			const saved: Record<string, unknown> = JSON.parse(readCookie(ANSWERS) ?? '{}');
			for (const [key, options] of Object.entries(OPTIONS)) {
				const value = saved[key];
				if (typeof value === 'string' && (options as readonly string[]).includes(value)) {
					kept[key as keyof typeof OPTIONS] = value;
				}
			}
			if (SATISFACTION.some((level) => level.score === saved.satisfaction)) {
				kept.satisfaction = saved.satisfaction as number;
			}
		} catch {
			// A cookie that is not ours or not JSON: start with nothing chosen
		}
		return kept;
	}

	saveAnswers(answers: SurveyAnswers) {
		const chosen = Object.fromEntries(Object.entries(answers).filter(([, v]) => v !== undefined));
		writeCookie(ANSWERS, JSON.stringify(chosen));
	}

	async submit(answers: SurveyAnswers) {
		// Nothing to send when every field was left empty, as the design allows
		const empty = Object.values(answers).every((v) => v === undefined);
		if (backendConfigured && !empty && !(await sendSurvey(answers))) return false;
		writeCookie(COOKIE, '1');
		return true;
	}
}
