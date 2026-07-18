# Index — Painted UI wiki

Content catalog. Read this first on every query. Updated on every ingest.

## Overview & thesis

- [[overview]] — top-level synthesis: the Flipbook reference point, the cost
  problem, the bet, where the field is heading.
- [[thesis]] — the argument: you don't need to generate pixels to sell the
  painted-UI illusion; four-step case + falsifiers + current evidence.

## Concepts

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
- [[concepts/cost-model]] — maintained $/user comparison; first measured
  number filed (12,000× bandwidth advantage, exp-01).

## Techniques

*(none yet — technique pages get created as recipes firm up from experiments)*

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

## Comparisons

*(none yet — filed from queries as they happen)*

## Planned pages (mentioned, not yet created)

- `concepts/a2ui-and-standards` — awaiting a source on agent-to-UI /
  declarative UI protocols.
