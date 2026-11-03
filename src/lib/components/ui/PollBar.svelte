<script lang="ts">
	let { percent }: { percent: number } = $props();
</script>

<!-- Figma Poll answered state: the share of votes as a blue bar on grey, the number at the end -->
<span class="relative mt-xs block h-4 w-full bg-[#d9d9d9]">
	<span class="block h-full bg-primary" style="width:{percent}%"></span>
	<span
		class="absolute inset-y-0 right-xs flex items-center text-b6 font-bold {percent > 80
			? 'text-white'
			: 'text-ink'}">{percent.toFixed(1)}%</span
	>
</span>
