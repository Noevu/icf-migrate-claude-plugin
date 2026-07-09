# Yellowtree Block Syntax Reference

Source of truth: verbatim occurrences in `input/*.txt` (vendor showcase docs) AND `input/new-site/*.txt` (real WXR export of the new site's dummy content — 14 pages, actual editor-saved markup, produced 2026-07). **Where the two disagree, `input/new-site/*.txt` wins** — it is real Gutenberg output, not hand-authored documentation. Blocks/attrs confirmed present in `input/new-site/*.txt` are marked **✓ editor-confirmed**. Never invent syntax — if a variant isn't shown in either source, don't guess it; flag it.

Comment format always: `<!-- wp:{name} {attrs-json-optional} -->` ... `<!-- /wp:{name} -->`. Blocks with no saveable content self-close: `<!-- wp:{name} {attrs} /-->` (no closing comment, no innerContent).

## 0. Noise attrs from the real export — never migrate these

Real editor-saved content carries plugin/editor bookkeeping that is not part of the block's rendering contract. Strip these, don't reproduce them:

- `"translatedWithWPMLTM":"1"` — WPML translation-management flag, appears on random core/yellowtree blocks in draft/legal pages (`podcast.txt`, `contact.txt`, `imprint.txt`, `blog.txt`). Cosmetic plugin metadata, not a rendering attr.
- `data-type="link" data-id="https://...url..."` on inline `<a>` tags inside paragraph content — WP link-picker metadata (`about.txt` L130/150, 16× in `privacy-policy.txt`). Keep the `href`/`target`/`rel`, drop `data-type`/`data-id`.
- `"metadata":{"name":"..."}` on `yellowtree/row` — editor list-view label (block nickname shown in the outline panel), seen only in the one hand-built real page (`reachbeyond.txt`, 20×), never in the templated dummy pages. Cosmetic only, safe to omit; harmless to keep if the source has meaningful section names worth preserving for editor UX.

## Anchors / in-page IDs — real mechanism confirmed

Both `core/heading` and `core/paragraph` support the standard Gutenberg "anchor" (HTML Anchor / advanced panel) feature: it renders as a plain `id="..."` attribute directly on the `<h*>`/`<p>` tag and is **never serialized into the block comment's JSON attrs** (Gutenberg's anchor support is `source:'attribute'`, read straight off the markup — not a re-serialized attribute). Confirmed real examples: `about.txt` L49 `<p ... id="values">`, `about.txt` L102 `<h3 ... id="werte">`, `visit.txt` L35 `<p id="celebration-times">` (linked from a `hero-stage-links`/`icon-link-card` `href="#celebration-times"` in the same page), `reachbeyond.txt` `id="give"` / `id="projects"` (linked from in-page `button-link href="#give"` / `href="#projects"`). **This is the real target for old-site in-page anchors/jump links** — add `id="slug"` straight onto the heading/paragraph tag, no comment attr needed, and point buttons at `href="#slug"`.

## 1. Row / Column (grid)

```html
<!-- wp:yellowtree/row {"template":"1"} -->
<!-- wp:yellowtree/column -->
...
<!-- /wp:yellowtree/column -->
<!-- /wp:yellowtree/row -->
```

**row attrs**

