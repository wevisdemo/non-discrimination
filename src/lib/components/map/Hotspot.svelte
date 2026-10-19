<script lang="ts">
	import { MAP_SIZE, type Case } from '#lib/content/index.ts';

	let { item, found, onselect }: { item: Case; found: boolean; onselect: (slug: string) => void } =
		$props();

	const pct = (v: number, total: number) => `${(v / total) * 100}%`;
	/** The found badge is the same size on every case: about 96 map px across */
	const BADGE = 96;
	const style = $derived(
		`left:${pct(item.hotspot.x, MAP_SIZE.width)};top:${pct(item.hotspot.y, MAP_SIZE.height)};` +
			`width:${pct(item.hotspot.w, MAP_SIZE.width)};height:${pct(item.hotspot.h, MAP_SIZE.height)}`
	);
</script>

<!-- No frame, so the illustration stays clean; a found case gets a green check instead. Only
	keyboard focus shows an outline (layout.css). -->
<button
	type="button"
	class="absolute rounded-card"
	{style}
	aria-label="กรณี: {item.titleTh}{found ? ' (พบแล้ว)' : ''}"
	onclick={() => onselect(item.slug)}
>
	{#if found}
		<svg
			aria-hidden="true"
			viewBox="0 0 48 48"
			class="pointer-events-none absolute top-[60%] left-1/2 -translate-1/2"
			style="width:{(BADGE / item.hotspot.w) * 100}%"
		>
			<circle cx="24" cy="24" r="24" fill="#9ddd80" />
			<path
				d="M14 25l7 7 13-15"
				fill="none"
				stroke="#000"
				stroke-width="5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{/if}
</button>
