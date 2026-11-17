export type AnalyticsEvent =
	| { name: 'case_found'; slug: string }
	| { name: 'case_opened'; slug: string }
	| { name: 'mode_changed'; mode: string }
	| { name: 'definition_viewed'; cause: string }
	| { name: 'poll_answered'; slug: string; choice: string }
	| { name: 'survey_submitted' };

/** Sends the event to Plausible, with everything but the name as its props. Safe if it is blocked. */
export function trackEvent(event: AnalyticsEvent): void {
	if (import.meta.env.DEV) console.debug('[analytics]', event);
	const { name, ...props } = event;
	try {
		window.plausible?.(name, Object.keys(props).length ? { props } : undefined);
	} catch {
		// Analytics must never break the page
	}
}
