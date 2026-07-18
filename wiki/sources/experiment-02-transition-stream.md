# Source: exp-02 — streamed scene patches with transition choreography (own experiment)

**Citation:** own build, 2026-07-18.
Raw: `raw/experiments/exp-02-transition-stream/` (`index.html` + `notes.md`).
**Ingested:** 2026-07-18 (source #3)

## What it is

An 11 KB single-file prototype: a scripted patch stream (stand-in for an LLM/
agent) drives a transition engine that plays every scene change as
choreography — dissolve, zoom, flyin/flyout, shared-element morph
(sun→moon, card→hero), global palette tween, text crossfade, and image swap
via cross-dissolve with Ken Burns running continuously through the swap.

## Key results

- The entire "stream-like" visual vocabulary of video-gen UIs mapped onto
  **8 patch verbs** — none require generated pixels → recipe filed as
  [[techniques/transition-choreography]].
- **Measured:** 18s / 20-op sequence ≈ 2.4 KB ≈ 1.1 Kbit/s, vs ~2,000 Kbit/s
  for 2 Mbps video — ~1,800× less data, resolution-independent → added to
  [[concepts/cost-model]].
- Design insight: continuous ambient motion through transitions is what
  separates "repainting" from "loading" → strengthens
  [[concepts/client-side-compositing]].
- Streaming ops as they arrive doubles as the progressive reveal →
  [[concepts/latency-and-streaming]].

## Limitations

Stream is scripted, not model-emitted (ingredient 4 of
[[concepts/the-illusion]] still untested — exp-03). Transition verbs
hand-chosen; the model-vs-choreographer-policy question is open.

## Wiki pages touched

[[techniques/transition-choreography]] · [[concepts/cost-model]] ·
[[concepts/client-side-compositing]] · [[concepts/latency-and-streaming]] ·
[[concepts/scene-graph-approach]] · [[thesis]]
