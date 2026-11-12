/**
 * Where the cases a player has found are kept. They are only kept in memory, for the visit: the
 * check marks are gone after a refresh, so the search can be played again. A store that persists
 * them (the browser, or a backend) can implement the same interface without UI changes.
 */
export interface ProgressStore {
	load(): string[];
	save(foundSlugs: string[]): void;
}

/** Kept in memory only: gone with the page */
export class MemoryProgressStore implements ProgressStore {
	#found: string[] = [];
	load() {
		return [...this.#found];
	}
	save(foundSlugs: string[]) {
		this.#found = [...foundSlugs];
	}
}
