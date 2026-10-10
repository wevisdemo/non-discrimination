import type { Component } from 'svelte';
import { z } from 'zod';
import causesJson from './causes.json';
import {
	CAUSE_IDS,
	caseSchema,
	causeSchema,
	type Case,
	type Cause,
	type CauseId
} from './schema.ts';

// Parsing at import time means a content mistake fails the build, not production.
export const causes: Cause[] = z.array(causeSchema).length(CAUSE_IDS.length).parse(causesJson);

const caseFiles = import.meta.glob<unknown>('./cases/*.json', { eager: true, import: 'default' });

export const cases: Case[] = Object.entries(caseFiles)
	.map(([path, data]) => {
		const parsed = caseSchema.safeParse(data);
		if (!parsed.success) throw new Error(`${path}: ${z.prettifyError(parsed.error)}`);
		if (!path.endsWith(`/${parsed.data.slug}.json`)) {
			throw new Error(`${path}: slug "${parsed.data.slug}" must match the file name`);
		}
		return parsed.data;
	})
	.sort((a, b) => a.slug.localeCompare(b.slug));

type DefinitionModule = { default: Component };
const definitionFiles = import.meta.glob<DefinitionModule>('./definitions/*.md', { eager: true });

export const definitions = new Map<CauseId, DefinitionModule>(
	CAUSE_IDS.map((id) => {
		const mod = definitionFiles[`./definitions/${id}.md`];
		if (!mod) throw new Error(`Missing definition for cause "${id}"`);
		return [id, mod];
	})
);

export function getCase(slug: string): Case | undefined {
	return cases.find((c) => c.slug === slug);
}

export function getCause(id: CauseId): Cause {
	return causes.find((c) => c.id === id)!;
}

export * from './schema.ts';
