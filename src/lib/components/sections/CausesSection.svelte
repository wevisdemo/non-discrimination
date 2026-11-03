<script lang="ts">
	import law from '#lib/assets/kp3/law.svg';
	import parliamentBg from '#lib/assets/kp3/parliament-bg.png?enhanced';
	import parliamentWatch from '#lib/assets/kp3/parliament-watch.svg';
	import ruleCancelled from '#lib/assets/kp3/rule-cancelled.svg';
	import { trackEvent } from '#lib/analytics.ts';
	import { LAW_CHOICES, LocalPollStore, type LawChoice } from '#lib/state/poll.ts';

	// Parliament Watch's bill search for the anti-discrimination bills
	const PARLIAMENT_WATCH_URL = `https://parliamentwatch.wevis.info/bills/explore?q=${encodeURIComponent('ขจัดการเลือกปฏิบัติต่อบุคคล')}`;

	const laws = [
		'ปฏิญญาสากลว่าด้วยสิทธิมนุษยชน',
		'กฎหมายระหว่างประเทศด้านสิทธิมนุษยชนทุกฉบับ',
		'รัฐธรรมนูญ 2560 มาตรา 4 และ 27'
	];

	const options: { id: LawChoice; lead: string; rest: string }[] = [
		{ id: 'agree', lead: 'ดีเลย', rest: 'จะได้มีมาตรฐาน\nป้องกันการละเมิดสิทธิได้มากขึ้น' },
		{
			id: 'unnecessary',
			lead: 'ไม่เห็นจำเป็น',
			rest: 'ในเมื่อสิทธินี้ระบุในรัฐธรรมนูญ\nกฎหมายอื่นก็ขัดกับรัฐธรรมนูญไม่ได้อยู่แล้ว'
		},
		{
			id: 'disagree',
			lead: 'ไม่เห็นด้วย',
			rest: 'การจำกัดสิทธิกับคนบางกลุ่มยังจำเป็น\nเพื่อให้สังคมอยู่ในร่องในรอย'
		}
	];

	const store = new LocalPollStore('non-discrimination:law-poll', LAW_CHOICES);
	// Not $derived: the saved answer must be read after hydration, so the prerendered page matches
	// eslint-disable-next-line svelte/prefer-writable-derived
	let answer = $state<LawChoice | undefined>();
	$effect(() => {
		answer = store.load('law');
	});

	function vote(choice: LawChoice) {
		answer = choice;
		store.save('law', choice);
		trackEvent({ name: 'poll_answered', slug: 'law', choice });
	}

	const h = 'font-header text-h7-m leading-normal font-bold text-primary lg:text-h7';
</script>

