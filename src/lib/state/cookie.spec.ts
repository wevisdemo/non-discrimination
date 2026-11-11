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
			// Max-Age=0 expires the cookie, as in a browser
			if (line.includes('Max-Age=0')) jar.delete(pair.slice(0, eq));
			else jar.set(pair.slice(0, eq), pair.slice(eq + 1));
		}
	});
	return { jar, written };
}

/** The site only writes cookies once the banner has been answered with yes */
const allowCookies = async () => (await import('./consent.ts')).setFunctionality(true);

beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllGlobals());

describe('the cookie helpers', () => {
	it('scope the cookie to the site path, for a year, SameSite=Lax and Secure on https', async () => {
		const { written } = fakeBrowser('https:');
		await allowCookies();
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
		await allowCookies();
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
		await allowCookies();
		const { readCookie, writeCookie } = await import('./cookie.ts');
		expect(readCookie('nd-test')).toBeUndefined();
		expect(() => writeCookie('nd-test', '1')).not.toThrow();
	});
});

describe('CookiePollStore', () => {
	const CHOICES = ['experienced', 'witnessed', 'heard', 'never'] as const;

	it('remembers one answer per poll in a single cookie', async () => {
		const { jar } = fakeBrowser();
		await allowCookies();
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
		await allowCookies();
		const { CookiePollStore } = await import('./poll.ts');
		const cases = new CookiePollStore('nd-poll', CHOICES);
		const law = new CookiePollStore('nd-law-poll', ['agree', 'unnecessary', 'disagree'] as const);
		law.save('law', 'agree');
		expect(law.load('law')).toBe('agree');
		expect(cases.load('law')).toBeUndefined();
	});

	it('ignores choices it does not know, as a tampered cookie might hold', async () => {
		const { jar } = fakeBrowser();
		await allowCookies();
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
		await allowCookies();
		const { CookieSurveyStore } = await import('./survey.ts');
		const store = new CookieSurveyStore();
		expect(store.submitted()).toBe(false);
		expect(await store.submit({ age: '18-35 ปี' })).toBe(true);
		expect(store.submitted()).toBe(true);
		expect(jar.get('nd-survey')).toBe('1');
		expect(new CookieSurveyStore().submitted()).toBe(true);
	});

	it('keeps the choices made so far, so a refresh shows them again', async () => {
		const { jar } = fakeBrowser();
		await allowCookies();
		const { CookieSurveyStore } = await import('./survey.ts');
		const store = new CookieSurveyStore();
		expect(store.answers()).toEqual({});
		store.saveAnswers({ age: '18-35 ปี', province: 'เชียงใหม่', satisfaction: 4 });
		expect(jar.has('nd-survey-answers')).toBe(true);
		expect(new CookieSurveyStore().answers()).toEqual({
			age: '18-35 ปี',
			province: 'เชียงใหม่',
			satisfaction: 4
		});
		// Choosing again replaces, and an emptied field is dropped
		store.saveAnswers({ age: '36-60 ปี', province: undefined });
		expect(store.answers()).toEqual({ age: '36-60 ปี' });
	});

	it('keeps the choices after the survey is sent too', async () => {
		fakeBrowser();
		await allowCookies();
		const { CookieSurveyStore } = await import('./survey.ts');
		const store = new CookieSurveyStore();
		const answers = { gender: 'หญิง', satisfaction: 5 };
		store.saveAnswers(answers);
		await store.submit(answers);
		expect(store.submitted()).toBe(true);
		expect(store.answers()).toEqual(answers);
	});

	it('ignores anything in the cookie that is not one of the options', async () => {
		const { jar } = fakeBrowser();
		await allowCookies();
		const { CookieSurveyStore } = await import('./survey.ts');
		const tampered = { age: '999 ปี', gender: 'หญิง', province: 7, satisfaction: 9, extra: 'x' };
		jar.set('nd-survey-answers', encodeURIComponent(JSON.stringify(tampered)));
		expect(new CookieSurveyStore().answers()).toEqual({ gender: 'หญิง' });
		jar.set('nd-survey-answers', encodeURIComponent('not json{'));
		expect(new CookieSurveyStore().answers()).toEqual({});
	});

	it('fits in one cookie even with the longest options chosen', async () => {
		const { written } = fakeBrowser();
		await allowCookies();
		const { CookieSurveyStore } = await import('./survey.ts');
		const { AGES, GENDERS, OCCUPATIONS, PROVINCES } = await import('#lib/content/survey.ts');
		const longest = (list: readonly string[]) => [...list].sort((a, b) => b.length - a.length)[0];
		new CookieSurveyStore().saveAnswers({
			age: longest(AGES),
			gender: longest(GENDERS),
			occupation: longest(OCCUPATIONS),
			province: longest(PROVINCES),
			satisfaction: 5
		});
		// Browsers keep about 4096 bytes per cookie
		expect(written.at(-1)!.length).toBeLessThan(2000);
	});
});

describe("the cookie banner's choice", () => {
	it('writes nothing until the visitor has said yes', async () => {
		const { jar } = fakeBrowser();
		const { writeCookie, applyConsent } = await import('./cookie.ts');
		writeCookie('nd-test', '1');
		expect(jar.size).toBe(0);
		applyConsent({ Functionality: true });
		writeCookie('nd-test', '1');
		expect(jar.size).toBe(1);
	});

	it('counts only an explicit Functionality yes', async () => {
		const { jar } = fakeBrowser();
		const { writeCookie, applyConsent } = await import('./cookie.ts');
		for (const chosen of [{}, { Functionality: false }, { Performance: true }]) {
			applyConsent(chosen);
			writeCookie('nd-test', '1');
		}
		expect(jar.size).toBe(0);
	});

	it("removes the site's cookies, and only those, once the answer is no", async () => {
		const { written } = fakeBrowser();
		const { applyConsent, COOKIES } = await import('./cookie.ts');
		applyConsent({ Functionality: false });
		const expired = written
			.filter((line) => line.includes('Max-Age=0'))
			.map((l) => l.split('=')[0]);
		expect(expired.sort()).toEqual(Object.values(COOKIES).sort());
		expect(written.every((line) => line.includes('Path=/non-discrimination'))).toBe(true);
	});

	it('keeps them when the answer is yes', async () => {
		const { written } = fakeBrowser();
		const { applyConsent } = await import('./cookie.ts');
		applyConsent({ Functionality: true });
		expect(written).toEqual([]);
	});
});
