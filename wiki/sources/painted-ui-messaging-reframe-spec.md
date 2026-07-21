# Painted UI Messaging Reframe Specification

## Purpose

Guide Claude Code in revising the messaging across the Painted UI explanatory HTML pages so the project is presented as an architectural synthesis for AI-generated interfaces—not merely as a painterly animation demo.

The implementation should preserve the existing demos, visual design, theater metaphor, technical explanations, and honest prior-art discussion. The work is primarily a **content architecture and copy revision**, with only minor structural HTML changes where needed to support the new message hierarchy.

---

## Primary Reframe

### Current perception

The current pages can be read as:

> An LLM streams JSON instructions that create a painterly animated interface.

That description is accurate, but too narrow. It makes the project sound like a visual-effect technique.

### Target perception

The revised pages should communicate:

> Painted UI is an implementation of a broader architectural pattern: the model emits semantic intent, local policy converts intent into governed behavior, and the client synthesizes the final experience at display speed.

The central idea is not “AI draws a screen.”

The central idea is:

> **The model should render intent, not pixels.**

The system separates expensive semantic decisions from cheap, deterministic execution.

---

## Naming Strategy

### Project name

Keep **Painted UI** as the project, experiment series, and memorable product identity.

Do not rename the repository or erase the phrase “painted live.”

### Architectural category

Introduce **Semantic Rendering** as the broader architectural category being explored.

Preferred formulation:

> Painted UI is an experiment in semantic rendering.

Definition:

> Semantic rendering is an architecture in which a model emits meaning and change as structured intent, while local software applies design policy, motion, layout, accessibility, and rendering.

Do not claim that the term itself is universally established or that Painted UI invented every underlying technique.

### Optional supporting phrase

Use **Intent → Policy → Experience** as the compact system model.

### Canonical tagline

Use this as the primary memorable line across the collection:

> **The model renders intent. The client renders experience.**

Secondary taglines may include:

- Render meaning. Animate locally.
- Tokens buy meaning; code performs it.
- The network streams semantics; the client synthesizes experience.
- The model directs; your device performs.

Do not use all of them in every page. Each page should have one primary line and at most one supporting line.

---

## Core Thesis

Every page should reinforce some part of this thesis:

1. The LLM is best used for semantic judgment: what should exist, what should change, and why.
2. The model should not spend tokens describing routine animation mechanics, pixel output, or frame-by-frame execution.
3. Structured semantic patches cross the network.
4. A local policy layer compiles semantic changes into governed behavior.
5. Shared state decouples token-speed mutation from frame-speed presentation.
6. The client performs layout, motion, rendering, interaction, and accessibility using ordinary local code.
7. This makes the interface streamable, interruptible, testable, replayable, brand-governed, accessible, and economically scalable.

---

## The Architectural Stack

Present the architecture at two levels.

### Level 1: Universal abstraction

```text
Intent → Policy → Experience
```

Or:

```text
Model intent
    ↓
Semantic protocol
    ↓
Local policy compiler
    ↓
Shared state
    ↓
Client experience
```

This is the transferable architectural idea.

### Level 2: Painted UI theater metaphor

```text
Director → Script → Choreographer → Stage → Animator
```

Definitions:

- **Director** — the model or agent. Decides what exists and what changes.
- **Script** — the streamed semantic patch protocol.
- **Choreographer** — the local behavioral policy compiler. Decides how a semantic change should be performed.
- **Stage** — shared retained state, including identity and active transitions.
- **Animator** — the frame-rate executor. Samples current state and applies it to the rendering target.

The theater vocabulary explains the implementation. It should not replace the universal abstraction.

---

## Reposition the Choreographer

The Choreographer is currently described mainly as a motion-policy layer. Expand its significance.

### New definition

> The Choreographer is a deterministic semantic compiler that turns a change in meaning into a governed local behavior.

Motion remains the current implementation focus, but the concept can govern:

- transition verb
- duration and easing
- stagger and rhythm
- layout response
- focus management
- reduced-motion behavior
- announcement priority
- error emphasis
- success emphasis
- interaction affordances
- brand-specific behavior

### Required distinction

Do not imply that the Choreographer must be another agent or model.

Preferred language:

