import { resolve } from '$app/paths';
import { allowsCookies, setFunctionality } from './consent.ts';

/**
 * The few cookies the site sets, to remember that this browser has already voted or answered the
 * survey, plus a random id for this browser (`visitorId`). They hold nothing else about the visitor, last a year, and are scoped to the site's own path:
 * wevisdemo.github.io serves other projects on the same host, which must not see or clear them.
 * They are "Functionality" cookies in the cookie banner's terms, so nothing is written until the
 * visitor has accepted them (consent.ts), and they are removed again if they decline.
 */
export const COOKIES = {
	caseVotes: 'nd-poll',
	lawVote: 'nd-law-poll',
	surveySent: 'nd-survey',
	surveyAnswers: 'nd-survey-answers',
	visitor: 'nd-visitor'
} as const;
const ONE_YEAR_S = 60 * 60 * 24 * 365;

/** `/non-discrimination` on GitHub Pages, `/` in dev and in the tests */
const path = () => resolve('/').replace(/(.)\/$/, '$1');

export function readCookie(name: string): string | undefined {
	try {
		for (const part of document.cookie.split('; ')) {
			const eq = part.indexOf('=');
			if (eq > 0 && part.slice(0, eq) === name) return decodeURIComponent(part.slice(eq + 1));
		}
	} catch {
		// Cookies blocked: act as if nothing was remembered
	}
	return undefined;
}

export function writeCookie(name: string, value: string) {
	if (!allowsCookies()) return;
	try {
		const secure = location.protocol === 'https:' ? '; Secure' : '';
		document.cookie = `${name}=${encodeURIComponent(value)}; Path=${path()}; Max-Age=${ONE_YEAR_S}; SameSite=Lax${secure}`;
	} catch {
		// Remembering is a nicety; blocked cookies must not break the page
	}
}

/**
 * A random id for this browser, sent with every vote and the survey so one visitor's rows can be
 * matched. It is made only once cookies are allowed; until then (or if they are blocked) there is none.
 */
export function visitorId(): string | undefined {
	const saved = readCookie(COOKIES.visitor);
	if (saved) return saved;
	if (!allowsCookies()) return undefined;
	try {
		const id = crypto.randomUUID();
		writeCookie(COOKIES.visitor, id);
		return id;
	} catch {
		// randomUUID needs a secure context; without it there is no id, not a broken page
		return undefined;
	}
}

/** Remove every cookie the site has set, for a visitor who has declined them */
export function clearCookies() {
	try {
		const secure = location.protocol === 'https:' ? '; Secure' : '';
		for (const name of Object.values(COOKIES)) {
			document.cookie = `${name}=; Path=${path()}; Max-Age=0; SameSite=Lax${secure}`;
		}
	} catch {
		// Nothing to remove if cookies are blocked
	}
}

/** The banner's `onAccept`: `{ Functionality: true }` after "Accept all", or whatever was ticked */
export function applyConsent(chosen: Record<string, boolean | undefined>) {
	setFunctionality(chosen.Functionality === true);
	// Having said no, the site keeps nothing from earlier visits either
	if (!allowsCookies()) clearCookies();
}
