# Swarm painting — multiple agents, one canvas

Filed from a query (2026-07-19): what do simultaneous agent swarms unlock
for painted UI?

## The structural insight first

**Swarming is the cheap path's unfair advantage.** On the video-diffusion
path ([[concepts/video-diffusion-approach]]), N agents painting one screen
means N GPU streams — economically impossible. On the patch path, N agents
are just N interleaved KB-scale streams merged into one node map
([[concepts/scene-graph-approach]]). The four-loop architecture doesn't
change at all: more writers, same stage, same painter. Swarms are where the
two approaches diverge from "cheaper" to "categorically possible vs not."

## Six swarm patterns

1. **Sectional orchestra.** Each agent owns a layer or region: an ambience
   agent tends background/palette, a data agent paints the numbers, a
   narrative agent handles titles/copy. Patches carry an `agent` field;
   z-bands per agent prevent collisions. Slow agents patch rarely (idle =
   $0); fast ones stream. The screen becomes a place where several minds
   visibly work at different tempos.
2. **The studio pipeline.** Director (content) → stylist (palette/type
   patches) → choreographer-agent (motion overrides,
   [[concepts/choreographer]]) → critic (reads scene stats or screenshots,
   issues correction patches). Same stream, pipelined. This is
   agent-team-as-art-studio, and every stage is auditable because every
   contribution is a declarative patch.
3. **Speculative pre-painting.** Small agents paint *likely next states*
   into hidden layers while the user reads: hover a card and its expanded
   scene already exists — click is a 0ms morph, not a round-trip. Perceived
   latency goes negative; the UI feels psychic. (The killer app of cheap
   parallel agents + [[concepts/latency-and-streaming]].)
4. **Competitive drafts.** Two or three small models draft alternative
   scenes in parallel; a judge (or the user) picks; the client crossfades
   to the winner. Taste through tournament rather than through one big
   model's first attempt.
5. **The gardener.** One slow ambient agent tends the scene forever —
   palette drifts with time of day, stale data visibly wilts, fresh data
   blooms. A patch every 30 seconds costs ~nothing; the screen reads as
   *alive between interactions*, which extends ingredient 2 of
   [[concepts/the-illusion]] from motion to *change*.
6. **Shared canvases.** Scene graphs merge; video streams don't. Multiple
   users' agents painting one scene = collaborative painted dashboards,
   with per-agent motion signatures making authorship visible (swarm
   activity as theater, observability as UX).

## Protocol implications (for exp-07+)

Patches gain `agent`, `layer`, `priority`. Conflict rule candidates: node
ownership by creator; last-writer-wins per property; arbiter agent for
contested nodes. Interruption already retargets tweens
([[techniques/transition-choreography]]) — swarms just make retargeting
constant.

## Open questions

Does visible multi-agent activity delight or distract? What's the collision
rate at N agents on realistic scenes? Can the critic agent measurably
improve composition (needs a scoring rubric)?
