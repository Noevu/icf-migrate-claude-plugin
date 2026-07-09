# ICF → Yellowtree Migration (Claude Code Plugin)

🇩🇪 Deutsch (unten) · 🇬🇧 [English version](#english)

Migriere eine alte ICF-WordPress-Site (Enfold-Theme, Avia-Shortcodes) auf das neue **Yellowtree**-Block-Theme — halbautomatisch, mit Claude Code für Konvertierung und Validierung.

Entstanden bei der Migration der ICF Rio de Janeiro; funktioniert für jede ICF-Site auf der icf.church-Multisite (und generell für Enfold→Yellowtree).

## Was du bekommst

Der Ablauf: **Exportieren → Analysieren & Entscheiden → Bauen → Veröffentlichen.**

| Phase | Command | Was passiert |
|---|---|---|
| 1. Export | `/yellowtree-setup` | Führt durch den WordPress-Export und splittet ihn in Einzelseiten-Dateien (die Yellowtree-Zielsyntax bringt das Plugin mit) |
| 2. Entscheiden | `/yellowtree-analyze` | Scannt deine Seiten und stellt DIR die Site-weiten Fragen (Migrationsmodus, Hintergründe, Social-Icons, Formulare, Seiten-Auswahl, Slugs…) BEVOR gebaut wird — Antworten landen in `migration-decisions.md` |
| 3. Bauen | `/yellowtree-migrate-all` | Konvertiert alle Seiten gemäss deinen Entscheiden und validiert jede Seite; `/yellowtree-media` lädt alle Original-Bilder herunter |
| 4. Veröffentlichen | `/yellowtree-publish` | Schritt für Schritt: Medien-Upload, Seiten anlegen (Editor-Paste oder REST), URL-Rewrite, Widgets, Redirects |

Dazu: der `yellowtree-migrate`-Skill (das Konvertierungs-Hirn, aktiviert sich automatisch), die editor-verifizierte Block-Referenz und ein deterministischer Validator (balancierte Blöcke, gültige Attribute, keine Inline-Styles, keine übriggebliebenen Shortcodes).

## Voraussetzungen

- [Claude Code](https://claude.com/claude-code)
- Node.js 18+ (für die Scripts; keine npm-Pakete nötig)
- Site-Admin-Zugang zur alten ICF-WordPress-Site

## Installation

```bash
claude plugin marketplace add noevu/icf-migrate-claude-plugin
claude plugin install icf-yellowtree-migration
```

## Schnellstart

```bash
mkdir meine-icf-migration && cd meine-icf-migration
claude
```

Dann in Claude Code:

1. `/yellowtree-setup` — den Schritten folgen (XML aus wp-admin → Werkzeuge → Daten exportieren, Datei in den Ordner legen)
2. `/yellowtree-analyze` — eine Handvoll einmaliger Fragen beantworten (Modus 1:1 oder Redesign, Hintergründe, Social-Icons, Formulare, welche Seiten live gehen, Slugs)
3. `/yellowtree-migrate-all` — konvertiert alles gemäss deinen Antworten; pro Seite entsteht:
   - `output/<slug>.blocks.html` — Yellowtree-Block-Markup, validator-clean
   - `output/<slug>.manifest.md` — Bilder zum Re-Upload, Links zum Umschreiben, offene Content-Lücken
   - `/yellowtree-media` lädt alle Originale nach `media/originals/`
4. `/yellowtree-publish` — geführtes Go-live: Medien-Upload, Seiten anlegen (Editor-Paste oder REST), URL-Rewrite, Widgets, Redirects.

## Was konvertiert wird

Sections, Spalten (alle Avia-Layouts → Yellowtree-Rows/Grids), Textblöcke, Überschriften (inkl. Zentrierung), Bilder (einfach + verlinkt), Buttons (inkl. New-Tab), YouTube/Vimeo/Spotify-Embeds, Produkt-Boxen (→ text-image oder Cards), Akkordeons, Galerien, Anker. Unbekannte Shortcodes werden zu klar markierten TODO-Fallbacks — nichts fällt stillschweigend weg.

## Was weiterhin Menschen brauchen

Das `manifest.md` jeder Seite listet die Site-spezifischen Entscheide. Die wiederkehrenden:

- **Section-Hintergründe** (Farben, Parallax-Bilder) — Yellowtree-Rows haben keine Hintergrund-Option; das Plugin macht daraus Vollbreite-Bilder und flaggt jeden Fall
- **Dritt-Formulare** (Elvanto etc.) — Yellowtree-Sites nutzen Gravity Forms; nachbauen oder verlinken
- **Custom Post Types** (Celebrations, Events) — werden meist durch Yellowtrees dynamische Widgets ersetzt (events-list, sermons-list) statt migriert
- **Medien-Rewrite** — nach dem Upload der Originale in die neue Mediathek müssen die Bild-URLs in den konvertierten Seiten umgeschrieben werden (Claude fragen, sobald der Import steht)
- **Rechtstexte** — Impressum/Datenschutz werden landesrechtlich angepasst, ersetzen aber keine juristische Prüfung

## Warum es korrekt bleibt

Die Block-Referenz (`skills/yellowtree-migrate/reference/blocks.md`) wurde aus den Yellowtree-Doku-Seiten gebaut **und gegen einen echten WXR-Export einer editor-erstellten Yellowtree-Site verifiziert** (~1100 Block-Vorkommen). Claude erfindet nie Block-Syntax — alles, was nicht in der Referenz steht, wird zum geflaggten Fallback. Jede konvertierte Seite muss den deterministischen Validator bestehen, bevor sie als fertig gemeldet wird.

## Beispiele

`examples/` enthält die strukturelle Ground Truth, an der dieses Plugin kalibriert wurde: ein WXR-Export einer frischen Yellowtree-Template-Site (`new-site-template-export.xml`) und das extrahierte Markup pro Template-Seite (`template-pages/`). Als Referenz dafür, wie echte editor-gespeicherte Yellowtree-Blöcke aussehen — der Export deiner eigenen Site (siehe `/yellowtree-setup`) hat im Zweifel Vorrang.

## Lizenz

MIT — gebaut von [Noevu](https://noevu.ch) für die Migration der ICF Rio de Janeiro.

---

<a name="english"></a>

# English

🇩🇪 [Deutsche Version (oben)](#icf--yellowtree-migration-claude-code-plugin)

Migrate an old ICF WordPress site (Enfold theme, Avia shortcodes) to the new **Yellowtree** block theme — semi-automatically, with Claude Code doing the conversion and validation.

Built for the ICF Rio de Janeiro migration; works for any ICF site on the icf.church multisite (or any Enfold→Yellowtree move).

## What you get

The flow: **export → analyze & decide → build → publish.**

| Phase | Command | What it does |
|---|---|---|
| 1. Export | `/yellowtree-setup` | Guides the WordPress export, splits it into per-page files (the Yellowtree target syntax ships with the plugin) |
| 2. Decide | `/yellowtree-analyze` | Scans your pages, asks YOU the site-wide questions (migration mode, backgrounds, social icons, forms, page scope, slugs…) BEFORE anything is built — answers saved to `migration-decisions.md` |
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
2. `/yellowtree-analyze` — answer a handful of one-time questions (1:1 vs. redesign mode, backgrounds, social icons, forms, which pages go live, slugs)
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
- **Legal pages** — imprint/privacy get adapted to local law but never replace a legal review

## How it stays correct

The block reference (`skills/yellowtree-migrate/reference/blocks.md`) was built from the Yellowtree vendor docs **and cross-verified against a real WXR export of an editor-authored Yellowtree site** (~1100 block occurrences). Claude never invents block syntax — anything not in the reference becomes a flagged fallback. Every converted page must pass the deterministic validator before it's reported as done.

## Examples

`examples/` ships the structural ground truth this plugin was calibrated against: a WXR export of a fresh Yellowtree template site (`new-site-template-export.xml`) and the extracted per-page template markup (`template-pages/`). Use them as reference for what real editor-saved Yellowtree blocks look like — your own site's export (see `/yellowtree-setup`) always wins where they differ.

## License

MIT — built by [Noevu](https://noevu.ch) for the ICF Rio de Janeiro migration.
