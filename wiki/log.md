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
