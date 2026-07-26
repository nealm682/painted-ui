# The Choreographer

The layer that decides *how* things move. In the theater metaphor of the
architecture: the **director** (LLM/agent) decides what exists and what
changes; the **choreographer** turns each semantic change into motion (verb,
duration, easing, stagger); the **painter** (compositor,
[[concepts/client-side-compositing]]) executes it at 60fps; the **stage** is
the shared node map of [[concepts/four-loops]]. Deep-dive with live demo:
`wiki/decks/the-choreographer.html`.

## Why it exists

Live runs of exp-03 ([[sources/experiment-03-live-llm-painter]]) showed model
verb-taste is variable and every transition hint costs tokens. Moving the
how-decision from model to local policy converts tokens (money, latency,
variance) into code (free, instant, deterministic). Five forces: taste
variance, token cost (~30–40% of scene output is transition hints),
brand consistency, testability (a pure function is CI-able), and
interruption handling (retargeting a tween must happen in one frame, not one
round-trip).

## Three architectures

**A — model picks verbs** (exp-03 today): highest ceiling, variable floor,
~700 tokens/scene. **B — local policy**: model emits semantic ops only;
policy maps position→direction, node-kind→verb, id-match→FLIP morph,
mood→tempo; ~400 tokens/scene, fully testable. **C — hybrid**: policy
default + per-scene `mood` + rare model overrides. Enterprise answer is B/C:
**the policy is a motion design system as versioned code.**

## Scalability position

The choreographer is what makes the cheap path enterprise-shaped: the parts
that scale hard (GPU, rendering, motion) cost ~nothing; the per-interaction
token cost is reducible by B/C and by on-device SLMs; declarative patches
are loggable, auditable, and compatible with allow-listed UI protocols
(e.g., agent-emitted declarative formats like Google's A2UI — see
[[concepts/a2ui-and-standards]] once sourced). Numbers live in
[[concepts/cost-model]].

## Output format: springs, not durations (added 2026-07-25)

From [[sources/m3-expressive]]. The choreographer currently returns a
uniform `{dur, ease}` for every property. Two changes, both
choreographer-side only — no protocol change, no token cost:

1. **Spatial vs effects.** Position, size, rotation, scale and corner
   radius *should* overshoot and bounce into place; opacity, colour and fx
   amounts *must not* — an overshooting opacity sails past full and reads
   as a flicker. The property being animated determines whether bounce is
   permitted. Roughly a two-line change and the fastest available upgrade
   to perceived physicality.
2. **Speed picks up two more axes.** Today duration scales by mood only
   (calm ×1.3 / neutral ×1.0 / energetic ×0.55). Add *element size* (small
   fast, full-screen slow) and *device class* (the token ordering is
   invariant; the absolute values differ for watch/phone/tablet). Both are
   local reads — free, and per [[concepts/on-device-models]] every decision
   kept out of the Director is now a correctness win, not just a cost one.

Full spec, the analytic solution, and a derived (ζ, stiffness) token table:
[[techniques/motion-physics]].

### Scope: springs are the default, not the only engine

Refined 2026-07-26 after exp-14. The choreographer compiles to **two**
backends, split by a rule crisp enough to remove the judgment call:

> **Springs own targets. Time tracks own paths.**

- **Spring** — the patch names a *destination* and the route is free:
  `add`, `update`, `remove`, `focus`, `scene`, every geometry or effects
  change. This is nearly everything, and all of it is interruptible.
- **Time track** — the patch names a *performance* whose trajectory is the
  content: `strokeIn` (drawn tip-first), `typeSet` (word cadence), `beam`
  and the gardener cycle (scripted ambience), camera moves through
  waypoints. There is no target to spring toward.

The split was already latent in the verb library and simply unnamed:
**state changes** vs **performances**. Which category a verb belongs to
predicts its backend, so no caller ever chooses.

This is the executor doctrine one level down — [[lint-2026-07-21]] §F
established that the choreographer is a compiler and canvas/rAF vs
WAAPI/View Transitions are *rendering* backends; targets-vs-paths is the
same idea applied to *motion* backends. Same compiler, more than one
target.

## Interruption — answered

The open question below ("retarget-vs-queue") had no good answer while the
output format was a duration-based tween: a closed-form tween carries no
velocity, so a mid-flight change of target either snaps or requires
reconstructing the derivative. A spring carries position **and** velocity,
so retargeting is four lines and the motion simply continues. That is
Material's stated reason for switching, and it is what unblocks exp-14
"Interrupt the Choreographer" ([[sources/chatgpt-motion-recommendations]]).
Crucially this costs nothing architecturally: the damped oscillator has an
exact analytic solution, so springs stay closed-form functions of elapsed
time and [[concepts/four-loops]]'s frame-rate tolerance is preserved.

## Quiescence — a policy the choreographer should own

Ambient motion (gardener cycle, idle breath) is deliberate here and
deliberately *discouraged* by Material's restraint guidance — a real
disagreement, recorded in [[sources/m3-expressive]]. It also has a battery
edge: ProMotion-class displays only downclock to ~10 Hz when content is
genuinely static, so perpetual ambience holds the panel at full refresh.
Proposed: a **quiescence policy** — true stillness after N seconds without
interaction, ambient motion budgeted rather than always-on — which
reconciles restraint, battery, and `prefers-reduced-motion` in one
mechanism.

## Open questions

Expressiveness ceiling of policy-only motion; ~~retarget-vs-queue
interruption semantics~~ (**answered above** — springs retarget; the
remaining question is what to do when a retarget would carry a node
*through* an occlusion); inferring `mood` from content; an A2UI→scene-graph
adapter so the same choreographer animates standard protocol messages
(exp-06 candidate); whether `importance` in the semantic envelope maps to
stiffness or to scheme selection; whether the quiescence threshold is fixed
or content-dependent.

## Sources

[[sources/experiment-02-transition-stream]] ·
[[sources/experiment-03-live-llm-painter]] ·
[[techniques/transition-choreography]]
