import { resolve } from '$app/paths';

/**
 * The few cookies the site sets, to remember that this browser has already voted or answered the
 * survey. They hold nothing about the visitor, last a year, and are scoped to the site's own path:
 * wevisdemo.github.io serves other projects on the same host, which must not see or clear them.
 */
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
	try {
		const secure = location.protocol === 'https:' ? '; Secure' : '';
		document.cookie = `${name}=${encodeURIComponent(value)}; Path=${path()}; Max-Age=${ONE_YEAR_S}; SameSite=Lax${secure}`;
	} catch {
		// Remembering is a nicety; blocked cookies must not break the page
	}
}
