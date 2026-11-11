import { backendConfigured, sendSurvey } from '#lib/api/client.ts';

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
	/** False if they could not be sent, so the visitor can try again */
	submit(answers: SurveyAnswers): Promise<boolean>;
}

const KEY = 'non-discrimination:survey';

export class LocalSurveyStore implements SurveyStore {
	submitted() {
		try {
			return localStorage.getItem(KEY) !== null;
		} catch {
			return false;
		}
	}

	async submit(answers: SurveyAnswers) {
		// Nothing to send when every field was left empty, as the design allows
		const empty = Object.values(answers).every((v) => v === undefined);
		if (backendConfigured && !empty && !(await sendSurvey(answers))) return false;
		try {
			localStorage.setItem(KEY, JSON.stringify(answers));
		} catch {
			// Remembering is a nicety; blocked storage must not break the form.
		}
		return true;
	}
}
