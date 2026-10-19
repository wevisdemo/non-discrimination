import type { Picture } from '@sveltejs/enhanced-img';

// Extracted from Figma by scripts/extract-map-assets.js
const caseImages = import.meta.glob<Picture>('../../assets/cases/*.png', {
	eager: true,
	import: 'default',
	query: { enhanced: true }
});

/** The cut-out illustration of a case, as drawn on the map. */
export function caseImage(slug: string): Picture {
	const img = caseImages[`../../assets/cases/${slug}.png`];
	if (!img) throw new Error(`Missing case image for "${slug}"`);
	return img;
}
