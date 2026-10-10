import type { Camera } from '#lib/components/map/MapCamera.svelte';
import { getCase, MAP_SIZE } from './index.ts';

/**
 * Scroll steps of the Intro (Figma flow "DE-Intro", start node 571:8266).
 * Each step sets how the fixed map behind the text looks while that step is on screen.
 */
export type IntroStep = {
	id: 'question' | 'city' | 'bubbles' | 'meaning' | 'title';
	camera: Camera;
	/** White wash over the map, 0–1 */
	dim: number;
};

/**
 * Thought bubbles shown over cases in the "bubbles" step. Each case listed here is
 * spotlighted above the white wash.
 * TODO(content): the prototype shows more bubbles; only this one was legible in the
 * prototype review. Add the rest from Figma frame "Intro".
 */
export const introBubbles: { slug: string; text: string }[] = [
	{ slug: 'gender-promotion', text: 'มีคนไม่ได้ขึ้นเป็นหัวหน้างานเพราะเป็นผู้หญิง' }
];

// Matches the prototype's opening frame: pink office, police car, red car and blue car in view.
const overview: Camera = { x: 0.42, y: 0.26, zoom: 1.2 };

/** Centre the camera on a case so its bubble is on screen, even on a narrow phone. */
function focusOn(slug: string): Camera {
	const { hotspot: h } = getCase(slug)!;
	return {
		x: (h.x + h.w / 2) / MAP_SIZE.width,
		y: (h.y + h.h / 2) / MAP_SIZE.height,
		zoom: overview.zoom
	};
}

export const introSteps: IntroStep[] = [
	{ id: 'question', camera: overview, dim: 0.75 },
	{ id: 'city', camera: overview, dim: 0 },
	{ id: 'bubbles', camera: focusOn(introBubbles[0].slug), dim: 0.6 },
	{ id: 'meaning', camera: overview, dim: 0.75 },
	{ id: 'title', camera: overview, dim: 0.75 }
];
