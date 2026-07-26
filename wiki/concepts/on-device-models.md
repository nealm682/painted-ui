# On-device models — the endgame, now shipping

*Researched 2026-07, substantially revised 2026-07-25 after
[[sources/on-device-inference-2026]] (this space moves fast — re-verify
before building). Fulfills the planned page from the paper's "on-device
endgame" section.*

## Headline finding: both OS vendors shipped our reliability thesis

The paper argued grammar-constrained decoding would make protocol
violations "structurally impossible." That is no longer a proposal — it
is OS infrastructure on both platforms:

- **Apple Foundation Models framework** (iOS 26): a ~3B on-device model
  with **guided generation** — annotate a Swift struct `@Generable` and
  an OS daemon runs constrained + speculative decoding so output *must*
  conform; the model is post-trained on the format spec itself. Zero API
  cost, offline, private.
  (https://arxiv.org/pdf/2507.13575, createwithswift.com/exploring-the-foundation-models-framework)
- **Android ML Kit GenAI APIs** over AICore: Gemini Nano (Nano 4 in
  current flagships) with a **Structured Output API** returning typed
  Kotlin data objects from the Prompt API.
  (android-developers.googleblog.com/2026/07/android-on-device-inference.html)

**Implication for painted UI:** define the patch as a `@Generable`
struct / Kotlin data class and the exp-03 run-1/run-2 failure classes
(narration instead of patches; malformed decimals) become *unemittable*.
Better: on-device, patches arrive as **native typed objects in-process**
— no SSE, no text stream, and the brace-depth parser layer disappears
entirely. Loop 2 (network) and loop 3 (parse) collapse into a function
call; the four-loop architecture simplifies to three on device.

## ⚠️ Contradiction (2026-07-25) — the constraint tax

The section above is right about *validity* and wrong about
*reliability*. It conflated the two, and the 2026 SLM literature
separates them sharply
([[sources/on-device-inference-2026]]).

Measured on sub-3B models, hard schema-constrained decoding
(arXiv 2605.26128, 15,000 generations):

| | unconstrained | hard schema |
|---|---|---|
| schema validity | 61.5% | **100.0%** |
| answer accuracy | 19.7% | **11.0%** |
| wrong-but-valid outputs | 49.5% | **88.9%** |

Constraints do not leave the underlying answer unchanged — on small
models they *degrade* it, because schema satisfaction and task solving
compete for the same limited capacity ("Capacity, Not Format",
arXiv 2606.09410). Adjacent results point the same way: constrained
decoding collapses answer diversity across 44 models
(arXiv 2607.18476) and suppresses tool calling (arXiv 2606.25605).

**What this means for painted UI specifically.** The guarantee does not
remove failure; it *migrates* it:

| | before (v1, text stream) | after (guided generation) |
|---|---|---|
| failure looks like | narration, malformed decimals, truncated JSON | a perfectly-formed patch |
| detection | the parser dies — loud, immediate | none — it renders |
| user sees | nothing / a stall | the wrong thing, painted confidently |

Exp-03's failure classes were *loud*. Their on-device replacements are
*silent*. That is a strictly harder problem, and it is the single most
important correction on this page.

**The consequence: a verifier loop.** If the platform guarantees every
patch is well-formed, the wiki's architecture owes it a counterpart that
checks whether a patch is *sensible* — deterministic, on-device,
inference-free checks over the resolved scene: nodes off-canvas, nodes
occluded by later nodes, contrast below threshold, text overflowing its
container, references to node ids that don't exist, verb applied to an
absent target, scene diff that empties the screen. Cheap (it's geometry,
not a model), and it converts "invalid is unemittable" into "wrong is
unpaintable." exp-09's self-healing loop was an ad-hoc instance of this;
it should be generalized and named. See [[concepts/four-loops]].

**Mitigations beyond the verifier**, in rough order of leverage:

1. **Two-stage decode** — a short *unconstrained* intent utterance
   ("emphasize the second card, calmly"), then the constrained patch
   emission conditioned on it. Restores the reasoning the constraint
   suppresses, at a cost of a handful of tokens.
2. **In-domain LoRA adapter** (below) — buys back the capacity the
   constraint consumes.
3. **System-prompt optimization** (below) — the cheapest of the three,
   and empirically the largest single jump.
4. **Simpler grammars** — [[techniques/scene-grammar-v2]]'s compounds
   reduce nesting depth, and shallower schemas carry a smaller tax.

## The system prompt is a component, not boilerplate

*When Correct Isn't Usable* (arXiv 2605.02363) found small models
reaching up to **85% task accuracy and 0% output accuracy** under naive
prompting — the content was right, the envelope unusable. An automated
iterative system-prompt optimizer (a frontier meta-model with black-box
access to the small one) reached **84–87% output accuracy**, at
near-baseline latency and with no fine-tuning.

This adds a cell to the split-brain table that wasn't there before: the
cloud model's job includes **authoring and periodically re-optimizing the
local model's system prompt, offline**. It's the highest
return-per-effort item on this page and requires no new infrastructure.

## Speed reality (flagship 2026 hardware)

- Decode: **20–50 tok/s** for 3–8B models at 4-bit on current flagships;
  iPhone 17 Pro pushes small models to 40+ tok/s; Snapdragon 8 Elite NPU
  ~22 tok/s with Phi-4-mini-class models. (Vendor and practitioner
  figures conflict — Apple-framework write-ups quote anywhere from
  10–20 to ~30 tok/s. Treat as a range.)
- Prefill: NPU systems exceed **1,000 tok/s** (llm.npu, ASPLOS'25) —
  loading context/exemplars is nearly free; *output* tokens are the
  scarce resource.
- Energy: NPU inference measured **35–59× lower energy** than mobile-GPU
  inference — the thermal/battery path exists.
  (docs.octomil.com, xumengwei.github.io ASPLOS25, localaimaster.com)
- **Guided-generation overhead is no longer a concern** (open question,
  now closed): modern grammar backends cost a one-time **20–50 ms
  grammar compile** and **<40 µs per token** thereafter. Compile the
  patch grammar at app launch; it never appears in the frame budget.
  Older backends charged 5–60% depending on schema nesting, which is why
  shallow grammars still pay off.

**The real ceiling is memory bandwidth, not tok/s.** Mobile devices have
**50–90 GB/s** against a data-center GPU's **2–3 TB/s** — a 30–50× gap,
decisive because decode is memory-bound ("On-Device LLMs: State of the
Union 2026"). This reframes the pacing arithmetic below as a *durable*
constraint: a protocol that needs many output tokens per scene will not
be rescued by next year's silicon. Compact output grammar is not an
optimization; it is the load-bearing assumption.

**The pacing arithmetic:** a v1 patch ≈ 30–60 tokens → 1–3 s per patch at
device speeds — the token-paced reveal *still reads as painting*
(arguably better: deliberate, not burst). But a full v1 first scene
(~400–700 tokens) ≈ 15–30 s on-device — too slow. **This makes
[[techniques/scene-grammar-v2]]'s compression the feasibility bridge,
not just a cost optimization:** with compounds and intent verbs (a
handful of tokens per op), an SLM directs a full scene in a few seconds.
Prefill-cheap + decode-scarce is precisely the regime our compact output
grammar was designed for, before we knew the hardware would demand it.

**But compression has a floor** — see the key-wording constraint in
[[techniques/scene-grammar-v2]]. Schema key tokens instruct the model as
well as structure the output, so shortening `emphasize` to `e` buys
tokens and spends quality. Compress values; keep keys semantic.

## Session as cache: the loop that collapses into memory

Prefill at 1,000+ tok/s plus **prefix KV cache reuse** (a first-class
feature of Apple's `LanguageModelSession`, and the mechanism behind
llada.cpp's mobile gains) changes the on-device shape of loop 1. Instead
of re-sending conversation and scene state as context on every turn, the
device holds a **long-lived session whose cached prefix *is* the scene
state**, and each patch is a small decode on top of it.

Stated sharply: on device, loops 2 and 3 collapse into a function call
(above) — and loop 1 collapses into *resident memory*. What remains is
the render loop plus a resident director. This is a stronger and more
interesting claim than the original "four loops become three," and it is
the natural home for the speculative pre-painting in
[[concepts/swarm-painting]] §3: pre-paints are decodes against an
already-warm prefix.

Open design question this creates: what is the eviction policy? A scene
graph that grows all session drops off the end of the context window,
so the cached prefix needs the same *diff* discipline the wire protocol
has ([[techniques/scene-grammar-v2]] shared-element identity).

## Speculative decoding: the biggest unclaimed speedup

Output tokens are the scarce resource, and speculative decoding is the
one technique that buys them back without shrinking the model.

- Apple's toolkit trains **a draft model for on-device speculative
  decoding** alongside adapters — it is a supported path, not a research
  hack.
- **sd.npu** (arXiv 2510.15312) demonstrates mobile speculative decoding
  with adaptive execution scheduling, context-aligned drafting, and draft
  extension for parallelism. EAGLE-style drafting (predicting hidden
  states rather than tokens) and Medusa-style multi-head drafting are the
  two mature families.

**Why painted UI is an unusually good fit:** a patch stream is
*repetitive by construction* — the same verbs, the same key names, the
same structural scaffolding, scene after scene. That is precisely the
distribution a small draft model learns well. And guided generation
*helps* drafting rather than fighting it: the grammar prunes the
candidate space the draft is verified against. Constrained + speculative
compound.

The corpus already exists — exp-02, exp-03 and exp-10 emitted thousands
of real patches. Training a draft model on your own protocol is a
concrete, buildable experiment.

## LoRA adapters: buying back the capacity the constraint spends

Apple's Python toolkit trains **rank-32 LoRA adapters (~160 MB)** that
apply on top of the base `SystemLanguageModel` while preserving all
guided-generation behavior. Since the constraint tax is a *capacity*
problem, an in-domain adapter attacks it at the root: the model no
longer spends capacity learning the schema at inference time because the
schema is in the weights.

Proposed experiment (fills the "taste" open question with evidence):
train an adapter on the exp-10 verb corpus, then compare
**base + guided generation** vs **adapter + guided generation** on scenes
judged for *taste* — emphasis placed on the right node, motion grammar
matched to mood, restraint — not for validity, which both will score
100% on by construction. Validity is no longer a meaningful metric on
this platform; the wiki's evaluation should stop reporting it as one.

## Diffusion decoding: painting as a decoder property

`llada.cpp` (arXiv 2606.13740) is the first NPU-aware framework for
**diffusion LLMs on smartphones**, cutting LLaDA-8B latency **17–42×**
over the CPU baseline via prefix KV reuse plus NPU-resident denoising.

The interesting property is not the speedup. Diffusion LLMs decode
**non-autoregressively**: a block of output is refined in place,
coarse-to-fine, instead of being emitted left to right. Painted UI's
entire protocol currently assumes left-to-right streaming, and
[[concepts/latency-and-streaming]] treats the token-paced reveal as the
visible painting act — a happy accident of autoregression that we
exploit.

Under a diffusion decoder the accident becomes the mechanism. A whole
scene would **resolve** — vague masses first, detail arriving as
denoising proceeds — which is how painting actually works, and which no
amount of streaming-a-list-of-nodes can imitate. Concretely it would
mean: a scene draft emitted at low confidence and progressively refined,
with the compositor rendering *intermediate* states rather than waiting
for committed patches.

This is speculative and belongs to no roadmap yet, but it is the kind of
thing the wiki exists to notice early. Candidate page:
`concepts/diffusion-painting`.

## The division of labor (revised)

| Role | On device (3B, NPU) | Cloud (frontier) |
|---|---|---|
| Instant reactions (click → mutation) | ✓ ~1–2 s | too slow round-trip |
| Speculative pre-painting ([[concepts/swarm-painting]] §3) | ✓ free tokens, warm prefix | wasteful |
| Choreographer-adjacent judgment (mood, emphasis arbitration) | ✓ within frames | no |
| First composition of a rich scene | with compounds ✓ | ✓ |
| Deep reasoning over data | escalate ↑ | ✓ |
| **Authoring/optimizing the device model's system prompt** | — | **✓ offline, periodically** |
| **Semantic verification of emitted patches** | **✓ deterministic, no inference** | not in the loop |
| **Taste adaptation to a product's style** | ✓ via LoRA adapter | supplies the training corpus |

Split-brain: cloud Director composes and reasons; local SLM is the
fast reactor. Offline: the SLM is the whole Director, at compound
granularity.

## Mobile rendering note

On device the [[concepts/four-loops]] Animator naturally targets
SwiftUI/Compose animation systems (native executors — the runtime
stack's "Canvas today, native later" made concrete), with the
[[wiki/lint-2026-07-21]] executor doctrine unchanged: choreographer
compiles, executors perform.

## Web deployment (revised — was "the weakest path")

The earlier claim that in-browser inference is the weakest mobile path
understated it:

- **Chrome Prompt API** via the `LanguageModel` global: **stable for
  extensions since Chrome 138**, behind a flag + registered origin trial
  for web pages, with community tracking projecting stable web
  availability around **Chrome 145–150** (late 2026 / early 2027).
- WebGPU has been stable since Chrome 113; WebNN remains flagged.
  WebLLM (MLC) is the most mature browser engine, and quantized models
  under ~2 GB run at interactive speeds on consumer hardware.

So the PWA-vs-native decision is no longer "native or nothing": an
extension-delivered demo is buildable *today* against a stable API, with
the web-page path arriving on a known timeline. Memory pressure on
low-end mobile remains the real limitation. Re-verify channel status
before this enters public-facing text.

## The gap (still open, still ours)

2026 research covers generative UI (cloud) and on-device agents
(assistants, task automation) separately — e.g., "Generative UI: LLMs
are Effective UI Generators" (arXiv 2604.09577), "Generative Interfaces
for Language Models" (ACL 2026), and on-device SLM agent guides. The
intersection — **an on-device model directing a persistent, choreographed
scene through typed patches** — appears unclaimed. exp-05's "works on a
plane" demo is now buildable with zero custom inference infrastructure:
Foundation Models + a SwiftUI executor, or ML Kit + Compose.

The constraint-tax literature strengthens rather than weakens this
claim: everyone measuring structured output on small models is measuring
*question answering*, where a wrong-but-valid answer is simply wrong. In
a painted interface a wrong-but-valid patch is *visible*, and a cheap
deterministic verifier can catch most of it. Painted UI may be one of
the few domains where the constraint tax is affordable — which is worth
saying out loud, because it is an argument no one else is positioned to
make.

## Open questions

- ~~Guided-generation latency overhead vs raw decode?~~ **Closed:**
  20–50 ms one-time compile, <40 µs/token on modern backends.
- ~~Can a 3B model choose intent verbs tastefully, or only correctly?~~
  **Partially answered, badly:** the constraint that guarantees
  correctness measurably *reduces* the judgment behind taste. Reopened
  as: *how much of that is recovered by two-stage decode, an in-domain
  adapter, and prompt optimization?* — now a buildable experiment.
- ~~Web deployment: is in-browser inference viable?~~ **Revised:**
  stable for extensions today, web pages on a known timeline.
- Does @Generable support our full grammar (nested nodes, enums for
  verbs) or does the schema need flattening? (Now more urgent: nesting
  depth is a tax multiplier, not just an ergonomics question.)
- What is the KV prefix eviction policy for a long-lived scene session?
- Does a draft model trained on our own patch corpus reach a high enough
  acceptance rate to matter, and does the grammar raise it?
- Can the verifier be specified declaratively from the same catalog that
  defines compounds — i.e. does a compound ship its own sanity checks?
- Which of the failure modes we care about are *invisible* to a
  deterministic verifier and need a model in the loop after all?

## Sources

[[sources/on-device-inference-2026]] (the 2026 research batch and this
page's revision) · [[sources/audit-2026-07]] ·
[[techniques/scene-grammar-v2]] · [[concepts/four-loops]]
