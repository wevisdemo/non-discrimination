<script lang="ts">
	import { Combobox, Select } from 'bits-ui';
	import chevron from '#lib/assets/result/dropdown-chevron.svg';
	import bad from '#lib/assets/result/face-bad.svg';
	import good from '#lib/assets/result/face-good.svg';
	import moderate from '#lib/assets/result/face-moderate.svg';
	import veryBad from '#lib/assets/result/face-very-bad.svg';
	import veryGood from '#lib/assets/result/face-very-good.svg';
	import { trackEvent } from '#lib/analytics.ts';
	import { AGES, GENDERS, OCCUPATIONS, PROVINCES, SATISFACTION } from '#lib/content/survey.ts';
	import { CookieSurveyStore, type SurveyAnswers } from '#lib/state/survey.ts';

	const store = new CookieSurveyStore();
	const answers = $state<SurveyAnswers>({});
	// Read after hydration so the prerendered form matches
	let done = $state(false);
	$effect(() => {
		done = store.submitted();
		// What was chosen before a refresh, whether or not it was sent
		Object.assign(answers, store.answers());
		provinceText = answers.province ?? '';
	});

	/** Every choice is kept in a cookie as soon as it is made */
	function choose(key: 'age' | 'gender' | 'occupation' | 'province', value: string | undefined) {
		answers[key] = value;
		store.saveAnswers($state.snapshot(answers));
	}

	// The province list is long, so it can be searched: typing narrows it to the provinces that
	// contain what was typed
	let provinceOpen = $state(false);
	let provinceSearch = $state('');
	// What the field shows: what is being typed, or the chosen province once the list is closed. It is
	// one-way into the field, so it follows every keystroke to be able to put the province back
	let provinceText = $state('');
	const provinces = $derived(
		provinceSearch.trim() ? PROVINCES.filter((p) => p.includes(provinceSearch.trim())) : PROVINCES
	);

	const faces = [veryBad, bad, moderate, good, veryGood];
	const fields = [
		{ key: 'age', label: 'อายุ', placeholder: 'เลือกอายุ', options: AGES },
		{ key: 'gender', label: 'เพศ', placeholder: 'เลือกเพศ', options: GENDERS },
		{ key: 'occupation', label: 'อาชีพ', placeholder: 'เลือกอาชีพ', options: OCCUPATIONS },
		{ key: 'province', label: 'จังหวัด', placeholder: 'เลือกจังหวัด', options: PROVINCES }
	] as const;

	let sending = $state(false);
	let failed = $state(false);

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (sending) return;
		sending = true;
		failed = false;
		const sent = await store.submit($state.snapshot(answers));
		sending = false;
		if (!sent) {
			failed = true;
			return;
		}
		trackEvent({ name: 'survey_submitted' });
		done = true;
	}
</script>

<!-- Figma "Survey": states Default, Dropdown and Submitted -->
<form
	class="flex w-full flex-col items-center gap-m text-center text-primary"
	aria-labelledby="survey-title"
	onsubmit={submit}
