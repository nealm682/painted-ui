# The video-diffusion approach (the "real," expensive way)

How [[entities/flipbook]] actually does it: a video-diffusion model (optimized
[[entities/ltx-studio]] model) generates every pixel of the UI as live 1080p
24fps video, streamed over websockets from [[entities/modal]] serverless GPUs.
Source: [[sources/flipbook-thread]].

## Why it's the gold standard for the illusion

Because *everything* is generated, every ingredient of
[[concepts/the-illusion]] comes for free: layout is whatever the model paints
(fluid by construction), motion is continuous, any pixel can respond to input,
and every frame is bespoke. There is no fidelity ceiling imposed by a widget
library or layout engine.

## Why it doesn't scale

- **Linear GPU cost with concurrency.** One active user ≈ one GPU generating
  24 frames/sec for the whole session. 1,000 concurrent users ≈ 1,000 GPU
  streams. No sublinear term.
- **Nothing caches across users.** Each stream is conditioned on that user's
  session state. Unlike static image gen ([[concepts/asset-caching]]), a
  generated frame is worthless to any other user a millisecond later.
- **Observed symptoms:** Flipbook launched slow, with sped-up demo footage
  and waiting rooms ([[sources/flipbook-thread]]) — capacity rationing is the
  predictable product shape of linear unit costs.
- Numbers live in [[concepts/cost-model]].

## Trajectory to watch

Consistency models, distillation, and step-reduction keep cutting the
GPU-seconds per frame. The expensive path gets cheaper every quarter — but it
stays linear in users unless something structural changes. The cheap path
([[concepts/scene-graph-approach]] + [[concepts/client-side-compositing]])
is constant-ish per user because the user's own GPU does the rendering.
