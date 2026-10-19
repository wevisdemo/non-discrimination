<script lang="ts">
	import type { PanzoomObject } from '@panzoom/panzoom';
	import type { Game } from '#lib/state/game.svelte.ts';
	import Hotspot from './Hotspot.svelte';
	import MapScene from './MapScene.svelte';

	let { game, onselect }: { game: Game; onselect: (slug: string) => void } = $props();

	let pz: PanzoomObject | undefined;

	function panzoom(node: HTMLElement) {
		const parent = node.parentElement!;
		// The map sits inside a scrolling page, so only zoom on Ctrl/⌘+wheel (trackpad pinch sends
		// ctrlKey too); a plain wheel is left alone and scrolls the page past the map.
		const onWheel = (e: WheelEvent) => {
			if (e.ctrlKey || e.metaKey) pz?.zoomWithWheel(e);
		};
		let destroyed = false;

		// Client-only and lazy: the package is CJS (breaks SSR) and the map works without it.
		import('@panzoom/panzoom').then(({ default: Panzoom }) => {
			if (destroyed) return;
			const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
			pz = Panzoom(node, {
				maxScale: 4,
				minScale: 0.5,
				contain: 'outside',
				animate: !reduceMotion
			});
			parent.addEventListener('wheel', onWheel, { passive: false });
		});

		return () => {
			destroyed = true;
			parent.removeEventListener('wheel', onWheel);
			pz?.destroy();
		};
	}
</script>

<div class="relative h-full w-full overflow-hidden bg-surface">
	<div {@attach panzoom} class="w-[max(100%,1600px)]">
		<!-- Reveal / hint: wash the city so highlighted cases pop (design.md §2.4) -->
		<MapScene dim={game.highlighted.size ? 0.6 : 0} spotlight={game.highlighted}>
			{#each game.cases as item (item.slug)}
				<Hotspot
					{item}
					found={game.found.has(item.slug)}
					highlighted={game.highlighted.has(item.slug)}
					{onselect}
				/>
			{/each}
		</MapScene>
	</div>

	<div class="absolute right-m bottom-m flex flex-col gap-xs">
		<button
			type="button"
			class="size-10 rounded-full bg-surface text-b4 text-ink shadow"
			aria-label="ซูมเข้า"
			onclick={() => pz?.zoomIn()}>+</button
		>
		<button
			type="button"
			class="size-10 rounded-full bg-surface text-b4 text-ink shadow"
			aria-label="ซูมออก"
			onclick={() => pz?.zoomOut()}>−</button
		>
	</div>
</div>
