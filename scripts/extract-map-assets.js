/**
 * Extracts the map assets from the Figma export of frame "Group 63" (SVG with embedded PNGs).
 *
 *   node scripts/extract-map-assets.js "path/to/Group 63.svg"
 *
 * - `BG-Final`        → src/lib/assets/map/bg-final.png
 * - `case-<slug>`     → src/lib/assets/cases/<slug>.png
 *   (vector shapes inside a case group, e.g. a white speech bubble, are baked into its PNG)
 * - Each case's position/size is written to `hotspot` in src/lib/content/cases/<slug>.json,
 *   so Figma stays the source of truth for where cases sit on the map.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const [, , svgPath] = process.argv;
if (!svgPath) {
	console.error('Usage: node scripts/extract-map-assets.js <Group 63.svg>');
	process.exit(1);
}

const root = path.resolve(import.meta.dirname, '..');
const out = {
	map: path.join(root, 'src/lib/assets/map'),
	cases: path.join(root, 'src/lib/assets/cases'),
	content: path.join(root, 'src/lib/content/cases')
};

const svg = await readFile(svgPath, 'utf8');
const [body, defs] = svg.split('<defs>');
if (!defs) throw new Error('No <defs> found: is this the Figma SVG export of "Group 63"?');

const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

// pattern id → base64 PNG
const images = new Map(
	[...defs.matchAll(/<image id="([^"]+)"[^>]*xlink:href="data:image\/png;base64,([^"]+)"/g)].map(
		(m) => [m[1], Buffer.from(m[2], 'base64')]
	)
);
const patterns = new Map(
	[...defs.matchAll(/<pattern id="([^"]+)"[^>]*>\s*<use xlink:href="#([^"]+)"/g)].map((m) => [
		m[1],
		images.get(m[2])
	])
);

/** Top-level layers: a `<rect id=…>` or a `<g id=…>` wrapping rects/paths. */
function* layers() {
	const re = /<g id="([^"]+)">|<\/g>|<(rect|path)\b([^>]*)\/>/g;
	let group = null;
	let depth = 0;
	for (const m of body.matchAll(re)) {
		if (m[1] !== undefined) {
			depth++;
			if (depth === 2) group = { id: m[1], rects: [], paths: [] }; // depth 1 = "Group 63"
		} else if (m[0] === '</g>') {
			if (depth === 2 && group) yield group;
			if (depth === 2) group = null;
			depth--;
		} else {
			const el = { tag: m[2], attrs: m[3] };
			if (group) group[el.tag === 'rect' ? 'rects' : 'paths'].push(el);
			else if (el.tag === 'rect') yield { id: attr(el.attrs, 'id'), rects: [el], paths: [] };
		}
	}
}

async function toPng(layer) {
	const rect = layer.rects[0];
	const pattern = attr(rect.attrs, 'fill')?.match(/url\(#(.+)\)/)?.[1];
	const png = patterns.get(pattern);
	if (!png) throw new Error(`${layer.id}: no embedded image`);
	const box = Object.fromEntries(
		['x', 'y', 'width', 'height'].map((k) => [k, Number(attr(rect.attrs, k) ?? 0)])
	);
	if (!layer.paths.length) return { png, box };

	// Bake vector shapes (drawn under the image in Figma) into the PNG.
	const { width, height } = await sharp(png).metadata();
	const paths = layer.paths
		.map((p) => `<path d="${attr(p.attrs, 'd')}" fill="${attr(p.attrs, 'fill') ?? 'black'}"/>`)
		.join('');
	const under = Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
			`<g transform="scale(${width / box.width} ${height / box.height}) translate(${-box.x} ${-box.y})">${paths}</g></svg>`
	);
	const merged = await sharp(under)
		.composite([{ input: png }])
		.png()
		.toBuffer();
	return { png: merged, box };
}

await mkdir(out.map, { recursive: true });
await mkdir(out.cases, { recursive: true });

let count = 0;
for (const layer of layers()) {
	const { png, box } = await toPng(layer);
	if (layer.id === 'BG-Final') {
		await writeFile(path.join(out.map, 'bg-final.png'), png);
		console.log(`map   bg-final.png (${box.width}×${box.height})`);
		continue;
	}
	const slug = layer.id.replace(/^case-/, '');
	if (slug === layer.id) {
		console.warn(`skip  ${layer.id} (not BG-Final or case-*)`);
		continue;
	}
	await writeFile(path.join(out.cases, `${slug}.png`), png);

	const jsonPath = path.join(out.content, `${slug}.json`);
	const data = JSON.parse(await readFile(jsonPath, 'utf8').catch(() => 'null'));
	if (!data) {
		console.warn(`warn  ${slug}: no ${path.relative(root, jsonPath)}; add one for this case`);
	} else {
		data.hotspot = { x: box.x, y: box.y, w: box.width, h: box.height };
		await writeFile(jsonPath, JSON.stringify(data, null, '\t') + '\n');
	}
	console.log(`case  ${slug}.png at ${box.x},${box.y} ${box.width}×${box.height}`);
	count++;
}
console.log(`\n${count} cases extracted. Run \`pnpm format\` to tidy the JSON.`);
