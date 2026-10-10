import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('intro scrolls through its steps and can be skipped', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		/คุณเห็น.*ความผิดปกติ.*ในภาพนี้หรือไม่/
	);
	await expect(page.getByRole('button', { name: /^Intro/ })).toBeVisible();

	await page.getByRole('link', { name: 'ข้ามส่วนเกริ่น' }).click();
	await expect(page).toHaveURL(/\/explore\/$/);
});

test('intro continues to KP1, which ends by starting the game', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'คลิกเพื่อดูต่อ' }).click();
	await expect(page).toHaveURL(/\/what-is-discrimination\/$/);
	await expect(page.getByText('ภาพจำที่ลดคุณค่า')).toBeVisible();

	const mission = page.getByRole('heading', { name: /สืบหา 18 การเลือกปฏิบัติ/ });
	await mission.scrollIntoViewIfNeeded();
	await expect(mission).toBeVisible();
	await page.getByRole('link', { name: 'สำรวจเลย !' }).click();
	await expect(page).toHaveURL(/\/explore\/$/);
});

test('stage menu lists the built stages', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: /^Intro/ }).click();
	await page.getByRole('link', { name: 'สืบหา 18 การเลือกปฏิบัติที่ซ่อนอยู่' }).click();
	await expect(page).toHaveURL(/\/explore\/$/);
});

test('opening a case updates the URL, counts it as found, and back closes it', async ({ page }) => {
	await page.goto('/explore/');
	await page.getByRole('button', { name: 'กรณี: นักเรียนสวมฮิญาบ' }).click();

	const dialog = page.getByRole('dialog');
	await expect(dialog.getByRole('heading', { name: 'นักเรียนสวมฮิญาบ' })).toBeVisible();
	await expect(page).toHaveURL(/\/cases\/hijab-school\/?$/);

	await page.goBack();
	await expect(dialog).toBeHidden();
	await expect(page.getByText('พบแล้ว 1/18 เคส')).toBeVisible();
});

test('hint mode filters hotspots by cause', async ({ page }) => {
	await page.goto('/explore/');
	await page.getByRole('button', { name: 'ใช้ตัวช่วย' }).click();
	await page.getByRole('button', { name: 'ความเชื่อทางศาสนา' }).click();
	await expect(page.getByRole('button', { name: 'ความเชื่อทางศาสนา' })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
});

test('case and definition pages are prerendered', async ({ page }) => {
	await page.goto('/cases/hijab-school/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('นักเรียนสวมฮิญาบ');
	await page.getByRole('link', { name: /อ่านนิยาม/ }).click();
	await expect(page).toHaveURL(/\/definition\/religion\/$/);
});

for (const path of [
	'/',
	'/what-is-discrimination/',
	'/explore/',
	'/cases/',
	'/cases/karen/',
	'/definition/age/'
]) {
	test(`no axe violations on ${path}`, async ({ page }) => {
		await page.goto(path);
		const { violations } = await new AxeBuilder({ page }).analyze();
		expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
	});
}
