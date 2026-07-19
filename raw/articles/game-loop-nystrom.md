# Game Loop — Robert Nystrom (clipped notes)

- **Source:** Game Programming Patterns, "Game Loop" chapter (Sequencing
  Patterns). https://gameprogrammingpatterns.com/game-loop.html
- **Author:** Robert Nystrom · © 2009–2021 · free-to-read web edition
- **Captured:** 2026-07-19 (structured notes, not a full copy — text is the
  author's; quotes kept short and attributed)

## Intent (verbatim, attributed)

> "Decouple the progression of game time from user input and processor speed."

## Structure of the argument

1. **Batch → interactive → event loop → game loop.** Word processors block
   on `waitForEvent()`. Games cannot: "games keep moving even when the user
   isn't providing input." The first key property: *process input without
   waiting for it*.
2. **The naive loop** `processInput(); update(); render();` spins at
   hardware speed — game speed depends on the machine (the old "turbo
   button" problem). Second key property: *consistent speed across
   hardware*.
3. **Progression of designs:**
   - Fixed step + sleep: simple, power-friendly, but slows down when a
     frame takes too long.
   - **Variable (fluid) time step:** scale movement by elapsed real time.
     Adapts both directions BUT becomes **non-deterministic and unstable**
     — floating-point error accumulates differently at different frame
     rates (his two-player bullet example); physics damping tuned for one
     step size blows up at others. "Only here as a cautionary tale."
   - **Fixed update step, variable rendering (the canonical answer):**
     accumulate elapsed real time into `lag`; run `update()` in fixed
     `MS_PER_UPDATE` steps until caught up; render whenever. Rendering
     "captures an instant" so it tolerates variable timing; simulation
     doesn't, so it gets the fixed step.
4. **Residual lag interpolation:** pass `lag / MS_PER_UPDATE` (0..1) to
   `render()` so the renderer extrapolates between simulation states —
   smooth motion despite update/render running at different rates.
5. **Browser note:** "the event loop will run the show… you'll call
   something like `requestAnimationFrame()`" — the platform owns the loop.

## Why it's in this wiki

This is the canonical prior art for the painted-UI four-loop architecture:
simulation (for us: patch application + tweens) and rendering deliberately
run at different rates, meeting only through state. Nystrom's `lag`
interpolation is structurally the same move as our tweens sampling
time-since-patch. See `wiki/sources/game-loop-lineage.md`.
