<script lang="ts">
	import type { StageId } from '#lib/stages.ts';

	let { id, title }: { id: StageId; title: string } = $props();
</script>

<!-- TODO: temporary stand-in; replace with the real section once its page is built -->
<section {id} class="flex min-h-dvh flex-col items-center justify-center gap-s px-m text-center">
	<h2 class="text-h6-m font-bold lg:text-h6">{title}</h2>
	<p class="text-b5">เนื้อหาส่วนนี้กำลังจัดทำ</p>
</section>
