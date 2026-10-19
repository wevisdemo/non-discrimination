import type { StoryStep } from '#lib/components/story/ScrollStory.svelte';
import type { BubbleVariant } from '#lib/components/intro/IntroBubble.svelte';
import { cityOverview, introAllCases, introExCon, introGender, introHiv } from './cameras.ts';

/**
 * Thought bubbles (Figma frame "m-2"), in the order the Intro reveals them; each is pinned to a
 * case, which is spotlighted while its bubble is shown. `offset` is the bubble's top-left from its case's top-left, in px. The prototype
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
		slug: 'ex-con-job',
		variant: 'yellow',
		text: 'มีคนไม่ถูกรับเข้า\nทำงานเพราะมี\nประวัติอาชญากรรม',
		offset: { x: -30, y: 150 }
	},
	{
		slug: 'hiv-test-job',
		variant: 'orange',
		text: 'มีคนถูกบังคับ\nตรวจเชื้อ HIV\nก่อนเข้าทำงาน',
		offset: { x: 176, y: 120 }
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
	// One close-up per case and bubble ("Intro Animation"), then a wide shot of all three
	{
		id: 'gender-promotion',
		camera: introGender,
		dim: 0.8,
		wash: [0.8],
		spotlight: ['gender-promotion']
	},
	{ id: 'ex-con-job', camera: introExCon, dim: 0.8, wash: [0.8], spotlight: ['ex-con-job'] },
	{ id: 'hiv-test-job', camera: introHiv, dim: 0.8, wash: [0.8], spotlight: ['hiv-test-job'] },
	{
		id: 'bubbles-all',
		camera: introAllCases,
		dim: 0.8,
		wash: [0.8],
		spotlight: introBubbles.map((b) => b.slug)
	},
	{ id: 'meaning', camera: cityOverview, dim: 0.8, wash: [0.8] },
	{ id: 'title', camera: cityOverview, dim: 0.8, wash: [0.8, 1] }
] as const satisfies readonly StoryStep[];
