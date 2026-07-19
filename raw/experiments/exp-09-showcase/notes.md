# exp-09 — the showcase

**Date:** 2026-07-19 · **Status:** built, syntax-verified. Open
`index.html`; it paints itself on load; `↻ repaint` replays.

## Why it exists

Direct response to the full audit's hardest finding (**visual proof
6.5/10** — "current scenes can still resemble animated dashboards…
rather than something truly painted") and to the two failed hands-on
probes on exp-08: "cannot tell the difference," and resizing "did not do
anything special."

## What it does, mapped to the critiques

| Critique | Answer in exp-09 |
|---|---|
| resize did nothing special | **True constraint re-solve with underdamped springs:** narrow the window and the three cards restack row→column, title/sun/pill recompose — everything *glides with a settle*, nothing snaps. This is ingredient 1 done properly (exp-08 omitted it). |
| couldn't tell it was "painted" | **A visible brush paints the scene:** a glowing brush travels the canvas; each element blooms radially from the brush's position. The build is unmistakably authorship, not loading. |
| "animated dashboard" feel | Layered painterly scene (sky wash, two parallax ridges, grain-textured card art), not just rects on a gradient. |
| needs to feel alive continuously | **The gardener, implemented:** ~52 s dusk↔night cycle — palette drifts, stars arrive, the sun wanes into a crescent moon; card imagery repaints itself every 14 s via cross-dissolve with Ken Burns never pausing; pill breathes; motes drift; camera breathes. |
| interactivity everywhere | Hover glow on cards; click card → hero morph (siblings yield), click again → restore; click sky → ripple + fireflies (decoration promoted by a click). |
| accessibility nod | `prefers-reduced-motion` respected — all ambient amplitudes scale down. |

## Honest scope

Scripted build (agent stand-in), not live model output — this is the
*compositor ceiling* demo: how good can painted UI look with today's
primitives plus brush-reveal and springs. Still Canvas2D: the audit's
shader-level levers (brush-stroke SDFs, watercolor bleed) remain exp-06
(WebGL) territory. If this still reads as "dashboard," that's important
signal that the primitive vocabulary — not the choreography — is the
binding constraint.

## Next

- Show it to the reviewer; their reaction recalibrates exp-08's painted
  condition (study resumes only when the painted condition is strong).
- exp-06 painterly WebGL verbs if the ceiling still isn't high enough.
- Port the brush-reveal + spring re-solve back into exp-03's live painter.
