<script lang="ts">
	import { tick } from 'svelte';
	import arrow from '#lib/assets/kp2/tutorial-arrow.svg';
	import cursor from '#lib/assets/kp2/cursor.svg';
	import zoomPan from '#lib/assets/kp2/zoom-pan.svg';
	import { cases } from '#lib/content/index.ts';

	let { onfinish }: { onfinish: () => void } = $props();

	/** Figma "kp2-tutorial-2…6": one tip per map control, each pointing at its `data-tutorial` */
	const tips = [
		{
			target: 'hints',
			place: 'above',
			title: 'ตัวช่วย',
			body: `อยากได้คำใบ้ภาพการเลือกปฏิบัติที่ซ่อนอยู่ ? กดเพื่อดูชื่อสถานการณ์ของทั้ง ${cases.length} ภาพ`
		},
		{
			target: 'reveal',
			place: 'left',
			title: 'เฉลยตำแหน่งภาพ',
			body: `หาภาพไม่เจอสักที ? กดเพื่อชี้ตำแหน่งของ ${cases.length} ภาพการเลือกปฏิบัติ`
		},
		{
			target: 'step',
			place: 'left',
			title: 'เจาะดูทีละภาพ',
			body: 'ไม่อยากเลื่อนหาเอง ? กดเพื่อเจาะดูการเลือกปฏิบัติทีละภาพไปด้วยกัน สามารถออกจากการนำทางได้เสมอ'
		},
		{
			target: 'exit',
			place: 'left',
			title: 'ออกจากการสำรวจ',
			body: 'กดเพื่อออกจากการสำรวจ และอ่านเนื้อหาส่วนถัดไป'
		}
	] as const;

	/** 0 = welcome (tutorial-1), 1…4 = tips, 5 = "เริ่มสำรวจ!" (tutorial-7) */
	let step = $state(0);
	const tip = $derived(step >= 1 && step <= tips.length ? tips[step - 1] : undefined);
	const last = tips.length + 1;

	let popover = $state<HTMLElement>();
	let place = $state<{ box: string; arrow?: string }>({ box: '' });

	/** Put the tip beside its control, with the arrow pointing at it (desktop), or under it (phone) */
	function measure() {
		if (!tip) return;
		const el = document.querySelector<HTMLElement>(`#explore [data-tutorial="${tip.target}"]`);
		if (!el) return;
		const r = el.getBoundingClientRect();
		const vw = innerWidth;
		const vh = innerHeight;
		const mid = r.top + r.height / 2;
		if (vw < 768) {
			place = {
				box:
					tip.place === 'above'
						? `left:16px;right:16px;bottom:${vh - r.top + 16}px`
						: `left:16px;right:16px;top:${r.bottom + 16}px`
			};
		} else if (tip.place === 'above') {
			place = {
				box: `left:${Math.max(16, r.left + 22)}px;bottom:${vh - r.top + 34}px`,
				arrow: `left:${r.left + 20}px;top:${r.top - 30}px`
			};
		} else {
			place = {
				box: `right:${vw - (r.left - 34)}px;top:${Math.max(16, mid - 36)}px`,
				arrow: `left:${r.left - 34}px;top:${mid - 11}px;transform:rotate(-90deg)`
			};
		}
	}

	// Dim every control except the one being explained, and keep them all inert until the end
	$effect(() => {
		const focus = tip?.target;
		const done = step === last;
		const els = document.querySelectorAll<HTMLElement>('#explore [data-tutorial]');
		for (const el of els) {
			el.style.opacity = done || el.dataset.tutorial === focus ? '' : '0.2';
			el.style.pointerEvents = done ? '' : 'none';
		}
		return () => {
			for (const el of els) el.style.opacity = el.style.pointerEvents = '';
		};
	});

	// Re-place and move focus to the new tip's main button whenever the step changes
	$effect(() => {
		void step;
		measure();
		tick().then(() => popover?.querySelector<HTMLElement>('[data-primary]')?.focus());
	});

	const go = (to: number) => (step = to);
</script>

<svelte:window onresize={measure} onkeydown={(e) => e.key === 'Escape' && onfinish()} />

{#if step < last}
	<!-- The 80% wash sits under the controls (they are at z-[2]) and blocks the map -->
	<div class="absolute inset-0 z-[1] bg-white/80" aria-hidden="true"></div>
{/if}

{#snippet nav(back: boolean, nextLabel: string)}
	<div class="flex w-full items-center justify-between">
		{#if step < last}
			<button type="button" class="text-b6 text-[#767676] hover:underline" onclick={onfinish}
				>ข้าม</button
			>
		{:else}
			<span></span>
		{/if}
		<div class="flex items-center gap-xs">
			{#if back}
				<button
					type="button"
					class="rounded-full px-m py-s text-b5 text-primary hover:bg-ui-secondary"
					onclick={() => go(step - 1)}>ย้อนกลับ</button
				>
			{/if}
			<button
				type="button"
				data-primary
				class="rounded-full bg-ui-primary px-m py-s text-b5 font-bold text-ink hover:bg-ui-primary-hover"
				onclick={() => (step === last ? onfinish() : go(step + 1))}>{nextLabel}</button
			>
		</div>
	</div>
{/snippet}

<div
	bind:this={popover}
	role="dialog"
	aria-modal="true"
	aria-labelledby="tutorial-title"
	class="z-[3] flex flex-col gap-m rounded-card bg-surface px-m drop-shadow-[4px_4px_2px_rgba(0,0,0,0.25)] {tip
		? 'fixed w-[400px] max-w-[calc(100vw-32px)] pt-s pb-m'
		: 'absolute top-[calc(50%-22px)] left-1/2 -translate-1/2 pb-m ' +
			(step === 0 ? 'w-[278px] pt-m' : 'w-[400px] max-w-[calc(100vw-32px)] pt-l')}"
	style={tip ? place.box : undefined}
>
	{#if step === 0}
		<p id="tutorial-title" class="text-b5 text-primary">
			มาดูกันว่าปุ่มต่าง ๆ ในส่วนนี้ทำอะไรได้บ้าง
		</p>
		{@render nav(false, 'ถัดไป')}
	{:else if tip}
		<p class="text-b6 text-[#767676]">{step}/{tips.length}</p>
		<div class="flex flex-col gap-xs text-b5 text-primary">
			<h3 id="tutorial-title" class="font-bold text-primary">{tip.title}</h3>
			<p>{tip.body}</p>
		</div>
		{@render nav(true, 'ถัดไป')}
	{:else}
		<h3 id="tutorial-title" class="sr-only">วิธีสำรวจ</h3>
		<ul class="flex flex-col gap-xs text-b5 text-primary">
			<li class="flex items-center gap-xxs">
				<img src={zoomPan} alt="" width="16" height="16" />เลื่อนและซูม เพื่อสำรวจ
			</li>
			<li class="flex items-center gap-xxs">
				<img src={cursor} alt="" width="16" height="16" />คลิกเพื่อดูรายละเอียดเหตุการณ์
			</li>
		</ul>
		{@render nav(true, 'เริ่มสำรวจ!')}
	{/if}
</div>

{#if tip && place.arrow}
	<img
		src={arrow}
		alt=""
		width="22"
		height="23"
		class="pointer-events-none fixed z-[3]"
		style={place.arrow}
	/>
{/if}
