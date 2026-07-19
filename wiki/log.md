# Log — chronological, append-only

## [2026-07-18] bootstrap | wiki initialized

Created layer structure (`raw/`, `wiki/`, `CLAUDE.md`), git repo, navigation
files. Drafted anchors: [[overview]], [[thesis]], [[concepts/the-illusion]].

## [2026-07-18] ingest | Flipbook launch thread

Source #1 (`raw/articles/flipbook-thread.md` → [[sources/flipbook-thread]]).
Created: [[entities/flipbook]], [[entities/ltx-studio]], [[entities/modal]],
[[concepts/video-diffusion-approach]], [[concepts/cost-model]],
[[concepts/fluid-layout]], [[concepts/interactivity-from-semantics]],
[[concepts/scene-graph-approach]], [[concepts/client-side-compositing]],
[[concepts/asset-caching]], [[concepts/latency-and-streaming]].

## [2026-07-18] experiment | exp-01 canvas compositor

Built `raw/experiments/exp-01-canvas-compositor/` (single-file scene-graph →
Canvas2D compositor; ingredients 1–3 with no model, no server). Ingested as
source #2 → [[sources/experiment-01-canvas-compositor]]. First measured
number into [[concepts/cost-model]]: 1.25 KB scene vs ~15 MB/min video ≈
12,000× bandwidth advantage. Next: exp-02 (LLM emits scene graph live).

## [2026-07-18] experiment | exp-02 transition stream

Built `raw/experiments/exp-02-transition-stream/` in answer to Neal's query
("how do we replicate dissolve/zoom/flyout stream behavior?"). A scripted
patch stream drives a transition engine: 8 verbs cover the video-UI
vocabulary, ~1.1 Kbit/s vs ~2,000 Kbit/s for video. Ingested as source #3 →
[[sources/experiment-02-transition-stream]]. First technique page filed:
[[techniques/transition-choreography]]. Insight logged: ambient motion must
run *through* transitions or swaps read as loading, not repainting.
Next: exp-03 (real LLM emits the patch stream — the agentic loop).

## [2026-07-18] experiment | exp-03 live LLM painter

Built `raw/experiments/exp-03-live-llm-painter/` per Neal's request to see
the LLM do it live: browser-direct streaming call to a Claude model, patch
protocol as a ~30-line system prompt, JSONL ops mounted as lines close
(token pacing = the reveal), click events looped back as conversation
messages. Ingested as source #4 → [[sources/experiment-03-live-llm-painter]].
Ingredient 4 of [[concepts/the-illusion]] moves from "untested" to "harness
live, benchmarks pending." Next: first keyed run + benchmark log; exp-04
(cached raster assets in the img slot).

## [2026-07-18] first live results | exp-03 run 1 failed → v2 shipped

Neal's first keyed runs ("make a car calendar", sonnet-5): model emitted
palette + bg + a *note describing* the calendar + done. Two bugs diagnosed:
(1) the `note` op was an escape hatch — the model narrated instead of
painting; (2) the strict one-JSON-per-line parser silently dropped any
pretty-printed ops. v2: brace-depth streaming parser (unit-tested against
hostile input), hardened prompt (note never substitutes; grid recipe),
`rect` node kind, self-healing sparse-scene nudge, Raw-stream download.
Full incident writeup in exp-03 `notes.md` run log. **First real protocol-
reliability data point** for [[concepts/latency-and-streaming]] and
[[techniques/transition-choreography]]: grammar escape hatches become the
model's path of least resistance; silent error handling hides partial
compliance.

## [2026-07-18] live results | exp-03 run 2 failed → v3: examples ARE the spec

Run 2 ("ferrari dashboard"): v2 diagnostics surfaced 20 unparsed adds — root
cause was the protocol spec itself: example nodes used JS-style `.5` decimals,
the model imitated them, strict JSON.parse rejected every coordinate-bearing
node. v3: examples corrected to `0.5` + STRICT JSON rule + parser fallback
sanitizer (unit-tested on the failing payload). Filed the general lesson in
[[techniques/transition-choreography]] open questions territory: **models
imitate examples over rules; grammar escape hatches and sloppy examples are
protocol bugs.** Two live failures → two protocol-reliability data points.

## [2026-07-18] milestone | exp-03 run 3: first successful live paint ✅

v3 worked on Neal's machine — a real model painted a requested scene via
streamed patches, live. Ingredient 4 of [[concepts/the-illusion]] now has an
existence proof; [[thesis]] evidence updates from "benchmarks pending" to
"live paint confirmed, benchmarks pending." Built companion teaching page
`how-it-works.html` in the exp-03 folder: interactive step-through of the
four decoupled loops (conversation / network read / brace-depth parse /
60fps render), with run-1/run-2 failure quirks reproduced in its demo stream.

