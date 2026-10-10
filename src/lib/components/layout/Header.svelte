<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { stageFor, stages } from '#lib/stages.ts';

	const current = $derived(stageFor(page.route.id));
	let open = $state(false);

	function closeOnOutside(node: HTMLElement) {
		const onClick = (e: MouseEvent) => {
			if (!node.contains(e.target as Node)) open = false;
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
	class="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-m py-m lg:px-l"
>
	<!-- TODO: swap for the WeVis logo SVG once exported from Figma -->
	<a
		href={resolve('/')}
		class="pointer-events-auto font-header text-h7-m font-bold tracking-tight text-ink lg:text-h7"
		>WeVis</a
	>

	<nav aria-label="เนื้อหา" class="pointer-events-auto relative" {@attach closeOnOutside}>
		<button
			type="button"
			class="flex items-center gap-s rounded-full border border-ink bg-surface py-xs pr-s pl-m text-b6 text-ink"
			aria-expanded={open}
			aria-controls="stage-menu"
			onclick={() => (open = !open)}
		>
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
		</button>
		{#if open}
			<ul
				id="stage-menu"
				class="absolute top-full right-0 mt-s flex w-max min-w-full flex-col overflow-hidden rounded-card bg-surface text-b6 shadow-lg"
			>
				{#each stages as stage (stage.id)}
					<li>
						<a
							class="block px-m py-s hover:bg-surface-tint {stage.id === current.id
								? 'font-bold text-primary'
								: 'text-ink'}"
							href={resolve(stage.path)}
							aria-current={stage.id === current.id ? 'page' : undefined}
							onclick={() => (open = false)}>{stage.title}</a
						>
					</li>
				{/each}
				<li class="border-t border-ui-disable">
					<a
						class="block px-m py-s text-ink hover:bg-surface-tint"
						href={resolve('/cases')}
						onclick={() => (open = false)}>ดูเคสทั้งหมดแบบรายการ</a
					>
				</li>
			</ul>
		{/if}
	</nav>
</header>
