# exp-14 — Interrupt the Choreographer (spring vs tween comparison rig)

**Date:** 2026-07-26 · **Status:** built, logic-verified, awaiting field run.
Open `index.html`. Spec: [[techniques/motion-physics]]. Source that prompted
it: [[sources/m3-expressive]].

Number reconciliation: exp-14 was reserved by
[[sources/chatgpt-motion-recommendations]] for "Interrupt the
Choreographer." Springs turn out to *be* the interruption mechanism, so
this is that experiment rather than a new one — no orphaned number.

## What it demonstrates

A controlled A/B. One patch stream, two motion engines, same scene, same
targets, same frame loop, side by side:

- **Engine A — duration tween.** Today's choreographer output:
  `{from, to, t0, dur, ease}` with cubic in-out, exactly as exp-01/02/09/10
  implement it.
- **Engine B — analytic damped spring.** The closed-form solution from
  the technique page, stored as `(u₀, v₀, t₀, ζ, ω₀)` and evaluated at
  elapsed time.

Four probes:

1. **Move once** — no interruption. Both look fine; this is the control.
   The difference is only that B overshoots slightly and settles.
2. **Interrupt mid-flight** — retarget 150 ms into a 500 ms move. This is
   the whole experiment.
3. **Rapid fire ×5** — five retargets 180 ms apart, simulating rapid agent
   turns (the [[concepts/choreographer]] force that motivated the layer).
4. **Click either canvas** — direct manipulation. Click again before it
   lands. This is the version that convinces people in one gesture.

Plus two subordinate proofs: an **opacity overshoot test** (the
spatial-vs-effects rule, demonstrated rather than asserted) and a **token
explorer** with live ζ / stiffness dials reporting settle time, overshoot
and regime.

## The measurement

Perceptual claims are cheap, so the rig instruments the thing that actually
differs: **velocity of the hero card, sampled every frame**, plotted for
both engines with retarget instants marked. Two headline metrics:

- **velocity jump at retarget** — |v before − v after|
- **dead stops** — retargets where a moving node's velocity fell to ~zero

## Pre-run verification (headless, 2026-07-26)

The engines were re-implemented in Node from the same source and driven
through the interrupt scenario before the page was declared built:

```
retarget at t = 210 ms into a 0.24 → 0.76 move
TWEEN   before = 1893.3 px/s   after = 0.0 px/s   jump = 1893.3
SPRING  before =  131.3 px/s   after = 131.3 px/s   jump =    0.000
```

- **PASS** — the tween dead-stops at retarget.
- **PASS** — spring velocity is continuous through retarget (jump is
  exactly zero, not merely small: `v₀` is assigned from the evaluated
  velocity, so continuity is structural, not numerical luck).
- **PASS** — opacity peaks: spatial spring (ζ = 0.65) reaches **1.068**,
  effects spring (ζ = 1.00) reaches **1.000**. The overshoot rule is
  demonstrable, not just plausible.

The analytic solution itself was separately checked against numerical
integration when the technique page was written (ζ ∈ {0.55, 0.75, 1.0,
1.4}; agreement < 2×10⁻³ position, < 5×10⁻³ velocity).

## Finding while building: the two engines have opposite velocity profiles

Measured speed at various points into the same 0.24 → 0.76 move:

| t (ms) | spring px/s | tween px/s |
|---|---|---|
| 60 | 4013 | 155 |
| 120 | 2421 | 618 |
| 150 | 1406 | 966 |
| 210 | 131 | 1893 |
| 250 | 169 | 2683 |

**Springs front-load velocity; ease-in-out tweens back-load it.** A spring
leaves immediately and spends its time arriving; a cubic in-out tween
creeps out, peaks in the middle, and decelerates.

Two consequences, neither obvious before building the rig:

1. **Springs feel more responsive even with identical settle times**,
   because the first 100 ms — the window in which a user judges whether
   the interface reacted — carries almost all of the motion. That is a
   perceptual argument for springs *independent* of the interruption
   argument, and it's the one that matters for tap latency on device
   ([[concepts/on-device-models]]).
2. **The interrupt button had to be re-timed.** At the original 210 ms the
   spring was nearly settled while the tween was at peak speed, which made
   the comparison look like a speed contest. Moved to **150 ms**, where
   both engines are at comparable velocity, so the demo isolates
   *continuity* — the actual claim. Recorded because it is exactly the kind
   of accidental unfairness a comparison rig should be audited for.

## Lessons carried forward

Self-healing rAF loop with on-screen error reporting (exp-09), zero canvas
allocation inside the loop (exp-09/10), and no external resources.

## Open questions

- Does the tween's dead stop read as *wrong* to a naive viewer, or merely
  as *different*? The rig measures it; only a person can say it looks
  broken. First field run should answer this before the finding is claimed
  publicly.
- The rapid-fire case retargets faster than the spring settles — is the
  resulting continuous drift *better* or just *smoother*? There may be a
  legibility floor where continuity stops helping comprehension.
- Overshoot on `w`/`h` inside constraint containers is untested here (the
  hero card only moves in x/y). This is the unresolved tradeoff flagged in
  [[techniques/motion-physics]] §Fidelity — worth its own probe before
  containers ship with expressive springs.
