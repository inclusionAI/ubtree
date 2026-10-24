# UBTree project page

Project page for **UBTree: Parallel Tree Drafting via Unigram and Bigram Models for Speculative Decoding** ([arXiv:2609.39972](https://arxiv.org/abs/2609.39972)).

The site is plain HTML/CSS/JS with no build step, served by GitHub Pages from the `main` branch root.

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Layout

```
index.html            page content and all prose
static/css/style.css  design tokens (light/dark) and components
static/js/data.js     every number shown in charts and tables
static/js/main.js     draft-tree walkthrough, charts, tabs, copy buttons
static/img/           figures (rendered from the paper PDFs) and logo
static/video/         demo clips go here
```

## Remaining placeholder: video demo

All text on the page is release-ready. The only unfinished part is the video demo in section 01 (`data-ph="video-demo"` in `index.html`):

1. Put the clips in `static/video/` (e.g. `ar.mp4` and `ubtree.mp4`, H.264, muted, ≤ 10 MB each).
2. In each `.video-slot`, delete the `.vs-empty` block and uncomment the `<video>` tag.
3. Uncomment the caption below the videos and fill in the model, hardware, prompt and measured tokens/s.

For a single side-by-side clip, delete one slot and drop the `video-grid` class.

## Later additions

- **Code link:** when the training code is public, add a button next to "SGLang" in the hero `.links` block, using the same `<a class="btn">` markup.
- **More checkpoints or engines:** add a tab in the Quick start section. Copy an existing `.tab` button and its `.tabpanel`.

## Updating numbers

Every chart and table reads from `static/js/data.js`. Each benchmark row stores `[speedup, τ]` pairs in `benchmarks` order. Change a number there and the chart, table, and "best" highlighting all update. The hero stat strip and the short "takeaway" bullets are hand-written in `index.html`, so update those by hand.

Sources:
- Tables 1–3, the ablations, and the latency and long-context appendix tables come from the preprint.
- The "Released checkpoints" table comes from the Hugging Face model cards.

## Design notes

- The colors are CSS custom properties at the top of `style.css`, with separate light and dark sets. The theme toggle stores the choice in `localStorage`.
- Chart colors are validated for color-vision deficiency: UBTree is spruce green, DSpark blue, DFlash orange. Bar charts show UBTree in green and every baseline in neutral gray.
- Fonts: IBM Plex Sans (headings and body) and IBM Plex Mono (code), both from Google Fonts. Math is rendered with KaTeX from cdnjs.
