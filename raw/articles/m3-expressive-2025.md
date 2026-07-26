# Raw: Material 3 Expressive — motion physics, shape, research

Clipped 2026-07-25 from three public Material Design pages. **Structured
notes plus short attributed quotes only** — no wholesale copying (public
repo; same standard used for the Nystrom/Fiedler clip). Numbers and token
tables are recorded verbatim because they are factual specifications.

Sources:
- https://m3.material.io/blog/building-with-m3-expressive — "Start building
  with Material 3 Expressive", Material Design, May 2025
- https://m3.material.io/styles/motion/overview — motion physics system,
  "how it works"
- https://m3.material.io/styles/motion/overview/specs — spring tokens and
  the web conversion table
- https://m3.material.io/styles/shape/overview-principles — shape library
  and shape-morph principles

---

## 1. What M3 Expressive is

An evolution of Material 3, not a new major version — the post is explicit
that M3 is not deprecated and this "isn't 'M4.'" A set of new/updated
components, new styles (motion physics, emphasized typography, expanded
shape library, vibrant color) and seven named "expressive tactics."

Positioning quote (short, attributed): Material describes expressive
interfaces as having "an emotional impact, fostering connection by evoking
a feeling or mood."

## 2. The research claims

Described as Material's most-researched update since 2014:

- **46 studies, more than 18,000 participants.**
- Expressive designs preferred across all age groups.
- Score higher on playfulness, energy, creativity, friendliness.
- Users more likely to switch to products using M3 Expressive components.
- **Participants spotted key UI elements "up to four times faster" on
  expressive screens.**

The last bullet is the one with methodological value for us: it is an
objective, behavioral dependent variable (time to locate a target), not a
subjective rating scale.

## 3. The motion physics system (the core find)

Introduced May 2025. **Replaces** the previous easing-and-duration system
rather than supplementing it. Availability: Jetpack Compose (available,
21 components use it by default), Android Views/MDC-Android (available,
not yet wired into components), Web (compatible — use springs where
possible, else the conversion curves below), Flutter (unavailable).

### Motion schemes

Two presets, selected at **product level**, not per animation:

| Scheme | Behavior | Use |
|---|---|---|
| **Expressive** | overshoots the final value to add bounce | most situations, hero moments, key interactions |
| **Standard** | eases into final values, minimal bounce | utilitarian products |

Custom schemes are supported; schemes can be overridden per element
(Compose: override the CompositionLocal for that composable).

### Springs

"A spring is a combination of three attributes which control all motion
behavior: **stiffness, damping, and initial velocity**."

Stated properties (short quotes, attributed):
- versatile — "One spring can apply to many situations, such as
  transitions, button effects, or gestures."
- natural/predictable — and critically: springs "handle gestures,
  interruptions, and retargeting animations seamlessly."

### The two token families — the key distinction

- **Spatial** tokens: animate things that *move* — x/y position, rotation,
  size, rounded corners. "This spring overshoots the final value and
  bounces into place."
- **Effects** tokens: animate **color and opacity**, "where there shouldn't
  be any overshoot."

### Speed tiers

Three per family — `fast`, `default`, `slow`:

| Speed | Spatial example | Effects example |
|---|---|---|
| Default | partially-covering animations (bottom sheet, expanded nav rail) | opacity of content within a navigation rail |
| Fast | small components (switches, buttons) | color change of a switch handle |
| Slow | full-screen animations | full-screen content refresh |

So: **2 schemes × 2 families × 3 speeds = 6 tokens per scheme.** Token
naming example given: `md.sys.motion.spring.fast.spatial`. The scheme is
*not* part of the token name — it is applied at product level so schemes
can be swapped without changing assigned tokens.

### Device scaling

"the exact values of each token differ depending on if the device is a
wearable, phone, or tablet" — the *ordering* is invariant (fast is always
faster than default) but the absolute values are device-class dependent,
"to ensure the movement feels fast in the context of the device."

### Web conversion table (verbatim specification)

Cubic-bezier approximations of the springs, with durations:

