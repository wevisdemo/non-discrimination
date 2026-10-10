<script lang="ts">
	import { trackEvent } from '#lib/analytics.ts';
	import Button from '#lib/components/ui/Button.svelte';
	import type { Game, GameMode } from '#lib/state/game.svelte.ts';

	let { game }: { game: Game } = $props();

	function toggle(mode: GameMode) {
		const next = game.mode === mode ? 'default' : mode;
		game.setMode(next);
		trackEvent({ name: 'mode_changed', mode: next });
	}
</script>

<div class="flex flex-wrap items-center gap-s">
	<p class="rounded-full bg-surface px-m py-s text-b6 text-ink" aria-live="polite">
		พบแล้ว {game.found.size}/{game.cases.length} เคส
	</p>
	<Button variant="secondary" aria-pressed={game.mode === 'hint'} onclick={() => toggle('hint')}>
		ใช้ตัวช่วย
	</Button>
	<Button aria-pressed={game.mode === 'reveal'} onclick={() => toggle('reveal')}>ดูเฉลย</Button>
</div>
