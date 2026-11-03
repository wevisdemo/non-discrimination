<script lang="ts">
	import scrollHint from '#lib/assets/intro/scroll-hint.svg';

	/**
	 * `href` must already be resolved by the caller, e.g. `resolve('/cases')` or a `#section` hash.
	 * Scrolling already moves on, so it says "เลื่อนลงเพื่อดูต่อ" (Figma's phone label) at every size.
	 */
	let { href }: { href: string } = $props();
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- resolved by the caller -->
<a
	{href}
	class="text-outline flex flex-col items-center gap-xs text-b5 font-bold text-primary drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)]"
>
	เลื่อนลงเพื่อดูต่อ
	<img src={scrollHint} alt="" width="13" height="24.4142" />
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
