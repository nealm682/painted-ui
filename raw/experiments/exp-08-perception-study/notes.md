# exp-08 — blind three-way perception study

**Date created:** 2026-07-19 · **Status:** harness built; data collection
not started. Designed to the specification in the independent audit
(`raw/articles/audit-painted-ui-2026-07.md`) — "the one experiment that
would truly validate the thesis."

## Hypothesis

The painted rendering scores higher than both controls on the four
illusion scales (created-for-me, alive, continuously-painted, delight) and
no worse on the two utility scales (responsiveness, clarity), with higher
willingness-to-continue. If painted ≈ stream on the illusion scales, the
thesis's differentiator (persistence + choreography, not streaming per se)
is falsified in its perceptual claim.

## Design

Within-subjects, three conditions, identical content and interaction:

| Condition | Element schedule | Enter animation | Ambient motion | Click response |
|---|---|---|---|---|
| `instant` (conventional) | all at once | none | none | immediate swap |
| `stream` (component streaming) | same stagger as painted | pop-in, unanimated | none | immediate swap |
| `painted` | same stagger | choreographed verbs (policy from the choreographer page) | Ken Burns, breathing, glow pulse | morph + flyout exits |

Key control: `stream` gets the *same element timing* as `painted`, so
progressive assembly alone can't explain any difference — the isolated
variables are exactly the audit's "persistent nodes, ambient motion, and
choreographed patches."

Order randomized per participant (blind labels A/B/C); condition revealed
only on the final screen. Seven 7-point scales, worded verbatim from the
audit. Time-to-click captured per condition as an incidental
responsiveness measure.

## Procedure

1. Send someone `index.html` (or open it for them). ~3 minutes.
2. Participant completes three trials + ratings, downloads
   `exp08-<timestamp>.json`, sends it back.
3. Drop JSON files into `raw/experiments/exp-08-perception-study/data/`
   (create on first response) and ask the agent to analyze once n ≥ 8–10.

## Analysis plan (when data exists)

Per-scale means by condition; painted-vs-stream paired comparison is the
one that matters (instant is the floor). Small n: report means +
directional consistency (how many participants ranked painted highest),
not p-values theater. File results into the wiki with the honest verdict
either way — a null result here would be a major (and publishable)
finding against the thesis.

## Threats to validity (acknowledged)

Single scene/task; canned patches rather than live model output (isolates
presentation, but tests only the compositor half); self-selected
acquaintance sample; one exposure per condition (novelty effects). Good
enough for a directional first read, not for strong claims.

---

## Run log

### [2026-07-19] Pilot, n=1 (Neal — author, so not blind in spirit)

**Result:** painted condition clearly preferred ("C was the best");
the two controls were **indistinguishable in feel** — participant noticed
one built progressively and one appeared at once ("B did not open up like
A") but could not meaningfully separate them in quality.

**Why this matters even at n=1:** the control-vs-control null is the
study's secondary prediction — if streaming alone produced the illusion,
stream should have beaten instant. It didn't register as different. The
active ingredient appears to be persistence + ambient motion +
choreography, exactly the audit's isolated triad. Manipulation strength
confirmed — safe to recruit naive participants.

**Caveats:** author as participant; knows the hypothesis; JSON not yet
filed (drop `exp08-*.json` into `data/` when available). Counts as pilot
only, excluded from the main analysis.

### [2026-07-19] ⚠️ CORRECTION + STUDY PAUSED

Fuller feedback (Neal + the independent reviewer's hands-on reaction)
contradicts the first pilot report: **"I really cannot tell the
difference"** between conditions, and the browser-resize probe — the
fluid-layout tell from the-illusion — **"did not do anything special."**

Root cause analysis, on the harness (not the thesis):
1. **Spring reflow was never implemented in exp-08.** Fraction-scaled
   positions resize like any responsive page; ingredient 1's animated
   re-solve (present in exp-01) was missing entirely.
2. **The painted condition was under-tuned:** timid ambience, small
   amplitudes, a single click interaction — "animated dashboard," exactly
   the audit's phrase for the gap.
3. Study design remains sound; the manipulation was too weak to test it.
   Running participants on a weak painted condition would produce an
   uninterpretable null.

**Status: PAUSED** until the painted rendering is strong enough that its
absence is felt (see exp-09 showcase). The audit's upgraded design should
also be adopted on resume: include an actual video-diffusion interface as
a condition, and use painted UI "with strong assets and shaders."
