import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('the dropdown chevron', () => {
	it('is just the arrow, with no white square behind it', () => {
		// Figma exports a white rect with a multiply blend. That hides on a field's colour when the
		// icon sits in the field's own button, but a browser that cannot blend over a text input
		// showed it as a white box on the province field.
		const svg = readFileSync(
			new URL('../../assets/result/dropdown-chevron.svg', import.meta.url),
			'utf8'
		);
		expect(svg).not.toMatch(/<rect/);
		expect(svg).not.toMatch(/mix-blend-mode/);
		expect(svg).not.toMatch(/fill="white"/i);
		expect(svg).toMatch(/<path/);
	});
});
