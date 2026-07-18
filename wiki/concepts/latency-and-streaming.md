# Latency and streaming

Perceived-speed tricks: the cheap path's answer to "but the model takes
seconds to respond." Core insight: **make the wait part of the show** — if
content visibly *paints in* while the model streams, latency reads as
craftsmanship, not lag.

## Techniques

- **Streaming tokens as visible layout.** Parse the scene-graph stream
  incrementally ([[concepts/scene-graph-approach]]); mount and animate each
  node the moment its JSON closes. The UI assembles itself in reading order —
  which *is* the painted-live effect ([[concepts/the-illusion]]).
- **Skeleton-to-detail.** Emit coarse geometry first (blobs, blocks, palette),
  refine with detail nodes in later tokens. Mirrors how a painter blocks in a
  canvas.
- **Progressive reveal.** Stroke-in, wipe, and fade build-ins from
  [[concepts/client-side-compositing]] cover both token latency and asset
  cache misses ([[concepts/asset-caching]]).
- **Websocket/SSE patterns.** Push scene-graph patches over a persistent
  connection — same transport shape as [[entities/flipbook]]'s frame stream
  ([[sources/flipbook-thread]]), but carrying ~KB of structure instead of
  ~MB/s of pixels.
- **Optimistic local response.** Hover/click feedback is client-side and
  instant ([[concepts/interactivity-from-semantics]]); only *new content*
  waits on the model.

## Open questions

- Incremental JSON parsing ergonomics: best format for stream-mountable scene
  graphs (JSONL of node patches? length-prefixed?).
- At what token throughput does layout-streaming feel "live" — is standard
  LLM streaming speed already enough?
