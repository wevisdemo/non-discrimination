<script lang="ts">
	/** `href` must already be resolved by the caller, e.g. `resolve('/explore')` */
	let { href, label = 'คลิกเพื่อดูต่อ' }: { href: string; label?: string } = $props();
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- resolved by the caller -->
<a {href} class="flex flex-col items-center text-b5 text-primary underline">
	{label}
	<svg aria-hidden="true" width="16" height="22" viewBox="0 0 16 22" fill="none" class="mt-xs">
		<path
			d="M8 21s7-7.5 7-13A7 7 0 0 0 1 8c0 5.5 7 13 7 13Z"
			stroke="currentColor"
			stroke-width="1.5"
		/>
		<circle cx="8" cy="8" r="2.5" fill="currentColor" />
	</svg>
</a>
