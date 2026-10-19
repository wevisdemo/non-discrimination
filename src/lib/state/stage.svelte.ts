import { stages, type StageId } from '#lib/stages.ts';

/** Which section of the page is crossing the middle of the viewport (drives the ☰ pill label). */
export class StageTracker {
	current = $state<StageId>('intro');

	/** Start observing the sections; returns a cleanup function. Call from `onMount`. */
	watch() {
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) this.current = e.target.id as StageId;
				}
			},
			{ rootMargin: '-50% 0px -50% 0px' }
		);
		for (const { id } of stages) {
			const node = document.getElementById(id);
			if (node) io.observe(node);
		}
		return () => io.disconnect();
	}
}

export const stageTracker = new StageTracker();
