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
		show,
		mapOverlay,
		children
	}: {
		steps: readonly StoryStep<Id>[];
		active?: Id;
		/** Slugs of the only cases to draw on the map; all of them when omitted */
		show?: readonly string[];
		/** Extra layers in map space (e.g. bubbles pinned to cases); gets the active step id */
		mapOverlay?: Snippet<[Id]>;
		/** The scrolling sections; give each `data-step` and `{@attach track}` */
		children: Snippet<[Track]>;
	} = $props();

	const step = $derived(steps.find((s) => s.id === active) ?? steps[0]);
	const spotlight = $derived(new Set(step.spotlight ?? []));
	const shown = $derived(show && new Set(show));

	/** A step becomes active while its section crosses the middle of the viewport. */
	const hasWash = $derived(steps.some((s) => s.wash));
	const flat = (a: number) => `linear-gradient(rgba(255,255,255,${a}),rgba(255,255,255,${a}))`;
	// Empty until the story is first measured; the prerendered page uses the first step's flat wash.
	let measured = $state('');
	const washBg = $derived(measured || flat(steps[0].wash?.[0] ?? steps[0].dim));

	/**
	 * Lays the wash out in page space, from where each step's section sits in the story, so it
	 * scrolls with the page on the compositor. (Recomputing a screen-space gradient on every scroll
	 * event lagged a frame behind touch scrolling and shimmered on phones.)
	 */
	function watchWash(node: HTMLElement) {
		if (!hasWash) return;
		const update = () => {
			const origin = node.getBoundingClientRect().top;
			const stops: string[] = [];
			for (const el of node.querySelectorAll<HTMLElement>('[data-step]')) {
				const s = steps.find((x) => x.id === el.dataset.step);
				const alphas = s?.wash?.length ? s.wash : [s?.dim ?? 0];
				const rect = el.getBoundingClientRect();
				const top = rect.top - origin;
				const last = Math.max(alphas.length - 1, 1);
				for (const [i, a] of alphas.entries()) {
					stops.push(`rgba(255,255,255,${a}) ${top + (rect.height * i) / last}px`);
				}
				if (alphas.length === 1)
					stops.push(`rgba(255,255,255,${alphas[0]}) ${top + rect.height}px`);
			}
			if (stops.length) measured = `linear-gradient(to bottom,${stops.join(',')})`;
		};
		// Sections only move when the story's layout does, so resizes are all that need watching.
		const ro = new ResizeObserver(update);
		ro.observe(node);
		return () => ro.disconnect();
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
	<!-- The map stays put while the steps scroll over it. lvh, not dvh, so the address bar sliding
	     away on phones doesn't resize it mid-scroll. -->
	<div class="absolute inset-0" aria-hidden="true">
		<div class="sticky top-0 h-lvh overflow-hidden">
			<MapCamera camera={step.camera}>
				<MapScene dim={hasWash ? 0 : step.dim} {spotlight} show={shown}>
					{#if !hasWash}{@render mapOverlay?.(step.id)}{/if}
				</MapScene>
			</MapCamera>
		</div>
	</div>
	{#if hasWash}
		<!-- Page-space wash, with the spotlit cases and overlays redrawn above it -->
		<div
			class="pointer-events-none absolute inset-0"
			style="background:{washBg}"
			aria-hidden="true"
		></div>
		<div class="pointer-events-none absolute inset-0" aria-hidden="true">
			<div class="sticky top-0 h-lvh overflow-hidden">
				<MapCamera camera={step.camera}>
					<MapScene only {spotlight} show={shown}>
						{@render mapOverlay?.(step.id)}
					</MapScene>
				</MapCamera>
			</div>
		</div>
	{/if}

	<div class="relative">
		{@render children(track)}
	</div>
</div>
