<script lang="ts">
	import learn1 from '#lib/assets/definition/elearning-1.png?enhanced';
	import learn2 from '#lib/assets/definition/elearning-2.png?enhanced';
	import learn3 from '#lib/assets/definition/elearning-3.png?enhanced';

	let { class: className = '' }: { class?: string } = $props();
</script>

<!-- Figma "E-Learning": in the full-content panel and at the end of the Result -->
<section class="flex flex-col items-center gap-l bg-ui-primary text-center text-ink {className}">
	<div class="flex flex-col gap-xs">
		<h2 class="font-header text-h7-m leading-normal font-bold text-ink lg:text-h7">
			อยากเข้าใจการเลือกปฏิบัติแบบละเอียดยิ่งขึ้น ?
		</h2>
		<p class="text-b5">คำนิยาม รูปแบบ การแยกแยะ วิธีรับมือ และอื่น ๆ</p>
	</div>
	<div class="flex w-full gap-xs">
		{#each [learn1, learn2, learn3] as img, i (i)}
			<enhanced:img
				src={img}
				alt=""
				sizes="(min-width: 1024px) 340px, 33vw"
				class="aspect-[224/118] min-w-0 flex-1 object-cover"
			/>
		{/each}
	</div>
	<p class="text-b6">
		ชวนเรียนรู้ต่อที่ <strong>E-Learning: ‘The Inclusion Lab’</strong><br />โดย
		สํานักงานคณะกรรมการสิทธิมนุษยชนแห่งชาติ เครือข่ายประชาชนขจัดการเลือกปฏิบัติ (MovED)
		และมูลนิธิเพื่อสิทธิความหลากหลาย พร้อมรับเกียรติบัตรหลังทำแบบทดสอบ !
	</p>
	<a
		href="https://move-d.org/lab/"
		target="_blank"
		rel="noopener external"
		class="rounded-full border-2 border-ink bg-ui-primary px-m py-s text-b5 hover:bg-ui-primary-hover"
		>คลิกที่นี่<span class="sr-only"> (E-Learning The Inclusion Lab, เปิดในแท็บใหม่)</span></a
	>
</section>
