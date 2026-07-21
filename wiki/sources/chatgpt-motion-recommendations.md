# Source: motion-architecture recommendations (ChatGPT review)

**Citation:** upgrade recommendations produced by ChatGPT at Neal's
request, July 2026. Raw (verbatim):
`raw/articles/chatgpt-motion-recommendations.md`
**Ingested:** 2026-07-20 (source #7)

## The thesis of the document (and it's right)

"The next breakthrough is not making the UI move more. It is making the
UI appear to **understand why it is moving**." Animation library = 25
effects; choreography system = the same semantic event always produces an
understandable visual consequence. This is the strongest articulation yet
of where the [[concepts/choreographer]] goes next.

## Verdict: adopt most of it, with three amendments

### Adopted — new to the wiki

1. **Intent verbs** (focus, compare, drillDown, return, filter, sort,
   replace, warn, resolve, group…) — a richer, better-organized version of
   scene-grammar-v2's Layer D macros. The event table (filter → "excluded
   objects leave toward the nearest boundary; survivors close ranks") is
   design gold. → merged into [[techniques/scene-grammar-v2]].
2. **Composable primitives under the verbs** (~12: fade/reveal/scale/
   slide/draw · morph/relayout/crossfade/sharedElement · emphasize/recede/
   pulse · expand/collapse/group/disperse), with semantic verbs as
   *compositions* — this usefully reframes exp-10: strokeIn/materialize
   are members of the primitive layer ("draw" family); intent verbs sit
   above them. Scales without 40 bespoke animations.
3. **Attention orchestration** — scene-level `focalIds / supportingIds /
   backgroundIds / attentionMode`, translated by the choreographer into
   scale/contrast/opacity/blur/depth/position. Genuinely new concept for
   the wiki; "a polished system doesn't make everything move; it makes the
   right thing become unavoidable."
4. **Hierarchy choreography** — parent-first/child-first entrances,
   sibling displacement, shared-container transitions, coordinated exits.
   Extends Layer C containers from *layout* grouping to *motion* grouping.
5. **The semantic envelope** — optional `intent:{action, importance,
   cause, relationship}` on patches; scene-level `intent:{mode, focus,
   tempo, continuity}`. Exactly our doctrine ("the model communicates
   meaning; the local policy decides expression") made concrete.
6. **Velocity-continuous interruption** — cancel/retarget/merge/supersede
   with position AND velocity continuity. Elevates our open question to a
   flagship experiment: **"Interrupt the Choreographer"** (named exp-12) —
   the demo video generation *cannot* do interactively.
7. **The restraint doctrine** — the "what not to do" list (no endless
   floating, no random rotation, stillness as a feature; motion happens
   because the system is explaining change). Answers the kitsch-line open
   question in [[concepts/experience-frontier]].
8. **The flagship demo shape** — metric → focal position → siblings
   recede → table transforms → row expands → connections drawn →
   recommendations reveal → breadcrumb → smooth return. Nine capabilities
   in one narrative sequence. (See amendment 3 on domain.)

### Amendments

1. **"Motion grammars, not themes" → motion grammars AND themes.** The
   document treats them as rivals; they're orthogonal axes. *Grammars*
   (analytical/editorial/organic/urgent) govern BEHAVIOR — tempo, easing
   family, stagger, attention strength. *Themes* (ink/watercolor/
   blueprint/storybook, from the audit follow-up) govern APPEARANCE — how
   a stroke or fill is rendered. A financial console might be
   analytical+blueprint; a story app editorial+storybook. Both ship as
   swappable policy objects; keep both names.
2. **Effects are not step 7 for a research project.** The document demotes
   masks/depth/line-drawing to last; but strokeIn is what moved the
   audit's visual score 6.5 → 8.0 — expressive verbs were *evidence*, not
   decoration. The ordering is right for the SDK/product track; for the
   research track, expressiveness and semantics advance together.
3. **⚠️ Re-skin the flagship domain.** "Workforce Advisor" (attrition,
   headcount, manager scores) sits inside Neal's employer's industry.
   Per the vendor-neutral/no-employer guardrail, the identical
   choreography runs on a neutral domain — e.g., a harbor-operations
   console (ship arrivals, berth utilization, weather warnings — on-brand
   with the lighthouse) or generic retail metrics. The sequence is
   domain-agnostic; the domain choice is reputational hygiene.

## Adopted roadmap order (product track)

1. Scene-level relayout + shared-element morphs → 2. focus/recede
attention policy → 3. parent-child group choreography → 4. intent verbs
(compare/drillDown/filter/resolve) → 5. interruption-safe retargeting
(exp-12 "Interrupt the Choreographer") → 6. motion grammars → 7. richer
effects (already partially ahead via exp-10). Flagship narrative demo:
exp-13, neutral domain.

## Wiki pages touched

[[techniques/scene-grammar-v2]] · [[concepts/choreographer]] ·
[[concepts/experience-frontier]] · [[techniques/transition-choreography]]
