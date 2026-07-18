# Cost model — $/user across approaches

Maintained comparison of marginal cost per concurrent user. Structural
argument is in place; **actual numbers are TODO** as sources come in.

## Structure of the comparison

| Approach | Server cost per concurrent user | Cacheable across users? | Client GPU used? |
|---|---|---|---|
| Full video diffusion ([[concepts/video-diffusion-approach]]) | ~1 dedicated GPU stream per user, every second of the session | No | No |
| Scene graph + client compositing ([[concepts/scene-graph-approach]], [[concepts/client-side-compositing]]) | LLM tokens per interaction (bursty, then $0 between interactions) | Partially (prompts, layouts, assets) | Yes |
| Hybrid: scene graph + cached generated assets ([[concepts/asset-caching]]) | LLM tokens + amortized image-gen (each asset generated once, served ∞ times) | Yes | Yes |

## Key structural facts

- Video frames are **perishable**: conditioned on one user's live session
  state, worthless to anyone else. Static assets are **durable**: generate
  once, CDN forever. This is why image gen amortizes and video gen doesn't.
- In the scene-graph approach the marginal rendering cost is paid by the
  **user's own GPU** — near-zero to the operator.
- Token cost per scene-graph update is comparable to any chat response and
  is streamable ([[concepts/latency-and-streaming]]).

## Numbers so far

- **Bandwidth (measured, exp-01):** scene graph = 1.25 KB sent once per
  scene; a conservative 2 Mbps 1080p24 stream = ~15 MB/min per user
  (38 MB/min at 5 Mbps) → **~12,000× advantage per minute on screen**, and
  server GPU-seconds ≈ 0 vs. one dedicated stream per user.
  Source: [[sources/experiment-01-canvas-compositor]].

## Numbers wanted (TODO)

- Modal GPU pricing (e.g., $/hr for the class of GPU that runs an optimized
  LTX-class model at 24fps 1080p) → $/user-hour for the expensive path.
- LLM token pricing × typical scene-graph size → $/interaction, cheap path.
- Image-gen $/asset and realistic cache-hit rates → hybrid path.
- Evidence: [[sources/flipbook-thread]] (waiting rooms = capacity rationing).
