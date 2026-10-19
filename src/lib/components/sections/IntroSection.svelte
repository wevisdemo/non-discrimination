<script lang="ts">
	import scrollHint from '#lib/assets/intro/scroll-hint.svg';
	import skipForward from '#lib/assets/intro/skip-forward.svg';
	import IntroBubble from '#lib/components/intro/IntroBubble.svelte';
	import SpotLogo from '#lib/components/intro/SpotLogo.svelte';
	import ContinueLink from '#lib/components/story/ContinueLink.svelte';
	import ScrollStory from '#lib/components/story/ScrollStory.svelte';
	import StoryCard from '#lib/components/story/StoryCard.svelte';
	import { getCase, MAP_SIZE } from '#lib/content/index.ts';
	import { introBubbles, introSteps } from '#lib/content/intro.ts';
	import { stageTracker } from '#lib/state/stage.svelte.ts';

	/** Top-left of a bubble: its case's top-left on the map plus the prototype's offset in px. */
	function pinTo(slug: string, offset: { x: number; y: number }) {
		const { hotspot: h } = getCase(slug)!;
		return `left:calc(${(h.x / MAP_SIZE.width) * 100}% + ${offset.x}px);top:calc(${(h.y / MAP_SIZE.height) * 100}% + ${offset.y}px)`;
	}
</script>

<section id="intro">
	<!-- Figma flow "DE-Intro" -->
	<ScrollStory steps={introSteps}>
		{#snippet mapOverlay(active)}
			{#each introBubbles as bubble (bubble.slug)}
				<IntroBubble
					variant={bubble.variant}
					class="absolute transition-opacity duration-700 {active === 'bubbles' ? '' : 'opacity-0'}"
					style={pinTo(bubble.slug, bubble.offset)}>{bubble.text}</IntroBubble
				>
			{/each}
		{/snippet}

		{#snippet children(track)}
			<section
				data-step="question"
				{@attach track}
				class="flex h-dvh items-center justify-center px-m"
			>
				<h1 class="text-center text-h6-m leading-snug font-bold lg:text-h3">
					คุณเห็น<br />ความผิดปกติ<br />ในภาพนี้หรือไม่ ?
				</h1>
			</section>

			<!-- Two Figma frames: the wash lifts to reveal the city, then comes back for the bubbles -->
			<section data-step="city" {@attach track} aria-hidden="true">
				<div
					class="flex h-dvh flex-col items-center gap-xs pt-xl text-b5 font-bold text-primary drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)]"
				>
					เลื่อนลงเพื่อดูเฉลย
					<img src={scrollHint} alt="" width="13" height="24.4142" />
				</div>
				<div class="h-dvh"></div>
			</section>

			<section data-step="bubbles" {@attach track} class="h-dvh">
				<!-- The map bubbles are decorative; this list carries the same text for screen readers -->
				<ul class="sr-only">
					{#each introBubbles as bubble (bubble.slug)}<li>{bubble.text}</li>{/each}
				</ul>
			</section>

			<section
				data-step="meaning"
				{@attach track}
				class="flex min-h-dvh flex-col items-center justify-center gap-l px-m py-xxl"
			>
				<StoryCard>
					<p>
						<strong>การเลือกปฏิบัติ</strong><br />คือ ‘ความผิดปกติ’<br
						/>ที่ยังซุกซ่อนอยู่ในชีวิตประจำวัน
					</p>
					<p class="mt-m">อาจเพราะ<strong>ความไม่รู้</strong><br />อาจเพราะ<strong>อคติ</strong></p>
				</StoryCard>
				<StoryCard>
					<p>
						ถึงเวลา ‘มองเห็น’ และ ‘ตระหนัก’<br />ใน <strong>สิทธิที่จะไม่ถูกเลือกปฏิบัติ</strong><br
						/>ซึ่งเป็นสิทธิพื้นฐานของเราทุกคน
					</p>
				</StoryCard>
			</section>

			<section
				data-step="title"
				{@attach track}
				class="flex h-dvh flex-col items-center justify-center gap-m px-m text-center"
			>
				<h2 class="sr-only">Spot the Discrimination</h2>
				<SpotLogo />
				<p class="font-header text-h7 font-bold text-primary">
					ตระหนัก เข้าใจ<br />ไม่เลือกปฏิบัติ
				</p>
				<div class="mt-l"><ContinueLink href="#definition" /></div>
			</section>
		{/snippet}
	</ScrollStory>

	<!-- Skips the whole preamble (Intro and KP1) straight to the game; only while the Intro is on screen -->
	{#if stageTracker.current === 'intro'}
		<a
			href="#explore"
			class="fixed right-m bottom-m z-30 flex items-center gap-xs rounded-full bg-ui-primary px-m py-s text-b5 text-ink shadow hover:bg-ui-primary-hover lg:right-l lg:bottom-l"
		>
			ข้ามส่วนเกริ่น <img src={skipForward} alt="" width="16" height="16" />
		</a>
	{/if}
</section>
