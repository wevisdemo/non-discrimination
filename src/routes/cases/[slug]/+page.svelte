<script lang="ts">
	import CaseCard from '#lib/components/case/CaseCard.svelte';
	import SearchCTA from '#lib/components/definition/SearchCTA.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.item.titleTh} · ไม่เลือกปฏิบัติ</title>
	<meta property="og:title" content={data.item.titleTh} />
	<meta property="og:description" content={data.item.summaryTh} />
</svelte:head>

<div class="mx-auto flex w-full max-w-[640px] flex-col gap-xl px-m py-xl">
	<CaseCard item={data.item} headingLevel={1} />
	<SearchCTA />
</div>
