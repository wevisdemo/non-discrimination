/* eslint-disable svelte/prefer-svelte-reactivity -- plain Sets below are rebuilt by $derived or
   are function-local; only `found` is mutated and it is a SvelteSet. */
import { SvelteSet } from 'svelte/reactivity';
import type { Case, CauseId } from '#lib/content/schema.ts';
import type { ProgressStore } from './progress.ts';

/** default = free exploration, hint = ใช้ตัวช่วย (cause filters), reveal = ดูเฉลย */
export type GameMode = 'default' | 'hint' | 'reveal';

export class Game {
	readonly cases: Case[];
	readonly found = new SvelteSet<string>();
	mode = $state<GameMode>('default');
	causeFilter = $state<CauseId | null>(null);

	readonly progress: number;
	readonly isComplete: boolean;
	/** Hotspots to highlight: all in reveal mode, filtered by cause in hint mode, none otherwise */
	readonly highlighted: Set<string>;

	#store: ProgressStore;

	constructor(cases: Case[], store: ProgressStore) {
		this.cases = cases;
		this.#store = store;
		// Assigned here (not as field initialisers) because they read `this.cases`.
		this.progress = $derived(cases.length ? this.found.size / cases.length : 0);
		this.isComplete = $derived(cases.length > 0 && this.found.size === cases.length);
		this.highlighted = $derived.by(() => {
			if (this.mode === 'reveal') return new Set(cases.map((c) => c.slug));
			if (this.mode === 'hint' && this.causeFilter) {
				const cause = this.causeFilter;
				return new Set(cases.filter((c) => c.causes.includes(cause)).map((c) => c.slug));
			}
			return new Set<string>();
		});
	}

	/** Load saved progress. Call from onMount so prerendered HTML and hydration match. */
	restore() {
		const known = new Set(this.cases.map((c) => c.slug));
		for (const slug of this.#store.load()) if (known.has(slug)) this.found.add(slug);
	}

	markFound(slug: string) {
		if (this.found.has(slug) || !this.cases.some((c) => c.slug === slug)) return;
		this.found.add(slug);
		this.#store.save([...this.found]);
	}

	setMode(mode: GameMode) {
		this.mode = mode;
		if (mode !== 'hint') this.causeFilter = null;
	}

	reset() {
		this.found.clear();
		this.setMode('default');
		this.#store.save([]);
	}
}
