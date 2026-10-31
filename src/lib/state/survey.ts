/** One visitor's answers to the Result survey (every field optional, as in the design). */
export type SurveyAnswers = {
	age?: string;
	gender?: string;
	occupation?: string;
	province?: string;
	satisfaction?: number;
};

/**
 * Where survey answers go. The design sends them to สำนักงาน กสม. (architecture.md §9, "Backend for
 * polls and the survey"); until that exists the browser only remembers that this visitor answered.
 */
export interface SurveyStore {
	submitted(): boolean;
	submit(answers: SurveyAnswers): Promise<void>;
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
		// TODO(backend): send `answers` to the กสม. endpoint once there is one
		try {
			localStorage.setItem(KEY, JSON.stringify(answers));
		} catch {
			// Remembering is a nicety; blocked storage must not break the form.
		}
	}
}
