<script lang="ts">
	import { resolve } from '$app/paths';
	import MapCamera from '#lib/components/map/MapCamera.svelte';
	import MapScene from '#lib/components/map/MapScene.svelte';
	import { getCase, MAP_SIZE } from '#lib/content/index.ts';
	import { introBubbles, introSteps, type IntroStep } from '#lib/content/intro.ts';

	let active = $state<IntroStep['id']>('question');
	const step = $derived(introSteps.find((s) => s.id === active)!);
	const showBubbles = $derived(active === 'bubbles');
	const spotlight = $derived(new Set(showBubbles ? introBubbles.map((b) => b.slug) : []));

	// TODO: point at KP1 once it is built; the prototype's CTA continues to KP1.
	const next = resolve('/explore');

	/** Marks a section as the active step while it crosses the middle of the viewport. */
	function track(node: HTMLElement) {
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) active = (e.target as HTMLElement).dataset.step as IntroStep['id'];
				}
			},
			{ rootMargin: '-50% 0px -50% 0px' }
		);
		io.observe(node);
		return () => io.disconnect();
	}

	function bubbleStyle(slug: string) {
		const { hotspot: h } = getCase(slug)!;
		return `left:${((h.x + h.w / 2) / MAP_SIZE.width) * 100}%;top:${(h.y / MAP_SIZE.height) * 100}%`;
	}
</script>

<svelte:head><title>Spot the Discrimination · ไม่เลือกปฏิบัติ</title></svelte:head>

<div class="relative">
	<!-- The map stays put while the steps scroll over it (Figma flow "DE-Intro") -->
	<div class="sticky top-0 h-dvh overflow-hidden" aria-hidden="true">
		<MapCamera camera={step.camera}>
			<MapScene dim={step.dim} {spotlight}>
				{#each introBubbles as bubble (bubble.slug)}
					<p
						class="absolute w-56 -translate-x-1/2 -translate-y-full rounded-[2rem] bg-ui-secondary px-m py-s text-center text-b6 text-primary shadow transition-opacity duration-700 lg:w-72 lg:text-b5"
						class:opacity-0={!showBubbles}
						style={bubbleStyle(bubble.slug)}
					>
						{bubble.text}
					</p>
				{/each}
			</MapScene>
		</MapCamera>
	</div>

	<div class="relative -mt-[100dvh]">
		<section
			data-step="question"
			{@attach track}
			class="flex h-dvh items-center justify-center px-m"
		>
			<h1 class="text-center text-h6-m leading-snug font-bold lg:text-h3">
				คุณเห็น<br />ความผิดปกติ<br />ในภาพนี้หรือไม่ ?
			</h1>
		</section>

		<section data-step="city" {@attach track} class="h-dvh" aria-hidden="true"></section>

		<section data-step="bubbles" {@attach track} class="h-dvh">
			<!-- Visual bubbles are decorative; this list carries the same text for screen readers -->
			<ul class="sr-only">
				{#each introBubbles as bubble (bubble.slug)}<li>{bubble.text}</li>{/each}
			</ul>
		</section>

		<!-- Text on pink is ink, not the prototype's blue: blue on ui-primary is 4.41:1 and fails AA -->
		<section
			data-step="meaning"
			{@attach track}
			class="flex min-h-dvh flex-col items-center justify-center gap-l px-m py-xxl"
		>
			<div class="max-w-md rounded-card bg-ui-primary p-l text-center text-b5 text-ink lg:text-b4">
				<p>
					<strong>การเลือกปฏิบัติ</strong><br />คือ ‘ความผิดปกติ’<br
					/>ที่ยังซุกซ่อนอยู่ในชีวิตประจำวัน
				</p>
				<p class="mt-m">อาจเพราะ<strong>ความไม่รู้</strong><br />อาจเพราะ<strong>อคติ</strong></p>
			</div>
			<div class="max-w-md rounded-card bg-ui-primary p-l text-center text-b5 text-ink lg:text-b4">
				<p>
					ถึงเวลา ‘มองเห็น’ และ ‘ตระหนัก’<br />ใน <strong>สิทธิที่จะไม่ถูกเลือกปฏิบัติ</strong><br
					/>ซึ่งเป็นสิทธิขั้นพื้นฐานของเราทุกคน
				</p>
			</div>
		</section>

		<section
			data-step="title"
			{@attach track}
			class="flex h-dvh flex-col items-center justify-center gap-m px-m text-center"
		>
			<!-- TODO: replace with the "Spot the Discrimination" logo SVG from Figma -->
			<h2 class="font-header leading-none font-bold text-ink">
				<span class="block text-h3-m lg:text-h3">
					Sp<span class="inline-block size-[0.7em] rounded-full bg-primary align-middle"></span>t
					<span class="text-b5 text-primary">the</span>
				</span>
				<span class="block text-h6 lg:text-h3">Discrimination</span>
			</h2>
			<p class="text-h7-m font-bold text-primary lg:text-h6">ตระหนัก เข้าใจ<br />ไม่เลือกปฏิบัติ</p>
			<a href={next} class="mt-l flex flex-col items-center text-b5 text-primary underline">
				คลิกเพื่อดูต่อ
				<svg
					aria-hidden="true"
					width="16"
					height="22"
					viewBox="0 0 16 22"
					fill="none"
					class="mt-xs"
				>
					<path
						d="M8 21s7-7.5 7-13A7 7 0 0 0 1 8c0 5.5 7 13 7 13Z"
						stroke="currentColor"
						stroke-width="1.5"
					/>
					<circle cx="8" cy="8" r="2.5" fill="currentColor" />
				</svg>
			</a>
		</section>
	</div>

	<a
		href={next}
		class="fixed right-m bottom-m z-30 flex items-center gap-xs rounded-full bg-ui-primary px-m py-s text-b6 text-ink shadow hover:bg-ui-primary-hover lg:right-l lg:bottom-l"
	>
		ข้ามส่วนเกริ่น <span aria-hidden="true">▶</span>
	</a>
</div>
