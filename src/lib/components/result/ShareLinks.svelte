<script lang="ts">
	import { page } from '$app/state';
	import circle from '#lib/assets/result/share-circle.svg';
	import facebook from '#lib/assets/result/share-facebook.svg';
	import link from '#lib/assets/result/share-link.svg';
	import x from '#lib/assets/result/share-x.svg';

	/** The site's own address, without any #section or case path */
	const url = $derived(new URL(page.url.pathname.replace(/cases\/.*$/, ''), page.url.origin).href);
	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// Clipboard blocked: nothing to do, the address bar still has the link
		}
	}
</script>

<!-- Figma "แชร์เว็บไซต์นี้": copy link, Facebook, X -->
<div class="flex flex-col items-center gap-s">
	<h2 class="font-body text-b4 font-bold text-primary">แชร์เว็บไซต์นี้</h2>
	<div class="flex items-center gap-s">
		<button type="button" class="relative size-7" aria-label="คัดลอกลิงก์" onclick={copy}>
			<img src={circle} alt="" width="28" height="28" />
			<img
				src={link}
				alt=""
				width="16"
				height="16"
				class="absolute top-1/2 left-1/2 -translate-1/2"
			/>
		</button>
		<a
			class="size-7"
			href="https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(url)}"
			target="_blank"
			rel="noopener external"
			aria-label="แชร์ทาง Facebook"><img src={facebook} alt="" width="28" height="28" /></a
		>
		<a
			class="relative size-7"
			href="https://twitter.com/intent/tweet?url={encodeURIComponent(url)}"
			target="_blank"
			rel="noopener external"
			aria-label="แชร์ทาง X"
		>
			<img src={circle} alt="" width="28" height="28" />
			<img src={x} alt="" width="14" height="15" class="absolute top-1/2 left-1/2 -translate-1/2" />
		</a>
	</div>
	<p class="text-b6 text-primary" aria-live="polite">{copied ? 'คัดลอกลิงก์แล้ว' : ''}</p>
</div>
