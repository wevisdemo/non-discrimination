import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

test('intro scrolls through its steps and can be skipped', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		/คุณเห็น.*ความผิดปกติ.*ในภาพนี้หรือไม่/
	);
	await expect(page.getByRole('button', { name: /^Intro/ })).toBeVisible();

	await page.getByRole('link', { name: 'ข้ามส่วนเกริ่น' }).click();
	await expect(page).toHaveURL(/#explore$/);
	await expect(page.getByRole('button', { name: /^สืบหา 18/ })).toBeVisible();
	await expect(page.getByRole('link', { name: 'ข้ามส่วนเกริ่น' })).toBeHidden();
});

test('intro continues to KP1, which ends by starting the game', async ({ page }) => {
	await page.goto('/');
	await page.locator('#intro').getByRole('link', { name: 'คลิกเพื่อดูต่อ' }).click();
	await expect(page).toHaveURL(/#definition$/);
	await expect(page.getByText('ภาพจำที่ลดคุณค่า')).toBeVisible();

	const mission = page.getByRole('heading', { name: /สืบหา 18 การเลือกปฏิบัติ/ }).first();
	await mission.scrollIntoViewIfNeeded();
	await expect(mission).toBeVisible();
	await page.getByRole('link', { name: 'สำรวจเลย !' }).click();
	await expect(page).toHaveURL(/#explore$/);
});

test('KP1 can continue on to the causes section', async ({ page }) => {
	await page.goto('/#definition');
	await page.locator('#definition').getByRole('link', { name: 'คลิกเพื่อดูต่อ' }).click();
	await expect(page).toHaveURL(/#causes$/);
});

const menuLabels = [
	'Intro',
	'คำนิยามสั้น ๆ ของการเลือกปฏิบัติ',
	'สืบหา 18 การเลือกปฏิบัติที่ซ่อนอยู่',
	'สาเหตุที่ยังพบเห็นการเลือกปฏิบัติ',
	'บทสรุป',
	'เกี่ยวกับโครงการ'
];

test('stage menu lists all six sections and scrolls to the chosen one', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: /^Intro/ }).click();
	const menu = page.locator('#stage-menu');
	await expect(menu.getByRole('link')).toHaveText(menuLabels);

	await menu.getByRole('link', { name: 'บทสรุป' }).click();
	await expect(page).toHaveURL(/#summary$/);
	await expect(menu).toBeHidden();
	await expect(page.locator('#summary')).toBeInViewport();
});

test('the pill label follows the section being scrolled through', async ({ page }) => {
	await page.goto('/');
	const pill = page.getByRole('button', { name: /เมนู$/ });
	await expect(pill).toContainText('Intro');

	await page.locator('#about').scrollIntoViewIfNeeded();
	await expect(pill).toContainText('เกี่ยวกับโครงการ');

	await page.locator('#causes').scrollIntoViewIfNeeded();
	await expect(pill).toContainText('สาเหตุที่ยังพบเห็นการเลือกปฏิบัติ');

	await pill.click();
	await expect(
		page.locator('#stage-menu').getByRole('link', { name: 'สาเหตุที่ยังพบเห็นการเลือกปฏิบัติ' })
	).toHaveAttribute('aria-current', 'true');
});

test('stage menu closes with the ✕ button and with Escape', async ({ page }) => {
	await page.goto('/');
	const menu = page.locator('#stage-menu');

	await page.getByRole('button', { name: /^Intro/ }).click();
	await expect(menu).toBeVisible();
	await page.getByRole('button', { name: 'ปิดเมนู' }).click();
	await expect(menu).toBeHidden();

	await page.getByRole('button', { name: /^Intro/ }).click();
	await expect(menu).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(menu).toBeHidden();
});

test('stage menu on a case page links back into the single page', async ({ page }) => {
	await page.goto('/cases/karen/');
	await page.getByRole('button', { name: /^สืบหา 18/ }).click();
	await page.locator('#stage-menu').getByRole('link', { name: 'บทสรุป' }).click();
	await expect(page).toHaveURL(/\/#summary$/);
	await expect(page.locator('#summary')).toBeInViewport();
});

test('opening a case updates the URL, counts it as found, and back closes it', async ({ page }) => {
	await page.goto('/#explore');
	await page.getByRole('button', { name: 'กรณี: นักเรียนสวมฮิญาบ' }).click();

	const dialog = page.getByRole('dialog', { name: 'นักเรียนสวมฮิญาบ' });
	await expect(dialog.getByRole('heading', { name: 'นักเรียนสวมฮิญาบ' })).toBeVisible();
	await expect(page).toHaveURL(/\/cases\/hijab-school\/?$/);

	await page.goBack();
	await expect(dialog).toBeHidden();
	// The map overlay is still up underneath
	await expect(page.getByText('พบแล้ว 1/18 เคส')).toBeVisible();
});

test('hint mode filters hotspots by cause', async ({ page }) => {
	await page.goto('/#explore');
	await page.getByRole('button', { name: 'เปิดตัวช่วย' }).click();
	await page.getByRole('button', { name: 'ความเชื่อทางศาสนา' }).click();
	await expect(page.getByRole('button', { name: 'ความเชื่อทางศาสนา' })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
});

test('the map is a full-screen overlay opened by สำรวจเลย, not a section of the page', async ({
	page
}) => {
	await page.goto('/');
	await expect(page.locator('#explore')).toHaveCount(0);

	await page.locator('#definition').getByRole('link', { name: 'สำรวจเลย !' }).click();
	const map = page.getByRole('dialog', { name: 'สืบหา 18 การเลือกปฏิบัติที่ซ่อนอยู่' });
	await expect(map).toBeVisible();
	await expect(map).toBeInViewport({ ratio: 0.99 });
	// The sections behind it are inert, so Tab and screen readers can't reach them
	await expect(page.locator('div[inert] #definition')).toHaveCount(1);

	await page.getByRole('link', { name: 'ออกจากการสำรวจ' }).click();
	await expect(map).toBeHidden();
	await expect(page.locator('#causes')).toBeInViewport();

	await page.goBack();
	await expect(map).toBeVisible();
});

test('map controls: reveal, hints drawer and exit', async ({ page }) => {
	await page.goto('/#explore');
	const reveal = page.getByRole('button', { name: 'เฉลยตำแหน่งภาพ' });
	await reveal.click();
	await expect(reveal).toHaveAttribute('aria-pressed', 'true');
	await reveal.click();
	await expect(reveal).toHaveAttribute('aria-pressed', 'false');

	await page.getByRole('button', { name: 'เปิดตัวช่วย' }).click();
	await expect(page.getByRole('button', { name: 'ปิดตัวช่วย' })).toHaveAttribute(
		'aria-expanded',
		'true'
	);
	await page.getByRole('button', { name: 'ปิดตัวช่วย' }).click();
	await expect(page.getByRole('button', { name: 'เปิดตัวช่วย' })).toBeVisible();

	await page.getByRole('link', { name: 'ออกจากการสำรวจ' }).click();
	await expect(page).toHaveURL(/#causes$/);
});

test('case and definition pages are prerendered', async ({ page }) => {
	await page.goto('/cases/hijab-school/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('นักเรียนสวมฮิญาบ');
	await page.getByRole('link', { name: /อ่านนิยาม/ }).click();
	await expect(page).toHaveURL(/\/definition\/religion\/$/);
});

/**
 * Every axe rule, except colour contrast on story cards: their prototype blue-on-pink text is
 * 4.41:1 (AA needs 4.5:1), a trade-off the design team accepted. Contrast is still checked
 * everywhere else.
 */
async function axeViolations(page: Page) {
	// Axe can't run twice at once on a page, so these go one after the other
	const rest = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
	const contrast = await new AxeBuilder({ page })
		.withRules(['color-contrast'])
		.exclude('[data-story-card]')
		.analyze();
	return [...rest.violations, ...contrast.violations].map((v) => `${v.id}: ${v.help}`);
}

for (const path of ['/', '/cases/', '/cases/karen/', '/definition/age/']) {
	test(`no axe violations on ${path}`, async ({ page }) => {
		await page.goto(path);
		expect(await axeViolations(page)).toEqual([]);
	});
}
