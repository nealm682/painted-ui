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