> It is usually versioned local code. A model may provide a scene mood or rare override, but policy supplies the quality floor.

### Canonical economic argument

> Every routine decision moved from the model into policy moves from tokens, latency, and variance into code that is local, instant, testable, and reusable.

Avoid repeatedly saying that every non-model layer is literally “free forever.” Prefer “near-zero marginal runtime cost” or “no additional token cost.”

---

## Add Architectural Invariants

Create one shared section, or a concise variant on multiple pages, called **Architectural Invariants**.

Required invariants:

1. **The Director never renders frames.**
2. **The Animator never makes semantic decisions.**
3. **Only allow-listed semantic instructions cross the model boundary.**
4. **Stable identity represents continuity.** The same ID means the same thing changed; it should morph rather than disappear and reappear.
5. **Rendering never waits for generation.**
6. **Policy is versioned separately from content.**
7. **The rendering target is replaceable.** Canvas, DOM, A2UI components, native views, or other targets may implement the same semantic stream.
8. **The same patch stream is loggable and replayable.**
9. **Accessibility is derived from the same semantics, not bolted on afterward.**
10. **Reduced motion changes policy, not meaning.**

Do not present these as mathematically proven laws. They are design constraints of this architecture.

---

## Add Failure-Mode Reasoning

The messaging should show why the decomposition is useful, not simply describe the parts.

Add a compact table titled **What breaks when responsibilities collapse?**

| Collapsed responsibility | Result |
|---|---|
| Model emits pixels or frame instructions | High bandwidth, high latency, poor accessibility, expensive continuous generation |
| Model chooses every routine transition | Token waste, visual variance, weak brand governance |
| Network arrival controls rendering | Motion stalls when the stream stalls |
| Parser assumes chunk boundaries | Partial or combined objects are lost or misapplied |
| Nodes lack stable identity | Updates become remove-and-add; continuity and morphing disappear |
| Renderer owns business meaning | Rendering target becomes hard to replace and difficult to test |
| Animation and accessibility are separate systems | Visual state and semantic state drift apart |

Use these as architectural consequences, not fear-based marketing.

---

## Claim Discipline

### Claims that can be stated strongly

- The current implementation decouples streaming mutation from frame-rate rendering.
- Stable IDs enable continuity and morphing.
- A local policy can produce deterministic behavior from semantic patches.
- Semantic patches are smaller than generated video streams.
- Local rendering has zero token cost between interactions.
- Declarative patches can be logged, replayed, inspected, and allow-listed.
- The same semantic structure can support interaction and accessibility.

### Claims that must remain qualified

- “Same feeling as video generation” should be framed as an experiential goal, not an established equivalence.
- Performance on low-end devices remains to be benchmarked.
- Cost figures are order-of-magnitude estimates until backed by a reproducible cost model.
- Token savings such as 30–40% must be labeled as experiment-specific estimates.
- Enterprise readiness is a direction supported by architectural properties, not a completed certification.
- Do not say “nobody else is doing this” without narrowly defining the compared set and date.
- Do not frame A2UI, C1, Vercel AI SDK, or other systems as inferior; describe the additional layer Painted UI explores.

### Preferred novelty language

Replace broad novelty claims with:

> The individual techniques are established. The contribution is the composition: streamed semantic mutation, stable identity, local behavioral policy, and frame-rate execution combined to produce a continuously authored interface without generating every pixel remotely.

---

## Add a “Composer” Concept Carefully

The previous critique identified a missing design-time role: the vocabulary from which the Director composes.

Do not add Composer as a sixth runtime loop.

Introduce it as a **design-time substrate**:

> The Component Grammar defines the nouns and verbs the system is allowed to use.

Examples:

- nouns: card, chart, hero, form, timeline, notice
- semantic operations: add, update, remove, focus, group, replace
- behavioral vocabulary: enter, emphasize, morph, settle, dismiss

Preferred label: **Component Grammar** or **Experience Grammar**.

Avoid introducing another theatrical character unless the existing page layout strongly benefits from it. Too many characters will weaken the metaphor.

---

## Page-by-Page Changes

## 1. `how-it-works-together.html`

### Role

Make this the canonical landing page and architectural overview.

### Required hero

Suggested content:

