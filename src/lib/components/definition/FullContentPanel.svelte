<script lang="ts">
	import { Dialog } from 'bits-ui';
	import close from '#lib/assets/kp2/close.svg';
	import GameThumbnail from '#lib/components/story/GameThumbnail.svelte';
	import ELearning from '#lib/components/result/ELearning.svelte';
	import Accordion from './Accordion.svelte';
	import SpotArt from './SpotArt.svelte';
	import shortcutBg from '#lib/assets/definition/kp2-shortcut-bg.png?enhanced';
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
	/** กรณีที่พบบ่อย: who is affected and how; a form with `sub` lists examples beneath it */
	const frequent: {
		title: string;
		victims: string;
		forms: { text: string; sub?: string[] }[];
	}[] = [
		{
			title: 'การเข้าถึงการรักษาพยาบาล',
			victims: 'แรงงานข้ามชาติ คนไร้บ้าน ผู้ใช้สารเสพติด ผู้ติดเชื้อ HIV ผู้มีหลากหลายทางเพศ',
			forms: [
				{
					text: 'มีอุปสรรคจากสถานะและเอกสารสิทธิ ภาษา ค่าใช้จ่ายในการเดินทาง สภาพแวดล้อมทางกายภาพ'
				},
				{ text: 'ถูกตีตรา ปฏิเสธการให้บริการ การเปิดเผยข้อมูลส่วนบุคคล' },
				{ text: 'ได้รับบริการล่าช้า ไม่มีบริการ หรือไม่สอดคล้องกับความต้องการเฉพาะ' }
			]
		},
		{
			title: 'สวัสดิการสังคม',
			victims: 'แรงงานข้ามชาติ คนไร้บ้าน ประชาชนทั่วไป',
			forms: [
				{
					text: 'ตกหล่นจากการได้รับสวัสดิการจำนวนหนึ่ง เพราะสวัสดิการยึดโยงกับสัญชาติ ทะเบียนบ้าน สถานะการจ้างงาน'
				},
				{
					text: 'ต้องลงทะเบียนหรือพิสูจน์ข้อเท็จจริงตามเงื่อนไขซ้ำหลายครั้ง เพราะฐานข้อมูลของแต่ละหน่วยงานไม่เชื่อมโยงกัน'
				}
			]
		},
		{
			title: 'การศึกษา',
			victims:
				'เด็กไร้สัญชาติ เด็กพิการ เด็กชาติพันธุ์ เด็กที่มีความหลากหลายทางเพศ เด็กยากจน เด็กในกระบวนการยุติธรรม เด็กในค่ายพักพิงชั่วคราว เด็กผู้ติดตามแรงงานข้ามชาติ',
			forms: [
				{ text: 'มีอุปสรรคในการสมัครเข้าเรียน การใช้เอกสารประจำตัว การเข้าถึงสื่อการเรียนรู้' },
				{ text: 'ถูกล้อเลียนหรือรังแก' },
				{ text: 'ถูกยึดหรือไม่ได้รับเอกสารการศึกษา เพราะค้างชำระค่าเล่าเรียน' },
				{
					text: 'หลักสูตรและระบบดูแลนักเรียน ไม่รองรับความแตกต่างด้านภาษา วัฒนธรรม ความพิการ และอัตลักษณ์ของบุคคล'
				}
			]
		},
		{
			title: 'การประกอบอาชีพ',
			victims: 'ผู้หญิง ผู้มีความหลากหลายทางเพศ คนพิการ ผู้สูงอายุ ผู้พ้นโทษ ผู้ติดเชื้อ HIV',
			forms: [
				{
					text: 'นายจ้างมีข้อห้ามหรือข้อจำกัดในลักษณะเหมารวม ในการรับสมัคร การกำหนดคุณสมบัติ การเลื่อนตำแหน่ง การจัดสวัสดิการ การเลิกจ้าง'
				},
				{ text: 'ถูกล่วงละเมิดในที่ทำงาน' },
				{ text: 'มีความแตกต่างด้านค่าจ้างระหว่างเพศ' },
				{ text: 'มีช่องว่างด้านรายได้ของคนพิการ' },
				{ text: 'ผู้สูงอายุพบข้อจำกัดในการรับเข้าทำงาน' },
				{
					text: 'มาตรการคุ้มครองการเลือกปฏิบัติยังไม่ครอบคลุมเหตุ บังคับตรวจเชื้อเอชไอวี การรับผู้พ้นโทษเข้าทำงาน'
				}
			]
		},
		{
			title: 'การเข้าถึงบริการสาธารณะ',
			victims:
				'คนพิการ ผู้ไม่รู้ภาษาไทย ผู้ไม่มีโทรศัพท์หรืออินเทอร์เน็ต คนไร้บ้าน ผู้สูงอายุ บุคคลที่ไม่มีเอกสาร',
			forms: [
				{
					text: 'มีอุปสรรคในการเข้าถึงบริการ เช่น',
					sub: [
						'ระบบขนส่งสาธารณะ',
						'การติดต่อราชการ การทะเบียนราษฎร กระบวนการยุติธรรม ขั้นตอนการยืนยันตัวตน',
						'บริการดิจิทัล ระบบคิว แบบฟอร์ม เว็บไซต์',
						'การมีส่วนร่วมทางสังคมและการเมือง เช่น คูหาเลือกตั้งไม่สามารถสอดวีลแชร์เข้าไปได้',
						'การเข้าถึงอาคาร เช่น ปุ่มลิฟต์ไม่มีอักษรเบรลล์'
					]
				}
			]
		}
	];

	const h = 'font-header text-h7 leading-normal font-bold text-primary text-center';
	const source = 'text-[12px] leading-normal text-body';
