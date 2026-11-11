/**
 * Where the cause tags go in the map's reveal mode ("เฉลยตำแหน่งภาพ"). Each case's tags want to sit
 * just below it (or above it, for a case that asks), but where cases are close together those
 * spots collide. So each group of tags is moved the shortest way that keeps it off the other groups
 * and off the cases.
 * All numbers are px in the map's own layout, before any zoom.
 */
export type Rect = { x: number; y: number; w: number; h: number };

export type ChipItem = {
	id: string;
	/** The case the tags belong to */
	box: Rect;
	/** Size of its group of tags */
	w: number;
	h: number;
	/** Draw the tags above the case instead of below it */
	above?: boolean;
};

/** Gap between a case and the tags directly below (or above) it */
export const BELOW = 12;

const STEP = 6;
const REACH = 240;
/** Breathing room kept between two groups of tags */
const GAP = 6;
/** What each kind of mistake costs, per px² (overlaps) or per px moved: groups on top of each other
 *  are the worst, then tags hiding a case, then simply being far from the default spot */
const COST_CHIPS = 50;
const COST_CASE = 8;
const COST_MOVE = 40;

const overlap = (a: Rect, b: Rect, pad = 0) =>
	Math.max(0, Math.min(a.x + a.w, b.x + b.w + pad) - Math.max(a.x, b.x - pad)) *
	Math.max(0, Math.min(a.y + a.h, b.y + b.h + pad) - Math.max(a.y, b.y - pad));

/** The tags' default spot: centred just below the case, or just above it */
export function defaultRect(item: ChipItem): Rect {
	return {
		x: item.box.x + item.box.w / 2 - item.w / 2,
		y: item.above ? item.box.y - BELOW - item.h : item.box.y + item.box.h + BELOW,
		w: item.w,
		h: item.h
	};
}

/** The best spot for `item` given the groups already placed, by the costs above */
function place(
	item: ChipItem,
	items: ChipItem[],
	placed: Map<string, Rect>,
	bounds: { w: number; h: number }
): Rect {
	const home = defaultRect(item);
	let best = home;
	let bestCost = Infinity;
	for (let dy = -REACH; dy <= REACH; dy += STEP) {
		for (let dx = -REACH; dx <= REACH; dx += STEP) {
			const move = Math.hypot(dx, dy);
			const cost0 = move * COST_MOVE;
			if (cost0 >= bestCost) continue;
			const at = { ...home, x: home.x + dx, y: home.y + dy };
			if (at.x < 0 || at.y < 0 || at.x + at.w > bounds.w || at.y + at.h > bounds.h) continue;
			let cost = cost0;
			for (const [id, other] of placed) {
				if (id !== item.id) cost += overlap(at, other, GAP) * COST_CHIPS;
			}
			for (const other of items) cost += overlap(at, other.box) * COST_CASE;
			if (cost < bestCost) {
				bestCost = cost;
				best = at;
			}
		}
	}
	return best;
}

/**
 * Top-left of every group of tags. The most crowded cases are placed first, then each group is
 * placed again with all the others in place, which settles chains of neighbours.
 */
export function layoutChips(
	items: ChipItem[],
	bounds: { w: number; h: number }
): Map<string, Rect> {
	const near = (a: ChipItem) =>
		items.filter((b) => b !== a && Math.hypot(a.box.x - b.box.x, a.box.y - b.box.y) < REACH * 1.5)
			.length;
	const order = [...items].sort((a, b) => near(b) - near(a) || a.id.localeCompare(b.id));
	const placed = new Map<string, Rect>();
	for (const item of order) placed.set(item.id, place(item, items, placed, bounds));
	for (let pass = 0; pass < 2; pass++) {
		for (const item of order) placed.set(item.id, place(item, items, placed, bounds));
	}
	return placed;
}
