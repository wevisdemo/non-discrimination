import { describe, expect, it } from 'vitest';
import { cases, MAP_SIZE } from '#lib/content/index.ts';
import { BELOW, defaultRect, layoutChips, type ChipItem, type Rect } from './chipLayout.ts';

const overlaps = (a: Rect, b: Rect, pad = 0) =>
	a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad;

const item = (id: string, x: number, y: number, w = 60, h = 100, cw = 150, ch = 28): ChipItem => ({
	id,
	box: { x, y, w, h },
	w: cw,
	h: ch
});

describe('layoutChips', () => {
	it("keeps a lone case's tags centred just below it", () => {
		const lone = item('a', 400, 300);
		const spot = layoutChips([lone], { w: 1600, h: 1600 }).get('a')!;
		expect(spot).toEqual(defaultRect(lone));
		expect(spot.y).toBe(lone.box.y + lone.box.h + BELOW);
	});

	it("can put a case's tags above it instead", () => {
		const up = { ...item('a', 400, 300), above: true };
		const spot = layoutChips([up], { w: 1600, h: 1600 }).get('a')!;
		expect(spot).toEqual(defaultRect(up));
		expect(spot.y + spot.h).toBe(up.box.y - BELOW);
		expect(spot.x + spot.w / 2).toBe(up.box.x + up.box.w / 2);
	});

	it('moves tags apart when neighbouring cases would put them on top of each other', () => {
		const items = [item('a', 400, 300), item('b', 440, 300), item('c', 480, 310)];
		const spots = layoutChips(items, { w: 1600, h: 1600 });
		const rects = items.map((i) => spots.get(i.id)!);
		for (let i = 0; i < rects.length; i++) {
			for (let j = i + 1; j < rects.length; j++) {
				expect(overlaps(rects[i], rects[j], 4), `${i} and ${j}`).toBe(false);
			}
		}
	});

	it("keeps tags off the cases, including their own and the neighbours'", () => {
		const items = [item('a', 400, 300), item('b', 470, 300)];
		const spots = layoutChips(items, { w: 1600, h: 1600 });
		for (const tags of items.map((i) => spots.get(i.id)!)) {
			for (const other of items) expect(overlaps(tags, other.box)).toBe(false);
		}
	});

	it('keeps tags inside the map, even for a case at its edge', () => {
		const edge = item('edge', 1560, 1480, 40, 100, 220, 28);
		const spot = layoutChips([edge], { w: 1600, h: 1600 }).get('edge')!;
		expect(spot.x).toBeGreaterThanOrEqual(0);
		expect(spot.y).toBeGreaterThanOrEqual(0);
		expect(spot.x + spot.w).toBeLessThanOrEqual(1600);
		expect(spot.y + spot.h).toBeLessThanOrEqual(1600);
	});

	it('gives the same answer for the same input', () => {
		const items = [item('a', 400, 300), item('b', 440, 300), item('c', 480, 310)];
		const first = [...layoutChips(items, { w: 1600, h: 1600 })];
		expect([...layoutChips([...items].reverse(), { w: 1600, h: 1600 })].sort()).toEqual(
			first.sort()
		);
	});

	it('separates the real 18 cases at the smallest map, 1600px wide, with realistic tag sizes', () => {
		const k = 1600 / MAP_SIZE.width;
		const items = cases.map((c) => ({
			id: c.slug,
			box: { x: c.hotspot.x * k, y: c.hotspot.y * k, w: c.hotspot.w * k, h: c.hotspot.h * k },
			// a 14px Thai tag is roughly 10px a letter plus padding, 30px tall with its gap
			w: Math.max(...c.causes.map((id) => 36 + id.length * 9)),
			h: c.causes.length * 36,
			above: c.tagsAbove
		}));
		const spots = layoutChips(items, { w: 1600, h: (1600 * MAP_SIZE.height) / MAP_SIZE.width });
		const rects = items.map((i) => ({ id: i.id, ...spots.get(i.id)! }));
		const clashes: string[] = [];
		for (let i = 0; i < rects.length; i++) {
			for (let j = i + 1; j < rects.length; j++) {
				if (overlaps(rects[i], rects[j])) clashes.push(`${rects[i].id} × ${rects[j].id}`);
			}
		}
		expect(clashes).toEqual([]);
	});
});

describe('the cases that ask for their tags above', () => {
	it('are three: the case with two causes, and two whose tags ran into the buttons at the bottom of a phone', () => {
		expect(
			cases
				.filter((c) => c.tagsAbove)
				.map((c) => c.slug)
				.sort()
		).toEqual(['elderly-mobile-banking', 'katoey-police', 'social-security']);
	});
});
