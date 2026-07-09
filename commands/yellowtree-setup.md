---
name: yellowtree-setup
description: Start an ICF Yellowtree migration — guide the WordPress export, split it into per-page files, and show the migration inventory.
---

Guide the user through setting up their ICF site migration in the current (empty or new) project directory.

1. Ask for their old site's wp-admin URL if not given (e.g. `https://www.icf.church/<city>/wp-admin/`).
2. Tell them to export their content (they need site-admin rights, works on the icf.church multisite):
   - Open `<old-site>/wp-admin/export.php` (Tools → Export / Werkzeuge → Daten exportieren)
   - Choose "All content" → Download Export File
   - Drop the downloaded `.xml` into this project directory
3. When the XML file is present, run:
   `node ${CLAUDE_PLUGIN_ROOT}/scripts/split-wxr.mjs <export.xml>`
   This writes `pages/<slug>.txt` (raw Avia shortcode source per page) and reports an item-type inventory.
3b. **Also export the NEW site** (the fresh Yellowtree install with its dummy/template pages): same Tools → Export there, then
   `node ${CLAUDE_PLUGIN_ROOT}/scripts/split-wxr.mjs <new-export.xml> --out input/new-site`
   This is the structural ground truth: real editor-saved block markup per template page ("Home (Template Version X)", "Visit", "Connect", …) — needed for redesign mode and for verifying block syntax against the site's actual theme version.
4. Show the user the inventory: number of pages/posts, plus any custom post types (e.g. `celebration`, `ag_events`) that the migration does NOT cover automatically — these need a separate decision (often replaced by Yellowtree's dynamic widgets: events-list, sermons-list).
5. Optionally download all original media now: suggest `/yellowtree-media`.
6. Next step: `/yellowtree-analyze` — settle the site-wide conversion decisions BEFORE building. Then `/yellowtree-migrate-all`, then `/yellowtree-publish`.

If the site is not on the icf.church multisite and has Application Passwords enabled, the REST alternative is `node ${CLAUDE_PLUGIN_ROOT}/scripts/export-rest.mjs --site <url>` with `WP_USER`/`WP_APP_PW` env vars — but WXR is the default path.
