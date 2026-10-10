<script lang="ts">
	import DefinitionPanel from '#lib/components/definition/DefinitionPanel.svelte';
	import { getCause } from '#lib/content/index.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head><title>{getCause(data.cause).labelTh} · ไม่เลือกปฏิบัติ</title></svelte:head>

<div class="px-m pt-xxl pb-xl">
	<DefinitionPanel cause={data.cause} />
</div>
