<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary';
	type Props = { variant?: Variant; children: Snippet } & (
		({ href: string } & HTMLAnchorAttributes) | ({ href?: undefined } & HTMLButtonAttributes)
	);

	let { variant = 'primary', children, class: className = '', ...rest }: Props = $props();

	// design.md §3.5
	const variants: Record<Variant, string> = {
		primary: 'bg-ui-primary text-ink hover:bg-ui-primary-hover aria-pressed:border-accent',
		secondary:
			'bg-ui-secondary text-primary hover:bg-ui-secondary-hover aria-pressed:border-primary'
	};
	const classes = $derived(
		`inline-flex items-center justify-center gap-xs rounded-full border-2 border-transparent px-m py-s font-body text-b5 font-bold transition-colors disabled:cursor-not-allowed disabled:bg-ui-disable disabled:text-body ${variants[variant]} ${className}`
	);
</script>

{#if rest.href !== undefined}
	<a class={classes} {...rest as HTMLAnchorAttributes}>{@render children()}</a>
{:else}
	<button type="button" class={classes} {...rest as HTMLButtonAttributes}
		>{@render children()}</button
	>
{/if}
