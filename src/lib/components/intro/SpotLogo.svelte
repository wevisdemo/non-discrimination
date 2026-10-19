<script lang="ts">
	import logo1 from '#lib/assets/intro/logo-1.svg';
	import logo2 from '#lib/assets/intro/logo-2.svg';
	import logo3 from '#lib/assets/intro/logo-3.svg';
	import logo4 from '#lib/assets/intro/logo-4.svg';
	import logo5 from '#lib/assets/intro/logo-5.svg';
	import logo6 from '#lib/assets/intro/logo-6.svg';
	import logo7 from '#lib/assets/intro/logo-7.svg';
	import logo8 from '#lib/assets/intro/logo-8.svg';

	/** "Spot the Discrimination" lock-up (Figma 571:8299): eight exported SVG layers stacked in one box. */
	const WIDTH = 400;
	const HEIGHT = 139.27;

	/** Position, size and rotation of each layer in Figma px, bottom layer first. */
	const layers = [
		{ src: logo1, x: -5, y: 93.84, w: 410, h: 50.4269 },
		{ src: logo2, x: 96.18, y: -3.12, w: 217.694, h: 94.7351 },
		{ src: logo3, x: 198.16, y: 0, w: 71.108, h: 71.1078 },
		{ src: logo4, x: 0, y: 98.84, w: 400, h: 40.4269 },
		{ src: logo5, x: 198.57, y: 66.67, w: 41.1673, h: 41.1671 },
		{ src: logo6, x: 103.19, y: 3.88, w: 43.8953, h: 62.738 },
		{ src: logo7, x: 152.92, y: 21.8, w: 44.439, h: 63.7538, rotate: 12.03 },
		{ src: logo8, x: 270.05, y: 12.39, w: 31.4191, h: 53.6814, rotate: -14.09 }
	];
</script>

<div
	role="img"
	aria-label="Spot the Discrimination"
	class="relative w-[min(400px,80vw)]"
	style="aspect-ratio:{WIDTH}/{HEIGHT}"
>
	{#each layers as layer (layer.src)}
		<img
			src={layer.src}
			alt=""
			class="absolute max-w-none"
			style="left:{(layer.x / WIDTH) * 100}%;top:{(layer.y / HEIGHT) * 100}%;width:{(layer.w /
				WIDTH) *
				100}%;height:{(layer.h / HEIGHT) * 100}%;{layer.rotate
				? `transform:rotate(${layer.rotate}deg)`
				: ''}"
		/>
	{/each}
</div>
