<script lang="ts">
	import { trackEvent } from '#lib/analytics.ts';
	import chevronDown from '#lib/assets/kp2/chevron-down.svg';
	import type { Game } from '#lib/state/game.svelte.ts';

	let { game }: { game: Game } = $props();

	const open = $derived(game.mode === 'hint');

	function toggle() {
		const next = open ? 'default' : 'hint';
		game.setMode(next);
		trackEvent({ name: 'mode_changed', mode: next });
	}
</script>

<!-- Figma "Hints": a bottom sheet listing what there is to find; the toggle sits above it -->
<div class="flex flex-col items-start gap-m">
	<div class={open ? 'pl-m' : 'pb-m pl-m lg:pb-l lg:pl-l'}>
		<button
			type="button"
			class="flex items-center justify-center gap-s rounded-lg bg-ui-primary p-s text-b6 text-ink hover:bg-ui-primary-hover"
			aria-expanded={open}
			aria-controls="hint-list"
			onclick={toggle}
		>
			<img
				src={chevronDown}
				alt=""
				width="22"
				height="22"
				class={open ? 'mix-blend-multiply' : 'rotate-180 mix-blend-multiply'}
			/>
			{open ? 'ปิดตัวช่วย' : 'เปิดตัวช่วย'}
		</button>
	</div>
	{#if open}
		<section
			id="hint-list"
			class="flex w-screen flex-col gap-[5px] rounded-t-card bg-surface p-m"
			aria-labelledby="hint-title"
		>
			<h3 id="hint-title" class="text-b5 font-bold text-ink">
				{game.cases.length} การเลือกปฏิบัติมีอะไรบ้าง ?
			</h3>
			<ul class="flex gap-[10px] overflow-x-auto pb-xs">
				{#each game.cases as item (item.slug)}
					<li
						class="flex w-[166px] shrink-0 items-center justify-center rounded-lg bg-ui-primary p-s text-center text-b6 text-ink"
					>
						{item.titleTh}{#if game.found.has(item.slug)}<span class="sr-only"> (พบแล้ว)</span>{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
