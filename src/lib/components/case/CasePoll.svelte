<script lang="ts">
	import ear from '#lib/assets/kp2/poll-ear.svg';
	import eye from '#lib/assets/kp2/poll-eye.svg';
	import person from '#lib/assets/kp2/poll-person.svg';
	import cross from '#lib/assets/kp2/poll-x.svg';
	import { trackEvent } from '#lib/analytics.ts';
	import { LocalPollStore, type PollChoice } from '#lib/state/poll.ts';

	let { slug, headingLevel = 3 }: { slug: string; headingLevel?: 2 | 3 } = $props();

	const store = new LocalPollStore();
	// Not $derived: the saved answer must be read after hydration, so the prerendered card matches
	// eslint-disable-next-line svelte/prefer-writable-derived
	let answer = $state<PollChoice | undefined>();
	// Client-only (it reads localStorage), and reruns as ‹ › moves the panel to another case
	$effect(() => {
		answer = store.load(slug);
	});

	// Icons sit in a 20px box at the insets Figma exports them with
	const options: { id: PollChoice; label: string; icon: string; inset: string }[] = [
		{ id: 'experienced', label: 'เคยโดนกับตัว', icon: person, inset: '15% 23.19% 14.95% 20%' },
		{ id: 'witnessed', label: 'เคยเห็นกับตา', icon: eye, inset: '29.3% 15% 32.54% 13.69%' },
		{ id: 'heard', label: 'เคยได้ยินมา', icon: ear, inset: '10% 28.66% 15.55% 25%' },
		{ id: 'never', label: 'ไม่เคยโดนกับตัว', icon: cross, inset: '15% 15% 15% 15%' }
	];

	function vote(choice: PollChoice) {
		answer = choice;
		store.save(slug, choice);
		trackEvent({ name: 'poll_answered', slug, choice });
	}
</script>

<!-- Figma "Poll" -->
<section
	class="flex w-full flex-col gap-m rounded-card bg-ui-secondary p-m"
	aria-labelledby="poll-{slug}"
>
	<svelte:element this={`h${headingLevel}`} id="poll-{slug}" class="text-b6 text-primary">
		ชวนคุย: <strong>ประสบการณ์ของคุณกับการเลือกปฏิบัตินี้</strong>
	</svelte:element>
	<div class="flex flex-col gap-s">
		{#each options as option (option.id)}
			<button
				type="button"
				class="flex w-full items-center justify-center gap-s rounded-lg border-2 border-transparent bg-surface px-l py-s text-b6 font-bold text-ink drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)] hover:bg-ui-primary-hover aria-pressed:border-primary"
				aria-pressed={answer === option.id}
				onclick={() => vote(option.id)}
			>
				<span class="relative size-5 shrink-0" aria-hidden="true">
					<img src={option.icon} alt="" class="absolute" style="inset:{option.inset}" />
				</span>
				{option.label}
			</button>
		{/each}
	</div>
	{#if answer}
		<!-- TODO(backend): every voter's percentages, as in the design, once polls have shared storage -->
		<p class="text-b6 text-primary" aria-live="polite">ขอบคุณที่ร่วมแบ่งปันประสบการณ์</p>
	{/if}
</section>
