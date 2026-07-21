# Technique: scene grammar v2 — the expressive protocol

*Design spec answering the full audit's two production-gap lists (visual
expressiveness + layout reliability, [[sources/audit-2026-07]]). Status:
designed, not yet implemented — exp-10 candidate, and the biggest single
lever on both the 6.5/10 visual score and token economics.*

## The unifying diagnosis

Every bullet in both audit lists traces to one root cause: **v1 makes the
model spend tokens on geometry.** A calendar means 35 hand-placed rects;
a beautiful card means many primitive nodes; a safe layout means the model
doing arithmetic. Geometry-by-token is expensive (tokens), fragile
(composition errors — see the exp-03 run log), and visually capped
("animated dashboards").

v2's principle: **tokens buy meaning; the client expands meaning into
geometry.** Three grammar layers do the expanding.

## Layer A — richer primitives (the paint)

| Primitive | Protocol sketch | Transition verbs it unlocks |
|---|---|---|
| `path` — vector shapes | `{"kind":"path","d":"M…","fill":…}` or parametric (`"shape":"wave","params":…}` | **strokeIn** — the path literally draws itself (dash-offset animation): the single most "being painted" verb possible |
| `mask` / clip on any node | `"mask":{"kind":"circle|wipe|brush","from":…}` | **maskReveal** — brush-shaped wipes (exp-09's radial bloom, generalized); irregular painterly edges |
| `blur` / `displace` effects | `"fx":[{"blur":8},{"displace":{"seed":3,"amt":6}}]` | **materialize** — blur→sharp settle; **inkBleed** — displacement decay on entry; heat-shimmer ambience |
| `grain` / texture fills | `"fill":{"tex":"paper|canvas|noise","tint":…}` | constant painterly surface; kills the "flat CSS" tell at zero tokens |
| layered raster assets | `{"kind":"image","asset":"watercolor cliff dawn","layer":"bg|mg|fg","parallax":0.3}` | **parallaxShift** on camera/scroll; cached across users ([[concepts/asset-caching]]) |
| typography constraints | `"text":{…,"maxW":0.4,"wrap":true,"fit":"shrink|ellipsis","minSize":0.014}` | **typeSet** — per-word rise/settle like type being set; guaranteed no overflow |

## Layer B — compound components (the catalog)

`{"kind":"card","props":{"title":…,"img":…,"tone":"warm"}}` — one node,
expanded client-side from a **registered catalog** into its full subtree
(frame, image, scrim, label, affordances). Consequences:

- **Token cost collapses:** a v1 card ≈ 60–90 tokens of primitives; a v2
  compound ≈ 15. The audit's dashboard problem (many nodes → many errors)
  shrinks proportionally.
- **Errors become unrepresentable:** the model can't misassemble a card
  it never assembles.
- **The enterprise story clicks in:** the catalog is org-supplied — the
  audit's "runtime for cinematic agent interfaces" needs exactly this
  (their primitive catalog + motion grammar, our choreographer enforcing
  it — [[concepts/choreographer]]).
- Compounds carry **compound-aware choreography**: a card knows how to
  enter (frame first, image blooms, label sets) without the model saying
  anything.

## Layer C — containers and constraints (the layout)

Replace naked viewport fractions with layout nodes that own placement:

```
{"kind":"stack","dir":"row","gap":0.02,"align":"center","wrap":true,
 "safe":true,"priority":["hero","list","aside"],"children":[…]}
```

Covering the audit's list: alignment (container property), intrinsic
sizing (children report preferred size; text measures itself), min/max
(`"w":{"min":0.15,"max":0.3}`), wrapping (container), grouping (subtree =
group; group-level enter/exit), safe areas (container insets), collision
avoidance (**by construction** — the container owns placement, so overlap
is unrepresentable), responsive priorities (drop/reflow order when space
shrinks — the exp-09 row→column restack, generalized and declarative).

The solver output feeds the same springs as today: **constraint re-solve
in, spring-animated settle out** — layout changes keep reading as
repainting ([[concepts/fluid-layout]]).

## Shared-element identity across scenes (the audit's ninth bullet)

Scene changes become **diffs, not replacements**: the model emits
`{"op":"scene","name":"detail"}` + nodes; the client matches by stable id
across the old and new scene — matched nodes **morph** (FLIP), unmatched
old nodes exit, new nodes enter, all choreographed. This is the
View-Transitions idea applied to a semantic scene graph — and it makes
*navigation itself* a painted transition (**pageMorph**). Combined with
[[concepts/experience-frontier]]'s camera op, multi-scene apps become one
continuous painting.

## Token economics (estimated, to verify in exp-10)

| Scene | v1 primitives | v2 grammar |
|---|---|---|
| 3-card gallery + title + CTA | ~700 output tokens | ~150 (1 stack, 3 compounds, 2 texts) |
| 30-cell calendar | ~2,400 (35 rects+texts, hand-placed) | ~80 (1 `grid` compound + events list) |
| scene→detail navigation | full re-emit | ~60 (diff only) |

Roughly **4–30× fewer tokens** while *raising* the visual ceiling — the
rare change that improves cost and quality in the same move. Also
compounds+containers shrink the constrained-decoding grammar for on-device
SLMs (fewer, higher-level productions).

## Layer D — intent verbs (expanded via source #7)

The reviewer's point: verbs still name IDs (`strokeIn tower`). One layer
up, the model emits *intent* — and [[sources/chatgpt-motion-recommendations]]
supplies the mature verb set: `reveal · compare · focus · expand ·
collapse · drillDown · return · filter · sort · replace · confirm · warn
· resolve · connect · group`. Each maps to an understandable visual
consequence (filter → excluded items leave toward the nearest boundary,
survivors close ranks; drillDown → details emerge from *inside* the
selected object; resolve → tension relaxes). The architecture underneath:
**~12 composable primitives** (fade/reveal/scale/slide/draw ·
morph/relayout/crossfade/sharedElement · emphasize/recede/pulse ·
expand/collapse/group/disperse) — intent verbs are *compositions* of
primitives, so the vocabulary scales without 40 bespoke animations.
exp-10's strokeIn/materialize slot in as members of the `draw` family.
Patches gain an optional **semantic envelope** —
`intent:{action,importance,cause,relationship}` — and scenes gain
**attention orchestration**: `{focalIds, supportingIds, backgroundIds,
attentionMode}`, which the choreographer translates into scale/contrast/
opacity/blur/depth/position. Hierarchy choreography (parent-first
entrances, sibling displacement, coordinated exits) extends Layer C
containers from layout grouping to motion grouping.

**Grammars AND themes (not "instead of"):** motion *grammars*
(analytical / editorial / organic / urgent) govern behavior — tempo,
easing family, stagger pattern, attention strength, interruption
behavior. *Themes* (ink / watercolor / blueprint / storybook) govern
appearance — how strokes and fills render. Orthogonal, both swappable:
a financial console is analytical+blueprint; a story app is
editorial+storybook.

## Themes — the same protocol, many hands (added after the follow-up)

The verb library's implementations are swappable as **themes**: Japanese
ink, watercolor, blueprint, architect sketch, oil, storybook, pixel art —
identical patch stream, different strokeIn/materialize/typeSet renderers.
This is the cleanest possible proof that painted UI is a *rendering
engine* rather than a demo, and the commercial shape of the org catalog
(a brand ships its theme). exp-11: one scene, a theme switcher, three
themes in Canvas2D (ink = pure strokes; blueprint = grid + white lines +
measurement marks; storybook = soft blobs + warm palette). The runtime
stack the reviewer sketched — Painted Runtime → Scene Grammar → Verb
Library → Renderer(Canvas|WebGL|native) — is the target architecture.

## Fidelity tradeoffs

The catalog trades open-endedness for reliability — emergent layouts the
catalog never imagined get harder (mitigation: Layer A stays fully open;
compounds are conveniences, not walls). Client complexity grows (a real
solver, an fx pipeline); the single-file ethos ends around here.

## Open questions

- Solver choice: full constraint system vs. flexbox-like containers
  (bet: containers + priorities cover 95% at 10% of the complexity).
- Can models use `priority` and `min/max` *well*, or does the
  choreographer-equivalent for layout (a "compositor policy") pick them?
- Where do compound definitions live for the graph — a `catalog.json`
  the wiki can lint against?
- strokeIn on Canvas2D (dash-offset) vs. needing WebGL — likely fine in
  Canvas2D; inkBleed/displace need offscreen buffers (exp-06 territory).

## Sources

[[sources/audit-2026-07]] · [[sources/experiment-03-live-llm-painter]]
(token/error evidence) · [[techniques/transition-choreography]] (v1 verbs)
