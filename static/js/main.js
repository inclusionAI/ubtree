/* UBTree project page — interactions, draft-tree walkthrough, charts.
   Data comes from static/js/data.js (window.UBTREE_DATA). No dependencies besides KaTeX. */
(function () {
  "use strict";
  const D = window.UBTREE_DATA;
  const SVGNS = "http://www.w3.org/2000/svg";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  function el(tag, attrs = {}, parent) {
    const n = document.createElementNS(SVGNS, tag);
    for (const k in attrs) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "style") Object.assign(n.style, attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(n);
    return n;
  }
  function h(tag, props = {}, children = []) {
    const n = document.createElement(tag);
    for (const k in props) {
      if (k === "class") n.className = props[k];
      else if (k === "text") n.textContent = props[k];
      else if (k === "style") Object.assign(n.style, props[k]);
      else n.setAttribute(k, props[k]);
    }
    for (const c of [].concat(children)) if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    return n;
  }
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  function niceTicks(max, count = 5) {
    const raw = max / count;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) || 10 * mag;
    const top = Math.ceil(max / step) * step;
    const ticks = [];
    for (let v = 0; v <= top + 1e-9; v += step) ticks.push(+v.toFixed(6));
    return { ticks, top };
  }
  const fmtK = (v) => (v >= 1000 ? (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + "K" : String(v));
  const methodLabel = (r) => r.method + (r.paper ? "†" : "") + (r.budget ? ` (${r.budget})` : "");

  // Rounded-end horizontal bar: square at baseline, 4px radius at the data end.
  function hbarPath(x0, y, w, hgt, r = 4) {
    r = Math.min(r, w, hgt / 2);
    if (w <= 0) return "";
    return `M${x0},${y} H${x0 + w - r} Q${x0 + w},${y} ${x0 + w},${y + r} V${y + hgt - r} Q${x0 + w},${y + hgt} ${x0 + w - r},${y + hgt} H${x0} Z`;
  }

  // ---------- tooltip ----------
  const tip = $("#tooltip");
  function showTip(evt, header, rows) {
    tip.replaceChildren();
    tip.appendChild(h("div", { class: "tt-h", text: header }));
    rows.forEach((r) => {
      const key = h("i", { style: { borderTopColor: r.color || "transparent", borderTopStyle: r.dash ? "dashed" : "solid" } });
      tip.appendChild(h("div", { class: "tt-r" }, [key, h("b", { text: r.value }), h("span", { text: r.label })]));
    });
    tip.classList.add("show");
    moveTip(evt);
  }
  function moveTip(evt) {
    const pad = 14;
    let x, y;
    if (evt && evt.clientX != null && evt.type !== "focus") { x = evt.clientX; y = evt.clientY; }
    else if (evt && evt.target && evt.target.getBoundingClientRect) {
      const b = evt.target.getBoundingClientRect(); x = b.right; y = b.top;
    } else return;
    const w = tip.offsetWidth, ht = tip.offsetHeight;
    let left = x + pad, top = y - ht - pad;
    if (left + w > window.innerWidth - 8) left = x - w - pad;
    if (top < 8) top = y + pad;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }
  const hideTip = () => tip.classList.remove("show");
  window.addEventListener("scroll", hideTip, { passive: true });

  // ---------- theme ----------
  const rerenders = [];
  $("#theme-toggle").addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme ? root.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = isDark ? "light" : "dark";
    try { localStorage.setItem("ubtree-theme", root.dataset.theme); } catch (e) {}
    rerenders.forEach((f) => f());
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => rerenders.forEach((f) => f()));

  // ---------- top bar + scroll spy ----------
  const topbar = $("#topbar");
  const navLinks = $$(".nav a");
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  function onScroll() {
    topbar.classList.toggle("scrolled", window.scrollY > 8);
    let cur = null;
    for (const s of sections) if (s.getBoundingClientRect().top < 120) cur = s.id;
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- reveal on scroll ----------
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach((n) => io.observe(n));
  } else $$(".reveal").forEach((n) => n.classList.add("in"));

  // ---------- tabs ----------
  const tabs = $$(".tab");
  function selectTab(t) {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute("aria-selected", on);
      x.tabIndex = on ? 0 : -1;
      $("#" + x.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      selectTab(n); n.focus();
    });
  });

  // ---------- copy buttons ----------
  $$(".copy").forEach((b) => b.addEventListener("click", async () => {
    const text = b.closest(".code").querySelector("pre").innerText;
    try { await navigator.clipboard.writeText(text); b.textContent = "Copied"; b.classList.add("ok"); }
    catch (e) { b.textContent = "Select & copy"; }
    setTimeout(() => { b.textContent = "Copy"; b.classList.remove("ok"); }, 1600);
  }));

  // ---------- lightbox ----------
  const lb = $("#lightbox");
  $$("img[data-zoom]").forEach((img) => img.addEventListener("click", () => {
    lb.querySelector("img").src = img.src; lb.querySelector("img").alt = img.alt;
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
  }));
  lb.addEventListener("click", () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") lb.click(); });

  // ---------- KaTeX ----------
  // Falls back to native MathML when the KaTeX stylesheet is blocked (e.g. strict CSP previews).
  function katexCssLoaded() {
    const probe = h("span", { class: "katex" }, [h("span", { class: "katex-mathml" })]);
    document.body.appendChild(probe);
    const ok = getComputedStyle(probe.firstChild).position === "absolute";
    probe.remove();
    return ok;
  }
  function renderMath() {
    if (!window.katex) return;
    const output = katexCssLoaded() ? "htmlAndMathml" : "mathml";
    $$("[data-tex]").forEach((n) => {
      try { katex.render(n.dataset.tex, n, { displayMode: true, throwOnError: false, output }); } catch (e) {}
    });
  }
  if (window.katex) renderMath(); else window.addEventListener("load", renderMath);

  // =====================================================================
  // Draft-tree walkthrough (hero)
  // =====================================================================
  (function initTree() {
    const svg = $("#tc-svg");
    if (!svg) return;
    const COLS = [
      [{ t: "Speculative" }],
      [{ t: "decoding", p: 0.82 }, { t: "drafting", p: 0.09 }, { t: "sampling", p: 0.04 }],
      [{ t: "is", p: 0.46 }, { t: "makes", p: 0.31 }, { t: "keeps", p: 0.12 }],
      [{ t: "fast", p: 0.38 }, { t: "lossless", p: 0.33 }, { t: "sense", p: 0.14 }],
      [{ t: "and", p: 0.52 }, { t: ",", p: 0.27 }, { t: ".", p: 0.11 }]
    ];
    // Kept tree edges [depth, fromRow, toRow]; every kept node has exactly one parent.
    const TREE = [[1, 0, 0], [1, 0, 1], [2, 0, 0], [2, 0, 1], [3, 0, 0], [3, 0, 1], [3, 1, 2], [4, 0, 1], [4, 1, 0], [4, 2, 2]];
    const ACCEPT_TREE = [0, 0, 1, 0];        // rows at depth 1..4 → "decoding is lossless and"
    const CHAIN = [0, 0, 0, 0];              // single path = top-1 per position → "decoding is fast and"
    const X = [64, 196, 328, 460, 592], Y = [70, 146, 222], NW = 96, NH = 36;
    const rowY = (d, r) => (d === 0 ? Y[1] : Y[r]);

    const MODES = {
      tree: {
        steps: [
          ["Propose", "Unigram proposer"],
          ["Score", "Bigram selector"],
          ["Build", "Tree under budget"],
          ["Verify", "One target pass"]
        ],
        text: [
          "The proposer predicts top-K candidates for all four positions in a single forward pass.",
          "The selector scores every adjacent candidate pair (K + (γ−1)K² edges) in one batched matmul.",
          "A depth-wise beam plus global pruning keeps the best B = 10 nodes, with no further neural computation.",
          "The target verifies all branches at once. The accepted branch takes the #2 candidate at position 3."
        ]
      },
      single: {
        steps: [
          ["Propose", "Same proposer"],
          ["Top-1", "One token per slot"],
          ["Verify", "One target pass"]
        ],
        text: [
          "A single-path drafter sees the same candidates…",
          "…but sends only the top-1 token at each position, so only one path is verified.",
          "The target wanted “lossless”, not “fast”, so everything after position 2 is thrown away."
        ]
      }
    };

    let mode = "tree", step = -1, timer = null;
    const nodes = {}, edges = {};

    function build() {
      svg.replaceChildren();
      const gE = el("g", {}, svg), gN = el("g", {}, svg), gL = el("g", {}, svg);
      for (let d = 1; d < COLS.length; d++) {
        COLS[d - 1].forEach((_, a) => COLS[d].forEach((__, b) => {
          const x1 = X[d - 1] + NW / 2, y1 = rowY(d - 1, a), x2 = X[d] - NW / 2, y2 = rowY(d, b), mx = (x1 + x2) / 2;
          edges[`${d}-${a}-${b}`] = el("path", { class: "tc-edge", d: `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}` }, gE);
        }));
      }
      COLS.forEach((col, d) => col.forEach((n, r) => {
        const g = el("g", { class: "tc-node", transform: `translate(${X[d] - NW / 2},${rowY(d, r) - NH / 2})` }, gN);
        const rect = el("rect", { width: NW, height: NH, rx: 8 }, g);
        const tx = el("text", { x: n.p != null ? 10 : NW / 2, y: NH / 2 + 4.5, "font-size": 14, "text-anchor": n.p != null ? "start" : "middle", text: n.t }, g);
        let pt = null, bar = null;
        if (n.p != null) {
          pt = el("text", { x: NW - 8, y: NH / 2 + 4, "font-size": 10.5, "text-anchor": "end", text: n.p.toFixed(2).replace(/^0/, ""), style: { fontVariantNumeric: "tabular-nums" } }, g);
          bar = el("rect", { x: 8, y: NH - 6, height: 2.5, rx: 1.25, width: Math.max(3, (NW - 16) * n.p) }, g);
        }
        nodes[`${d}-${r}`] = { g, rect, tx, pt, bar, d, r };
      }));
      X.forEach((x, d) => el("text", { x, y: 296, "text-anchor": "middle", "font-size": 13, style: { fill: css("--muted"), fontFamily: "var(--f-mono)" }, text: d === 0 ? "anchor" : `pos ${d}` }, gL));
      el("text", { x: 4, y: 322, "font-size": 12, style: { fill: css("--muted") }, text: "Illustrative example · K = 3 shown per position" }, gL);
    }

    function styleNode(n, s) {
      const c = {
        hidden: { o: 0, fill: "--surface-2", stroke: "--line-strong", txt: "--ink", bar: "--muted" },
        anchor: { o: 1, fill: "--ink", stroke: "--ink", txt: "--paper", w: 600 },
        cand: { o: 1, fill: "--surface-2", stroke: "--line-strong", txt: "--ink", bar: "--muted" },
        faint: { o: 0.4, fill: "--surface-2", stroke: "--line", txt: "--muted", bar: "--muted" },
        kept: { o: 1, fill: "--spruce-soft", stroke: "--spruce", txt: "--ink", bar: "--spruce" },
        acc: { o: 1, fill: "--amber-soft", stroke: "--amber", txt: "--ink", w: 600, sw: 2, bar: "--amber" },
        rej: { o: 0.9, fill: "--surface", stroke: "--line-strong", txt: "--ink-2", dash: "4 3", bar: "--line-strong" }
      }[s];
      n.g.style.opacity = c.o;
      if (!c.fill) return;
      n.rect.style.fill = css(c.fill); n.rect.style.stroke = css(c.stroke);
      n.rect.style.strokeWidth = c.sw || 1.2; n.rect.style.strokeDasharray = c.dash || "none";
      n.tx.style.fill = css(c.txt); n.tx.style.fontWeight = c.w || 400;
      if (n.pt) n.pt.style.fill = css(s === "acc" ? "--amber" : "--muted");
      if (n.bar) n.bar.style.fill = css(c.bar);
    }
    function styleEdge(e, s) {
      const c = {
        hidden: { o: 0, stroke: "--line-strong", w: 1 },
        faint: { o: 0.55, stroke: "--line-strong", w: 1, dash: "3 3" },
        kept: { o: 1, stroke: "--spruce", w: 1.8 },
        dim: { o: 0.45, stroke: "--line-strong", w: 1.5, dash: "4 3" },
        acc: { o: 1, stroke: "--amber", w: 3.2 },
        rej: { o: 0.9, stroke: "--line-strong", w: 1.6, dash: "4 3" }
      }[s];
      e.style.opacity = c.o;
      if (c.stroke) { e.style.stroke = css(c.stroke); e.style.strokeWidth = c.w; e.style.strokeDasharray = c.dash || "none"; }
    }

    function render() {
      const M = MODES[mode];
      const last = M.steps.length - 1;
      Object.values(nodes).forEach((n) => styleNode(n, n.d === 0 ? "anchor" : step < 0 ? "hidden" : "cand"));
      Object.values(edges).forEach((e) => styleEdge(e, "hidden"));
      let tau = "";

      if (mode === "tree" && step >= 0) {
        const keptNodes = new Set(TREE.map(([d, , b]) => `${d}-${b}`));
        if (step >= 1) for (const k in edges) styleEdge(edges[k], "faint");
        if (step >= 2) {
          for (const k in edges) styleEdge(edges[k], "hidden");
          TREE.forEach(([d, a, b]) => styleEdge(edges[`${d}-${a}-${b}`], "kept"));
          Object.values(nodes).forEach((n) => { if (n.d > 0) styleNode(n, keptNodes.has(`${n.d}-${n.r}`) ? "kept" : "faint"); });
        }
        if (step >= 3) {
          TREE.forEach(([d, a, b]) => styleEdge(edges[`${d}-${a}-${b}`], "dim"));
          Object.values(nodes).forEach((n) => { if (n.d > 0) styleNode(n, keptNodes.has(`${n.d}-${n.r}`) ? "rej" : "faint"); });
          let prev = 0;
          ACCEPT_TREE.forEach((r, i) => {
            styleEdge(edges[`${i + 1}-${prev}-${r}`], "acc");
            styleNode(nodes[`${i + 1}-${r}`], "acc");
            prev = r;
          });
          tau = "accepted 4 + bonus “fast” → τ = <b>5</b>";
        }
      }
      if (mode === "single" && step >= 0) {
        Object.values(nodes).forEach((n) => { if (n.d > 0) styleNode(n, n.r === 0 ? "cand" : "faint"); });
        if (step >= 1) {
          CHAIN.forEach((r, i) => styleEdge(edges[`${i + 1}-${i === 0 ? 0 : CHAIN[i - 1]}-${r}`], "kept"));
          Object.values(nodes).forEach((n) => { if (n.d > 0 && n.r === 0) styleNode(n, "kept"); });
        }
        if (step >= 2) {
          [1, 2].forEach((d) => { styleEdge(edges[`${d}-0-0`], "acc"); styleNode(nodes[`${d}-0`], "acc"); });
          [3, 4].forEach((d) => { styleEdge(edges[`${d}-0-0`], "rej"); styleNode(nodes[`${d}-0`], "rej"); });
          tau = "accepted 2 + bonus “lossless” → τ = <b>3</b>";
        }
      }

      $("#tc-text").textContent = step < 0 ? "Press replay to watch one drafting round." : M.text[step];
      $("#tc-tau").innerHTML = step === last ? tau : "";
      $$(".tc-step").forEach((b, i) => {
        b.classList.toggle("on", i === step);
        b.classList.toggle("done", i < step);
        b.setAttribute("aria-current", i === step ? "step" : "false");
      });
    }

    function buildSteps() {
      const wrap = $("#tc-steps");
      wrap.replaceChildren();
      wrap.style.gridTemplateColumns = `repeat(${MODES[mode].steps.length}, 1fr)`;
      MODES[mode].steps.forEach(([k, v], i) => {
        const b = h("button", { class: "tc-step", type: "button" }, [h("b", { text: `${i + 1} · ${k.toUpperCase()}` }), v]);
        b.addEventListener("click", () => { stop(); step = i; render(); });
        wrap.appendChild(b);
      });
    }
    function stop() { clearTimeout(timer); timer = null; }
    function play() {
      stop();
      const last = MODES[mode].steps.length - 1;
      if (reduceMotion) { step = last; render(); return; }
      step = 0; render();
      const tick = () => { if (step < last) { step++; render(); timer = setTimeout(tick, step === last ? 0 : 1700); } };
      timer = setTimeout(tick, 1700);
    }

    $$(".seg [data-mode]").forEach((b) => b.addEventListener("click", () => {
      if (mode === b.dataset.mode) return;
      mode = b.dataset.mode;
      $$(".seg [data-mode]").forEach((x) => x.setAttribute("aria-pressed", x === b));
      buildSteps(); play();
    }));
    $("#tc-replay").addEventListener("click", play);

    build(); buildSteps(); render();
    rerenders.push(() => { build(); render(); });
    // Autoplay when the card first scrolls into view.
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { play(); io.disconnect(); } }, { threshold: 0.4 });
      io.observe($("#treecard"));
    } else play();
  })();

  // =====================================================================
  // Charts
  // =====================================================================

  // Horizontal bar chart. rows: [{label, sub, value, ours, base, valueText, tip:{header, rows}}]
  function hbar(container, rows, opts = {}) {
    const W = Math.max(280, container.clientWidth);
    const labelW = opts.labelW || (W < 420 ? 96 : 132);
    const valW = opts.valW || 46;
    const rowH = opts.rowH || 30, barH = Math.min(opts.barH || 18, 24);
    const groupGap = 18;
    let groups = 0;
    rows.forEach((r, i) => { if (r.group && i > 0) groups++; });
    const top = 6, axisH = 22;
    const H = top + rows.length * rowH + groups * groupGap + axisH;
    const plotW = W - labelW - valW;
    const max = opts.max || Math.max(...rows.map((r) => r.value));
    const { ticks, top: tmax } = niceTicks(max, opts.ticks || 4);
    const sx = (v) => labelW + (v / tmax) * plotW;

    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: "img", "aria-label": opts.aria || "Bar chart" });
    const plotBottom = H - axisH;
    ticks.forEach((t) => {
      el("line", { class: t === 0 ? "baseline" : "gridline", x1: sx(t), x2: sx(t), y1: top - 2, y2: plotBottom }, svg);
      el("text", { class: "tick", x: sx(t), y: plotBottom + 15, "text-anchor": "middle", text: (opts.tickFmt || String)(t) }, svg);
    });
    let y = top;
    rows.forEach((r, i) => {
      if (r.group) {
        if (i > 0) y += groupGap;
        el("text", { x: 0, y: y - 4 + (i === 0 ? 8 : 0), "font-size": 9.5, style: { fill: css("--muted"), letterSpacing: ".06em", fontFamily: "var(--f-mono)" }, text: r.group.toUpperCase() }, svg);
        if (i === 0) y += 8;
      }
      const cy = y + rowH / 2;
      const lbl = el("text", { class: "lbl" + (r.ours ? " ours" : ""), x: labelW - 10, y: cy + 4, "text-anchor": "end" }, svg);
      lbl.appendChild(document.createTextNode(r.label));
      if (r.sub) { const s = el("tspan", { class: "sub", dx: 4 }, lbl); s.textContent = r.sub; }
      const fill = r.ours ? css("--s-ours") : r.base ? css("--s-base") : css("--s-base-strong");
      const w = Math.max(0, sx(r.value) - labelW);
      const hit = el("rect", { class: "hit", x: 0, y: y + 1, width: W, height: rowH - 2, fill: "transparent", tabindex: 0, "aria-label": `${r.label}: ${r.valueText}` }, svg);
      const bar = el("path", { class: "bar", d: hbarPath(labelW, cy - barH / 2, w, barH), style: { fill } }, svg);
      el("text", { class: "val" + (r.ours ? " ours" : ""), x: labelW + w + 6, y: cy + 4, text: r.valueText }, svg);
      if (r.tip) {
        const on = (e) => { bar.classList.add("hover"); showTip(e, r.tip.header, r.tip.rows); };
        const off = () => { bar.classList.remove("hover"); hideTip(); };
        hit.addEventListener("pointermove", on); hit.addEventListener("pointerleave", off);
        hit.addEventListener("focus", on); hit.addEventListener("blur", off);
      }
      y += rowH;
    });
    container.replaceChildren(svg);
  }

  function observeResize(node, fn) {
    let w = node.clientWidth;
    if ("ResizeObserver" in window) new ResizeObserver(() => { if (Math.abs(node.clientWidth - w) > 4) { w = node.clientWidth; fn(); } }).observe(node);
    rerenders.push(fn);
  }

  function segGroup(group, onChange) {
    const btns = $$("button", group);
    btns.forEach((b) => b.addEventListener("click", () => {
      btns.forEach((x) => x.setAttribute("aria-pressed", x === b));
      onChange(b.dataset.v);
    }));
  }

  // ---------- academic explorer ----------
  (function academic() {
    const st = { model: "Qwen3-8B", family: "Instruct", T: 0, metric: 0, bench: 7 };
    const chips = $("#acad-bench");
    D.benchmarks.forEach((b, i) => {
      const c = h("button", { class: "chip", type: "button", "aria-pressed": i === st.bench, text: b });
      c.addEventListener("click", () => { st.bench = i; $$(".chip", chips).forEach((x, j) => x.setAttribute("aria-pressed", j === i)); draw(); });
      chips.appendChild(c);
    });
    $$("#acad-controls [data-ctl]").forEach((g) => segGroup(g, (v) => {
      const k = g.dataset.ctl;
      if (k === "model") { const [m, f] = v.split("|"); st.model = m; st.family = f; }
      else st[k] = +v;
      draw();
    }));
    const setting = () => D.academic.find((s) => s.model === st.model && s.family === st.family && s.T === st.T);

    function draw() {
      const s = setting();
      const metricName = st.metric === 0 ? "speedup" : "acceptance length τ";
      $("#acad-title").textContent = `${s.model}${s.family === "Reasoning" ? " (thinking)" : ""} · T = ${s.T} · ${D.benchmarks[st.bench]}`;
      $("#acad-sub").textContent = st.bench === 7 ? `Mean ${metricName} over 7 benchmarks` : metricName[0].toUpperCase() + metricName.slice(1);
      let lastKind = null;
      const rows = s.rows.map((r) => {
        const sp = r.v[st.bench * 2], tau = r.v[st.bench * 2 + 1];
        const value = st.metric === 0 ? sp : tau;
        const row = {
          label: r.method + (r.paper ? "†" : ""), sub: r.budget ? `(${r.budget})` : "",
          value, ours: r.ours, valueText: st.metric === 0 ? value.toFixed(2) + "×" : value.toFixed(2),
          tip: { header: `${methodLabel(r)} · ${D.benchmarks[st.bench]}`, rows: [
            { value: sp.toFixed(2) + "×", label: "speedup", color: r.ours ? css("--s-ours") : css("--s-base-strong") },
            { value: tau.toFixed(2), label: "τ (accepted / round)" }
          ] }
        };
        if (r.kind !== lastKind) { row.group = r.kind === "single" ? "Single-path" : "Tree-based"; lastKind = r.kind; }
        return row;
      });
      hbar($("#acad-chart"), rows, { tickFmt: (t) => (st.metric === 0 ? t + "×" : t), aria: `${metricName} by method` });
      drawTable(s);
    }

    function drawTable(s) {
      const best = D.benchmarks.map((_, b) => [0, 1].map((m) => Math.max(...s.rows.map((r) => r.v[b * 2 + m]))));
      const thead = h("thead", {}, [
        h("tr", { class: "grp" }, [h("th", { text: "" }), ...D.benchmarksShort.map((b, i) => h("th", { colspan: 2, class: i === 7 ? "avgcol" : "", text: b }))]),
        h("tr", {}, [h("th", { text: "Method (budget)" }), ...D.benchmarksShort.flatMap((_, i) => [h("th", { class: i === 7 ? "avgcol" : "", text: "Speedup" }), h("th", { text: "τ" })])])
      ]);
      const tbody = h("tbody");
      let lastKind = null;
      s.rows.forEach((r) => {
        if (r.kind !== lastKind) { tbody.appendChild(h("tr", { class: "sep" }, [h("td", { colspan: 17, text: r.kind === "single" ? "Single-path" : "Tree-based" })])); lastKind = r.kind; }
        const tds = [h("td", { text: methodLabel(r) })];
        D.benchmarks.forEach((_, b) => [0, 1].forEach((m) => {
          const v = r.v[b * 2 + m];
          const cls = [v === best[b][m] ? "best" : "", m === 0 && b === 7 ? "avgcol" : ""].join(" ").trim();
          tds.push(h("td", { class: cls, text: m === 0 ? v.toFixed(2) + "×" : v.toFixed(2) }));
        }));
        tbody.appendChild(h("tr", { class: r.ours ? "ours" : "" }, tds));
      });
      $("#acad-table").replaceChildren(h("table", { class: "data" }, [thead, tbody]));
    }

    draw();
    observeResize($("#acad-chart"), draw);
  })();

  // ---------- concurrency small multiples ----------
  (function concurrency() {
    let model = "Qwen3-8B";
    const grid = $("#conc-grid");
    function draw() {
      grid.replaceChildren();
      const ms = D.concurrency.models[model];
      D.concurrency.levels.forEach((c, ci) => {
        const card = h("div", { class: "card" }, [
          h("div", { class: "card-head" }, [h("span", { class: "card-title", text: `C = ${c}` }), h("span", { class: "card-sub", text: "tokens/s" })])
        ]);
        const chart = h("div", { class: "chart" });
        card.appendChild(chart);
        grid.appendChild(card);
        const rows = ms.map((r) => ({
          label: r.method === "Autoregressive" ? "AR" : r.method,
          value: r.v[ci][0], ours: r.ours, base: r.baseline,
          valueText: r.v[ci][1].toFixed(2) + "×",
          tip: { header: `${r.method}${r.note ? " (" + r.note + ")" : ""} · C = ${c}`, rows: [
            { value: r.v[ci][0].toLocaleString("en-US", { minimumFractionDigits: 1 }), label: "tokens/s", color: r.ours ? css("--s-ours") : css("--s-base-strong") },
            { value: r.v[ci][1].toFixed(2) + "×", label: "vs. AR" }
          ] }
        }));
        hbar(chart, rows, { labelW: 70, valW: 48, rowH: 28, barH: 14, ticks: 3, tickFmt: fmtK, aria: `Throughput at concurrency ${c}` });
      });
    }
    segGroup($("#conc-model"), (v) => { model = v; draw(); });
    draw();
    observeResize(grid, draw);
  })();

  // ---------- production table ----------
  (function production() {
    const thead = h("thead", {}, [
      h("tr", { class: "grp" }, [h("th", { text: "" }), ...D.benchmarksShort.map((b, i) => h("th", { class: i === 7 ? "avgcol" : "", text: b }))])
    ]);
    const tbody = h("tbody");
    D.production.forEach((g) => {
      tbody.appendChild(h("tr", { class: "sep" }, [h("td", { colspan: 9, text: `${g.model} · ${g.detail}` })]));
      const best = D.benchmarks.map((_, b) => Math.max(...g.rows.map((r) => r.v[b * 2])));
      g.rows.forEach((r) => {
        const tds = [h("td", { text: r.method })];
        D.benchmarks.forEach((_, b) => {
          const sp = r.v[b * 2], tau = r.v[b * 2 + 1];
          const cls = [sp === best[b] ? "best" : "", b === 7 ? "avgcol" : ""].join(" ").trim();
          tds.push(h("td", { class: cls }, [sp.toFixed(2) + "× ", h("span", { class: "tau", text: tau.toFixed(2) })]));
        });
        tbody.appendChild(h("tr", { class: r.ours ? "ours" : "" }, tds));
      });
    });
    $("#prod-table").replaceChildren(h("table", { class: "data" }, [thead, tbody]));
  })();

  // ---------- long-context line charts ----------
  (function longContext() {
    const SERIES = [
      { key: "UBTree", color: "--s-ours", w: 2.5 },
      { key: "DSpark", color: "--s-2", w: 2 },
      { key: "DFlash", color: "--s-3", w: 2, dash: true }
    ];
    function legend(node) {
      node.replaceChildren(...SERIES.map((s) => h("span", {}, [h("i", { class: s.dash ? "dash" : "", style: { borderTopColor: css(s.color) } }), s.key])));
    }
    function line(container, ds) {
      const W = Math.max(280, container.clientWidth), H = 250;
      const m = { l: 34, r: 58, t: 10, b: 42 };
      const pw = W - m.l - m.r, ph = H - m.t - m.b;
      const n = ds.bins.length;
      const sx = (i) => m.l + (n === 1 ? pw / 2 : (i / (n - 1)) * pw);
      const y0 = 3, y1 = 6.2;
      const sy = (v) => m.t + ph - ((v - y0) / (y1 - y0)) * ph;
      const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: "img", "aria-label": "Acceptance length by context length" });
      [3, 4, 5, 6].forEach((t) => {
        el("line", { class: t === 3 ? "baseline" : "gridline", x1: m.l, x2: W - m.r, y1: sy(t), y2: sy(t) }, svg);
        el("text", { class: "tick", x: m.l - 8, y: sy(t) + 4, "text-anchor": "end", text: t.toFixed(0) }, svg);
      });
      ds.bins.forEach((b, i) => {
        const t = el("text", { class: "tick", x: sx(i), y: H - m.b + 16, "text-anchor": "middle", text: b }, svg);
        if (W < 460 && i % 2 === 1) t.setAttribute("y", H - m.b + 30);
      });
      el("text", { class: "tick", x: m.l + pw / 2, y: H - 4, "text-anchor": "middle", text: ds.axis }, svg);

      const cross = el("line", { x1: 0, x2: 0, y1: m.t, y2: m.t + ph, style: { stroke: css("--line-strong"), strokeWidth: 1, opacity: 0 } }, svg);
      const surface = css("--surface");
      SERIES.slice().reverse().forEach((s) => {
        const vals = ds.series[s.key];
        const d = vals.map((v, i) => `${i ? "L" : "M"}${sx(i)},${sy(v)}`).join(" ");
        el("path", { d, fill: "none", style: { stroke: css(s.color), strokeWidth: s.w, strokeLinejoin: "round", strokeLinecap: "round", strokeDasharray: s.dash ? "5 4" : "none" } }, svg);
        vals.forEach((v, i) => el("circle", { cx: sx(i), cy: sy(v), r: 4, style: { fill: css(s.color), stroke: surface, strokeWidth: 2 } }, svg));
      });
      // Direct end labels; skip any that would collide with the one above.
      let prevY = -99;
      SERIES.map((s) => ({ s, y: sy(ds.series[s.key][n - 1]) })).sort((a, b) => a.y - b.y).forEach(({ s, y }) => {
        if (y - prevY < 13) return;
        el("text", { x: W - m.r + 8, y: y + 4, "font-size": 11.5, style: { fill: css(s.key === "UBTree" ? "--ink" : "--ink-2"), fontWeight: s.key === "UBTree" ? 600 : 400 }, text: s.key }, svg);
        prevY = y;
      });
      const hit = el("rect", { x: m.l - 10, y: m.t, width: pw + 20, height: ph, fill: "transparent", tabindex: 0, "aria-label": "Hover for values" }, svg);
      const at = (e) => {
        const r = svg.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width) * W;
        return Math.max(0, Math.min(n - 1, Math.round(((px - m.l) / pw) * (n - 1))));
      };
      const show = (e, i) => {
        cross.setAttribute("x1", sx(i)); cross.setAttribute("x2", sx(i)); cross.style.opacity = 1;
        showTip(e, `${ds.bins[i]} · ${ds.counts[i]} ${ds.countLabel}`, SERIES.map((s) => ({ value: ds.series[s.key][i].toFixed(3), label: s.key, color: css(s.color), dash: s.dash })));
      };
      hit.addEventListener("pointermove", (e) => show(e, at(e)));
      hit.addEventListener("pointerleave", () => { cross.style.opacity = 0; hideTip(); });
      hit.addEventListener("focus", (e) => show(e, n - 1));
      hit.addEventListener("blur", () => { cross.style.opacity = 0; hideTip(); });
      container.replaceChildren(svg);
    }
    const draw = () => {
      legend($("#long-legend-a")); legend($("#long-legend-b"));
      line($("#long-a"), D.longContext["LongBench-v2"]);
      line($("#long-b"), D.longContext["SWE-bench"]);
    };
    draw();
    observeResize($("#long-a"), draw);
  })();

  // ---------- latency stacked bars ----------
  (function latency() {
    const COLORS = ["--s-2", "--s-3", "--s-base", "--s-base-strong"];
    function draw() {
      const L = D.latency;
      $("#lat-legend").replaceChildren(...L.stages.map((s, i) => h("span", {}, [h("i", { class: "sq", style: { background: css(COLORS[i]) } }), s])));
      const c = $("#lat-chart");
      const W = Math.max(280, c.clientWidth);
      const labelW = 70, rightW = 92, rowH = 46, barH = 22, H = L.rows.length * rowH + 24;
      const max = 30, pw = W - labelW - rightW;
      const sx = (v) => (v / max) * pw;
      const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: "img", "aria-label": "Latency breakdown per round" });
      [0, 10, 20, 30].forEach((t) => {
        el("line", { class: t ? "gridline" : "baseline", x1: labelW + sx(t), x2: labelW + sx(t), y1: 0, y2: H - 20 }, svg);
        el("text", { class: "tick", x: labelW + sx(t), y: H - 6, "text-anchor": "middle", text: t + " ms" }, svg);
      });
      const surface = css("--surface");
      L.rows.forEach((r, ri) => {
        const cy = ri * rowH + rowH / 2;
        el("text", { class: "lbl" + (r.ours ? " ours" : ""), x: labelW - 10, y: cy + 4, "text-anchor": "end", text: r.method }, svg);
        let x = labelW;
        r.v.forEach((v, i) => {
          const w = sx(v);
          const isLast = i === r.v.length - 1;
          const seg = isLast
            ? el("path", { d: hbarPath(x, cy - barH / 2, w, barH), style: { fill: css(COLORS[i]) } }, svg)
            : el("rect", { x, y: cy - barH / 2, width: w, height: barH, style: { fill: css(COLORS[i]) } }, svg);
          if (!isLast) el("rect", { x: x + w - 1, y: cy - barH / 2, width: 2, height: barH, style: { fill: surface } }, svg);
          seg.classList.add("bar");
          // Inline label only where it fits; text on a gray fill uses ink.
          if (w > 56) el("text", { x: x + w / 2, y: cy + 4, "text-anchor": "middle", "font-size": 11, style: { fill: css("--ink") }, text: v.toFixed(2) }, svg);
          const hit = el("rect", { x, y: cy - rowH / 2 + 2, width: Math.max(w, 6), height: rowH - 4, fill: "transparent", tabindex: 0, "aria-label": `${r.method} ${L.stages[i]} ${v} ms` }, svg);
          const on = (e) => { seg.classList.add("hover"); showTip(e, `${r.method} · ${L.stages[i]}`, [{ value: v.toFixed(2) + " ms", label: "per round", color: css(COLORS[i]) }]); };
          const off = () => { seg.classList.remove("hover"); hideTip(); };
          hit.addEventListener("pointermove", on); hit.addEventListener("pointerleave", off);
          hit.addEventListener("focus", on); hit.addEventListener("blur", off);
          x += w;
        });
        el("text", { class: "val" + (r.ours ? " ours" : ""), x: x + 8, y: cy, text: r.total.toFixed(2) + " ms" }, svg);
        el("text", { class: "tick", x: x + 8, y: cy + 14, text: r.msPerToken.toFixed(2) + " ms/token" }, svg);
      });
      c.replaceChildren(svg);
    }
    draw();
    observeResize($("#lat-chart"), draw);
  })();

  // ---------- released checkpoint table ----------
  (function released() {
    const R = D.released;
    const methods = ["UBTree", "DFlash", "DSpark"];
    function draw(name) {
      const m = R.models[name];
      $("#rel-setup").textContent = m.setup;
      const thead = h("thead", {}, [h("tr", {}, [h("th", { text: "Benchmark" }), ...methods.map((k) => h("th", { text: k + " (τ / speedup)" }))])]);
      const tbody = h("tbody");
      const mean = (k, j) => m[k].reduce((a, c) => a + c[j], 0) / m[k].length;
      R.benchmarks.forEach((b, i) => {
        tbody.appendChild(h("tr", {}, [h("td", { text: b }), ...methods.map((k) => h("td", { class: k === "UBTree" ? "best" : "" }, [h("span", { class: "tau", text: m[k][i][0].toFixed(2) + " / " }), m[k][i][1].toFixed(3) + "×"]))]));
      });
      tbody.appendChild(h("tr", { class: "meanrow" }, [h("td", { text: "Mean" }), ...methods.map((k) => h("td", {}, [h("span", { class: "tau", text: mean(k, 0).toFixed(2) + " / " }), mean(k, 1).toFixed(2) + "×"]))]));
      $("#rel-table").replaceChildren(h("table", { class: "data" }, [thead, tbody]));
    }
    segGroup($("#rel-model"), draw);
    draw("Ling-3.0-flash");
  })();
})();
