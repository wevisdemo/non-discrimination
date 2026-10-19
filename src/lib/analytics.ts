export type AnalyticsEvent =
	| { name: 'case_found'; slug: string }
	| { name: 'case_opened'; slug: string }
	| { name: 'mode_changed'; mode: string }
	| { name: 'definition_viewed'; cause: string }
	| { name: 'poll_answered'; slug: string; choice: string };

/** No-op until an analytics provider is chosen (M5). Call sites stay the same. */
export function trackEvent(event: AnalyticsEvent): void {
	if (import.meta.env.DEV) console.debug('[analytics]', event);
}
