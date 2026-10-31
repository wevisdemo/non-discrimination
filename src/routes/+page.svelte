<script lang="ts">
	import { onMount } from 'svelte';
	import AboutSection from '#lib/components/sections/AboutSection.svelte';
	import CausesSection from '#lib/components/sections/CausesSection.svelte';
	import DefinitionSection from '#lib/components/sections/DefinitionSection.svelte';
	import FloatingInfo from '#lib/components/definition/FloatingInfo.svelte';
	import ExploreSection from '#lib/components/sections/ExploreSection.svelte';
	import IntroSection from '#lib/components/sections/IntroSection.svelte';
	import SummarySection from '#lib/components/sections/SummarySection.svelte';
	import { explore } from '#lib/state/explore.svelte.ts';
	import { stageTracker } from '#lib/state/stage.svelte.ts';

	onMount(() => stageTracker.watch());
</script>

<svelte:head><title>Spot the Discrimination · ไม่เลือกปฏิบัติ</title></svelte:head>

<!-- The page behind the map overlay can't be reached while it is open -->
<div inert={explore.open}>
	<IntroSection />
	<DefinitionSection />
	<CausesSection />
	<SummarySection />
	<AboutSection />
</div>
<ExploreSection />
<FloatingInfo />
