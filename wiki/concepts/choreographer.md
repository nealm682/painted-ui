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

## Open questions

Expressiveness ceiling of policy-only motion; retarget-vs-queue interruption
semantics under rapid agent turns; inferring `mood` from content; an
A2UI→scene-graph adapter so the same choreographer animates standard
protocol messages (exp-06 candidate).

## Sources

[[sources/experiment-02-transition-stream]] ·
[[sources/experiment-03-live-llm-painter]] ·
[[techniques/transition-choreography]]
