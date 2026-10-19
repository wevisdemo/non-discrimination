<script lang="ts">
	import ContinueLink from '#lib/components/story/ContinueLink.svelte';
	import ScrollStory from '#lib/components/story/ScrollStory.svelte';
	import StoryCard from '#lib/components/story/StoryCard.svelte';
	import ThoughtBubble from '#lib/components/story/ThoughtBubble.svelte';
	import { getCase, MAP_SIZE } from '#lib/content/index.ts';
	import { introBubbles, introSteps } from '#lib/content/intro.ts';
	import { stageTracker } from '#lib/state/stage.svelte.ts';

	function pinAbove(slug: string) {
		const { hotspot: h } = getCase(slug)!;
		return `left:${((h.x + h.w / 2) / MAP_SIZE.width) * 100}%;top:${(h.y / MAP_SIZE.height) * 100}%`;
	}
</script>

<section id="intro">
	<!-- Figma flow "DE-Intro" -->
	<ScrollStory steps={introSteps}>
		{#snippet mapOverlay(active)}
			{#each introBubbles as bubble (bubble.slug)}
				<ThoughtBubble
					class="absolute -translate-x-1/2 -translate-y-full transition-opacity duration-700 lg:w-72 {active ===
					'bubbles'
						? ''
						: 'opacity-0'}"
					style={pinAbove(bubble.slug)}>{bubble.text}</ThoughtBubble
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

			<section data-step="city" {@attach track} class="h-dvh" aria-hidden="true"></section>

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
						/>ซึ่งเป็นสิทธิขั้นพื้นฐานของเราทุกคน
					</p>
				</StoryCard>
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
				<p class="text-h7-m font-bold text-primary lg:text-h6">
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
			class="fixed right-m bottom-m z-30 flex items-center gap-xs rounded-full bg-ui-primary px-m py-s text-b6 text-ink shadow hover:bg-ui-primary-hover lg:right-l lg:bottom-l"
		>
			ข้ามส่วนเกริ่น <span aria-hidden="true">▶</span>
		</a>
	{/if}
</section>
