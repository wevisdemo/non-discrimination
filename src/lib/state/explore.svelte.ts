import { page } from '$app/state';

/**
 * The map game (KP2) is a full-screen overlay on the single page, not a section of it. It is open
 * while the URL hash is `#explore`, and stays open under a case card (whose shallow route drops
 * the hash), so every `#explore` link keeps working and Back closes it.
 */
class ExploreOverlay {
	/** Set after hydration: `url.hash` is client-only, and the prerendered page has it closed. */
	ready = $state(false);

	get open() {
		return this.ready && (page.url.hash === '#explore' || !!page.state.caseSlug);
	}
}

export const explore = new ExploreOverlay();
