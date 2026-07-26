# Source #9 — Material 3 Expressive (motion physics, shape, research)

**Citation:** Material Design, "Start building with Material 3 Expressive"
(May 2025) plus the motion-physics and shape specifications behind it.
Raw clip: `raw/articles/m3-expressive-2025.md` (structured notes and short
attributed quotes; spec tables recorded verbatim as factual data).
- m3.material.io/blog/building-with-m3-expressive
- m3.material.io/styles/motion/overview (+ `/specs`)
- m3.material.io/styles/shape/overview-principles

**Type:** external prior art — the first *design-system* source in the wiki.
Ingested at Neal's request while opening the "physical expression" thread.

## Why it matters here

Material replaced its easing-and-duration motion system with a
**physics/spring system**, governed by a small token vocabulary applied at
product level. That is the same architectural position painted UI takes
with [[concepts/choreographer]] — motion decided centrally by deterministic
code, callers naming meaning rather than milliseconds — arrived at
independently by the industry's most-researched design system. Useful as
convergent validation, and immediately useful as engineering.

## Key takeaways

1. **Spatial vs effects springs.** Position/size/rotation/corner-radius
   overshoot and bounce; colour/opacity never overshoot. The property being
   animated determines whether bounce is permitted. Our choreographer
   currently returns one uniform motion shape for every property — this is
   the cheapest available upgrade to perceived physicality, and it is
   legible in Material's own published curves (spatial control points
   exceed 1.0; effects cap at 1.00).

2. **Springs retarget without snapping** — Material's stated reason for
   switching. A spring carries velocity as state, so a mid-flight change of
   target continues rather than jumps. This unblocks **exp-14 "Interrupt
   the Choreographer"** ([[sources/chatgpt-motion-recommendations]]), which
   was blocked precisely because closed-form tweens have no velocity.
   Reconciliation with [[concepts/four-loops]]'s closed-form requirement is
   worked out in [[techniques/motion-physics]]: the damped oscillator has an
   exact analytic solution, so velocity-continuity costs us nothing.

3. **Six tokens, two schemes.** {fast, default, slow} × {spatial, effects},
   with `expressive` (bouncy) and `standard` (functional) selected at
   product level — token names never mention the scheme, so schemes swap
   without touching call sites. This is
   [[techniques/scene-grammar-v2]]'s grammars-vs-themes split, shipped by
   someone else. Also a discipline check: six tokens, not forty knobs.

4. **Speed scales with element size and device class**, not just mood.
   Small components fast, full-screen slow; the same token resolves
   differently on watch/phone/tablet. Both axes are computable locally at
   zero token cost — more judgment moved out of the Director, which
   [[concepts/on-device-models]] now shows is a correctness win and not
   only a cost one.

5. **Published web conversion values.** Twelve cubic-bezier + duration
   pairs, usable directly. [[techniques/motion-physics]] solves these back
   into (ζ, stiffness) pairs and tabulates them.

6. **Shape morphing as behavior.** 35 shapes with built-in morph; morph
   should respond to interaction and communicate interaction state, work in
   progress, and environmental change. Painted UI has no named vocabulary
   for silhouette or corner radius as animated properties — proposed
   `squish` / `cornerMorph` / `shapeShift`. Their "shape can be 2.5D —
   apply motion and shape differently per layer" independently confirms our
   parallax layering.

7. **The research metric worth stealing.** 46 studies, 18,000+ participants;
   the headline behavioral finding is that participants spotted key UI
   elements **up to four times faster** on expressive screens.
   **This is a fix for exp-08.** The paused perception study used seven
   subjective 7-point scales and the reviewer could not distinguish the
   conditions ([[sources/audit-2026-07]]). *Time-to-locate-target* is an
   objective, behavioral dependent variable that does not require the
   participant to have vocabulary for what they are feeling — a far
   stronger design for a resumed study, alongside the
   video-diffusion comparison arm the audit already demanded.

## ⚠️ Where we disagree with it

Material's restraint guidance — abstract shapes used sparingly, decoration
without clear meaning treated as clutter, hero moments capped at one or two
per product — is in genuine tension with painted UI's ambient-motion
doctrine (the gardener cycle, idle breath, "the painter never stops"). The
two systems optimise for different things: theirs for hierarchy and task
speed, ours additionally for the illusion of being painted. Recorded as a
disagreement, not resolved. A **quiescence policy** (true stillness after N
seconds; ambient motion budgeted rather than default) is the proposed
reconciliation, and it also answers the ProMotion battery cost noted in
[[concepts/on-device-models]] — adaptive displays drop to ~10 Hz only when
content is actually static.

## What we deliberately do not take

- **The component catalog.** M3 Expressive is a component design system;
  painted UI's differentiator is that it does not assemble widgets. Adopt
  the physics, the token structure and the shape principles; adopting the
  components would undercut the thesis.
- **The identity.** Google-branded, Android-first. Per the wiki's
  vendor-neutrality rule this is cited as prior art, not adopted as
  language. Note also that Android's own frame-timing class is literally
  named `Choreographer` — a naming collision worth documenting before any
  Android implementation, since our Choreographer sits one layer upstream
  of theirs.

## Wiki pages touched

- [[techniques/motion-physics]] — **new**, the substantive page.
- [[concepts/choreographer]] — spatial/effects rule, spring output,
  interruption question answered, size/device axes.
- [[concepts/four-loops]] — closed-form-vs-spring reconciliation.
- [[techniques/scene-grammar-v2]] — shape verb family.
- [[index]], [[log]].

## Caveats

Design-system documentation, not peer-reviewed research; the 4× figure is
reported in a vendor blog post without a published method. Treat the
*direction* as strong evidence and the *magnitude* as a claim to verify if
we ever cite it publicly.
