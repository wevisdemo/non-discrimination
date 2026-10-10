<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '#lib/components/ui/Button.svelte';
</script>

<section class="flex flex-col items-center gap-s rounded-card bg-ui-secondary p-l text-center">
	<span aria-hidden="true" class="text-h6">🔍</span>
	<p class="text-b5 text-ink">ยังมีการเลือกปฏิบัติซ่อนอยู่ในเมืองอีก ลองหาดูไหม?</p>
	<Button href={resolve('/explore')}>กลับไปสำรวจเมือง</Button>
</section>
