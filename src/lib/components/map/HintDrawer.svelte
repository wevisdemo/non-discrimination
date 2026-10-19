<script lang="ts">
	import { trackEvent } from '#lib/analytics.ts';
	import chevronDown from '#lib/assets/kp2/chevron-down.svg';
	import CauseFilterBar from '#lib/components/map/CauseFilterBar.svelte';
	import type { Game } from '#lib/state/game.svelte.ts';

	let { game }: { game: Game } = $props();

	const open = $derived(game.mode === 'hint');

	function toggle() {
		const next = open ? 'default' : 'hint';
		game.setMode(next);
		trackEvent({ name: 'mode_changed', mode: next });
	}
</script>

<!-- Figma "Hints": the drawer grows upwards from the button -->
<div class="flex max-w-full flex-col items-start gap-m">
	{#if open}<CauseFilterBar {game} />{/if}
	<button
		type="button"
		class="flex items-center justify-center gap-s rounded-lg bg-ui-primary p-s text-b6 text-ink hover:bg-ui-primary-hover"
		aria-expanded={open}
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
