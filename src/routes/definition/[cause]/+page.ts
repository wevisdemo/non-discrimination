import { error } from '@sveltejs/kit';
import { CAUSE_IDS, causeIdSchema } from '#lib/content/index.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => CAUSE_IDS.map((cause) => ({ cause }));

export const load: PageLoad = ({ params }) => {
	const parsed = causeIdSchema.safeParse(params.cause);
	if (!parsed.success) error(404, 'ไม่พบนิยามนี้');
	return { cause: parsed.data };
};
