<script lang="ts">
	import { Dialog } from 'bits-ui';
	import close from '#lib/assets/kp2/close.svg';
	import type { Case } from '#lib/content/index.ts';
	import CaseCard from './CaseCard.svelte';

	let {
		item,
		onclose,
		onprev,
		onnext
	}: { item: Case; onclose: () => void; onprev: () => void; onnext: () => void } = $props();
</script>

<!-- Figma "kp2-info-desktop": a white sheet over the map, below the header; no scrim -->
<Dialog.Root open onOpenChange={(next) => !next && onclose()}>
	<Dialog.Portal>
		<Dialog.Content
			aria-label={item.titleTh}
			class="fixed top-[57px] bottom-0 left-1/2 z-50 flex w-[600px] max-w-full -translate-x-1/2 flex-col gap-s overflow-y-auto rounded-t-card bg-surface p-m shadow-lg"
		>
			<div class="flex justify-end">
				<Dialog.Close aria-label="ปิด" class="rounded-sm hover:bg-ui-primary-hover">
					<img src={close} alt="" width="24" height="24" />
				</Dialog.Close>
			</div>
			<CaseCard {item} {onprev} {onnext} />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
