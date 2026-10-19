<script lang="ts">
	import { onMount } from 'svelte';
	import { pushState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { trackEvent } from '#lib/analytics.ts';
	import CaseCard from '#lib/components/case/CaseCard.svelte';
	import MapCanvas from '#lib/components/map/MapCanvas.svelte';
	import ExploreNav from '#lib/components/map/ExploreNav.svelte';
	import HintDrawer from '#lib/components/map/HintDrawer.svelte';
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

<section id="explore" class="relative h-dvh">
	<h2 class="sr-only">สืบหา 18 การเลือกปฏิบัติที่ซ่อนอยู่</h2>
	<MapCanvas {game} onselect={openCase} />
	<!-- Figma "kp2-play": exit and reveal buttons top right, hints bottom left -->
	<div class="pointer-events-none absolute inset-0 *:pointer-events-auto">
		<p
			class="absolute top-[79px] left-m rounded-full bg-surface px-m py-s text-b6 text-ink lg:left-[34px]"
			aria-live="polite"
		>
			พบแล้ว {game.found.size}/{game.cases.length} เคส
		</p>
		<div class="absolute top-[79px] right-m lg:right-[34px]"><ExploreNav {game} /></div>
		<div class="absolute bottom-m left-m"><HintDrawer {game} /></div>
	</div>
	<!-- /cases is the accessible alternative to the map; the menu design has no entry for it -->
	<a
		href={resolve('/cases')}
		class="sr-only focus:not-sr-only focus:absolute focus:bottom-m focus:left-m focus:z-30 focus:bg-surface focus:p-s"
		>ดูเคสทั้งหมดแบบรายการ</a
	>
</section>

{#if activeCase}
	<Modal open title={activeCase.titleTh} onclose={() => history.back()}>
		<CaseCard item={activeCase} />
	</Modal>
{/if}
