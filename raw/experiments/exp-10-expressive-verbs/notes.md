# exp-10 — expressive verbs (scene grammar v2, Layer A, in pixels)

**Date:** 2026-07-19 · **Status:** built, syntax-verified. Open
`index.html`. Companion pitch sample: `/pitch.html` uses the same verbs in
miniature.

## What it demonstrates

The answer to "do we need more code for the new movements?" — yes, but
each verb is written ONCE in the compositor; the protocol only names it.
Verbs implemented (~30–50 lines each):

- **strokeIn** — vector paths draw themselves tip-first (partial-length
  polyline; the brush rides the tip). The lighthouse, coastline, sun, and
  detail lines are *sketched* before anything is painted — the single
  most "being painted" behavior yet built.
- **materialize** — fills arrive blurred (`ctx.filter`) and settle sharp.
- **inkSettle** — positional jitter decays as the pigment "dries."
- **maskReveal** — radial washes (the sky) from a brush origin.
- **typeSet** — title words rise into place one at a time.
- **beam** — a rotating light cone (screen-blend gradient wedge) from the
  lighthouse lamp: continuous, cheap, mesmerizing.

Sequence: sketch pass (line art) → paint pass (fills materialize) →
typeSet → the lamp turns → the scene lives (waves undulate, birds cross
as two-stroke paths, gardener dusk→night, water ripples on click).
Springy anchors re-compose the whole composition on resize
(wide: lighthouse right / narrow: centered, sun to the corner).

## Lessons carried forward from exp-09's freeze

Self-healing render loop (per-frame try/catch, always re-arms, on-screen
⚠ reporting, watchdog restart) and **zero canvas allocation in the loop**
— this scene is pure vector/procedural; there is no raster cache to leak.

## Why this attacks the 6.5/10

exp-09 was a *gallery that behaved beautifully*; exp-10 is a *drawing
that comes into existence*. If a viewer still says "dashboard," the
next escalation is WebGL brush texture (exp-06). But sketch-then-paint
is qualitatively different from anything a component library does.

## Open questions

- strokeIn pacing: constant speed vs. eased per-stroke (current: eased) —
  which reads more "hand-drawn"?
- Should the model control stroke ORDER (composition intent) or the
  choreographer (policy)? Currently scripted; exp-10b = live model
  emitting {"verb":"strokeIn","shape":"lighthouse"} compounds.
- ctx.filter blur performance on low-end machines — needs a check.

## Run log

### [2026-07-19] Run 1 (Neal) — works; typeSet overlap bug → fixed

Confirmed working on first field run (sketch → paint → beam → alive).
One bug: title/subtitle words overlapped ("HarborLight"). Cause: typeSet
positions words with centered math but `ctx.textAlign` was never set —
canvas default (left) shifted every word half a width right. Fix:
`ctx.textAlign="center"` in the verb. Lesson for the verb library:
**verbs must own their full canvas state** (font, align, baseline,
composite), never inherit it — same class of bug as run 2's ".5 decimals":
implicit defaults are protocol bugs too.
