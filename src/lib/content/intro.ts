import type { StoryStep } from '#lib/components/story/ScrollStory.svelte';
import type { BubbleVariant } from '#lib/components/intro/IntroBubble.svelte';
import { cityOverview, introCases } from './cameras.ts';

/**
 * Thought bubbles in the "bubbles" step (Figma frame "m-2"); each is pinned to a case, which is
 * spotlighted. `offset` is the bubble's top-left from its case's top-left, in px. The prototype
 * lays the ex-convict case out away from where it sits on the map, so that bubble is placed
 * below its case instead.
 */
export const introBubbles: {
	slug: string;
	variant: BubbleVariant;
	text: string;
	offset: { x: number; y: number };
}[] = [
	{
		slug: 'gender-promotion',
		variant: 'blue',
		text: 'มีคนไม่ได้ขึ้นเป็น\nหัวหน้างานเพราะ\nเป็นผู้หญิง',
		offset: { x: 160, y: -111 }
	},
	{
		slug: 'hiv-test-job',
		variant: 'orange',
		text: 'มีคนถูกบังคับ\nตรวจเชื้อ HIV\nก่อนเข้าทำงาน',
		offset: { x: 176, y: 120 }
	},
	{
		slug: 'ex-con-job',
		variant: 'yellow',
		text: 'มีคนไม่ถูกรับเข้า\nทำงานเพราะมี\nประวัติอาชญากรรม',
		offset: { x: -30, y: 150 }
	}
];

/**
 * Scroll steps of the Intro (Figma flow "DE-Intro", start node 571:8266). `wash` follows the
 * prototype's frame gradients: white fading to 80%, lifting to reveal the city, coming back for
 * the bubbles and cards, then fading to white for the title.
 */
export const introSteps = [
	{ id: 'question', camera: cityOverview, dim: 0.8, wash: [1, 0.8] },
	{ id: 'city', camera: cityOverview, dim: 0, wash: [0.8, 0, 0.8] },
	{
		id: 'bubbles',
		camera: introCases,
		dim: 0.8,
		wash: [0.8],
		spotlight: introBubbles.map((b) => b.slug)
	},
	{ id: 'meaning', camera: cityOverview, dim: 0.8, wash: [0.8] },
	{ id: 'title', camera: cityOverview, dim: 0.8, wash: [0.8, 1] }
] as const satisfies readonly StoryStep[];
