/**
 * The six sections of the single page, in menu order (architecture.md §1 Story flow).
 * `id` is the section's DOM id and URL hash; `label` is shown in the ☰ pill and the open menu.
 */
export const stages = [
	{ id: 'intro', label: 'Intro' },
	{ id: 'definition', label: 'คำนิยามสั้น ๆ ของการเลือกปฏิบัติ' },
	{ id: 'explore', label: 'สืบหา 18 การเลือกปฏิบัติที่ซ่อนอยู่' },
	{ id: 'causes', label: 'สาเหตุที่ยังพบเห็นการเลือกปฏิบัติ' },
	{ id: 'summary', label: 'บทสรุป' },
	{ id: 'about', label: 'เกี่ยวกับโครงการ' }
] as const;

export type Stage = (typeof stages)[number];
export type StageId = Stage['id'];
