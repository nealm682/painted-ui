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

## [2026-07-20] review | deck-upgrade batch: ~90% kept, 2 corrections

Neal applied externally-suggested upgrades to the three main decks and
asked for review (all/some/none). Kept: independent-clocks framing,
source-agnostic Director, "deterministic semantic compiler" definition,
policy domains beyond motion, compileBehavior contract, diplomatic
prior-art table, estimate annotations. Corrected: (1) present-tense
"applies CSS transforms to A2UI components" claims — all demos render to
canvas; rephrased as target-dependent (canvas today, component trees via
future adapters) per the honest-evidence standard; (2) Painter→Animator
wholesale rename — reconciled as one role with two stage names (Painter
for canvas, Animator for component trees) to protect the coined tagline;
A2UI generalized to "DOM / A2UI-style / native" per vendor-neutrality.
Review filed as [[sources/upgrades]] with a rule for future batches:
sharpened language welcome; unbuilt capabilities in present tense and
mid-corpus renames of coined terms get revised before merging.

## [2026-07-20] ingest | ChatGPT motion recommendations → source #7

Neal supplied ChatGPT's motion-architecture recommendations (raw:
`chatgpt-motion-recommendations.md`). Core thesis adopted: "the next
breakthrough is making the UI appear to understand WHY it is moving" —
choreography system, not animation library. New to the wiki and merged
into [[techniques/scene-grammar-v2]]: mature intent-verb set (compare/
drillDown/filter/resolve…) as compositions over ~12 primitives (exp-10's
strokeIn slots into the `draw` family); attention orchestration
(focalIds/supporting/background + attentionMode); hierarchy choreography
(sibling displacement, shared containers); semantic envelope on patches;
velocity-continuous interruption → named **exp-12 "Interrupt the
Choreographer"** (the demo video generation cannot do interactively);
restraint doctrine (stillness is a feature). Three amendments filed in
[[sources/chatgpt-motion-recommendations]]: grammars AND themes (behavior
vs appearance — orthogonal, keep both); effects aren't step-7 for the
research track (strokeIn moved the audit 6.5→8 — expressiveness is
evidence); and the flagship "Workforce Advisor" demo re-skinned to a
neutral domain per the no-employer guardrail (candidate: harbor-
operations console, on-brand with the lighthouse). Product-track roadmap
adopted: relayout+shared morphs → attention → hierarchy → intent verbs →
interruption → grammars. Flagship narrative demo = exp-13.

## [2026-07-20] upgrade | exp-12 agent dashboard: semantic envelope in the Strands prompt

Discovered Neal built `raw/experiments/exp-12-agent-dashboard/` — a real
Strands agent backend (Opus via Anthropic) emitting component patches to
a React frontend with painted choreography: the enterprise architecture
from the pitch, running. (Explains the deck-upgrade batch's A2UI/CSS
language; exp-12 numbering now belongs to this app — the interruption
demo moves to exp-14 or inside this app.) Applied source #7's contract
upgrade to `backend/agent.py` SYSTEM_PROMPT: optional `intent` envelope
on patches (reveal/compare/focus/drillDown/filter/warn/resolve/connect +
importance/cause/relationship), new `scene` op for attention
orchestration (mode/focus/supporting/tempo/continuity), and the doctrine
line — communicate MEANING, never motion; the client choreographer
decides all expression. Root `.gitignore` extended (node_modules, dist,
__pycache__, .venv, .env) — mandatory before any push. Open flags: (1)
backend is request/response — the token-pacing reveal needs server-side
patch streaming (SSE + brace-depth parser) in server.py; (2) fence-strip
parsing is the exp-03 run-1 fragility; (3) domain is HR/workforce —
re-skin or keep untracked before public push per the no-employer
guardrail. exp-13 = evolve this app's frontend to honor intent verbs
(relayout+shared morphs, focus/recede, hierarchy).

## [2026-07-21] website | new index + five explainer pages installed and updated

