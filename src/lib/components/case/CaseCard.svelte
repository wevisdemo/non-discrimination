<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Case } from '#lib/content/index.ts';
	import CauseChip from '#lib/components/ui/CauseChip.svelte';

	let { item, headingLevel = 2 }: { item: Case; headingLevel?: 1 | 2 } = $props();
</script>

<article class="flex flex-col gap-m">
	<!-- TODO(M4): case cut-out image (case-{item.slug}.png) as the visual anchor -->
	<svelte:element this={`h${headingLevel}`} class="text-h7-m font-bold lg:text-h7">
		{item.titleTh}
	</svelte:element>
	<ul class="flex flex-wrap gap-xs" aria-label="เหตุแห่งการเลือกปฏิบัติ">
		{#each item.causes as cause (cause)}
			<li><CauseChip {cause} /></li>
		{/each}
	</ul>
	<p class="text-b5">{item.summaryTh}</p>
	{#if item.law.length}
		<dl class="rounded-card bg-ui-secondary p-m text-b6 text-ink">
			{#each item.law as law (law.name + law.section)}
				<dt class="font-bold">{law.name}</dt>
				<dd>{law.section}</dd>
			{/each}
		</dl>
	{/if}
	<nav aria-label="นิยามที่เกี่ยวข้อง" class="flex flex-col gap-xs text-b6">
		{#each item.causes as cause (cause)}
			<a
				class="text-ink underline hover:text-primary"
				href={resolve('/definition/[cause]', { cause })}
			>
				อ่านนิยามการเลือกปฏิบัติเรื่องนี้ →
			</a>
		{/each}
	</nav>
</article>
