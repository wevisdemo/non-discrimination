<script lang="ts">
	import type { Snippet } from 'svelte';
	import chevron from '#lib/assets/definition/accordion-chevron.svg';

	let {
		title,
		subtitle,
		open = $bindable(false),
		children
	}: { title: string; subtitle?: Snippet; open?: boolean; children: Snippet } = $props();

	const id = $props.id();
</script>

<!-- Figma "Accordion_how" / "Accordion_frequent": pink header, blue body -->
<div class="flex w-full flex-col">
	<button
		type="button"
		class="flex w-full items-start gap-s bg-ui-primary p-m text-left hover:bg-ui-primary-hover {open
			? 'rounded-t-card'
			: 'rounded-card'}"
		aria-expanded={open}
		aria-controls="{id}-body"
		onclick={() => (open = !open)}
	>
		<span class="flex flex-1 flex-col text-ink">
			<span class="text-b5 font-bold">{title}</span>
			{#if subtitle}<span class="text-b6">{@render subtitle()}</span>{/if}
		</span>
		<img
			src={chevron}
			alt=""
			width="22"
			height="22"
			class="shrink-0 mix-blend-multiply {open ? 'rotate-180' : ''}"
		/>
	</button>
	{#if open}
		<div
			id="{id}-body"
			class="flex flex-col gap-m rounded-b-card bg-ui-secondary p-m text-b6 text-primary"
		>
			{@render children()}
		</div>
	{/if}
</div>
