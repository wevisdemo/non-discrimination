<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '#lib/components/ui/Button.svelte';
</script>

<!-- TODO(M4): storytelling intro (map hero crop, gradient, case vignettes) from Figma "Intro" frame -->
<section class="mx-auto flex max-w-[640px] flex-col items-center gap-l px-m py-xxl text-center">
	<h1 class="text-h3-m font-bold lg:text-h3">ไม่เลือกปฏิบัติ</h1>
	<p class="text-b4">ในเมืองนี้มีการเลือกปฏิบัติซ่อนอยู่หลายจุด ลองสำรวจแล้วหาให้ครบทุกเคส</p>
	<Button href={resolve('/explore')}>เริ่มสำรวจเมือง</Button>
</section>
