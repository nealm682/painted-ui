# exp-02 — streamed scene patches with transition choreography

**Date:** 2026-07-18 · **Status:** built, syntax-verified. Open `index.html`
in a modern browser; it auto-plays a ~18s loop; click to jump to the next
patch.

## Goal

Answer: "video-gen UIs dissolve, zoom, fly out — how do we replicate that
stream-like behavior?" Hypothesis: those behaviors are not properties of
video. They are properties of a **transition engine that never swaps state
instantly** — every change arrives as a patch with a transition verb, and
the compositor plays it as choreography.

## Architecture under test

```
[simulated agent] --patch ops over time--> [transition engine] --> canvas
```

The "agent" here is a scripted `STREAM` array (stand-in for LLM output).
Each patch is `{op, ...transition hints}`. The full grammar exercised:

| Video-UI behavior seen in Flipbook-style demos | Patch verb here |
|---|---|
| element dissolves in/out | `add/remove` + `{kind:"dissolve"}` |
| element zooms in | `add` + `{kind:"zoom"}` |
| element flies in/out | `{kind:"flyin"/"flyout", from/to:"left"/"right"}` |
| scene morphs (sun *becomes* moon) | `update` with tweened x/y/r/fill (shared-element/FLIP) |
| card expands to hero | `update` tweening w/h/x/y on the *same node* |
| ambience shifts (dusk→night) | `palette` patch, colors tweened globally |
| image "repaints" to a new one | `update img` → cross-dissolve, Ken Burns never pauses |
| text rewrites | `update text` + `crossfade:true` |

Key detail for the illusion: the Ken Burns drift on the card image **does not
stop during the cross-dissolve** — continuous motion through the swap is what
makes it read as repainting rather than as an image loading.

## Measurements

- Whole file: **11 KB** (compositor + transition engine + demo stream).
- The patch stream itself (the part an LLM would emit): **~2.4 KB** for an
  18-second, 20-op scene sequence ≈ **1.1 Kbit/s** — vs ~2,000 Kbit/s for a
  2 Mbps video stream of the same 18 seconds (~1,800× less, and it's
  resolution-independent and replayable).
- "Generated assets" are procedural stand-ins keyed by seed — exactly the
  slot a cached image-gen result would fill ([[concepts/asset-caching]]).

## Honest limitations

- Stream is scripted, not model-emitted; timing is authored, not token-paced.
  exp-03 should drive this from a real LLM streaming JSON patches.
- Transition verbs are hand-chosen per patch. Open question: can a model
  pick good verbs, or should a local "choreographer" policy pick them from
  patch semantics (added-at-edge → flyin; replaced-content → dissolve)?
- No runtime browser test in sandbox (no headless browser); `node --check`
  only.

## Next

- exp-03: real LLM emits the patch stream over SSE; mount ops as JSON closes.
- exp-04: choreographer policy — model emits only semantic ops, client picks
  transitions; compare felt quality vs model-chosen verbs.
