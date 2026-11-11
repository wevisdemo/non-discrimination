<script lang="ts">
	import CauseChip from '#lib/components/ui/CauseChip.svelte';
	import { MAP_SIZE, type Case } from '#lib/content/index.ts';
	import { layoutChips, type Rect } from './chipLayout.ts';

	let { cases }: { cases: readonly Case[] } = $props();

	// Reveal (Figma "ดูเฉลย"): each case's causes as tags near it. Sized in the map's own layout, so
	// the whole thing zooms with the map and the places stay right at any zoom.
	let width = $state(0);
	let height = $state(0);
	const groups: Record<string, HTMLElement | undefined> = $state({});
	let spots = $state<Map<string, Rect>>();

	const boxOf = ({ hotspot: h }: Case): Rect => {
		const k = width / MAP_SIZE.width;
		return { x: h.x * k, y: h.y * k, w: h.w * k, h: h.h * k };
	};

	// Measure each group of tags once they are drawn, then find them spots that do not collide
	$effect(() => {
		if (!width || !height) return;
		const items = cases.flatMap((item) => {
			const el = groups[item.slug];
			return el
				? [
						{
							id: item.slug,
							box: boxOf(item),
							w: el.offsetWidth,
							h: el.offsetHeight,
							above: item.tagsAbove
						}
					]
				: [];
		});
		spots = layoutChips(items, { w: width, h: height });
	});
</script>

<div
	class="pointer-events-none absolute inset-0"
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	{#each cases as item (item.slug)}
		{@const at = spots?.get(item.slug)}
		<ul
			bind:this={groups[item.slug]}
			class="absolute flex flex-col items-center gap-xs whitespace-nowrap {at ? '' : 'invisible'}"
			style="left:{at?.x ?? 0}px;top:{at?.y ?? 0}px"
			aria-hidden="true"
		>
			{#each item.causes as cause (cause)}<li><CauseChip {cause} /></li>{/each}
		</ul>
	{/each}
</div>
