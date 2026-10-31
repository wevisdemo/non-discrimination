/** The ชวนคุย answers on a case card (Figma "Poll"). */
export const POLL_CHOICES = ['experienced', 'witnessed', 'heard', 'never'] as const;
export type PollChoice = (typeof POLL_CHOICES)[number];

/** The KP3 question: a law against discrimination 'เป็นการเฉพาะ'? */
export const LAW_CHOICES = ['agree', 'unnecessary', 'disagree'] as const;
export type LawChoice = (typeof LAW_CHOICES)[number];

/**
 * Where a visitor's own poll answers are kept, one per poll id (a case slug, or `law`). The design
 * shows every voter's percentages, which needs shared storage (architecture.md §9, "Backend for
 * polls"); until then only the visitor's own answer is remembered, in the browser.
 */
export interface PollStore<T extends string> {
	load(id: string): T | undefined;
	save(id: string, choice: T): void;
}

export class LocalPollStore<T extends string> implements PollStore<T> {
	readonly #key: string;
	readonly #choices: readonly T[];

	constructor(key: string, choices: readonly T[]) {
		this.#key = key;
		this.#choices = choices;
	}

	#read(): Record<string, T> {
		try {
			const parsed: unknown = JSON.parse(localStorage.getItem(this.#key) ?? '{}');
			if (!parsed || typeof parsed !== 'object') return {};
			return Object.fromEntries(
				Object.entries(parsed).filter(([, v]) => this.#choices.includes(v as T))
			) as Record<string, T>;
		} catch {
			return {};
		}
	}

	load(id: string) {
		return this.#read()[id];
	}

	save(id: string, choice: T) {
		try {
			localStorage.setItem(this.#key, JSON.stringify({ ...this.#read(), [id]: choice }));
		} catch {
			// Answers are a nicety; blocked storage must not break the page.
		}
	}
}
