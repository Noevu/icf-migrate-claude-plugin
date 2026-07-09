---
name: yellowtree-analyze
description: Analyze exported pages BEFORE converting — detect migration judgment calls and ask the site owner the site-wide policy questions, saving answers to migration-decisions.md.
---

Analyze `pages/*.txt` and settle all site-wide conversion decisions BEFORE any page is built. Requires `/yellowtree-setup` to have run (pages/ populated).

0. **FIRST question — migration mode** (shapes everything else):
   - **A) Redesign (Recommended)** — adopt the NEW Yellowtree template site's page architecture (home/visit/connect/give/about/events…) and merge the old content into it. Better result: the new theme's pages are composed differently than old Enfold pages; 1:1 copies look like the old site in new clothes. Requires the new site's WXR export (dummy/template content) — `/yellowtree-setup` step for it below.
   - **B) 1:1 migration** — every old page converted as-is, same order and hierarchy. Faster, no editorial judgment, right for content-heavy sites that must not change.
   Proven flow (ICF Rio 2026-07): redesign mode with a `redesign-brief.md` content whitelist — old-site pages + verified sources ONLY, template placeholder copy never becomes content, global-ICF promo content (Conference, Ladies Lounge…) banned, gaps become TODOs, never invented. In redesign mode, also ask: which old pages map/merge into which template pages (propose a mapping table from page titles), and which template pages the site doesn't need.

1. Scan all `pages/*.txt` (grep, don't full-read) for decision-triggering patterns:
   - `[av_section` with `custom_bg=` or `src=` → section backgrounds/parallax present
   - `[av_font_icon` → social icon rows
   - `[av_gravityform`, `av_elvanto_form`, `<iframe` (forms/calendar embeds), other unknown `[av_*` shortcodes not in the skill's mapping table
   - `link_target='_blank'`, linked image tiles in `1-1-1-1`/`1-1` grids (pseudo-navigation)
   - custom post types reported by split-wxr (celebrations, events)
   - `styling='circle'`, custom hex colors on buttons/sections
2. Ask the site owner via AskUserQuestion — ONE decision per question, max 4 per call, recommended option first with "(Recommended)". Only ask about patterns that actually occur. Typical set:
   - Section backgrounds → flatten to full-width images (recommended, matches how real Yellowtree sites are built) / per-page in editor
   - Social icon rows → yellowtree/connect-social block (recommended) / plain links
   - Nav image tiles on the homepage → hero-stage + icon-link-cards (recommended, the native pattern) / keep 1:1 linked images
   - Forms → link out to existing form (fast) / rebuild in Gravity Forms / iframe
   - Calendar/events pages → events-list widget (recommended; usually hub-fed) / static content
   - Custom post types → replace with dynamic widgets (recommended) / migrate content
   - **Page scope**: present the full inventory (old pages + template pages in redesign mode) as an explicit list and ask which go live now vs. deferred — old sites often carry dead pages; converting everything blindly wastes review time
   - **Slugs**: propose a slug table per page AND per language (localized slugs for non-EN locales) and have the owner confirm/correct EVERY slug BEFORE any link is written — wrong slugs mean every internal link breaks. Reuse old-site slugs where content maps 1:1 (saves redirects)
3. Write `migration-decisions.md`: one section per decision — the question, the answer, and the concrete conversion rule that follows from it. This file drives `/yellowtree-migrate-all`; the yellowtree-migrate skill reads it before converting.
4. Report the decision summary and point to `/yellowtree-migrate-all` as the next step.
