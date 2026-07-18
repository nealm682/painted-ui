# Thesis

**You don't need to generate pixels to sell the painted-UI illusion.**

## The argument

1. Flipbook proved the *demand*: a UI that feels painted live by a model is
   viscerally compelling ([[sources/flipbook-thread]],
   [[entities/flipbook]]).
2. Flipbook's method — every pixel from a video-diffusion model — has
   linearly scaling unit costs and no cross-user caching. The launch symptoms
   (slow, edited demos, waiting rooms) are the economics showing through
   ([[concepts/video-diffusion-approach]], [[concepts/cost-model]]).
3. The compelling thing is a **behavior bundle**, not a rendering method.
   It decomposes into four ingredients — fluid layout, live motion, universal
   interactivity, bespoke content — and each is reproducible without pixel
   generation ([[concepts/the-illusion]], the core analysis).
4. The reproduction: a model authors a **resolution-independent scene graph**
   (tokens — cheap, streamable, cacheable in parts); the **user's own GPU
   composites it** at 60fps ([[concepts/scene-graph-approach]],
   [[concepts/client-side-compositing]]); raster richness comes from
   **cached generated assets** that amortize across users
   ([[concepts/asset-caching]]); and streaming makes the authorship visible
   ([[concepts/latency-and-streaming]]).
5. Therefore the same illusion is achievable at **near-zero marginal cost per
   user** — and on three of the four ingredients (frame rate, input latency,
   hit-testing accuracy) the cheap path is *better*, not merely cheaper.

## What would falsify this

- User tests showing the "wow" depends on properties unique to generated
  video (temporal texture, painterly incoherence) that compositing can't fake.
- Real-time video diffusion costs falling faster than expected, making the
  expensive path's economics acceptable before the cheap path matures
  (watch [[entities/ltx-studio]]-class models).
- Scene-graph authoring proving too hard for current LLMs (unsolvable
  constraints, ugly compositions) at production reliability.

## Current evidence

- Ingredients 1–3 reproduced in a single-file Canvas prototype with no model
  in the loop: [[sources/experiment-01-canvas-compositor]].
- Ingredient 4 (bespoke content) untested — needs an LLM emitting scene
  graphs live. **Next experiment.**

## The goal

Become a leading practitioner of cheap painted UI through small side projects
that perfect each ingredient, benchmarked and logged in `raw/experiments/`.
