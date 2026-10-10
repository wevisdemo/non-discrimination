<script lang="ts">
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let {
		open,
		title,
		onclose,
		children
	}: { open: boolean; title: string; onclose: () => void; children: Snippet } = $props();
</script>

<Dialog.Root {open} onOpenChange={(next) => !next && onclose()}>
	<Dialog.Portal>
		<!-- White scrim dims the map (design.md §2.4: focused state) -->
		<Dialog.Overlay class="fixed inset-0 z-40 bg-white/70" />
		<!-- Labelled by `title`; the visible heading lives in the content to avoid a duplicate -->
		<Dialog.Content
			aria-label={title}
			class="fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100vw-2*var(--spacing-m))] max-w-[420px] -translate-1/2 overflow-y-auto rounded-card bg-surface p-m shadow-lg lg:p-l"
		>
			{@render children()}
			<Dialog.Close
				class="absolute top-s right-s rounded-full px-s text-b4 text-body hover:text-primary"
				aria-label="ปิด">✕</Dialog.Close
			>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
