import { readCookie, writeCookie } from './cookie.ts';

/** The ชวนคุย answers on a case card (Figma "Poll"). */
export const POLL_CHOICES = ['experienced', 'witnessed', 'heard', 'never'] as const;
export type PollChoice = (typeof POLL_CHOICES)[number];

/** The KP3 question: a law against discrimination 'เป็นการเฉพาะ'? */
export const LAW_CHOICES = ['agree', 'unnecessary', 'disagree'] as const;
export type LawChoice = (typeof LAW_CHOICES)[number];

/**
 * Where a visitor's own poll answers are kept, one per poll id (a case slug, or `law`). A cookie
 * remembers it, so each browser votes once per poll; clearing cookies or using another browser
 * votes again, which a site without sign-in cannot prevent.
 */
export interface PollStore<T extends string> {
	load(id: string): T | undefined;
	save(id: string, choice: T): void;
}

/** One cookie per poll family, holding `id:choice` pairs: `karen:heard|law:agree` */
export class CookiePollStore<T extends string> implements PollStore<T> {
	readonly #name: string;
	readonly #choices: readonly T[];

	constructor(name: string, choices: readonly T[]) {
		this.#name = name;
		this.#choices = choices;
	}

	#read(): Map<string, T> {
		const answers = new Map<string, T>();
		for (const pair of (readCookie(this.#name) ?? '').split('|')) {
			const [id, choice] = pair.split(':');
			if (id && this.#choices.includes(choice as T)) answers.set(id, choice as T);
		}
		return answers;
	}

	load(id: string) {
		return this.#read().get(id);
	}

	save(id: string, choice: T) {
		const answers = this.#read().set(id, choice);
		writeCookie(this.#name, [...answers].map(([key, value]) => `${key}:${value}`).join('|'));
	}
}
