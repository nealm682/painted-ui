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
