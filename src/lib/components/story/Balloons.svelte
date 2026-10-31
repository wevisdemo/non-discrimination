<script lang="ts">
	import type { Balloon } from '#lib/content/kp1.ts';

	let { items }: { items: readonly Balloon[] } = $props();
</script>

<!-- Decorative: the sections list the same text for screen readers -->
<div
	aria-hidden="true"
	class="pointer-events-none absolute top-1/2 left-1/2 h-[480px] w-[320px] -translate-x-1/2 -translate-y-1/2"
>
	{#each items as b (b.text)}
		<!-- Each cloud fades with its text, in step with the others (Figma "Balloon_animate") -->
		<div class="absolute inset-0 opacity-80 motion-safe:animate-balloon-fade">
			<img
				src={b.src}
				alt=""
				class="absolute max-w-none {b.pulse ? 'motion-safe:animate-balloon-pulse' : ''}"
				style="left:{b.x}px;top:{b.y}px;width:{b.w}px;height:{b.h}px;--pulse:{b.pulse ?? 1}"
			/>
			<p
				class="absolute -translate-x-1/2 text-center text-b5 leading-normal whitespace-pre text-primary"
				style="left:{b.textX}px;top:{b.textY}px"
			>
				{b.text}
			</p>
		</div>
	{/each}
</div>
