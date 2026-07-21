# Source: deck-upgrade batch, July 2026 (review record)

**What this is:** Neal applied a batch of externally-suggested upgrades to
three decks (`the-cast.html`, `the-choreographer.html`,
`why-four-loops.html`) and asked for a review: all, some, none?
**Verdict: ~90% kept, 2 corrections applied.** (The original suggestion
file arrived empty; this page reviews the changes as applied.)

## Kept — genuine improvements

- **"Independent clocks"** framing (why-four-loops): loops = reference
  implementation; independent clocks = the architectural requirement. The
  correct generalization; adopted.
- **Source-agnostic Director** ("cloud LLM, on-device SLM, or any source
  of structured intent") + "allow-listed semantic patches" — strengthens
  governance/enterprise story; consistent with
  [[concepts/experience-frontier]] SLM direction.
- **"A deterministic semantic compiler between model intent and client
  experience"** — best one-line definition of the
  [[concepts/choreographer]] to date; adopted.
- **Policy domains beyond motion** (layout response, focus management,
  announcement priority, reduced-motion, brand overrides) — aligns with
  the audit's accessibility-mirror; adopted.
- **`compileBehavior({patch, node, scene, userPreferences, designSystem})`**
  conceptual contract — good API shape for the SDK direction.
- **Diplomatic prior-art table** ("additional layer explored here" vs
  "what it doesn't do") — better enterprise positioning; the sharp
  gap-analysis remains in the paper, where it belongs.
- **"(experiment estimates)"** annotations on token numbers — honesty
  ethos, adopted.

## Corrected — two issues

1. **⚠️ Present-tense A2UI claims.** Two decks stated the render loop
   "applies tween values to A2UI components as CSS transforms" as current
   fact. Every experiment in this repo renders to canvas; an A2UI/DOM
   adapter is a *future* target (exp-06/exp-11 territory). Stating it as
   present-tense contradicts the demos one click away and the repo's
   honest-evidence standard. Rephrased to target-dependent truth: canvas
   today, component trees via adapters as they land.
2. **Painter → Animator rename.** Wholesale renaming breaks the coined
   brand language ("the model directs; your device *paints*") used in the
   paper, pitch, README, and tagline. Reconciled as **one role, two stage
   names**: the *Painter* when the target is canvas pixels, the *Animator*
   when the target is a component tree. Same contract either way: performs,
   never interprets. Also generalized "A2UI" to "DOM / A2UI-style /
   native" per the vendor-neutrality guardrail.

## Rule extracted for future upgrade batches

Upgrades that sharpen language, extend policy scope, or soften rhetoric:
welcome. Upgrades that (a) claim unbuilt capabilities in the present
tense or (b) rename coined terms mid-corpus: revise before merging. The
brand is "painted"; the evidence is the demos; both are load-bearing.
