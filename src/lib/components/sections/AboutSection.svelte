<script lang="ts">
	import envelope from '#lib/assets/about/envelope.png';
	import fFacebook from '#lib/assets/about/footer-1.svg';
	import fX from '#lib/assets/about/footer-2.svg';
	import fInstagram from '#lib/assets/about/footer-3.svg';
	import fMedium from '#lib/assets/about/footer-4.svg';
	import fGithub from '#lib/assets/about/footer-5.svg';
	import sLink from '#lib/assets/about/share-1.svg';
	import sFacebook from '#lib/assets/about/share-2.svg';
	import sX from '#lib/assets/about/share-3.svg';
	import sLine from '#lib/assets/about/share-4.svg';
	import symbol from '#lib/assets/about/wevis-symbol-white.svg';
	import { page } from '$app/state';

	// Copy from the "About Page" doc in Notion; layout from Figma "about_desktop" (1069:5081)
	const sources = [
		[
			'ปฏิญญาสากลว่าด้วยสิทธิมนุษยชน',
			'https://www.ohchr.org/en/human-rights/universal-declaration/translations/thai',
			' (UDHR)'
		],
		[
			'รัฐธรรมนูญ พ.ศ. 2560',
			'https://www.ratchakitcha.soc.go.th/DATA/PDF/2560/A/040/1.PDF',
			' มาตรา 4, 27'
		],
		[
			'สื่อการเรียนรู้ The Inclusion Lab',
			'https://move-d.org/lab/',
			' จัดทำโดยสำนักงาน กสม. MovED และมูลนิธิ FAIR',
			'เนื้อหาภายใน '
		],
		[
			'แผนสิทธิมนุษยชนแห่งชาติ ฉบับที่ 5',
			'https://ww2-api.rlpd.go.th/File/Documentcontent/695abd1d-89a1-4f07-5049-08db5034c451/20230509035706.pdf',
			''
		],
		[
			'รายงานสถานการณ์การตีตราและเลือกปฏิบัติในสังคมไทย 2568',
			'https://drive.google.com/file/d/1cI_-RB7n6y9v2OS6ePdJuY4CYJCOB04i/view?usp=drive_link',
			''
		],
		[
			'รายงานการสำรวจสถานการณ์การเลือกปฏิบัติในสังคมไทย ปี 2569',
			'https://docs.google.com/document/d/1gQ-qtKq1b-ZRyNNqea7Mx89V1Zbf__qR/edit?usp=sharing&ouid=114079185479146295206&rtpof=true&sd=true',
			''
		],
		// TODO(content): the doc links this report to the same file as the one above
		[
			'รายงานผลการศึกษาสถานการณ์การเลือกปฏิบัติต่อบุคคลในประเทศไทย ปี 2569',
			'https://docs.google.com/document/d/1gQ-qtKq1b-ZRyNNqea7Mx89V1Zbf__qR/edit?usp=sharing&ouid=114079185479146295206&rtpof=true&sd=true',
			''
		],
		[
			'สถานการณ์ตัวอย่างการเลือกปฏิบัติ',
			'https://docs.google.com/spreadsheets/d/1YqFgyHVwFWMwnwwruLjMJidlc8qwKj3S5TVH8gPhLgg/edit?usp=sharing',
			' รวบรวมโดยคณะทำงานจัดทำสื่อการเรียนรู้เพื่อขจัดการเลือกปฏิบัติ สำนักงาน กสม.'
		]
	] as const;

	const credits = [
		['เขียนโปรแกรม', ['โสภณ จำปาซ่อนกลิ่น']],
		['ออกแบบ', ['ชินธิป เอกก้านตรง']],
		[
			'สืบค้นและรวบรวมข้อมูล',
			[
				'ณภัทร แต้เถา',
				'คณะทำงานจัดทำสื่อการเรียนรู้เพื่อขจัดการเลือกปฏิบัติ สำนักงานคณะกรรมการสิทธิมนุษยชนแห่งชาติ'
			]
		],
		['บรรณาธิการ', ['ธนิสรา เรืองเดช', 'โมเลกุล จงวิไล']]
	] as const;

	// TODO(content): confirm WeVis's footer links (taken from the WeVis footer the design reuses)
	const follow = [
		{ label: 'Facebook', href: 'https://www.facebook.com/wevisdemo', icon: fFacebook },
		{ label: 'X', href: 'https://twitter.com/wevisdemo', icon: fX },
		{ label: 'Instagram', href: 'https://www.instagram.com/wevisdemo', icon: fInstagram },
		{ label: 'Medium', href: 'https://medium.com/wevisdemo', icon: fMedium },
		{ label: 'GitHub', href: 'https://github.com/wevisdemo', icon: fGithub }
	];

	const url = $derived(new URL(page.url.pathname.replace(/cases\/.*$/, ''), page.url.origin).href);
	const share = $derived([
		{
			label: 'แชร์ทาง Facebook',
			href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
			icon: sFacebook
		},
		{
			label: 'แชร์ทาง X',
			href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
			icon: sX
		},
		{
			label: 'แชร์ทาง LINE',
			href: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
			icon: sLine
		}
	]);
	let copied = $state(false);
	async function copy() {
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// Clipboard blocked: the address bar still has the link
		}
	}

	const h = 'font-header text-h7-m leading-[1.6] font-bold text-ink lg:text-h7';
	const link = 'underline hover:text-primary';