Neal supplied a regenerated website set (index + the-cast /
the-choreographer / the-painter / why-four-loops /
how-it-works-together). Audited: all pass syntax, no sensitive terms, OG
tags intact, and — notably — the regenerated pages PRESERVED both honesty
corrections from the upgrade review. Installed all six at repo root
(companion pages enable relative links on GitHub Pages). A mount
hardlink quirk blanked index.html twice during install; recovered via
Neal's re-download and the host-side write channel — lesson recorded:
never bash-copy over an existing file on this mount; Write-tool
overwrites only. Updates applied to the index per "keep it up to date":
new Library section + nav entry (the site previously had ZERO outbound
links — now routes to all five explainers, the exp-10 live demo, the
pitch, and the repo), footer gains GitHub/Paper/MIT links, and one
accuracy fix (Animator card claimed "CSS transforms to A2UI components"
as present fact → target-agnostic: canvas in today's demos, component
trees via adapters). Byline on site is now "Neal Meinke" (Neal's own
choice in his file) — LICENSE placeholder can be updated to match.

## [2026-07-21] naming | the-painter.html → the-animator.html (+ redirect)

Site pushed live. Neal caught the last Painter remnant on the homepage:
the Animator explainer's filename (the-painter.html) surfacing in the
Library link URL. Index role cards were already cast-consistent
(Director/Choreographer/Stage/Animator). Fix: content now lives at
the-animator.html; the-painter.html replaced with a meta-refresh redirect
(old links never 404, and the redirect page itself teaches the
one-role-two-names rule); index Library href updated. Also confirmed the
re-uploaded cast page is byte-identical to the deployed root copy — the
canonical definitions were already in place. Cleanup note: sandbox-created
files carry locked ACLs host-side; the delete-permission tool + fresh
host Write is the recovery pattern.

## [2026-07-21] plan | exp-13 flagship: generalize the runtime, not the demo

Neal asked whether the flagship should be a general agent rather than
HR-specific, and whether generality makes it harder. Settled in
`raw/experiments/exp-13-flagship/PLAN.md`: exp-12's catalog is already
domain-agnostic — HR-ness lives only in the persona paragraph and seed
data — so the answer is **domain packs** (~30 lines each: persona + seed
+ vocabulary) over an unbounded agent, which would break choreography
reliability and demo predictability. Default pack: harbor operations
(employer-neutral, lighthouse-brand); a switcher proving the engine
claim. Golden path = source #7's nine-step narrative re-skinned ("Why did
delays increase?" → focus/recede/table-transform/drillDown/connect/
reveal/breadcrumb/return + mid-flight interruption). Phases: A streaming
SSE foundation (token pacing finally visible in the dashboard) → B
choreographer v2 honoring the intent envelope + FLIP relayout → C
hierarchy/reversibility → D domain packs → E instrumentation + the
flagship screen recording. Success bar: a first-time viewer says "the
interface understood the question" — directed, not animated.

## [2026-07-21] build | exp-13 Phase A: true streaming in the exp-12 backend

Discovery: server.py already spoke SSE but the streaming was staged —
run_agent to completion, then drip-feed finished patches at 120 ms.
Theater, not token pacing. Phase A makes it real: `PatchStreamParser` in
agent.py (Python port of the exp-03 v3 brace-depth scanner — chunk-split
safe, fence/prose tolerant, .5-decimal + trailing-comma sanitizer;
unit-tested against the full hostile suite including the new scene op,
zero unparsed) + `stream_agent()` async generator over Strands
`stream_async` (verified API: events carry text deltas in "data") +
server.py generate() rewritten to yield each patch the moment its object
closes. Frontend unchanged — it already consumes `patch` SSE events.
run_agent kept as fallback. The artificial 120 ms sleep is gone: patch
arrival rhythm is now the model's actual composition rhythm, which is
the thesis made audible. Awaiting Neal's live run to confirm.

## [2026-07-21] lint | full health check → [[lint-2026-07-21]]

Prompted by Neal's sustainability concerns. Knowledge layer: healthy —
one intentional dangling link, orphans fixed. Best catches: recovered
the ORIGINAL deck-upgrade spec ([[sources/painted-ui-messaging-reframe-spec]],
the empty-upload mystery solved); found a misfiled raw duplicate in
sources/ (delete queued); discovered **exp-11-profile-form** — built by
Neal, never logged (needs his description). Honest experiment registry
filed (04–07 numbers retired; 08 paused; 09 superseded by 10; 12 active
with Phase A done). Duplicates: 4/5 explainer pages divergent between
root (canonical site) and wiki/decks (stale) → redirect stubs queued.
The spaghetti finding quantified: ~12 independent tween/parse/choreograph
implementations — right for the research phase, expired now → the
runtime extraction is the next structural move, spec'd by
scene-grammar-v2 + choreographer + four-loops. Settled the "is the
gaming way best" question: the choreographer is a compiler; executors
are backends — canvas/rAF for painterly targets, Web Animations API +
View Transitions for component targets (new planned page:
concepts/executors). FPS inconsistency was two unnamed executors; now
named.

