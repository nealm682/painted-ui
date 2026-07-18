# Technique: transition choreography over a patch stream

*First technique page — recipe distilled from
[[sources/experiment-02-transition-stream]].*

## What it emulates

The stream-like feel of video-generated UIs ([[entities/flipbook]]): elements
dissolve, zoom, fly out, morph into each other, and imagery "repaints." In
video gen these happen because the model literally paints every intermediate
frame. The technique reproduces them by banning instant state swaps: **every
change to the scene arrives as a patch carrying a transition verb, and a
client engine plays the in-between frames.**

## How to build it

1. **State = scene graph** ([[concepts/scene-graph-approach]]); node ids are
   stable across changes.
2. **Change = patch ops**, streamed: `add`, `update`, `remove`, `palette` —
   each with a transition hint (`dissolve | zoom | flyin | flyout | rise |
   shrink`, duration, easing, direction).
3. **Shared-element morphs for free:** an `update` that tweens x/y/w/h/fill
   on an existing id *is* the morph (FLIP-style). A card expanding to a hero
   and a sun becoming a moon are the same mechanism.
4. **Property tweening engine:** numeric props lerp; colors mix in RGB;
   text and images get dedicated crossfades. ~60 lines of code total.
5. **Never pause ambient motion.** Ken Burns/particle drift must run *through*
   transitions (an image cross-dissolving while it keeps drifting reads as
   "repainted"; pausing it reads as "loading") —
   [[concepts/client-side-compositing]].
6. **Stream pacing is the reveal.** Ops applied as they arrive turn network/
   token latency into visible composition — [[concepts/latency-and-streaming]].

## Cost profile

Measured in exp-02: an 18s, 20-op sequence is ~2.4 KB ≈ **1.1 Kbit/s vs
~2,000 Kbit/s** for 2 Mbps video (~1,800×), resolution-independent, cacheable
and replayable. Client cost: Canvas2D, trivial. Server cost between patches:
$0. Filed in [[concepts/cost-model]].

## Fidelity tradeoffs

- Transitions are parameterized, so extreme painterly in-betweens (a face
  melting into a landscape) are out of reach — video gen keeps that edge.
- Quality depends on verb choice. Two designs: model picks verbs (expressive,
  can be wrong) vs. a local **choreographer policy** derives verbs from patch
  semantics (consistent, less bespoke). Likely hybrid: policy default, model
  override.

## Open questions

- Can current LLMs choose transition verbs tastefully at production
  reliability?
- Minimal verb set that covers the observed Flipbook vocabulary?
- Interruption semantics: a new patch arriving mid-transition should retarget
  the tween, not queue (exp-02 retargets; needs stress-testing).
