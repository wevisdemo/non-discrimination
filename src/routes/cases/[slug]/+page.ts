import { error } from '@sveltejs/kit';
import { cases, getCase } from '#lib/content/index.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => cases.map(({ slug }) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const item = getCase(params.slug);
	if (!item) error(404, 'ไม่พบเคสนี้');
	return { item };
};
