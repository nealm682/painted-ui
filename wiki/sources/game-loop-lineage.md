# Source: the game-loop lineage (Nystrom + Fiedler)

**Citations:**
- Nystrom, R. "Game Loop," *Game Programming Patterns*.
  https://gameprogrammingpatterns.com/game-loop.html
  Raw notes: `raw/articles/game-loop-nystrom.md`
- Fiedler, G. "Fix Your Timestep."
  https://gafferongames.com/post/fix_your_timestep/
  Raw notes: `raw/articles/fix-your-timestep-fiedler.md`

**Ingested:** 2026-07-19 (source #5 — one lineage in two documents)

## Key takeaways

1. **The core decoupling is canonical, 15+ years old, and battle-tested.**
   Nystrom: decouple game time from input and processor speed; run
   simulation at a fixed step, render at whatever rate the hardware gives,
   meet only through state. Fiedler supplies the sharpest formulation:
   *"the renderer produces time and the simulation consumes it in discrete
   dt sized steps."*
2. **Variable time step is a documented trap** (non-determinism,
   floating-point divergence, physics instability). Relevant to painted UI:
   our tweens are *closed-form functions of elapsed time* (position =
   f(t−t₀)), not integrators — which is why the compositor gets variable
   frame rates safely, sidestepping the instability that forces game
   engines to fixed steps. This distinction is worth keeping crisp when
   explaining the architecture.
3. **Interpolation between states** (Nystrom's `lag/MS_PER_UPDATE`,
   Fiedler's `alpha = accumulator/dt`) is structurally identical to our
   tween sampling in `cur(node, key)` — the render loop reading a
   continuous value between discrete state changes.
4. **Determinism as a design goal** (Fiedler, for lockstep networking)
   maps directly onto the [[concepts/choreographer]] argument: motion as a
   pure function is testable and reproducible.
5. **The browser owns the loop** (Nystrom's `requestAnimationFrame` note) —
   exactly loop 4 of [[concepts/four-loops]].

## What painted UI adds to the lineage

The game loop decouples *simulation* from *rendering*. Painted UI adds two
more producers upstream — a conversation loop and a network/parse loop —
and makes the *token stream itself* one of the time-producers. The reveal
aesthetic ([[concepts/latency-and-streaming]]) exists precisely because a
producer (LLM tokens) and a consumer (60fps render) run at wildly
different rates *and that mismatch is shown to the user as choreography
rather than hidden as loading.*

## Wiki pages touched

[[concepts/four-loops]] (created by this ingest) ·
[[concepts/choreographer]] · [[concepts/latency-and-streaming]] ·
[[concepts/client-side-compositing]] · [[concepts/swarm-painting]]
