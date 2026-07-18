# Source: exp-03 — live LLM painter (own experiment)

**Citation:** own build, 2026-07-18.
Raw: `raw/experiments/exp-03-live-llm-painter/` (`index.html` + `notes.md`).
**Ingested:** 2026-07-18 (source #4)

## What it is

An 18 KB single-file harness that closes the loop on ingredient 4 of
[[concepts/the-illusion]]: a text request goes to a real Claude model
(browser-direct streaming call), the model emits the patch protocol from
[[techniques/transition-choreography]] as JSONL, and the exp-02 transition
engine mounts each op as its line closes — **token pacing is the reveal**,
exactly the mechanism proposed in [[concepts/latency-and-streaming]].

Clicking any interactive node sends `{"event":"click", semantic:...}` back
as a conversation message; the model streams a short mutation of the
existing scene. This is the **agentic loop held in patches**: semantic
events up, choreography down ([[concepts/interactivity-from-semantics]]).

## Key properties

- The full patch protocol fits in a ~30-line system prompt — evidence for
  the [[concepts/scene-graph-approach]] claim that the grammar is small
  enough for reliable LLM emission.
- Demo mode (no API key) pipes canned JSONL through the identical parser at
  token-like pacing — one code path for simulated and live.
- Benchmark plan defined in `notes.md`: time-to-first-paint, parse rate,
  verb taste, mutation discipline, compared across models.

## Status

⚠️ Harness built and demo-validated; **live results pending first run with
an API key**. The thesis's ingredient-4 claim ([[thesis]]) stays "untested →
testable" until those numbers are logged.

## Wiki pages touched

[[thesis]] · [[concepts/the-illusion]] ·
[[techniques/transition-choreography]] ·
[[concepts/latency-and-streaming]] ·
[[concepts/interactivity-from-semantics]] · [[concepts/scene-graph-approach]]
