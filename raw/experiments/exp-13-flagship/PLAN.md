# exp-13 — the flagship: putting it all together

**Status:** plan (2026-07-21). Builds on exp-12's Strands+React app.
**Goal:** one demo that shows the whole thesis — streaming, semantic
mutation, shared identity, hierarchy, attention, narrative choreography,
reversibility, local rendering — on a real agent workflow.

## The generality decision (settled)

- **The runtime is general; each demo is domain-scoped.** exp-12's catalog
  (metric/card/table/text/actions) is already domain-agnostic; only the
  persona paragraph and seed data are HR-specific.
- Fully open "paint anything" agent: rejected — unbounded content shapes
  break choreography reliability and make demos unpredictable.
- **Domain packs** instead: `{persona, seedData, vocabulary}` swappable at
  ~30 lines each. Default pack: **harbor operations** (berth utilization,
  vessel arrivals, delay causes, weather warnings — on-brand with the
  lighthouse, employer-neutral per guardrail). Second + third packs
  (retail metrics, personal library/fitness) prove the engine claim via a
  domain switcher.
- The HR pack is retired from anything public.

## The golden-path narrative (from source #7, re-skinned)

Opening scene: four metrics (Berth Utilization, Avg Turnaround, Delayed
Arrivals, Weather Risk), a summary card, an arrivals table, recommended
actions. User asks: **"Why did delays increase?"**

1. `scene` patch: mode=investigate, focus=metric-delays → **focus**: the
   delays metric travels to focal position, number visually continuous
2. Siblings **recede** into a compact comparison rail (attention policy)
3. The arrivals table **transforms** into ranked delay-contributing berths
   (sort choreography — rows move along collision-free paths)
4. Top berth row **drillDown** → expands into a diagnostic panel from
   inside its own bounds (shared-element continuity)
5. **connect**: temporary visual threads to weather-risk and turnaround
   metrics (relationship field)
6. Two recommendations **reveal** sequentially in the actions area
7. A breadcrumb preserves the path; **"show the overview again"** →
   `return`: everything contracts back to origin, nothing lost
8. Mid-flight interruption test: ask a new question during step 3 —
   tweens retarget with velocity continuity, no snap (exp-12/14 material)

## Build phases

**Phase A — streaming foundation.** `server.py` gains SSE: stream Opus
output through the brace-depth parser server-side, emit each patch the
moment its object closes. Token pacing becomes visible in the dashboard —
the thesis's signature move, currently missing (backend waits for full
response). Also replaces the fragile fence-strip parsing.

**Phase B — choreographer v2 in the React frontend.** Honor the intent
envelope already flowing from the upgraded prompt: focus/recede (scene
attention → scale/opacity/position), drillDown (expand from source
bounds), warn (restrained pulse), resolve, return. FLIP relayout: every
patch application snapshots positions, re-solves layout, tweens the
delta — scene-level coordination instead of per-node animation.

**Phase C — hierarchy + reversibility.** Grouped staggers, sibling
displacement, breadcrumb state stack, `return` restores prior scene by
diff (shared ids morph back).

**Phase D — domain packs + switcher.** Extract persona/seed into packs;
default harbor; add one more pack to prove the engine.

**Phase E — instrument and record.** Time-to-first-paint, patches/sec,
parse-failure rate, tokens per interaction (the long-promised benchmark
table for [[concepts/cost-model]]). Capture a 60–90 s screen recording
for the README/site — this becomes the public flagship artifact.

## What exp-13 deliberately reuses (nothing new invented)

Streaming parser (exp-03 v3) · intent envelope (source #7, already in the
prompt) · choreographer policy + mood (choreographer deck) · FLIP/shared
identity (scene-grammar-v2) · attention orchestration (source #7) ·
restraint doctrine (stillness between moments). exp-13 is integration,
not invention — that's the point of a flagship.

## Success criteria

A first-time viewer watches the golden path and says some version of
"the interface understood the question." The reviewer's bar: it should
feel *directed*, not animated. If it reads as "dashboard with
transitions," Phase B's attention policy is under-tuned — iterate there
before adding anything new.
