# Flipbook

**What it is:** A product that renders its entire UI as live generated video —
no HTML, no layout engine. Launched April 2026 by Zain Shah (@zan2434), Eddie
Jiao, and Drew Carr. Source: [[sources/flipbook-thread]].

## Facts

- Streams **1080p video at 24fps** from a heavily-optimized version of
  [[entities/ltx-studio]]'s video-diffusion model.
- Frames delivered **over websockets**; inference on [[entities/modal]]
  serverless GPUs.
- Selling points: illustrations reshape to fit the window
  ([[concepts/fluid-layout]]); any region can become interactive
  ([[concepts/interactivity-from-semantics]]); everything feels painted live
  ([[concepts/the-illusion]]).
- Admitted limitations: early, slow, demos sped up/edited, capacity problems
  (waiting rooms).

## What I've learned

Flipbook is the **reference point and existence proof** for this wiki, and
simultaneously the demonstration of why the expensive path doesn't scale
([[concepts/video-diffusion-approach]], [[concepts/cost-model]]). Its three
selling points are exactly the behavior checklist a cheap reproduction must
hit ([[thesis]]).

Open questions: what "heavily-optimized" means concretely (distillation?
consistency? reduced steps? resolution tricks?); how interactivity is inferred
from pixels; per-user GPU cost.
