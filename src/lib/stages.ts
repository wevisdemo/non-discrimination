/**
 * Story stages from the Figma prototype (architecture.md §1 Story flow).
 * `label` is what the ☰ menu pill shows while you are on that stage.
 * Stages that are not built yet are left out so the menu never links to a 404.
 */
export const stages = [
	{ id: 'intro', label: 'Intro', path: '/' },
	{ id: 'explore', label: 'สืบหา 18 การเลือกปฏิบัติที่ซ่อนอยู่', path: '/explore' }
	// TODO: KP1 (Intro), KP3 'สาเหตุที่ยังพบเห็นการเลือกปฏิบัติ', Result 'บทสรุป'
] as const;

export type Stage = (typeof stages)[number];

/** The stage a route belongs to; case and definition pages count as part of the game. */
export function stageFor(routeId: string | null): Stage {
	if (routeId === '/') return stages[0];
	return stages[1];
}
