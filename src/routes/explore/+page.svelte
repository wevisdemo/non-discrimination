<script lang="ts">
	import { onMount } from 'svelte';
	import { pushState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { trackEvent } from '#lib/analytics.ts';
	import CaseCard from '#lib/components/case/CaseCard.svelte';
	import CauseFilterBar from '#lib/components/map/CauseFilterBar.svelte';
	import MapCanvas from '#lib/components/map/MapCanvas.svelte';
	import ModeControls from '#lib/components/map/ModeControls.svelte';
	import Modal from '#lib/components/ui/Modal.svelte';
	import { cases, getCase } from '#lib/content/index.ts';
	import { Game } from '#lib/state/game.svelte.ts';
	import { LocalProgressStore } from '#lib/state/progress.ts';

	const game = new Game(cases, new LocalProgressStore());
	onMount(() => game.restore());

	const activeCase = $derived(page.state.caseSlug ? getCase(page.state.caseSlug) : undefined);

	function openCase(slug: string) {
		if (!game.found.has(slug)) trackEvent({ name: 'case_found', slug });
		game.markFound(slug);
		trackEvent({ name: 'case_opened', slug });
		// Shallow routing: URL becomes shareable /cases/<slug>/, back button closes the card.
		pushState(resolve('/cases/[slug]', { slug }), { caseSlug: slug });
	}
</script>

<svelte:head><title>สำรวจเมือง · ไม่เลือกปฏิบัติ</title></svelte:head>

<h1 class="sr-only">สำรวจเมือง</h1>
<div class="relative h-[calc(100dvh-5rem)]">
	<MapCanvas {game} onselect={openCase} />
	<div
		class="pointer-events-none absolute inset-x-m top-m flex flex-col gap-s *:pointer-events-auto"
	>
		<ModeControls {game} />
		{#if game.mode === 'hint'}<CauseFilterBar {game} />{/if}
	</div>
</div>

{#if activeCase}
	<Modal open title={activeCase.titleTh} onclose={() => history.back()}>
		<CaseCard item={activeCase} />
	</Modal>
{/if}
