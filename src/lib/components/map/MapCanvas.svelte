<script lang="ts" module>
	const PAN_MS = 500;
	/** A gentle zoom to focus on a case; kept as the card pages on, never zoomed back out */
	const FOCUS_ZOOM = 1.6;
</script>

<script lang="ts">
	import type { PanzoomObject } from '@panzoom/panzoom';
	import type { Game } from '#lib/state/game.svelte.ts';
	import CauseChip from '#lib/components/ui/CauseChip.svelte';
	import { MAP_SIZE } from '#lib/content/index.ts';
	import Hotspot from './Hotspot.svelte';
	import MapScene from './MapScene.svelte';

	let {
		game,
		follow,
		onselect
	}: {
		game: Game;
		/** The case the map focuses when the card pages ‹ › or เจาะดูทีละภาพ starts */
		follow?: string;
		onselect: (slug: string) => void;
	} = $props();

	let pz: PanzoomObject | undefined;
	let map: HTMLElement | undefined;

	/** The zoom the map had before a case was focused, to go back to when its card closes */
	let scaleBefore: number | undefined;

	/**
	 * Shows the map point (px, py), in map px, at the centre of the screen at zoom `s`.
	 * Panzoom draws `scale(s) translate(x, y)` about the map's centre, hence the translate below.
	 */
	function showAt(px: number, py: number, s: number) {
		if (!pz || !map) return;
		const { clientWidth: cw, clientHeight: ch } = map.parentElement!;
		const { offsetWidth: w, offsetHeight: h } = map;
		// Keep the map covering the screen (what contain:'outside' does), worked out here for the
		// final zoom: Panzoom measures a map mid-transition, so zooming out first then tapping a case
		// made it clamp against the wrong size and land off the case.
		const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
		const x = clamp(
			(cw / 2 - w / 2) / s - px + w / 2,
			(cw - w / 2) / s - w / 2,
			w / 2 - w / (2 * s)
		);
		const y = clamp(
			(ch / 2 - h / 2) / s - py + h / 2,
			(ch - h / 2) / s - h / 2,
			h / 2 - h / (2 * s)
		);
		const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const opts = { animate: !reduceMotion, duration: PAN_MS, easing: 'ease-in-out' };
		pz.setOptions({ contain: undefined });
		pz.zoom(s, opts);
		pz.pan(x, y, opts);
		pz.setOptions({ contain: 'outside' });
	}

	/** Centres a case on screen, zooming in a little if the map is further out (Figma "Case info Animation") */
	function focusCase(slug: string) {
		const item = game.cases.find((c) => c.slug === slug);
		if (!pz || !map || !item) return;
		const k = map.offsetWidth / MAP_SIZE.width;
		const box = item.hotspot;
		const scale = pz.getScale();
		scaleBefore ??= scale;
		showAt((box.x + box.w / 2) * k, (box.y + box.h / 2) * k, Math.max(scale, FOCUS_ZOOM));
	}

	/** Zooms back to where it was before the case, around the same spot, without re-centring */
	function zoomBack() {
		if (!pz || !map || scaleBefore === undefined) return;
		const { clientWidth: cw, clientHeight: ch } = map.parentElement!;
		const { offsetWidth: w, offsetHeight: h } = map;
		const s = pz.getScale();
		const { x, y } = pz.getPan();
		// The map point under the screen centre now, so it stays there at the old zoom
		showAt((cw / 2 - w / 2) / s + w / 2 - x, (ch / 2 - h / 2) / s + h / 2 - y, scaleBefore);
		scaleBefore = undefined;
	}

	// Paging between cases keeps the zoom; closing the card zooms back out on the spot
	let focused = false;
	$effect(() => {
		if (follow) focusCase(follow);
		else if (focused) zoomBack();
		focused = !!follow;
	});

	function panzoom(node: HTMLElement) {
		map = node;
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
			// Open on the junction (the same view as KP1) rather than the map's top-left corner
			const mapWidth = Math.max(parent.clientWidth, 1600);
			pz = Panzoom(node, {
				startX: parent.clientWidth / 2 - 0.53 * mapWidth,
				startY: parent.clientHeight / 2 - 0.53 * mapWidth,
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
		<MapScene dim={game.highlighted.size ? 0.8 : 0} spotlight={game.highlighted}>
			{#each game.cases as item (item.slug)}
				<Hotspot {item} found={game.found.has(item.slug)} {onselect} />
			{/each}
			<!-- Reveal (Figma "ดูเฉลย"): each case's causes as tags below it -->
			{#if game.mode === 'reveal'}
				{#each game.cases as item (item.slug)}
					<ul
						class="pointer-events-none absolute flex -translate-x-1/2 flex-col items-center gap-xs pt-[10px] whitespace-nowrap"
						style="left:{((item.hotspot.x + item.hotspot.w / 2) / MAP_SIZE.width) *
							100}%;top:{((item.hotspot.y + item.hotspot.h) / MAP_SIZE.height) * 100}%"
						aria-hidden="true"
					>
						{#each item.causes as cause (cause)}<li><CauseChip {cause} /></li>{/each}
					</ul>
				{/each}
			{/if}
		</MapScene>
	</div>

	<!-- Above อ่านเนื้อหาเต็ม, which takes the bottom-right corner; phones pinch to zoom instead -->
	<div
		class="absolute right-[34px] bottom-[86px] hidden flex-col gap-xs lg:flex"
		data-tutorial="zoom"
	>
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
