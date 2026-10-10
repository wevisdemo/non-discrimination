<script lang="ts">
	import { resolve } from '$app/paths';
	import { cases } from '#lib/content/index.ts';
	import CauseChip from '#lib/components/ui/CauseChip.svelte';
</script>

<ul class="grid gap-m md:grid-cols-2 lg:grid-cols-3">
	{#each cases as item (item.slug)}
		<li class="rounded-card bg-surface-tint p-m">
			<a
				class="font-header text-b4 font-bold text-primary hover:underline"
				href={resolve('/cases/[slug]', { slug: item.slug })}>{item.titleTh}</a
			>
			<div class="mt-s flex flex-wrap gap-xs">
				{#each item.causes as cause (cause)}<CauseChip {cause} />{/each}
			</div>
		</li>
	{/each}
</ul>
