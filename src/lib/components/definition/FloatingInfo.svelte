<script lang="ts">
	import { explore } from '#lib/state/explore.svelte.ts';
	import { stageTracker } from '#lib/state/stage.svelte.ts';
	import FullContentPanel from './FullContentPanel.svelte';
	import InfoButton from './InfoButton.svelte';

	/** Figma: อ่านเนื้อหาเต็ม floats bottom right in KP1, KP3 and the Result (the map has its own) */
	const shown = $derived(
		!explore.open && ['definition', 'causes', 'summary'].includes(stageTracker.current)
	);
	let reading = $state(false);
</script>

{#if shown}
	<div class="fixed right-m bottom-m z-30 lg:right-[34px] lg:bottom-[30px]">
		<InfoButton onclick={() => (reading = true)} />
	</div>
{/if}
<FullContentPanel open={reading} onclose={() => (reading = false)} />
