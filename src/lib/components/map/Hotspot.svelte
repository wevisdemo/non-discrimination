<script lang="ts">
	import { MAP_SIZE, type Case } from '#lib/content/index.ts';

	let {
		item,
		found,
		highlighted,
		onselect
	}: { item: Case; found: boolean; highlighted: boolean; onselect: (slug: string) => void } =
		$props();

	const pct = (v: number, total: number) => `${(v / total) * 100}%`;
	const style = $derived(
		`left:${pct(item.hotspot.x, MAP_SIZE.width)};top:${pct(item.hotspot.y, MAP_SIZE.height)};` +
			`width:${pct(item.hotspot.w, MAP_SIZE.width)};height:${pct(item.hotspot.h, MAP_SIZE.height)}`
	);
</script>

<!-- Invisible until found so players still have to look; in reveal the case itself is drawn
	above the wash (design.md §2.4) -->
<button
	type="button"
	class="absolute rounded-card border-4 transition-colors {highlighted
		? 'border-transparent'
		: found
			? 'border-primary/60'
			: 'border-transparent hover:border-primary/40'}"
	{style}
	aria-label="กรณี: {item.titleTh}{found ? ' (พบแล้ว)' : ''}"
	onclick={() => onselect(item.slug)}
></button>
