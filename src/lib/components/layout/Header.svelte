<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<header class="sticky top-0 z-30 flex h-20 items-center justify-between bg-surface px-m lg:px-xl">
	<!-- TODO(M1): replace wordmark with the logo exported from Figma -->
	<a href={resolve('/')} class="font-header text-b4 font-bold text-primary">ไม่เลือกปฏิบัติ</a>
	<nav aria-label="หลัก">
		<ul class="flex gap-m text-b6 lg:gap-l lg:text-b5">
			<li>
				<a class="text-ink hover:text-primary hover:underline" href={resolve('/explore')}
					>สำรวจเมือง</a
				>
			</li>
			<li>
				<a class="text-ink hover:text-primary hover:underline" href={resolve('/cases')}
					>เคสทั้งหมด</a
				>
			</li>
		</ul>
	</nav>
</header>
