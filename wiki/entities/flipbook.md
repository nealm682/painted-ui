# Flipbook

**What it is:** A product that renders its entire UI as live generated video —
no HTML, no layout engine. Launched April 2026 by Zain Shah (@zan2434), Eddie
Jiao, and Drew Carr. Source: [[sources/flipbook-thread]].

## What it looks like

![Flipbook camera-dive excerpt](../../raw/assets/flipbook-dive.gif)

13-second excerpt (illustrated Paris map → dive into the cathedral
interior) from a screen recording of the public demo; full 29 s recording:
`raw/demos/FlipBook-Demo.mp4`. The continuous zoom *through* generated
imagery — no page boundary, no layout snap — is the clearest single
demonstration of what [[concepts/the-illusion]] must reproduce, and the
one behavior (arbitrary painterly in-betweens) acknowledged as video
generation's remaining edge ([[concepts/experience-frontier]]).

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