## [2026-07-18] query→deck | why four loops + prior-art research

Neal asked: is this looping through a streaming event, where does the
pattern come from, does it already exist, can SLMs on modest hardware play
a role? Researched prior art (Vercel streamUI, Google A2UI, Thesys C1,
WebLLM, llama.cpp GBNF / Outlines constrained decoding, game-loop lineage
via Nystrom/Fiedler) and built `wiki/decks/why-four-loops.html` — an 11-slide
HTML deck: the four mismatched clocks, what breaks with fewer loops, honest
lineage, prior-art gap map, the no-GPU truth (Canvas2D runs on anything —
the claim is the SERVER needs no GPU), and the SLM thesis: on-device models
+ grammar-constrained decoding make protocol violations structurally
impossible (runs 1–2 could not have happened). Proposed ingest queue:
A2UI docs, AI SDK 3.0 post, C1 docs, WebLLM paper (arXiv 2412.15803),
GBNF/Outlines docs, Game Loop chapter + Fix Your Timestep. Pages they
unlock: concepts/a2ui-and-standards, concepts/on-device-models,
comparisons/generative-ui-landscape. Suggested exp-05: WebLLM+GBNF local
painter ("$0/user, works on a plane").

## [2026-07-18] query→page | the choreographer + enterprise scalability

Neal asked: is this scalable (specifically for a large enterprise using
declarative UI protocols + server agent frameworks), and for a detailed
choreographer explainer. Built `wiki/decks/the-choreographer.html`: theater
metaphor (director/choreographer/painter/stage), five forces requiring the
layer, three architectures (model-verbs ~700 tok/scene vs local-policy ~400
vs hybrid), the actual 40-line policy with a live same-stream/four-
choreographies demo, unit-economics table, and a vendor-neutral enterprise
mapping (agent runtime unchanged; declarative protocols like A2UI as
substrate; choreographer = motion design system as versioned code;
declarative patches = auditable; a11y via the semantic field). New concept
page: [[concepts/choreographer]]. Also checked terminology: "painted UI" is
NOT established in the generative-UI literature (space uses "generative UI"
/ GenUI; "paint" lives in browser-rendering vocab like First Contentful
Paint) — the coinage is effectively unclaimed. Employer-specific details
deliberately kept out of the wiki per guardrails; analysis stays
vendor-neutral. Found candidate source: "Generative UI: LLMs are Effective
UI Generators" (Leviathan & Valevski, arXiv 2604.09577) — added to hunting
list. Index gained Decks section; host/worktree index drift repaired.

## [2026-07-19] query→pages | swarm painting + the experience frontier

Neal asked what agent swarms unlock and whether 80fps/unforeseen
modifications could change the experience. Key finding filed as
[[concepts/swarm-painting]]: **swarming is the cheap path's unfair
advantage** — N agents = N interleaved KB streams into one node map, vs N
impossible GPU streams on the video path. Six patterns: sectional
orchestra, studio pipeline (director/stylist/choreographer/critic),
speculative pre-painting (perceived-zero latency), competitive drafts, the
gardener (ambient tending), shared canvases. Second page,
[[concepts/experience-frontier]]: frame rate is a red herring (rAF already
gives 120fps on high-refresh displays; Flipbook is capped at 24) — the real
levers are painterly WebGL shaders, speculative pre-paint, an infinite
canvas with camera ops, audio choreography, and input-as-brush. Proposed
experiment order: exp-04 assets → exp-05 SLM+grammar → exp-06 painterly
verbs → exp-07 speculative+swarm.

## [2026-07-19] publish | Painted UI paper + GitHub packaging

Wrote `publication/painted-ui.md` (+ styled HTML): abstract, the
four-ingredient decomposition, architecture (patch protocol, four loops,
choreographer), measured evidence from exp-01/02/03 including both live
failures as protocol-design lessons, prior-art positioning (generative UI
assembles; painted UI paints; the term is unclaimed and hereby proposed),
unit economics, an on-device SLM endgame section, limitations, references.
Added root README.md and MIT LICENSE; employer-mention scan clean. Repo
created and pushed to github.com/nealm682/painted-ui.

## [2026-07-19] asset | Flipbook demo recording → GIF for README + entity page

Neal recorded the public Flipbook demo (29 s, 1916×1022 →
`raw/demos/FlipBook-Demo.mp4`). Converted the most illustrative segment —
the ~13 s camera-dive from illustrated map into cathedral interior, the
single clearest demonstration of what the cheap path must reproduce — to a
palette-optimized 560px GIF (`raw/assets/flipbook-dive.gif`, 9.7 MB;
full-length GIF rejected at 28 MB — video-diffusion output is GIF's worst
case, every pixel changes every frame). Embedded in README ("What the
reference point looks like", with credit to the Flipbook team and
provenance note) and in [[entities/flipbook]]. Also this session:
publication voice moved to first-person singular per public-repo rule; git
workflow switched to native (agent edits, Neal commits/pushes); bundle
retired and gitignored.

