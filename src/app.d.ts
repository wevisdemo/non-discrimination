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
		}
		// interface Platform {}
	}
}

export {};
