# Raw: on-device inference research batch — July 2026

Collected 2026-07-24/25 in response to the question "how do I improve the
painted UI concept, especially on device inference?". Web research only;
public sources. Recorded verbatim-ish as findings + citations so the wiki
pages can cite a stable raw file. This field moves fast — every figure
below carries its source; re-verify before building.

---

## 1. Constrained decoding does not come free (the central finding)

**"The Constraint Tax: Measuring Validity-Correctness Tradeoffs in
Structured Outputs for Small Language Models"** — Jaideep Ray, arXiv
2605.26128 (submitted 2026-05-20).
https://arxiv.org/abs/2605.26128

- Defines *constraint tax*: the answer- and executable-accuracy loss
  caused by structured-output constraints, measured at fixed model, fixed
  task distribution, fixed problem instances.
- Explicitly targets on-device / low-cost SLM deployments, where sub-3B
  models are attractive for privacy and latency but "have limited capacity
  to satisfy schemas while solving tasks."
- Main suite, 15,000 generations: hard answer-only schema decoding raises
  schema validity **61.5% → 100.0%**, lowers answer accuracy
  **19.7% → 11.0%**, and raises wrong-but-valid-schema outputs
  **49.5% → 88.9%**.
- Stated headline: the engineering assumption that hard output constraints
  improve reliability *without changing the underlying answer* is unsafe
  for small models.

**"When Correct Isn't Usable: Improving Structured Output Reliability in
Small Language Models"** — arXiv 2605.02363.
https://arxiv.org/abs/2605.02363

- Testbed: GSM8K and MATH with a strict JSON output contract.
- NAIVE prompting (no system prompt) reaches up to **85% task accuracy**
  on GSM8K but **0% output accuracy** across all models and datasets.
  REFERENCE prompting (minimal hand-written format prompt) still yields 0%
  output accuracy for two of four models.
- AloLab: an iterative system-prompt optimizer (meta-agent: Claude Sonnet
  4.5) needing only black-box access to the target model. Reaches
  **84–87% output accuracy on GSM8K**, 34–40% on MATH, across five
  independent runs per model — at near-NAIVE inference latency, with no
  fine-tuning.

Related, same direction:

- "From Hallucination to Structure Snowballing: The Alignment Tax of
  Constrained Decoding in LLM Reflection" — arXiv 2604.06066.
  https://arxiv.org/pdf/2604.06066
- "Structured Output Collapses Answer Diversity Across 44 Language
  Models" — arXiv 2607.18476. https://arxiv.org/html/2607.18476
- "Capacity, Not Format: Rethinking Structured Reasoning Failures" —
  arXiv 2606.09410. https://arxiv.org/html/2606.09410
- "Constraint Tax in Open-Weight LLMs: An Empirical Study of Tool Calling
  Suppression Under Structured Output Constraints" — arXiv 2606.25605.
  https://arxiv.org/html/2606.25605v1

## 2. Schema keys are an instruction channel, not just structure

**"Schema Key Wording as an Instruction Channel in Structured Generation
under Constrained Decoding"** — arXiv 2604.14862 (2026-04-28).
https://arxiv.org/abs/2604.14862

- Changing **only** schema-key wording substantially affects accuracy,
  with prompt, model, output structure and decoding setup held fixed.
- First systematic study of schema keys as an implicit instruction
  channel: key tokens enter the autoregressive context and guide
  generation; prior work treated schemas as structural constraints only.
- Formulates structured generation as a **multi-channel instruction
  problem** — task signal can live in the prompt, in the schema keys, or
  both, and the two channels interact **non-additively**.
- A CoT-style key helps only when its semantic gain exceeds the distortion
  induced by grammar-constrained projection (theoretical account of
  model-dependent key effects). Qwen benefits more from schema-level
  instruction; LLaMA relies more on prompt-level guidance.
- Conclusion: schema design is part of *instruction specification*, not
  merely output formatting.

## 3. Constrained-decoding runtime cost is now near zero per token

