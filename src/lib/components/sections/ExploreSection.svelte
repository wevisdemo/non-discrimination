<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { goto, pushState, replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { trackEvent } from '#lib/analytics.ts';
	import CasePanel from '#lib/components/case/CasePanel.svelte';
	import MapCanvas from '#lib/components/map/MapCanvas.svelte';
	import ExploreNav from '#lib/components/map/ExploreNav.svelte';
	import HintDrawer from '#lib/components/map/HintDrawer.svelte';
	import Tutorial from '#lib/components/map/Tutorial.svelte';
	import { cases, getCase } from '#lib/content/index.ts';
	import { explore } from '#lib/state/explore.svelte.ts';
	import { Game } from '#lib/state/game.svelte.ts';
	import { LocalProgressStore } from '#lib/state/progress.ts';

	const game = new Game(cases, new LocalProgressStore());
	onMount(() => game.restore());

	// Only the page's scrollbar is locked while the map is up; the map pans and zooms itself
	$effect(() => {
		if (!explore.open) return;
		const root = document.documentElement;
		const before = root.style.overflow;
		root.style.overflow = 'hidden';
		return () => (root.style.overflow = before);
	});

	const fadeMs = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 250);

	const activeCase = $derived(page.state.caseSlug ? getCase(page.state.caseSlug) : undefined);

	function openCase(slug: string) {
		if (!game.found.has(slug)) trackEvent({ name: 'case_found', slug });
		game.markFound(slug);
		trackEvent({ name: 'case_opened', slug });
		// Shallow routing: URL becomes shareable /cases/<slug>/, back button closes the card.
		pushState(resolve('/cases/[slug]', { slug }), { caseSlug: slug });
	}

	/** Leave the tutorial for the game itself; replaced, so Back still returns to KP1 */
	function endTutorial() {
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- in-page hash
		goto('#explore', { replace: true, reset: false });
	}

	/** เจาะดูทีละภาพ: open the first case and step through them with ‹ › */
	function startStepping() {
		const slug = cases[0].slug;
		trackEvent({ name: 'mode_changed', mode: 'stepping' });
		pushState(resolve('/cases/[slug]', { slug }), { caseSlug: slug, stepping: true });
	}

	/** ‹ › replace the open card, so Back still closes the panel in one step */
	function step(by: number) {
		if (!activeCase) return;
		const next = cases[cases.indexOf(activeCase) + by];
		if (!next) return;
		trackEvent({ name: 'case_opened', slug: next.slug });
		replaceState(resolve('/cases/[slug]', { slug: next.slug }), {
			...page.state,
			caseSlug: next.slug
		});
	}
</script>

{#if explore.open}
	<!-- Full-screen overlay (Figma "kp2-play"); the header floats above it at z-40 -->
	<div
		id="explore"
		role="dialog"
		aria-modal="true"
		aria-labelledby="explore-title"
		tabindex="-1"
		class="fixed inset-0 z-[35] bg-surface outline-none"
		transition:fade={{ duration: fadeMs() }}
		{@attach (node) => node.focus({ preventScroll: true })}
	>
		<h2 id="explore-title" class="sr-only">สืบหา 18 การเลือกปฏิบัติที่ซ่อนอยู่</h2>
		<MapCanvas {game} onselect={openCase} />
		<!-- Figma "kp2-play": exit and reveal buttons top right, hints bottom left -->
		<div class="pointer-events-none absolute inset-0 z-[2] *:pointer-events-auto">
			<p
				class="absolute top-[79px] left-m rounded-full bg-surface px-m py-s text-b6 text-ink lg:left-[34px]"
				aria-live="polite"
				data-tutorial="counter"
			>
				พบแล้ว {game.found.size}/{game.cases.length} เคส
			</p>
			<div class="absolute top-[79px] right-m lg:right-[34px]">
				<ExploreNav {game} stepping={!!page.state.stepping} onstep={startStepping} />
			</div>
			<div class="absolute bottom-0 left-0"><HintDrawer {game} /></div>
		</div>
		{#if explore.tutorial}<Tutorial onfinish={endTutorial} />{/if}
		<!-- /cases is the accessible alternative to the map; the menu design has no entry for it -->
		<a
			href={resolve('/cases')}
			class="sr-only focus:not-sr-only focus:absolute focus:bottom-m focus:left-m focus:z-30 focus:bg-surface focus:p-s"
			>ดูเคสทั้งหมดแบบรายการ</a
		>
	</div>
{/if}

{#if activeCase}
	<CasePanel
		item={activeCase}
		onclose={() => history.back()}
		onprev={() => step(-1)}
		onnext={() => step(1)}
	/>
{/if}
