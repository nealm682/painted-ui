# LTX Studio

**What it is:** The maker of the video model that [[entities/flipbook]] uses.
Flipbook runs a "heavily-optimized version of LTX Studio's video model" to
generate live 1080p 24fps UI video. Source: [[sources/flipbook-thread]].

## What I've learned

The LTX family is known publicly for pushing real-time-ish video generation;
Flipbook's use of it suggests the fastest open(ish) video models are now
within optimization distance of interactive frame rates — relevant to
[[concepts/video-diffusion-approach]] and to tracking how fast the expensive
path is getting cheaper.

Open questions: which base model/version; what optimizations Flipbook applied;
published latency/throughput numbers for the base model (candidates for
[[concepts/cost-model]]).