## [2026-07-22] research | device inference × generative UI → [[concepts/on-device-models]]

Neal asked for insights on device inference + genUI. Web-researched
(July 2026 state) and filed the long-planned page. Headline: **both OS
vendors shipped our reliability thesis as infrastructure** — Apple
Foundation Models (~3B on-device, @Generable guided generation:
constrained+speculative decoding by an OS daemon, model post-trained on
the format spec) and Android ML Kit GenAI over AICore (Gemini Nano 4,
typed Structured Output). Patches as native typed objects in-process →
the parser layer VANISHES on device; four loops become three. Speed
math: 20–50 tok/s decode, NPU prefill >1,000 tok/s, 35–59× energy
advantage on NPU → per-patch pacing fine, but full v1 scenes too slow →
**grammar-v2 compression is the on-device feasibility bridge, not just
cost optimization** (prefill-cheap/decode-scarce is exactly the regime
compact grammars serve). Split-brain division of labor table filed;
mobile Animator targets SwiftUI/Compose per executor doctrine. Gap
confirmed unclaimed: on-device model directing a persistent
choreographed scene. exp-05 "works on a plane" now buildable with zero
custom inference infra.

## [2026-07-25] ⚠️ ingest + correction | on-device inference research batch → source #8

Neal asked how to improve the concept, especially on device inference.
Researched the 2026 literature (raw:
`on-device-inference-research-2026-07.md` →
[[sources/on-device-inference-2026]]) and it **contradicts the previous
entry's headline**. Guided generation guarantees *validity*, not
*reliability*: on sub-3B models hard schema decoding takes validity
61.5%→100% but answer accuracy 19.7%→11.0%, and wrong-but-valid outputs
49.5%→**88.9%** (the "constraint tax", arXiv 2605.26128; corroborated by
diversity collapse across 44 models and tool-call suppression). For
painted UI the failure mode *migrates* from loud (parser dies on
narration/`.5` decimals — the exp-03 runs) to **silent** (a perfect patch
paints the wrong thing). ⚠️ Contradiction filed on
[[concepts/on-device-models]], which was substantially rewritten.
Architectural consequence: **the verifier** — a deterministic,
inference-free semantic gate where loop 3's syntactic gate used to be
(off-canvas, occlusion, contrast, overflow, dangling ids, screen-emptying
diffs), with rejects returned to loop 1 as messages since clicks are
already messages. Filed into [[concepts/four-loops]]; exp-09's
self-healing loop was an ad-hoc instance. Other findings: schema **keys
instruct** (key wording alone moves accuracy — compress values, keep keys
semantic; ⚠️ floor added to [[techniques/scene-grammar-v2]]'s token
economics); grammar overhead is **solved** (20–50 ms one-time compile,
<40 µs/token — open question closed) but **memory bandwidth is the
durable ceiling** (mobile 50–90 GB/s vs 2–3 TB/s, decode is
memory-bound); prefix KV caching collapses loop 1 into **resident
memory** (session-as-cache); **speculative decoding** is the biggest
unclaimed speedup and patch streams are an unusually good drafting
distribution (Apple ships a draft-model toolkit; corpus already exists in
exp-02/03/10); **rank-32 LoRA adapters** (~160 MB) attack the constraint
tax at its root — capacity — giving the taste experiment a design
(base+guided vs adapter+guided, scored on taste since validity is 100%
by construction). Two speculative finds: **mobile diffusion LLMs**
(llada.cpp, 17–42× over CPU) decode non-autoregressively, which would
make coarse-to-fine *resolution* a decoder property rather than a
streaming trick (candidate page `concepts/diffusion-painting`); and
automated **system-prompt optimization** (0%→84–87% output accuracy)
adds a cloud job to the split-brain table. Browser path corrected —
Chrome Prompt API stable for extensions (138+), origin trial for pages,
stable web projected 145–150. Three open questions closed, six opened.

## [2026-07-25] explainer | the-split-brain.html — on-device inference for newcomers

