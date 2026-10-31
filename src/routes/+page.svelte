<script lang="ts">
	import { onMount } from 'svelte';
	import CausesSection from '#lib/components/sections/CausesSection.svelte';
	import DefinitionSection from '#lib/components/sections/DefinitionSection.svelte';
	import FloatingInfo from '#lib/components/definition/FloatingInfo.svelte';
	import ExploreSection from '#lib/components/sections/ExploreSection.svelte';
	import IntroSection from '#lib/components/sections/IntroSection.svelte';
	import SectionPlaceholder from '#lib/components/sections/SectionPlaceholder.svelte';
	import SummarySection from '#lib/components/sections/SummarySection.svelte';
	import { stages } from '#lib/stages.ts';
	import { explore } from '#lib/state/explore.svelte.ts';
	import { stageTracker } from '#lib/state/stage.svelte.ts';

	onMount(() => stageTracker.watch());

	// TODO: replace the placeholder with the real About section
	const placeholders = stages.filter((s) => s.id === 'about');
</script>

<svelte:head><title>Spot the Discrimination · ไม่เลือกปฏิบัติ</title></svelte:head>

<!-- The page behind the map overlay can't be reached while it is open -->
<div inert={explore.open}>
	<IntroSection />
	<DefinitionSection />
	<CausesSection />
	<SummarySection />
	{#each placeholders as stage (stage.id)}
		<SectionPlaceholder id={stage.id} title={stage.label} />
	{/each}
</div>
<ExploreSection />
<FloatingInfo />
