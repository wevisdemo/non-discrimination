<script lang="ts">
	import { definitions, getCause, type CauseId } from '#lib/content/index.ts';
	import SearchCTA from './SearchCTA.svelte';

	let { cause }: { cause: CauseId } = $props();

	const info = $derived(getCause(cause));
	const Body = $derived(definitions.get(cause)!.default);
</script>

<article class="mx-auto flex max-w-[640px] flex-col gap-l">
	<header class="rounded-card bg-ui-primary px-m py-s">
		<p class="text-b6 text-ink">การเลือกปฏิบัติด้วยเหตุแห่ง</p>
		<h1 class="text-h6-m font-bold lg:text-h6">{info.labelTh}</h1>
	</header>
	<div class="prose max-w-none text-body">
		<Body />
	</div>
	<SearchCTA />
</article>
