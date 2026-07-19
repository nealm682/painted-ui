# The experience frontier — beyond 60fps

Filed from a query (2026-07-19): can we hit 80fps, or modify the experience
in ways not yet considered?

## Frame rate is the wrong lever (and we already win it)

`requestAnimationFrame` locks to the display: 60Hz monitors get 60fps, a
120/144Hz laptop gets 120/144 *automatically* — our Canvas redraws cost so
little that the compositor never drops frames. So "80fps" is already
exceeded on high-refresh hardware, free. Meanwhile the video path is capped
at its generation rate (Flipbook: 24fps, [[sources/flipbook-thread]]) no
matter the display. Frame rate is a solved dimension; the levers that would
actually change the experience are below.

## Five levers, roughly by impact

1. **Painterly shaders (WebGL/WebGPU compositor).** The current Canvas2D
   verbs read as elegant-web-motion. Shaders unlock what reads as *paint*:
   brush-stroke reveals (strokes literally draw in), watercolor bleed on
   dissolves (pigment diffusion, not opacity fade), paper grain, metaball
   morphs, 100k-particle fields. This is the single biggest fidelity jump
   available to [[concepts/client-side-compositing]] — it attacks the last
   visible difference between our transitions and video-generated ones.
2. **Speculative pre-painting.** See [[concepts/swarm-painting]] §3 —
   perceived-zero-latency interaction changes the *feel* category: from
   "fast tool" to "it knew." Likely the largest experiential delta per
   engineering hour.
3. **The infinite canvas.** Add one op — `camera` — and scenes stop being
   pages: the scene graph becomes a world, transitions become camera moves
   (pan/zoom/dolly), and agents paint regions *ahead of the camera*.
   Navigation becomes cinematography; "where am I in the app" becomes
   spatial memory. (Composes perfectly with swarm regional ownership.)
4. **Cross-modal choreography.** Patches drive Web Audio too: each verb
   gets a sound signature (soft bristle for dissolve, low swell for morphs),
   mood scales a generative ambient bed. Motion + sound is disproportionate:
   the illusion stops being visual and becomes atmospheric.
5. **The user inside the painting.** Cursor as brush: hover leaves a brief
   pigment shimmer, clicks ripple (exp-01 already does this), drag smears
   ambient particles. Input echoing in the medium collapses the
   viewer/painting boundary — ingredient 3 of [[concepts/the-illusion]]
   taken to its limit.

Also cheap and strange: adaptive tempo (choreographer reads cursor energy →
mood, [[concepts/choreographer]]); time-of-day palette drift; data that
visibly ages (staleness as desaturation).

## Suggested experiment order

exp-04 cached raster assets → exp-05 on-device SLM+grammar → **exp-06
WebGL painterly verbs** (lever 1) → exp-07 speculative pre-paint + minimal
swarm (levers 2, swarm §1–3). Camera/world and audio after the painterly
jump proves out.

## Open questions

Where's the kitsch line — when do painterly shaders become a theme park?
Does speculative pre-paint waste tokens at scale (mitigation: only
pre-paint the top-1 predicted action)? Can Canvas2D fake 80% of lever 1
with layered gradients + noise sprites before we pay the WebGL complexity
tax?
