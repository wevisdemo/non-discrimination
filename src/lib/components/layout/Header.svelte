<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { stages } from '#lib/stages.ts';
	import { stageTracker } from '#lib/state/stage.svelte.ts';

	// /cases and /definition pages are part of the game, so they keep showing the explore label.
	const currentId = $derived(page.route.id === '/' ? stageTracker.current : 'explore');
	const current = $derived(stages.find((s) => s.id === currentId) ?? stages[0]);
	let open = $state(false);

	function closeOnOutside(node: HTMLElement) {
		// composedPath, not target.contains: the button's contents are swapped on click, so by the
		// time this runs the clicked element may already be detached from the nav.
		const onClick = (e: MouseEvent) => {
			if (!e.composedPath().includes(node)) open = false;
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') open = false;
		};
		document.addEventListener('click', onClick);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('click', onClick);
			document.removeEventListener('keydown', onKey);
		};
	}
</script>

<!-- Floats over the full-bleed map, as in the prototype -->
<header
	class="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between px-m py-m lg:px-l"
>
	<!-- TODO: swap for the WeVis logo SVG once exported from Figma -->
	<a
		href={resolve('/')}
		class="pointer-events-auto font-header text-h7-m font-bold tracking-tight text-ink lg:text-h7"
		>WeVis</a
	>

	<nav aria-label="เนื้อหา" class="pointer-events-auto relative" {@attach closeOnOutside}>
		<!-- One button for both states so keyboard focus stays on it when the menu opens -->
		<button
			type="button"
			class="flex h-8 items-center justify-center border border-ink bg-surface text-b6 text-body hover:border-transparent hover:bg-ui-primary-hover {open
				? 'w-8 rounded-full'
				: 'gap-s rounded-full pr-s pl-m'}"
			aria-expanded={open}
			aria-controls={open ? 'stage-menu' : undefined}
			aria-label={open ? 'ปิดเมนู' : undefined}
			onclick={() => (open = !open)}
		>
			{#if open}
				<svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path
						d="M2 2l10 10M12 2L2 12"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
			{:else}
				<span class="max-w-[45vw] truncate">{current.label}</span>
				<svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
					<path
						d="M3 5h14M3 10h14M3 15h14"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
				<span class="sr-only">เมนู</span>
			{/if}
		</button>
		{#if open}
			<ul
				id="stage-menu"
				class="absolute top-full right-0 mt-xs flex w-[250px] max-w-[calc(100vw-2rem)] flex-col rounded-card border border-ink bg-surface p-s text-b6 text-body"
			>
				{#each stages as stage, i (stage.id)}
					<li class={i > 0 ? 'border-t border-primary' : ''}>
						<a
							class="block px-s py-s text-right hover:bg-ui-primary-hover {stage.id === current.id
								? 'font-bold text-primary'
								: ''}"
							href="{resolve('/')}#{stage.id}"
							aria-current={stage.id === current.id ? 'true' : undefined}
							onclick={() => (open = false)}>{stage.label}</a
						>
					</li>
				{/each}
			</ul>
		{/if}
	</nav>
</header>
