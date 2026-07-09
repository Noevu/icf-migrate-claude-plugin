#!/usr/bin/env node
/**
 * Split a WordPress WXR export (Tools → Export XML) into per-page source files
 * for the yellowtree-migrate skill.
 *
 * Usage: node split-wxr.mjs <export.xml> [--out <dir>] [--force]
 *
 * Writes pages/<slug>.txt (pages) and pages/post-<slug>.txt (posts) with the
 * raw post_content (Avia shortcodes intact). Skips attachments, menus, drafts
 * are kept but marked in the header. Never overwrites without --force.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outArg = process.argv.indexOf('--out');
const OUT = outArg > -1 ? process.argv[outArg + 1] : join(process.cwd(), 'pages');
const FORCE = process.argv.includes('--force');
const file = process.argv.slice(2).find((a, i) => !a.startsWith('--') && process.argv[2 + i - 1] !== '--out');
if (!file) {
	console.error('usage: split-wxr.mjs <export.xml> [--out <dir>] [--force]');
	process.exit(1);
}

const xml = readFileSync(file, 'utf8');
const items = xml.split('<item>').slice(1);
mkdirSync(OUT, { recursive: true });

const tag = (src, name) => {
	// CDATA first, then plain text content
	const cdata = src.match(new RegExp(`<${name}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${name}>`));
	if (cdata) return cdata[1];
	const plain = src.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
	return plain ? plain[1] : '';
};

let written = 0, skipped = 0;
const counts = {};

for (const item of items) {
	const type = tag(item, 'wp:post_type');
	counts[type] = (counts[type] || 0) + 1;
	if (type !== 'page' && type !== 'post') continue;

	const slug = tag(item, 'wp:post_name') || `id-${tag(item, 'wp:post_id')}`;
	const status = tag(item, 'wp:status');
	if (status === 'trash' || status === 'auto-draft') continue;

	const content = tag(item, 'content:encoded');
	if (!content.trim()) {
		console.log(`  skip ${slug}: empty content`);
		continue;
	}

	const prefix = type === 'post' ? 'post-' : '';
	const out = join(OUT, `${prefix}${slug}.txt`);
	if (existsSync(out) && !FORCE) {
		skipped++;
		continue;
	}
	const title = tag(item, 'title').replace(/"/g, "'");
	const header = `<!-- exported ${type} id=${tag(item, 'wp:post_id')} slug=${slug} status=${status} title="${title}" -->\n`;
	writeFileSync(out, header + content + '\n');
	console.log(`  wrote ${prefix}${slug}.txt (${content.length} chars, ${status})`);
	written++;
}

console.log(`done: ${written} written, ${skipped} skipped (exist — use --force)`);
console.log('item types in export:', JSON.stringify(counts));
