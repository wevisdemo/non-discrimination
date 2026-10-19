<script lang="ts" module>
	import blue from '#lib/assets/intro/bubble-blue.svg';
	import orange from '#lib/assets/intro/bubble-orange.svg';
	import yellow from '#lib/assets/intro/bubble-yellow.svg';

	export type BubbleVariant = 'blue' | 'orange' | 'yellow';

	/**
	 * Cloud shapes exported from Figma (frame "m-2" of the Intro), with the text box as a share of
	 * the shape: `x` is its centre, `top` and `w` are measured from the shape's own box.
	 */
	const shapes: Record<
		BubbleVariant,
		{
			src: string;
			w: number;
			h: number;
			rotate: number;
			text: { x: number; top: number; w: number };
		}
	> = {
		blue: { src: blue, w: 205.28, h: 155.515, rotate: 0, text: { x: 50.3, top: 28.8, w: 83.6 } },
		orange: {
			src: orange,
			w: 179.995,
			h: 143.769,
			rotate: 0,
			text: { x: 48.4, top: 30.7, w: 56.6 }
		},
		yellow: {
			src: yellow,
			w: 194.266,
			h: 175.878,
			rotate: 23.66,
			text: { x: 52.5, top: 31.4, w: 62.8 }
		}
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant,
		class: className = '',
		style = '',
		children
	}: { variant: BubbleVariant; class?: string; style?: string; children: Snippet } = $props();

	const shape = $derived(shapes[variant]);
</script>

<div class={className} style="width:{shape.w}px;height:{shape.h}px;{style}">
	<img
		src={shape.src}
		alt=""
		class="absolute inset-0 size-full max-w-none"
		style={shape.rotate ? `transform:rotate(${shape.rotate}deg)` : undefined}
	/>
	<p
		class="absolute -translate-x-1/2 text-center text-b6 whitespace-pre-line text-primary"
		style="left:{shape.text.x}%;top:{shape.text.top}%;width:{shape.text.w}%"
	>
		{@render children()}
	</p>
</div>
