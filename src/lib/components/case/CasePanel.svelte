<script lang="ts">
	import { Dialog } from 'bits-ui';
	import close from '#lib/assets/kp2/close.svg';
	import type { Case } from '#lib/content/index.ts';
	import CaseCard from './CaseCard.svelte';

	let {
		item,
		onclose,
		onprev,
		onnext,
		hidden = false
	}: {
		item: Case;
		onclose: () => void;
		onprev: () => void;
		onnext: () => void;
		/** Faded out while the map moves to the next case */
		hidden?: boolean;
	} = $props();
</script>

<!-- Figma "kp2-info-desktop": a white sheet over the map, below the header; no scrim -->
<Dialog.Root open onOpenChange={(next) => !next && onclose()}>
	<Dialog.Portal>
		<Dialog.Content
			aria-label={item.titleTh}
			class="fixed top-[57px] bottom-0 left-1/2 z-50 flex w-[600px] max-w-full -translate-x-1/2 flex-col gap-s overflow-y-auto rounded-t-card bg-surface shadow-lg transition-opacity duration-250 {hidden
				? 'opacity-0'
				: ''}"
		>
			<!-- bits-ui forces pointer-events on the sheet itself, so the clicks are blocked one level down -->
			<div class="flex flex-col gap-s px-m pb-m {hidden ? 'pointer-events-none' : ''}">
				<!-- Stays at the top of the sheet while the card scrolls under it -->
				<div class="sticky top-0 z-10 flex justify-end bg-surface pt-m">
					<Dialog.Close aria-label="ปิด" class="rounded-sm hover:bg-ui-primary-hover">
						<img src={close} alt="" width="24" height="24" class="mix-blend-multiply" />
					</Dialog.Close>
				</div>
				<CaseCard {item} {onprev} {onnext} />
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
