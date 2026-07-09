#!/usr/bin/env node
/**
 * Validate converted Yellowtree/Gutenberg block markup.
 * Usage: node validate.mjs <file> [<file>…]
 * Checks: balanced block comments, parseable attr JSON, allowed block names,
 * no inline style= (warn inside wp:embed), no empty paragraphs/rows/columns.
 * Exit 0 = clean (warnings allowed), exit 1 = errors.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const allowed = new Set(
	JSON.parse(readFileSync(join(here, '..', 'reference', 'allowed-blocks.json'), 'utf8'))
);

const files = process.argv.slice(2);
if (!files.length) {
	console.error('usage: validate.mjs <converted-file>…');
	process.exit(1);
}

let hadErrors = false;

for (const file of files) {
	const src = readFileSync(file, 'utf8');
	const errors = [];
	const warnings = [];

	// tokenize block comments
	const re = /<!--\s*(\/)?wp:([a-z0-9-]+(?:\/[a-z0-9-]+)?)(\s+(\{[\s\S]*?\}))?\s*(\/)?-->/g;
	const stack = [];
	let m;
	const lineOf = (idx) => src.slice(0, idx).split('\n').length;

	while ((m = re.exec(src)) !== null) {
		const [, closing, name, , attrJson, selfClosing] = m;
		const line = lineOf(m.index);

		if (!allowed.has(name)) {
			errors.push(`L${line}: unknown block "${name}" — not in allowed-blocks.json`);
		}
		if (closing) {
			const top = stack.pop();
			if (!top) errors.push(`L${line}: closing wp:${name} with no open block`);
			else if (top.name !== name)
				errors.push(`L${line}: closing wp:${name} but wp:${top.name} (L${top.line}) is open`);
			continue;
		}
		if (attrJson) {
			try {
				JSON.parse(attrJson);
			} catch {
				errors.push(`L${line}: wp:${name} attrs not valid JSON: ${attrJson.slice(0, 80)}`);
			}
		}
		if (!selfClosing) stack.push({ name, line, start: re.lastIndex });
	}
	for (const open of stack) errors.push(`L${open.line}: wp:${open.name} never closed`);

	// inline styles — allowed nowhere except inside wp:embed figure wrappers
	const embedRanges = [];
	const embedRe = /<!--\s*wp:embed[\s\S]*?<!--\s*\/wp:embed\s*-->/g;
	while ((m = embedRe.exec(src)) !== null) embedRanges.push([m.index, embedRe.lastIndex]);
	const styleRe = /\sstyle="/g;
	while ((m = styleRe.exec(src)) !== null) {
		const line = lineOf(m.index);
		const inEmbed = embedRanges.some(([a, b]) => m.index >= a && m.index < b);
		if (inEmbed) warnings.push(`L${line}: inline style inside wp:embed (Gutenberg-generated — ok if copied from reference)`);
		else errors.push(`L${line}: inline style= found — theme handles design, remove it`);
	}

	// empty paragraphs
	const emptyP = /<!--\s*wp:paragraph[^>]*-->\s*<p[^>]*>(\s|<br\s*\/?>|&nbsp;)*<\/p>\s*<!--\s*\/wp:paragraph\s*-->/g;
	while ((m = emptyP.exec(src)) !== null)
		errors.push(`L${lineOf(m.index)}: empty paragraph — no empty scaffolding`);

	// empty rows/columns (open immediately followed by matching close)
	const emptyContainer = /<!--\s*wp:(yellowtree\/(?:row|column|card-buttons|accordion))[^>]*-->\s*<!--\s*\/wp:\1\s*-->/g;
	while ((m = emptyContainer.exec(src)) !== null)
		errors.push(`L${lineOf(m.index)}: empty ${m[1]} — no empty scaffolding`);

	// leftover Avia shortcodes
	const avia = /\[\/?av_[a-z_]+/g;
	while ((m = avia.exec(src)) !== null)
		errors.push(`L${lineOf(m.index)}: unconverted Avia shortcode "${m[0]}"`);

	const status = errors.length ? 'FAIL' : 'OK';
	console.log(`${status}  ${file}  (${errors.length} errors, ${warnings.length} warnings)`);
	for (const e of errors) console.log(`  ERROR  ${e}`);
	for (const w of warnings) console.log(`  WARN   ${w}`);
	if (errors.length) hadErrors = true;
}

process.exit(hadErrors ? 1 : 0);
