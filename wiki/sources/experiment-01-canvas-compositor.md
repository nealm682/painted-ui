# Source: exp-01 — scene-graph canvas compositor (own experiment)

**Citation:** own build, 2026-07-18.
Raw: `raw/experiments/exp-01-canvas-compositor/` (`index.html` + `notes.md`).
**Ingested:** 2026-07-18 (source #2)

## What it is

A single-file (~8 KB) Canvas2D compositor rendering a hand-authored scene
graph, built to test whether [[concepts/the-illusion]] ingredients 1–3 survive
without any pixel generation. No server, no model calls.

## Key results

- **Ingredient 1 (fluid layout):** percent/anchor layout, spring-resolved on
  resize — reads as redrawing, not snapping → supports
  [[concepts/fluid-layout]].
- **Ingredient 2 (live motion):** Ken Burns + particles + breathing +
  staggered build-in reveal, all client-side at 60fps target → supports
  [[concepts/client-side-compositing]].
- **Ingredient 3 (interactivity):** exact semantic hit-testing, instant local
  click feedback, and runtime *promotion* of a decorative node to interactive
  via a one-line scene patch → supports
  [[concepts/interactivity-from-semantics]].
- **Measured:** scene graph 1.25 KB sent once vs. ~15 MB/min/user for a
  conservative 2 Mbps 1080p24 stream — **~12,000× bandwidth advantage**,
  GPU-seconds ≈ 0 vs. a dedicated stream → filed in [[concepts/cost-model]].

## Limitations (flagged honestly)

Scene was hand-authored: proves the *compositor* side, not LLM authoring
(ingredient 4 of [[concepts/the-illusion]] remains untested — that's exp-02).
No painterly raster texture yet ([[concepts/asset-caching]] untested).
Runtime verified by inspection/syntax only in the build environment.

## Wiki pages touched

[[thesis]] · [[concepts/the-illusion]] · [[concepts/fluid-layout]] ·
[[concepts/client-side-compositing]] ·
[[concepts/interactivity-from-semantics]] ·
[[concepts/scene-graph-approach]] · [[concepts/cost-model]]
