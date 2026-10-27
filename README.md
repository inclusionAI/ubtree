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
static/video/         Ling3 Tiny and Flash comparison videos
```

## Demo videos

Section 01 contains two full-width, vertically stacked videos: `static/video/ling3-tiny.mp4` and `static/video/ling3-flash.mp4`. Each contains AR, DFlash, DSpark and UBTree for the same target model. They autoplay muted and loop, with native playback and fullscreen controls.

The H.264 videos preserve every source GIF frame and its duration, including the final hold, at 1440×760 / 20 FPS. Both use the same 0.25× presentation speed; the seconds shown inside them remain the original request timestamps. The examples use the unchanged HumanEval `anti_shuffle` (Tiny) and `bf` (Flash) prompts. These are selected real SSE captures with complete four-method output token equality, not aggregate benchmark results.

Source GIFs: `web/ubtree/assets/ling3-tiny-humaneval-045.gif` and `ling3-flash-humaneval-012.gif` in the FlashFlow repository, branch `codex/ubtree-promo-qwen3-4b`, commit `644c2bb`. Full timing and selection provenance remain in that repository's `web/ubtree/REAL_BENCHMARK_SHOWCASES.md` and `data/ling-real-benchmark-playback.json`.

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
