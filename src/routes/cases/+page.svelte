<script lang="ts">
	import CaseList from '#lib/components/case/CaseList.svelte';
</script>

<svelte:head><title>เคสทั้งหมด · ไม่เลือกปฏิบัติ</title></svelte:head>

<!-- Non-visual path to every case (design.md §2.4 accessibility) -->
<section class="mx-auto w-full max-w-[1280px] px-m py-xl lg:px-xl">
	<h1 class="mb-l text-h6-m font-bold lg:text-h6">เคสทั้งหมด</h1>
	<CaseList />
</section>
