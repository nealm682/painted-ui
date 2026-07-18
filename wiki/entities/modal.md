# Modal

**What it is:** Serverless GPU infrastructure. [[entities/flipbook]] runs its
video-model inference on Modal. Source: [[sources/flipbook-thread]].

## What I've learned

Serverless GPUs fit the painted-UI-as-video workload (bursty, per-session),
but don't fix the unit economics: each concurrent user still consumes
dedicated GPU-seconds with no cross-user caching
([[concepts/video-diffusion-approach]]). Flipbook's waiting rooms suggest even
serverless elasticity hit limits at launch. Modal's public GPU pricing is a
good input for the expensive-path column of [[concepts/cost-model]].
