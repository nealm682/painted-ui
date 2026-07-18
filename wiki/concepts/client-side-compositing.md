# Client-side compositing

Rendering the motion layer of [[concepts/the-illusion]] on the **user's own
GPU** via WebGL/Canvas/Skia/CSS — the reason the cheap path's marginal cost is
near zero ([[concepts/cost-model]]).

## The motion vocabulary

Techniques that make a static scene graph feel alive, roughly by cost:

- **Ken Burns** — slow pan/zoom on imagery; the cheapest "this is alive" signal.
- **Cross-dissolves & morphs** — state changes blend instead of snapping;
  reads as repainting, not re-rendering.
- **Spring-based layout resolve** — on resize/change, elements glide to new
  constraint solutions ([[concepts/fluid-layout]]).
- **Particle fields & ambient drift** — background elements with slight
  perpetual motion; kills the "static page" tell.
- **Progressive reveal / painterly build-in** — elements fade/wipe/stroke in
  as if being drawn ([[concepts/latency-and-streaming]]).
- **Breathing** — subtle scale/opacity oscillation on idle affordances.

All run at 60fps on integrated graphics; the entire vocabulary costs the
operator nothing per user.

## Evidence

First prototype implements Ken Burns, ambient particles, spring reflow, and
build-in reveal over a scene-graph in a single Canvas file:
[[sources/experiment-01-canvas-compositor]]. exp-02 adds the full transition
vocabulary (dissolve/zoom/flyout/morph/palette tween/image cross-dissolve)
driven by a patch stream, and establishes a rule: **ambient motion must keep
running through transitions** — an image that drifts while cross-dissolving
reads as repainted; one that freezes reads as loading
([[sources/experiment-02-transition-stream]],
[[techniques/transition-choreography]]). exp-03 drives the same engine from
live model output ([[sources/experiment-03-live-llm-painter]]).

## Open questions

- Which motion signatures do users actually associate with "model painting
  live" vs. generic web animation? (Needs user testing.)
- Canvas2D vs. WebGL vs. WebGPU breakpoints for particle-heavy scenes.
