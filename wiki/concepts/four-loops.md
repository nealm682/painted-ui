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

## Extensions

Swarms add writers, not loops: N agents are N interleaved patch streams
into the same node map ([[concepts/swarm-painting]]). The
[[concepts/choreographer]] sits between loops 3 and 4, turning semantic
patches into motion parameters in zero time.
