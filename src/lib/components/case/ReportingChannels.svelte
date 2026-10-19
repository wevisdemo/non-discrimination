<script lang="ts">
	import facebook from '#lib/assets/kp2/facebook.svg';
	import headset from '#lib/assets/kp2/headset.svg';
	import launch from '#lib/assets/kp2/launch.svg';
	import web from '#lib/assets/kp2/web.svg';
	import { reportingChannels as c } from '#lib/content/index.ts';

	let { headingLevel = 3 }: { headingLevel?: 2 | 3 } = $props();

	const row =
		'flex w-full flex-wrap items-center gap-s rounded-sm border border-primary p-s text-b6';
	const label = 'flex w-[200px] items-center gap-xs text-primary';
	const link = 'flex min-w-0 flex-1 items-center justify-between gap-xs text-ink';
</script>

<!-- Figma "Contact": the same for every case -->
<section class="flex w-full flex-col gap-m text-center">
	<div class="flex flex-col gap-xxs text-primary">
		<p class="text-b6">หากมีเรื่องร้องเรียนด้านสิทธิมนุษยชน สามารถติดต่อ</p>
		<svelte:element this={`h${headingLevel}`} class="text-b5 font-bold text-primary">
			{c.officeFull}
		</svelte:element>
	</div>
	<ul class="flex flex-col gap-s text-left">
		<li class={row}>
			<span class={label}><img src={facebook} alt="" width="16" height="16" />Facebook</span>
			{#if c.facebookUrl}
				<a class={link} href={c.facebookUrl} target="_blank" rel="noopener external">
					<span class="underline">{c.facebook}</span>
					<img src={launch} alt="(เปิดในแท็บใหม่)" width="16" height="16" />
				</a>
			{:else}
				<span class="{link} underline">{c.facebook}</span>
			{/if}
		</li>
		<li class={row}>
			<span class={label}
				><img src={web} alt="" width="16" height="16" />ช่องทางรับเรื่องออนไลน์</span
			>
			<a class={link} href={c.complaintsUrl} target="_blank" rel="noopener external">
				<span class="underline">{c.complaintsUrl}</span>
				<img src={launch} alt="(เปิดในแท็บใหม่)" width="16" height="16" />
			</a>
		</li>
		<li class={row}>
			<span class={label}><img src={headset} alt="" width="16" height="16" />สายด่วน</span>
			<a class="text-primary" href="tel:{c.hotline}">{c.hotline}</a>
		</li>
	</ul>
</section>
