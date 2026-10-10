<script lang="ts">
	import { causes } from '#lib/content/index.ts';
	import CauseChip from '#lib/components/ui/CauseChip.svelte';
	import type { Game } from '#lib/state/game.svelte.ts';

	let { game }: { game: Game } = $props();
</script>

<div
	role="group"
	aria-label="กรองตามเหตุแห่งการเลือกปฏิบัติ"
	class="flex gap-s overflow-x-auto pb-xs"
>
	{#each causes as cause (cause.id)}
		<CauseChip
			cause={cause.id}
			selected={game.causeFilter === cause.id}
			onclick={() => (game.causeFilter = game.causeFilter === cause.id ? null : cause.id)}
		/>
	{/each}
</div>
