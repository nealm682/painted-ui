# Source #8 — on-device inference research batch (July 2026)

**Citation:** `raw/articles/on-device-inference-research-2026-07.md` — a
collected batch of public 2026 research and platform documentation on
on-device inference, gathered 2026-07-24/25 to answer "how do I improve
the concept, especially on device inference?". Principal papers: *The
Constraint Tax* (arXiv 2605.26128), *When Correct Isn't Usable* (arXiv
2605.02363), *Schema Key Wording as an Instruction Channel* (arXiv
2604.14862), *Efficient On-Device Diffusion LLM Inference with Mobile NPU*
(arXiv 2606.13740), *sd.npu* (arXiv 2510.15312), *On-Device LLMs: State of
the Union 2026*.

**Type:** external research (not an own experiment). First source to
*contradict* an existing wiki claim rather than extend it.

## Key takeaways

1. **The constraint tax — our reliability claim was half right.**
   [[concepts/on-device-models]] said guided generation makes protocol
   violations "structurally impossible." True of *validity only*. Measured
   on sub-3B models: validity 61.5% → 100%, answer accuracy 19.7% → 11.0%,
   wrong-but-valid outputs 49.5% → 88.9%. The guarantee **migrates** the
   failure mode from loud (parser dies) to silent (a perfect patch paints
   the wrong thing). Filed as a ⚠️ Contradiction on that page.

2. **Format compliance is a prompt problem, and it is automatable.**
   0% output accuracy from naive prompting despite 85% task accuracy;
   84–87% after automated system-prompt optimization, no fine-tuning, no
   latency cost. The on-device Director's system prompt is a *component*,
   not boilerplate — and a cloud model can optimize it offline.

3. **Schema keys instruct.** Key wording alone moves accuracy, with
   everything else fixed; prompt and schema channels interact
   non-additively. This constrains how far
   [[techniques/scene-grammar-v2]] may compress: compress values, keep
   keys semantic.

4. **Grammar overhead is solved; bandwidth is not.** Modern grammar
   backends: 20–50 ms one-time compile, <40 µs/token. Mobile memory
   bandwidth 50–90 GB/s vs 2–3 TB/s data-center — decode is memory-bound,
   so the output-token budget is a *durable* constraint, not one that new
   silicon removes.

5. **Speculative decoding + KV prefix reuse are the levers that remain.**
   Apple ships a draft-model training toolkit and a KV-cache-aware
   session; sd.npu demonstrates mobile speculative decoding with hardware
   coordination. A patch stream is unusually predictable, which is exactly
   the regime drafting exploits.

6. **LoRA adapters (rank 32, ~160 MB) are the taste fix.** Constraint tax
   is a capacity problem; an in-domain adapter buys capacity back while
   preserving guided generation.

7. **Diffusion LLMs reached mobile NPUs** (17–42× over CPU baseline) and
   decode **non-autoregressively** — a block resolves coarse-to-fine in
   place. That is the painting metaphor as a decoder property rather than
   a pacing trick.

8. **The browser path is stronger than we recorded.** Chrome's Prompt API
   is stable for extensions (138+), origin-trial for pages, projected
   stable web availability Chrome 145–150.

## Wiki pages touched

- [[concepts/on-device-models]] — substantially rewritten: contradiction
  note, bandwidth ceiling, session-as-cache, speculative decoding, LoRA,
  diffusion decoding, browser correction, three open questions closed.
- [[techniques/scene-grammar-v2]] — new "Key wording is an instruction
  channel" constraint on Layer B/D naming.
- [[concepts/four-loops]] — the verifier loop, introduced as the
  counterpart the platform guarantee requires.
- [[index]], [[log]].

## Caveats

Vendor-blog and practitioner figures (device tok/s especially) conflict
across sources and are recorded as ranges. Platform availability
(Chrome channel status, Gemini Nano 4 rollout) moves monthly — re-verify
before it enters any public-facing text.
