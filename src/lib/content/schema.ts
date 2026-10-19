import { z } from 'zod';

/** Master map size in px (Figma layer `BG-Final`). Hotspots are stored in this coordinate space. */
export const MAP_SIZE = { width: 3241, height: 3242 } as const;

export const CAUSE_IDS = [
	'race',
	'gender',
	'age',
	'religion',
	'health',
	'personal-status',
	'social-status',
	'origin'
] as const;

export const causeIdSchema = z.enum(CAUSE_IDS);

export const causeSchema = z.object({
	id: causeIdSchema,
	labelTh: z.string().min(1),
	labelEn: z.string().min(1)
});

const linkSchema = z.object({ label: z.string().min(1), url: z.url() });

export const caseSchema = z
	.object({
		/** Matches the Figma layer name without the `case-` prefix, e.g. `hijab-school` */
		slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
		titleTh: z.string().min(1),
		summaryTh: z.string().min(1),
		causes: z.array(causeIdSchema).min(1),
		/** มิติแห่งการเลือกปฏิบัติ, e.g. สิทธิการทำงาน */
		dimensionTh: z.string().min(1),
		/** รูปแบบของการเลือกปฏิบัติ, e.g. ทางตรง, เชิงโครงสร้าง */
		formsTh: z.array(z.string().min(1)).min(1),
		/** ผู้กระทำ */
		perpetratorTh: z.string().min(1),
		/** ผู้ได้รับผลกระทบ */
		affectedTh: z.string().min(1),
		/** บันทึกเพิ่มเติม: the legal basis or a later development, when the datasheet has one */
		noteTh: z.string().min(1).optional(),
		hotspot: z.object({
			x: z.number().min(0),
			y: z.number().min(0),
			w: z.number().positive(),
			h: z.number().positive()
		}),
		/** Story stage the case belongs to; pending confirmation from design */
		kp: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
		law: z
			.array(
				z.object({ name: z.string().min(1), section: z.string().min(1), url: z.url().optional() })
			)
			.default([]),
		sources: z.array(linkSchema).default([])
	})
	.refine(
		(c) =>
			c.hotspot.x + c.hotspot.w <= MAP_SIZE.width && c.hotspot.y + c.hotspot.h <= MAP_SIZE.height,
		{ message: 'hotspot must lie inside the master map', path: ['hotspot'] }
	);

export type CauseId = z.infer<typeof causeIdSchema>;
export type Cause = z.infer<typeof causeSchema>;
export type Case = z.infer<typeof caseSchema>;
