# Painted UI

**The illusion of a model-painted interface at near-zero marginal cost.**

Products like Flipbook make a screen feel like it's being *painted live by a
model* — by generating every pixel with video diffusion, at a dedicated-GPU-
per-viewer price. This project demonstrates that the magic and the rendering
method are separable: an LLM streams a few kilobytes of **scene patches**,
and a client-side compositor animates them at display frame rate. The model
is the director; your device is the painter; the token stream is the brush.

**🏠 Main overview: [`index.html`](index.html)** — Painted UI: A Semantic Choreography
Runtime for Generative Interfaces · **📄 The paper: [`publication/painted-ui.md`](publication/painted-ui.md)**
([styled HTML](publication/painted-ui.html)) · **🎨 One-page pitch with a live sample: [`pitch.html`](pitch.html)**

## What the reference point looks like

![Flipbook: diving from an illustrated map into the cathedral interior — every pixel generated as live video](raw/assets/flipbook-dive.gif)

*A 13-second excerpt from Flipbook (Zain Shah, Eddie Jiao, Drew Carr) — the
UI dives from an illustrated map into a cathedral interior, with every pixel
generated as live video. Their product, their footage (screen-recorded from
the public demo, credited as the reference point this project studies; full
recording in `raw/demos/`). This continuous camera-dive through generated
imagery is the feeling painted UI aims to reproduce with kilobytes of scene
patches instead of a GPU video stream — see exp-03 below for the cheap
path painting live.*

## Working examples (each is one self-contained HTML file — just open it)

| File | What it shows |
|---|---|
| [`raw/experiments/exp-10-expressive-verbs/`](raw/experiments/exp-10-expressive-verbs/) | **Start here.** The scene *sketches itself* stroke by stroke — lighthouse, coastline, sun as self-drawing line art — then the paint materializes in, the title sets word by word, the lamp turns, and it lives. New verbs: strokeIn, materialize, inkSettle, maskReveal, typeSet. Resize anytime. |
| [`raw/experiments/exp-09-showcase/`](raw/experiments/exp-09-showcase/) | The living-gallery showcase: brush-bloom build, spring re-solve on resize (row→column restack), dusk-to-night gardener cycle, self-repainting imagery, hero morphs. |
| [`raw/experiments/exp-01-canvas-compositor/`](raw/experiments/exp-01-canvas-compositor/) | Scene-graph → Canvas compositor: fluid spring reflow, ambient motion, semantic hit-testing, runtime promotion. 8 KB, no model, no server. |
| [`raw/experiments/exp-02-transition-stream/`](raw/experiments/exp-02-transition-stream/) | The full video-UI transition vocabulary (dissolve/zoom/flyout/morph/image-swap) from an 8-verb patch stream at ~1.1 kbit/s. |
| [`raw/experiments/exp-03-live-llm-painter/`](raw/experiments/exp-03-live-llm-painter/) | **The live painter.** Type a request → a real model streams patches → the scene paints in at token speed; clicks talk back. Demo mode needs no key; live mode needs an Anthropic API key. Includes the full failure/fix log (`notes.md`) and an interactive architecture explainer (`how-it-works.html`). ⚠️ *Live mode is demo-only: the key sits in browser localStorage and calls the provider directly — fine on your own machine; any deployed version must use a server-side relay or short-lived credentials.* |
| [`wiki/decks/why-four-loops.html`](wiki/decks/why-four-loops.html) | Why the architecture needs four decoupled loops; pattern lineage; prior-art map. |
| [`wiki/decks/the-choreographer.html`](wiki/decks/the-choreographer.html) | The motion-policy layer, with a live same-stream/four-choreographies demo and unit economics. |

## Key numbers so far

- Scene description: **1.25 KB once** vs ~15 MB/min/user for a 2 Mbps video stream (~12,000×).
- Animated 18 s sequence: **~1.1 kbit/s** vs ~2,000 kbit/s video.
- Server GPUs required: **0**. Cost between interactions: **$0**.

## The knowledge base

`wiki/` is a compounding research wiki (Obsidian-compatible `[[wiki-links]]`):
start at [`wiki/index.md`](wiki/index.md) → [`wiki/concepts/the-illusion.md`](wiki/concepts/the-illusion.md)
(the core decomposition) → [`wiki/thesis.md`](wiki/thesis.md). Every claim
cites a source page; every experiment logs its failures as well as its wins
(`wiki/log.md` is the chronological record).

## Status & roadmap

Live painting is working (exp-03 v3). Next: exp-04 cached generated raster
assets · exp-05 on-device SLM + grammar-constrained decoding (the "$0/user,
works on a plane" build) · exp-06 painterly WebGL transition verbs · exp-07
speculative pre-painting + minimal agent swarm.

## License

MIT — see [LICENSE](LICENSE).
