---
name: yellowtree-migrate
description: Convert old ICF WordPress pages (Enfold/Avia shortcodes, legacy Gutenberg HTML) into Yellowtree Gutenberg blocks for the new ICF WordPress theme. Use when migrating a page, converting Avia shortcodes, or when user pastes old WP source / points at an exported page file. Triggers — "migrate page", "convert to yellowtree", "avia to blocks", "migrate my ICF site".
---

# Yellowtree Migration

Convert content **1:1** — same order, hierarchy, wording — into Yellowtree blocks. Active theme handles design; you emit structure only.

Full pipeline (export → split → convert → media): see plugin README / `/yellowtree-setup` command. This skill = the conversion step.

## Workflow (per page)

1. **First page in session** → read `reference/blocks.md` in this skill's directory (exact syntax, all attrs — verified against real editor-saved output of the Yellowtree theme; NEVER invent syntax not shown there). Also read `migration-decisions.md` in the project root if it exists (site-wide policies from `/yellowtree-analyze`) — its rules override the default judgment calls below. If it doesn't exist and the source shows judgment-call patterns, suggest running `/yellowtree-analyze` first.
2. Source: pasted text or exported page file (`pages/<slug>.txt`, produced by the plugin's `split-wxr.mjs`). Keep original untouched.
3. Convert per mapping below → write `output/<slug>.blocks.html` (block markup ONLY, no prose).
4. Validate: `node ${CLAUDE_PLUGIN_ROOT}/skills/yellowtree-migrate/scripts/validate.mjs output/<slug>.blocks.html` — fix until 0 errors. Never hand-report "checked mentally"; run the script.
5. Write `output/<slug>.manifest.md`: images to re-upload (old URL → needs new imageId), internal links to rewrite (old domain / `page,ID` refs), TODOs (unsupported shortcodes, section backgrounds, judgment calls).
6. Report: blocks emitted, validator result, manifest highlights.

Many pages → batch: convert one page fully (steps 2–5) before starting the next; collect judgment calls into a consolidated list at the end.

## Core rules

- No inline `style=`, no theme colors, no custom classes (except core embed wrapper classes + classes verbatim in reference).
- Preserve every heading level, paragraph, list, image, video, button, link target. `link='manually,URL'` → `href="URL"`. `link='page,ID'` → `href="#TODO-page-ID"` + manifest entry.
- No empty scaffolding — no empty rows/columns/paragraphs. Empty Avia columns (spacers like `[av_one_fourth first][/av_one_fourth]`) → drop, adjust row template to real column count.
- Simplest valid variant wins: no attrs unless source demands them.
- Every opened block comment closed; self-closing blocks (`/-->`) per reference.
- Content-only headings/paragraphs can sit at top level WITHOUT row wrapper — wrap in row only when source section/column structure demands grouping.
- Unknown shortcode → keep inner text/image in right order + `<!-- TODO: unsupported shortcode: NAME -->` once above fallback. Calendar embeds → `<!-- wp:paragraph --><p>Calendar embed</p><!-- /wp:paragraph -->`.
- NEVER emit `yellowtree/test-html` or `yellowtree/sample-placeholder` (doc-only blocks).

## Mapping (Avia → Yellowtree)

| Avia | Target |
|---|---|
| `[av_section]` | container context only — emit inner content; multi-col children get row. Section `custom_bg`/`src` background → NO row/column equivalent exists (editor-confirmed) — add manifest TODO ("section background: <value> — needs manual theme decision"). Image-only parallax section → `wp:image {"align":"full"}` + manifest note. Section vertical padding → `row.style.spacing.padding.{top,bottom}` (`"var:preset|spacing|N"`). Section `id='X'` anchor → plain `id="x"` HTML attribute on the section's first heading tag (NOT a JSON attr) |
| `[av_one_full]` | row `{"template":"1"}` → single column (or top-level if lone text) |
| `[av_one_half]` pairs | row `{"template":"1-1","desktopBreakpoint":"md"}` → columns. Consecutive halves = one row per pair; `first` attr marks new row |
| `[av_one_third]` ×3 | row `{"template":"1-1-1","desktopBreakpoint":"lg"}` |
| `[av_two_third]`+`[av_one_third]` | row `{"template":"7-5"}` or `{"5-7"}` per order, `"desktopBreakpoint":"lg"` |
| `[av_one_fourth]` ×4 | row `{"template":"1-1-1-1","desktopBreakpoint":"md"}` |
| `[av_textblock]` | inner HTML as core blocks: `wp:heading {"level":N}`, `wp:paragraph`, `wp:list`. Centering IS carried over: source `text-align: center` → heading `{"textAlign":"center"}` + class `has-text-align-center`; paragraph `{"align":"center"}` + same class. Strip other inline `style=` with no block-attr equivalent; strip stray `</p>` orphans (old sources have broken markup) |
| `[av_heading]` | `wp:heading {"level":N}` — carry `textAlign` if centered |
| `[av_image]` plain | core `wp:image` (NOT locked-image — locked-image only inside text-image/slider composites). `link='manually,URL'` → wrap `<img>` in `<a href>` inside figure. No width/height styling |
| `[av_button]` | `yellowtree/button-link` — `<a href="URL">Label</a>`. Size attr is `size` (values: `"small"`), NOT `fontSize`. `link_target='_blank'` → `"linkOpensInNewTab":true` JSON attr — never `target="_blank"` on the `<a>` |
| `[av_product]` 2-up (in halves) | `yellowtree/text-image` → `locked-image` + `text-card` (`locked-heading` + `locked-paragraph` + `button-link`, fixed order) |
| `[av_product]` 3+ grid/slider | `yellowtree/slider {"template":"3-col","variation":"card"}` or row of `yellowtree/card` (img + `<h3 class="title">` + `<p class="text">` + nested `card-buttons`/`card-button`) |
| `[av_youtube_lazy]` / `[av_video]` | core `wp:embed` — exact wrapper markup per reference (provider classes, URL repeated bare in wrapper) |
| `[av_font_icon]` social row | `yellowtree/connect-social` family if it's a dedicated social-links section (variations: telegram/instagram/facebook/youtube; wrapper attr `openLinksInNewTab`); other providers → nearest variation + manifest TODO. Icons mid-content → plain link paragraph + TODO |
| `[av_gravityform]` | `gravityforms/form` block in place |
| `[av_accordion]` | `yellowtree/accordion` + `accordion-item`. Single-open config → `{"onlySingleOpen":true}` |
| `[av_gallery]` / sliders | `yellowtree/fluid-gallery` or slider variant per reference — only if source had gallery/slider |
| `[av_team_member]` | `yellowtree/profile-card` family — showcase-documented only (zero real editor occurrences); flag for human review before emitting |
| `[av_testimonials]` | `yellowtree/testimonial-card` (`backgroundColor`: primary/trend1/trend2/trend3) |
| `[av_icon_box]` | `yellowtree/icon-link-cards` / `simple-card` — pick simplest fit per reference |
| `[av_hr]` / separators | drop (theme spacing) unless semantic divider → `yellowtree/divider-card` |

No confident match → plain `wp:paragraph`/`wp:heading` fallback + TODO comment. Never force an exotic yellowtree block onto unclear source.

## Media policy

Old-site image URLs stay as `src` in output — they render until media re-upload. OMIT `imageId`/`id` attrs (old attachment IDs invalid on new site; new IDs unknown). Every image → manifest list. Originals downloadable via `node ${CLAUDE_PLUGIN_ROOT}/scripts/download-media.mjs <export.xml>`. After bulk media import, a separate pass rewrites src + injects imageIds.

## Known judgment calls (decide once per site, apply consistently)

- Section background colors/parallax images — no block equivalent; flatten to full-width image or request theme treatment.
- Button custom hex colors — drop, theme default renders.
- Elvanto/third-party form shortcodes — Yellowtree sites use Gravity Forms; rebuild, iframe, or link-out.
- Duplicate section anchor ids in source → keep first occurrence only.
- Linked image tiles used as pseudo-navigation — 1:1 keeps them as linked `wp:image`; `icon-link-cards` is the nicer non-1:1 alternative.

## Explain mode

User says "erklären"/"comment"/"explain" → code first, then `---`, then ≤120-word rationale. Otherwise: code only in output file, normal report in chat.

## Editor paste learnings (ICF Rio paste test 2026-07, editor-corrected version as ground truth)

- **No loose HTML comments** (headers/TODOs) between blocks in output — the editor turns them into junk `<p>` blocks. TODOs belong in the manifest ONLY.
- **`yellowtree/slider`: NEVER emit a `"pagination"` attr** — target-site theme versions may not know it; the editor strips it (invalid-block risk).
- Editor-canonical attr order: `"textAlign"` BEFORE `"level"` on wp:heading.
- After the first paste test per site: have the editor's auto-corrected serialization copied back and adopt it as a reference correction — theme versions differ between ICF sites.
- **`connect-social-link`: NEVER emit `linkUrl`** (attr does not exist → invalid block; URLs live in central theme settings), iconClass bare form (`fa-whatsapp`, not `fa-brands fa-whatsapp`).

## Redesign mode (preferred approach, proven on ICF Rio 2026-07)

Instead of 1:1: adopt the new template site's page architecture and merge the old content into it. Flow: `redesign-brief.md` first (content whitelist: ONLY old pages + verified sources; template placeholder text never becomes content; foreign/global-ICF content banned; gaps = TODO, never invented; facts like service times/address/social channels confirmed by the site owner) → per new page take the structure from `input/new-site/<slug>.txt`, content from the mapped old pages → `output-new/<slug>.<locale>.blocks.html` per language → internal links point at the NEW slugs (slug table per page+language CONFIRMED BY THE OWNER before any link is written; reuse old slugs where possible = fewer redirects) and ALWAYS relative (`/locale/slug/`, never a staging domain — survives go-live) → final audit of all hrefs (0 absolute internal URLs). Publish: Template-Seiten überschreiben statt neu anlegen (WPML-Paarung + Menüs bleiben).

## Legal & contact pages (redesign mode)

- **Imprint + privacy policy**: build from the template site's pages, adapted to the church's country — swap the legal framework (GDPR/Swiss-DSG → local law, e.g. Brazil LGPD), insert the verified legal entity (registry lookup: company name, registration number, address — verify against an official source, never invent), keep placeholders for contact e-mail/DPO if unconfirmed, and add a mandatory manifest note: legal review required before publishing, automated adaptation is not legal advice. Localize the slugs (e.g. pt: aviso-legal, politica-de-privacidade).
- **Contact page**: the theme's global contact button links here (set in ICF theme settings) — keep it lean: heading, one line, contact data + a Gravity Forms contact form. Do NOT duplicate the connect page (community/social CTAs live there).