Neal found the research entry above hard to follow and asked for a single
rich HTML explainer of the pros and cons, how streamed patches look, and
the split-brain division of labor. Built
`wiki/decks/the-split-brain.html` (self-contained, house palette, no
external resources): gain/cost cards up front; the split-brain table with
a third destination made explicit — **no model at all** (choreographer,
layout re-solve, verification), which is the row that explains why a weak
local model suffices; a **live two-brain demo** driven by a real mini
compositor (patches mutate a node map, rAF samples it, self-healing loop
per the exp-09 lesson) where step 1 has the cloud compose a harbor scene
at 700 ms first-token then burst, and steps 2–3 have the device handle a
tap and pre-paint ahead at 0 ms latency but slower decode — with a ledger
whose byte and cost counters visibly **freeze** while the interface keeps
changing (the argument in one number); the patch shown in three forms
(streamed wire JSON → `@Generable`/Kotlin typed object → choreographer
output, with the 9-tokens-to-6-tweens ratio as the reason painted UI ports
to a small model and component-authoring generative UI doesn't); the
verifier as code; an **interactive routing tree** (7 events animate down
questions to cloud / device / no-model); the constraint-tax bars; the
loud-vs-silent failure table; and an honest cost list (silent wrongness,
two Directors, output budget, battery, platform lock, weaker cold
composition) paired with why painted UI absorbs each. Verified: no
external resources, tags balanced, JS parses clean. Not yet copied to repo
root — per [[lint-2026-07-21]] §D the root pages are the canonical site,
so promoting this one is Neal's call.

## [2026-07-25] ingest | Material 3 Expressive → source #9 + techniques/motion-physics

Neal opened the **physical expression** thread and supplied the M3
Expressive post. Clipped it plus the motion-physics and shape specs (raw:
`m3-expressive-2025.md`, structured notes + short attributed quotes; spec
tables verbatim as factual data) → [[sources/m3-expressive]], the wiki's
first design-system source. Headline: Material **replaced easing+duration
with a spring physics system** in May 2025 and gave our own reason for it —
springs "handle gestures, interruptions, and retargeting seamlessly."
Filed the substantive work as [[techniques/motion-physics]]. Five things
gained: (1) **spatial vs effects** — position/size/rotation/corner-radius
overshoot, opacity/colour never do (overshooting opacity reads as flicker);
our choreographer returns one uniform motion shape for every property, so
this is a ~two-line change and the cheapest physicality upgrade available,
and it is legible in Material's own curves (spatial control points >1.0,
effects capped at 1.00). (2) **Interruption answered** — a spring carries
velocity, so retargeting is four lines and never snaps; this unblocks
**exp-14 "Interrupt the Choreographer."** Reconciled with the
[[sources/game-loop-lineage]] closed-form requirement: the damped
oscillator has an *exact analytic solution*, so springs stay closed-form
functions of elapsed time and frame-rate tolerance survives — the solution
was written out and **verified against numerical integration** (ζ ∈
{0.55,0.75,1.0,1.4}, agreement <2e-3 position / <5e-3 velocity), then their
published web durations were solved back into a (ζ, stiffness) token table
(expressive spatial ζ 0.65–0.72 with 3.8–6.8% overshoot; effects ζ=1.0,
zero). (3) **Six tokens, two schemes**, scheme applied at product level so
token names never mention it — [[techniques/scene-grammar-v2]]'s
grammars-vs-themes split shipped by someone else, and a discipline check
against inventing forty knobs. (4) **Speed scales by element size and
device class**, not just mood — both local reads, zero tokens, and per
[[concepts/on-device-models]] now a correctness win too. (5) **Shape verbs**
— `squish` / `cornerMorph` / `shapeShift` added to grammar-v2 Layer A;
their "shape is versatile, not semantic" and 2.5D layering principles
adopted. Bonus find for the paused **exp-08**: their 46-study/18,000-
participant programme reports users spotting key elements **up to 4×
faster** on expressive screens — *time-to-locate-target* is an objective
behavioural metric and a far stronger design than exp-08's seven subjective
scales, which the auditor could not distinguish. ⚠️ **Recorded
disagreement:** Material's restraint doctrine (decoration without meaning =
clutter; cap hero moments at one or two) conflicts with our deliberate
ambient motion; proposed reconciliation is a **quiescence policy** (true
stillness after N seconds, ambience budgeted) which also answers the
ProMotion battery cost — adaptive panels only downclock to ~10 Hz when
content is genuinely static. Not taken: the component catalog (would
undercut the differentiator) and the branding (vendor-neutrality); noted
that Android's own frame-timing class is literally named `Choreographer`,
one layer downstream of ours — document before any Android build.
exp-15 = implement the spring runtime + interruption demo.
