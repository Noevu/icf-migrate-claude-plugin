---
name: yellowtree-media
description: Download all original images/media from the old site's WXR export into media/originals/ for re-upload to the new site.
---

Download every attachment referenced in the old site's WXR export.

1. Locate the WXR `.xml` file in the project (ask if multiple).
2. Run: `node ${CLAUDE_PLUGIN_ROOT}/scripts/download-media.mjs <export.xml>`
   - Downloads originals to `media/originals/…` (uploads subpath preserved)
   - Writes `media/manifest.csv` (old URL → local path)
   - Re-runnable: skips already-downloaded files
3. Report counts (downloaded / skipped / failed). Retry failures once; persistent failures usually mean the attachment was deleted on the old server — list them for the user.
4. Remind the user: after uploading these to the new site's media library, the converted pages still reference old URLs — a rewrite pass (old src → new src + imageId) is needed before the old site goes offline.