- Should the *velocity graph* become a permanent instrument in the
  `runtime/` extraction? Motion regressions are otherwise invisible to CI,
  and a velocity trace is exactly the kind of thing a pure function can be
  asserted against.

## ⚠️ v2 (2026-07-26) — methodological correction + expressive components

### The correction

Neal ran the rapid-fire probe and asked why the tween "doesn't move as far."
It doesn't, and the reason exposed a flaw in v1's design.

**Mechanism.** Cubic ease-in-out spends its opening barely moving. At 180 ms
into a 500 ms tween it has delivered **18.7%** of the commanded distance.
The next retarget then restarts it *from rest* at that position, and it
begins the slow-in ramp again. Under rapid fire it never reaches the fast
middle of its own curve — it is permanently stuck in the first third.

Delivered fraction by interrupt timing (cubic in-out, 500 ms):

| interrupt at | delivered |
|---|---|
| 60 ms | 0.7% |
| 120 ms | 5.5% |
| 180 ms | 18.7% |
| 350 ms | 89.2% |

Because the ease is cubic, halving the interval cuts delivered distance
roughly eightfold. It degrades **catastrophically, not gracefully**, exactly
in the rapid-agent-turn regime that motivates [[concepts/choreographer]].

**But v1 was stacking the deck.** Most of that gap is specific to
ease-*in*-out. Cubic ease-*out* delivers **73.8%** in the same window. v1
compared springs against the single easing that fails hardest, which is not
an honest test. **v2 adds a third engine: cubic ease-out.**

### The result — and it is a better finding than v1's

Same scenario, all three engines through the shared `Prop` sampler
(playful scheme, ζ = 0.50, 180 ms interval, 700 px canvas):

| engine | distance | max velocity jump | final error |
|---|---|---|---|
| tween cubic in-out | 299 px | 1276 px/s | 0 px |
| tween cubic out | 1198 px | 2461 px/s | 0 px |
| analytic spring | 2453 px | **0 px/s** | 0 px |

**There is no easing that avoids both failures.** Front-load the curve and
you travel well but snap ~2× harder, because the tween is moving fastest at
the moment it gets dead-stopped. Back-load it and you snap softly but stall.
The spring does neither — not by tuning, but because velocity is *state*
rather than a function of scripted position.

Note all three finish at **0 px final error**. The tweens are not going to
the wrong place; they are going there *late*. The failure is temporal, which
is why it survives screenshot review and dies on contact with a hand.

### Expressive components added (Neal's request)

Three new panels applying the same sampler to real UI rather than an
abstract card:

- **Buttons** — `squish` (non-uniform scale) + `cornerMorph` (radius) on
  press, from the grammar-v2 Layer A addendum. Two spring buttons against
  one tween button. The spring buttons respond inside the first frames
  because springs front-load velocity; the tween button takes its ease-in
  ramp before anything visible happens, which is why it reads as *not having
  registered the press*. A readout prints `scaleY` at +50 ms so the
  difference is a number, not a vibe.
- **Button group** — one `{"op":"focus"}` patch expanded by the
  choreographer into 12 tweens across 4 nodes: spatial springs for scale and
  corner radius, an **effects** spring (ζ = 1) for opacity. The
  spatial/effects rule visible in a component rather than a swatch.
- **Typography** — the clearest demonstration of the **targets-vs-paths**
  rule filed on [[techniques/motion-physics]]. `typeSet` runs on a **time
  track**, because the word-by-word cadence *is* the content and there is no
  target to spring toward. Emphasis (`size`, `weight`, `opacity`) runs on
  **springs**, because a headline arriving at a new size has a destination
  and no opinion about the route — and can be interrupted by pressing the
  buttons in any order. Two engines, one page, boundary visible.

### Verification note

The unified `Prop` sampler was syntax-checked and behaviourally re-verified
headless (all three assertions pass: spring jump exactly zero; ease-out
snaps harder than ease-in-out; ease-out travels further). The full page
could **not** be machine-checked in place this session — the sandbox mount
served a truncated view of the file (25,640 of 25,953 bytes) while the host
file is complete at 729 lines. This is the second sandbox-quirk instance
recorded in `CLAUDE.md`; the host copy is authoritative. The self-healing
render loop reports any runtime error on-screen, which is the safety net for
exactly this situation.

## Open questions

- Does the tween's dead stop read as *wrong* to a naive viewer, or merely
  *different*? The rig measures it; only a person can say it looks broken.
- Does the **stall** read worse than the **snap**? v2 makes this askable for
  the first time: in-out stalls, out snaps. If naive viewers dislike the
  snap more, ease-out is the wrong tween default even though it travels
  better — and that inverts common practice.
- The rapid-fire case retargets faster than the spring settles — is the
  resulting continuous drift *better* or merely *smoother*? There may be a
  legibility floor where continuity stops aiding comprehension.
- Overshoot on `w`/`h` inside constraint containers is still untested here
  (the hero card only moves in x/y). Flagged in
  [[techniques/motion-physics]] §Fidelity.
- Should the velocity graph become a permanent instrument in `runtime/`?
  Motion regressions are otherwise invisible to CI, and a velocity trace is
  exactly what a pure function can be asserted against.

## Run log

*(awaiting Neal's first field run — record it here)*