>
	<h2 id="survey-title" class="font-body text-b5 leading-normal font-bold text-primary lg:text-b4">
		ขอบคุณที่อยู่ด้วยกันจนจบ !
	</h2>
	<p class="text-b6 leading-normal lg:text-b5">
		เราขอรู้จักคุณเพิ่มอีกนิด<br />เพื่อพัฒนาสื่อการเรียนรู้เรื่อง<br />สิทธิมนุษยชน<br
		/>ที่ตอบโจทย์ยิ่งขึ้นต่อไป
	</p>
	<div class="flex w-full max-w-[400px] flex-col gap-s text-left">
		{#each fields as field (field.key)}
			<div class="flex flex-col gap-s text-b6">
				<span id="survey-{field.key}">{field.label}</span>
				{#if field.key === 'province'}
					<Combobox.Root
						type="single"
						items={PROVINCES.map((p) => ({ value: p, label: p }))}
						bind:value={() => answers.province ?? '', (v) => choose('province', v || undefined)}
						bind:open={provinceOpen}
						inputValue={provinceText}
						onOpenChange={(open) => {
							if (open) return;
							// Closed without choosing: drop what was typed and show the chosen province again
							provinceSearch = '';
							provinceText = answers.province ?? '';
						}}
						disabled={done}
					>
						<div class="relative">
							<Combobox.Input
								aria-labelledby="survey-{field.key}"
								placeholder={field.placeholder}
								autocomplete="off"
								oninput={(e) => {
									provinceSearch = provinceText = e.currentTarget.value;
									provinceOpen = true;
								}}
								onfocus={() => (provinceOpen = true)}
								onclick={() => (provinceOpen = true)}
								class="w-full rounded-card bg-ui-secondary py-s pr-[52px] pl-m text-left text-b5 text-body placeholder:text-body disabled:opacity-60"
							/>
							<Combobox.Trigger
								aria-label="เปิดรายชื่อจังหวัด"
								class="absolute inset-y-0 right-m flex items-center disabled:opacity-60"
							>
								<img src={chevron} alt="" width="22" height="22" class="mix-blend-multiply" />
							</Combobox.Trigger>
						</div>
						<Combobox.Portal>
							<Combobox.Content
								sideOffset={4}
								class="z-50 max-h-[min(320px,var(--bits-floating-available-height))] w-[var(--bits-floating-anchor-width)] overflow-y-auto rounded-card bg-surface shadow"
							>
								{#each provinces as option (option)}
									<Combobox.Item
										value={option}
										label={option}
										class="cursor-pointer px-m text-b5 text-body data-highlighted:bg-ui-primary-hover data-selected:font-bold [&:not(:last-child)>span]:border-b"
										><span class="block border-primary py-s">{option}</span></Combobox.Item
									>
								{:else}
									<p class="px-m py-s text-b6 text-body">ไม่พบจังหวัดที่ค้นหา</p>
								{/each}
							</Combobox.Content>
						</Combobox.Portal>
					</Combobox.Root>
				{:else}
					<Select.Root
						type="single"
						bind:value={
							() => answers[field.key] ?? '', (v) => (answers[field.key] = v || undefined)
						}
						disabled={done}
					>
						<Select.Trigger
							aria-labelledby="survey-{field.key}"
							class="flex w-full items-center justify-between gap-s rounded-card bg-ui-secondary py-s pr-m pl-m text-left text-b5 text-body disabled:opacity-60"
						>
							{answers[field.key] ?? field.placeholder}
							<img src={chevron} alt="" width="22" height="22" class="mix-blend-multiply" />
						</Select.Trigger>
						<Select.Portal>
							<!-- Figma "Survey" Dropdown state and "Dropdown_item": a white card of options split by blue
					     rules inset from the sides; the hovered option is pink edge to edge -->
							<Select.Content
								sideOffset={4}
								class="z-50 max-h-[min(320px,var(--bits-select-content-available-height))] w-[var(--bits-select-anchor-width)] overflow-y-auto rounded-card bg-surface shadow"
							>
								{#each field.options as option (option)}
									<Select.Item
										value={option}
										label={option}
										class="cursor-pointer px-m text-b5 text-body data-highlighted:bg-ui-primary-hover data-selected:font-bold [&:not(:last-child)>span]:border-b"
										><span class="block border-primary py-s">{option}</span></Select.Item
									>
								{/each}
							</Select.Content>
						</Select.Portal>
					</Select.Root>
				{/if}
			</div>
		{/each}
	</div>
	<fieldset class="flex flex-col gap-s" disabled={done}>
		<legend class="mb-s w-full text-center text-b6">ระดับพึงพอใจต่อเว็บไซต์นี้</legend>
		<div class="flex gap-s">
			{#each SATISFACTION as level, i (level.score)}
				<button
					type="button"
					class="size-10 rounded-full not-aria-pressed:hover:bg-ui-primary-hover aria-pressed:bg-accent"
					aria-pressed={answers.satisfaction === level.score}
					aria-label={level.label}
					onclick={() => {
						answers.satisfaction = level.score;
						store.saveAnswers($state.snapshot(answers));
					}}
				>
					<img src={faces[i]} alt="" width="40" height="40" />
				</button>
			{/each}
		</div>
	</fieldset>
	{#if done}
		<p class="rounded-full bg-ui-primary px-m py-s text-b5 text-ink" aria-live="polite">
			ขอบคุณสำหรับคำตอบ
		</p>
	{:else}
		<button
			type="submit"
			disabled={sending}
			class="rounded-full bg-ui-primary px-m py-s text-b5 text-ink hover:bg-ui-primary-hover disabled:opacity-60"
			>ส่งคำตอบ</button
		>
		{#if failed}
			<p class="text-b6 text-ink" role="alert">ส่งคำตอบไม่สำเร็จ กรุณาลองอีกครั้ง</p>
		{/if}
	{/if}
	<p class="text-[12px] leading-normal text-body">
		แบบสอบถามนี้ไม่มีการเก็บข้อมูลที่ระบุตัวบุคคล<br
		/>ข้อมูลที่ได้รับจะถูกใช้เป็นแนวทางพัฒนาสื่อการเรียนรู้ของสำนักงาน กสม. เท่านั้น
	</p>
</form>
