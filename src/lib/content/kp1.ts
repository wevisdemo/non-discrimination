import cloud1 from '#lib/assets/kp1/cloud-1.svg';
import cloud2 from '#lib/assets/kp1/cloud-2.svg';
import cloud3 from '#lib/assets/kp1/cloud-3.svg';
import cloud4 from '#lib/assets/kp1/cloud-4.svg';
import cloud5 from '#lib/assets/kp1/cloud-5.svg';
import cloud6 from '#lib/assets/kp1/cloud-6.svg';
import type { StoryStep } from '#lib/components/story/ScrollStory.svelte';
import { cityCentre } from './cameras.ts';

/**
 * KP1, what discrimination is (Figma flow "DE-KP1", start node 571:10659).
 * Stereotypes → separating, excluding, restricting rights → "that is discrimination" → the
 * game-start popup. The map is under an 80% white wash, fading in from the Intro's white at the
 * start and back out to white at the end so neither edge shows a hard cut.
 */
export const kp1Steps = [
	{ id: 'stereotype', camera: cityCentre, dim: 0.8, wash: [1, 0.8] },
	{ id: 'harm', camera: cityCentre, dim: 0.8, wash: [0.8] },
	{ id: 'conclusion', camera: cityCentre, dim: 0.8, wash: [0.8] },
	{ id: 'mission', camera: cityCentre, dim: 0.8, wash: [0.8, 1] }
] as const satisfies readonly StoryStep[];

/**
 * A cloud around the centre card, placed in the prototype's 320×480 box ("Balloon_animate").
 * `x`/`y`/`w`/`h` place the cloud; `textX` is the centre of its text and `textY` its top.
 */
export type Balloon = {
	src: string;
	x: number;
	y: number;
	w: number;
	h: number;
	text: string;
	textX: number;
	textY: number;
};

/** Stereotypes around the "ภาพจำที่ลดคุณค่า" card, as worded in the prototype. */
export const stereotypeBalloons: readonly Balloon[] = [
	{
		src: cloud1,
		x: 16,
		y: 97,
		w: 119.448,
		h: 94.8962,
		text: 'คนเป็นโรคนี้\nน่ารังเกียจ',
		textX: 75.5,
		textY: 121.96
	},
	{
		src: cloud2,
		x: 151,
		y: 90,
		w: 161,
		h: 145,
		text: 'คนเชื้อชาตินี้\nไว้ใจไม่ได้',
		textX: 231.5,
		textY: 139
	},
	{
		src: cloud3,
		x: 84,
		y: 302,
		w: 168,
		h: 83,
		text: 'คนเพศนี้\nเป็นผู้นำไม่ได้',
		textX: 156,
		textY: 320
	}
];

/** What those stereotypes lead to, around the "แบ่งแยก-กีดกัน-จำกัดสิทธิ" card. */
export const harmBalloons: readonly Balloon[] = [
	{
		src: cloud4,
		x: 194,
		y: 74,
		w: 120.666,
		h: 80.2714,
		text: 'เลิกจ้าง',
		textX: 249.5,
		textY: 102
	},
	{
		src: cloud5,
		x: 14,
		y: 86,
		w: 167,
		h: 97,
		text: 'ปฏิเสธ\nเข้าสอบ',
		textX: 91.5,
		textY: 125
	},
	{
		src: cloud6,
		x: 91,
		y: 289,
		w: 138,
		h: 124,
		text: 'ทำร้ายร่างกาย',
		textX: 160.5,
		textY: 345
	}
];
