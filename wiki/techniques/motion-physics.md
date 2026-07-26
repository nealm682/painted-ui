# Technique: motion physics — springs as the choreographer's output

*Filed 2026-07-25 from [[sources/m3-expressive]]. Status: designed, not yet
implemented — exp-15 candidate. Replaces duration+easing as the
choreographer's output format, and is the mathematically correct home for
the interruption demo already planned as exp-14.*

## What it emulates

The "physical expression" half of the painted-live feeling: elements that
arrive with weight, settle rather than stop, squash under a press, and —
critically — **change direction mid-flight without snapping** when the
Director changes its mind. Video diffusion gets this for free because it
renders continuous motion. Duration-based tweens do not: a tween is a
scripted path from A to B, and a new instruction mid-path is a
discontinuity you have to hide.

Material 3 Expressive replaced its entire easing-and-duration system with
springs in May 2025 and gave the reason directly: springs "handle gestures,
interruptions, and retargeting animations seamlessly"
([[sources/m3-expressive]]). That is the property painted UI needs and does
not currently have.

## The two families (adopt this rule first)

The highest-value, lowest-effort finding on this page:

| Family | Animates | Overshoot? |
|---|---|---|
| **Spatial** | x, y, w, h, rotation, scale, corner radius, path vertices | **yes** — overshoot and bounce into place |
| **Effects** | opacity, colour, blur, any fx amount | **never** |

The reason is perceptual, not stylistic. Overshooting a position reads as
mass and momentum. Overshooting opacity reads as a *flicker* — the value
sails past full, clips, and comes back. Same for colour: overshoot leaves
the gamut and clamps. So the property being animated determines whether
bounce is permitted, and that is a rule the choreographer can apply with no
model involvement and no extra tokens.

Today's [[concepts/choreographer]] returns one uniform `{dur, ease}`
regardless of property. This split is roughly a two-line change and it is
the fastest available upgrade to perceived physicality.

The rule is visible in Material's own published curve approximations: every
*spatial* curve has a control-point y above 1.0 (1.67 / 1.29 / 1.21 / 1.06
= overshoot), every *effects* curve caps at exactly 1.00.

## How to build it — the analytic damped spring

The objection from [[concepts/four-loops]] is real and must be answered:
painted UI's tweens are **closed-form functions of elapsed time**, not
integrators, which is precisely why the compositor tolerates any frame rate
without the instability that forces game engines into fixed time steps
([[sources/game-loop-lineage]]). Naive spring implementations integrate
per frame and give that property up.

They don't have to. A damped harmonic oscillator has an exact analytic
solution. Store `(u₀, v₀, t₀)` per animated property and evaluate at
`t − t₀` — same shape as the existing tween sampler, same frame-rate
tolerance, no accumulated error.

With **u = value − target** (displacement from rest), damping ratio **ζ**
and natural frequency **ω₀**:

**Underdamped, ζ < 1** (the spatial case — this is the one that bounces):

```
ωd = ω₀·√(1 − ζ²)
A  = u₀
B  = (v₀ + ζ·ω₀·u₀) / ωd
E  = e^(−ζ·ω₀·t)

u(t) = E · [ A·cos(ωd·t) + B·sin(ωd·t) ]
v(t) = E · [ (B·ωd − ζ·ω₀·A)·cos(ωd·t) − (A·ωd + ζ·ω₀·B)·sin(ωd·t) ]
```

**Critically damped, ζ = 1** (the effects case — fastest approach with zero
overshoot):

```
c = v₀ + ω₀·u₀
u(t) = (u₀ + c·t) · e^(−ω₀·t)
v(t) = e^(−ω₀·t) · [ c − ω₀·(u₀ + c·t) ]
```

**Overdamped, ζ > 1** (rarely wanted; included for completeness):

```
r₁ = −ω₀·(ζ − √(ζ²−1))     r₂ = −ω₀·(ζ + √(ζ²−1))
c₁ = (v₀ − r₂·u₀)/(r₁ − r₂)   c₂ = u₀ − c₁
u(t) = c₁·e^(r₁·t) + c₂·e^(r₂·t)
v(t) = c₁·r₁·e^(r₁·t) + c₂·r₂·e^(r₂·t)
```

Then `value(t) = target + u(t)`.

*Verified 2026-07-25 against numerical integration across ζ ∈ {0.55, 0.75,
1.0, 1.4}, ω₀ ∈ {8, 20} and three initial-condition pairs — agreement to
<2×10⁻³ in position and <5×10⁻³ in velocity.*