## [2026-07-19] ingest | game-loop lineage (Nystrom + Fiedler) → source #5

Neal asked whether the wiki referenced gameprogrammingpatterns.com/game-loop
— it was cited (paper refs 8–9, four-loops deck) but never ingested, and
the question exposed a structural gap: the four-loop architecture had no
markdown concept page. Fixed both. Fetched and clipped both documents to
`raw/articles/` (structured notes + short attributed quotes — public repo,
so no wholesale copying), wrote [[sources/game-loop-lineage]], and created
[[concepts/four-loops]] as the architecture's linkable home. Key
distinctions filed: Fiedler's "renderer produces time, simulation consumes
it" maps to "token stream produces structure, render loop samples state";
painted UI adds two producer loops and shows the rate mismatch as
choreography instead of hiding it as loading; and our tweens are
closed-form (not integrators), which is why the compositor tolerates any
frame rate without the instability that forces game engines to fixed
steps. Cross-linked from index, choreographer, swarm-painting.

## [2026-07-19] ingest + experiment | independent audit → exp-08 built

Neal commissioned an independent audit of the concept. Verdict: "more
confident, not less" — the differentiator confirmed and sharpened
(ordinary generative UI streams *what* components should exist; painted UI
streams *how* a persistent semantic scene should evolve, interpreted
continuously as motion), with honest bounds (perceptual equivalence,
production reliability, and precedence NOT yet shown). Filed verbatim as
source #6 → [[sources/audit-2026-07]]; distinction adopted into
[[thesis]]. The audit specified the validating experiment; built it same
day as `raw/experiments/exp-08-perception-study/`: blind within-subjects
three-way comparison (instant / component-streaming / painted) of
identical content — stream condition gets painted's element schedule so
progressive assembly alone can't explain differences — seven 7-point
scales worded verbatim from the audit, randomized A/B/C labels, JSON
export, analysis plan and validity threats in notes.md. Ready for
participants; a null result would be filed as a major finding against the
thesis.

## [2026-07-19] pilot | exp-08 first run (n=1, author): painted wins, controls tie

Neal piloted exp-08: painted condition clearly best; the instant and
streaming controls were indistinguishable in feel despite one visibly
building progressively. The control-vs-control null is the secondary
prediction confirmed in miniature: streaming alone does not produce the
illusion — persistence + ambient motion + choreography is the active
ingredient ([[sources/audit-2026-07]], [[concepts/the-illusion]]).
Author-as-participant, hypothesis-aware: filed as pilot, excluded from
main analysis. Manipulation strength confirmed; recruit naive
participants next.

## [2026-07-19] ⚠️ correction + full audit + exp-09 | the visual gap is the work

The previous entry is contradicted by fuller feedback and stands
corrected (appended, per guardrails — never overwritten). Full audit text
arrived (→ `raw/articles/audit-painted-ui-2026-07-full.md`, source page
[[sources/audit-2026-07]] rewritten): concept 9/10, synthesis 8.5,
technical proof 7.5, **visual proof 6.5**, potential 9. Verdict: "a unique
synthesis" — High originality precisely on the synthesis items (streaming
patches as visible painting rhythm; video-gen aesthetics without video;
the framing/name). Hands-on: reviewer could NOT tell exp-08's conditions
apart, and the resize probe did nothing — root cause: exp-08's harness
omitted spring reflow entirely and its painted condition was under-tuned.
**exp-08 PAUSED** (correction appended to its notes). Work list adopted:
richer primitives, constraint layout, accessibility-mirror (new planned
page), README demo-only key warning (added), evaluation must include real
video-diffusion condition. Reframed opportunity: "a runtime for cinematic
agent interfaces." Built **exp-09 showcase** same day to attack the 6.5:
visible brush painting the scene in (radial blooms from the brush's
position), true spring re-solve on resize (row→column restack), 52 s
dusk→night gardener cycle (sun wanes to crescent, stars arrive), imagery
self-repainting every 14 s, hero morphs, fireflies, camera breath,
prefers-reduced-motion respected. If exp-09 still reads as "dashboard,"
the binding constraint is the primitive vocabulary → exp-06 WebGL next.

## [2026-07-19] fix + design | exp-09 v2 self-healing; scene grammar v2 spec

