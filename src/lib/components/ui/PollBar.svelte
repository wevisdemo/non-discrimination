<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion, Tween } from 'svelte/motion';

	let { percent }: { percent: number } = $props();

	// The bar fills and the number counts up from 0 once it is on screen; with reduced motion it
	// just shows the final value
	let started = $state(false);
	$effect(() => {
		const frame = requestAnimationFrame(() => (started = true));
		return () => cancelAnimationFrame(frame);
	});
	const shown = Tween.of(() => (started ? percent : 0), {
		duration: () => (prefersReducedMotion.current ? 0 : 900),
		easing: cubicOut
	});
</script>

<!-- Figma Poll answered state: the share of votes as a blue bar on grey, the number at the end -->
<span class="relative mt-xs block h-4 w-full bg-[#d9d9d9]">
	<span class="block h-full bg-primary" style="width:{shown.current}%"></span>
	<span
		class="absolute inset-y-0 right-xs flex items-center text-b6 font-bold {percent > 80
			? 'text-white'
			: 'text-ink'}">{shown.current.toFixed(1)}%</span
	>
</span>
