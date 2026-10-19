/** The ชวนคุย answers on a case card (Figma "Poll"). */
export const POLL_CHOICES = ['experienced', 'witnessed', 'heard', 'never'] as const;
export type PollChoice = (typeof POLL_CHOICES)[number];

/**
 * Where a visitor's own answers are kept. The design shows every voter's percentages, which needs
 * shared storage (architecture.md §9, "Backend for polls"); until then only the visitor's own
 * answer is remembered, in the browser.
 */
export interface PollStore {
	load(slug: string): PollChoice | undefined;
	save(slug: string, choice: PollChoice): void;
}

const KEY = 'non-discrimination:poll';

export class LocalPollStore implements PollStore {
	#read(): Record<string, PollChoice> {
		try {
			const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '{}');
			if (!parsed || typeof parsed !== 'object') return {};
			return Object.fromEntries(
				Object.entries(parsed).filter(([, v]) => POLL_CHOICES.includes(v as PollChoice))
			) as Record<string, PollChoice>;
		} catch {
			return {};
		}
	}

	load(slug: string) {
		return this.#read()[slug];
	}

	save(slug: string, choice: PollChoice) {
		try {
			localStorage.setItem(KEY, JSON.stringify({ ...this.#read(), [slug]: choice }));
		} catch {
			// Answers are a nicety; blocked storage must not break the card.
		}
	}
}
