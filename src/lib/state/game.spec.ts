import { describe, expect, it } from 'vitest';
import { cases } from '#lib/content/index.ts';
import { Game } from './game.svelte.ts';
import { MemoryProgressStore } from './progress.ts';

function newGame(saved: string[] = []) {
	const store = new MemoryProgressStore();
	store.save(saved);
	const game = new Game(cases, store);
	game.restore();
	return { game, store };
}

describe('Game', () => {
	it('restores saved progress and ignores unknown slugs', () => {
		const { game } = newGame(['hijab-school', 'deleted-case']);
		expect([...game.found]).toEqual(['hijab-school']);
	});

	it('marks a case found once and persists it', () => {
		const { game, store } = newGame();
		game.markFound('karen');
		game.markFound('karen');
		expect(game.found.size).toBe(1);
		expect(store.load()).toEqual(['karen']);
		expect(game.progress).toBeCloseTo(1 / cases.length);
	});

	it('highlights cases by cause in hint mode and all cases in reveal mode', () => {
		const { game } = newGame();
		game.setMode('hint');
		expect(game.highlighted.size).toBe(0);
		game.causeFilter = 'religion';
		// The datasheet files the Karen prisoner's forced haircut under religion too
		expect([...game.highlighted]).toEqual(['hijab-school', 'karen']);
		game.setMode('reveal');
		expect(game.causeFilter).toBeNull();
		expect(game.highlighted.size).toBe(cases.length);
	});

	it('resets progress', () => {
		const { game, store } = newGame(['karen']);
		game.reset();
		expect(game.found.size).toBe(0);
		expect(store.load()).toEqual([]);
	});
});
