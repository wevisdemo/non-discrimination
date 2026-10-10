/**
 * Story stages from the Figma prototype (architecture.md §1 Story flow).
 * `label` is what the ☰ pill shows while you are on that stage (the prototype labels both
 * Intro and KP1 "Intro"); `title` names the stage in the open menu.
 * Stages that are not built yet are left out so the menu never links to a 404.
 */
export const stages = [
	{ id: 'intro', label: 'Intro', title: 'Intro', path: '/' },
	{
		id: 'kp1',
		label: 'Intro',
		title: 'การเลือกปฏิบัติคืออะไร',
		path: '/what-is-discrimination'
	},
	{
		id: 'explore',
		label: 'สืบหา 18 การเลือกปฏิบัติที่ซ่อนอยู่',
		title: 'สืบหา 18 การเลือกปฏิบัติที่ซ่อนอยู่',
		path: '/explore'
	}
	// TODO: KP3 'สาเหตุที่ยังพบเห็นการเลือกปฏิบัติ', Result 'บทสรุป'
] as const;

export type Stage = (typeof stages)[number];

/** The stage a route belongs to; case and definition pages count as part of the game. */
export function stageFor(routeId: string | null): Stage {
	return stages.find((s) => s.path === routeId) ?? stages[2];
}
