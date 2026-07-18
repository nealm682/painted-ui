# The Illusion

**The core analytical claim of this wiki:** the feeling that a screen is
"being painted live by a model" is not one thing. It decomposes into exactly
four ingredients, and *none of the four requires generating pixels with a
model*. Flipbook ([[entities/flipbook]], [[sources/flipbook-thread]]) produces
all four as side effects of video generation; each can be produced directly,
on the client, for near-zero marginal cost.

If this decomposition is right, the expensive path is an implementation
detail, not the product. That is [[thesis]].

## The four ingredients

### 1. Fluid layout — "it reshapes to fit *my* window"

**What Flipbook does:** regenerates every pixel for the current canvas, so
illustrations reshape continuously with the window.
**What actually creates the feeling:** *continuous, animated* adaptation —
content redrawing itself to the new space, rather than snapping between
authored breakpoints.
**Cheap reproduction:** constraint/anchor/percentage layout over a
resolution-independent scene graph, with the resolve *animated* (springs, not
snaps). The animation is what upgrades "responsive" to "repainted."
→ [[concepts/fluid-layout]] · demonstrated in
[[sources/experiment-01-canvas-compositor]]

### 2. Live motion — "it's alive, not a page"

**What Flipbook does:** 24fps generation means literally nothing is ever
static; noise, drift, and temporal texture are intrinsic.
**What actually creates the feeling:** perpetual low-amplitude motion — the
absence of the frozen-pixel tell that marks every traditional UI.
**Cheap reproduction:** the client-side motion vocabulary — Ken Burns,
ambient particles, breathing affordances, cross-dissolves, morphs — at 60fps
on the user's GPU. Ironically the cheap path exceeds the original here:
60fps vs 24, with zero server cost.
→ [[concepts/client-side-compositing]]

### 3. Universal interactivity — "anything might respond to me"

**What Flipbook does:** infers what was clicked from pixels, so *any region*
can become interactive, including regions nobody predefined.
**What actually creates the feeling:** the collapse of the widget/decoration
distinction — the user stops being able to predict what's inert.
**Cheap reproduction:** a scene graph where every node carries semantic
identity. Hit-testing becomes exact and free; the model can *promote* any
node to interactive with a one-line patch; unmatched clicks fall back to a
model call carrying the hit node's semantics. Again arguably better than the
original: zero-latency hover feedback, no misidentified clicks.
→ [[concepts/interactivity-from-semantics]]

### 4. Bespoke content — "this was made just for me, just now"

**What Flipbook does:** every frame is conditioned on this user's session, so
by construction nothing is templated.
**What actually creates the feeling:** *evidence of authorship* — content
that references your context, compositions that don't look like a component
library, and visible assembly (the reveal) that implies work being done now.
**Cheap reproduction:** the model authors the scene graph per user (that part
is real, and cheap — it's tokens); raster texture comes from cached generated
assets with per-user recoloring/cropping ([[concepts/asset-caching]]); and
the streaming reveal makes the authorship visible
([[concepts/latency-and-streaming]]). This is the one ingredient where the
model genuinely creates per-user — but with tokens, not pixels.

## Interaction effects (why demos feel more than the sum)

- **2 covers for 4:** motion masks asset reuse — a cached image that drifts
  reads as fresher than a static unique one.
- **The reveal fuses 2 and 4:** watching layout stream in is simultaneously
  "live motion" and "proof it's being made now" — the single highest-leverage
  trick ([[concepts/latency-and-streaming]]).
- **3 depends on 1:** hit regions must reflow with layout, which a scene
  graph gives for free and pixel inference must re-infer.

## Falsifiable tells (how each ingredient breaks)

| Ingredient | The tell that kills it |
|---|---|
| Fluid layout | a snap/jump on resize; visible breakpoint |
| Live motion | any fully frozen frame; looped motion with visible period |
| Universal interactivity | a cursor that doesn't change over "obviously" clickable art; misfired click |
| Bespoke content | recognizing a stock component; identical art in a friend's session |

These tells are the test plan for every prototype in `raw/experiments/`.

## Status

Ingredients 1–3: reproduced in miniature in
[[sources/experiment-01-canvas-compositor]]. Ingredient 4: requires a live
model in the loop — the next experiment.
