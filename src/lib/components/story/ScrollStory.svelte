<script lang="ts" module>
	import type { Camera } from '#lib/components/map/MapCamera.svelte';

	/** How the fixed map behind the text looks while one scroll step is on screen. */
	export type StoryStep<Id extends string = string> = {
		id: Id;
		camera: Camera;
		/** White wash over the map, 0–1 */
		dim: number;
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

<div class="relative">
	<!-- The map stays put while the steps scroll over it -->
	<div class="sticky top-0 h-dvh overflow-hidden" aria-hidden="true">
		<MapCamera camera={step.camera}>
			<MapScene dim={step.dim} {spotlight}>
				{@render mapOverlay?.(step.id)}
			</MapScene>
		</MapCamera>
	</div>

	<div class="relative -mt-[100dvh]">
		{@render children(track)}
	</div>
</div>