**Kicker**

> Painted UI · an experiment in semantic rendering

**Headline**

> The model renders intent. The client renders experience.

**Subhead**

> Painted UI streams semantic changes instead of pixels. Local policy turns those changes into governed motion, and a frame-rate executor performs them immediately on the user's device.

**Callout**

> Intent → Policy → Experience

### Required structure

Order the major sections as follows:

1. The one-sentence thesis
2. Intent → Policy → Experience
3. The five-role theater mapping
4. One patch traveling through the architecture
5. The four clocks
6. Architectural invariants
7. What breaks when responsibilities collapse
8. Why this matters for products and enterprises
9. Honest lineage and current limits
10. Links to deep dives

### Messaging changes

- Make the pipeline visually distinguish universal concepts from metaphorical role names.
- Explain that the Stage is the synchronization boundary, not the conceptual thesis.
- Change any copy implying that the “illusion” alone is the contribution. The animated feeling is the visible result of a more general architecture.
- Keep the interactive trace; make its narration use the verbs **interpret**, **compile**, **mutate**, and **perform**.

---

## 2. `the-cast(1).html`

### Role

Explain responsibility boundaries.

### Revised opening

Replace “Five roles, one show” as the sole framing with:

> Semantic rendering separates judgment from execution. Painted UI explains that separation as five roles in one show.

### Role copy

#### Director

> Decides what exists, what changes, and what the change means. Emits allow-listed semantic patches—not pixels, animation frames, or arbitrary client code.

#### Script

> The transport form of intent: small, incremental, replayable semantic patches arriving over the wire.

#### Choreographer

> Compiles semantic change into governed behavior: motion, timing, emphasis, focus, and accessibility policy. Usually deterministic local code.

#### Stage

> The shared state boundary. Stable identity, current values, and active transitions live here.

#### Animator

> Samples the Stage at display rate and applies current values to the chosen rendering target. It performs; it does not interpret.

### Required new section

Add **Responsibility test**:

For each role, answer:

- What does it know?
- What is it allowed to decide?
- What must it never do?
- What is its cost profile?
- How is it tested?

### Fix naming residue

Replace remaining runtime references to “painter” with “Animator” unless discussing historical Canvas experiments.

Where historical terminology is necessary, use:

> Animator, called the Painter in the original Canvas experiments.

### Revised final summary

Use:

> The Director interprets. The Script transports. The Choreographer compiles. The Stage remembers. The Animator performs. The model renders intent; the client renders experience.

---

## 3. `the-choreographer(1).html`

### Role

Make this the strongest enterprise and architecture page.

### Revised title and subhead

**Title**

> The Choreographer

**Subhead**

> A deterministic semantic compiler between model intent and client experience.

### Required content changes

- Explain that “motion policy” is the first implementation, not the conceptual ceiling.
- Introduce policy domains: motion, layout, focus, announcement, reduced motion, error, success, and brand behavior.
- Preserve the three architectures: model-picked, local-policy, and hybrid.
- Recommend hybrid as the long-term pattern:
  - policy provides defaults and constraints
  - scene mood tunes global character
  - rare model overrides request exceptional behavior
  - invalid or disallowed overrides are ignored or normalized

### Add policy contract

Include a conceptual signature such as:

```js
compileBehavior({ patch, node, scene, userPreferences, designSystem })
  -> { motion, layout, focus, announcement, interaction }
```

Clarify that an implementation can start with only `motion`.

### Add policy precedence

```text
Safety and accessibility
    > user preferences
    > product design system
    > scene mood
    > model override
```

A model override must never bypass reduced-motion, accessibility, security, or component allow-list constraints.

### Economics wording

Retain the economics table, but:

- label estimates clearly
- distinguish token cost, transport cost, and local compute cost
- replace “free” with “no incremental token cost” where precision matters
- emphasize **decision locality**, not just animation cost

### Enterprise framing

Preferred line:

> The Choreographer turns generative output into governable product behavior.

This should be more prominent than “the feel layer.”

---

## 4. `the-painter.html`

### Role

Explain frame-rate execution clearly without making it seem like the entire invention.

### File naming note

Do not rename the file in this pass unless all references and routes can be changed safely. The page itself should consistently call the role **Animator**.

