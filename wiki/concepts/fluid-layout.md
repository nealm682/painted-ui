# Fluid layout

The property [[entities/flipbook]] advertises as "illustrations reshape to fit
the window" ([[sources/flipbook-thread]]) — one of the four ingredients of
[[concepts/the-illusion]].

## What makes it feel magical

Web UIs *have* responsive layout, but it's authored: breakpoints, media
queries, discrete jumps. Flipbook's version feels different because the
content itself **continuously reshapes** — an illustration redraws to fill
whatever space exists, as if the painter noticed the new canvas size.

## Reproducing it without pixel generation

- **Constraint/anchor/percentage layout** over a scene graph: the model emits
  positions as relationships ("caption anchored below hero, hero fills 60% of
  height"), not pixels. The compositor solves constraints per-frame on resize.
- **Resolution-independent primitives**: vector shapes, SDF text, gradients,
  and procedural textures scale losslessly. Raster assets need 9-slice,
  seam-carving, or outpainted margins to reshape gracefully.
- **Animate the resolve.** The tell for "authored responsive" is an instant
  snap. Interpolating layout changes over 200–400ms (springs, not linear)
  reads as *redrawing*, not *reflowing* — see
  [[concepts/client-side-compositing]].

Demonstrated in the first prototype: continuous reflow + spring-animated
resolve, from a static scene graph
([[sources/experiment-01-canvas-compositor]]).

## Open questions

- Can an LLM reliably emit constraint systems that stay solvable across
  extreme aspect ratios?
- Where does raster-asset reshaping break the illusion first?
