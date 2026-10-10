<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		style,
		children
	}: { class?: string; style?: string; children: Snippet } = $props();
</script>

<!-- Blue thought bubble from the prototype; primary on ui-secondary is 5.15:1 (AA) -->
<p
	class="w-56 rounded-[2rem] bg-ui-secondary px-m py-s text-center text-b6 text-primary shadow lg:w-64 lg:text-b5 {className}"
	{style}
>
	{@render children()}
</p>
