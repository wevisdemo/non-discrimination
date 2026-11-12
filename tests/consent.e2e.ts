import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Unlike the other e2e files, nothing here is answered in advance: these are the first visit.
const banner = (page: import('@playwright/test').Page) => page.getByText('เว็บไซต์นี้ใช้คุกกี้');
const ourCookies = async (page: import('@playwright/test').Page) =>
	(await page.context().cookies()).filter((c) => c.name.startsWith('nd-')).map((c) => c.name);

async function voteOnKaren(page: import('@playwright/test').Page) {
	await page.goto('/cases/karen/');
	await page.getByRole('button', { name: 'เคยเห็นกับตา' }).click();
	await expect(page.getByRole('button', { name: 'เคยเห็นกับตา' })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
}

test('the WeVis cookie banner asks on a first visit and links to the cookie policy', async ({
	page
}) => {
	await page.goto('/');
	await expect(banner(page)).toBeVisible();
	await expect(page.getByRole('link', { name: 'นโยบายคุกกี้' })).toHaveAttribute(
		'href',
		'https://wevis.info/cookies_1-2-3-4/'
	);
	await expect(page.getByRole('button', { name: 'การตั้งค่าคุกกี้' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'ยอมรับทั้งหมด' })).toBeVisible();
});

test('no cookie of the site is written before the banner is answered', async ({ page }) => {
	await voteOnKaren(page);
	await expect(banner(page)).toBeVisible();
	expect(await ourCookies(page)).toEqual([]);
});

test('accepting all lets the site remember votes, and the banner does not return', async ({
	page
}) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'ยอมรับทั้งหมด' }).click();
	await expect(banner(page)).toBeHidden();

	await voteOnKaren(page);
	expect(await ourCookies(page)).toContain('nd-poll');
	await page.reload();
	await expect(banner(page)).toHaveCount(0);
	await expect(page.getByRole('button', { name: 'เคยเห็นกับตา' })).toBeDisabled();
});

test('declining in the settings keeps the site from writing cookies', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'การตั้งค่าคุกกี้' }).click();
	await expect(page.getByText('Strictly Necessary Cookies')).toBeVisible();
	await expect(page.getByText('Functionality Cookies')).toBeVisible();
	await page.getByRole('button', { name: 'บันทึกการตั้งค่า' }).click();
	await expect(banner(page)).toBeHidden();

	await voteOnKaren(page);
	expect(await ourCookies(page)).toEqual([]);
});

test("a visitor who accepted and later declines has the site's cookies removed", async ({
	page
}) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'ยอมรับทั้งหมด' }).click();
	await voteOnKaren(page);
	expect(await ourCookies(page)).toContain('nd-poll');

	await page.evaluate(() => localStorage.setItem('cookieSetting', '{"Functionality":false}'));
	await page.reload();
	await expect(page.getByRole('button', { name: 'เคยเห็นกับตา' })).toBeVisible();
	// The banner reports the saved answer once the page has hydrated, which is when they go
	await expect.poll(() => ourCookies(page)).toEqual([]);
});

test('the banner has no accessibility violations', async ({ page }) => {
	await page.goto('/');
	await expect(banner(page)).toBeVisible();
	const { violations } = await new AxeBuilder({ page }).include('.wv_cookie-consent').analyze();
	expect(
		violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html.slice(0, 80)).join(' | ')}`)
	).toEqual([]);
});
