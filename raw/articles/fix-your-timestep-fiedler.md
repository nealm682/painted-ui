# Fix Your Timestep — Glenn Fiedler (clipped notes)

- **Source:** Game Physics series. https://gafferongames.com/post/fix_your_timestep/
- **Author:** Glenn Fiedler
- **Captured:** 2026-07-19 (structured notes, not a full copy)

## Structure of the argument

1. **Fixed delta time** is ideal *if* update time < frame budget and dt
   matches refresh — otherwise the simulation runs fast/slow.
2. **Variable delta time** (feed last frame's duration in) seems obvious
   and is a trap: simulation behavior depends on dt; springs explode, fast
   objects tunnel through walls. No simulation correctly handles arbitrary
   dt.
3. **Semi-fixed timestep:** clamp dt to a max; subdivide long frames.
   Introduces the **"spiral of death"** — if simulating X seconds costs
   more than X seconds of real time, falling behind causes more work,
   causing falling further behind. Mitigations: headroom, or clamp steps
   per frame (slow-motion beats lockup).
4. **The accumulator (the canonical pattern):** flip the viewpoint —

   > "the renderer produces time and the simulation consumes it in
   > discrete dt sized steps."

   Leftover time below dt persists in the accumulator across frames.
5. **The final touch — interpolation:** render
   `currentState*alpha + previousState*(1-alpha)` where
   `alpha = accumulator/dt`, eliminating the stutter of displaying a state
   from slightly-wrong times. Also the route to **determinism** (needed
   for lockstep networking).

## Why it's in this wiki

The accumulator inversion ("renderer produces time; simulation consumes
it") is the cleanest statement of the decoupling that painted UI borrows:
in exp-01/02/03 the *token stream produces structure and the render loop
consumes state*, each at its own rate. Fiedler's interpolation-between-
states is the same trick as our tween sampling; his determinism argument
is the same one behind the choreographer-as-pure-function. See
`wiki/sources/game-loop-lineage.md`.
