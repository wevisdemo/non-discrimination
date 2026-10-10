import type { Camera } from '#lib/components/map/MapCamera.svelte';
import { getCase, MAP_SIZE } from './index.ts';

const ZOOM = 1.2;

/** Prototype "Intro" opening frame: pink office, police car, red car and blue car in view. */
export const cityOverview: Camera = { x: 0.42, y: 0.26, zoom: ZOOM };

/** Prototype "KP1" frame: the junction with the red car, temple gate and police station. */
export const cityCentre: Camera = { x: 0.53, y: 0.53, zoom: ZOOM };

/** Centre the camera on a case so anything pinned to it is on screen, even on a narrow phone. */
export function focusOn(slug: string): Camera {
	const { hotspot: h } = getCase(slug)!;
	return {
		x: (h.x + h.w / 2) / MAP_SIZE.width,
		y: (h.y + h.h / 2) / MAP_SIZE.height,
		zoom: ZOOM
	};
}
