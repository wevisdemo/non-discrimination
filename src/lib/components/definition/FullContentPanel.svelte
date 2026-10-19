<script lang="ts">
	import { Dialog } from 'bits-ui';
	import close from '#lib/assets/kp2/close.svg';
	import GameThumbnail from '#lib/components/story/GameThumbnail.svelte';
	import Accordion from './Accordion.svelte';
	import SpotArt from './SpotArt.svelte';
	import shortcutBg from '#lib/assets/definition/kp2-shortcut-bg.png?enhanced';
	import learn1 from '#lib/assets/definition/elearning-1.png?enhanced';
	import learn2 from '#lib/assets/definition/elearning-2.png?enhanced';
	import learn3 from '#lib/assets/definition/elearning-3.png?enhanced';
	import { cases } from '#lib/content/index.ts';

	let {
		open,
		onclose,
		inGame = false
	}: {
		open: boolean;
		onclose: () => void;
		/** Opened from the map (Figma Context=KP2): no "go to the map" box */
		inGame?: boolean;
	} = $props();

	// TODO(content): the E-Learning "The Inclusion Lab" URL; the design has no link target
	const ELEARNING_URL: string | undefined = undefined;

	const tabs = [
		{ id: 'definition', label: 'คำนิยาม' },
		{ id: 'who', label: 'ใครมักถูก\nเลือกปฏิบัติ' },
		{ id: 'frequent', label: 'กรณีที่\nพบบ่อย' }
	] as const;
	let tab = $state<(typeof tabs)[number]['id']>('definition');
	let scroller = $state<HTMLElement>();

	function select(id: typeof tab) {
		tab = id;
		scroller?.scrollTo({ top: 0 });
	}

	const grounds = [
		['ถิ่นกำเนิด', 'เชื้อชาติ', 'ภาษา', 'เพศ', 'อายุ', 'ความพิการ', 'สภาพทางกายหรือสุขภาพ'],
		[
			'สถานะของบุคคล',
			'ฐานะทางเศรษฐกิจหรือสังคม',
			'ศาสนา',
			'การศึกษาอบรม',
			'ความคิดเห็นทางการเมือง',
			'สีผิว'
		]
	];
	const dimensions = [
		'การเลือกปฏิบัติในการจ้างงาน',
		'การเลือกปฏิบัติในการทำงาน',
		'การเลือกปฏิบัติในการเข้าถึงการศึกษา',
		'การเลือกปฏิบัติในการเข้าถึงสินค้าและบริการ',
		'การเลือกปฏิบัติในการเข้าร่วมสมาคม'
	];
	const forms = [
		[
			'โดยตรง',
			'การปฎิบัติอย่างไม่เป็นธรรมที่กระทบต่อสิทธิของบุคคลหรือคนกลุ่มหนึ่งกลุ่มใด เช่น การแบ่งแยก การกีดกันการเข้าถึงสิทธิและโอกาสต่าง ๆ'
		],
		[
			'โดยอ้อม',
			'การกำหนดกฎเกณฑ์หรือนโยบายที่ดูเหมือนยุติธรรม แต่ความเป็นจริงกลับสร้างความเสียเปรียบแก่คนกลุ่มหนึ่งอย่างเฉพาะเจาะจง'
		],
		[
			'โดยการคุกคาม',
			'การสร้างบรรยากาศที่ทำให้อีกฝ่ายรู้สึกไม่ปลอดภัยจนส่งผลต่อสถานะและศักดิ์ศรีของความเป็นมนุษย์'
		],
		[
			'โดยความเกี่ยวพัน',
			'การปฏิบัติอย่างไม่เป็นธรรมกับบุคคลหนึ่งเพราะ "มีความสัมพันธ์หรือใกล้ชิด" กับคนกลุ่มที่มีความแตกต่างหลากหลาย เช่น คนพิการ ผู้มีเชื้อ HIV กลุ่มการเมือง'
		],
		[
			'เชิงโครงสร้าง',
			'การเลือกปฏิบัติที่ฝังอยู่ในระบบ นโยบาย หรือวัฒนธรรมองค์กร จนกลายเป็น ”ความเคยชิน”'
		]
	];
	const victims = [
		'ผู้ใช้แรงงาน',
		'ผู้เสียหาย เหยื่อในกระบวนการยุติธรรม',
		'เด็กและสตรี',
		'นักปกป้องสิทธิมนุษยชน',
		'ผู้สูงอายุ',
		'ผู้เสพยาเสพติด',
		'ผู้มีความหลากหลายทางเพศ',
		'กลุ่มชาติพันธุ์ ผู้มีปัญหาสถานะ',
		'คนพิการ',
		'ผู้ต้องหา ผู้ต้องขัง ผู้พ้นโทษ',
		'ผู้ป่วยเอดส์ ผู้ที่อยู่ร่วมกับ HIV ผู้ป่วยจิตเวช'
	];
	const offenders = [
		['เจ้าหน้าที่รัฐ', '52.91%'],
		['บุคคลทั่วไป', '24.44%'],
		['นายจ้าง/เจ้าของกิจการ', '10.36%'],
		['ครอบครัว/ญาติ', '7.42%'],
		['เพื่อน/คนรู้จัก', '7.87%']
	];
	/** Only the first has copy in the design; the rest are TODO(content) */
	const frequent = [
		'การเข้าถึงการรักษาพยาบาล',
		'สวัสดิการสังคม',
		'การศึกษา',
		'การประกอบอาชีพ',
		'การเข้าถึงบริการสาธารณะ'
	];

	const h = 'font-header text-h7 leading-normal font-bold text-primary text-center';
	const source = 'text-[12px] leading-normal text-body';
