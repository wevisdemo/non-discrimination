<script lang="ts">
	import { getCause, type CauseId } from '#lib/content/index.ts';

	let {
		cause,
		selected = false,
		onclick
	}: { cause: CauseId; selected?: boolean; onclick?: () => void } = $props();

	const { labelTh } = $derived(getCause(cause));
	// Static class names so Tailwind can see them.
	const bg: Record<CauseId, string> = {
		race: 'bg-cause-race',
		gender: 'bg-cause-gender',
		age: 'bg-cause-age',
		religion: 'bg-cause-religion',
		health: 'bg-cause-health',
		'personal-status': 'bg-cause-personal-status',
		'social-status': 'bg-cause-social-status',
		origin: 'bg-cause-origin'
	};
	const classes = $derived(
		`inline-flex shrink-0 items-center rounded-full border-2 px-s py-xs text-b6 text-ink ${bg[cause]} ${selected ? 'border-ink' : 'border-transparent'}`
	);
</script>

{#if onclick}
	<button type="button" class={classes} aria-pressed={selected} {onclick}>{labelTh}</button>
{:else}
	<span class={classes}>{labelTh}</span>
{/if}
