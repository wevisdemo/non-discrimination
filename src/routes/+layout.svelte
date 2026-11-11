<script lang="ts">
	import { onMount } from 'svelte';
	import '@fontsource/ibm-plex-sans-thai-looped/400.css';
	import '@fontsource/ibm-plex-sans-thai-looped/700.css';
	import '@wevisdemo/ui/styles/cookie-consent.css';
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import WvCookieConsent from '@wevisdemo/ui/svelte/cookie-consent.svelte';
	import Header from '#lib/components/layout/Header.svelte';
	import { COOKIE_OPTIONS } from '#lib/state/consent.ts';
	import { applyConsent } from '#lib/state/cookie.ts';
	import { explore } from '#lib/state/explore.svelte.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	onMount(() => (explore.ready = true));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>ไม่เลือกปฏิบัติ</title>
	<meta
		name="description"
		content="Spot the Discrimination: ตระหนัก เข้าใจ ไม่เลือกปฏิบัติ สำรวจเมืองและค้นหาการเลือกปฏิบัติที่ซ่อนอยู่ในชีวิตประจำวัน"
	/>
</svelte:head>

<a
	href="#main"
	class="sr-only focus:not-sr-only focus:fixed focus:top-s focus:left-s focus:z-50 focus:bg-surface focus:p-s"
	>ข้ามไปยังเนื้อหาหลัก</a
>
<div class="flex min-h-svh flex-col">
	<Header />
	<main id="main" class="flex flex-1 flex-col">
		{@render children()}
	</main>
</div>

<!-- WeVis's cookie banner: asks once, remembers the answer (30 days) and tells applyConsent what it is.
     The site's cookies are the Functionality ones. -->
<WvCookieConsent
	policyUrl="https://wevis.info/cookies_1-2-3-4/"
	cookieOptions={COOKIE_OPTIONS}
	onAccept={applyConsent}
/>
