import type { Camera } from '#lib/components/map/MapCamera.svelte';
import { getCase, MAP_SIZE } from './index.ts';

const ZOOM = 1.2;

/** Prototype "Intro" opening frame: pink office, police car, red car and blue car in view. */
export const cityOverview: Camera = { x: 0.42, y: 0.26, zoom: ZOOM };

/** Prototype "KP1" frame: the junction with the red car, temple gate and police station. */
export const cityCentre: Camera = { x: 0.53, y: 0.53, zoom: ZOOM };

/*
 * Intro "bubbles" frames (Figma "Intro Animation"): one close-up per case with its bubble, then a
 * wide shot of all three. Each centre is the middle of the case plus its bubble, in map units
 * divided by MAP_SIZE. The cases hug the map's left edge, so the camera clamps there and the
 * close-ups sit toward the left of the screen; the map always fills the frame.
 */
export const introGender: Camera = { x: 0.2024, y: 0.1607, zoom: 1.95 };
export const introExCon: Camera = { x: 0.0674, y: 0.3641, zoom: 2.3 };
export const introHiv: Camera = { x: 0.1993, y: 0.343, zoom: 2.1 };
export const introAllCases: Camera = { x: 0.1607, y: 0.2594, zoom: 1.25 };

/** Centre the camera on a case so anything pinned to it is on screen, even on a narrow phone. */
export function focusOn(slug: string): Camera {
	const { hotspot: h } = getCase(slug)!;
	return {
		x: (h.x + h.w / 2) / MAP_SIZE.width,
		y: (h.y + h.h / 2) / MAP_SIZE.height,
		zoom: ZOOM
	};
}
