# Index — Painted UI wiki

Content catalog. Read this first on every query. Updated on every ingest.
Latest health check: [[lint-2026-07-21]] (experiment status table lives
there).

## Overview & thesis

- [[overview]] — top-level synthesis: the Flipbook reference point, the cost
  problem, the bet, where the field is heading.
- [[thesis]] — the argument: you don't need to generate pixels to sell the
  painted-UI illusion; four-step case + falsifiers + current evidence.

## Concepts

- [[concepts/four-loops]] — the architecture: conversation / network read /
  parser scan / render, four speeds, one shared node map; mutate vs sample;
  sourced lineage from the game-loop pattern. Now includes **the verifier**
  — the semantic gate that guided generation makes necessary.
- [[concepts/the-illusion]] — **the core analytical page.** Decomposes the
  "painted live" feeling into four ingredients (fluid layout, live motion,
  universal interactivity, bespoke content) and shows each is reproducible
  without pixel generation. Includes interaction effects and falsifiable tells.
- [[concepts/video-diffusion-approach]] — how the expensive way works and why
  its costs are linear in concurrent users with no caching.
- [[concepts/scene-graph-approach]] — the central cheap technique: model
  emits a resolution-independent scene description; client compositor renders.
- [[concepts/client-side-compositing]] — the motion vocabulary (Ken Burns,
  morphs, particles, springs, reveals) on the user's GPU.
- [[concepts/interactivity-from-semantics]] — exact hit-testing from scene
  semantics vs. inferring clicks from pixels; runtime node promotion.
- [[concepts/fluid-layout]] — constraint/anchor layout with animated resolve;
  what upgrades "responsive" to "repainted."
- [[concepts/asset-caching]] — why static image gen amortizes across users
  and video gen can't; semantic cache keys, pre-generation.
- [[concepts/latency-and-streaming]] — perceived-speed tricks; streaming
  scene graphs as the visible painting act.
- [[concepts/cost-model]] — maintained $/user comparison; measured numbers
  from exp-01 (12,000× bandwidth) and exp-02 (~1.1 Kbit/s patch stream).
- [[concepts/choreographer]] — the layer that turns semantic patches into
  motion; model-verbs vs local-policy vs hybrid; the enterprise/scale story.
  Deep-dive + live demo: `wiki/decks/the-choreographer.html`.
- [[concepts/swarm-painting]] — multiple agents, one canvas: why swarming is
  the cheap path's unfair advantage; six swarm patterns; protocol implications.
- [[concepts/experience-frontier]] — beyond 60fps: why frame rate is the
  wrong lever; painterly shaders, speculative pre-paint, infinite canvas,
  audio choreography, user-inside-the-painting.
- [[concepts/on-device-models]] — the endgame, now shipping, **revised
  2026-07-25**: guided generation makes invalid patches unemittable — but
  ⚠️ the *constraint tax* means small models then emit more
  wrong-but-valid ones, so failure goes silent. Adds the verifier,
  session-as-cache, speculative decoding, LoRA taste adapters, diffusion
  decoding, and a corrected browser path. Three open questions closed.

## Techniques

- [[techniques/transition-choreography]] — replicate video-UI dissolves,
  zooms, flyouts, and morphs from a streamed patch protocol; 8 verbs, no
  pixels generated. Distilled from exp-02.
- [[techniques/scene-grammar-v2]] — the expressive protocol design:
  primitives (paths/masks/fx/texture) + compound catalog + constraint
  containers + scene diffs; new verbs (strokeIn, materialize, pageMorph);
  ~4–30× fewer tokens. Answers the audit's production-gap lists. exp-10.

## Decks & explainers (HTML, in `wiki/decks/`)

- `why-four-loops.html` — why the architecture needs four decoupled loops;
  lineage; prior-art map; SLM/on-device direction.
- `the-choreographer.html` — the how-of-motion layer in detail, with a live
  same-stream/four-choreographies demo and unit economics.
