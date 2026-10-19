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
	await page
		.getByRole('button', { name: 'กรณี: นักเรียนมุสลิมถูกห้ามคลุมฮิญาบมาโรงเรียนในเขตวัด' })
		.click();

	const dialog = page.getByRole('dialog', {
		name: 'นักเรียนมุสลิมถูกห้ามคลุมฮิญาบมาโรงเรียนในเขตวัด'
	});
	await expect(
		dialog.getByRole('heading', { name: 'นักเรียนมุสลิมถูกห้ามคลุมฮิญาบมาโรงเรียนในเขตวัด' })
	).toBeVisible();
	await expect(page).toHaveURL(/\/cases\/hijab-school\/?$/);

	await page.goBack();
	await expect(dialog).toBeHidden();
	// The map overlay is still up underneath, with a check on the found case
	await expect(page.getByText('พบแล้ว 1/18 เคส')).toBeVisible();
	await expect(page.locator('#explore button[aria-label$="(พบแล้ว)"] svg')).toHaveCount(1);
});

test('hints list every case to look for', async ({ page }) => {
	await page.goto('/#explore');
	await page.getByRole('button', { name: 'เปิดตัวช่วย' }).click();
	const hints = page.getByRole('region', { name: '18 การเลือกปฏิบัติมีอะไรบ้าง ?' });
	await expect(hints.getByRole('listitem')).toHaveCount(18);
	await expect(hints.getByRole('listitem').first()).toHaveText(
		'กลุ่มอินฟลูเอนเซอร์ทำร้ายชาวกะเหรี่ยง'
	);
});

test('reveal tags each case with its causes', async ({ page }) => {
	await page.goto('/#explore');
	await page.getByRole('button', { name: 'เฉลยตำแหน่งภาพ' }).click();
	// One tag per cause across the 18 cases (the intersex case has two)
	await expect(page.locator('#explore ul[aria-hidden="true"] li')).toHaveCount(19);
});

test('เจาะดูทีละภาพ steps through the cases in datasheet order', async ({ page }) => {
	await page.goto('/#explore');
	await page.getByRole('button', { name: 'เจาะดูทีละภาพ' }).click();
	// The map overlay is a dialog too; the case panel is the one with ‹ ›
	const card = page
		.getByRole('dialog')
		.filter({ has: page.getByRole('button', { name: 'เคสถัดไป' }) });
	await expect(card.getByRole('heading', { level: 2 })).toHaveText(
		'กลุ่มอินฟลูเอนเซอร์ทำร้ายชาวกะเหรี่ยง'
	);
	await expect(card.getByText('1/18')).toBeVisible();
	await expect(card.getByRole('button', { name: 'เคสก่อนหน้า' })).toBeDisabled();
	await expect(page.getByRole('button', { name: 'เจาะดูทีละภาพ' })).toHaveAttribute(
		'aria-pressed',
		'true'
	);

	await card.getByRole('button', { name: 'เคสถัดไป' }).click();
	await expect(card.getByText('2/18')).toBeVisible();
	await expect(page).toHaveURL(/\/cases\/social-security\/?$/);

	// ‹ › replace the card, so one Back closes the panel
	await page.goBack();
	await expect(card).toBeHidden();
	await expect(page).toHaveURL(/#explore$/);
});

test('แนะนำการสำรวจ opens the map with a four-step tutorial', async ({ page }) => {
	await page.goto('/#definition');
	await page.locator('#definition').getByRole('link', { name: 'แนะนำการสำรวจ' }).click();
	await expect(page).toHaveURL(/#explore-tutorial$/);
	const tutorial = page.getByRole('dialog', { name: /มาดูกันว่าปุ่มต่าง ๆ/ });
	await expect(tutorial).toBeVisible();

	for (const [n, title] of [
		[1, 'ตัวช่วย'],
		[2, 'เฉลยตำแหน่งภาพ'],
		[3, 'เจาะดูทีละภาพ'],
		[4, 'ออกจากการสำรวจ']
	] as const) {
		await page.getByRole('button', { name: 'ถัดไป' }).click();
		const tip = page.getByRole('dialog', { name: title });
		await expect(tip.getByText(`${n}/4`)).toBeVisible();
	}
	// The controls not being explained are dimmed and inert
	await expect(page.locator('[data-tutorial="reveal"]')).toHaveCSS('opacity', '0.2');

	await page.getByRole('button', { name: 'ถัดไป' }).click();
	await page.getByRole('button', { name: 'เริ่มสำรวจ!' }).click();
	await expect(page).toHaveURL(/#explore$/);
	await expect(page.locator('[data-tutorial="reveal"]')).toHaveCSS('opacity', '1');
	await expect(page.getByRole('button', { name: 'ถัดไป' })).toHaveCount(0);
});

test('the tutorial can be skipped', async ({ page }) => {
	await page.goto('/#explore-tutorial');
	await page.getByRole('button', { name: 'ข้าม', exact: true }).click();
	await expect(page).toHaveURL(/#explore$/);
	await expect(page.getByRole('button', { name: 'เปิดตัวช่วย' })).toBeVisible();
});

test('อ่านเนื้อหาเต็ม opens the three-tab panel from KP1 and from the map', async ({ page }) => {
	await page.goto('/');
	await page.locator('[data-step="stereotype"]').scrollIntoViewIfNeeded();
	await page.getByRole('button', { name: 'อ่านเนื้อหาเต็ม' }).click();
	const panel = page.getByRole('dialog', { name: 'อ่านเนื้อหาเต็ม' });
	await expect(
		panel.getByRole('heading', { name: 'การเลือกปฏิบัติ (Discrimination)' })
	).toBeVisible();

	await panel.getByRole('tab', { name: /ใครมักถูก/ }).click();
	await expect(panel.getByRole('heading', { name: 'ผู้ถูกเลือกปฏิบัติ' })).toBeVisible();
	await panel.getByRole('tab', { name: /กรณีที่/ }).click();
	await expect(panel.getByRole('button', { name: 'การเข้าถึงการรักษาพยาบาล' })).toHaveAttribute(
		'aria-expanded',
		'true'
	);
	// From KP1 the panel ends with a way into the map
	await panel.getByRole('link', { name: 'ไปที่หน้าสำรวจ' }).click();
	await expect(page).toHaveURL(/#explore$/);
	await expect(panel).toBeHidden();

	await page.getByRole('button', { name: 'อ่านเนื้อหาเต็ม' }).click();
	await expect(panel).toBeVisible();
	await expect(panel.getByRole('link', { name: 'ไปที่หน้าสำรวจ' })).toHaveCount(0);
	await page.keyboard.press('Escape');
	await expect(panel).toBeHidden();
});

test('the case card poll remembers the answer', async ({ page }) => {
	await page.goto('/cases/karen/');
	const answer = page.getByRole('button', { name: 'เคยเห็นกับตา' });
	await answer.click();
	await expect(answer).toHaveAttribute('aria-pressed', 'true');
	await page.reload();
	await expect(page.getByRole('button', { name: 'เคยเห็นกับตา' })).toHaveAttribute(
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
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		'นักเรียนมุสลิมถูกห้ามคลุมฮิญาบมาโรงเรียนในเขตวัด'
	);
	// The card design has no link to the definitions; they are still prerendered pages
	await page.goto('/definition/religion/');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
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
