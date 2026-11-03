<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { goto, pushState, replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { trackEvent } from '#lib/analytics.ts';
	import CasePanel from '#lib/components/case/CasePanel.svelte';
	import FullContentPanel from '#lib/components/definition/FullContentPanel.svelte';
	import InfoButton from '#lib/components/definition/InfoButton.svelte';
	import MapCanvas from '#lib/components/map/MapCanvas.svelte';
	import ExploreNav from '#lib/components/map/ExploreNav.svelte';
	import HintDrawer from '#lib/components/map/HintDrawer.svelte';
	import Tutorial from '#lib/components/map/Tutorial.svelte';
	import { cases, getCase } from '#lib/content/index.ts';
	import { explore } from '#lib/state/explore.svelte.ts';
	import { Game } from '#lib/state/game.svelte.ts';
	import { LocalProgressStore } from '#lib/state/progress.ts';

	const game = new Game(cases, new LocalProgressStore());
	let reading = $state(false);
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

	/** Leave the tutorial for the game itself; replaced, so Back still returns to KP1 */
	function endTutorial() {
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- in-page hash
		goto('#explore', { replace: true, reset: false });
	}

	// Tapping a case, ‹ › and เจาะดูทีละภาพ: the card fades out, the map moves to the case, and the
	// card fades back in this long after the map starts moving (the move itself takes 0.5s)
	const SHOW_AFTER_MS = 800;
	let following = $state<string>();
	let cardHidden = $state(false);
	let moving = false;
	const wait = (ms: number) => new Promise((done) => setTimeout(done, ms));
	const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

	$effect(() => {
		if (!activeCase) following = undefined;
	});

	async function moveTo(slug: string, navigate: () => void, opening = false) {
		if (moving) return;
		moving = true;
		cardHidden = true;
		if (activeCase) await wait(fadeMs());
		// Closed while fading: don't reopen it
		if (opening || activeCase) {
			navigate();
			following = slug;
			await wait(reduceMotion() ? 0 : SHOW_AFTER_MS);
		}
		cardHidden = false;
		moving = false;
	}

	/** Tapping a case: the map zooms in on it, then its card fades in */
	function openCase(slug: string) {
		if (!game.found.has(slug)) trackEvent({ name: 'case_found', slug });
		game.markFound(slug);
		trackEvent({ name: 'case_opened', slug });
		// Shallow routing: URL becomes shareable /cases/<slug>/, back button closes the card.
		moveTo(slug, () => pushState(resolve('/cases/[slug]', { slug }), { caseSlug: slug }), true);
	}

	/** เจาะดูทีละภาพ: open the first case and step through them with ‹ › */
	function startStepping() {
		const slug = cases[0].slug;
		trackEvent({ name: 'mode_changed', mode: 'stepping' });
		moveTo(
			slug,
			() => pushState(resolve('/cases/[slug]', { slug }), { caseSlug: slug, stepping: true }),
			true
		);
	}

	/** ‹ › replace the open card, so Back still closes the panel in one step */
	function step(by: number) {
		if (!activeCase) return;
		const next = cases[cases.indexOf(activeCase) + by];
		if (!next) return;
		trackEvent({ name: 'case_opened', slug: next.slug });
		moveTo(next.slug, () =>
			replaceState(resolve('/cases/[slug]', { slug: next.slug }), {
				...page.state,
				caseSlug: next.slug
			})
		);
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
		<MapCanvas {game} follow={following} onselect={openCase} />
		<!-- Figma "kp2-play": exit and reveal buttons top right, hints bottom left -->
		<div class="pointer-events-none absolute inset-0 z-[2] *:pointer-events-auto">
			<!-- Figma mobile has no counter; phones keep it for screen readers only -->
			<p
				class="absolute top-[79px] left-m rounded-full bg-surface px-m py-s text-b6 text-ink max-lg:sr-only lg:left-[34px]"
				aria-live="polite"
				data-tutorial="counter"
			>
				พบแล้ว {game.found.size}/{game.cases.length} เคส
			</p>
			<div class="absolute top-[79px] right-m lg:right-[34px]">
				<ExploreNav {game} stepping={!!page.state.stepping} onstep={startStepping} />
			</div>
			<div class="absolute bottom-0 left-0 z-10"><HintDrawer {game} /></div>
			<div class="absolute right-m bottom-m lg:right-[34px] lg:bottom-[30px]" data-tutorial="info">
				<InfoButton onclick={() => (reading = true)} />
			</div>
		</div>
		<FullContentPanel open={reading} onclose={() => (reading = false)} inGame />
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
		hidden={cardHidden}
		onprev={() => step(-1)}
		onnext={() => step(1)}
	/>
{/if}
