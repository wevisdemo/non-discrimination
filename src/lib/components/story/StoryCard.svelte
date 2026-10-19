<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		compact = false,
		children
	}: {
		class?: string;
		/** The narrow card used in KP1 */ compact?: boolean;
		children: Snippet;
	} = $props();
</script>

<!--
	Pink story card with the prototype's blue text. Blue on ui-primary is 4.41:1, just under AA
	(4.5:1); the design team accepted that, so axe skips colour contrast for `data-story-card`
	(tests/app.e2e.ts).
-->
<div
	data-story-card
	class="rounded-card bg-ui-primary text-center text-b5 text-primary {compact
		? 'w-[246px] p-m'
		: 'max-w-md p-l lg:text-b4'} {className}"
>
	{@render children()}
</div>
