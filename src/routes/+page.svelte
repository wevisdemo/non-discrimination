<script lang="ts">
	import { onMount } from 'svelte';
	import DefinitionSection from '#lib/components/sections/DefinitionSection.svelte';
	import ExploreSection from '#lib/components/sections/ExploreSection.svelte';
	import IntroSection from '#lib/components/sections/IntroSection.svelte';
	import SectionPlaceholder from '#lib/components/sections/SectionPlaceholder.svelte';
	import { stages } from '#lib/stages.ts';
	import { explore } from '#lib/state/explore.svelte.ts';
	import { stageTracker } from '#lib/state/stage.svelte.ts';

	onMount(() => stageTracker.watch());

	// TODO: replace the placeholders with the real KP3, Result and About sections
	const placeholders = stages.filter((s) => ['causes', 'summary', 'about'].includes(s.id));
</script>

<svelte:head><title>Spot the Discrimination · ไม่เลือกปฏิบัติ</title></svelte:head>

<!-- The page behind the map overlay can't be reached while it is open -->
<div inert={explore.open}>
	<IntroSection />
	<DefinitionSection />
	{#each placeholders as stage (stage.id)}
		<SectionPlaceholder id={stage.id} title={stage.label} />
	{/each}
</div>
<ExploreSection />
