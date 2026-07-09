---
name: yellowtree-publish
description: Guide publishing the converted pages to the new Yellowtree WordPress site — media upload, page creation, URL rewriting, widgets, redirects.
---

Walk the user through getting `output/*.blocks.html` live on their new Yellowtree site. Adapt to what exists in the project (launch plan, manifests, media/).

1. **Order check**: if a launch plan / core-page set was decided in `migration-decisions.md`, publish those pages first.
2. **Media**: originals live in `media/originals/` (from `/yellowtree-media`). User uploads them to the new site's media library (drag & drop into Media, or WP importer). Remind: keep filenames — the rewrite step matches on them.
3. **Pages**: two routes —
   - **Editor paste** (always works): in redesign mode, OVERWRITE the existing template pages instead of creating new ones (open "Home (Template Version X)" → Code editor → replace content → fix title + per-language slug) — this keeps the WPML language pairing and menu links intact; create new pages only where no template page exists, and link their language versions in WPML manually. First paste on a site = calibration: if a block reports "unexpected or invalid content", have the editor's auto-corrected version copied back and reconcile the outputs + reference (theme versions differ between ICF sites — known offenders: slider `pagination` attr, `connect-social-link` `linkUrl` attr, loose HTML comments).
   - **REST bulk-create** (if the new site has Application Passwords: check `<new-site>/wp-json/` advertises authentication): offer to create all pages via `POST /wp/v2/pages` with `{title, slug, status:"draft", content}`. Ask for site URL + credentials (env vars, never store in files).
4. **URL rewrite pass**: after media upload, ask for the new site's uploads base URL, then rewrite `src=` URLs in the created pages (old uploads path → new) and inject `imageId`s where the REST media response provides them. Internal page links (`href` to old domain) → new page URLs.
5. **Widgets & forms**: per manifests — configure events-list/services-list/sermons-list widgets in the editor (UUIDs are assigned there, usually hub-fed), rebuild any forms decided as Gravity Forms.
6. **Per-page manifest walk**: go through each published page's `output/<slug>.manifest.md` TODOs with the user and check them off.
7. **Redirects**: list old URLs → new URLs mapping and remind the user to set up redirects (or hand the list to whoever manages the old site) before the old site goes offline.
