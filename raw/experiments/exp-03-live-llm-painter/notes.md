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

---

## Run log

### [2026-07-18] Run 1 (Neal, sonnet-5, "make a car calendar") — FAILURE → v2

**Observed:** first request rendered; subsequent requests produced only
`palette` + gradient `add` + a `note` *describing* the calendar + `done`.
Screen changed color; nothing was painted.

**Diagnosis (two compounding bugs):**
1. **Note-laziness.** The protocol offered a `note` op with no rule against
   using it as a substitute for painting. The model narrated the scene
   ("Sketched a car-themed calendar…") instead of emitting its nodes —
   the LLM equivalent of a painter handing you the title card.
2. **Silent line-drop parser.** v1 parsed strictly one-JSON-per-line; any
   pretty-printed / fenced / multi-line object was dropped with no trace,
   so partial compliance looked like total absence.

**v2 fixes:**
- Brace-depth streaming parser: extracts every complete top-level `{...}`
  regardless of newlines, fences, prose, or pretty-printing; unparsed
  objects now surface visibly (⚠ counter + log). Unit-tested against
  hostile input (fences, multi-line, braces-in-strings, chunk splits).
- System prompt hardened: "note NEVER substitutes for painting; <10 visible
  nodes = failure"; explicit grid recipe (one rect per cell, formula given).
- New `rect` node kind — panels/tiles/calendar cells.
- **Self-healing nudge:** if a first scene arrives with <6 nodes, the
  harness auto-sends one corrective event message; the model repaints.
- `Raw` button downloads the model's raw stream for diagnosis; live status
  shows ops/nodes/unparsed counts. max_tokens 4000→8000 for dense grids.

**Lesson for the wiki:** protocol design is behavior design — an escape
hatch in the grammar (note) becomes the model's path of least resistance,
and silent error handling turns partial compliance into invisible failure.

### [2026-07-18] Run 2 (Neal, sonnet-5, "make a ferrari dashboard") — FAILURE → v3

**Observed:** streaming visible, 6 ops / 2 nodes parsed, **⚠ 20 unparsed**
adds. Diagnostics from v2 worked exactly as designed — the unparsed log
identified the payloads.

**Diagnosis:** my own protocol spec. The example nodes in the system prompt
used JS-flavored decimals (`"x":.5`). The model imitated the examples —
faithfully — and `JSON.parse` rejects `.5` (strict JSON needs `0.5`). Every
node carrying coordinates failed; palette/gradient/note/done (no decimals)
passed. The v2 nudge fired but repainted in the same style.

**v3 fixes:**
- Spec examples corrected to `0.5` notation + explicit STRICT JSON rule.
- Parser fallback sanitizer: `.5 → 0.5` (value positions only — decimals
  inside strings untouched) + trailing-comma strip. Unit-tested against the
  exact gearbox payload from the failing run.

**Lesson (stronger form of Run 1's):** models imitate examples over rules —
the examples ARE the spec. And layered defense works: prompt fixes the
source, sanitizer forgives stragglers, ⚠ counter catches what's left.