| attr | values seen | required |
|---|---|---|
| `template` | `"1"` ✓, `"1-1"` ✓, `"7-5"` ✓, `"5-7"`, `"1-1-1"` ✓, `"1-1-1-1"` ✓, `"3-col"`/`"4-col"` (these are `slider` template values, not `row` — don't confuse), `"default"` (slider only) | yes |
| `desktopBreakpoint` | `"md"` ✓ (15× real, e.g. `1-1`, `1-1-1-1`), `"lg"` ✓ (3× real, e.g. `7-5`, `1-1-1`) — **both confirmed real**, `md` far more common than the showcase docs suggested | **inconsistently present** — plenty of real rows (esp. `template:"1"`) carry no `desktopBreakpoint` at all — absence is not an error |
| `containerWidth` | `10` ✓ (`about.txt` L10, narrower centered container), `8` (showcase only, not seen in new-site) | no |
| `mobileReverse` | `true` ✓, `false` ✓ (both seen explicitly, `reachbeyond.txt`) | no |
| `style.spacing.padding` | `{"top":"var:preset|spacing|N","bottom":"var:preset|spacing|N"}` ✓ — **by far the single most common row attr in real output** (dozens of occurrences, every value `0`–`10`); can appear with only `top` or only `bottom` set. **This is real per-section vertical spacing control at the row level** — not documented at all in the previous version of this reference | no |
| `style.spacing.margin` | `{"top":"...","bottom":"..."}` — seen on `hero-stage`/`connect-social`/`slider`, less often directly on `row` | no |
| `metadata.name` | free string, editor list-view label only (§0) — cosmetic, never affects render | no |
| `style` (blockGap) | `{"spacing":{"blockGap":"var:preset|spacing|N"}}` — real occurrences are on `column`, not `row` | no |
| `className` | free string — **not observed in `new-site` export**, showcase-only, unconfirmed | no |

**column attrs**

| attr | values seen | required |
|---|---|---|
| `md` | column count numerator, e.g. `6` (1-1, 1-1-1-1) ✓ | only for multi-col templates |
| `lg` | e.g. `7` ✓,`5` ✓,`4` ✓,`3` (showcase only) | only for multi-col/breakpoint-lg templates |
| `verticalAlign` | `"center"` ✓ (15×), `"start"` ✓ (2×) | no |
| `mobileHorizontalAlign` | `"center"` ✓ (18×), `"end"` ✓, `"start"` ✓ | no |
| `desktopHorizontalAlign` | `"center"` ✓ (17×), `"end"` ✓, `"start"` ✓ | no |
| `style.spacing.blockGap` | `"0"` ✓ (11× — very common right before a lone centered button, kills the default gap above it), `"var:preset|spacing|2"` ✓, `"var:preset|spacing|8"` ✓ | no |
| `lock` | `{"move":false,"remove":false}` — **not observed in `new-site` export**, showcase-only, unconfirmed | no |

`verticalAlign`/`mobileHorizontalAlign`/`desktopHorizontalAlign` were entirely undocumented before this update despite being some of the most common column attrs in real output — always paired together in practice when a column needs to center a single button/element (e.g. `{"mobileHorizontalAlign":"center","desktopHorizontalAlign":"center"}` before a lone `button-link`).

**Template → column attrs table (VERBATIM, from Beispielseite-Grid.txt)**

| template | column attrs |
|---|---|
| `1` | `<!-- wp:yellowtree/column -->` (no attrs at all) |
| `1-1` | `{"md":6}` + `{"md":6}` |
| `7-5` | `{"lg":7}` + `{"lg":5}` |
| `5-7` | `{"lg":5}` + `{"lg":7}` |
| `1-1-1` | `{"lg":4}` ×3 (Grid doc); but Buttons&Links doc uses `{"md":12,"lg":4}` ×3 with row attrs `{"template":"1-1-1"}` — **no desktopBreakpoint** |
| `1-1-1-1` | `{"md":6,"lg":3}` ×4 |

Empty column, self-closing: `<!-- wp:yellowtree/column {"md":6} /-->` (yellowtree-alle-elemente.txt L346).

Nesting: `row` > 1+ `column` > any content block(s). Rows can nest inside a column (accordion-item body, hero-stage-links wrapper use nested row/column — see yellowtree-alle-elemente L557-583 nested row inside column inside row).

## 2. Core text blocks

**heading** — `<!-- wp:heading {"level":N} --><hN class="wp-block-heading">Text</hN><!-- /wp:heading -->`. No `level` attr = h2 default:
```html
<!-- wp:heading -->
<h2 class="wp-block-heading">Überschrift2</h2>
<!-- /wp:heading -->
```
With level: `<!-- wp:heading {"level":1} --><h1 class="wp-block-heading">Werde Teil von einem Team</h1><!-- /wp:heading -->`. Real levels seen: `1` ✓ (15×), `3` ✓ (34×) — level 2 is simply the default (no attr), level 6 is showcase-only/unconfirmed.

**⚠ CORRECTION — `textAlign` DOES appear on core heading in real output.** The previous version of this reference (and the SKILL.md mapping rule for `[av_textblock]`) claimed centering is always stripped and theme-handled. That is wrong for headings. Real, editor-confirmed:
```html
<!-- wp:heading {"textAlign":"center","level":1,"style":{"spacing":{"margin":{"top":"var:preset|spacing|7"}}},"useDisplayFontStyle":true} -->
<h1 class="wp-block-heading has-text-align-center" style="margin-top:var(--wp--preset--spacing--7)">Welcome to<br>ICF XY</h1>
<!-- /wp:heading -->
```
Confirmed heading attrs: `textAlign` (`"center"` ✓ 16×, `"left"` ✓ 2×) → adds `has-text-align-{value}` class; `useDisplayFontStyle` (`true` ✓, 45× — appears on almost every `h1`/`h3` in real output, never seen `false`, seemingly the default "use display font" toggle editors leave on); `style.spacing.margin.{top,bottom}` (`"var:preset|spacing|N"` or `"0"`); `id="slug"` anchor rendered on the tag, never in the JSON attrs (see §Anchors above). Migration rule update: **do not strip `textAlign`/`useDisplayFontStyle` from headings** — carry them over 1:1 when the old source centers a heading.

**paragraph** — simplest:
```html
<!-- wp:paragraph -->
<p>Paragraph</p>
<!-- /wp:paragraph -->
```
Attrs: `align` (`"center"` ✓|`"left"` ✓), `fontSize` (`"small"` ✓|`"medium"` ✓|`"large"` ✓ → adds class `has-{size}-font-size`), `style.spacing.margin.{top,bottom}` (`"var:preset|spacing|N"` / `"0"`), `className`, `id="slug"` anchor rendered on the tag (see §Anchors above).

**Color — confirmed real usage, corrects §20 below.** `core/paragraph` supports a theme-palette `textColor` + a matching link-color style, both editor-confirmed (`imprint.txt`):
```html
<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"var:preset|color|trend3"}}}},"textColor":"trend3"} -->
<p class="has-trend-3-color has-text-color has-link-color">...</p>
<!-- /wp:paragraph -->
```
Only `"trend3"` observed as a value; the mechanism (theme palette slug via `textColor` + `style.elements.link.color.text`) generalizes to any registered palette color, contradicting the old claim that only a handful of yellowtree block attrs accept color tokens.

**list / list-item**:
```html
<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>Liste Eintrag 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Liste Eintrag 2</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->
```

## 3. Images — core `wp:image` vs `yellowtree/locked-image`

**core/image** — standalone photo anywhere (page body, column, accordion body). Simplest:
```html
<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="..." alt="" /></figure>
<!-- /wp:image -->
```
Real editor-confirmed attrs (`about.txt`, `reachbeyond.txt`, 21 occurrences total): `id` ✓ (attachment id — renders both on `<figure>` implicitly via class and directly on `<img class="wp-image-{id}">`), `sizeSlug` ✓ (`"large"` most common, `"full"` also seen), `linkDestination` ✓ — **always `"none"` in every one of the 21 real occurrences**, no other value seen, `aspectRatio` ✓ (`"1"` — square crops for portrait/avatar photos), `scale` ✓ (`"cover"`, always paired with `aspectRatio`, adds inline `style="aspect-ratio:1;object-fit:cover"` on the `<img>`), `align` ✓ (`"wide"` and `"center"` both confirmed — not just `"full"` as previously documented; renders `alignwide`/`aligncenter` class on `<figure>`), `className` — **`"is-style-rounded"` ✓** (`about.txt` L6, a wide header photo — rounded corners) and **`"is-style-default"` ✓** (`reachbeyond.txt`, on an `aspectRatio:1 + scale:cover` avatar photo). `fullHeight` — showcase-only, not observed in `new-site`.

**Circle/rounded images — open question, not fully resolved.** `is-style-rounded` is confirmed to exist as a real core/image block style, but the one real instance uses it on a wide rectangular banner (rounded corners, not a circle). The square avatar-style crops (`aspectRatio:1` + `scale:cover`) in `reachbeyond.txt` use `className:"is-style-default"` (the default style, explicitly stated) or no `className` at all — never `is-style-rounded` paired with `aspectRatio:1`. So: rounded-corners-on-a-rectangle is confirmed; whether `is-style-rounded` + `aspectRatio:1` together produce a true circle is unconfirmed by real data — theme CSS may render any `aspectRatio:1` image as circular regardless of `className`, or circularity may need `is-style-rounded` explicitly. Flag for human/theme-code confirmation rather than assuming.

Style/`className` combo table observed: `is-style-4-3` ✓ appears on `yellowtree/text-image` (not core image) in 3 places — a text-image variant, not a core/image style — don't confuse the two.

**yellowtree/locked-image** — used in THREE places:
1. Standalone in a column, own block (Beispielseite-Grid.txt L469-473): `<!-- wp:yellowtree/locked-image --><img/><!-- /wp:yellowtree/locked-image -->` (bare, no src — placeholder-only demo) — confirms it is NOT exclusive to text-image/card.
2. First child of `yellowtree/text-image` (always).
3. Repeated child of `yellowtree/slider` when `"variation":"image"`.

Never used inside `yellowtree/card` (card's image is a raw `<img>` tag, no block wrapper — see §7).

```html
<!-- wp:yellowtree/locked-image {"imageId":130} -->
<img src="https://new.icf.church/.../IMG_1523.jpeg_compressed.jpeg" alt=""/>
<!-- /wp:yellowtree/locked-image -->
```
Attrs: `imageId` (int, optional), `focalPoint` (`{"x":0.86,"y":0.7}`, optional).

## 4. text-image / text-card / locked-heading / locked-paragraph

```html
<!-- wp:yellowtree/text-image -->
<!-- wp:yellowtree/locked-image {"imageId":130} -->
<img src="..." alt=""/>
<!-- /wp:yellowtree/locked-image -->

<!-- wp:yellowtree/text-card {"transparentBackground":true} -->
<!-- wp:yellowtree/locked-heading -->
<h2>Überschrift (Text &amp; Image)</h2>
<!-- /wp:yellowtree/locked-heading -->

<!-- wp:yellowtree/locked-paragraph -->
<p>Test </p>
<!-- /wp:yellowtree/locked-paragraph -->

<!-- wp:yellowtree/button-link -->
<a></a>
<!-- /wp:yellowtree/button-link -->
<!-- /wp:yellowtree/text-card -->
<!-- /wp:yellowtree/text-image -->
```

`text-image` attrs: `variation` (`"card"` ✓, optional — omit for default), `className` (`"is-style-4-3"` ✓, e.g. `give.txt` — can combine with `variation:"card"` or appear alone).
`text-card` attrs: `transparentBackground` (bool ✓ — appears both `true` and `false` explicitly, and omitted entirely). **New: `showButton`** (bool ✓, `about.txt` L29 `{"showButton":false,"transparentBackground":false}`) — controls whether the trailing `button-link` child is present; confirmed correlated with real content: the one `showButton:false` instance has no `button-link` child at all (just `locked-heading` + `locked-paragraph`), previously undocumented entirely.
`locked-heading` attrs: `className`, `placeholder`, `textAlign` (`"center"`), `level` (int), `maxLength` (int) — all optional, all seen only in special contexts (connect-social heading, hero-stage-content heading).
`locked-paragraph` attrs: `placeholder`, `className` — optional.

Nesting: `text-image` = `locked-image` + `text-card`. `text-card` = `locked-heading` + `locked-paragraph` + `button-link` (fixed order in every occurrence). `text-card` also reused standalone inside `image-section-card` (§8) — not exclusive to text-image.

Simplest valid text-image: no attrs, `text-card` no attrs, `button-link` no attrs, `<a></a>` empty.

## 5. button-link

```html
<!-- wp:yellowtree/button-link -->
<a href="https://www.icf.ch/button1">Button 1</a>
<!-- /wp:yellowtree/button-link -->
```
Attrs (all optional, combine freely):

| attr | values seen |
|---|---|
| `iconClass` | `"fa-arrow-right"` ✓, `"fa-solid fa-arrow-right"` ✓, `"fa-solid fa-globe"` ✓, `"fa-solid fa-cross"` ✓, `"fa-solid fa-book"` ✓, `"fa-solid fa-location-arrow"` ✓, `"fa-solid fa-user-group"` ✓, `""` (empty = no icon, showcase) |
| `styleVariation` | `"outlined"` ✓, `"action"` ✓ (omit = default/primary style); `"highlight"` — showcase-only, not seen in `new-site` |
| `backgroundColor` | `"primary"` ✓, `"primary2"` ✓ (paired with both `styleVariation:"action"` and standalone) |
| `size` | **✓ `"small"` — real attr name is `size`, NOT `fontSize`.** `fontSize` never occurs on `button-link` anywhere in the 14-page real export (0 hits vs. 3 confirmed `size` hits: `home.txt`, `imprint.txt`) — **this invalidates any migrated output that emitted `"fontSize":"small"` on a button-link; it must be `"size":"small"`.** `fontSize` is real on `paragraph`/`heading` but not on `button-link`. |
| `isDisabled` | `false` ✓ (explicit, seen twice; `true` never observed) |
| `width` | `100` (number, only seen with `"highlight"` in showcase docs) — unconfirmed in real export |
| `linkOpensInNewTab` | **bool ✓ — previously undocumented entirely.** `true`/`false` both seen (`about.txt`, `home.txt`, `visit.txt`). **Confirmed mechanism: this attr does NOT change the saved `<a>` markup** — the rendered tag stays a plain `<a href="...">Label</a>` with no `target`/`rel` in either case; new-tab behavior is applied at render time by the block's PHP/JS, not serialized into the saved HTML. Do not add `target="_blank"` yourself when converting an old-site link that should open in a new tab — set `linkOpensInNewTab:true` in the JSON attrs instead. |

Simplest: `<!-- wp:yellowtree/button-link --><a></a><!-- /wp:yellowtree/button-link -->` (empty href/label valid placeholder).

## 6. card / card-buttons / card-button

```html
<!-- wp:yellowtree/card {"imageId":134,"showButtons":true} -->
<article><img src="..." alt=""/><h3 class="title">Karte Überschrift</h3><p class="text">Karte Text</p><!-- wp:yellowtree/card-buttons -->
<!-- wp:yellowtree/card-button {"iconClass":"fa-arrow-right"} -->
<a href="www.google.com">Button Karte</a>
<!-- /wp:yellowtree/card-button -->
<!-- /wp:yellowtree/card-buttons --></article>
<!-- /wp:yellowtree/card -->
```
`card` attrs: `imageId` (optional — img can be bare `<img>` or `<img>` with no src at all), `showButtons` (bool ✓), `showTags` (bool ✓), `tags` (`[{"label":"NEW"}]` ✓, `[{"label":"MOVEMENT"}]` ✓), `tagColor` (`"primary"` ✓, **`"white"` ✓ — new confirmed value, not just `"primary"`**), `imageFocalPoint` (`{"x":0.58,"y":0.19}` ✓ — **previously documented only under `image-card`; real output confirms plain `card` also takes `imageFocalPoint`**, e.g. `connect.txt`, `reachbeyond.txt`), `fullHeight` (bool — showcase-only, not observed in `new-site`). Simplest: `<!-- wp:yellowtree/card --><article><img><h3 class="title">...</h3><p class="text">...</p></article><!-- /wp:yellowtree/card -->` (no attrs, no card-buttons, image can be empty `<img>`).
`card-buttons` — no attrs, wraps 1+ `card-button`.
`card-button` attrs: `iconClass` — content `<a href="...">Label</a>` **or `<a>Label</a>` (no href) or `<a></a>` (empty, both label and href absent) — all three confirmed real** (`home.txt`, `connect.txt`), not just the fully-populated form.

There is no separate "card-grid" block — a grid of cards = `row` (`1-1-1` etc.) with one `card` per `column`, OR `yellowtree/slider` with `card` children (§9). No standalone `card-grid` block name appears anywhere in the docs.

## 7. Other card-family blocks (all live directly in a column or as slider children)

**big-teaser-card** — `variation`: `"column"` (has `<p class="text">`) or `"center"` (no text, headline+subline only):
```html
<!-- wp:yellowtree/big-teaser-card {"variation":"column"} -->
<article><hgroup><h3 class="title">Headline Teaser Karte Gross</h3><p class="subtitle">Subline Teaser Karte Gross</p></hgroup><p class="text">Text Teaser Karte Gross</p><!-- wp:yellowtree/button-link {"iconClass":"fa-solid fa-arrow-right"} -->
<a href="www.icf.ch">Button</a>
<!-- /wp:yellowtree/button-link --></article>
<!-- /wp:yellowtree/big-teaser-card -->
```

**divider-card / divider-card-item** — wrapper has no attrs, 2-3 items:
```html
<!-- wp:yellowtree/divider-card -->
<!-- wp:yellowtree/divider-card-item {"linkOpensInNewTab":false} -->
<article><h3 class="text">Headline 1 (3 Teiler Karte)</h3><a href="www.icf.ch">Link Text</a></article>
<!-- /wp:yellowtree/divider-card-item -->
...
<!-- /wp:yellowtree/divider-card -->
```
item attrs: `linkOpensInNewTab` (bool ✓ — confirmed real, both `true`/`false` explicit, and also confirmed **omitted entirely** e.g. `events.txt`/`sermons.txt` when only `iconClass` is set), `iconClass` (optional ✓, e.g. `"fa-solid fa-users"`, `"fa-video"`).

**history-card** — standalone, in a column, or as slider child:
```html
<!-- wp:yellowtree/history-card {"imageId":134} -->
<article><img src="..."/><h3 class="title"></h3><p class="text"></p></article>
<!-- /wp:yellowtree/history-card -->
```
attrs: `imageId` ✓ (optional, img can be bare `<img>`).

**icon-link-cards / icon-link-card** — wrapper attr `breakpoint` (`"md"|"lg"`), items:
```html
<!-- wp:yellowtree/icon-link-cards {"breakpoint":"md"} -->
<!-- wp:yellowtree/icon-link-card {"iconClass":"fa-hands"} -->
<a>Ich bin neu hier</a>
<!-- /wp:yellowtree/icon-link-card -->
...
<!-- /wp:yellowtree/icon-link-cards -->
```
**Not editor-confirmed as a standalone wrapper.** `icon-link-card` (the item) occurs 10× in the real export, but in every single occurrence its parent is `hero-stage-links`, never a bare `icon-link-cards` wrapper. The plural wrapper block itself has zero occurrences in the 14-page export — keep the showcase syntax (it's a registered block name, presumably used for icon-link grids outside a hero), but treat it as unconfirmed by real data.

**image-card** — attrs `imageId` ✓, `tags` ✓ (`[{"label":"Popular"}]`, `[{"label":"NEW"}]`), `showTags` ✓, `linkOpensInNewTab` ✓ (`false` seen; also confirmed omitted), `imageFocalPoint` — showcase-only, **not observed on `image-card` in the real export** (real `image-card` instances in `give.txt` never carry it; `imageFocalPoint` in real data was only seen on plain `card` and `slider`, see §6). `tagColor` — also not observed on `image-card` in real data (only `tags`+`showTags`, no explicit color). Uses `h2` (not h3 like card/history-card). Wrapped in `<a href>` when linked, else `<article>`:
```html
<!-- wp:yellowtree/image-card {"imageId":174} -->
<article><img src="..."/><h2 class="title">Überschrift Bild Karte</h2><p class="text"></p></article>
<!-- /wp:yellowtree/image-card -->
```
linked variant ✓ real (`give.txt`): `<a href="..."><img.../><h2 class="title">...</h2><p class="text">...</p></a>`.

**image-link-cards / image-link-card** — plain image+caption tiles, no attrs on wrapper needed:
```html
<!-- wp:yellowtree/image-link-cards -->
<!-- wp:yellowtree/image-link-card -->
<article><img/><p>Überschrift1(Bild Linnk Karte)</p></article>
<!-- /wp:yellowtree/image-link-card -->
...
<!-- /wp:yellowtree/image-link-cards -->
```
item attrs: `imageId` ✓ (confirmed real, `visit.txt`, 4 instances), `linkOpensInNewTab` (optional) — when present content is `<a href="...">` instead of `<article>`. Real instances always leave the caption `<p></p>` empty (not the showcase's placeholder text) — empty caption is a valid, confirmed-real variant.

**image-section-card** — full-bleed bg image + overlaid text-card:
```html
<!-- wp:yellowtree/image-section-card {"imageId":124,"imageUrl":"..."} -->
<!-- wp:yellowtree/text-card -->
<!-- wp:yellowtree/locked-heading -->
<h2>Überschrift Bild Sektion Karte</h2>
<!-- /wp:yellowtree/locked-heading -->
<!-- wp:yellowtree/locked-paragraph -->
<p>Text</p>
<!-- /wp:yellowtree/locked-paragraph -->
<!-- wp:yellowtree/button-link -->
<a href="www.icf.ch">Button</a>
<!-- /wp:yellowtree/button-link -->
<!-- /wp:yellowtree/text-card -->
<!-- /wp:yellowtree/image-section-card -->
```
attrs: `imageId`, `imageUrl`, `imageFocalPoint` (optional). **⚠ Not editor-confirmed** — `image-section-card` has zero occurrences across all 14 real pages. Keep the showcase syntax as the only known target for a full-bleed background-image section with overlaid text, but flag any old-site "section with background image + text" conversion for human review since real usage is unverified.

**simple-card**:
```html
<!-- wp:yellowtree/simple-card -->
<article><!-- wp:paragraph -->
<p>Einfache Karte</p>
<!-- /wp:paragraph --></article>
<!-- /wp:yellowtree/simple-card -->
```
No attrs seen (✓ confirmed real, `imprint.txt`, 2×). **Contents are richer than showcase implies** — the real occurrence in `imprint.txt` nests a `wp:heading` + `wp:paragraph` + a full `wp:yellowtree/row` > `column` > `button-link` inside the `<article>`, not just a lone paragraph. `simple-card` genuinely accepts arbitrary core AND yellowtree blocks as children.

**testimonial-card** — attrs `testifierName` ✓, `testifierLocation` ✓ (both effectively required — always present), `backgroundColor` (**`"primary"`, `"trend1"` ✓, `"trend2"` ✓, `"trend3"` ✓ — all three `trend` values confirmed real in `give.txt`, not just `"trend2"` as previously documented**), `imageId` (optional ✓ — also confirmed as **`-1`**, a sentinel "no image" value paired with `<img src="" alt=""/>`; plain omission of `imageId` also occurs, paired with bare `<img/>`):
```html
<!-- wp:yellowtree/testimonial-card {"testifierName":"Name Testimony Person","testifierLocation":"Location / Ort Person"} -->
<article><img/><blockquote>Testimony Text</blockquote></article>
<!-- /wp:yellowtree/testimonial-card -->
```

**profile-card family** (fixed 3-level nest) — **⚠ Not editor-confirmed.** `profile-card`/`profile-card-popover`/`profile-card-links`/`profile-card-link` have zero occurrences across all 14 real pages (no team/staff page was included in this export). Keep the showcase syntax as the only known target for `[av_team_member]`, but flag team-member conversions for human review since real usage is unverified:
```html
<!-- wp:yellowtree/profile-card {"imageId":29,"imageUrl":"...","imageAlt":""} -->
<article><p class="location">Location</p><h3 class="name">Name Profil Karte</h3><p class="responsibility">Responsibility (Job Titel)</p><div class="inner-blocks"><!-- wp:yellowtree/profile-card-popover -->
<article><p class="biography">Detail Beschreibung Person</p><div class="inner-blocks"><!-- wp:yellowtree/profile-card-links -->
<ul class="inner-blocks"><!-- wp:yellowtree/profile-card-link -->
<li><a></a></li>
<!-- /wp:yellowtree/profile-card-link --></ul>
<!-- /wp:yellowtree/profile-card-links --></div></article>
<!-- /wp:yellowtree/profile-card-popover --></div></article>
<!-- /wp:yellowtree/profile-card -->
```
`profile-card` attrs: `imageId`, `imageUrl`, `imageAlt`. `profile-card-link` attrs: `icon` (e.g. `"fa-solid fa-link"`, optional) — content `<li><a href="...">Label</a></li>`. Nesting is fixed: profile-card > profile-card-popover > profile-card-links > profile-card-link(s).

## 8. Slider

Wrapper `yellowtree/slider`, children are repeated card-family blocks matching `variation`.

| variation | child block |
|---|---|
| `card` | `yellowtree/card` |
| `history-card` | `yellowtree/history-card` |
| `testimonial-card` | `yellowtree/testimonial-card` |
| `image-card` | `yellowtree/image-card` |
| `image` | `yellowtree/locked-image` |
| `teaser-card` | `yellowtree/teaser-card` |

attrs: `template` (`"3-col"` ✓|`"4-col"` ✓|`"default"`), `variation` (above table — `card` ✓, `history-card` ✓, `testimonial-card` ✓, `image-card` ✓ all editor-confirmed; `image` and `teaser-card` showcase-only), `allowedTemplates` (array, always `["3-col","4-col"]` ✓ in every real occurrence, empty `[]` when `template:"default"` per showcase), `pagination` (bool ✓), `navigation` (bool ✓), `forceSameHeight` (bool ✓, both `true`/`false` seen), `style.spacing.margin.{top,bottom}` (✓ real, very common — e.g. `"var:preset|spacing|6"`, `"var:preset|spacing|9"`).

```html
<!-- wp:yellowtree/slider {"template":"3-col","variation":"card","allowedTemplates":["3-col","4-col"]} -->
<!-- wp:yellowtree/card {"imageId":174} -->
<article><img src="..." alt=""/><h3 class="title">Überschrift</h3><p class="text">Text 1 "3 Karten Slider"</p></article>
<!-- /wp:yellowtree/card -->
...
<!-- /wp:yellowtree/slider -->
```
`teaser-card` (slider-only block) attrs: `imageId`, `showTags`, `tags`, `tagColor`, `category`, `location`, `startDate`/`endDate` (unix ms int). Content: `<article><img.../><a><h3 class="title">...</h3></a></article>`. `"default"` template slider needs `pagination:true,navigation:true`.

Note: `yellowtree/slider` can occur directly inside a `column` (most common) OR directly at row level without its own column wrapper (yellowtree-alle-elemente.txt L419-431: slider sits between two `row`/`column` blocks with no column of its own) — confirm placement against surrounding context, don't assume it always needs a column.

## 9. Accordion

```html
<!-- wp:yellowtree/accordion -->
<!-- wp:yellowtree/accordion-item {"showDescription":true} -->
<details><summary><h3 class="title">Headline Akkordeon</h3><p class="description">Beschreibung Akkordeon</p></summary><!-- wp:paragraph -->
<p>Test 1</p>
<!-- /wp:paragraph --></details>
<!-- /wp:yellowtree/accordion-item -->
<!-- /wp:yellowtree/accordion -->
```
`accordion-item` attrs: `showDescription` (bool — when `false`/absent, omit `<p class="description">`; **real export never has `showDescription:true`** — always `false` or omitted across all occurrences, so the description-line variant is showcase-only/unconfirmed). Body of `<details>` (after `</summary>`) holds arbitrary core/yellowtree blocks — including a full nested `row`/`column` (icf shows a `wp:yellowtree/row {"template":"1-1"}` with paragraph + image inside an accordion-item body). Simplest: no attrs, no description, one paragraph.

**`accordion` wrapper attr — previously completely undocumented:** `onlySingleOpen` (bool ✓, `about.txt`/`give.txt` both use `{"onlySingleOpen":true}`; `visit.txt`'s accordion has no attrs at all, confirming it's optional). Controls whether opening one item closes the others.

## 10. core embed — YouTube / Vimeo / Spotify

Exact wrapper, provider-dependent class/type:

```html
<!-- wp:embed {"url":"https://youtu.be/iEPbqbKhzB8?si=MGC7MK-bgi2vEiCP","type":"video","providerNameSlug":"youtube","responsive":true,"className":"wp-embed-aspect-16-9 wp-has-aspect-ratio"} -->
<figure class="wp-block-embed is-type-video is-provider-youtube wp-block-embed-youtube wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">
https://youtu.be/iEPbqbKhzB8?si=MGC7MK-bgi2vEiCP
</div></figure>
<!-- /wp:embed -->
```

| provider | `type` | `providerNameSlug` | `className` aspect | notes |
|---|---|---|---|---|
| YouTube | `"video"` ✓ | `"youtube"` ✓ | `wp-embed-aspect-16-9 wp-has-aspect-ratio` ✓ | confirmed `connect.txt` (plain `youtube.com/watch?v=` URL form, not just `youtu.be`) |
| Vimeo | `"video"` | `"vimeo"` | `wp-embed-aspect-16-9 wp-has-aspect-ratio` | figure class `wp-block-embed-vimeo` — showcase-only, not in `new-site` export |
| Spotify episode | `"video"` ✓ | `"spotify"` ✓ | `wp-embed-aspect-16-9 wp-has-aspect-ratio` ✓ | figure class `wp-block-embed-spotify`, confirmed `podcast.txt` |
| Spotify show | `"rich"` ✓ | `"spotify"` ✓ | `wp-embed-aspect-21-9 wp-has-aspect-ratio` ✓ | confirmed `podcast.txt` |
| Spotify artist | `"rich"` ✓ | `"spotify"` ✓ | `wp-embed-aspect-21-9 wp-has-aspect-ratio` ✓ | confirmed `podcast.txt` — same type+ratio as show, different from episode |

Figure class pattern (all providers): `wp-block-embed is-type-{type} is-provider-{provider} wp-block-embed-{provider} {className}`. URL is repeated verbatim as bare text on its own line inside `wp-block-embed__wrapper`. Optional `align`/`style.spacing.margin` on the embed attrs (seen `"align":"center"` with left/right margin preset).

## 11. core video

```html
<!-- wp:video {"id":302} --><figure class="wp-block-video"><video controls loop poster="..." src="..." playsinline></video></figure><!-- /wp:video -->
```
attrs: `id`. `<video>` always has `controls loop poster="..." src="..." playsinline` in this order.

## 12. Gravity Forms (dynamic, self-closing)

```html
<!-- wp:gravityforms/form {"formId":"2","inputPrimaryColor":"#204ce5"} /-->
```
Self-closing, no innerContent. `formId` string, `inputPrimaryColor` hex (only place a raw hex appears in these docs — form-plugin attr, not a design token, leave as-is).

## 13. connect-social family

```html
<!-- wp:yellowtree/connect-social -->
<!-- wp:yellowtree/locked-heading {"className":"text-center display-2 mb-5"} -->
<h2>Überschrift Social Media Links</h2>
<!-- /wp:yellowtree/locked-heading -->
<!-- wp:yellowtree/locked-paragraph {"placeholder":"...","className":"text-center mb-6"} -->
<p>Text Social Media Links</p>
<!-- /wp:yellowtree/locked-paragraph -->
<!-- wp:yellowtree/connect-social-links -->
<!-- wp:yellowtree/connect-social-link {"variation":"telegram","iconClass":"fa-telegram","label":"Telegram Link"} /-->
<!-- wp:yellowtree/connect-social-link {"variation":"instagram","iconClass":"fa-instagram","label":"Instagram Link"} /-->
<!-- wp:yellowtree/connect-social-link {"variation":"facebook","iconClass":"fa-facebook","label":"Facebook Link"} /-->
<!-- wp:yellowtree/connect-social-link {"variation":"youtube","iconClass":"fa-youtube","label":"Youtube Link"} /-->
<!-- /wp:yellowtree/connect-social-links -->
<!-- /wp:yellowtree/connect-social -->
```
**⚠ CORRECTION — `connect-social-links` wrapper attr.** Previously documented as `useApiUrls`; that value **never occurs** in the 14-page real export. The real, editor-confirmed attr is **`openLinksInNewTab`** (bool ✓, `home.txt` L171 `{"openLinksInNewTab":true}`) — and it's also validly omitted entirely (`connect.txt`, `visit.txt` both have a bare `connect-social-links` with no attrs). `useApiUrls` may be a genuine but unexercised attr, or a showcase-doc error — treat `openLinksInNewTab` as the confirmed real one and `useApiUrls` as unconfirmed. `connect-social-link` is self-closing: `variation` (`"telegram"|"instagram"|"facebook"|"youtube"` — all 4 confirmed real in every occurrence, always in that fixed order), `iconClass` (BARE form `fa-telegram` — never `fa-brands fa-…`), `label`. **⚠ CORRECTION (Paste-Test icf-rio 2026-07-09): `linkUrl` existiert NICHT** — Attr emittieren macht den Block im Editor invalid; die Ziel-URLs werden zentral in den Theme-/Widget-Einstellungen gepflegt, nie im Block. Zwischen den self-closing Links je eine Leerzeile. Kanal ohne eigene Variation (WhatsApp/Spotify): ungenutzten Variation-Slot umnutzen (iconClass tauschen, URL zentral setzen) oder Textlink ausserhalb des Blocks. The `connect-social` wrapper itself also takes `style.spacing.margin.{top,bottom}` (✓ real, e.g. `"var:preset|spacing|6"`/`"var:preset|spacing|10"`).

## 14. fluid-gallery

```html
<!-- wp:yellowtree/fluid-gallery -->
<div><a>Mehrdazu Button Fluide Galleie</a><!-- wp:yellowtree/fluid-gallery-image -->
<img/>
<!-- /wp:yellowtree/fluid-gallery-image -->
...
</div>
<!-- /wp:yellowtree/fluid-gallery -->
```
attrs: `linkOpensInNewTab` (optional). Structure: outer `<div>` with lead `<a>` (has `href` when link real) then 1+ `fluid-gallery-image` (bare `<img/>` or with `src`/`alt`).

## 15. hero-stage

```html
<!-- wp:yellowtree/hero-stage -->
<!-- wp:yellowtree/hero-stage-content -->
<figure><img/></figure><!-- wp:yellowtree/locked-heading {"textAlign":"center","level":1,"placeholder":"Überschrift","className":"display-1","maxLength":36} -->
<h1>Überschrift Header mit Buttons</h1>
<!-- /wp:yellowtree/locked-heading -->
<!-- /wp:yellowtree/hero-stage-content -->

<!-- wp:yellowtree/hero-stage-links {"count":3} -->
<!-- wp:yellowtree/icon-link-card {"iconClass":"fa-hands"} -->
<a>Ich bin neu hier</a>
<!-- /wp:yellowtree/icon-link-card -->
...
<!-- /wp:yellowtree/hero-stage-links -->
<!-- /wp:yellowtree/hero-stage -->
```
`hero-stage` attrs: **`hasLinks`** (bool ✓ — previously completely undocumented; `true` ✓ 4× / `false` ✓ 1×; **confirmed correlated 1:1 with whether a `hero-stage-links` child is present** — `reachbeyond.txt`'s `hasLinks:false` hero-stage has no `hero-stage-links` block at all, every `hasLinks:true` instance has one), `className` (`"is-style-startpage"` ✓ — only on the home page; every other real occurrence omits `className` entirely, meaning default style is simply "no className", not an explicit `"is-style-default"`), `style.spacing.margin.bottom` (✓ real, e.g. `visit.txt`/`give.txt` via connect-social-style margin pattern).

`hero-stage-content` attrs — **previously undocumented, real editor-confirmed**: `mediaId` (int ✓ — note the different key name from `locked-image`'s `imageId`; every hero-stage-content in the real export uses `mediaId`), `focalPoint` (`{"x":0.51,"y":0.49}` ✓, same shape as `locked-image`'s `focalPoint`). Holds `<figure><img/></figure>` + a `locked-heading` (the `<h1>` inside is confirmed to render **empty** — `<h1></h1>` — as a valid real placeholder state, e.g. `give.txt`, `visit.txt`, `reachbeyond.txt`).

`hero-stage-links` attrs: `count` (int ✓, matches number of icon-link-card children — confirmed `2` and `3`).

## 16. podcast-card

```html
<!-- wp:yellowtree/podcast-card -->
<article><h3>Headline Podcast Links</h3><p>Text Podcast Links</p><div class="inner-blocks"><!-- wp:yellowtree/podcast-links -->
<!-- wp:yellowtree/podcast-link {"variation":"spotify","linkUrl":"https://open.spotify.com/show/6MzwAwqDBEIXRnv6LZU0Cy","label":"Spotify"} -->
<a href="https://open.spotify.com/show/6MzwAwqDBEIXRnv6LZU0Cy">Spotify</a>
<!-- /wp:yellowtree/podcast-link -->
...
<!-- /wp:yellowtree/podcast-links --></div></article>
<!-- /wp:yellowtree/podcast-card -->
```
`podcast-link` variations seen: `"spotify"` ✓, `"youtube"` ✓, `"applePodcasts"` ✓ (all 3 real, `podcast.txt`/`sermons.txt`). attrs `variation`, `linkUrl`, `label`. Confirmed real: `<h3>`/`<p>` inside the `<article>` (before the `.inner-blocks` div) can both be **empty** (`sermons.txt`: `<h3>Jetzt abonnieren</h3><p></p>`) — an empty description paragraph is a valid variant. `podcast-card` itself takes no attrs beyond noise (`translatedWithWPMLTM`, §0).

## 17. vision

```html
<!-- wp:yellowtree/vision {"showPulseEffect":false} -->
<h3 class="text"></h3><ul><!-- wp:yellowtree/vision-item {"icon":"fa-eyes"} -->
<li></li>
<!-- /wp:yellowtree/vision-item -->
...
</ul>
<!-- /wp:yellowtree/vision -->
```
No wrapper `<div>` — content is `<h3 class="text">` + `<ul>` as direct siblings. `vision` attr: `showPulseEffect` (bool). `vision-item` attr: `icon` (fa-class string), content `<li>text or empty</li>`.

## 18. Dynamic / plugin blocks — self-closing, no manual content

These are server-rendered widgets. Copy attrs 1:1 if the source has an equivalent id/uuid; otherwise self-close bare.

```html
<!-- wp:yellowtree/services-list {"serviceWidgetUuid":"a260c153-88c8-4fe5-bad5-b4944d9df8fb"} /-->
<!-- wp:yellowtree/event-head /-->
<!-- wp:yellowtree/event-image-gallery /-->
<!-- wp:yellowtree/events-list /-->
<!-- wp:yellowtree/events-list {"eventsWidgetUuid":"728ea7f6-1a53-4cd4-b4c2-cf50efdf85ba"} /-->
<!-- wp:yellowtree/events-list {"eventsWidgetUuid":"915913c5-6073-40f8-b15b-468299186b6d"} /-->
<!-- wp:yellowtree/featured-events /-->
<!-- wp:yellowtree/sermon-head /-->
<!-- wp:yellowtree/sermon-recommendations /-->
<!-- wp:yellowtree/sermons-list {"sermonWidgetUuid":"44faf0fa-2f3b-4030-8ede-e15d693f04ba"} /-->
<!-- wp:yellowtree/post-list /-->
<!-- wp:yellowtree/newsticker /-->
<!-- wp:yellowtree/footer /-->
```
Each always sits inside its own `row{template:"1"}` > `column` in every observed occurrence — ✓ confirmed for `services-list` (`visit.txt`), `events-list` (`events.txt`), `featured-events` (`events.txt`), `sermons-list` (`sermons.txt`), `post-list` (`blog.txt`). Each dynamic-list block has its **own** uuid attr name, confirmed real and distinct: `services-list` → `serviceWidgetUuid`, `events-list` → `eventsWidgetUuid`, `sermons-list` → `sermonWidgetUuid`. Don't cross-wire them (e.g. never put `eventsWidgetUuid` on `sermons-list`).

**Not editor-confirmed at all — zero occurrences across all 14 real pages**: `event-head`, `event-image-gallery`, `sermon-head`, `sermon-recommendations`, `newsticker`, `footer`. These are presumably single-post-type templates (an individual event/sermon detail template) or a global template part (`footer`) that wouldn't appear in ordinary page content — plausible but unverified by this export. `featured-events` and plain `events-list`/`sermons-list` (no uuid) are confirmed self-closing bare per the showcase.

## 19. Doc-only / test blocks — DO NOT emit in migrated output

`yellowtree/test-html` and `yellowtree/sample-placeholder` appear only in the example/showcase docs to hold raw demo HTML (typography scale table, color swatches, text-arrow/text-icon link markup, badges) or empty grid placeholders. They are registered blocks but are not real migration targets — if old-site source needs a raw-HTML escape hatch not covered by any other block, flag it for human review rather than emitting `test-html`.

## 20. Colors — token note only, never hardcode

Color examples (`Beispielseite-Colors.txt`) live entirely inside `yellowtree/test-html` demo markup using Bootstrap-style utility classes: `bg-black`, `bg-dark-0..4`, `bg-white`, `bg-light-0..4`, `bg-primary`, `bg-primary2`, `bg-trend1`, `bg-trend2`, `bg-trend3`, `text-white`, `text-dark-0`, and CSS var `--bs-{name}-active` for dark/pressed states. These remain NOT exposed as generic block color attributes for most yellowtree blocks. **⚠ CORRECTION — this is no longer true for `core/paragraph`.** Real editor-confirmed usage (`imprint.txt`) shows `core/paragraph` DOES accept a theme-palette color via `textColor` + a matching link-color style — see §2 above. Updated table of confirmed color-token attrs:

| block | attr | values seen |
|---|---|---|
| `button-link` | `backgroundColor` | `"primary"` ✓, `"primary2"` ✓ |
| `card` | `tagColor` | `"primary"` ✓, `"white"` ✓ |
| `testimonial-card` | `backgroundColor` | `"primary"`, `"trend1"` ✓, `"trend2"` ✓, `"trend3"` ✓ |
| `image-card` | `tagColor` | showcase-only — not observed in real export (real `image-card` only sets `tags`+`showTags`, no explicit color) |
| `paragraph` (core) | `textColor` + `style.elements.link.color.text` | `"trend3"` ✓ — **new, previously undocumented**; theme palette slug, generalizes beyond this one observed value |

No row-level, section-level, or column-level background-color/background-image attribute exists anywhere in the real export or the showcase docs. **Section backgrounds/parallax remain unsupported at the row/column level** — the only real targets for "old-site section had a background" are: `image-section-card` (full-bleed bg image + overlaid text, showcase-only/unconfirmed by real data, §7), `text-card.transparentBackground`, `testimonial-card.backgroundColor`, `card.tagColor`, or the new `paragraph.textColor`. A solid-color or parallax-image section background from Avia has no 1:1 target — keep the manifest TODO policy in SKILL.md.

Never emit raw hex except where the source system requires it verbatim (e.g. `gravityforms/form.inputPrimaryColor`, an Avia `custom_bg`/`custom_font` hex that has no token equivalent — flag those for human review rather than silently dropping or converting).