### Revised hero

> The Animator is the execution layer of semantic rendering. It reads current state at display speed and applies it to Canvas, DOM, A2UI components, or another rendering target.

### Required technical clarification

The page currently mixes the original immediate-mode Canvas model with the A2UI/DOM direction. Make the distinction explicit:

- **Canvas implementation:** clear and redraw every frame.
- **Retained component implementation:** sample state and update transforms/properties; do not claim the DOM is fully redrawn every frame.

The universal responsibility is:

> sample current state and apply it at display rate

—not necessarily “paint every pixel again.”

### Required invariants

Emphasize:

- never waits for network input
- never calls the model
- never chooses semantic meaning
- does not own business state
- can be replaced without changing the semantic protocol

### Update labels

Change UI labels such as:

- `painter canvas` → `animation target · Canvas demo`
- `frames painted` → `frames sampled` or `frames rendered`

Keep historical explanations where helpful.

---

## 5. `why-four-loops(1).html`

### Role

Make this the concise argument for decoupled clocks and architectural necessity.

### Revised title

> Why Independent Clocks?

Keep “Why Four Loops?” as a subtitle or historical experiment label.

Reason: the important idea is not that every implementation must literally contain exactly four JavaScript loops. The important idea is that four responsibilities operate at incompatible rates and must be decoupled.

### Required clarification

State:

> Four loops describe the reference implementation. Independent clocks describe the architectural requirement.

The clocks are:

1. conversation / agent turn
2. transport arrival
3. incremental parse / patch completion
4. display refresh

A production implementation may use streams, callbacks, workers, schedulers, or framework primitives, but it must preserve the separation.

### Revised novelty slide

Use:

> None of the clocks is novel. The synthesis is the boundary design between them.

Then describe the contribution as:

- semantic changes arrive incrementally
- parser boundaries are independent from network chunks
- stable state absorbs completed patches
- local policy turns change into behavior
- rendering continues at display speed through network stalls

### Prior-art slide

Keep comparisons careful and time-bounded.

Suggested title:

> Adjacent systems and the layer Painted UI explores

Avoid “what they don't do” phrasing where it sounds dismissive. Prefer:

| System | Primary focus | Additional layer explored here |

### Revised final 30-second pitch

> Models are good at deciding what an interface should mean, but they are an expensive and unreliable place to execute every visual detail. Painted UI streams small semantic changes, compiles them through local product policy, and performs them at display speed on the client. The result is a generative interface that can feel continuously authored without generating and streaming every pixel.

---

## Cross-Page Terminology Rules

Use these terms consistently:

| Preferred | Avoid or qualify |
|---|---|
| semantic patch | raw JSON command, drawing command |
| semantic rendering | AI painting, unless discussing the visual metaphor |
| local policy | AI choreography, when no model is involved |
| behavioral compiler | motion helper, animation picker |
| Animator | Painter, except historical context |
| rendering target | canvas only |
| stable identity | same object by coincidence |
| display rate | always exactly 60 fps |
| near-zero marginal execution cost | completely free |
| structured intent | model-generated UI code |
| governed behavior | magical motion |

Do not mechanically replace every occurrence of “paint,” “painting,” or “painterly.” Those words remain valuable when describing the desired experience and the project identity.

---

## Messaging Hierarchy

Every page should answer these questions in roughly this order:

1. What is the big idea?
2. Why is it useful?
3. What is the local page's specific responsibility?
4. How does it work?
5. What breaks without it?
6. What evidence does the demo provide?
7. What remains unproven?

Avoid opening with implementation details before the reader understands the architectural value.

---

## Audience Layers

Write so three audiences can use the pages.

### Product leader

Should understand:

- continuously authored generative UI without video-generation economics
- brand governance
- accessibility
- auditability
- lower variance

### Architect or staff engineer

Should understand:

- semantic protocol boundary
- state identity
- independent clocks
- deterministic policy
- replayability
- rendering-target independence

### Frontend engineer

Should understand:

- streaming parser
- patch application
- tween retargeting
- requestAnimationFrame or equivalent
- Canvas versus retained component targets

Use layered disclosure: thesis first, details in tables, accordions, code samples, and demos.

---