| Token | cubic-bezier | Duration |
|---|---|---|
| Expressive fast spatial | 0.42, 1.67, 0.21, 0.90 | 350 ms |
| Expressive default spatial | 0.38, 1.21, 0.22, 1.00 | 500 ms |
| Expressive slow spatial | 0.39, 1.29, 0.35, 0.98 | 650 ms |
| Expressive fast effects | 0.31, 0.94, 0.34, 1.00 | 150 ms |
| Expressive default effects | 0.34, 0.80, 0.34, 1.00 | 200 ms |
| Expressive slow effects | 0.34, 0.88, 0.34, 1.00 | 300 ms |
| Standard fast spatial | 0.27, 1.06, 0.18, 1.00 | 350 ms |
| Standard default spatial | 0.27, 1.06, 0.18, 1.00 | 500 ms |
| Standard slow spatial | 0.27, 1.06, 0.18, 1.00 | 750 ms |
| Standard fast effects | 0.31, 0.94, 0.34, 1.00 | 150 ms |
| Standard default effects | 0.34, 0.80, 0.34, 1.00 | 200 ms |
| Standard slow effects | 0.34, 0.88, 0.34, 1.00 | 300 ms |

Observation (ours, not theirs): the spatial/effects rule is legible
directly in the numbers — every *spatial* curve has a y₁ above 1.0
(1.67 / 1.21 / 1.29 / 1.06 = overshoot), while every *effects* curve caps
at 1.00. Standard's three spatial speeds share one curve and differ only
in duration.

## 4. Shape (May 2025 update)

- **35 new shapes** added to the Material Shape Library (Figma kit and
  Jetpack Compose), with **built-in shape morphing**.
- New corner-radii tokens: large increased 20 dp, extra-large increased
  32 dp, extra-extra-large 48 dp. "Fully rounded" redefined as `full`
  (previously 50% of component size).

Principles recorded:
- Shape morph "should respond to user interaction" and should communicate
  **interaction states** (a button selected), **actions in progress** (a
  friend typing, a page loading), and **environmental change** (sound,
  temperature, time of day). Explicitly lists tap, swipe, scroll, release,
  long-press as the interactions to think about.
- **Tension** as a deliberate tool: contrasting round and sharp shapes
  create "more dynamic design"; Material historically over-favored round.
- **"Shape is versatile, not semantic"** — avoid assigning fixed meaning to
  a single shape. Their example: a loading indicator can be wavy, but a
  waveform is not a strict symbol of progress.
- **Use abstract shapes sparingly** — shapes without a clear reason "can add
  more visual clutter than delight."
- Decorative/non-interactive uses (image crops, avatar masking) are where
  shape is most flexible.
- **"Shape can be 2.5D"** — applying motion and shape differently per layer
  creates an illusion of depth.
- Shape is tied to typography: shapes "echo key visual attributes of M3
  typography" (shape roundness paired with Google Sans Flex).

## 5. The seven expressive tactics

1. Use a variety of shapes — combine classic and abstract, mix corner radii
   for tension; break from surrounding shape style to draw attention.
2. Apply rich and nuanced colors — contrast between primary/secondary/
   tertiary roles to prioritize actions.
3. Guide attention with typography — emphasized styles, heavier weights,
   larger sizes; "editorial-like moments."
4. Contain content for emphasis — grouping, ample space, brightest surface
   mapping for the most important content.
5. Add fluid and natural motion — shape morph, surface effects, motion
   springs, custom micro-animations.
6. Leverage component flexibility — shift components by context; adapt to
   foldables and large screens.
7. **Combine tactics to create hero moments** — deliberate breaks from
   uniform design. Guidance: "Stick to one or two hero moments in your
   product; too many moments can be overwhelming or distracting." Test
   questions offered: is this interaction emotionally impactful? is it a
   key interaction?

## 6. Other components/styles noted

Fourteen new or updated components (button groups, FAB menu, loading
indicator, split button, toolbars are flagged *new*). Emphasized type
styles added to the type scale for variable and static fonts.

## Collection note

Public design-system documentation. Google-branded and Android-first;
the wiki's vendor-neutrality rule applies — cite as prior art and adopt
the mechanics, not the identity.
