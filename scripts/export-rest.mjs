#!/usr/bin/env node
/**
 * Bulk-export raw content (Avia shortcode source) from an old ICF WordPress site
 * via REST API with an Application Password.
 *
 * Usage:
 *   WP_USER=<wp-admin-username> WP_APP_PW=<application-password> \
 *     node export-rest.mjs --site https://www.icf.church/<yoursite>
 *
 * Writes pages/<slug>.txt (pages) and pages/post-<slug>.txt (posts) in the
 * current directory. content.raw = original editor content incl. [av_*]
 * shortcodes — what the yellowtree-migrate skill consumes.
 * Never overwrites existing files unless --force.
 *
 * NOTE: on the icf.church multisite Application Passwords are disabled
 * network-wide by default — use the WXR export (Tools → Export) + split-wxr.mjs
 * instead unless your network admin enabled them.
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const siteArg = process.argv.indexOf('--site');
if (siteArg === -1 || !process.argv[siteArg + 1]) {
	console.error('usage: export-rest.mjs --site https://www.icf.church/<yoursite> [--force]');
	process.exit(1);
}
const BASE = process.argv[siteArg + 1].replace(/\/$/, '') + '/wp-json/wp/v2';
const OUT = join(process.cwd(), 'pages');
const FORCE = process.argv.includes('--force');

const { WP_USER, WP_APP_PW } = process.env;
if (!WP_USER || !WP_APP_PW) {
	console.error('Set WP_USER and WP_APP_PW (Application Password) env vars. See usage in file header.');
	process.exit(1);
}
const auth = 'Basic ' + Buffer.from(`${WP_USER}:${WP_APP_PW.replace(/\s+/g, '')}`).toString('base64');

async function fetchAll(type) {
	const items = [];
	for (let page = 1; ; page++) {
		const url = `${BASE}/${type}?context=edit&per_page=100&page=${page}&_fields=id,slug,status,title,content`;
		const res = await fetch(url, { headers: { Authorization: auth } });
		if (res.status === 400) break; // past last page
		if (res.status === 401 || res.status === 403) {
			console.error(`Auth failed (${res.status}) — check username + Application Password.`);
			process.exit(1);
		}
		if (!res.ok) {
			console.error(`${type} page ${page}: HTTP ${res.status}`);
			process.exit(1);
		}
		const batch = await res.json();
		items.push(...batch);
		if (page >= Number(res.headers.get('x-wp-totalpages') || 1)) break;
	}
	return items;
}

mkdirSync(OUT, { recursive: true });
let written = 0, skipped = 0;

for (const type of ['pages', 'posts']) {
	const items = await fetchAll(type);
	console.log(`${type}: ${items.length} found`);
	for (const item of items) {
		const prefix = type === 'posts' ? 'post-' : '';
		const file = join(OUT, `${prefix}${item.slug}.txt`);
		if (existsSync(file) && !FORCE) {
			skipped++;
			continue;
		}
		const raw = item.content?.raw;
		if (raw == null) {
			console.error(`  ${item.slug}: no content.raw — context=edit not honored?`);
			continue;
		}
		const header = `<!-- exported ${type.slice(0, -1)} id=${item.id} slug=${item.slug} status=${item.status} title="${(item.title?.raw ?? '').replace(/"/g, "'")}" -->\n`;
		writeFileSync(file, header + raw + '\n');
		console.log(`  wrote ${prefix}${item.slug}.txt (${raw.length} chars)`);
		written++;
	}
}
console.log(`done: ${written} written, ${skipped} skipped (exist — use --force to overwrite)`);
