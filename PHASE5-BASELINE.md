# Phase 5 Baseline — Performance & Accessibility

Date: 2026-11-24
Git checkpoint: `e5c984f` (`Recruiter phase 4: prioritize projects and navigation`)

This is the pre-optimization baseline. All file sizes and image conversion comparisons below were measured from the original working assets before any project code or asset optimization. Conversion candidate sizes were measured in memory; no source assets were changed to produce the baseline.

## Measurement limits

- Browser-based Lighthouse, Network waterfall, runtime LCP/CLS, interaction latency, `srcset` source selection, and console checks were not available through the permitted browser environment. These are **NOT TESTED** and must be measured after implementation with Chrome DevTools.
- No CrUX/PageSpeed field data was collected. No field Core Web Vitals claim is made.
- Asset byte counts are local file sizes. Runtime transfer may differ by browser cache and hosting compression.

## Source and initial image baseline

| Item | Baseline |
|---|---:|
| `index.html` | 101,331 bytes |
| `style.css` | 78,710 bytes |
| `script.js` | 42,255 bytes |
| Local assets | 54 files, 20,898,897 bytes (includes linked PDFs and deferred gallery media) |
| Hero `assets/profile.jpg` | 2,073,187 bytes; 1086 × 1448 px; loaded eager |
| Referenced gallery PNGs | 17 files; 4,979,340 bytes combined |
| Referenced gallery JPEGs | 24 files; 7,478,806 bytes combined |

The profile image is the largest image in the initial HTML. Its CSS card has a maximum width of 350 px. Gallery images are created when detail modals open and currently use `loading="lazy"`.

## In-memory format comparison

| Candidate | Source | Candidate size | Reduction |
|---|---:|---:|---:|
| Full-size WebP q88 | Profile JPEG, 1086 × 1448 | 83,286 bytes | 96.0% |
| Full-size AVIF q65 | Profile JPEG, 1086 × 1448 | 41,017 bytes | 98.0% |
| Responsive WebP q88, 480 × 640 | Profile JPEG | 19,172 bytes | 99.1% |
| Responsive WebP q88, 800 × 1067 | Profile JPEG | 48,474 bytes | 97.7% |
| Lossless WebP | 17 referenced gallery PNGs, same pixel dimensions | 436,574 bytes combined | 91.2% |
| WebP q95 | All 24 referenced gallery JPEGs, full resolution | 7,506,732 bytes combined | -0.4% (larger) |
| WebP q95 | Three 2048 px NYC dashboard JPEGs | 566,062 bytes combined | 32.9% |

The gallery PNG conversion is lossless at identical pixel dimensions. The JPEG aggregate does not justify blanket conversion. The three NYC dashboard images are individual candidates because their q95 WebP variants are materially smaller; they require visual review for labels and axis text before adoption.

## Initial token contrast calculation

Calculated from opaque CSS token values in sRGB, before checking every rendered overlay/state:

| Text token | Canvas `#07090e` | Surface `#0d131f` | Elevated `#131c2e` |
|---|---:|---:|---:|
| `--text-primary` `#f8fafc` | 19.03:1 | — | — |
| `--text-secondary` `#cbd5e1` | 13.41:1 | 12.52:1 | — |
| `--text-muted` `#94a3b8` | 7.77:1 | 7.25:1 | — |
| `--text-faint` `#64748b` | 4.18:1 | 3.91:1 | 3.58:1 |
| `--accent-primary` `#38bdf8` | 9.30:1 | 8.67:1 | 7.95:1 |

`--text-faint` appears in CSS at 12–14 px in several contexts and is a contrast remediation candidate. Final WCAG assessment must use actual computed foreground/background combinations, including alpha overlays and interactive states.
