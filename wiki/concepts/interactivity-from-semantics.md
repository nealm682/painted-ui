# Interactivity from semantics

[[entities/flipbook]] advertises "any region can become interactive"
([[sources/flipbook-thread]]) — the third ingredient of
[[concepts/the-illusion]]. In a pixels-only system, interactivity must be
*inferred*: a click at (x, y) lands on a frame, and the model must decide what
was clicked from visual context.

## The cheap inversion

A scene graph makes this trivial and *better*: every node carries identity and
semantics ("this blob is the `add-to-cart` affordance"), so hit-testing is
exact, instant, and free — standard point-in-shape tests on the client, no
model call. The model call happens only to decide *what happens next*, which
is the same call Flipbook has to make anyway.

| | Pixels (Flipbook) | Scene graph |
|---|---|---|
| Hit-testing | Model infers from frame | Exact geometric test, ~0ms, $0 |
| Hover states | Must be generated as video | Client-side, free |
| Wrong-target errors | Possible (inference) | Impossible (identity is explicit) |
| Latency to feedback | ≥ generation round-trip | 1 frame |

## The catch

"Any region can become interactive" also means Flipbook can make regions
interactive **that no one predicted** — the model retro-actively decides a
cloud in the illustration is clickable. To match this, the scene-graph
approach needs the model to be able to *promote* any existing node to
interactive after the fact (a cheap incremental scene-graph patch), and/or a
fallback path: unmatched clicks send (x, y) + node-under-cursor to the model.
Demonstrated in miniature in
[[sources/experiment-01-canvas-compositor]].

## Open questions

- What fraction of "emergent" interactivity is actually used vs. demo candy?
- Best protocol for click-fallback: send full scene graph context or just the
  hit node's semantic label?
