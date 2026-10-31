<script lang="ts">
	import chevron from '#lib/assets/result/dropdown-chevron.svg';
	import bad from '#lib/assets/result/face-bad.svg';
	import good from '#lib/assets/result/face-good.svg';
	import moderate from '#lib/assets/result/face-moderate.svg';
	import veryBad from '#lib/assets/result/face-very-bad.svg';
	import veryGood from '#lib/assets/result/face-very-good.svg';
	import { trackEvent } from '#lib/analytics.ts';
	import { AGES, GENDERS, OCCUPATIONS, PROVINCES, SATISFACTION } from '#lib/content/survey.ts';
	import { LocalSurveyStore, type SurveyAnswers } from '#lib/state/survey.ts';

	const store = new LocalSurveyStore();
	const answers = $state<SurveyAnswers>({});
	// Read after hydration so the prerendered form matches
	// eslint-disable-next-line svelte/prefer-writable-derived
	let done = $state(false);
	$effect(() => {
		done = store.submitted();
	});

	const faces = [veryBad, bad, moderate, good, veryGood];
	const fields = [
		{ key: 'age', label: 'อายุ', placeholder: 'เลือกอายุ', options: AGES },
		{ key: 'gender', label: 'เพศ', placeholder: 'เลือกเพศ', options: GENDERS },
		{ key: 'occupation', label: 'อาชีพ', placeholder: 'เลือกอาชีพ', options: OCCUPATIONS },
		{ key: 'province', label: 'จังหวัด', placeholder: 'เลือกจังหวัด', options: PROVINCES }
	] as const;

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		await store.submit($state.snapshot(answers));
		trackEvent({ name: 'survey_submitted' });
		done = true;
	}
</script>

<!-- Figma "Survey": states Default, Dropdown (native select here) and Submitted -->
<form
	class="flex w-full flex-col items-center gap-m text-center text-primary"
	aria-labelledby="survey-title"
	onsubmit={submit}
>
	<h2 id="survey-title" class="text-b5 font-bold text-primary">ขอบคุณที่อยู่ด้วยกันจนจบ !</h2>
	<p class="text-b6">
		เราขอรู้จักคุณเพิ่มอีกนิด<br />เพื่อพัฒนาสื่อการเรียนรู้เรื่อง<br />สิทธิมนุษยชน<br
		/>ที่ตอบโจทย์ยิ่งขึ้นต่อไป
	</p>
	<div class="flex w-full max-w-[400px] flex-col gap-s text-left">
		{#each fields as field (field.key)}
			<label class="flex flex-col gap-s text-b6">
				{field.label}
				<span class="relative">
					<select
						class="w-full appearance-none rounded-card bg-ui-secondary py-s pr-xl pl-m text-b5 text-body disabled:opacity-60"
						bind:value={answers[field.key]}
						disabled={done}
					>
						<option value={undefined}>{field.placeholder}</option>
						{#each field.options as option (option)}<option value={option}>{option}</option>{/each}
					</select>
					<img
						src={chevron}
						alt=""
						width="22"
						height="22"
						class="pointer-events-none absolute top-1/2 right-m -translate-y-1/2 mix-blend-multiply"
					/>
				</span>
			</label>
		{/each}
	</div>
	<fieldset class="flex flex-col gap-s" disabled={done}>
		<legend class="mb-s w-full text-left text-b6">ระดับพึงพอใจต่อเว็บไซต์นี้</legend>
		<div class="flex gap-s">
			{#each SATISFACTION as level, i (level.score)}
				<button
					type="button"
					class="size-10 rounded-full aria-pressed:ring-2 aria-pressed:ring-primary aria-pressed:ring-offset-2"
					aria-pressed={answers.satisfaction === level.score}
					aria-label={level.label}
					onclick={() => (answers.satisfaction = level.score)}
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
			class="rounded-full bg-ui-primary px-m py-s text-b5 text-ink hover:bg-ui-primary-hover"
			>ส่งคำตอบ</button
		>
	{/if}
	<p class="text-[12px] leading-normal text-body">
		แบบสอบถามนี้ไม่มีการเก็บข้อมูลที่ระบุตัวบุคคล<br
		/>ข้อมูลที่ได้รับจะถูกใช้เป็นแนวทางพัฒนาสื่อการเรียนรู้ของสำนักงาน กสม. เท่านั้น
	</p>
</form>
