// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			/** Set by shallow routing when a case card is opened over the map */
			caseSlug?: string;
			/** Opened with เจาะดูทีละภาพ: stepping through the cases with ‹ › */
			stepping?: boolean;
		}
		// interface Platform {}
	}
}

declare global {
	interface Window {
		/** Plausible's tracker (src/app.html); absent until it loads or if it is blocked */
		plausible?: (name: string, options?: { props?: Record<string, string> }) => void;
	}
}

export {};
