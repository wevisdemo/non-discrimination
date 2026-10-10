<script lang="ts">
	import '@fontsource/ibm-plex-sans-thai-looped/400.css';
	import '@fontsource/ibm-plex-sans-thai-looped/700.css';
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import Footer from '#lib/components/layout/Footer.svelte';
	import Header from '#lib/components/layout/Header.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>ไม่เลือกปฏิบัติ</title>
	<meta name="description" content="สำรวจเมืองและค้นหาการเลือกปฏิบัติที่ซ่อนอยู่ในชีวิตประจำวัน" />
</svelte:head>

<a
	href="#main"
	class="sr-only focus:not-sr-only focus:fixed focus:top-s focus:left-s focus:z-50 focus:bg-surface focus:p-s"
	>ข้ามไปยังเนื้อหาหลัก</a
>
<div class="flex min-h-dvh flex-col">
	<Header />
	<main id="main" class="flex flex-1 flex-col">
		{@render children()}
	</main>
	<Footer />
</div>