<!-- Figma "kp3" (571:10724): an article on white, no map -->
<section id="causes" class="flex flex-col items-center bg-surface text-center text-primary">
	<div class="flex w-full flex-col items-center gap-xl px-m py-xxl">
		<div class="flex w-full max-w-[600px] flex-col items-center gap-m">
			<h2 class={h}>เราทุกคนมีสิทธิที่จะไม่ถูกเลือกปฏิบัติ</h2>
			<p class="text-b5">นี่คือ <strong>สิทธิขั้นพื้นฐานที่ปรากฏในทุกกฎหมาย</strong> ตั้งแต่</p>
			<ul class="flex w-full flex-col gap-s">
				{#each laws as item (item)}
					<li
						class="flex items-start justify-center gap-[9px] rounded-lg bg-ui-secondary px-m py-s text-b5"
					>
						<span class="flex size-5 shrink-0 items-center justify-center" aria-hidden="true">
							<img src={law} alt="" width="17" height="17" class="-rotate-45 mix-blend-multiply" />
						</span>
						{item}
					</li>
				{/each}
			</ul>
		</div>

		<div class="flex w-full max-w-[600px] flex-col items-center gap-m">
			<h2 class={h}>แต่ทำไมการเลือกปฏิบัติจึงยังมีให้เห็นอยู่ ?</h2>
			<!-- Blue on pink, as accepted for the story cards (tests/app.e2e.ts) -->
			<p data-story-card class="w-full rounded-card bg-ui-primary p-m text-b5 text-primary">
				นั่นเพราะเรายังติดอยู่กับ<br /><strong>ภาพจำต่อคนบางกลุ่ม</strong> และ
				<strong>ช่องว่างทางกฎหมาย</strong><br />ซึ่งเอื้อให้การเลือกปฏิบัติคงอยู่ในสังคม
			</p>
			<ol class="flex w-full flex-col gap-l md:flex-row">
				{#snippet reason(n: number, title: string, body: import('svelte').Snippet)}
					<li
						class="flex flex-1 flex-col items-center gap-m rounded-card bg-surface-tint px-m py-l"
					>
						<span
							class="flex size-[38px] items-center justify-center rounded-full bg-primary text-b4 font-bold text-white"
							aria-hidden="true">{n}</span
						>
						<h3 class="text-b5 font-bold text-body">{title}</h3>
						{@render body()}
					</li>
				{/snippet}
				{#snippet stereotypes()}
					<p class="text-b5">
						เมื่อเคยชินกับภาพจำที่ลดคุณค่า<br />คนบางกลุ่มเราย่อม <strong>ไม่รู้ตัว</strong>
						ว่านั่นคือการตัดสินคุณค่า และ <strong>เกลียดกลัว</strong> พวกเขาจากภาพจำเหล่านั้น
					</p>
					<p class="text-b5">
						จนท้ายที่สุด การเลือกปฏิบัติก็กลายเป็น<br />‘เรื่องที่ยอมรับได้’ ที่ถูกผลิตซ้ำไม่รู้จบ
					</p>
				{/snippet}
				{#snippet noLaw()}
					<div class="flex flex-col gap-s">
						<p class="text-b5">
							นอกจากการรับรองสิทธิอย่างกว้าง ๆ ในรัฐธรรมนูญ ประเทศไทยยังไม่มี<strong
								>กฎหมายเฉพาะ</strong
							>ที่ให้คำนิยาม กำหนดขอบเขต และบทลงโทษที่ชัดเจนต่อการเลือกปฏิบัติ*
						</p>
						<p class="text-b6 text-body">*ข้อมูล ณ พฤศจิกายน 2569</p>
					</div>
				{/snippet}
				{@render reason(1, 'ภาพจำ… ที่ยังไม่ถูกท้าทาย', stereotypes)}
				{@render reason(2, 'กฎหมาย… ที่ยังไม่ถูกเขียน ‘เป็นการเฉพาะ’', noLaw)}
			</ol>
		</div>
	</div>

	<div class="w-full max-w-[768px] px-m py-xl">
		<div class="flex flex-col gap-m rounded-card bg-surface px-m py-l">
			<p class="font-header text-h7-m leading-normal lg:text-h7">
				สัญญาณที่ดีคือ รัฐสภากำลังพิจารณาออก<br /><strong
					>พ.ร.บ. ขจัดการ<br />เลือกปฏิบัติต่อบุคคล</strong
				>
			</p>
			<p class="text-b5">
				จากร่างที่เสนอโดยภาคประชาชน โดยพรรคการเมือง และโดยคณะรัฐมนตรี (กระทรวงยุติธรรม)
			</p>
		</div>
	</div>

	<!-- Parliament Watch, over the parliament illustration -->
	<div
		class="relative flex min-h-svh w-full flex-col items-center justify-center gap-l px-m py-xxl"
	>
		<enhanced:img
			src={parliamentBg}
			alt=""
			sizes="100vw"
			class="absolute inset-0 size-full object-cover object-bottom"
		/>
		<p class="relative text-b4">ชวนจับตาและติดตามความคืบหน้าของแต่ละร่างที่</p>
		<img
			src={parliamentWatch}
			alt="Parliament Watch"
			width="768"
			height="49"
			class="relative h-auto w-full max-w-[768px]"
		/>
		<a
			href={PARLIAMENT_WATCH_URL}
			target="_blank"
			rel="noopener external"
			class="relative rounded-full bg-ui-primary px-m py-s text-b5 text-ink hover:bg-ui-primary-hover"
			>คลิกที่นี่<span class="sr-only"> (Parliament Watch, เปิดในแท็บใหม่)</span></a
		>
	</div>

	<!-- Figma "Poll" -->
	<div class="flex min-h-svh w-full items-center justify-center px-m py-xl">
		<section
			class="flex w-full max-w-[768px] flex-col items-center gap-m rounded-card bg-ui-secondary px-m py-l lg:px-xxl"
			aria-labelledby="law-poll"
		>
			<h3 id="law-poll" class="text-b4 font-bold text-primary">
				แล้วคุณคิดยังไง กับการมีกฎหมายขจัด<br />การเลือกปฏิบัติต่อบุคคล ‘เป็นการเฉพาะ’ ?
			</h3>
			<div class="flex w-full flex-col gap-s">
				{#each options as option (option.id)}
					<button
						type="button"
						class="w-full rounded-lg border-2 border-transparent bg-surface px-m py-s text-b6 whitespace-pre-line text-ink drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)] hover:bg-ui-primary-hover aria-pressed:border-primary"
						aria-pressed={answer === option.id}
						onclick={() => vote(option.id)}><strong>{option.lead}</strong> {option.rest}</button
					>
				{/each}
			</div>
			{#if answer}
				<!-- TODO(backend): every voter's percentages, as in Figma 897:5333 -->
				<p class="text-b6" aria-live="polite">ขอบคุณที่ร่วมแสดงความเห็น</p>
			{/if}
			<p
				class="flex w-full items-center justify-center gap-s rounded-card bg-surface-tint p-s text-b6"
			>
				<img src={ruleCancelled} alt="" width="20" height="20" class="mix-blend-multiply" />
				แบบสอบถามนี้ไม่มีการเก็บข้อมูลที่ระบุตัวบุคคล
			</p>
		</section>
	</div>
</section>
