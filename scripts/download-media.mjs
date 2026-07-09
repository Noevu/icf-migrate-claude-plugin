#!/usr/bin/env node
/**
 * Download all original media files referenced in a WordPress WXR export
 * (Tools → Export XML) into media/originals/, preserving the uploads subpath.
 *
 * Usage: node download-media.mjs <export.xml> [--limit N] [--force]
 *
 * Reads <item> entries with post_type=attachment and fetches wp:attachment_url.
 * Skips existing files unless --force. Writes media/manifest.csv (old URL → local path).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const FORCE = args.includes('--force');
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx > -1 ? Number(args[limitIdx + 1]) : Infinity;
if (!file) {
	console.error('usage: download-media.mjs <export.xml> [--limit N] [--force]');
	process.exit(1);
}

const OUT = join(process.cwd(), 'media', 'originals');
const xml = readFileSync(file, 'utf8');
const items = xml.split('<item>').slice(1);

const tag = (src, name) => {
	const cdata = src.match(new RegExp(`<${name}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${name}>`));
	if (cdata) return cdata[1];
	const plain = src.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
	return plain ? plain[1] : '';
};

const attachments = items
	.filter((i) => tag(i, 'wp:post_type') === 'attachment')
	.map((i) => tag(i, 'wp:attachment_url'))
	.filter(Boolean)
	.slice(0, LIMIT);

console.log(`${attachments.length} attachments to fetch → ${OUT}`);
mkdirSync(OUT, { recursive: true });

// preserve path after /uploads/ (e.g. sites/129/2023/10/img.png); fallback: basename
const localPath = (url) => {
	const m = url.match(/\/uploads\/(.+)$/);
	return join(OUT, m ? m[1] : new URL(url).pathname.split('/').pop());
};

let ok = 0, skipped = 0, failed = 0;
const manifest = [];
const queue = [...attachments];

async function worker() {
	while (queue.length) {
		const url = queue.shift();
		const dest = localPath(url);
		if (existsSync(dest) && !FORCE) {
			skipped++;
			manifest.push(`${url},${dest}`);
			continue;
		}
		try {
			const res = await fetch(url);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			mkdirSync(dirname(dest), { recursive: true });
			writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
			manifest.push(`${url},${dest}`);
			ok++;
			if (ok % 25 === 0) console.log(`  ${ok}/${attachments.length}…`);
		} catch (e) {
			console.error(`  FAIL ${url}: ${e.message}`);
			failed++;
		}
	}
}
await Promise.all(Array.from({ length: 6 }, worker));

writeFileSync(join(process.cwd(), 'media', 'manifest.csv'), 'old_url,local_path\n' + manifest.join('\n') + '\n');
console.log(`done: ${ok} downloaded, ${skipped} skipped, ${failed} failed — media/manifest.csv written`);
process.exit(failed ? 1 : 0);