</script>

<Dialog.Root {open} onOpenChange={(next) => !next && onclose()}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-40 bg-white/70" />
		<!-- Figma "Popup Desktop size": from 1024px wide the popup is 60vw by 80vh (the 30px close button
		     included) and centred; below that, a 600px sheet 83% of the screen tall sitting on the bottom
		     edge. Tabs stick to the top of the sheet as it scrolls. dvh is vh on desktop and fits under
		     phone address bars. -->
		<Dialog.Content
			aria-label="อ่านเนื้อหาเต็ม"
			class="fixed bottom-0 left-1/2 z-50 h-[calc(83dvh+30px)] w-[600px] max-w-[calc(100vw-32px)] -translate-x-1/2 outline-none lg:top-1/2 lg:bottom-auto lg:h-[80dvh] lg:w-[60vw] lg:-translate-y-1/2"
		>
			<div class="flex h-full flex-col">
				<!-- The close button stays put; only the sheet below it scrolls, under the sticky tabs -->
				<div class="flex justify-end">
					<Dialog.Close aria-label="ปิด" class="rounded-sm bg-surface hover:bg-ui-primary-hover">
						<img src={close} alt="" width="30" height="30" class="mix-blend-multiply" />
					</Dialog.Close>
				</div>
				<div bind:this={scroller} class="min-h-0 flex-1 overflow-y-auto">
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
							<div class="flex w-full max-w-[400px] flex-col gap-m lg:max-w-[83%]">
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

							<div class="flex w-full max-w-[400px] flex-col gap-m lg:max-w-[83%]">
								<p class="text-center text-b5 text-primary">
									เพื่อ <strong>แบ่งแยก กีดกัน จำกัด</strong><br />ให้คนคนหนึ่งหรือกลุ่มหนึ่ง<br
									/>ได้รับสิทธิประโยชน์น้อยลง หรือ ให้ไม่ได้รับสิทธินั้นเลย
								</p>
								<p class="text-center text-b5 text-primary">
									การเลือกปฏิบัติเกิดขึ้นได้กับทุกคน<br />ในทุก <strong>“มิติ”</strong> ของชีวิต
								</p>
								<Accordion title="มิติแห่งการเลือกปฏิบัติ">
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

							<div class="flex w-full max-w-[400px] flex-col gap-m lg:max-w-[83%]">
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
									class="flex w-full max-w-[400px] flex-col items-center gap-m bg-surface-tint p-m text-b6 text-primary lg:max-w-[83%]"
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
							<div class="flex w-full max-w-[400px] flex-col gap-s lg:max-w-[83%]">
								<h2 class={h}>การเลือกปฏิบัติที่พบบ่อย<br />ในสังคมไทย</h2>
								{#each frequent as topic, i (topic.title)}
									<Accordion title={topic.title} open={i === 0}>
										<p><strong>ผู้มักถูกเลือกปฏิบัติ :</strong> {topic.victims}</p>
										<div>
											<p class="font-bold">ถูกเลือกปฏิบัติอย่างไร :</p>
											<ul class="list-disc pl-[21px]">
												{#each topic.forms as form (form.text)}
													<li>
														{form.text}
														{#if form.sub}
															<ul class="list-[circle] pl-[21px]">
																{#each form.sub as example (example)}<li>{example}</li>{/each}
															</ul>
														{/if}
													</li>
												{/each}
											</ul>
										</div>
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

					<ELearning class="rounded-b-card px-m py-l" />
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
