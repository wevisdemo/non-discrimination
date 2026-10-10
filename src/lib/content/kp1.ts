import type { StoryStep } from '#lib/components/story/ScrollStory.svelte';
import { cityCentre } from './cameras.ts';

/**
 * KP1, what discrimination is (Figma flow "DE-KP1", start node 571:10659).
 * Stereotypes → separating, excluding, restricting rights → the game-start popup.
 */
export const kp1Steps = [
	{ id: 'stereotype', camera: cityCentre, dim: 0.65 },
	{ id: 'harm', camera: cityCentre, dim: 0.65 },
	{ id: 'mission', camera: cityCentre, dim: 0.65 }
] as const satisfies readonly StoryStep[];

/** Stereotype bubbles around the "ภาพจำที่ลดคุณค่า" card, as worded in the prototype. */
export const stereotypes = [
	'คนเป็นโรคนี้น่ารังเกียจ',
	'คนเชื้อชาตินี้ไว้ใจไม่ได้',
	'คนเพศนี้เป็นผู้นำไม่ได้'
] as const;