exp-09 froze ~50 s in on Neal's machine (clicks logged, canvas dead =
render loop died while DOM handlers lived). Two fixes shipped: bounded
asset pool (v1 generated new texture canvases forever — 12 canvases max
now, verified bounded over 24 h) and a self-healing render loop
(per-frame try/catch that always re-arms rAF, on-screen ⚠ error
reporting, 2 s watchdog restart) — the demo now debugs itself. Field
verification pending. Then, per Neal's pivot, designed
[[techniques/scene-grammar-v2]] from the audit's two production-gap
lists. Unifying diagnosis: v1 makes the model buy geometry with tokens;
v2 buys meaning — richer primitives (path/mask/fx/texture/typography;
verbs unlocked: strokeIn, maskReveal, materialize, inkBleed, typeSet),
compound catalog (errors unrepresentable; the enterprise org-catalog
story), constraint containers (collision-proof by construction;
priorities generalize the row→column restack), and shared-element scene
diffs (pageMorph — navigation as painting). Estimated 4–30× token
reduction while raising the visual ceiling. exp-10 = implement Layer
A verbs + one compound + one container.

## [2026-07-19] experiment + pitch | exp-10 expressive verbs; one-page pitch

Built `raw/experiments/exp-10-expressive-verbs/` — grammar v2 Layer A in
pixels: **strokeIn** (lighthouse/coastline/sun sketched as self-drawing
line art, brush riding the stroke tip), **materialize** (fills arrive
blurred, settle sharp), **inkSettle** (jitter decays as pigment dries),
**maskReveal**, **typeSet** (title sets word by word), plus a rotating
lighthouse **beam**, waves, two-stroke birds, gardener cycle, springy
recomposition on resize. Sketch-then-paint is the qualitative jump past
"animated dashboard" — each verb ~30–50 compositor lines, written once,
named by the protocol for one token. Zero canvas allocation in the loop
(exp-09's freeze lesson); self-healing render loop standard from now on.
Also built `pitch.html` per Neal: a one-page pitch with a LIVE embedded
sample (same verbs in miniature — the page demonstrates what it argues),
the what-vs-how distinction, measured numbers, audit quote, and the
cinematic-agent-runtime framing. First-person voice throughout. README
reordered: exp-10 is now "start here."

## [2026-07-19] ingest | audit follow-up: visual 6.5 → 8.0; identity upgrade

Reviewer re-audited after exp-10 (raw:
`audit-painted-ui-2026-07-exp10-followup.md`; source page updated).
Threshold crossed in their words: "an LLM only needs to name artistic
verbs — the compositor owns the implementation." strokeIn called the
perceptual trick that makes it "handcrafted instead of assembled";
sketch→paint→type→light→living "feels authored." Scores: concept 9.5,
architecture 9.5, visual 8.0 (was 6.5), research value 9.5, commercial
8.5–9. Identity adopted across [[thesis]] and pitch kicker: **a semantic
motion language for AI-authored interfaces**. Their two remaining
weaknesses designed into [[techniques/scene-grammar-v2]] as new sections:
Layer D intent macros (compose/focus/weather/emphasize → verb expansion)
and Themes (same protocol, swappable verb implementations — ink/
watercolor/blueprint/storybook; the rendering-engine proof). Also fixed
exp-10 typeSet overlap (verbs must own their full canvas state — third
instance of the implicit-defaults bug class). Next builds on the table:
exp-11 themes · exp-10b live model naming verbs · GitHub Pages for the
pitch URL.

## [2026-07-19] explainer | the-cast.html — roles education page

Neal asked for education on compositor vs choreographer vs painter. Built
`wiki/decks/the-cast.html`: leads with the disambiguation (compositor =
the software; painter = the role it plays), five-role cast grid
(director/script/choreographer/painter/stage) with the economic logic
(decisions moved down the chain move from tokens to code), and six
accordions: an annotated node object (the noun), a real patch stream (the
script, with the each-line-useful-immediately property), the
choreographer as a pure function with a worked decision table, the
painter's frame loop + closed-form tween + what strokeIn expands 8 tokens
into, the stage's write/read rule with a before/after morph example, and
a live one-patch-at-a-time pipeline demo with narrated trace (script →
choreographer → stage → painter) including an idle-proof breathing glow
(the painter never stops). Ends with the keeper paragraph and companion
links.

## [2026-07-19] asset | Neal's overview explainer installed as index.html

Neal supplied an HTML explainer ("Painted UI — A Semantic Choreography
Runtime for Generative Interfaces") to serve as the repo's main
description. Scanned clean (no employer mentions, no keys, no external
resources), script syntax verified, installed at repo root as
`index.html` — chosen deliberately so that enabling GitHub Pages makes it
the homepage at nealm682.github.io/painted-ui/ with zero further setup.
README front matter reordered: overview → paper → pitch.
