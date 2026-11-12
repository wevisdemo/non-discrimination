import { describe, expect, it } from 'vitest';
import { introExCon, introGender, introHiv } from './cameras.ts';
import { introBubbles } from './intro.ts';

describe('the Intro bubbles', () => {
	// A bubble's text scales with the map, so in a close-up it reads at zoom × scale
	const zoom = {
		'gender-promotion': introGender.zoom,
		'ex-con-job': introExCon.zoom,
		'hiv-test-job': introHiv.zoom
	};

	it('read about the same size in their three close-ups', () => {
		const reads = introBubbles.map(
			(b) => zoom[b.slug as keyof typeof zoom] * (b.closeUpScale ?? 1)
		);
		expect(Math.max(...reads) / Math.min(...reads)).toBeLessThan(1.1);
	});

	it('only shrink the bubble whose close-up is the deepest', () => {
		const scaled = introBubbles.filter((b) => b.closeUpScale !== undefined).map((b) => b.slug);
		expect(scaled).toEqual(['ex-con-job']);
		expect(introBubbles.find((b) => b.slug === 'ex-con-job')!.closeUpScale).toBeLessThan(1);
	});
});
