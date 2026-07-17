# Prophet 01 — Asset Provenance

**Reviewed:** 16 July 2026

## Asset policy

The experience intentionally uses no stock photography, company logos, copied scientific figures, remote fonts, analytics, trackers or third-party embeds. All visual forms are original HTML, CSS, Canvas and inline SVG created for this edition. Scientific facts are cited through the claim/source ledger; visual atmosphere never encodes an unreported dose, concentration, prevalence or risk estimate.

| Asset | Origin | License / attribution | Public-use decision |
|---|---|---|---|
| Particle atmosphere | Original seeded `CanvasRenderingContext2D` code in `js/atmosphere.js` | Project-authored | Used as deterministic ambient illustration. Particle count and motion are decorative, not data. |
| Human boundary and route diagrams | Original CSS and inline SVG in `index.html` / `css/story.css` | Project-authored | Used with continuous “illustrative · not to scale” labels and text equivalents. |
| Method prism, evidence ladder, risk matrix, opportunity stack and thesis diff | Original semantic HTML/CSS/SVG | Project-authored | Used as accessible instruments. No publisher chart or table has been copied. |
| Interface icons and marks | Original CSS shapes and typographic symbols | Project-authored | No icon library required. Symbols are paired with text labels. |
| Typography | System font stacks: `Inter`-like UI fallback via `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Arial`; monospace via `SFMono-Regular`, `Consolas`, `Liberation Mono` | Installed on the viewer's device | No font files, network request or font license bundled. |
| Data payload | Hand-reviewed canonical JSON in `data/` | Project research artifact | Contains bibliographic facts, paraphrased claims and original investment inference; no proprietary dataset is republished. |
| D3 | Existing repository file `dashboard/vendor/d3.v7.min.js` | Not loaded by this edition | Kept out of the payload because native SVG/DOM was sufficient. |

## Source-content handling

- ISO catalog scope is paraphrased from the official landing page. No standard text, figure or table is reproduced.
- Peer-reviewed article findings are paraphrased and linked by DOI. No publisher figure is copied or adapted.
- The Weinstein plasma-exchange article is open access under CC BY-NC-ND; only factual, independently redrawn text summaries are used, not its figures or tables.
- Federal Register, EPA, ARPA-H, NIST, NIEHS, California and EU facts are rendered in original interface components with direct citations. Agency marks and logos are not used, and no endorsement is implied.
- WHO is used only for historical framework and its 2021 evidence cutoff is disclosed. No report image is bundled.
- No named-company claim, logo, financing fact or product-performance number appears in the public experience.

## Generated or illustrative elements

The following are explicitly labeled wherever shown:

- particle paths and human silhouette: illustrative, not to scale;
- method profiles: capability comparison, not a performance ranking;
- risk matrix cells: evidence availability, not estimated risk;
- evidence ladder: categorical stopping point, not a certainty score;
- capital/adoption horizon: Delphi qualitative posture, not a forecast;
- thesis review flow: governance illustration, not an automated publishing claim.

## External network behavior

The page makes no automatic external request. External evidence URLs open only after an explicit user action. All CSS, JavaScript and canonical data are local. The static HTML retains the full thesis and essential citations if JavaScript is unavailable.

## Refinement pass note (2026-07-16, second review)

The elevation and editorial-audit pass introduced no new visual, image or font asset. The edition still uses only original local HTML, CSS, Canvas and inline SVG plus the viewer's system font stacks, and still bundles no image or font file and issues no automatic external request. The only additions were a deterministic Node audit script (`scripts/check-editorial-language.mjs`) and documentation; the sole visual change hid an existing decorative caption on mobile. `dashboard/vendor/d3.v7.min.js` remains unloaded.
