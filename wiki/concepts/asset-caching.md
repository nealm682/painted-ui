# Asset caching

Why **static image generation amortizes and video generation doesn't** — the
economic hinge of the hybrid path in [[concepts/cost-model]].

## The asymmetry

- A generated **video frame** is conditioned on one user's live session state
  at one instant. It can never be served to another user. Perishable.
- A generated **image asset** ("watercolor mountain, dawn palette") is
  session-independent. Generate once, store, CDN to every future user whose
  scene graph requests something semantically close. Durable.

So the expensive path ([[concepts/video-diffusion-approach]]) pays per
user-second forever, while the hybrid path's image-gen cost **per user → 0**
as traffic grows.

## Mechanics

- **Semantic cache keys:** embed the asset request; serve nearest neighbor
  above a similarity threshold, else generate + insert. Cache hit rates climb
  with scale.
- **Pre-generation:** seed the cache with the head of the request
  distribution offline at batch prices.
- **On-demand fill:** misses generate live (seconds, not per-frame), covered
  by reveal animation ([[concepts/latency-and-streaming]]) so the wait reads
  as painting.
- Assets slot into the scene graph as raster nodes
  ([[concepts/scene-graph-approach]]); motion is applied by the compositor
  ([[concepts/client-side-compositing]]), so a *cached* image still moves.

## Open questions

- Hit-rate curves: how much style-constraint (one house palette) boosts reuse?
- Does visible asset reuse across users ever break the "made for me" feeling
  ([[concepts/the-illusion]])? Mitigations: per-user palette shifts, crops,
  recoloring — cheap client-side transforms on cached assets.