## Add a Compact “Laws of Semantic Rendering” Section

Add this to the overview page and optionally link to it from the deep dives.

Suggested copy:

1. Models emit intent, not frames.
2. Meaning crosses the network; routine behavior stays local.
3. Stable identity turns replacement into continuity.
4. Policy supplies the quality floor.
5. Rendering never waits for generation.
6. State is the boundary between arrival and performance.
7. Accessibility and motion derive from the same semantics.
8. The renderer is replaceable.
9. The stream is inspectable and replayable.
10. Expensive intelligence decides what; cheap local code performs how.

Present these as design laws for this project, not universal scientific laws.

---

## Required Caveats / Open Questions

Preserve or add a visible section containing:

- policy-only expressiveness ceiling
- interruption semantics: retarget, queue, or cancel
- low-end device performance
- DOM/A2UI adapter validation
- accessibility mirror implementation
- grammar-constrained protocol validation
- objective cost benchmark
- comparison methodology for perceived “painted-live” quality
- usability testing: whether motion aids comprehension or creates distraction

A confident project becomes more credible when it names what remains to be demonstrated.

---

## Implementation Constraints for Claude Code

1. Do not remove functional demos.
2. Do not change patch schemas or JavaScript behavior unless required to fix a messaging inconsistency.
3. Preserve the dark visual theme and existing color-role associations.
4. Preserve accessibility-friendly HTML components in the A2UI direction.
5. Do not turn every page into a duplicate of the overview page.
6. Keep technical pages technical after improving their opening hierarchy.
7. Fix links and companion filenames where uploaded filenames contain `(1)` but internal references do not.
8. Search for all occurrences of `Painter`, `painter`, `painted`, `free`, `novel`, `60fps`, `A2UI`, and `four loops`; inspect each rather than blindly replacing.
9. Maintain historical distinctions between the Canvas experiments and the production-target architecture.
10. Add comments around major messaging sections so future edits can locate them easily, for example:

```html
<!-- SEMANTIC RENDERING THESIS -->
<!-- ARCHITECTURAL INVARIANTS -->
<!-- FAILURE MODES -->
<!-- CLAIMS AND CAVEATS -->
```

---

## Acceptance Criteria

The revision is complete when:

- [ ] A reader can state the central thesis after reading only the hero and first section of `how-it-works-together.html`.
- [ ] “Painted UI is an experiment in semantic rendering” appears prominently on the overview page.
- [ ] “The model renders intent. The client renders experience.” appears as the canonical tagline.
- [ ] Intent → Policy → Experience appears before the theater metaphor.
- [ ] The Choreographer is described as a deterministic semantic or behavioral compiler, not only an animation picker.
- [ ] The four loops page clarifies that independent clocks are the requirement and four loops are the reference implementation.
- [ ] The Animator page clearly distinguishes Canvas redraw from retained-component updates.
- [ ] Runtime naming consistently uses Animator, with Painter retained only for historical Canvas context.
- [ ] Architectural invariants and failure modes are visible.
- [ ] Novelty claims describe the composition rather than claiming invention of the individual techniques.
- [ ] Quantitative claims are labeled as measured, estimated, or unverified.
- [ ] Enterprise messaging emphasizes governance, testability, accessibility, replayability, and decision locality.
- [ ] Existing interactive demos still run without console errors.
- [ ] Internal links and companion filenames resolve.
- [ ] The pages remain visually coherent and do not become walls of repeated manifesto copy.

---

## Recommended Execution Order

1. Update `how-it-works-together.html` and establish canonical wording.
2. Update `the-cast(1).html` using the canonical definitions.
3. Expand `the-choreographer(1).html` around the behavioral-compiler framing.
4. Clarify Canvas versus retained rendering in `the-painter.html`.
5. Reframe `why-four-loops(1).html` around independent clocks.
6. Run a cross-file terminology pass.
7. Test every interactive demo.
8. Review the five pages in sequence as a first-time reader.

---

## Final Editorial Test

After the changes, the collection should no longer leave the reader thinking only:

> “This is a clever way to animate streamed JSON.”

It should leave the reader thinking:

> “This is a coherent architecture for deciding which parts of generative UI belong to the model and which parts belong to deterministic client software.”
