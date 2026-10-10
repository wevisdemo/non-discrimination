<script lang="ts">
	import type { PanzoomObject } from '@panzoom/panzoom';
	import type { Game } from '#lib/state/game.svelte.ts';
	import Hotspot from './Hotspot.svelte';

	let { game, onselect }: { game: Game; onselect: (slug: string) => void } = $props();

	let pz: PanzoomObject | undefined;

	function panzoom(node: HTMLElement) {
		const parent = node.parentElement!;
		const onWheel = (e: WheelEvent) => pz?.zoomWithWheel(e);
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

<div class="relative h-full w-full overflow-hidden bg-surface-tint">
	<div {@attach panzoom} class="relative aspect-[3241/3242] w-[max(100%,1600px)]">
		<!--
			TODO(M3): replace with the exported master map, e.g.
			<enhanced:img src="#lib/assets/map/bg-final.png" alt="" class="absolute inset-0 size-full" />
		-->
		<div
			aria-hidden="true"
			class="absolute inset-0 bg-[linear-gradient(var(--color-ui-secondary)_1px,transparent_1px),linear-gradient(90deg,var(--color-ui-secondary)_1px,transparent_1px)] bg-[size:4%_4%]"
		></div>
		{#each game.cases as item (item.slug)}
			<Hotspot
				{item}
				found={game.found.has(item.slug)}
				highlighted={game.highlighted.has(item.slug)}
				{onselect}
			/>
		{/each}
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
