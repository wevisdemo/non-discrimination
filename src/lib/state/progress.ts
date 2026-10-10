/**
 * Where player progress is persisted. Only the browser implementation exists today;
 * a backend-backed store can implement the same interface later without UI changes.
 */
export interface ProgressStore {
	load(): string[];
	save(foundSlugs: string[]): void;
}

const KEY = 'non-discrimination:found';

export class LocalProgressStore implements ProgressStore {
	load(): string[] {
		try {
			const raw = localStorage.getItem(KEY);
			const parsed: unknown = raw ? JSON.parse(raw) : [];
			return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string') : [];
		} catch {
			// Private mode, blocked storage or corrupt data: start fresh.
			return [];
		}
	}

	save(foundSlugs: string[]): void {
		try {
			localStorage.setItem(KEY, JSON.stringify(foundSlugs));
		} catch {
			// Progress is a convenience; losing it must not break the game.
		}
	}
}

export class MemoryProgressStore implements ProgressStore {
	#found: string[] = [];
	load() {
		return [...this.#found];
	}
	save(foundSlugs: string[]) {
		this.#found = [...foundSlugs];
	}
}
