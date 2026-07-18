# exp-03 — live LLM painter (patch streaming by request)

**Date:** 2026-07-18 · **Status:** built, syntax-verified, demo mode
validated; **live mode needs an Anthropic API key** (paste in the top bar —
stored in your browser's localStorage only, sent only to api.anthropic.com).

## Goal

Ingredient 4 of the illusion — *bespoke content* — goes live. Type a request;
a real Claude model streams JSONL scene patches; the compositor mounts each
patch the moment its line closes. **Token pacing becomes the reveal** — no
authored timings anywhere in live mode.

## How it works

```
you type "a cozy dashboard for my reading list"
  → POST api.anthropic.com/v1/messages (stream:true, browser CORS mode)
  → system prompt = the patch protocol spec (~30 lines)
  → SSE text deltas → feed() → JSONL lines close → applyPatch()
you click a glowing element
  → {"event":"click","node":"c2","semantic":"tidepool photo: starfish"}
     appended as a user message
  → model streams a SHORT mutation (morphs preferred over remove+add)
```

That second arrow is the **agentic loop held in patches**: semantic events
up, choreography down, conversation history preserved, screen never cleared.

## Design decisions

- **One code path.** Demo mode pipes canned JSONL through the same `feed()`
  parser at ~180 chars/s, so demo and live are visually identical mechanics.
- **The protocol is the prompt.** The whole spec fits in ~30 lines of system
  prompt — evidence the patch grammar is small enough for reliable emission.
- **Model picks the choreography.** Enter/exit verbs, durations, palette,
  composition are all model choices. This tests the open question from
  exp-02 (can a model choose transition verbs tastefully?).
- **Clicks re-enter the conversation.** Events are JSON user-messages, so
  the model sees its own scene history and mutates rather than repaints.

## What to test when running live (the benchmark plan)

1. **Time-to-first-paint** (request → first node mounted) and ops/sec.
2. **Protocol reliability**: % of lines that parse; malformed-line rate per
   model (sonnet-5 vs haiku-4.5 vs opus-4.8 — the select in the top bar).
3. **Verb taste**: does it vary enter kinds? stagger z-order back-to-front?
4. **Mutation discipline**: on click, does it patch (good) or rebuild (bad)?
5. Log results back into this file per run.

## Limitations

- Raster "assets" are still procedural seeds — the img slot is where cached
  image-gen results plug in (exp-04 candidate).
- No constraint layout yet — model places by fraction; window resize scales
  but doesn't re-solve ([[concepts/fluid-layout]] integration pending).
- Browser-direct API calls are fine for a personal prototype; a product
  would proxy server-side (key exposure, rate limits).
