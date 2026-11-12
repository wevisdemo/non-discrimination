import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// The cookie banner has been answered (yes) in advance, as by a returning visitor; consent.e2e.ts
// is the first visit
test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.setItem('cookieSetting', '{"Functionality":true}');
		localStorage.setItem('cookieSettingExpireAt', String(Date.now() + 30 * 24 * 3600 * 1000));
	});
});

test('intro scrolls through its steps and can be skipped to the title', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		/คุณเห็น.*ความผิดปกติ.*ในภาพนี้หรือไม่/
	);
	await expect(page.getByRole('button', { name: /^Intro/ })).toBeVisible();

	await page.getByRole('link', { name: 'ข้ามส่วนเกริ่น' }).click();
	await expect(page).toHaveURL(/#intro-title$/);
	await expect(page.locator('#intro-title').getByText('ตระหนัก เข้าใจ')).toBeInViewport();
	// Nothing left to skip once you are there
	await expect(page.getByRole('link', { name: 'ข้ามส่วนเกริ่น' })).toBeHidden();
});

test('the scroll hints are plain text, and KP1 ends by starting the game', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('#intro').getByText('เลื่อนลงเพื่อดูต่อ')).toHaveCount(1);
	// Scrolling moves on by itself, so the hint is not something to click
	await expect(page.getByRole('link', { name: 'เลื่อนลงเพื่อดูต่อ' })).toHaveCount(0);
	await page.locator('#definition').getByText('ภาพจำที่ลดคุณค่า').scrollIntoViewIfNeeded();
	await expect(page.locator('#definition').getByText('ภาพจำที่ลดคุณค่า')).toBeVisible();

	const mission = page.getByRole('heading', { name: /สืบหา 18 การเลือกปฏิบัติ/ }).first();
	await mission.scrollIntoViewIfNeeded();
	await expect(mission).toBeVisible();
	await page.getByRole('link', { name: 'สำรวจเลย !' }).click();
	await expect(page).toHaveURL(/#explore$/);
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

test('found cases last for the visit, and a refresh starts the search again', async ({ page }) => {
	// Progress an earlier version saved in the browser is not read any more
	await page.addInitScript(() =>
		localStorage.setItem('non-discrimination:found', JSON.stringify(['karen', 'hijab-school']))
	);
	await page.goto('/#explore');
	await expect(page.getByText('พบแล้ว 0/18 เคส')).toBeVisible();
	await expect(page.locator('#explore button[aria-label$="(พบแล้ว)"] svg')).toHaveCount(0);

	await page
		.getByRole('button', { name: 'กรณี: นักเรียนมุสลิมถูกห้ามคลุมฮิญาบมาโรงเรียนในเขตวัด' })
		.click();
	await page.goBack();
	await expect(page.getByText('พบแล้ว 1/18 เคส')).toBeVisible();
	await expect(page.locator('#explore button[aria-label$="(พบแล้ว)"] svg')).toHaveCount(1);

	// A refresh clears the check marks and the counter, so it can be found again
	await page.reload();
	await expect(page.getByText('พบแล้ว 0/18 เคส')).toBeVisible();
	await expect(page.locator('#explore button[aria-label$="(พบแล้ว)"] svg')).toHaveCount(0);
	await page
		.getByRole('button', { name: 'กรณี: นักเรียนมุสลิมถูกห้ามคลุมฮิญาบมาโรงเรียนในเขตวัด' })
		.click();
	await page.goBack();
	await expect(page.getByText('พบแล้ว 1/18 เคส')).toBeVisible();
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

	// Where cases crowd together the tags must not pile up
	const groups = await page
		.locator('#explore ul[aria-hidden="true"]')
		.evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
	expect(groups).toHaveLength(18);
	for (let i = 0; i < groups.length; i++) {
		for (let j = i + 1; j < groups.length; j++) {
			const a = groups[i];
			const b = groups[j];
			const clash = a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
			expect(clash, `tags ${i} and ${j} overlap`).toBe(false);
		}
	}
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
	await expect(page.getByRole('button', { name: 'เจาะดูทีละภาพ' })).toHaveAttribute(
		'aria-pressed',
		'true'
	);

	await card.getByRole('button', { name: 'เคสถัดไป' }).click();
	await expect(card.getByText('2/18')).toBeVisible();
	await expect(page).toHaveURL(/\/cases\/social-security\/?$/);

	// ‹ › loop: before the first case comes the last, after the last the first
	await card.getByRole('button', { name: 'เคสก่อนหน้า' }).click();
	await expect(card.getByText('1/18')).toBeVisible();
	await card.getByRole('button', { name: 'เคสก่อนหน้า' }).click();
	await expect(card.getByText('18/18')).toBeVisible();
	await card.getByRole('button', { name: 'เคสถัดไป' }).click();
	await expect(card.getByText('1/18')).toBeVisible();

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

test('each tutorial step is a box of its own, with a box-shadow and no filter', async ({
	page
}) => {
	// Safari on iPad left the first box's shadow painted when one element moved between steps;
	// that came from a filter drop-shadow on an element that changed how it is positioned
	await page.goto('/#explore-tutorial');
	const box = page.locator('[role="dialog"][aria-labelledby="tutorial-title"]');
	for (let step = 0; step <= 4; step++) {
		await expect(box).toHaveCount(1);
		await expect(box).toHaveCSS('filter', 'none');
		await expect(box).not.toHaveCSS('box-shadow', 'none');
		// Mark this step's box; the next step must not be the same element
		await box.evaluate((el) => (el.dataset.step = 'seen'));
		// The primary button has the focus, step after step
		await expect(box.locator('[data-primary]')).toBeFocused();
		if (step === 4) break;
		await page.getByRole('button', { name: 'ถัดไป' }).click();
		await expect(box).not.toHaveAttribute('data-step', 'seen');
	}
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

test('KP3 explains why discrimination persists and asks about a dedicated law', async ({
	page
}) => {
	await page.goto('/#causes');
	const kp3 = page.locator('#causes');
	await expect(
		kp3.getByRole('heading', { name: 'เราทุกคนมีสิทธิที่จะไม่ถูกเลือกปฏิบัติ' })
	).toBeVisible();
	await expect(page.getByRole('button', { name: 'อ่านเนื้อหาเต็ม' })).toBeVisible();
	await expect(kp3.getByRole('link', { name: /คลิกที่นี่/ })).toHaveAttribute(
		'href',
		'https://parliamentwatch.wevis.info/bills/explore?q=' +
			encodeURIComponent('ขจัดการเลือกปฏิบัติต่อบุคคล')
	);

	const agree = kp3.getByRole('button', { name: /^ดีเลย/ });
	// Percentages only appear once an option is picked (mock values until the poll backend)
	await expect(kp3.getByText('71.8%')).toHaveCount(0);
	await agree.click();
	await expect(agree).toHaveAttribute('aria-pressed', 'true');
	await expect(kp3.getByText('71.8%')).toBeVisible();
	await expect(kp3.getByText('ขอบคุณสำหรับความเห็น')).toBeVisible();
	await page.reload();
	await expect(page.locator('#causes').getByRole('button', { name: /^ดีเลย/ })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
});

test('the Result survey can be answered once', async ({ page }) => {
	await page.goto('/#summary');
	const survey = page.getByRole('form', { name: 'ขอบคุณที่อยู่ด้วยกันจนจบ !' });
	await survey.getByRole('button', { name: 'อายุ' }).click();
	await page.getByRole('option', { name: '18-35 ปี' }).click();
	const province = survey.getByRole('combobox', { name: 'จังหวัด' });
	await province.click();
	await province.fill('เชียง');
	await page.getByRole('option', { name: 'เชียงใหม่' }).click();
	await expect(province).toHaveValue('เชียงใหม่');
	await survey.getByRole('button', { name: 'พอใจมาก', exact: true }).click();
	await survey.getByRole('button', { name: 'ส่งคำตอบ' }).click();
	await expect(survey.getByText('ขอบคุณสำหรับคำตอบ')).toBeVisible();

	await page.reload();
	await expect(page.getByText('ขอบคุณสำหรับคำตอบ')).toBeVisible();
	// The button stays, greyed out, and cannot send it a second time
	await expect(survey.getByRole('button', { name: 'ส่งคำตอบ' })).toBeDisabled();
	// What was chosen is still shown, locked
	await expect(survey.getByRole('button', { name: 'อายุ' })).toHaveText('18-35 ปี');
	await expect(survey.getByRole('combobox', { name: 'จังหวัด' })).toHaveValue('เชียงใหม่');
	await expect(survey.getByRole('button', { name: 'พอใจมาก', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await expect(survey.getByRole('combobox', { name: 'จังหวัด' })).toBeDisabled();
});

test('the survey keeps the choices made so far through a refresh', async ({ page }) => {
	await page.goto('/#summary');
	const survey = page.getByRole('form', { name: 'ขอบคุณที่อยู่ด้วยกันจนจบ !' });
	await survey.getByRole('button', { name: 'เพศ' }).click();
	await page.getByRole('option', { name: 'หญิง' }).click();
	await survey.getByRole('button', { name: 'พอใจ', exact: true }).click();

	await page.reload();
	await expect(survey.getByRole('button', { name: 'เพศ' })).toHaveText('หญิง');
	await expect(survey.getByRole('button', { name: 'พอใจ', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	// Untouched fields stay empty, and it can still be sent
	await expect(survey.getByRole('button', { name: 'อายุ' })).toHaveText('เลือกอายุ');
	await expect(survey.getByRole('button', { name: 'ส่งคำตอบ' })).toBeVisible();
});

test("the survey's province field can be searched by typing", async ({ page }) => {
	await page.goto('/#summary');
	const province = page
		.getByRole('form', { name: 'ขอบคุณที่อยู่ด้วยกันจนจบ !' })
		.getByRole('combobox', { name: 'จังหวัด' });
	await province.click();
	await expect(page.getByRole('option')).toHaveCount(77);

	// Typing keeps only the provinces that contain it
	await province.fill('เชียง');
	await expect(page.getByRole('option')).toHaveText(['เชียงราย', 'เชียงใหม่']);
	await province.fill('zzz');
	await expect(page.getByText('ไม่พบจังหวัดที่ค้นหา')).toBeVisible();

	// Choosing with the keyboard works, and leaving without choosing puts the choice back
	await province.fill('ภูเก็ต');
	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('Enter');
	await expect(province).toHaveValue('ภูเก็ต');
	await province.fill('กระบี่');
	await page.keyboard.press('Escape');
	await expect(province).toHaveValue('ภูเก็ต');
});

test('the how-to-play text breaks between phrases, never inside one', async ({ page }) => {
	for (const width of [360, 412, 1280]) {
		await page.setViewportSize({ width, height: 800 });
		await page.goto('/');
		await page.locator('[data-step="mission"]').scrollIntoViewIfNeeded();
		const phrases = page.locator('#definition p span.inline-block');
		await expect(phrases.first()).toBeVisible();
		// Each phrase is on one line: a phrase that wrapped would have several boxes stacked
		const wrapped = await phrases.evaluateAll((els) =>
			els.filter((el) => el.getClientRects().length > 1 || el.getBoundingClientRect().height > 24)
		);
		expect(wrapped, `${width}px`).toHaveLength(0);
		// And it stays short: no more than four lines
		const tops = await phrases.evaluateAll((els) => [
			...new Set(els.map((el) => Math.round(el.getBoundingClientRect().top / 4)))
		]);
		expect(tops.length, `${width}px`).toBeLessThanOrEqual(4);
	}
});

test('in the Result the contact box reads at the size of the text under it', async ({ page }) => {
	await page.goto('/#summary');
	const size = (text: string) =>
		page
			.locator('#summary')
			.getByText(text)
			.first()
			.evaluate((el) => getComputedStyle(el).fontSize);
	const below = await size('หรือเรียนรู้เพิ่มเติมเรื่องสิทธิมนุษยชน');
	expect(below).toBe('16px');
	expect(await size('หากมีเรื่องร้องเรียนด้านสิทธิมนุษยชน')).toBe(below);
	expect(await size('สำนักงานคณะกรรมการสิทธิมนุษยชนแห่งชาติ (สำนักงาน กสม.)')).toBe(below);
});

test('the กสม. Facebook page is linked from the contact box, on a case and in the Result', async ({
	page
}) => {
	// Its icon says it opens in a new tab, which is part of the link's name
	const name = 'สำนักงานคณะกรรมการสิทธิมนุษยชนแห่งชาติ (เปิดในแท็บใหม่)';
	for (const path of ['/cases/karen/', '/#summary']) {
		await page.goto(path);
		const link = page.getByRole('link', { name }).first();
		await expect(link, path).toHaveAttribute('href', 'https://www.facebook.com/nhrct?locale=th_TH');
		await expect(link, path).toHaveAttribute('target', '_blank');
		await expect(link, path).toHaveAttribute('rel', /noopener/);
	}
});

test('the Result has share links and the E-Learning link', async ({ page }) => {
	await page.goto('/#summary');
	const summary = page.locator('#summary');
	await expect(summary.getByRole('link', { name: 'แชร์ทาง Facebook' })).toHaveAttribute(
		'href',
		/facebook\.com\/sharer/
	);
	await expect(summary.getByRole('link', { name: 'แชร์ทาง X' })).toHaveAttribute(
		'href',
		/twitter\.com\/intent/
	);
	await expect(summary.getByRole('link', { name: /The Inclusion Lab/ })).toHaveAttribute(
		'href',
		'https://move-d.org/lab/'
	);
	// The Result is followed by About, so it has no scroll hint of its own
	await expect(summary.getByText('เลื่อนลงเพื่อดูต่อ')).toHaveCount(0);
});

test('About has the project goal, sources, credits and the WeVis footer', async ({ page }) => {
	await page.goto('/#about');
	const about = page.locator('#about');
	await expect(about.getByRole('heading', { name: 'เกี่ยวกับโครงการ', level: 2 })).toBeVisible();
	for (const h of [
		'เป้าหมาย',
		'ที่มาของข้อมูล',
		'นโยบายการนำข้อมูลไปใช้ต่อ',
		'อาสาสมัครร่วมพัฒนา'
	]) {
		await expect(about.getByRole('heading', { name: h })).toBeVisible();
	}
	await expect(about.getByRole('link', { name: 'team@wevis.info' })).toHaveAttribute(
		'href',
		'mailto:team@wevis.info'
	);
	await expect(about.locator('footer').getByRole('link', { name: 'GitHub' })).toBeVisible();
});

test('the case card poll remembers the answer', async ({ page }) => {
	await page.goto('/cases/karen/');
	const answer = page.getByRole('button', { name: 'เคยเห็นกับตา' });
	// Shares appear only once an option is picked (mock values until the poll backend)
	await expect(page.getByText('27.6%')).toHaveCount(0);
	await answer.click();
	await expect(answer).toHaveAttribute('aria-pressed', 'true');
	await expect(page.getByText('27.6%')).toBeVisible();
	// One vote per browser: the answer is locked, and a year-long cookie remembers it
	await expect(page.getByRole('button', { name: 'เคยโดนกับตัว' })).toBeDisabled();
	const cookie = (await page.context().cookies()).find((c) => c.name === 'nd-poll');
	expect(cookie?.value).toContain('karen');
	expect(cookie?.sameSite).toBe('Lax');
	expect(cookie?.expires ?? 0).toBeGreaterThan(Date.now() / 1000 + 300 * 24 * 3600);
	await page.reload();
	await expect(page.getByRole('button', { name: 'เคยเห็นกับตา' })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await expect(page.getByRole('button', { name: 'เคยเห็นกับตา' })).toBeDisabled();
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
	// Back on the card that opened the map
	await expect(page.locator('#explore-intro').getByRole('heading', { level: 2 })).toBeInViewport();

	await page.goBack();
	await expect(map).toBeVisible();
});

test('map controls: reveal, hints drawer and exit', async ({ page }) => {
	await page.goto('/#explore');
	// Like เปิดตัวช่วย, the button renames itself while the reveal is on
	await page.getByRole('button', { name: 'เฉลยตำแหน่งภาพ' }).click();
	await expect(page.getByRole('button', { name: 'เฉลยตำแหน่งภาพ' })).toHaveCount(0);
	await page.getByRole('button', { name: 'ปิดเฉลย' }).click();
	await expect(page.getByRole('button', { name: 'เฉลยตำแหน่งภาพ' })).toBeVisible();

	await page.getByRole('button', { name: 'เปิดตัวช่วย' }).click();
	await expect(page.getByRole('button', { name: 'ปิดตัวช่วย' })).toHaveAttribute(
		'aria-expanded',
		'true'
	);
	await page.getByRole('button', { name: 'ปิดตัวช่วย' }).click();
	await expect(page.getByRole('button', { name: 'เปิดตัวช่วย' })).toBeVisible();

	await page.getByRole('link', { name: 'ออกจากการสำรวจ' }).click();
	await expect(page).toHaveURL(/#explore-intro$/);
});

test('every page declares its icons and a share image, and they all load', async ({ page }) => {
	for (const path of ['/', '/cases/karen/', '/definition/age/']) {
		await page.goto(path);
		const icons = await page
			.locator('link[rel="icon"], link[rel="apple-touch-icon"]')
			.evaluateAll((els) => els.map((el) => (el as HTMLLinkElement).href));
		expect(icons, path).toHaveLength(3);
		for (const href of icons) expect((await page.request.get(href)).ok(), href).toBe(true);

		// The share image is an absolute address on the published site (a link preview cannot use a
		// relative one), 1200 by 630 px as in Figma
		const image = await page.locator('meta[property="og:image"]').getAttribute('content');
		expect(image, path).toMatch(/^https:\/\/wevisdemo\.github\.io\/(.*\/)?og-image\.png$/);
		await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', image!);
		await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
			'content',
			'summary_large_image'
		);
		await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
			'content',
			'1200'
		);
		// One title, once: a case page shares as that case, the others as the site
		await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
		await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
		await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
			'content',
			path === '/cases/karen/' ? 'ผู้ต้องขังชาวกะเหรี่ยงถูกบังคับตัดผม' : /Spot the Discrimination/
		);

		// Fetch it from the local server (same file name, without the published origin)
		const res = await page.request.get(
			new URL(image!).pathname.replace(/^.*\/(?=og-image\.png)/, '/')
		);
		expect(res.headers()['content-type']).toBe('image/png');
		const png = await res.body();
		expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
	}
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

/** The screens in the Figma "Illustration for screens" section */
const devices = [
	['Standard Desktop', 1440, 1024],
	['iPad Pro 11', 834, 1194],
	['iPad Mini 8.3', 744, 1133],
	['iPhone 17 Pro Max', 440, 956],
	['Android Compact', 412, 917]
] as const;

for (const [name, width, height] of devices) {
	test(`nothing overflows sideways on ${name}`, async ({ page }) => {
		await page.setViewportSize({ width, height });
		for (const path of ['/', '/#explore', '/cases/', '/cases/karen/', '/definition/age/']) {
			await page.goto(path);
			const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
			expect(scrollWidth, path).toBeLessThanOrEqual(width);
		}
	});
}

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
