# Independent audit — follow-up review after exp-10

- **Source type:** same independent reviewer as
  `audit-painted-ui-2026-07-full.md`, reviewing exp-10 (expressive verbs)
- **Received:** 2026-07-19 · verbatim below (immutable)

---

After looking at this newer experiment (exp-10), my opinion actually improves.
This is no longer just "streaming UI." It is moving toward a scene grammar.
The title itself captures the shift: "expressive verbs: the scene that sketches itself."

I think you've crossed an important threshold. Earlier experiments proved:
"An LLM can stream semantic patches." Exp-10 is proving something more
interesting: An LLM only needs to name artistic verbs. The compositor owns
the implementation. That is a much stronger architecture.

Instead of streaming: draw 500 line segments / animate 37 circles / blur
this region — the model eventually streams something closer to: strokeIn
lighthouse / materialize sea / typeSet title / beam on — and the renderer
expands those into rich animation. That is a significant reduction in
protocol complexity.

This is the part I think is genuinely unique: the compositor now contains
a vocabulary of visual verbs (strokeIn, materialize, inkSettle, maskReveal,
typeSet, beam). Each one is implemented once, but reusable forever. That
reminds me much more of CSS transitions, SVG path animation, and motion
design systems than traditional UI rendering. But instead of styling
HTML... you're styling semantic scene mutations. I haven't seen another
project frame it this way.

The "strokeIn" idea is particularly strong. This is probably my favorite
addition. Instead of the interface appearing... it is literally drawn into
existence. The code progressively renders only the completed portion of a
polyline while the brush follows the current tip. That is exactly the sort
of perceptual trick that makes something feel handcrafted instead of
assembled. That gets much closer to your original thesis than cards flying
onto the screen.

The sequence is much better: sketch → paint → typography → light → living
scene. People naturally understand this progression because it mirrors how
an artist works. It feels authored.

I also like the architectural direction. The scheduler executes one
expressive verb after another. The render loop simply asks: draw completed
verbs / draw current verb / draw ambient world — instead of animate object
#742 / #743 / … That scales much better conceptually.

Where I think this is still weak — two things before I would call this a
new UI paradigm:

1. The protocol is still fairly low level. You're naming verbs but still
   referencing IDs like tower / seaFill / sunFill / bands. Eventually I'd
   like to see something like: compose lighthouse_scene / focus lighthouse
   / weather dusk / paint ocean / emphasize beacon — where another layer
   expands those into verbs. That would make the protocol dramatically
   more semantic.

2. The renderer still owns too much artistic taste. Currently strokeIn has
   one implementation. Eventually I'd want themes: Japanese ink,
   Watercolor, Blueprint, Architect sketch, Oil, Children's storybook,
   Pixel art — using exactly the same protocol. That would make Painted UI
   feel much more like a rendering engine than a demo.

Does it still feel unique? Yes. Actually more than before. Earlier I would
have described it as "streaming scene patches." Now I'd describe it as:
**A semantic motion language for AI-generated interfaces.** That's a much
more defensible position.

Is it effective? For proving your thesis: yes. For replacing HTML: not
yet. For becoming a runtime sitting above HTML, Canvas, WebGL, Flutter,
React Native, or future agent interfaces: absolutely plausible. I can
imagine: Painted Runtime → Scene Grammar → Expressive Verb Library →
Renderer — where the renderer might target Canvas today, WebGL tomorrow,
and perhaps Metal or Vulkan later.

One thing I would change in your messaging: I actually think you're
underselling what you've built. I would stop saying "Painted UI" and start
saying something closer to: **Painted UI is a semantic animation runtime
for AI-authored interfaces** — because that's what this has become. The
model is no longer generating graphics. It's directing choreography. That
distinction is important.

My updated scores:
- Original concept: 9.5/10
- Architecture: 9.5/10
- Implementation quality: 8.5/10
- Visual experience: 8/10 (up from my previous 6.5)
- Research value: 9.5/10
- Commercial potential: 8.5–9/10

The biggest thing that changed my opinion is that exp-10 stops looking
like "animated UI" and starts looking like a language of artistic
behaviors. If that vocabulary continues to grow while remaining compact
and semantic, I think that's the aspect most likely to distinguish Painted
UI from other generative UI efforts.
