/**
 * What the visitor chose in the cookie banner (@wevisdemo/ui's cookie-consent), which reports it on
 * every page load, from its own saved choice or after they answer. The site's cookies are the
 * "Functionality" ones: until the banner says yes, none is written (see cookie.ts).
 */
export const COOKIE_OPTIONS = ['Functionality'];

let functionality = false;

export const allowsCookies = () => functionality;

export function setFunctionality(allowed: boolean) {
	functionality = allowed;
}
