# Painted UI: The Illusion of a Model-Painted Interface at Near-Zero Marginal Cost

**Neal M.** · July 2026 · [github.com/YOUR-HANDLE/painted-ui](#)

---

## Abstract

In April 2026, Flipbook demonstrated a user interface rendered entirely as
live video from a diffusion model — no HTML, no layout engine, every pixel
generated. The result feels like watching a screen being *painted for you,
right now*. It is also economically brutal: one dedicated GPU stream per
concurrent user, nothing cacheable, cost accruing every second a screen is
on. This article argues that the magic and the rendering method are
separable. The "painted live" feeling decomposes into exactly four
behaviors — fluid layout, live motion, universal interactivity, and bespoke
content — and none of them requires generating pixels with a model. We
present an architecture that reproduces the illusion by having a language
model stream a few kilobytes of *scene patches* that a client-side
compositor animates at display frame rate, report measurements and failure
lessons from three working prototypes, and position the approach against
the emerging generative-UI ecosystem. We call the technique **painted UI**.

## 1. The reference point

Flipbook (Zain Shah, Eddie Jiao, Drew Carr) streams 1080p video at 24
frames per second from a heavily optimized version of LTX Studio's video
model, over websockets, on serverless GPUs. Its launch materials advertise
three behaviors: illustrations reshape to fit the window, any region can
become interactive, and everything appears to be painted live. The team was
candid about the costs: it launched slow, demo footage was sped up, and
capacity problems forced waiting rooms.

Those symptoms are not launch pains; they are the unit economics showing
through. A generated video frame is conditioned on one user's session at
one instant — it can never be served to anyone else. Video-generated UI
therefore scales linearly in concurrent users with no cross-user caching:
rent a high-end GPU per active viewer, forever.

## 2. The claim: the wow is a behavior bundle

The central observation of this work: what users respond to in a
model-painted interface is not the rendering method. It is four
distinguishable behaviors, each of which can be produced directly.

**Fluid layout** — *"it reshapes to fit my window."* The feeling comes from
continuous, animated adaptation rather than authored breakpoints. A
resolution-independent scene description with constraint-style positioning,
whose re-solve is *animated* (springs, not snaps), reads as redrawing
rather than reflowing.

**Live motion** — *"it's alive, not a page."* At 24fps generation, nothing
is ever static; the absence of frozen pixels is intrinsic. A client-side
motion vocabulary — slow pans and zooms, ambient particles, breathing
affordances, cross-dissolves — reproduces this at 60–120fps on the user's
own device, exceeding the original.

**Universal interactivity** — *"anything might respond to me."* Flipbook
infers clicks from pixels, so any region can become interactive. A scene
graph inverts this: every node carries semantic identity, so hit-testing is
exact, instant, and free — and the model can promote any node to
interactive with a one-line patch.

**Bespoke content** — *"this was made just for me, just now."* The one
ingredient where the model genuinely must create per user. But it can do so
with tokens rather than pixels: the model authors the scene; raster texture
comes from generated image assets that are cached *across* users; and the
streaming reveal makes the authorship visible.

Each ingredient also has a falsifiable tell (a layout snap, a frozen frame,
a dead click, a recognized stock component), which gives the whole program
a test plan.

## 3. Architecture

**The patch protocol.** The model emits newline-delimited JSON operations —
`palette`, `add`, `update`, `remove`, `note`, `done` — over a standard
streaming API. Nodes are typed primitives (gradient, disc, rect, card,
text, pill) positioned in viewport fractions, each carrying a `semantic`
description. An 18-second animated scene is roughly 20 operations and 2.4
kilobytes.

**Four decoupled loops.** The system runs four processes at four speeds: a
conversation loop (one model call per interaction; clicks are messages, so
the model mutates its own scene rather than repainting); a network read
loop delivering arbitrary text fragments; a parser that scans a buffer by
brace depth and emits exactly one patch per completed object, absorbing all
chunk-boundary chaos; and a render loop at display refresh that never waits
for anything. They meet only at a shared node map: streaming mutates state,
rendering samples it. A node mounted mid-stream simply begins existing and
animates in while later tokens are still arriving — **token pacing becomes
choreography**. The pattern's lineage is old and honorable: game-engine
loops, immediate-mode rendering, incremental parsers. The composition for
LLM-authored scenes is what is new.

**The choreographer.** Motion decisions (which verb, what duration, what
easing) can be made by the model, by a local policy, or by both. A ~40-line
policy that keys on patch semantics — position determines entry direction,
id-match means morph rather than remove-and-add, mood scales tempo — cuts
output tokens roughly 30–40%, makes motion consistent and unit-testable,
and functions as a versioned motion design system. This is the layer that
makes the approach governable at organizational scale.

## 4. Evidence from three prototypes

**exp-01, a scene-graph compositor** (8 KB, single file, no model, no
server) reproduced ingredients 1–3: spring-animated reflow on resize,
Ken Burns and particle ambience, semantic hit-testing with runtime
promotion of a decorative element to interactive. Measured: a 1.25 KB scene
description versus ~15 MB per user-minute for a conservative 2 Mbps video
stream — a ~12,000× bandwidth difference, before counting GPU time.

**exp-02, transition choreography** mapped the entire visual vocabulary
observed in video-generated UIs — dissolve, zoom, fly-in/out,
shared-element morph, palette shift, image swap — onto eight patch verbs
played by a ~60-line transition engine. The stream runs at ~1.1 kbit/s
versus ~2,000 kbit/s for equivalent video. One design law emerged: ambient
motion must continue *through* transitions; an image that keeps drifting
while it cross-dissolves reads as repainted, one that freezes reads as
loading.

**exp-03, the live painter** put a real model (Claude Sonnet) in the loop:
type a request, the model streams patches, the scene assembles at token
speed; clicking any element sends its semantics back as a conversation
message and the model streams a mutation. The first two live runs failed
instructively. Run 1: given a `note` operation for narration, the model
*described* the scene instead of painting it — any escape hatch in a
protocol becomes the model's path of least resistance. Run 2: the
protocol's own example nodes used JavaScript-style decimals (`.5`), the
model imitated them faithfully, and strict JSON parsing rejected every
coordinate-bearing node — **models imitate examples over rules; the
examples are the spec.** With a hardened spec, a tolerant parser, and a
self-correcting nudge, run 3 painted successfully. We offer these as early
data points for a claim we expect to generalize: *protocol design is
behavior design.*

## 5. Position in the generative-UI landscape

Generative UI is an active space: Vercel's AI SDK streams React components
from model tool-calls; Google's A2UI is an open declarative protocol in
which agents emit flat, ID-referenced component lists designed for
incremental streaming without arbitrary code execution; Thesys C1 offers a
commercial API returning streaming charts, forms, and cards. All of these
make interfaces *assemble*. None of them targets the property this work
takes as its objective: the feeling that the screen is being painted. To
our knowledge, no prior system combines a resolution-independent scene
graph with a transition-choreography layer for the explicit purpose of
reproducing the video-model aesthetic — and the term "painted UI" does not
appear as a named technique in the literature, which uses "generative UI"
for the assembly paradigm and reserves "paint" for browser-rendering
metrics. We propose the term for exactly this synthesis.

The approach is complementary to the existing stack, not competitive with
it: an agent framework remains the director; a declarative protocol like
A2UI is a natural substrate (its incremental ID-referenced updates are
patch operations in all but name); painted UI adds the transition
vocabulary and choreographer that turn protocol messages into something
that feels authored in front of you.

## 6. Why it scales

The expensive path's cost is per-second-per-user with zero idle relief. The
painted path's cost is per-interaction tokens (~400–700 output tokens per
scene, order of $0.002–0.01 at mid-2026 prices), with $0 between
interactions, kilobyte payloads, no server GPU, and rendering distributed
to client silicon — integrated graphics comfortably sustain the entire
motion vocabulary. Static assets amortize across users via semantic
caching.

