import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/paths', () => ({ resolve: () => '/non-discrimination/' }));

/** A tiny cookie jar behind `document.cookie`, keeping the last Set-Cookie line it was given */
function fakeBrowser(protocol = 'https:') {
	const jar = new Map<string, string>();
	const written: string[] = [];
	vi.stubGlobal('location', { protocol });
	vi.stubGlobal('document', {
		get cookie() {
			return [...jar].map(([k, v]) => `${k}=${v}`).join('; ');
		},
		set cookie(line: string) {
			written.push(line);
			const [pair] = line.split(';');
			const eq = pair.indexOf('=');
			jar.set(pair.slice(0, eq), pair.slice(eq + 1));
		}
	});
	return { jar, written };
}

beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllGlobals());

describe('the cookie helpers', () => {
	it('scope the cookie to the site path, for a year, SameSite=Lax and Secure on https', async () => {
		const { written } = fakeBrowser('https:');
		const { writeCookie, readCookie } = await import('./cookie.ts');
		writeCookie('nd-test', 'a b:c');
		expect(written[0]).toBe(
			'nd-test=a%20b%3Ac; Path=/non-discrimination; Max-Age=31536000; SameSite=Lax; Secure'
		);
		expect(readCookie('nd-test')).toBe('a b:c');
		expect(readCookie('other')).toBeUndefined();
	});

	it('leave Secure off on http (local development)', async () => {
		const { written } = fakeBrowser('http:');
		const { writeCookie } = await import('./cookie.ts');
		writeCookie('nd-test', '1');
		expect(written[0]).not.toContain('Secure');
	});

	it('do nothing, quietly, when cookies are blocked', async () => {
		vi.stubGlobal('location', { protocol: 'https:' });
		vi.stubGlobal('document', {
			get cookie(): string {
				throw new Error('blocked');
			},
			set cookie(_line: string) {
				throw new Error('blocked');
			}
		});
		const { readCookie, writeCookie } = await import('./cookie.ts');
		expect(readCookie('nd-test')).toBeUndefined();
		expect(() => writeCookie('nd-test', '1')).not.toThrow();
	});
});

describe('CookiePollStore', () => {
	const CHOICES = ['experienced', 'witnessed', 'heard', 'never'] as const;

	it('remembers one answer per poll in a single cookie', async () => {
		const { jar } = fakeBrowser();
		const { CookiePollStore } = await import('./poll.ts');
		const store = new CookiePollStore('nd-poll', CHOICES);
		expect(store.load('karen')).toBeUndefined();
		store.save('karen', 'heard');
		store.save('hijab-school', 'never');
		expect(store.load('karen')).toBe('heard');
		expect(store.load('hijab-school')).toBe('never');
		expect(store.load('hate-speech')).toBeUndefined();
		expect(jar.size).toBe(1);
		// a fresh store, as after a page reload, still knows
		expect(new CookiePollStore('nd-poll', CHOICES).load('karen')).toBe('heard');
	});

	it('keeps the KP3 poll apart from the case polls', async () => {
		fakeBrowser();
		const { CookiePollStore } = await import('./poll.ts');
		const cases = new CookiePollStore('nd-poll', CHOICES);
		const law = new CookiePollStore('nd-law-poll', ['agree', 'unnecessary', 'disagree'] as const);
		law.save('law', 'agree');
		expect(law.load('law')).toBe('agree');
		expect(cases.load('law')).toBeUndefined();
	});

	it('ignores choices it does not know, as a tampered cookie might hold', async () => {
		const { jar } = fakeBrowser();
		jar.set('nd-poll', encodeURIComponent('karen:heard|hijab-school:bogus|:witnessed|junk'));
		const { CookiePollStore } = await import('./poll.ts');
		const store = new CookiePollStore('nd-poll', CHOICES);
		expect(store.load('karen')).toBe('heard');
		expect(store.load('hijab-school')).toBeUndefined();
	});
});

describe('CookieSurveyStore', () => {
	it('knows the survey was answered once the cookie is set, without a backend', async () => {
		const { jar } = fakeBrowser();
		const { CookieSurveyStore } = await import('./survey.ts');
		const store = new CookieSurveyStore();
		expect(store.submitted()).toBe(false);
		expect(await store.submit({ age: '18-35 ปี' })).toBe(true);
		expect(store.submitted()).toBe(true);
		expect(jar.get('nd-survey')).toBe('1');
		expect(new CookieSurveyStore().submitted()).toBe(true);
	});
});
