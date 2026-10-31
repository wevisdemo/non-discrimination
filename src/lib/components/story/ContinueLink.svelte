<script lang="ts">
	import scrollHint from '#lib/assets/intro/scroll-hint.svg';

	/**
	 * `href` must already be resolved by the caller, e.g. `resolve('/cases')` or a `#section` hash.
	 * Figma labels it "คลิกเพื่อดูต่อ" on desktop and "เลื่อนลงเพื่อดูต่อ" on phones, where you scroll.
	 */
	let { href }: { href: string } = $props();
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- resolved by the caller -->
<a
	{href}
	class="flex flex-col items-center gap-xs text-b5 font-bold text-primary drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)]"
>
	<span class="hidden lg:inline">คลิกเพื่อดูต่อ</span><span class="lg:hidden"
		>เลื่อนลงเพื่อดูต่อ</span
	>
	<img src={scrollHint} alt="" width="13" height="24.4142" />
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
