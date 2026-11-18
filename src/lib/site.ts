/**
 * Where the site is published, for the absolute URLs link previews need (og:image). Defaults to
 * GitHub Pages of the wevisdemo organisation; to publish on another domain, build with
 * `VITE_SITE_ORIGIN=https://example.org` (and `BASE_PATH` if it is not at the root).
 */
export const SITE_ORIGIN = String(
	import.meta.env.VITE_SITE_ORIGIN || 'https://wevisdemo.github.io'
).replace(/\/+$/, '');
