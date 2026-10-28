// All numbers on the page come from this file.
// Source: UBTree preprint (arXiv:2609.39972) tables + Hugging Face model cards.
// Each benchmark row stores [speedup, tau] pairs in BENCHMARKS order.

window.UBTREE_DATA = {
  benchmarks: ["GSM8K", "MATH-500", "AIME", "HumanEval", "MBPP", "LiveCodeBench", "MT-Bench", "Avg."],
  benchmarksShort: ["GSM8K", "M-500", "AIME", "HE", "MBPP", "LCB", "MT-B", "Avg."],

  // Table 1 — batch size 1, transformers backend. Budget in parentheses.
  // paper: true marks paper-reported numbers (Domino).
  academic: [
    {
      id: "q4-inst-t0", family: "Instruct", model: "Qwen3-4B", T: 0,
      rows: [
        { method: "DFlash", budget: 16, kind: "single", v: [5.95, 8.57, 5.76, 8.34, 4.45, 6.34, 4.28, 6.08, 4.03, 5.82, 3.83, 5.39, 2.69, 4.60, 4.43, 6.45] },
        { method: "Domino", budget: 17, kind: "single", paper: true, v: [8.02, 10.12, 7.14, 9.01, 5.97, 7.49, 5.66, 7.02, 5.59, 7.11, 5.33, 6.86, 3.28, 5.12, 5.86, 7.53] },
        { method: "EAGLE-3", budget: 16, kind: "tree", v: [4.04, 7.20, 3.97, 6.96, 3.45, 6.05, 3.46, 6.07, 3.42, 6.05, 3.19, 5.53, 2.40, 4.67, 3.42, 6.08] },
        { method: "EAGLE-3", budget: 64, kind: "tree", v: [4.42, 7.97, 4.45, 7.85, 4.02, 7.11, 4.00, 7.07, 3.95, 7.11, 3.75, 6.58, 2.80, 5.46, 3.91, 7.02] },
        { method: "DDTree", budget: 64, kind: "tree", v: [6.69, 10.22, 6.62, 10.10, 5.51, 8.49, 5.18, 7.89, 5.10, 7.80, 4.78, 7.23, 3.51, 6.14, 5.34, 8.27] },
        { method: "DARTree", budget: 64, kind: "tree", v: [7.89, 12.50, 7.63, 11.90, 6.55, 10.37, 6.09, 9.78, 6.33, 10.07, 5.75, 9.04, 3.93, 7.23, 6.31, 10.13] },
        { method: "UBTree", budget: 64, kind: "tree", ours: true, v: [8.54, 12.58, 8.18, 12.15, 6.92, 10.13, 7.07, 10.22, 6.66, 9.98, 6.37, 9.24, 4.39, 7.32, 6.88, 10.23] }
      ]
    },
    {
      id: "q4-inst-t1", family: "Instruct", model: "Qwen3-4B", T: 1,
      rows: [
        { method: "DFlash", budget: 16, kind: "single", v: [5.28, 7.67, 4.56, 6.89, 3.10, 4.64, 4.09, 5.86, 3.84, 5.52, 3.25, 4.62, 2.52, 4.26, 3.81, 5.64] },
        { method: "Domino", budget: 17, kind: "single", paper: true, v: [6.79, 8.61, 5.67, 7.35, 3.75, 4.83, 5.02, 6.30, 4.96, 6.36, 5.04, 6.45, 3.02, 4.56, 4.89, 6.35] },
        { method: "EAGLE-3", budget: 16, kind: "tree", v: [3.66, 6.61, 3.51, 6.36, 2.72, 4.88, 3.34, 5.93, 3.21, 5.80, 2.80, 4.94, 2.21, 4.34, 3.06, 5.55] },
        { method: "EAGLE-3", budget: 64, kind: "tree", v: [4.13, 7.66, 3.96, 7.29, 3.20, 6.00, 3.75, 6.84, 3.71, 6.92, 3.27, 5.96, 2.54, 5.12, 3.51, 6.54] },
        { method: "DDTree", budget: 64, kind: "tree", v: [6.19, 9.49, 5.62, 8.76, 4.14, 6.31, 5.17, 7.81, 4.90, 7.50, 4.19, 6.37, 3.37, 5.66, 4.80, 7.41] },
        { method: "DARTree", budget: 64, kind: "tree", v: [6.94, 11.01, 6.05, 9.73, 4.10, 6.99, 5.84, 9.10, 5.76, 9.28, 4.71, 7.33, 3.64, 6.53, 5.29, 8.57] },
        { method: "UBTree", budget: 64, kind: "tree", ours: true, v: [7.95, 11.79, 7.13, 10.54, 5.10, 7.63, 6.42, 9.43, 6.15, 9.30, 5.27, 7.72, 4.02, 6.68, 6.00, 9.01] }
      ]
    },
    {
      id: "q8-inst-t0", family: "Instruct", model: "Qwen3-8B", T: 0,
      rows: [
        { method: "DFlash", budget: 16, kind: "single", v: [5.98, 8.59, 5.84, 8.51, 4.75, 6.73, 4.46, 6.31, 4.07, 5.87, 3.91, 5.48, 2.64, 4.54, 4.52, 6.58] },
        { method: "Domino", budget: 17, kind: "single", paper: true, v: [7.92, 10.03, 7.38, 9.43, 5.85, 7.41, 5.89, 7.39, 5.53, 7.04, 5.27, 7.04, 3.29, 5.18, 5.88, 7.65] },
        { method: "EAGLE-3", budget: 16, kind: "tree", v: [4.23, 7.43, 4.20, 7.30, 3.71, 6.46, 3.68, 6.42, 3.62, 6.39, 3.54, 6.07, 2.53, 4.88, 3.64, 6.42] },
        { method: "EAGLE-3", budget: 64, kind: "tree", v: [4.57, 8.20, 4.66, 8.11, 4.34, 7.51, 4.23, 7.39, 4.13, 7.39, 4.11, 7.10, 2.99, 5.77, 4.15, 7.35] },
        { method: "DDTree", budget: 64, kind: "tree", v: [6.65, 10.19, 6.60, 10.12, 5.64, 8.63, 5.43, 8.17, 5.07, 7.68, 4.92, 7.30, 3.49, 6.09, 5.40, 8.31] },
        { method: "DARTree", budget: 64, kind: "tree", v: [8.26, 12.49, 7.61, 12.13, 6.71, 10.37, 6.41, 10.09, 6.32, 10.02, 5.88, 9.19, 4.01, 7.33, 6.46, 10.23] },
        { method: "UBTree", budget: 64, kind: "tree", ours: true, v: [8.65, 12.58, 8.46, 12.30, 7.05, 10.17, 7.12, 10.12, 6.64, 9.79, 6.43, 9.24, 4.25, 7.25, 6.94, 10.21] }
      ]
    },
    {
      id: "q8-inst-t1", family: "Instruct", model: "Qwen3-8B", T: 1,
      rows: [
        { method: "DFlash", budget: 16, kind: "single", v: [5.05, 7.37, 4.57, 6.77, 2.99, 4.47, 3.74, 5.26, 3.64, 5.20, 3.14, 4.41, 2.34, 3.96, 3.64, 5.35] },
        { method: "Domino", budget: 17, kind: "single", paper: true, v: [6.47, 8.34, 5.40, 7.20, 3.78, 4.92, 4.75, 5.98, 4.73, 6.02, 5.06, 6.72, 2.94, 4.61, 4.73, 6.26] },
        { method: "EAGLE-3", budget: 16, kind: "tree", v: [3.93, 7.07, 3.74, 6.68, 3.01, 5.30, 3.35, 5.89, 3.35, 6.01, 3.01, 5.25, 2.36, 4.55, 3.25, 5.82] },
        { method: "EAGLE-3", budget: 64, kind: "tree", v: [4.39, 8.05, 4.23, 7.65, 3.51, 6.34, 3.88, 7.00, 3.88, 7.14, 3.53, 6.32, 2.73, 5.45, 3.73, 6.85] },
        { method: "DDTree", budget: 64, kind: "tree", v: [6.10, 9.23, 5.61, 8.68, 4.04, 6.31, 4.91, 7.37, 4.63, 7.02, 4.14, 6.22, 3.23, 5.48, 4.67, 7.19] },
        { method: "DARTree", budget: 64, kind: "tree", v: [7.04, 11.01, 5.86, 9.59, 4.48, 7.21, 5.26, 8.36, 5.53, 8.91, 4.45, 7.06, 3.59, 6.48, 5.17, 8.37] },
        { method: "UBTree", budget: 64, kind: "tree", ours: true, v: [7.97, 11.55, 6.99, 10.44, 4.99, 7.43, 6.17, 8.85, 5.92, 8.80, 5.10, 7.47, 3.77, 6.36, 5.84, 8.70] }
      ]
    },
    {
      id: "q4-reason-t0", family: "Reasoning", model: "Qwen3-4B", T: 0,
      rows: [
        { method: "DFlash", budget: 16, kind: "single", v: [5.18, 7.28, 4.53, 6.45, 3.67, 5.26, 3.91, 5.46, 3.72, 5.17, 3.37, 4.68, 2.99, 4.64, 3.91, 5.56] },
        { method: "EAGLE-3", budget: 16, kind: "tree", v: [3.49, 6.01, 3.04, 5.23, 2.65, 4.62, 2.82, 4.83, 2.80, 4.78, 2.43, 4.16, 2.25, 4.11, 2.78, 4.82] },
        { method: "EAGLE-3", budget: 64, kind: "tree", v: [4.19, 7.24, 3.75, 6.48, 3.29, 5.77, 3.52, 6.05, 3.51, 6.04, 3.04, 5.28, 2.74, 5.07, 3.44, 5.99] },
        { method: "DDTree", budget: 64, kind: "tree", v: [6.09, 9.19, 5.54, 8.42, 4.77, 7.20, 4.85, 7.29, 4.68, 7.01, 4.31, 6.45, 3.82, 6.15, 4.87, 7.39] },
        { method: "UBTree", budget: 64, kind: "tree", ours: true, v: [7.64, 10.95, 6.99, 10.01, 5.73, 8.53, 6.21, 8.85, 5.98, 8.54, 5.45, 7.75, 4.71, 7.22, 6.10, 8.84] }
      ]
    },
    {
      id: "q4-reason-t1", family: "Reasoning", model: "Qwen3-4B", T: 1,
      rows: [
        { method: "DFlash", budget: 16, kind: "single", v: [4.80, 6.77, 4.36, 6.18, 3.57, 5.15, 3.76, 5.23, 3.55, 4.93, 3.21, 4.47, 2.89, 4.40, 3.73, 5.30] },
        { method: "EAGLE-3", budget: 16, kind: "tree", v: [3.01, 5.28, 2.78, 4.86, 2.41, 4.22, 2.54, 4.42, 2.47, 4.28, 2.24, 3.92, 2.00, 3.69, 2.49, 4.38] },
        { method: "EAGLE-3", budget: 64, kind: "tree", v: [3.64, 6.57, 3.34, 6.00, 2.98, 5.37, 3.17, 5.66, 3.06, 5.48, 2.77, 4.99, 2.35, 4.49, 3.04, 5.51] },
        { method: "DDTree", budget: 64, kind: "tree", v: [4.87, 7.35, 4.69, 7.11, 4.01, 6.10, 4.17, 6.22, 3.97, 5.93, 3.57, 5.37, 3.28, 5.11, 4.08, 6.17] },
        { method: "UBTree", budget: 64, kind: "tree", ours: true, v: [6.56, 9.50, 6.12, 8.78, 5.12, 7.47, 5.44, 7.74, 5.18, 7.41, 4.57, 6.61, 4.10, 6.17, 5.30, 7.67] }
      ]
    }
  ],

  // Table 2 — SGLang, BF16, CUDA Graphs, T_infer = 1. [tokens/s, speedup] per concurrency.
  concurrency: {
    levels: [1, 8, 16, 32],
    models: {
      "Qwen3-4B": [
        { method: "Autoregressive", baseline: true, v: [[253.5, 1.00], [1404.9, 1.00], [2208.3, 1.00], [3307.4, 1.00]] },
        { method: "DFlash", v: [[796.4, 3.14], [2287.2, 1.63], [3664.4, 1.66], [6071.9, 1.84]] },
        { method: "Domino", v: [[816.3, 3.22], [2258.9, 1.61], [3636.5, 1.65], [6115.5, 1.85]] },
        { method: "DDTree", v: [[844.6, 3.33], [2390.8, 1.70], [3669.8, 1.66], [4810.4, 1.45]] },
        { method: "DARTree", note: "adaptive B/W", v: [[978.5, 3.86], [2405.1, 1.71], [3770.3, 1.71], [5619.9, 1.70]] },
        { method: "UBTree", note: "adaptive B/W", ours: true, v: [[1089.1, 4.30], [2797.4, 1.99], [4271.9, 1.93], [6560.4, 1.98]] }
      ],
      "Qwen3-8B": [
        { method: "Autoregressive", baseline: true, v: [[180.9, 1.00], [1126.2, 1.00], [1865.9, 1.00], [2770.9, 1.00]] },
        { method: "DFlash", v: [[634.7, 3.51], [2181.7, 1.94], [3596.0, 1.93], [5265.4, 1.90]] },
        { method: "Domino", v: [[676.2, 3.74], [2137.9, 1.90], [3582.7, 1.92], [5435.2, 1.96]] },
        { method: "DDTree", v: [[686.8, 3.80], [2013.9, 1.79], [3303.5, 1.77], [3603.6, 1.30]] },
        { method: "DARTree", note: "adaptive B/W", v: [[824.4, 4.56], [2280.1, 2.02], [3514.5, 1.88], [4844.9, 1.75]] },
        { method: "UBTree", note: "adaptive B/W", ours: true, v: [[881.7, 4.87], [2644.4, 2.35], [4069.9, 2.18], [5851.4, 2.11]] }
      ]
    }
  },

  // Table 3 — production-scale, SGLang, TP4, batch size 1, thinking disabled.
  production: [
    {
      model: "Ling3-Flash", detail: "124B-A5.1B MoE · hybrid attention (Kimi Delta Attention)",
      rows: [
        { method: "DSpark", v: [5.14, 6.09, 4.93, 5.81, 4.22, 4.96, 5.37, 6.32, 4.50, 5.93, 4.18, 4.98, 3.19, 3.74, 4.50, 5.40] },
        { method: "DFlash", v: [4.85, 5.73, 4.83, 5.58, 4.17, 4.80, 5.11, 6.00, 4.39, 5.55, 3.97, 4.63, 3.11, 3.58, 4.35, 5.12] },
        { method: "UBTree", ours: true, v: [5.83, 7.37, 5.87, 7.18, 5.43, 6.60, 5.94, 7.42, 5.00, 6.85, 5.22, 6.54, 4.24, 5.27, 5.36, 6.75] }
      ]
    },
    {
      model: "Qwen3.8-27B", detail: "27B · hybrid attention (Gated DeltaNet)",
      rows: [
        { method: "DSpark", v: [5.20, 6.74, 4.76, 6.07, 4.41, 5.65, 5.18, 6.85, 4.26, 5.79, 3.47, 4.53, 3.00, 3.82, 4.32, 5.64] },
        { method: "DFlash 2", v: [4.65, 6.29, 4.67, 6.29, 4.48, 6.00, 5.06, 6.98, 4.30, 6.11, 3.55, 4.82, 2.92, 3.95, 4.24, 5.78] },
        { method: "UBTree", ours: true, v: [5.05, 7.59, 5.28, 7.50, 5.07, 7.33, 5.14, 7.66, 4.67, 7.32, 4.44, 6.54, 3.84, 5.61, 4.78, 7.08] }
      ]
    }
  ],

  // Appendix tables — acceptance length on Ling3-Flash by context length.
  longContext: {
    "LongBench-v2": {
      axis: "Prompt tokens at request start",
      bins: ["≤32K", "32–64K", "64–96K", "96–128K", "128–192K", "192–260K"],
      counts: [109, 71, 47, 69, 73, 32], countLabel: "requests",
      overall: { DSpark: 4.136, DFlash: 3.898, UBTree: 5.693 },
      series: {
        UBTree: [5.833, 5.870, 5.326, 5.351, 5.798, 5.804],
        DSpark: [4.248, 4.297, 3.795, 3.976, 4.166, 4.084],
        DFlash: [4.020, 4.046, 3.578, 3.678, 3.944, 3.919]
      }
    },
    "SWE-bench": {
      axis: "Accumulated prompt tokens since first request",
      bins: ["≤0", "0–4K", "4–8K", "8–16K", "16–32K", "32–64K", "64–131K"],
      counts: [30, 30, 28, 27, 23, 13, 2], countLabel: "cases",
      overall: { DSpark: 3.981, DFlash: 3.737, UBTree: 5.341 },
      series: {
        UBTree: [4.842, 4.829, 5.447, 5.389, 5.516, 5.408, 5.465],
        DSpark: [3.718, 3.743, 4.023, 3.998, 4.089, 4.023, 3.965],
        DFlash: [3.442, 3.524, 3.795, 3.709, 3.836, 3.805, 3.770]
      }
    }
  },

  // Appendix — latency per verification round on Qwen3-4B, GSM8K, ms.
  latency: {
    stages: ["Proposer", "Draft post-processing", "Verification", "Other"],
    rows: [
      { method: "DARTree", v: [3.51, 3.36, 20.94, 1.64], total: 29.47, tau: 12.50, msPerToken: 2.41 },
      { method: "UBTree", ours: true, v: [3.41, 1.38, 20.88, 1.61], total: 27.30, tau: 12.58, msPerToken: 2.21 }
    ]
  },

  // Released checkpoints — numbers from the Hugging Face model cards (SGLang, B16, greedy, no-thinking).
  // Cells: [acceptance length, speedup].
  released: {
    benchmarks: ["GSM8K", "MATH-500", "AIME 2025", "HumanEval", "MBPP", "LiveCodeBench"],
    models: {
      "Ling-3.0-flash": {
        setup: "TP4 · concurrency 1 · 32-node tree",
        UBTree: [[9.70, 3.227], [9.58, 3.761], [8.18, 3.497], [10.40, 3.479], [9.55, 3.415], [7.53, 3.191]],
        DFlash: [[7.44, 2.927], [7.07, 3.284], [5.75, 2.864], [7.79, 3.128], [7.01, 3.011], [5.13, 2.543]],
        DSpark: [[8.00, 2.899], [7.69, 3.252], [6.39, 2.883], [8.03, 3.014], [6.89, 2.730], [5.53, 2.484]]
      },
      "Ling-3.0-tiny": {
        setup: "TP1 · concurrency 1 · 49-node tree",
        UBTree: [[9.53, 3.055], [9.86, 3.518], [8.44, 3.152], [10.04, 3.411], [9.35, 3.062], [7.46, 2.794]],
        DFlash: [[6.57, 2.665], [5.74, 2.643], [4.76, 2.261], [6.39, 2.770], [5.87, 2.473], [4.11, 1.948]],
        DSpark: [[7.53, 2.718], [6.96, 2.826], [5.37, 2.263], [7.59, 2.914], [7.16, 2.678], [4.84, 2.030]]
      }
    }
  }
};
