<script lang="ts" module>
	/**
	 * Where the viewport centres on the map (0–1 of map size), and how big the map is drawn
	 * relative to the longer viewport side.
	 */
	export type Camera = { x: number; y: number; zoom: number };
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { MAP_SIZE } from '#lib/content/index.ts';

	let { camera, children }: { camera: Camera; children: Snippet } = $props();

	// Defaults match the prototype frame so the prerendered HTML is close before hydration.
	let vw = $state(1440);
	let vh = $state(900);

	const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
	// The map is sized off the longer viewport side so portrait phones still get a close-up.
	const w = $derived(camera.zoom * Math.max(vw, vh));
	const h = $derived((w * MAP_SIZE.height) / MAP_SIZE.width);
	// Centre on the focus point, but never pan past the map's edges.
	const tx = $derived(clamp(vw / 2 - camera.x * w, vw - w, 0));
	const ty = $derived(clamp(vh / 2 - camera.y * h, vh - h, 0));
</script>

<svelte:window bind:innerWidth={vw} bind:innerHeight={vh} />

<div class="absolute inset-0 overflow-hidden">
	<div
		class="absolute top-0 left-0 origin-top-left transition-[transform,width] duration-1000 ease-in-out"
		style="width:{w}px;transform:translate({tx}px,{ty}px)"
	>
		{@render children()}
	</div>
</div>
