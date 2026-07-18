# The scene-graph approach (the central cheap technique)

The model emits a **resolution-independent scene description** — nodes with
shapes, styles, semantics, constraints, and motion hints — and a compositor
on the client renders it. The model paints *intent*; the user's GPU paints
pixels.

## Why this reproduces the illusion

Each ingredient of [[concepts/the-illusion]] maps to a scene-graph feature:

| Ingredient | Video diffusion gets it by… | Scene graph gets it by… |
|---|---|---|
| Fluid layout | regenerating pixels per window size | constraint solving per resize ([[concepts/fluid-layout]]) |
| Live motion | 24fps generation | client-side animation ([[concepts/client-side-compositing]]) |
| Universal interactivity | inferring clicks from pixels | exact semantic hit-testing ([[concepts/interactivity-from-semantics]]) |
| Bespoke content | conditioning on session | model authors the graph per user; assets cached ([[concepts/asset-caching]]) |

## Cost profile

Tokens per interaction, then **$0 while the user looks, resizes, hovers, and
plays with motion** — the client renders indefinitely without the server.
Contrast [[concepts/video-diffusion-approach]]: cost accrues every second the
screen is on. Numbers: [[concepts/cost-model]].

## What the model actually emits

Options along a spectrum, roughly increasing fidelity:

1. Existing declarative UI (HTML/SVG) — cheapest, but looks like a website.
2. Custom scene-graph JSON (shapes, gradients, blobs, particles, constraints,
   animation hints) — the sweet spot; first tested in
   [[sources/experiment-01-canvas-compositor]].
3. Scene graph + generated raster assets ([[concepts/asset-caching]]) — for
   painterly texture no vector primitive provides.
4. Drawing-program traces (stroke-by-stroke replay) — maximizes the "being
   painted" feel during reveal ([[concepts/latency-and-streaming]]).

Related standardization efforts: [[concepts/a2ui-and-standards]] (page TODO —
create when a source is ingested).

## Open questions

- Minimal primitive set that doesn't read as "just a website"?
- Can streaming partial scene graphs animate in as they arrive (the reveal
  *is* the loading state)?
- Where's the fidelity ceiling vs. true video diffusion?
