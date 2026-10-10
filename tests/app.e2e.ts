import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('intro links to the map', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('ไม่เลือกปฏิบัติ');
	await page.getByRole('link', { name: 'เริ่มสำรวจเมือง' }).click();
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

for (const path of ['/', '/explore/', '/cases/', '/cases/karen/', '/definition/age/']) {
	test(`no axe violations on ${path}`, async ({ page }) => {
		await page.goto(path);
		const { violations } = await new AxeBuilder({ page }).analyze();
		expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
	});
}