</script>

<Dialog.Root {open} onOpenChange={(next) => !next && onclose()}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-40 bg-white/70" />
		<!-- Figma "Definition" (Device=Desktop): a 600px sheet, tabs stick to its top as it scrolls -->
		<Dialog.Content
			aria-label="อ่านเนื้อหาเต็ม"
			class="fixed top-1/2 left-1/2 z-50 h-[min(600px,calc(100dvh-32px))] w-[600px] max-w-[calc(100vw-32px)] -translate-1/2 outline-none"
		>
			<div class="flex h-full flex-col pt-m">
				<!-- The close button stays put; only the sheet below it scrolls, under the sticky tabs -->
				<div class="flex justify-end">
					<Dialog.Close aria-label="ปิด" class="rounded-sm bg-surface hover:bg-ui-primary-hover">
						<img src={close} alt="" width="30" height="30" class="mix-blend-multiply" />
					</Dialog.Close>
				</div>
				<div bind:this={scroller} class="min-h-0 flex-1 overflow-y-auto rounded-b-card">
					<div class="sticky top-0 z-10">
						<div role="tablist" aria-label="อ่านเนื้อหาเต็ม" class="flex items-stretch">
							{#each tabs as t (t.id)}
								<button
									type="button"
									role="tab"
									id="tab-{t.id}"
									aria-selected={tab === t.id}
									aria-controls="tabpanel-{t.id}"
									class="flex-1 rounded-t-card p-s text-center text-b5 font-bold whitespace-pre-line {tab ===
									t.id
										? 'bg-primary text-white'
										: 'bg-ui-secondary text-primary hover:bg-ui-primary-hover'}"
									onclick={() => select(t.id)}>{t.label}</button
								>
							{/each}
						</div>
					</div>

					<div
						role="tabpanel"
						id="tabpanel-{tab}"
						aria-labelledby="tab-{tab}"
						class="flex flex-col items-center gap-l bg-surface px-m py-l"
					>
						{#if tab === 'definition'}
							<div class="flex w-full max-w-[400px] flex-col gap-m">
								<h2 class={h}>การเลือกปฏิบัติ (Discrimination)</h2>
								<p class="text-center text-b5 text-primary">คือการอ้าง <strong>“เหตุ”</strong></p>
								<Accordion title="เหตุแห่งการเลือกปฏิบัติ" open>
									{#snippet subtitle()}ข้ออ้างเพื่อเลือกปฏิบัติ มักเกี่ยวข้องกับลักษณะของบุคคล{/snippet}
									<div class="flex justify-center"><SpotArt kind="declaration" /></div>
									<p class="text-center">
										ปฏิญญาสากลว่าด้วยสิทธิมนุษยชน ‘แม่บท’ ของอนุสัญญาสิทธิต่าง ๆ และรัฐธรรมนูญ 2560
										‘กฎหมายสูงสุด’ ของไทย ได้แจกแจง <strong>เหตุแห่งการเลือกปฏิบัติ</strong> ไว้ดังนี้
									</p>
									<div class="flex flex-wrap gap-x-l">
										{#each grounds as column, i (i)}
											<ul class="list-disc pl-[21px]">
												{#each column as g (g)}<li>{g}</li>{/each}
											</ul>
										{/each}
									</div>
									<p>และเหตุอื่นใดที่ไม่เป็นธรรม</p>
								</Accordion>
							</div>

							<div class="flex w-full max-w-[400px] flex-col gap-m">
								<p class="text-center text-b5 text-primary">
									เพื่อ <strong>แบ่งแยก กีดกัน จำกัด</strong><br />ให้คนคนหนึ่งหรือกลุ่มหนึ่ง<br
									/>ได้รับสิทธิประโยชน์น้อยลง หรือ ให้ไม่ได้รับสิทธินั้นเลย
								</p>
								<p class="text-center text-b5 text-primary">
									การเลือกปฏิบัติเกิดขึ้นได้กับทุกคน<br />ในทุก <strong>“มิติ”</strong> ของชีวิต
								</p>
								<Accordion title="มิติแห่งการเลือกปฏิบัติ" open>
									{#snippet subtitle()}<strong>เหตุการณ์แวดล้อม</strong
										>ที่เกิดการเลือกปฏิบัติขึ้น{/snippet}
									<div class="flex justify-center"><SpotArt kind="dimension" /></div>
									<div>
										<p>เช่น</p>
										<ul class="list-disc pl-[21px]">
											{#each dimensions as d (d)}<li>{d}</li>{/each}
										</ul>
									</div>
									<p class={source}>
										ที่มา: โครงการวิจัยเรื่อง กฎหมายว่าด้วยความเสมอภาคและการไม่เลือกปฏิบัติ (2560)
										โดยสำนักงาน กสม.
									</p>
								</Accordion>
							</div>

							<div class="flex w-full max-w-[400px] flex-col gap-m">
								<p class="text-center text-b5 text-primary">
									ทั้งใน <strong>“รูปแบบ”</strong> ที่โจ่งแจ้งไปจนถึงแนบเนียน
								</p>
								<Accordion title="รูปแบบของการเลือกปฏิบัติ">
									<dl class="flex flex-col gap-xs">
										{#each forms as [name, detail] (name)}
											<div>
												<dt class="bg-surface-tint px-s py-xs text-center font-bold">{name}</dt>
												<dd class="bg-surface p-s">{detail}</dd>
											</div>
										{/each}
									</dl>
								</Accordion>
							</div>
						{:else if tab === 'who'}
							{#snippet box(
								title: string,
								art: 'victim' | 'offender',
								body: import('svelte').Snippet
							)}
								<section
									class="flex w-full max-w-[400px] flex-col items-center gap-m bg-surface-tint p-m text-b6 text-primary"
								>
									<h2 class={h}>{title}</h2>
									<SpotArt kind={art} />
									{@render body()}
								</section>
							{/snippet}
							{#snippet victimBody()}
								<p class="text-center">
									การเลือกปฏิบัติเกิดกับผู้คนหลากหลายกลุ่ม<br
									/>เรียงลำดับตามความเร่งด่วนในการแก้ปัญหา ดังนี้
								</p>
								<ol class="w-full list-decimal pl-[21px] leading-[1.8]">
									{#each victims as v, i (v)}<li class={i === 0 ? 'font-bold' : ''}>{v}</li>{/each}
								</ol>
								<p class="w-full {source}">
									ที่มา: แผนสิทธิมนุษยชนแห่งชาติ ฉบับที่ 5 (พ.ศ. 2566-2570)
								</p>
							{/snippet}
							{#snippet offenderBody()}
								<p class="text-center">
									ผลสำรวจที่รวบรวมโดยสำนักงาน กสม. และนิด้าโพล<br />เผยว่าอันดับหนึ่งคือ
									<strong>เจ้าหน้าที่รัฐ</strong><br />ผู้ที่ควรให้บริการแก่ประชาชน<br
									/>อย่างเท่าเทียม
								</p>
								<p class="text-center">
									ตามมาด้วยกลุ่มคนที่ค่อย ๆ ไต่ระดับความใกล้ชิด<br />ตั้งแต่ที่ทำงาน กลุ่มเพื่อน
									ไปจนถึงครอบครัว
								</p>
								<ol class="flex w-full flex-col gap-xxs leading-[1.8]">
									{#each offenders as [who, share], i (who)}
										<li class="flex justify-between {i === 0 ? 'font-bold' : ''}">
											<span>{i + 1}. {who}</span><span>{share}</span>
										</li>
									{/each}
								</ol>
								<p class="w-full {source}">
									ที่มา: รายงานการสำรวจสถานการณ์การเลือกปฏิบัติในสังคมไทย (2569) โดยสำนักงาน กสม.
									ร่วมกับนิด้าโพล สุ่มตัวอย่าง 1,227 คนทั่วประเทศ
								</p>
							{/snippet}
							{@render box('ผู้ถูกเลือกปฏิบัติ', 'victim', victimBody)}
							{@render box('ส่วนผู้เลือกปฏิบัติ', 'offender', offenderBody)}
						{:else}
							<div class="flex w-full max-w-[400px] flex-col gap-s">
								<h2 class={h}>การเลือกปฏิบัติที่พบบ่อย<br />ในสังคมไทย</h2>
								{#each frequent as topic, i (topic)}
									<Accordion title={topic} open={i === 0}>
										{#if i === 0}
											<p>
												<strong>ผู้มักถูกเลือกปฏิบัติ :</strong><br />แรงงานข้ามชาติ คนไร้บ้าน
												ผู้ใช้สารเสพติด ผู้ติดเชื้อ HIV ผู้มีหลากหลายทางเพศ
											</p>
											<div>
												<!-- TODO(content): the design repeats "ผู้มักถูกเลือกปฏิบัติ" as this label -->
												<p>ผู้มักถูกเลือกปฏิบัติ :</p>
												<ul class="list-disc pl-[21px]">
													<li>
														มีอุปสรรคจากสถานะและเอกสารสิทธิ ภาษา ค่าใช้จ่ายในการเดินทาง
														สภาพแวดล้อมทางกายภาพ
													</li>
													<li>ถูกตีตรา ปฏิเสธการให้บริการ การเปิดเผยข้อมูลส่วนบุคคล</li>
													<li>ได้รับบริการล่าช้า ไม่มีบริการ หรือไม่สอดคล้องกับความต้องการเฉพาะ</li>
												</ul>
											</div>
										{:else}
											<p>เนื้อหาส่วนนี้กำลังจัดทำ</p>
										{/if}
									</Accordion>
								{/each}
								<p class={source}>
									ที่มา: รายงานผลการศึกษาสถานการณ์การเลือกปฏิบัติต่อบุคคลในประเทศไทย (2569) โดย
									สำนักงาน กสม. และอนรรฆ พิทักษ์ธานิน
								</p>
							</div>
						{/if}
					</div>

					{#if !inGame}
						<!-- Figma "kp2-shortcut": back to the map -->
						<div class="relative p-m sm:p-xl">
							<enhanced:img
								src={shortcutBg}
								alt=""
								sizes="600px"
								class="absolute inset-0 size-full object-cover"
							/>
							<div class="absolute inset-0 bg-white/80"></div>
							<div
								class="relative flex flex-col items-center gap-m rounded-card bg-ui-secondary p-l text-center text-primary"
							>
								<GameThumbnail />
								<p class="text-b4 font-bold">สืบหา {cases.length} การเลือกปฏิบัติที่ซ่อนอยู่</p>
								<p class="text-b6">
									อ่านเนื้อหาเสร็จแล้ว มาสำรวจ <strong>สถานการณ์ตัวอย่าง</strong> กันดีกว่า ว่าการเลือกปฏิบัติแฝงอยู่ที่ตรงไหนของชีวิตประจำวันบ้าง
								</p>
								<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- in-page hash -->
								<a
									href="#explore"
									class="rounded-full bg-ui-primary px-m py-s text-b5 font-bold text-ink hover:bg-ui-primary-hover"
									onclick={onclose}>ไปที่หน้าสำรวจ</a
								>
							</div>
						</div>
					{/if}

					<!-- Figma "E-Learning" -->
					<section
						class="flex flex-col items-center gap-l rounded-b-card bg-ui-primary px-m py-l text-center text-ink"
					>
						<div class="flex flex-col gap-xs">
							<h2 class="font-header text-h7 leading-normal font-bold text-ink">
								อยากเข้าใจการเลือกปฏิบัติแบบละเอียดยิ่งขึ้น ?
							</h2>
							<p class="text-b5">คำนิยาม รูปแบบ การแยกแยะ วิธีรับมือ และอื่น ๆ</p>
						</div>
						<div class="flex w-full gap-xs">
							{#each [learn1, learn2, learn3] as img, i (i)}
								<enhanced:img
									src={img}
									alt=""
									sizes="190px"
									class="aspect-[224/118] min-w-0 flex-1 object-cover"
								/>
							{/each}
						</div>
						<p class="text-b6">
							ชวนเรียนรู้ต่อที่ <strong>E-Learning: ‘The Inclusion Lab’</strong><br />โดย
							สํานักงานคณะกรรมการสิทธิมนุษยชนแห่งชาติ เครือข่ายประชาชนขจัดการเลือกปฏิบัติ (MovED)
							และมูลนิธิเพื่อสิทธิความหลากหลาย พร้อมรับเกียรติบัตรหลังทำแบบทดสอบ !
						</p>
						{#if ELEARNING_URL}
							<a
								href={ELEARNING_URL}
								target="_blank"
								rel="noopener external"
								class="rounded-full border-2 border-ink bg-ui-primary px-m py-s text-b5 hover:bg-ui-primary-hover"
								>คลิกที่นี่</a
							>
						{/if}
					</section>
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
