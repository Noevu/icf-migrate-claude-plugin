# ICF → Yellowtree Migration (Claude Code Plugin)

Migrate an old ICF WordPress site (Enfold theme, Avia shortcodes) to the new **Yellowtree** block theme — semi-automatically, with Claude Code doing the conversion and validation.

Built for the ICF Rio de Janeiro migration; works for any ICF site on the icf.church multisite (or any Enfold→Yellowtree move).

## What you get

The flow: **export → analyze & decide → build → publish.**

| Phase | Command | What it does |
|---|---|---|
| 1. Export | `/yellowtree-setup` | Guides the WordPress export, splits it into per-page files (the Yellowtree target syntax ships with the plugin) |
| 2. Decide | `/yellowtree-analyze` | Scans your pages, asks YOU the site-wide questions (backgrounds, social icons, forms, scope…) BEFORE anything is built — answers saved to `migration-decisions.md` |
| 3. Build | `/yellowtree-migrate-all` | Converts all pages per your decisions, validates every page; `/yellowtree-media` downloads all originals |
| 4. Publish | `/yellowtree-publish` | Step-by-step: media upload, page creation (editor paste or REST), URL rewrite, widgets, redirects |

Plus: the `yellowtree-migrate` skill (conversion brain, auto-activates), the editor-verified block reference, and a deterministic validator (balanced blocks, valid attributes, no inline styles, no leftover shortcodes).

## Requirements

- [Claude Code](https://claude.com/claude-code)
- Node.js 18+ (for the scripts; no npm packages needed)
- Site-admin access to your old ICF WordPress site

## Install

```bash
claude plugin marketplace add noevu/icf-migrate-claude-plugin
claude plugin install icf-yellowtree-migration
```

## Quick start

```bash
mkdir my-icf-migration && cd my-icf-migration
claude
```

Then in Claude Code:

1. `/yellowtree-setup` — follow the steps (export XML from wp-admin → Tools → Export, drop it in the folder)
2. `/yellowtree-analyze` — answer a handful of one-time questions (backgrounds, social icons, forms, which pages go live)
3. `/yellowtree-migrate-all` — converts everything per your answers; each page gets:
   - `output/<slug>.blocks.html` — Yellowtree block markup, validator-clean
   - `output/<slug>.manifest.md` — images to re-upload, links to rewrite, remaining content gaps
   - `/yellowtree-media` downloads all originals to `media/originals/`
4. `/yellowtree-publish` — guided go-live: media upload, page creation (editor paste or REST), URL rewrite, widgets, redirects.

## What it converts

Sections, columns (all Avia layouts → Yellowtree rows/grids), text blocks, headings (incl. centering), images (plain + linked), buttons (incl. new-tab), YouTube/Vimeo/Spotify embeds, product boxes (→ text-image or cards), accordions, galleries, anchors. Unknown shortcodes become clearly marked TODO fallbacks — nothing is silently dropped.

## What still needs humans

Each page's `manifest.md` lists site-specific decisions. The recurring ones:

- **Section backgrounds** (colors, parallax images) — Yellowtree rows have no background option; the plugin flattens them to full-width images and flags each case
- **Third-party forms** (Elvanto etc.) — Yellowtree sites use Gravity Forms; rebuild or link out
- **Custom post types** (celebrations, events) — usually replaced by Yellowtree's dynamic widgets (events-list, sermons-list) instead of migrated
- **Media rewrite** — after uploading originals to the new media library, image URLs in the converted pages must be rewritten to the new site (ask Claude once the media import is done)

## How it stays correct

The block reference (`skills/yellowtree-migrate/reference/blocks.md`) was built from the Yellowtree vendor docs **and cross-verified against a real WXR export of an editor-authored Yellowtree site** (~1100 block occurrences). Claude never invents block syntax — anything not in the reference becomes a flagged fallback. Every converted page must pass the deterministic validator before it's reported as done.

## License

MIT — built by [Noevu](https://noevu.ch) for the ICF Rio de Janeiro migration.

## Examples

`examples/` ships the structural ground truth this plugin was calibrated against: a WXR export of a fresh Yellowtree template site (`new-site-template-export.xml`) and the extracted per-page template markup (`template-pages/`). Use them as reference for what real editor-saved Yellowtree blocks look like — your own site's export (see `/yellowtree-setup`) always wins where they differ.
