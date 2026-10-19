<script lang="ts">
	import scrollHint from '#lib/assets/intro/scroll-hint.svg';

	/** `href` must already be resolved by the caller, e.g. `resolve('/cases')` or a `#section` hash */
	let { href, label = 'คลิกเพื่อดูต่อ' }: { href: string; label?: string } = $props();
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- resolved by the caller -->
<a
	{href}
	class="flex flex-col items-center gap-xs text-b5 font-bold text-primary drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)]"
>
	{label}
	<img src={scrollHint} alt="" width="13" height="24.4142" />
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
