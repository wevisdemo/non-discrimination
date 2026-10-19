<script lang="ts" module>
	import type { Camera } from '#lib/components/map/MapCamera.svelte';

	/** How the fixed map behind the text looks while one scroll step is on screen. */
	export type StoryStep<Id extends string = string> = {
		id: Id;
		camera: Camera;
		/** White wash over the map, 0–1 */
		dim: number;
		/**
		 * Opt-in scroll-linked wash: alphas spaced evenly from the top to the bottom of the step's
		 * section, so the tone grades as you scroll (e.g. `[0.8, 0, 0.8]` lifts then returns).
		 * When any step sets it, every step is washed this way and `dim` is the flat fallback.
		 */
		wash?: readonly number[];
		/** Cases drawn above the wash */
		spotlight?: readonly string[];
	};

	/** Attach to each step's <section data-step="…"> so the story knows which step is active. */
	export type Track = (node: HTMLElement) => () => void;
</script>

<script lang="ts" generics="Id extends string">
	import type { Snippet } from 'svelte';
	import MapCamera from '#lib/components/map/MapCamera.svelte';
	import MapScene from '#lib/components/map/MapScene.svelte';

	let {
		steps,
		active = $bindable(steps[0].id),
		mapOverlay,
		children
	}: {
		steps: readonly StoryStep<Id>[];
		active?: Id;
		/** Extra layers in map space (e.g. bubbles pinned to cases); gets the active step id */
		mapOverlay?: Snippet<[Id]>;
		/** The scrolling sections; give each `data-step` and `{@attach track}` */
		children: Snippet<[Track]>;
	} = $props();

	const step = $derived(steps.find((s) => s.id === active) ?? steps[0]);
	const spotlight = $derived(new Set(step.spotlight ?? []));

	/** A step becomes active while its section crosses the middle of the viewport. */
	const hasWash = $derived(steps.some((s) => s.wash));
	const flat = (a: number) => `linear-gradient(rgba(255,255,255,${a}),rgba(255,255,255,${a}))`;
	// Empty until the first scroll measurement; the prerendered page uses the first step's flat wash.
	let measured = $state('');
	const washBg = $derived(measured || flat(steps[0].wash?.[0] ?? steps[0].dim));

	/** Grades the wash down the screen from where each step's section sits as the page scrolls. */
	function watchWash(node: HTMLElement) {
		if (!hasWash) return;
		let frame = 0;
		const update = () => {
			frame = 0;
			const stops: string[] = [];
			for (const el of node.querySelectorAll<HTMLElement>('[data-step]')) {
				const s = steps.find((x) => x.id === el.dataset.step);
				const alphas = s?.wash?.length ? s.wash : [s?.dim ?? 0];
				const { top, height } = el.getBoundingClientRect();
				const last = Math.max(alphas.length - 1, 1);
				for (const [i, a] of alphas.entries()) {
					stops.push(`rgba(255,255,255,${a}) ${top + (height * i) / last}px`);
				}
				if (alphas.length === 1) stops.push(`rgba(255,255,255,${alphas[0]}) ${top + height}px`);
			}
			if (stops.length) measured = `linear-gradient(to bottom,${stops.join(',')})`;
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		update();
		addEventListener('scroll', schedule, { passive: true });
		addEventListener('resize', schedule);
		return () => {
			cancelAnimationFrame(frame);
			removeEventListener('scroll', schedule);
			removeEventListener('resize', schedule);
		};
	}

	const track: Track = (node) => {
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) active = (e.target as HTMLElement).dataset.step as Id;
				}
			},
			{ rootMargin: '-50% 0px -50% 0px' }
		);
		io.observe(node);
		return () => io.disconnect();
	};
</script>

<div class="relative" {@attach watchWash}>
	<!-- The map stays put while the steps scroll over it -->
	<div class="sticky top-0 h-dvh overflow-hidden" aria-hidden="true">
		<MapCamera camera={step.camera}>
			<MapScene dim={hasWash ? 0 : step.dim} {spotlight}>
				{#if !hasWash}{@render mapOverlay?.(step.id)}{/if}
			</MapScene>
		</MapCamera>
		{#if hasWash}
			<!-- Screen-space wash, with the spotlit cases and overlays redrawn above it -->
			<div class="pointer-events-none absolute inset-0" style="background:{washBg}"></div>
			<MapCamera camera={step.camera}>
				<MapScene only {spotlight}>
					{@render mapOverlay?.(step.id)}
				</MapScene>
			</MapCamera>
		{/if}
	</div>

	<div class="relative -mt-[100dvh]">
		{@render children(track)}
	</div>
</div>
