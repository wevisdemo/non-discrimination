import { describe, expect, it } from 'vitest';
import { CAUSE_IDS, caseSchema, causes, cases, definitions, getCase } from './index.ts';

describe('content', () => {
	it('has one entry per discrimination cause', () => {
		expect(causes.map((c) => c.id).sort()).toEqual([...CAUSE_IDS].sort());
	});

	it('has a definition for every cause', () => {
		for (const id of CAUSE_IDS) expect(definitions.get(id)?.default).toBeTypeOf('function');
	});

	it('loads all 18 cases from Figma with unique slugs', () => {
		expect(cases).toHaveLength(18);
		expect(new Set(cases.map((c) => c.slug)).size).toBe(cases.length);
	});

	it('has the datasheet fields on every case', () => {
		for (const c of cases) {
			expect(c.summaryTh.length, c.slug).toBeGreaterThan(20);
			expect(c.dimensionTh, c.slug).toBeTruthy();
			expect(c.formsTh.length, c.slug).toBeGreaterThan(0);
			expect(c.perpetratorTh, c.slug).toBeTruthy();
			expect(c.affectedTh, c.slug).toBeTruthy();
		}
	});

	it('uses the datasheet titles and causes', () => {
		expect(getCase('hijab-school')?.titleTh).toBe(
			'นักเรียนมุสลิมถูกห้ามคลุมฮิญาบมาโรงเรียนในเขตวัด'
		);
		// An intersex applicant: both a health and a gender ground
		expect(getCase('katoey-police')?.causes).toEqual(['health', 'gender']);
		expect(getCase('gender-promotion')?.formsTh).toEqual(['ทางตรง', 'เชิงโครงสร้าง']);
	});

	it('looks cases up by slug', () => {
		expect(getCase('hijab-school')?.causes).toContain('religion');
		expect(getCase('nope')).toBeUndefined();
	});

	it('rejects a hotspot outside the master map', () => {
		const bad = { ...cases[0], hotspot: { x: 3200, y: 0, w: 100, h: 100 } };
		expect(caseSchema.safeParse(bad).success).toBe(false);
	});
});
