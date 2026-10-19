<script lang="ts">
	import { trackEvent } from '#lib/analytics.ts';
	import pedestrian from '#lib/assets/kp2/pedestrian.svg';
	import view from '#lib/assets/kp2/view.svg';
	import type { Game } from '#lib/state/game.svelte.ts';

	let { game }: { game: Game } = $props();

	function toggleReveal() {
		const next = game.mode === 'reveal' ? 'default' : 'reveal';
		game.setMode(next);
		trackEvent({ name: 'mode_changed', mode: next });
	}

	// Figma "KP2_Nav": small rounded buttons, black 14px labels, 22px icons
	const button =
		'flex items-center justify-center gap-s rounded-lg p-s text-b6 text-ink aria-pressed:ring-2 aria-pressed:ring-accent';
</script>

<div class="flex flex-col items-end gap-s">
	<!-- eslint-disable svelte/no-navigation-without-resolve -- in-page anchor -->
	<a href="#causes" class="{button} bg-ui-secondary hover:bg-ui-secondary-hover">
		<span class="relative size-[22px] shrink-0 overflow-clip" aria-hidden="true">
			<span class="absolute inset-[6.82%_21.3%_9.09%_25.84%]">
				<img
					src={pedestrian}
					alt=""
					class="absolute inset-[-0.68%_-1.07%_-0.94%_-1.07%] size-full"
				/>
			</span>
		</span>
		ออกจากการสำรวจ
	</a>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
	<button
		type="button"
		class="{button} bg-ui-primary hover:bg-ui-primary-hover"
		aria-pressed={game.mode === 'reveal'}
		onclick={toggleReveal}
	>
		<!-- The exported icons carry a white square meant to be multiplied away -->
		<img src={view} alt="" width="22" height="22" class="mix-blend-multiply" />
		เฉลยตำแหน่งภาพ
	</button>
	<!-- TODO: "เจาะดูทีละภาพ" (step through the cases one by one, icon: the Figma "Crossroads")
		needs the case card's counter and ‹ › controls, which are not built yet -->
</div>
