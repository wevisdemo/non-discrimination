<script lang="ts">
	import { resolve } from '$app/paths';
	import { reportingChannels, type Case } from '#lib/content/index.ts';
	import CauseChip from '#lib/components/ui/CauseChip.svelte';

	let { item, headingLevel = 2 }: { item: Case; headingLevel?: 1 | 2 } = $props();
</script>

<article class="flex flex-col gap-m">
	<!-- TODO(M4): case cut-out image (case-{item.slug}.png) as the visual anchor -->
	<svelte:element this={`h${headingLevel}`} class="text-h7-m font-bold lg:text-h7">
		{item.titleTh}
	</svelte:element>
	<p class="text-b5 whitespace-pre-line">{item.summaryTh}</p>

	<dl class="flex flex-col gap-s text-b6">
		<div>
			<dt class="font-bold">สาเหตุแห่งการเลือกปฏิบัติ</dt>
			<dd>
				<ul class="mt-xs flex flex-wrap gap-xs" aria-label="เหตุแห่งการเลือกปฏิบัติ">
					{#each item.causes as cause (cause)}
						<li><CauseChip {cause} /></li>
					{/each}
				</ul>
			</dd>
		</div>
		<div>
			<dt class="font-bold">มิติแห่งการเลือกปฏิบัติ</dt>
			<dd>{item.dimensionTh}</dd>
		</div>
		<div>
			<dt class="font-bold">รูปแบบของการเลือกปฏิบัติ</dt>
			<dd>{item.formsTh.join(', ')}</dd>
		</div>
		<div>
			<dt class="font-bold">ผู้กระทำ</dt>
			<dd>{item.perpetratorTh}</dd>
		</div>
		<div>
			<dt class="font-bold">ผู้ได้รับผลกระทบ</dt>
			<dd>{item.affectedTh}</dd>
		</div>
	</dl>

	{#if item.noteTh}
		<section class="rounded-card bg-ui-secondary p-m text-b6 text-ink">
			<svelte:element this={`h${headingLevel + 1}`} class="font-bold"
				>บันทึกเพิ่มเติม</svelte:element
			>
			<p class="whitespace-pre-line">{item.noteTh}</p>
		</section>
	{/if}
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

	<!-- Same for every case in the datasheet -->
	<section class="flex flex-col gap-xs text-b6" aria-label="ช่องทางแจ้งเหตุ">
		<svelte:element this={`h${headingLevel + 1}`} class="font-bold">
			ช่องทางแจ้งเหตุ: {reportingChannels.office}
		</svelte:element>
		<p>Facebook: {reportingChannels.facebook}</p>
		<p>
			ช่องทางรับเรื่องออนไลน์:
			<a
				class="underline hover:text-primary"
				href={reportingChannels.complaintsUrl}
				rel="noopener external">{reportingChannels.complaintsUrl}</a
			>
		</p>
		<p>
			สายด่วน: <a class="underline hover:text-primary" href="tel:1377"
				>{reportingChannels.hotline}</a
			>
		</p>
	</section>
</article>
