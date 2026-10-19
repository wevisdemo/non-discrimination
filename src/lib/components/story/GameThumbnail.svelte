<script lang="ts">
	import artwork from '#lib/assets/kp1/kp2-thumbnail.png';
	import mask from '#lib/assets/kp1/kp2-thumbnail-mask.svg';

	// Built here because Vite may inline the small SVG as a data URI, which needs double quotes
	const maskStyle = ['mask', '-webkit-mask']
		.map(
			(p) =>
				`${p}-image:url("${mask}");${p}-size:169px 169px;${p}-position:2.879px -17.284px;${p}-repeat:no-repeat`
		)
		.join(';');
</script>

<!-- The KP2 map artwork cropped to a circle (Figma "kp2-thumbnail", 169px) -->
<div class="size-[169px] shrink-0 rounded-full bg-surface" aria-hidden="true">
	<div class="mt-[17.28px] -ml-[1.7%] aspect-[370/320] w-[103.6%]" style={maskStyle}>
		<img src={artwork} alt="" class="size-full object-cover" />
	</div>
</div>
