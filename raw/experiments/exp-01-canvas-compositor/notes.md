# exp-01 — scene-graph canvas compositor

**Date:** 2026-07-18 · **Status:** built, syntax-verified; open `index.html`
in any modern browser (needs `roundRect`, i.e. 2023+).

## Goal

Reproduce Flipbook illusion ingredients 1–3 with zero model calls and zero
server: a hand-authored scene graph (stand-in for LLM output) + a single-file
Canvas2D compositor (~8 KB total).

## What it demonstrates

1. **Fluid layout** — nodes are positioned by percent anchors and
   `anchorTo` relationships; on window resize, positions spring to the new
   solution instead of snapping. Resize the window and watch it *redraw*.
2. **Live motion** — Ken Burns drift/zoom on the hills illustration, twinkling
   particle field, breathing moon, staggered build-in reveal on load (nodes
   mount as if streaming in).
3. **Universal interactivity** — exact hit-testing from node geometry +
   semantics (HUD shows the semantic label under the cursor); instant click
   ripples (local feedback, no round-trip); and **runtime promotion**:
   clicking the moon (initially decorative) patches it to interactive and
   mounts a new labeled node with the reveal animation — the scene-graph
   answer to Flipbook's "any region can become interactive."

## Measurements

- Scene graph: **1.25 KB**, sent once per scene.
- Whole prototype incl. compositor: **8.1 KB**.
- Flipbook-style stream at a conservative 2 Mbps 1080p24: **15 MB/min/user**
  (38 MB/min at 5 Mbps).
- Bandwidth ratio for one minute on screen: **~12,000× in favor of the scene
  graph** — before counting GPU-seconds, which are ~0 vs. a dedicated stream.
- Render loop: Canvas2D, all effects in one rAF pass; targets 60fps (vs.
  Flipbook's 24). TODO: capture an fps trace on real hardware.

## Honest limitations

- Scene is hand-authored — says nothing yet about whether an LLM can emit
  good graphs (ingredient 4, next experiment).
- Fidelity is flat-vector; no painterly raster texture (needs asset-caching
  experiment).
- No runtime browser test in the build sandbox (no headless browser);
  syntax-checked with `node --check`. Verify visually on first open.

## Next

- exp-02: LLM emits the scene graph live over a stream; mount nodes as JSON
  closes (streaming reveal becomes real).
- exp-03: cached image assets slotted in as raster nodes + Ken Burns.
