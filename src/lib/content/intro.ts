import type { StoryStep } from '#lib/components/story/ScrollStory.svelte';
import { cityOverview, focusOn } from './cameras.ts';

/**
 * Thought bubbles pinned to cases in the "bubbles" step; those cases are spotlighted.
 * TODO(content): the prototype shows more bubbles; only this one was legible in the
 * prototype review. Add the rest from Figma frame "Intro".
 */
export const introBubbles: { slug: string; text: string }[] = [
	{ slug: 'gender-promotion', text: 'มีคนไม่ได้ขึ้นเป็นหัวหน้างานเพราะเป็นผู้หญิง' }
];

/** Scroll steps of the Intro (Figma flow "DE-Intro", start node 571:8266). */
export const introSteps = [
	{ id: 'question', camera: cityOverview, dim: 0.75 },
	{ id: 'city', camera: cityOverview, dim: 0 },
	{
		id: 'bubbles',
		camera: focusOn(introBubbles[0].slug),
		dim: 0.6,
		spotlight: introBubbles.map((b) => b.slug)
	},
	{ id: 'meaning', camera: cityOverview, dim: 0.75 },
	{ id: 'title', camera: cityOverview, dim: 0.75 }
] as const satisfies readonly StoryStep[];
