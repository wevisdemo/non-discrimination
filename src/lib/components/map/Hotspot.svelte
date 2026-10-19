<script lang="ts">
	import { MAP_SIZE, type Case } from '#lib/content/index.ts';

	let { item, found, onselect }: { item: Case; found: boolean; onselect: (slug: string) => void } =
		$props();

	const pct = (v: number, total: number) => `${(v / total) * 100}%`;
	const style = $derived(
		`left:${pct(item.hotspot.x, MAP_SIZE.width)};top:${pct(item.hotspot.y, MAP_SIZE.height)};` +
			`width:${pct(item.hotspot.w, MAP_SIZE.width)};height:${pct(item.hotspot.h, MAP_SIZE.height)}`
	);
</script>

<!-- No frame, even once found, so the illustration stays clean; only keyboard focus shows an
	outline (layout.css). "Found" is still announced in the label. -->
<button
	type="button"
	class="absolute rounded-card"
	{style}
	aria-label="กรณี: {item.titleTh}{found ? ' (พบแล้ว)' : ''}"
	onclick={() => onselect(item.slug)}
></button>
