<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cases, MAP_SIZE, type Case } from '#lib/content/index.ts';
	import bg from '#lib/assets/map/bg-final.png?enhanced';
	import { caseImage } from '#lib/components/case/caseImage.ts';

	let {
		dim = 0,
		spotlight = new Set<string>(),
		only = false,
		class: className = '',
		children
	}: {
		/** White wash over the scene, 0–1 (design.md §2.4: focused / faded states) */
		dim?: number;
		/** Cases drawn above the wash so they stand out */
		spotlight?: ReadonlySet<string>;
		/** Draw only the spotlighted cases and the overlays, for a layer stacked above a wash */
		only?: boolean;
		class?: string;
		/** Overlays positioned in map space (hotspots, bubbles) */
		children?: Snippet;
	} = $props();

	const pct = (v: number, total: number) => `${(v / total) * 100}%`;
	const box = ({ hotspot: h }: Case) =>
		`left:${pct(h.x, MAP_SIZE.width)};top:${pct(h.y, MAP_SIZE.height)};` +
		`width:${pct(h.w, MAP_SIZE.width)};height:${pct(h.h, MAP_SIZE.height)}`;
</script>

<div class="relative aspect-[3241/3242] {className}">
	{#if !only}
		<enhanced:img
			src={bg}
			alt=""
			sizes="(orientation: portrait) 300vh, 200vw"
			class="absolute inset-0 size-full select-none"
			draggable="false"
		/>
	{/if}
	{#each cases as item (item.slug)}
		{#if !only || spotlight.has(item.slug)}
			<enhanced:img
				src={caseImage(item.slug)}
				alt=""
				sizes="25vw"
				loading="lazy"
				class="absolute select-none {spotlight.has(item.slug) ? 'z-20' : 'z-0'}"
				style={box(item)}
				draggable="false"
			/>
		{/if}
	{/each}
	{#if !only}
		<div
			aria-hidden="true"
			class="pointer-events-none absolute inset-0 z-10 bg-white transition-opacity duration-700"
			style="opacity:{dim}"
		></div>
	{/if}
	<div class="absolute inset-0 z-30">
		{@render children?.()}
	</div>
</div>
