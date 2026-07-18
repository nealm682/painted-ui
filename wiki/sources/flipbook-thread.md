# Source: Flipbook launch thread (@zan2434)

**Citation:** Zain Shah (@zan2434), X launch thread, April 2026.
Raw copy: `raw/articles/flipbook-thread.md` (seed facts, immutable).
**Ingested:** 2026-07-18 (source #1 — bootstraps the wiki)

## Key takeaways

1. **The existence proof.** Flipbook demonstrates that a UI rendered as pure
   generated video — live 1080p @ 24fps from an optimized LTX Studio video
   model, streamed over websockets on Modal serverless GPUs — is compelling
   enough to launch. No HTML, no layout engine; every pixel is model output.
2. **The three advertised behaviors** (these define the illusion this wiki
   exists to reproduce cheaply):
   - illustrations **reshape to fit the window** → [[concepts/fluid-layout]]
   - **any region can become interactive** → [[concepts/interactivity-from-semantics]]
   - the screen is visibly alive / painted → [[concepts/the-illusion]]
3. **The admitted costs.** Early, slow, demos sped up/edited, waiting rooms
   from capacity limits. This is the structural weakness: GPU-seconds scale
   linearly with concurrent users and nothing is cacheable across users →
   [[concepts/video-diffusion-approach]], [[concepts/cost-model]].

## Interpretation (agent's, not the source's)

The thread sells *behaviors*, not the rendering method. Users are shown
reflow, interactivity, and liveness — none of which logically require pixel
generation. That gap is the whole thesis: [[thesis]].

## Wiki pages touched by this ingest

[[overview]] · [[thesis]] · [[concepts/the-illusion]] ·
[[concepts/video-diffusion-approach]] · [[concepts/cost-model]] ·
[[entities/flipbook]] · [[entities/ltx-studio]] · [[entities/modal]]