**The on-device endgame.** We believe small language models running on the
user's own device are not a nice-to-have here but the technique's natural
conclusion. Emitting a constrained patch grammar is exactly the kind of
narrow structured task where 1–4B-parameter models are credible, and
in-browser engines already run Phi/Gemma/Qwen-class models via WebGPU at a
substantial fraction of native speed, with streaming and JSON modes.
Three consequences follow. Cost: token cost — the *only* per-interaction
cost the architecture has left — goes to zero. Reliability: local
inference permits grammar-constrained decoding, which masks invalid tokens
at generation time, making the protocol failures of runs 1–2 structurally
impossible rather than merely discouraged. Character: painting works
offline and privately, and a cloud director can collaborate with a local
choreographer-model — big model decides *what*, small model on the device
decides *how* and reacts within a frame. A painted interface whose painter
lives on your device is the full inversion of the GPU-per-viewer model
that motivated this work.

Multi-agent operation is where the two paths separate categorically rather
than quantitatively: N agents painting one screen is N interleaved
kilobyte streams on the painted path, and N impossible GPU streams on the
video path. Swarm patterns — a slow "gardener" agent tending ambience, a
critic issuing correction patches, speculative agents pre-painting likely
next states so interaction latency is perceived as zero — are, we believe,
the technique's most promising unexplored territory.

## 7. Limitations

Fidelity has a ceiling: parameterized transitions cannot produce arbitrary
painterly in-betweens (a face melting into a landscape remains video
generation's edge; GPU-shader brushwork narrows but does not close this).
Whether current models compose *beautifully* at production reliability is
unproven — our live results are an existence proof, not a benchmark; formal
measurements (time-to-first-paint, parse rates, verb taste across models)
are the next milestone. Cost figures above are order-of-magnitude
estimates. And the thesis itself is falsifiable: if user testing shows the
wow depends on properties unique to generated video, or if real-time video
diffusion gets cheap faster than expected, the economic argument erodes.

## 8. Reproducibility

Everything described here is a single-file HTML prototype in this
repository — the compositor (exp-01), the transition engine (exp-02), the
live painter with its full failure log (exp-03), and interactive
explainers for the four-loop architecture and the choreographer. Open them
in a browser; the live painter needs only an Anthropic API key.

## Acknowledgments

Prototypes, measurements, and drafting were done in collaboration with an
AI research agent (Claude, Anthropic); direction, curation, and the
question that started it — *"what makes this feel magical, and what does it
actually cost?"* — are the author's.

## References

1.