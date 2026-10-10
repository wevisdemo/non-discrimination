<script lang="ts">
	import type { Snippet } from 'svelte';

	let { class: className = '', children }: { class?: string; children: Snippet } = $props();
</script>

<!-- Pink story card. Text is ink, not the prototype's blue: blue on ui-primary is 4.41:1 and fails AA -->
<div
	class="max-w-md rounded-card bg-ui-primary p-l text-center text-b5 text-ink lg:text-b4 {className}"
>
	{@render children()}
</div>
