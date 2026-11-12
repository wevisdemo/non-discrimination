<script lang="ts">
	import Balloons from '#lib/components/story/Balloons.svelte';
	import ContinueLink from '#lib/components/story/ContinueLink.svelte';
	import GameThumbnail from '#lib/components/story/GameThumbnail.svelte';
	import ScrollStory from '#lib/components/story/ScrollStory.svelte';
	import StoryCard from '#lib/components/story/StoryCard.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import { cases } from '#lib/content/index.ts';
	import { introMap } from '#lib/components/story/introMap.ts';
	import { storyCases } from '#lib/content/intro.ts';
	import { harmBalloons, kp1Steps, stereotypeBalloons } from '#lib/content/kp1.ts';
</script>

<section id="definition">
	<!-- Figma flow "DE-KP1" -->
	<ScrollStory steps={kp1Steps} show={storyCases} {...introMap}>
		{#snippet children(track)}
			<section
				data-step="stereotype"
				{@attach track}
				class="relative flex h-svh items-center justify-center px-m"
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
				class="relative flex h-svh items-center justify-center px-m"
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
				class="flex h-svh items-center justify-center px-m"
			>
				<StoryCard compact>
					<p>นั่นคือ <strong>การเลือกปฏิบัติ</strong></p>
				</StoryCard>
			</section>

			<!-- ออกจากการสำรวจ returns here, to the card that opened the map -->
			<section
				id="explore-intro"
				data-step="mission"
				{@attach track}
				class="flex h-svh flex-col items-center justify-center gap-l px-m py-xl"
			>
				<div
					class="flex w-[400px] max-w-full flex-col items-center gap-m rounded-card bg-ui-secondary px-l py-m text-center text-primary"
				>
					<GameThumbnail />
					<h2 class="font-body text-b4 font-bold">
						สืบหา {cases.length} การเลือกปฏิบัติ<span class="whitespace-nowrap">ที่ซ่อนอยู่</span>
					</h2>
					<!-- Evenly filled lines, broken between phrases and never inside one: `text-balance` evens
					     the lines out, and each phrase is kept whole -->
					<p class="text-b6 text-balance">
						<strong class="block">วิธีเล่น:</strong>
						<span class="inline-block">เลื่อนและขยายภาพเมือง</span>
						<span class="inline-block">เพื่อค้นหา</span>
						<span class="inline-block">การเลือกปฏิบัติ</span>
						<span class="inline-block">ที่ซ่อนอยู่ {cases.length} จุด</span>
						<span class="inline-block">ภาพการเลือกปฏิบัติ</span>
						<span class="inline-block">จะสามารถกด</span>
						<span class="inline-block">เพื่ออ่านรายละเอียดได้</span>
					</p>
					<Button href="#explore">สำรวจเลย !</Button>
					<!-- Opens the map with the tutorial over it (Figma "kp2-tutorial") -->
					<a href="#explore-tutorial" class="text-b6 text-ink underline hover:text-primary"
						>แนะนำการสำรวจ</a
					>
				</div>
				<ContinueLink />
			</section>
		{/snippet}
	</ScrollStory>
</section>
