# The four loops

The architecture underneath every prototype in this wiki: four processes at
four speeds, decoupled through one piece of shared state (the node map).
Interactive explainers: `raw/experiments/exp-03-live-llm-painter/how-it-works.html`
(step-through) and `wiki/decks/why-four-loops.html` (the argument as slides).
This page is the linkable wiki home for the concept; lineage is properly
sourced in [[sources/game-loop-lineage]].

## The four

1. **Conversation** (~per interaction): one model call per request or
   click; clicks are messages, so the model mutates its own scene
   ([[concepts/interactivity-from-semantics]]).
2. **Network read** (~20–60×/s): `await reader.read()` delivers arbitrary
   text fragments with no boundary guarantees.
3. **Parser scan** (per chunk): brace-depth scan over a buffer emits
   exactly one patch per completed JSON object; incomplete tails wait.
   Hardened by the exp-03 run-1/run-2 failures
   ([[sources/experiment-03-live-llm-painter]]).
4. **Render** (display refresh, 60–144×/s): `requestAnimationFrame`
   redraws from current state and never waits for anything
   ([[concepts/client-side-compositing]]).

**The rule that joins them:** loops 1–3 *mutate* state; loop 4 *samples*
it. A node mounted mid-stream simply starts existing, and its enter
animation is a function of time-since-arrival — the overlap between
"still arriving" and "already animating" is the painted-live effect
([[concepts/the-illusion]], [[concepts/latency-and-streaming]]).

## Lineage (sourced)

The simulation/render decoupling is the canonical game-loop pattern —
Nystrom's fixed-update/variable-render and Fiedler's accumulator
("the renderer produces time and the simulation consumes it") — see
[[sources/game-loop-lineage]]. Painted UI's contributions on top: two
extra producer loops (conversation, network/parse), and treating the
producer/consumer rate mismatch as *visible choreography* instead of
hidden loading.

One crisp technical distinction from the lineage: game engines need fixed
time steps because physics *integrates* (error accumulates). Our tweens
are closed-form functions of elapsed time, so the compositor tolerates any
frame rate without instability — which is why four loops need no
scheduler, just the shared node map.

## The verifier: the loop the on-device platform makes necessary

Added 2026-07-25 from [[sources/on-device-inference-2026]]. Loop 3's
parser is a *syntactic* gate: malformed JSON never reaches the node map.
On device that gate disappears — platform guided generation makes
malformed output unemittable ([[concepts/on-device-models]]). What the
2026 SLM literature shows is that this does not remove errors, it makes
them **well-formed**: constrained sub-3B models produce far more
wrong-but-valid outputs than unconstrained ones. A patch that would once
have crashed the parser now renders, silently and confidently.

So the architecture needs a **semantic** gate where the syntactic one
used to be: a verifier sitting at the loop-3 boundary that rejects or
quarantines patches which are valid but incoherent against the current
node map. It is deterministic and inference-free — geometry and
reference checks, not judgment:

- node placed outside the viewport, or fully occluded by a later node
- text overflowing its container, or contrast below a legibility floor
- verb targeting an id that does not exist, or a scene diff that empties
  the screen
- a mutation that contradicts an in-flight animation on the same node
  (the interruption case — exp-14 territory)

Rejected patches don't have to be dropped: the honest options are
*quarantine and repaint from last-good*, or *return the violation to
loop 1 as a message*, which fits the wiki's existing rule that clicks are
messages — a failed check is just another event the director hears.
exp-09's self-healing loop was an ad-hoc instance of this idea; naming it
generalizes it.

Whether this is genuinely a fifth loop or a filter on loop 3 is open. It
runs at patch rate, not frame rate, and it mutates rather than samples —
which argues for "gate on loop 3." The claim that matters is
architectural, not nomenclatural: **the stronger the emission guarantee,
the more the system needs a cheap semantic check downstream of it.**

## Extensions

Swarms add writers, not loops: N agents are N interleaved patch streams
into the same node map ([[concepts/swarm-painting]]). The
[[concepts/choreographer]] sits between loops 3 and 4, turning semantic
patches into motion parameters in zero time.

On device the loop count falls rather than rises: loops 2 and 3 collapse
into a typed function call, and prefix KV caching collapses loop 1 into
resident memory — leaving a resident director, the verifier, and the
render loop ([[concepts/on-device-models]]).
