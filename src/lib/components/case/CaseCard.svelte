<script lang="ts">
	import chevronMuted from '#lib/assets/kp2/chevron-muted.svg';
	import chevron from '#lib/assets/kp2/chevron.svg';
	import { cases, type Case } from '#lib/content/index.ts';
	import CauseChip from '#lib/components/ui/CauseChip.svelte';
	import { caseImage } from './caseImage.ts';
	import CasePoll from './CasePoll.svelte';
	import ReportingChannels from './ReportingChannels.svelte';

	let {
		item,
		headingLevel = 2,
		onprev,
		onnext
	}: {
		item: Case;
		headingLevel?: 1 | 2;
		/** ‹ › between cases; left out on the standalone case page */
		onprev?: () => void;
		onnext?: () => void;
	} = $props();

	const sub = $derived(headingLevel === 1 ? 2 : 3);
	const isFirst = $derived(item.order === 1);
	const isLast = $derived(item.order === cases.length);
</script>

<!-- Figma "kp2-info": the case card, in the map's side panel and on /cases/<slug>/ -->
<article class="flex flex-col gap-s">
	<div class="flex justify-center">
		<enhanced:img
			src={caseImage(item.slug)}
			alt=""
			sizes="160px"
			class="h-[163px] w-auto object-contain"
		/>
	</div>
	<p class="text-center text-[12px] leading-[1.4] text-[#767676]">{item.order}/{cases.length}</p>

	<div class="flex items-center gap-s">
		{#if onprev}
			<button
				type="button"
				class="shrink-0 disabled:cursor-not-allowed"
				aria-label="เคสก่อนหน้า"
				disabled={isFirst}
				onclick={onprev}
			>
				<img
					src={isFirst ? chevronMuted : chevron}
					alt=""
					width="32"
					height="32"
					class="rotate-180"
				/>
			</button>
		{/if}
		<svelte:element
			this={`h${headingLevel}`}
			class="flex-1 text-center font-header text-[18px] leading-[1.4] font-bold text-ink"
		>
			{item.titleTh}
		</svelte:element>
		{#if onnext}
			<button
				type="button"
				class="shrink-0 disabled:cursor-not-allowed"
				aria-label="เคสถัดไป"
				disabled={isLast}
				onclick={onnext}
			>
				<img src={isLast ? chevronMuted : chevron} alt="" width="32" height="32" />
			</button>
		{/if}
	</div>

	<div class="flex flex-col gap-l">
		<div class="flex flex-col gap-m">
			<p class="text-b6 whitespace-pre-line text-ink">{item.summaryTh}</p>
			<hr class="border-ink" />

			<dl class="flex flex-col gap-s text-b6">
				<div class="flex flex-col gap-xs">
					<dt class="text-[#767676]">เหตุแห่งการเลือกปฏิบัติ:</dt>
					<dd>
						<ul class="flex flex-wrap gap-xs">
							{#each item.causes as cause (cause)}
								<li><CauseChip {cause} /></li>
							{/each}
						</ul>
					</dd>
				</div>
				<div class="flex flex-col gap-xs">
					<dt class="text-[#767676]">มิติแห่งการเลือกปฏิบัติ</dt>
					<dd class="font-bold text-ink">{item.dimensionTh}</dd>
				</div>
				<div class="flex flex-col gap-xs">
					<dt class="text-[#767676]">รูปแบบของการเลือกปฏิบัติ</dt>
					<dd class="font-bold text-ink">{item.formsTh.join(', ')}</dd>
				</div>
				<div class="flex flex-col gap-xs">
					<dt class="text-[#767676]">ผู้กระทำ</dt>
					<dd class="font-bold text-ink">{item.perpetratorTh}</dd>
				</div>
				<div class="flex flex-col gap-xs">
					<dt class="text-[#767676]">ผู้ได้รับผลกระทบ</dt>
					<dd class="font-bold text-ink">{item.affectedTh}</dd>
				</div>
			</dl>

			{#if item.noteTh}
				<section class="flex flex-col gap-xs rounded-card bg-surface-tint p-m text-b6 text-ink">
					<svelte:element this={`h${sub}`} class="font-bold">บันทึกเพิ่มเติม</svelte:element>
					<p class="whitespace-pre-line">{item.noteTh}</p>
				</section>
			{/if}

			<CasePoll slug={item.slug} headingLevel={sub} />
		</div>

		<ReportingChannels headingLevel={sub} />
	</div>
</article>