</script>

<section id="about" class="flex flex-col items-center bg-surface text-ink">
	<div class="flex min-h-[200px] items-center justify-center px-m pt-xxl pb-l">
		<h2 class="font-header text-h3-m leading-[1.6] font-bold text-ink lg:text-h3">
			เกี่ยวกับโครงการ
		</h2>
	</div>

	<div class="flex w-full max-w-[800px] flex-col gap-[100px] px-m pb-xl text-b5 leading-[1.6]">
		<div class="flex flex-col gap-[30px]">
			<h3 class={h}>เป้าหมาย</h3>
			<div class="flex flex-col gap-m">
				<p>
					การเลือกปฏิบัติ (Discrimination) บ่อยครั้งก็ถูก ‘จงใจ’ ทำให้เกิดขึ้นเพราะสังคมยังมี อคติ
					ต่อคนที่มีความแตกต่างหลากหลาย บ่อยครั้งก็ถูก ‘มองข้าม’ ไปเพราะสังคมยัง ไม่ตระหนัก
					ว่านั่นคือการละเมิดสิทธิ การเลือกปฏิบัติจึงกลายเป็นปัญหาที่ “ถูกซ่อนในที่แจ้ง (Hidden In
					Plain Sight)” นั่นคือ แฝงเร้นอยู่กับความปกติสามัญของชีวิตประจำวันได้อย่างแนบเนียน
				</p>
				<p>
					การทลายกำแพงของอคติ และตระหนักในสิทธิที่จะไม่ถูกเลือกปฏิบัติ จึงเปรียบเสมือนการ ‘มองเห็น’
					การเลือกปฏิบัติที่ซุกซ่อนอยู่ในชีวิตประจำวัน รู้เท่าทันว่าการกระทำนั้นคือสิ่งที่ไม่ถูกต้อง
					และหยุดยั้งการเลือกปฏิบัติไม่ให้ถูกมองข้ามและผลิตซ้ำในสังคมอีกต่อไป
				</p>
				<p>
					เป็นที่มาให้ WeVis
					<a class={link} href="https://www.nhrc.or.th/th" target="_blank" rel="noopener external"
						>สำนักงานคณะกรรมการสิทธิมนุษยชนแห่งชาติ (กสม.)</a
					>
					และ
					<a
						class={link}
						href="https://www.freiheit.org/th/bangkok"
						target="_blank"
						rel="noopener external">Friedrich Naumann Foundation for Freedom (FNF)</a
					>
					จัดทำสื่อการเรียนรู้ Spot the Discrimination: ตระหนัก เข้าใจ ไม่เลือกปฏิบัติ เพื่อสื่อสารเรื่องสิทธิที่จะไม่ถูกเลือกปฏิบัติในรูปแบบ
					“เกมหาของ” ที่จะพาให้ผู้ใช้งานสังเกตเห็นการเลือกปฏิบัติที่ซุกซ่อนอยู่ในชีวิตประจำวัน พร้อมกับเรียนรู้เนื้อหาพื้นฐานเรื่องสิทธิที่จะไม่ถูกเลือกปฏิบัติ
					เพื่อสร้างความตระหนักในสิทธิที่ตนเองมี และไม่ไปละเมิดสิทธินี้ของผู้อื่น
				</p>
				<p>เพราะเมื่อใดก็ตามที่ปัญหา ‘ถูกเห็น’ ปัญหานั้นก็ย่อมไร้ที่ทางให้ ‘ซ่อนตัว’ อีกต่อไป</p>
			</div>
		</div>

		<div class="flex flex-col gap-[30px]">
			<h3 class={h}>ที่มาของข้อมูล</h3>
			<ul class="list-disc pl-[24px]">
				{#each sources as [label, href, after, before] (label)}
					<li>
						{before ?? ''}<a class={link} {href} target="_blank" rel="noopener external">{label}</a
						>{after}
					</li>
				{/each}
			</ul>
		</div>

		<div class="flex flex-col gap-[30px]">
			<h3 class={h}>นโยบายการนำข้อมูลไปใช้ต่อ</h3>
			<div class="flex flex-col gap-m">
				<!-- TODO(content): "ShareAlike" with "ห้ามนำไปใช้เพื่อการค้า" describes CC BY-NC-SA; confirm the licence -->
				<p>
					ทางทีมมีความตั้งใจที่พัฒนาทุกโปรเจ็กต์ให้เป็น Open Source และเปิดข้อมูลเป็น Open Data
					ภายใต้เงื่อนไข Creative Commons Attribution-ShareAlike License
					คือสามารถนำไปเผยแพร่และดัดแปลงได้ โดยต้องระบุที่มา แต่ห้ามนำไปใช้เพื่อการค้า
					และต้องเผยแพร่งานดัดแปลงโดยใช้สัญญาอนุญาตชนิดเดียวกัน
				</p>
				<p>
					หากมีข้อสงสัยต้องการสอบถามเพิ่มเติม
					ประสงค์แจ้งเปลี่ยนแปลงหรือเพิ่มเติมข้อมูลเพื่อความถูกต้อง หรือมีข้อเสนอแนะใดๆ
					สามารถติดต่อได้ที่ <a class={link} href="mailto:team@wevis.info">team@wevis.info</a>
				</p>
			</div>
		</div>

		<div class="flex flex-col gap-[30px]">
			<h3 class={h}>อาสาสมัครร่วมพัฒนา</h3>
			{#each credits as [role, names] (role)}
				<div class="flex flex-col gap-[10px]">
					<h4 class="text-b4 leading-normal font-bold text-ink">{role}</h4>
					<p>
						{#each names as name, i (name)}{#if i}<br />{/if}{name}{/each}
					</p>
				</div>
			{/each}
			<div class="flex flex-col gap-[10px]">
				<h4 class="text-b4 leading-normal font-bold text-ink">ประสานงานและจัดการอื่นๆ</h4>
				<p>
					<a class={link} href="https://wevis.info/" target="_blank" rel="noopener external"
						>WeVis</a
					>
				</p>
			</div>
		</div>
	</div>

	<!-- Figma "btn": Feedback goes to the team address the doc gives -->
	<div class="flex justify-center px-m py-l">
		<a
			href="mailto:team@wevis.info"
			class="flex h-[55px] w-[190px] items-center justify-center gap-[10px] rounded-[2px] border border-[#3904e9] px-[20px] text-b4 text-[#3904e9] hover:bg-ui-secondary"
		>
			<img src={envelope} alt="" width="30" height="30" />Feedback
		</a>
	</div>

	<div class="flex items-center gap-[10px] px-m py-l">
		<span class="text-b5">Share</span>
		<button type="button" class="size-7" aria-label="คัดลอกลิงก์" onclick={copy}>
			<img src={sLink} alt="" width="28" height="28" />
		</button>
		{#each share as s (s.label)}
			<a
				class="size-[30px]"
				href={s.href}
				target="_blank"
				rel="noopener external"
				aria-label={s.label}
			>
				<img src={s.icon} alt="" width="30" height="30" />
			</a>
		{/each}
		<span class="text-b6 text-primary" aria-live="polite">{copied ? 'คัดลอกลิงก์แล้ว' : ''}</span>
	</div>

	<!-- WeVis footer -->
	<footer
		class="flex w-full flex-wrap items-center justify-between gap-m bg-black pr-[30px] text-white"
	>
		<a
			href="https://wevis.info/"
			target="_blank"
			rel="noopener external"
			class="flex h-20 w-[120px] items-center justify-center"
		>
			<img src={symbol} alt="WeVis" width="64" height="28" />
		</a>
		<div class="flex flex-wrap items-center gap-[20px] pb-m pl-m sm:pb-0 sm:pl-0">
			<!-- TODO(content): confirm WeVis's terms of use URL -->
			<a
				href="https://wevis.info/terms-of-use"
				target="_blank"
				rel="noopener external"
				class="border-b border-white text-[12px] leading-normal"
			>
				Term of Use
			</a>
			<span class="h-5 w-px bg-white" aria-hidden="true"></span>
			<div class="flex items-center gap-[10px]">
				<span class="text-b6">Follow Us</span>
				{#each follow as f (f.label)}
					<a
						class="flex size-[30px] items-center justify-center"
						href={f.href}
						target="_blank"
						rel="noopener external"
						aria-label={f.label}
					>
						<img src={f.icon} alt="" />
					</a>
				{/each}
			</div>
		</div>
	</footer>
</section>
