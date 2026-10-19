<script lang="ts">
	import book from '#lib/assets/kp2/book.svg';

	let { onclick }: { onclick: () => void } = $props();
</script>

<!-- Figma "Button_explore", type Info: opens the full-content panel -->
<button
	type="button"
	class="flex items-center gap-s rounded-lg border border-ink bg-ui-primary p-s text-b5 font-bold text-ink drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)] hover:bg-ui-primary-hover"
	aria-haspopup="dialog"
	{onclick}
>
	<img src={book} alt="" width="22" height="22" class="mix-blend-multiply" />
	อ่านเนื้อหาเต็ม
</button>
