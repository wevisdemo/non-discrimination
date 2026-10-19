<script lang="ts">
	import book from '#lib/assets/definition/declaration-book.svg';
	import bg from '#lib/assets/definition/declaration-bg.png';
	import line1 from '#lib/assets/definition/declaration-line-1.svg';
	import line2 from '#lib/assets/definition/declaration-line-2.svg';
	import line3 from '#lib/assets/definition/declaration-line-3.svg';
	import line4 from '#lib/assets/definition/declaration-line-4.svg';
	import dimension from '#lib/assets/definition/dimension.png';
	import offender from '#lib/assets/definition/offender.png';
	import victim from '#lib/assets/definition/victim.png';

	/** The round spot illustrations in the full-content panel (Figma "Layer_2") */
	let { kind }: { kind: 'declaration' | 'dimension' | 'victim' | 'offender' } = $props();
</script>

<div
	class="relative size-[88.8px] shrink-0 overflow-clip rounded-full bg-surface-tint"
	aria-hidden="true"
>
	{#if kind === 'declaration'}
		<!-- Layers at the insets Figma exports them with -->
		{#each [[bg, '6.64% -0.15% 6.64% -7.96%'], [book, '37.26% 51.02% 40.05% 18.9%'], [line1, '32.55% 50.53% 66.33% 19.07%'], [line2, '26.91% 49.4% 70.83% 19.07%'], [line3, '67.45% 51.65% 31.42% 16.81%'], [line4, '62.95% 51.65% 35.92% 16.81%']] as [src, inset] (src)}
			<span class="absolute" style="inset:{inset}"
				><img {src} alt="" class="size-full max-w-none" /></span
			>
		{/each}
	{:else if kind === 'dimension'}
		<img
			src={dimension}
			alt=""
			class="absolute top-[7.2px] left-0 h-[74px] w-[86px] object-cover"
		/>
	{:else if kind === 'victim'}
		<img
			src={victim}
			alt=""
			class="absolute top-1/2 left-1/2 h-[92px] w-[80px] -translate-1/2 object-cover"
		/>
	{:else}
		<img
			src={offender}
			alt=""
			class="absolute top-1/2 left-1/2 h-[104px] w-[90px] -translate-1/2 object-cover"
		/>
	{/if}
</div>
