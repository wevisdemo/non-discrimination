<script lang="ts">
	import FullContentPanel from '#lib/components/definition/FullContentPanel.svelte';
	import InfoButton from '#lib/components/definition/InfoButton.svelte';
	import Balloons from '#lib/components/story/Balloons.svelte';
	import ContinueLink from '#lib/components/story/ContinueLink.svelte';
	import GameThumbnail from '#lib/components/story/GameThumbnail.svelte';
	import ScrollStory from '#lib/components/story/ScrollStory.svelte';
	import StoryCard from '#lib/components/story/StoryCard.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import { cases } from '#lib/content/index.ts';
	import { harmBalloons, kp1Steps, stereotypeBalloons } from '#lib/content/kp1.ts';
	import { explore } from '#lib/state/explore.svelte.ts';
	import { stageTracker } from '#lib/state/stage.svelte.ts';

	let reading = $state(false);
</script>

<section id="definition">
	<!-- Figma flow "DE-KP1" -->
	<ScrollStory steps={kp1Steps}>
		{#snippet children(track)}
			<section
				data-step="stereotype"
				{@attach track}
				class="relative flex h-dvh items-center justify-center px-m"
			>
				<h2 class="sr-only">คำนิยามสั้น ๆ ของการเลือกปฏิบัติ</h2>
				<Balloons items={stereotypeBalloons} />
				<ul class="sr-only">
					{#each stereotypeBalloons as b (b.text)}<li>{b.text}</li>{/each}
				</ul>
				<StoryCard compact class="relative">
					<p>การมี <strong>ภาพจำที่ลดคุณค่า<br />คนบางกลุ่ม</strong></p>
				</StoryCard>
			</section>

			<section
				data-step="harm"
				{@attach track}
				class="relative flex h-dvh items-center justify-center px-m"
			>
				<Balloons items={harmBalloons} />
				<ul class="sr-only">
					{#each harmBalloons as b (b.text)}<li>{b.text}</li>{/each}
				</ul>
				<StoryCard compact class="relative">
					<p>ที่นำไปสู่การ<br /><strong>แบ่งแยก-กีดกัน-จำกัดสิทธิ</strong><br />ต่อคนกลุ่มนั้น</p>
				</StoryCard>
			</section>

			<section
				data-step="conclusion"
				{@attach track}
				class="flex h-dvh items-center justify-center px-m"
			>
				<StoryCard compact>
					<p>นั่นคือ <strong>การเลือกปฏิบัติ</strong></p>
				</StoryCard>
			</section>

			<section
				data-step="mission"
				{@attach track}
				class="flex h-dvh flex-col items-center justify-center gap-l px-m py-xl"
			>
				<div
					class="flex w-[400px] max-w-full flex-col items-center gap-m rounded-card bg-ui-secondary px-l py-m text-center text-primary"
				>
					<GameThumbnail />
					<h2 class="text-b4 font-bold">
						สืบหา {cases.length} การเลือกปฏิบัติ<span class="whitespace-nowrap">ที่ซ่อนอยู่</span>
					</h2>
					<p class="text-b6">
						<strong>วิธีเล่น:</strong>
						เลื่อนและขยายภาพเมืองเพื่อค้นหาการเลือกปฏิบัติที่ซ่อนอยู่ {cases.length} จุด ภาพการเลือกปฏิบัติจะสามารถกดเพื่ออ่านรายละเอียดได้
					</p>
					<Button href="#explore">สำรวจเลย !</Button>
					<!-- Opens the map with the tutorial over it (Figma "kp2-tutorial") -->
					<a href="#explore-tutorial" class="text-b6 text-ink underline hover:text-primary"
						>แนะนำการสำรวจ</a
					>
				</div>
				<ContinueLink href="#causes" />
			</section>
		{/snippet}
	</ScrollStory>

	<!-- Floats bottom right while KP1 is on screen, where the Intro's skip button was -->
	{#if stageTracker.current === 'definition' && !explore.open}
		<div class="fixed right-m bottom-m z-30 lg:right-[34px] lg:bottom-[30px]">
			<InfoButton onclick={() => (reading = true)} />
		</div>
	{/if}
	<FullContentPanel open={reading} onclose={() => (reading = false)} />
</section>
