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

	let { camera, phone, children }: { camera: Camera; phone?: Camera; children: Snippet } = $props();

	// Defaults match the prototype frame so the prerendered HTML is close before hydration.
	let vw = $state(1440);
	let vh = $state(900);

	// Phones are narrower than a tablet; below that the phone camera, if the step has one, applies
	const view = $derived(phone && vw < 768 ? phone : camera);

	const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
	// The map is laid out once at the longer viewport side (so portrait phones still get a
	// close-up) and zoomed with a scale transform. Animating width instead re-laid out the scene
	// every frame, and the cqw-sized bubble text re-wrapped and shook while the camera moved.
	const base = $derived(Math.max(vw, vh));
	const w = $derived(view.zoom * base);
	const h = $derived((w * MAP_SIZE.height) / MAP_SIZE.width);
	// Centre on the focus point, but never pan past the map's edges.
	const tx = $derived(clamp(vw / 2 - view.x * w, vw - w, 0));
	const ty = $derived(clamp(vh / 2 - view.y * h, vh - h, 0));
</script>

<!-- Sized off this box, not the window: on phones innerHeight changes as the address bar slides
     away mid-scroll, which re-zoomed the map and made it shake. -->
<div class="absolute inset-0 overflow-hidden" bind:clientWidth={vw} bind:clientHeight={vh}>
	<div
		class="absolute top-0 left-0 origin-top-left transition-transform duration-1000 ease-in-out"
		style="width:{base}px;transform:translate({tx}px,{ty}px) scale({view.zoom})"
	>
		{@render children()}
	</div>
</div>
