<script lang="ts">
	import ear from '#lib/assets/kp2/poll-ear.svg';
	import eye from '#lib/assets/kp2/poll-eye.svg';
	import person from '#lib/assets/kp2/poll-person.svg';
	import cross from '#lib/assets/kp2/poll-x.svg';
	import PollBar from '#lib/components/ui/PollBar.svelte';
	import { backendConfigured, loadResults, sendVote, type Results } from '#lib/api/client.ts';
	import { trackEvent } from '#lib/analytics.ts';
	import { LocalPollStore, POLL_CHOICES, type PollChoice } from '#lib/state/poll.ts';

	let { slug, headingLevel = 3 }: { slug: string; headingLevel?: 2 | 3 } = $props();

	const store = new LocalPollStore('non-discrimination:poll', POLL_CHOICES);
	// Not $derived: the saved answer must be read after hydration, so the prerendered card matches
	let answer = $state<PollChoice | undefined>();
	let results = $state<Results | undefined>();
	// Client-only (it reads localStorage), and reruns as ‹ › moves the panel to another case
	$effect(() => {
		const saved = store.load(slug);
		answer = saved;
		results = undefined;
		if (saved) void showResults(slug);
	});

	// Icons sit in a 20px box at the insets Figma exports them with
	const options: { id: PollChoice; label: string; icon: string; inset: string }[] = [
		{ id: 'experienced', label: 'เคยโดนกับตัว', icon: person, inset: '15% 23.19% 14.95% 20%' },
		{ id: 'witnessed', label: 'เคยเห็นกับตา', icon: eye, inset: '29.3% 15% 32.54% 13.69%' },
		{ id: 'heard', label: 'เคยได้ยินมา', icon: ear, inset: '10% 28.66% 15.55% 25%' },
		{ id: 'never', label: 'ไม่เคยเจอ/เห็น/ได้ยิน', icon: cross, inset: '15% 15% 15% 15%' }
	];

	// MOCKUP: placeholder shares (sum 100), shown only while there is no backend (VITE_API_URL)
	const mock: Results = {
		total: 0,
		percent: { experienced: 41.2, witnessed: 27.6, heard: 18.5, never: 12.7 }
	};

	/** The shares of every voter; if the API is down the bars are left out rather than faked */
	async function showResults(forSlug: string) {
		const loaded = backendConfigured ? await loadResults(forSlug) : mock;
		if (forSlug === slug) results = loaded;
	}

	/** One vote per visitor: the shares count votes, so an answer is not changed afterwards */
	async function vote(choice: PollChoice) {
		if (answer) return;
		answer = choice;
		store.save(slug, choice);
		trackEvent({ name: 'poll_answered', slug, choice });
		if (backendConfigured) await sendVote(slug, choice);
		await showResults(slug);
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
			<!-- Figma "Poll": white buttons first; once answered, pink rows with the share of votes -->
			<button
				type="button"
				class="w-full rounded-lg border-4 border-transparent px-l py-s text-b6 font-bold text-ink aria-pressed:border-primary {answer
					? 'bg-ui-primary'
					: 'bg-surface shadow-[0_4px_2px_rgba(0,0,0,0.25)] hover:bg-ui-primary-hover'}"
				aria-pressed={answer === option.id}
				disabled={!!answer}
				onclick={() => vote(option.id)}
			>
				<span class="flex items-center justify-center gap-s">
					<span class="relative size-5 shrink-0" aria-hidden="true">
						<img src={option.icon} alt="" class="absolute" style="inset:{option.inset}" />
					</span>
					{option.label}
				</span>
				{#if answer && results}
					<PollBar percent={results.percent[option.id] ?? 0} />
				{/if}
			</button>
		{/each}
	</div>
	{#if answer}
		<p class="text-b6 text-primary" aria-live="polite">ขอบคุณที่ร่วมแบ่งปันประสบการณ์</p>
	{/if}
</section>