Parameterisation note: with unit mass, **ω₀ = √stiffness** and **ζ = damping
ratio**, which is exactly the `(dampingRatio, stiffness)` pair Compose
exposes — so Material's token values port directly.

### Retargeting — the whole point

```
retarget(prop, newTarget):
    u, v   = evaluate(prop, now)        # current displacement AND velocity
    prop.u0     = (value_now) − newTarget
    prop.v0     = v                     # ← velocity carries through
    prop.target = newTarget
    prop.t0     = now
```

Four lines. The animation never stops, never snaps, and never queues.
This is the mechanism behind **exp-14 "Interrupt the Choreographer"** — the
demo named in [[sources/chatgpt-motion-recommendations]] as the thing video
generation cannot do interactively. It was blocked on exactly this: a
closed-form tween has no velocity to carry.

### Settling

Springs converge asymptotically, so stop explicitly: retire the animation
when `|u| < ε` and `|v| < εv` (ε ≈ 0.002 of the property's range works).
Retiring matters for more than tidiness — see the quiescence note below.

## The token table (derived, ready to use)

Material publishes durations, not spring constants, for the web. These
(ζ, stiffness) pairs were solved to settle at those published durations,
then checked for overshoot:

**Expressive scheme**

| Token | ζ | stiffness (ω₀²) | settles | overshoot |
|---|---|---|---|---|
| `spatial.fast` | 0.72 | 462 | 0.35 s | 3.8% |
| `spatial.default` | 0.68 | 371 | 0.50 s | 5.4% |
| `spatial.slow` | 0.65 | 233 | 0.65 s | 6.8% |
| `effects.fast` | 1.00 | 3192 | 0.15 s | 0 |
| `effects.default` | 1.00 | 1806 | 0.20 s | 0 |
| `effects.slow` | 1.00 | 798 | 0.30 s | 0 |

**Standard scheme** (utilitarian — same durations, bounce removed)

| Token | ζ | stiffness | settles | overshoot |
|---|---|---|---|---|
| `spatial.fast` | 0.90 | 281 | 0.35 s | 0.2% |
| `spatial.default` | 0.90 | 138 | 0.50 s | 0.2% |
| `spatial.slow` | 0.90 | 60 | 0.75 s | 0.2% |
| `effects.*` | 1.00 | as above | — | 0 |

**Six tokens per scheme. That's the whole vocabulary.** ζ is the
expressiveness dial: lower = more bounce. A "playful" scheme at ζ ≈ 0.5 and
an "urgent" scheme at ζ ≈ 0.85 with higher stiffness both drop in without
touching a single call site.

### Why this is the grammars/themes split again

Material applies the *scheme* at product level, not per animation — token
names never mention it, so schemes swap without touching assigned tokens.
That is [[techniques/scene-grammar-v2]]'s motion-grammars-vs-themes
distinction, arrived at independently and shipped. Convergent validation,
and a useful discipline check: they solved this with **six tokens**, not
forty knobs.

It is also the choreographer-as-compiler doctrine in someone else's
codebase: the caller names a token, never a duration; the model names an
intent, never a token.

## Speed selection — three local axes, zero tokens

The choreographer currently scales duration by *mood* only (calm ×1.3 /
neutral ×1.0 / energetic ×0.55). Material adds two more axes, both
computable locally:

1. **Element size** — small components fast, partially-covering default,
   full-screen slow. In our scene graph that's a direct read of `w·h`
   against the viewport; the mapping can be a two-threshold function.
2. **Device class** — the *ordering* of tokens is invariant (fast is always
   faster than default) but absolute values differ for watch / phone /
   tablet, "to ensure the movement feels fast in the context of the
   device." A per-device stiffness multiplier, resolved at startup.

Both are free: no tokens, no model call, no round trip. They fit the
on-device work in [[concepts/on-device-models]] directly — this is more
judgment moved out of the Director and into deterministic local code, which
on device is a *correctness* win and not only a cost one.

## Shape as physical expression

Material's May-2025 shape update pairs with the physics system: 35 shapes
with built-in morphing, plus corner-radius tokens, and the principle that
morph should **respond to interaction** and communicate interaction state,
work in progress, and environmental change (their list of interactions to
consider: tap, swipe, scroll, release, long-press).

Painted UI has `pageMorph` and shared-element identity, and Layer A `path`
primitives — but no named vocabulary for **silhouette and corner radius as
animated properties**. Proposed additions to
[[techniques/scene-grammar-v2]] Layer A / the verb library:

| Verb | Behavior | Spring family |
|---|---|---|
| `squish` | corner radius + non-uniform scale under press, released on lift | spatial, fast |
| `cornerMorph` | radius per corner animates to a new set (asymmetric silhouettes) | spatial, default |
| `shapeShift` | interpolate between two closed paths by point correspondence | spatial, slow |

All three are cheap: a radius is one number, and path morphing is vertex
interpolation once correspondence is fixed. All three are *spatial*, so
they overshoot — which is exactly what makes a press feel like it has a
material under it.

Two of their principles are worth adopting verbatim because they constrain
our catalog: **shape is versatile, not semantic** (don't bind one silhouette
to one meaning — the choreographer picks shape from intent, so this falls
out naturally), and **use abstract shapes sparingly**. Their "shape can be
2.5D — apply motion and shape differently on each layer" is our parallax
layering, independently confirmed.

## Cost profile

- **Tokens: zero.** Springs are entirely choreographer-side. The Director
  emits the same semantic patches it emits today; nothing in the protocol
  changes. This is a pure client upgrade — it does not touch grammar v2, the
  wire format, or the model prompt.
- **CPU: negligible.** Two transcendental calls per animated property per
  frame, on a handful of properties per node. Comparable to the existing
  cubic-ease sampler.
- **Implementation: small.** One sampler function plus a token table.
  Belongs in the `runtime/` extraction ([[lint-2026-07-21]] §E) rather than
  being copied a thirteenth time.
- **Battery: watch this one.** See below.

## Fidelity tradeoffs and honest tensions

**1. Springs have no fixed duration.** Choreographed sequences that rely on
"this finishes at 800 ms so the next thing starts then" need rethinking as
either stagger offsets or completion callbacks. Settling time is
predictable per token (tabled above) but not exact under retargeting —
which is the price of interruption tolerance.

**2. Overshoot can break layout guarantees.** A spatial spring on `w`
overshoots *past* the target width, which can collide with a neighbour that
[[techniques/scene-grammar-v2]] Layer C containers promised would never
overlap. Either clamp collision-critical properties to ζ = 1, or let
containers reserve overshoot headroom. Unresolved; flag it before shipping
container-driven layouts with expressive springs.

**3. ⚠️ Their restraint doctrine conflicts with our ambient-motion
doctrine.** Material cautions that shapes and effects "without clear meaning
behind why they're different can add more visual clutter than delight," and
caps hero moments at one or two per product. Painted UI's gardener cycle
and idle breath are *deliberately* decorative — the painter never stops. We
are optimising for a different thing (the illusion of being painted) than
they are (hierarchy and task speed). Both positions are defensible; this
page records the disagreement rather than resolving it.

The tension now has a hardware edge as well. ProMotion-class displays drop
to as low as 10 Hz when content is static, and that is where the battery
saving lives; continuous ambient motion holds the panel at 120 Hz
indefinitely. **A quiescence policy** — true stillness after N seconds
without interaction, ambient motion as a budgeted choice rather than an
always-on default — reconciles the restraint doctrine, the battery cost,
and `prefers-reduced-motion` in a single mechanism. Proposed as a
first-class choreographer policy, not an afterthought.

**4. Accessibility.** `prefers-reduced-motion` maps cleanly: force ζ = 1 on
every family and shift one speed tier faster. Motion remains coherent
rather than being switched off wholesale.

## Open questions

- Do Material's published durations transfer to a *painterly* canvas, or
  does canvas motion want slower settling than component motion? (Their
  values are tuned for widgets on a compositing UI toolkit.)
- Overshoot on `w`/`h` inside constraint containers — clamp, or reserve
  headroom? (Tradeoff 2 above.)
- Does the semantic envelope's `importance` field map to *stiffness* (more
  urgent = snappier) or to *scheme selection*? Stiffness is the smaller,
  more composable answer; untested.
- Do intent verbs pick a scheme, or does the scene-level `mood`/`tempo`
  own it exclusively? Two owners for one dial invites drift.
- Point correspondence for `shapeShift` between paths with different vertex
  counts — resample both to a fixed N, or match by arc length?
- Is the quiescence threshold a fixed N seconds, or content-dependent
  (a "still" scene quiesces sooner than a "living" one)?
- Should the *verifier* ([[concepts/four-loops]]) know about springs — i.e.
  is "this patch retargets a property mid-overshoot into an occlusion" a
  checkable condition, or unavoidably a judgment call?

## Sources

[[sources/m3-expressive]] (the system, tokens, shape principles, research)
· [[sources/game-loop-lineage]] (why closed-form matters) ·
[[sources/chatgpt-motion-recommendations]] (interruption as exp-14) ·
[[concepts/choreographer]] · [[techniques/scene-grammar-v2]]
