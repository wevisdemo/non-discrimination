<script lang="ts">
	import { asset } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import '@fontsource/ibm-plex-sans-thai-looped/400.css';
	import '@fontsource/ibm-plex-sans-thai-looped/700.css';
	import '@wevisdemo/ui/styles/cookie-consent.css';
	import './layout.css';
	import WvCookieConsent from '@wevisdemo/ui/svelte/cookie-consent.svelte';
	import Header from '#lib/components/layout/Header.svelte';
	import { SITE_ORIGIN } from '#lib/site.ts';
	import { COOKIE_OPTIONS } from '#lib/state/consent.ts';
	import { applyConsent } from '#lib/state/cookie.ts';
	import { explore } from '#lib/state/explore.svelte.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	onMount(() => (explore.ready = true));

	const description =
		'Spot the Discrimination: ตระหนัก เข้าใจ ไม่เลือกปฏิบัติ สำรวจเมืองและค้นหาการเลือกปฏิบัติที่ซ่อนอยู่ในชีวิตประจำวัน';
	const shareTitle = 'Spot the Discrimination: ตระหนัก เข้าใจ ไม่เลือกปฏิบัติ';
	// A case page shares as that case (its name and what happened); everything else as the site
	const item = $derived(
		'item' in page.data ? (page.data.item as { titleTh: string; summaryTh: string }) : undefined
	);
	const ogTitle = $derived(item?.titleTh ?? shareTitle);
	const ogDescription = $derived(item?.summaryTh ?? description);
	const shareImageAlt = 'Spot the Discrimination ตระหนัก เข้าใจ ไม่เลือกปฏิบัติ';
	// The share image's full address. asset() is relative to the page (so it works at any depth);
	// resolving it against the page gives the path it is served under, /non-discrimination/ on
	// GitHub Pages, and the published origin goes in front
	const shareImage = $derived(
		`${SITE_ORIGIN}${new URL(asset('og-image.png'), page.url.href).pathname}`
	);
</script>

<svelte:head>
	<link rel="icon" href={asset('favicon.svg')} type="image/svg+xml" />
	<link rel="icon" href={asset('favicon.ico')} sizes="48x48" />
	<link rel="apple-touch-icon" href={asset('apple-touch-icon.png')} />
	<title>ไม่เลือกปฏิบัติ</title>
	<meta name="description" content={description} />

	<!-- How a shared link looks (Figma "OG+Favicon"). The image has to be an absolute URL -->
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="th_TH" />
	<meta property="og:site_name" content="Spot the Discrimination" />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={ogDescription} />
	<meta property="og:image" content={shareImage} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={shareImageAlt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={ogDescription} />
	<meta name="twitter:image" content={shareImage} />
	<meta name="twitter:image:alt" content={shareImageAlt} />
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