- `the-split-brain.html` — **on-device inference explained for newcomers**:
  the pros and cons, how streamed patches actually look (wire JSON vs typed
  device object vs choreographer output), a live two-brain demo where the
  cloud composes the scene and the device handles taps and pre-painting, an
  interactive routing tree (cloud / device / no model at all), the
  constraint tax, and the honest cost list.
- `the-cast.html` — the roles explained for newcomers: director / script /
  choreographer / painter(compositor) / stage, with accordion examples of
  real node objects, patch streams, policy decisions, the frame loop, and
  a live one-patch-through-the-pipeline demo.

## Entities

- [[entities/flipbook]] — the reference product/existence proof; facts +
  open questions.
- [[entities/ltx-studio]] — maker of the video model Flipbook optimizes.
- [[entities/modal]] — serverless GPU infra Flipbook runs on.

## Sources

- [[sources/flipbook-thread]] — source #1: Flipbook launch thread (@zan2434),
  Apr 2026. Seeds the whole wiki.
- [[sources/experiment-01-canvas-compositor]] — source #2: own build.
  Ingredients 1–3 reproduced in an 8 KB Canvas file; first cost measurement.
- [[sources/experiment-02-transition-stream]] — source #3: own build. The
  stream-like transition vocabulary (dissolve/zoom/flyout/morph/image-swap)
  reproduced from an 8-verb patch stream at ~1.1 Kbit/s.
- [[sources/experiment-03-live-llm-painter]] — source #4: own build. Live
  harness: a real Claude model paints scenes by request via streamed JSONL
  patches; clicks loop back as conversation. First live paint confirmed.
- [[sources/game-loop-lineage]] — source #5: Nystrom's Game Loop chapter +
  Fiedler's Fix Your Timestep. The canonical simulation/render decoupling
  painted UI inherits — and the two loops + visible-mismatch it adds.
- [[sources/audit-2026-07]] — source #6: independent audit (full text +
  exp-10 follow-up, visual 6.5→8.0). Confirms the differentiator; its
  perception study was built as exp-08, now **paused** pending a stronger
  painted condition.
- [[sources/painted-ui-messaging-reframe-spec]] — the original spec behind
  the July deck-upgrade batch (recovered by lint; reviewed in
  [[sources/upgrades]]).
- [[sources/chatgpt-motion-recommendations]] — source #7: the motion
  roadmap. Intent verbs over composable primitives, attention
  orchestration, hierarchy choreography, velocity-continuous interruption
  ("Interrupt the Choreographer" = exp-12), grammars+themes distinction,
  restraint doctrine. Adopted with three amendments.
- [[sources/on-device-inference-2026]] — source #8: the July 2026
  on-device inference research batch (constraint tax, schema keys as an
  instruction channel, bandwidth ceiling, speculative decoding, LoRA
  adapters, mobile diffusion LLMs, browser API status). **First source to
  contradict an existing wiki claim.**
- [[sources/upgrades]] — review record of the July deck-upgrade batch:
  ~90% kept, two corrections (present-tense claims; Painter/Animator
  reconciliation), plus the merge rule for future upgrade batches.

## Comparisons

*(none yet — `comparisons/generative-ui-landscape` queued once prior-art
sources are ingested)*

## Planned pages (mentioned, not yet created)

- `concepts/a2ui-and-standards` — hunting list has the A2UI docs; ingest next.
- `concepts/accessibility-mirror` — audit's proposal: synchronized hidden
  DOM tree generated from node semantics, as a first-class loop.
- `concepts/executors` — from [[lint-2026-07-21]] §F: choreographer as
  compiler, canvas/rAF and WAAPI/View Transitions as backends.
- `concepts/diffusion-painting` — from [[sources/on-device-inference-2026]]:
  non-autoregressive decoding would make coarse-to-fine resolution a
  decoder property rather than a streaming trick.
