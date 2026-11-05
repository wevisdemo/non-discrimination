<script lang="ts">
	import launch from '#lib/assets/kp2/launch.svg';
	import web from '#lib/assets/kp2/web.svg';
	import bg from '#lib/assets/map/bg-final.png?enhanced';
	import ReportingChannels from '#lib/components/case/ReportingChannels.svelte';
	import ELearning from '#lib/components/result/ELearning.svelte';
	import ShareLinks from '#lib/components/result/ShareLinks.svelte';
	import Survey from '#lib/components/result/Survey.svelte';
	import ContinueLink from '#lib/components/story/ContinueLink.svelte';
	import { reportingChannels } from '#lib/content/index.ts';

	// Pink cards with blue text, as accepted for the story cards (tests/app.e2e.ts)
	const card =
		'flex w-full max-w-[400px] flex-col gap-m rounded-card bg-ui-primary px-m py-l text-center text-primary';
</script>

<!-- Figma "Result" (1069:5176) -->
<section id="summary" class="flex flex-col">
	<!-- "Conclusion": the closing cards over the washed-out city, one per screen. The city stays
	     put (sticky inside a box as tall as the cards) while each card scrolls past, and the box
	     ends with the cards, so it never covers the survey below. -->
	<div class="relative">
		<div aria-hidden="true" class="pointer-events-none absolute inset-0">
			<div class="sticky top-0 h-svh overflow-clip">
				<enhanced:img
					src={bg}
					alt=""
					sizes="100vw"
					class="absolute inset-0 size-full object-cover"
				/>
				<div class="absolute inset-0 bg-white/80"></div>
			</div>
		</div>
		<h2 class="sr-only">บทสรุป</h2>
		<div class="relative flex min-h-svh items-center justify-center px-m">
			<div data-story-card class={card}>
				<p class="text-b4 font-bold">
					การอุดช่องว่างกฎหมาย<br />ต้องมาพร้อมกับ<br />การทลายภาพจำที่ตัดสิน<br />คุณค่าของคน
				</p>
				<p class="text-b5">
					นี่คือสิ่งที่คุณทำได้เลย <strong>วันนี้ ตอนนี้</strong><br />ไม่ว่าเราจะมีกฎหมายเป็นการ<br
					/>เฉพาะแล้วหรือไม่
				</p>
			</div>
		</div>
		<div class="relative flex min-h-svh items-center justify-center px-m">
			<div data-story-card class={card}>
				<p class="text-b4">
					ร่วมตระหนัก รู้จัก และเข้าใจ<br /><strong>สิทธิที่จะไม่ถูกเลือกปฏิบัติ</strong>
				</p>
				<p class="text-b5">
					เพราะนั่นคือการเคารพศักดิ์ศรีความเป็นมนุษย์ ยอมรับในความหลากหลาย ทลายกำแพงอคติ
				</p>
			</div>
		</div>
		<div class="relative flex min-h-svh items-center justify-center px-m">
			<div data-story-card class={card}>
				<p class="text-b5">
					เพื่อให้ <strong>คนทุกคน</strong> ได้พัฒนาชีวิตของตนอย่างเต็มที่ ในสังคมที่เป็นธรรม ร่วมกันอย่างเท่าเทียม
				</p>
			</div>
		</div>
	</div>

	<div class="bg-surface-tint px-m py-xl"><Survey /></div>

	<div class="bg-surface px-m py-xl"><ShareLinks /></div>

	<ELearning class="px-m py-xl lg:px-xxl" />

	<div class="flex flex-col items-center gap-l bg-surface px-m py-xl">
		<div class="flex w-full max-w-[600px] flex-col gap-m">
			<ReportingChannels headingLevel={2} />
			<p class="text-center text-b5 text-primary">
				หรือเรียนรู้เพิ่มเติมเรื่องสิทธิมนุษยชน<br />ที่เว็บไซต์อย่างเป็นทางการของสำนักงาน กสม.
			</p>
			<a
				class="flex flex-wrap items-center gap-s rounded-sm border border-primary p-s text-b6 sm:gap-m"
				href={reportingChannels.website}
				target="_blank"
				rel="noopener external"
			>
				<span class="flex w-full items-center gap-s text-primary sm:w-[200px]">
					<img src={web} alt="" width="16" height="16" />website
				</span>
				<span class="flex flex-1 items-center justify-between text-ink">
					<span class="[overflow-wrap:anywhere] underline">{reportingChannels.website}</span>
					<img src={launch} alt="(เปิดในแท็บใหม่)" width="16" height="16" />
				</span>
			</a>
		</div>
		<ContinueLink />
	</div>
</section>