Sources: "Flexible and Efficient Grammar-Constrained Decoding"
(arXiv 2502.05111), "Earley-Driven Dynamic Pruning for Efficient
Structured Decoding" (arXiv 2506.01151), JSONSchemaBench
(arXiv 2501.10868), and practitioner summaries
(https://www.spheron.network/blog/structured-output-function-calling-inference-guide/).

- Older backends (outlines-class): +5–60% latency depending on schema
  complexity — simple flat schemas ~5–10%, deeply nested 40–60%.
- Modern backends (xgrammar-class) move nearly all cost to a **one-time
  grammar compilation of 20–50 ms**, with per-token overhead
  **under ~40 µs** — near zero for JSON generation. Default structured-
  generation backend for vLLM, SGLang and TensorRT-LLM as of March 2026.

## 4. The device ceiling is memory bandwidth

**"On-Device LLMs: State of the Union, 2026"** — V. Chandra.
https://v-chandra.github.io/on-device-llms/

- Mobile memory bandwidth **50–90 GB/s** vs data-center GPUs
  **2–3 TB/s** — a 30–50× gap that is decisive *because decode is
  memory-bound*.

## 5. Speculative decoding and KV reuse are the available speedups

- **sd.npu** — "Accelerating Mobile Language Model via Speculative
  Decoding and NPU-Coordinated Execution", arXiv 2510.15312.
  https://arxiv.org/html/2510.15312v3
  Three components: adaptive execution scheduling, context-aligned
  drafting, hardware-efficient draft extension (reuses and expands
  intermediate sequences for parallelism).
- Drafting families: **Medusa** (extra decoding heads predicting tokens in
  parallel), **EAGLE** (drafting via hidden-state prediction rather than
  token prediction — reusing internal target-model features cuts drafting
  cost).
- "When Hidden States Drift: Can KV Caches Rescue Long-Range Speculative
  Decoding?" — arXiv 2604.26412. https://arxiv.org/pdf/2604.26412
- General framing: every optimization that reduces HBM reads (speculative
  decoding, KV quantization, MLA, FlashAttention) translates directly into
  user-perceived speed.
  https://www.morphllm.com/llm-inference-optimization

## 6. Diffusion LLMs now run on mobile NPUs

**"Efficient On-Device Diffusion LLM Inference with Mobile NPU"** —
arXiv 2606.13740. https://arxiv.org/abs/2606.13740

- `llada.cpp`: first NPU-aware inference framework for accelerating
  diffusion LLMs on smartphones. Reduces LLaDA-8B generation latency
  **17×–42×** over the CPU baseline, using prefix KV cache reuse.
- Prefix KV cache reuse removes repeated prefix computation on both CPU
  and NPU baselines; moving dense denoising to the NPU gives the larger
  system-level reduction.
- Property that matters for painted UI: diffusion LLM decoding is
  **non-autoregressive** — a block of output is refined in place,
  coarse-to-fine, rather than emitted left-to-right.

## 7. Apple Foundation Models: adapters and draft models shipped

Sources: Apple Intelligence Foundation Language Models (arXiv 2507.13575,
https://arxiv.org/html/2507.13575v1); Apple ML Research overview
(https://machinelearning.apple.com/research/introducing-apple-foundation-models);
practitioner write-ups
(https://datawizz.ai/blog/apple-foundation-models-framework-benchmarks-and-custom-adapters-training-with-datawizz,
https://dev.to/iniyarajan86/foundation-models-guided-generation-with-apples-ios-26-framework-2m09).

- Framework surface: `@Generable` / `@Guide` macros for schema-driven
  constrained decoding, tool calling, `LanguageModelSession` with
  **KV-cache awareness**, streaming via snapshots, LoRA fine-tuning
  pipelines, and **draft-model speculative decoding support**.
- Python toolkit trains **rank-32 LoRA adapters** (~160 MB each) and can
  optionally train a **draft model for on-device speculative decoding**;
  adapters are directly compatible with the framework and preserve guided
  generation.
- Reported speeds vary by source: ~0.6 ms time-to-first-token on
  iPhone 15 Pro with ~30 tok/s generation in one write-up; 10–20 tok/s on
  modern hardware in another. Treat as a range, not a spec.

## 8. The browser path improved

- **Chrome Prompt API**: accessed via `LanguageModel` (`window.LanguageModel`
  for pages, `chrome.languageModel` for extensions). **Stable for Chrome
  extensions since Chrome 138**; for web pages still behind
  `chrome://flags/#prompt-api-for-gemini-nano` plus a registered origin
  trial. Community tracking expects stable web availability around
  **Chrome 145–150 (late 2026 / early 2027)**.
  https://developer.chrome.com/docs/ai/prompt-api ·
  https://adsm.dev/posts/prompt-api/
- WebGPU stable since Chrome 113; **WebNN still behind a flag**, usable as
  a transformers.js backend. WebLLM (MLC) remains the most mature
  browser-native inference engine. Quantized models **under ~2 GB** run at
  interactive speeds on consumer hardware in 2026.
  https://www.sitepoint.com/local-first-ai-webgpu-chrome-guide/ ·
  https://wowdata.science/browser-native-agents-llms-in-browser-ai-guide-2026/
- **Gemini Nano 4** (Gemma-4-based) in trial for AICore, rollout planned
  later in 2026.

## Collection note

All of the above is public web material gathered in a single research
pass; none of it is employer-derived. Figures from vendor blogs and
practitioner posts are less reliable than the arXiv figures and are
labelled as such where they conflict.
