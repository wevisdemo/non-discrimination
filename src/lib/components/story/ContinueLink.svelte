<script lang="ts">
	import scrollHint from '#lib/assets/intro/scroll-hint.svg';
</script>

<!-- Figma's "เลื่อนลงเพื่อดูต่อ": a hint, not a control, since scrolling already moves on -->
<p
	class="text-outline flex flex-col items-center gap-xs text-b5 font-bold text-primary drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)]"
>
	เลื่อนลงเพื่อดูต่อ
	<img src={scrollHint} alt="" width="13" height="24.4142" />
</p>
