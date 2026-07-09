---
name: yellowtree-migrate-all
description: Convert all exported pages in pages/ to Yellowtree blocks — batch conversion with validation and per-page manifests.
---

Batch-convert every `pages/*.txt` file to Yellowtree block markup using the `yellowtree-migrate` skill.

0. **Require decisions first**: if `migration-decisions.md` does not exist, stop and run `/yellowtree-analyze` first — site-wide policies must be settled BEFORE building, not after. If a core-page scope was decided there, convert those pages first (still convert the rest unless told otherwise).
0b. **Redesign mode** (per migration-decisions.md): different flow — (1) write `redesign-brief.md` first (content-source whitelist from the old pages, banned content, verified facts like service times/address/social channels, evergreen offers; get the site owner to confirm facts that sources contradict); (2) per NEW-IA page, take the structure from its `input/new-site/<slug>.txt` template page and fill it with old content per the decided old→new mapping — template placeholder text NEVER becomes content, missing content becomes a TODO in the manifest, nothing invented; (3) outputs go to `output-new/<slug>.<locale>.blocks.html` per site language, translations faithful; (4) internal links point at the NEW page slugs from the confirmed slug table in migration-decisions.md — and ALWAYS site-relative (`/locale/slug/`, e.g. `/rio/pt-br/agenda/`), NEVER absolute with domain: staging domains (new.example.com) die at go-live and relative links survive the cutover unchanged; (5) run an href audit across all files at the end (every internal link resolves to a built page or existing anchor, zero absolute internal URLs).
1. List `pages/*.txt`; skip files whose `output/<slug>.blocks.html` already exists (tell the user; they can ask to redo specific pages).
2. Read the skill's `reference/blocks.md` ONCE and `migration-decisions.md`, then convert each page per the skill's workflow, mapping, and the decided policies: `output/<slug>.blocks.html` + `output/<slug>.manifest.md`.
2b. If media wasn't downloaded yet, run it now in the background: `node ${CLAUDE_PLUGIN_ROOT}/scripts/download-media.mjs <export.xml>` (see `/yellowtree-media`).
3. For many pages (>6), fan out parallel subagents in batches of 3–5 pages each; every subagent must read the skill + reference first and run the validator to 0 errors per page.
4. After all pages: run the validator over `output/*.blocks.html` in one sweep and confirm 0 errors everywhere.
5. Report: pages converted, validator status, and ONE consolidated deduplicated list of remaining judgment calls NOT covered by `migration-decisions.md` (page-specific content gaps: missing URLs, placeholder copy, truncated exports…). Site-wide policies were already decided — don't re-ask them.

Next step: `/yellowtree-publish`.
