<script lang="ts">
	import { trackEvent } from '#lib/analytics.ts';
	import crossroads from '#lib/assets/kp2/crossroads.svg';
	import pedestrian from '#lib/assets/kp2/pedestrian.svg';
	import view from '#lib/assets/kp2/view.svg';
	import viewOff from '#lib/assets/kp2/view-off.svg';
	import type { Game } from '#lib/state/game.svelte.ts';

	let { game, stepping, onstep }: { game: Game; stepping: boolean; onstep: () => void } = $props();

	const revealing = $derived(game.mode === 'reveal');

	function toggleReveal() {
		const next = revealing ? 'default' : 'reveal';
		game.setMode(next);
		trackEvent({ name: 'mode_changed', mode: next });
	}

	// Figma "KP2_Nav": small rounded buttons, black 14px labels, 22px icons; the active one turns
	// active-secondary pink. On phones the labels go (still read out) and only the icons show.
	const button =
		'flex items-center justify-center gap-s rounded-lg p-s text-b6 text-ink bg-ui-primary hover:bg-ui-primary-hover aria-pressed:bg-accent';
</script>

<div class="flex flex-col items-end gap-s">
	<!-- eslint-disable svelte/no-navigation-without-resolve -- in-page anchor -->
	<a
		href="#explore-intro"
		data-tutorial="exit"
		class="flex items-center justify-center gap-s rounded-lg bg-ui-secondary p-s text-b6 text-ink hover:bg-ui-secondary-hover"
	>
		<span class="relative size-[22px] shrink-0 overflow-clip" aria-hidden="true">
			<span class="absolute inset-[6.82%_21.3%_9.09%_25.84%]">
				<img
					src={pedestrian}
					alt=""
					class="absolute inset-[-0.68%_-1.07%_-0.94%_-1.07%] size-full"
				/>
			</span>
		</span>
		<span class="max-lg:sr-only">ออกจากการสำรวจ</span>
	</a>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
	<!-- The exported icons carry a white square meant to be multiplied away -->
	<!-- Like เปิดตัวช่วย, the label flips while it is on so it is clear this button turns it off -->
	<button
		type="button"
		class="{button} {revealing ? 'bg-accent' : ''}"
		data-tutorial="reveal"
		onclick={toggleReveal}
	>
		<img
			src={revealing ? viewOff : view}
			alt=""
			width="22"
			height="22"
			class="mix-blend-multiply"
		/>
		<span class="max-lg:sr-only">{revealing ? 'ปิดเฉลย' : 'เฉลยตำแหน่งภาพ'}</span>
	</button>
	<button
		type="button"
		class={button}
		data-tutorial="step"
		aria-pressed={stepping}
		onclick={onstep}
	>
		<img src={crossroads} alt="" width="22" height="22" class="mix-blend-multiply" />
		<span class="max-lg:sr-only">เจาะดูทีละภาพ</span>
	</button>
</div>
