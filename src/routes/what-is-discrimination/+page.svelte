<script lang="ts">
	import { resolve } from '$app/paths';
	import ScrollStory from '#lib/components/story/ScrollStory.svelte';
	import StoryCard from '#lib/components/story/StoryCard.svelte';
	import ThoughtBubble from '#lib/components/story/ThoughtBubble.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import { cases } from '#lib/content/index.ts';
	import { kp1Steps, stereotypes } from '#lib/content/kp1.ts';
</script>

<svelte:head><title>การเลือกปฏิบัติคืออะไร · Spot the Discrimination</title></svelte:head>

<!--
	Figma flow "DE-KP1". The prototype also shows an "อ่านเนื้อหาเต็ม" button here; it opens the
	Definition panel, which is not built yet.
-->
<ScrollStory steps={kp1Steps}>
	{#snippet children(track)}
		<section
			data-step="stereotype"
			{@attach track}
			class="flex min-h-dvh items-center justify-center px-m py-xxl"
		>
			<h1 class="sr-only">การเลือกปฏิบัติคืออะไร</h1>
			<!-- Bubbles surround the card on desktop and stack above/below it on phones -->
			<div
				class="flex flex-col items-center gap-m lg:grid lg:grid-cols-[1fr_auto_1fr] lg:grid-rows-[auto_auto_auto] lg:gap-l"
			>
				<ThoughtBubble class="lg:col-start-1 lg:row-start-1 lg:justify-self-end"
					>{stereotypes[0]}</ThoughtBubble
				>
				<ThoughtBubble class="lg:col-start-3 lg:row-start-1 lg:justify-self-start"
					>{stereotypes[1]}</ThoughtBubble
				>
				<StoryCard class="lg:col-start-2 lg:row-start-2">
					<p>การมี <strong>ภาพจำที่ลดคุณค่า</strong><br />คนบางกลุ่ม</p>
				</StoryCard>
				<ThoughtBubble class="lg:col-start-2 lg:row-start-3 lg:justify-self-center"
					>{stereotypes[2]}</ThoughtBubble
				>
			</div>
		</section>

		<section data-step="harm" {@attach track} class="flex h-dvh items-center justify-center px-m">
			<StoryCard>
				<p>ที่นำไปสู่การ<br /><strong>แบ่งแยก-กีดกัน-จำกัดสิทธิ</strong><br />ต่อคนกลุ่มนั้น</p>
			</StoryCard>
		</section>

		<section
			data-step="mission"
			{@attach track}
			class="flex min-h-dvh items-center justify-center px-m py-xxl"
		>
			<div
				class="flex max-w-md flex-col items-center gap-m rounded-card bg-ui-secondary p-l text-center text-primary shadow-lg"
			>
				<!-- TODO: swap for the magnifier illustration from Figma -->
				<div
					class="flex size-28 items-center justify-center rounded-full bg-surface"
					aria-hidden="true"
				>
					<svg width="64" height="64" viewBox="0 0 64 64" fill="none">
						<circle cx="27" cy="27" r="18" stroke="currentColor" stroke-width="6" />
						<path d="M40 40l16 16" stroke="currentColor" stroke-width="8" stroke-linecap="round" />
					</svg>
				</div>
				<h2 class="text-b4 font-bold lg:text-h7-m">
					สืบหา {cases.length} การเลือกปฏิบัติ<span class="whitespace-nowrap">ที่ซ่อนอยู่</span>
				</h2>
				<div class="text-b5">
					<p class="font-bold">วิธีเล่น:</p>
					<p>
						เลื่อนและขยายภาพเมืองเพื่อค้นหาการเลือกปฏิบัติที่ซ่อนอยู่ {cases.length} จุด ภาพการเลือกปฏิบัติจะสามารถกดเพื่ออ่านรายละเอียดได้
					</p>
				</div>
				<Button href={resolve('/explore')}>สำรวจเลย !</Button>
				<!-- TODO: "แนะนำการสำรวจ" (exploration tips) link; its content is not in the prototype yet -->
			</div>
		</section>
	{/snippet}
</ScrollStory>
