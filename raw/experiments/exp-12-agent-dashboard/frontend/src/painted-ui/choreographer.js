/**
 * Painted UI — Choreographer v2
 *
 * The deterministic semantic compiler between model intent and client experience.
 * Pure function: (patch, node, scene, mood) -> motionPlan
 *
 * Phase B: now honors the intent envelope from the model.
 * The model says WHY something changed; the choreographer decides HOW it moves.
 * Costs zero tokens. Runs in microseconds. Deterministic. Testable.
 */

const MOOD_SCALE = {
  calm: 1.4,
  neutral: 1.0,
  energetic: 0.5,
  none: 0.01,
};

const STAGGER_MS = {
  calm: 220,
  neutral: 120,
  energetic: 45,
  none: 0,
};

export const MOOD_EASING = {
  calm: 'ease',
  neutral: 'easeInOut',
  energetic: 'bounce',
  none: 'linear',
};

export const MOOD_EFFECTS = {
  calm: { blur: 4 },
  neutral: { blur: 0 },
  energetic: { blur: 0 },
  none: { blur: 0 },
};

/**
 * Tempo multipliers — scene-level pacing control.
 * A "deliberate" tempo slows things down for investigative moments;
 * "brisk" keeps things snappy for overviews.
 */
const TEMPO_SCALE = {
  deliberate: 1.3,
  brisk: 0.8,
};

/**
 * Compile a motion plan from a patch, its intent, and the current scene.
 *
 * This is the canonical choreographer API:
 *   compileBehavior({ patch, node, scene, mood }) -> motionPlan
 *
 * @param {object} options
 * @param {object} options.patch  - the A2UI patch (op, id, kind, props, intent)
 * @param {object} options.node   - existing stage node (null for adds)
 * @param {object} options.scene  - current scene state
 * @param {string} options.mood   - 'calm' | 'neutral' | 'energetic' | 'none'
 * @param {number} options.index  - mount order index (for stagger)
 * @returns {object} motionPlan
 */
export function compileBehavior({ patch, node, scene, mood = 'neutral', index = 0 }) {
  const moodScale = MOOD_SCALE[mood] ?? 1.0;
  const tempoScale = TEMPO_SCALE[scene?.tempo] ?? 1.0;
  const D = (ms) => Math.round(ms * moodScale * tempoScale);
  const stagger = index * (STAGGER_MS[mood] ?? 120);
  const easing = MOOD_EASING[mood] || 'easeInOut';
  const blur = MOOD_EFFECTS[mood]?.blur ?? 0;
  const intent = patch.intent;
  const op = patch.op;

  // --- Intent-driven behavior (model says WHY) ---
  if (intent && intent.action) {
    const importance = intent.importance === 'high' ? 1.15 : 1.0;

    switch (intent.action) {
      case 'focus':
        return {
          verb: 'focus', dur: D(500 * importance), stagger: 0, easing,
          blur: 0, attention: 'focused',
        };

      case 'reveal':
        return {
          verb: 'fadeIn', dur: D(450 * importance), stagger: stagger * 1.5, easing,
          blur, attention: 'normal',
        };

      case 'compare':
        return {
          verb: 'slideIn', dur: D(400), stagger, easing,
          blur: 0, attention: 'supporting',
        };

      case 'expand':
      case 'drillDown':
        return {
          verb: 'expand', dur: D(550 * importance), stagger: 0, easing,
          blur: 0, attention: 'focused',
        };

      case 'collapse':
      case 'return':
        return {
          verb: 'contract', dur: D(500), stagger: 0, easing,
          blur: 0, attention: 'normal',
        };

      case 'filter':
      case 'sort':
        return {
          verb: 'reorder', dur: D(400), stagger: 0, easing,
          blur: 0, attention: 'normal',
        };

      case 'replace':
        return {
          verb: 'crossfade', dur: D(500), stagger: 0, easing,
          blur: 0, attention: 'normal',
        };

      case 'warn':
        return {
          verb: 'pulse', dur: D(600 * importance), stagger: 0, easing: 'bounce',
          blur: 0, attention: 'focused',
        };

      case 'confirm':
      case 'resolve':
        return {
          verb: 'settle', dur: D(450), stagger: 0, easing: 'ease',
          blur: 0, attention: 'normal',
        };

      case 'connect':
        return {
          verb: 'highlight', dur: D(400), stagger: 0, easing,
          blur: 0, attention: 'supporting',
        };
    }
  }

  // --- Default behavior (no intent) — op + kind based ---
  if (op === 'add') {
    const kind = patch.kind;
    switch (kind) {
      case 'metric':
        return { verb: 'scaleIn', dur: D(400), stagger, easing, blur, attention: 'normal' };
      case 'card':
        return { verb: 'fadeIn', dur: D(500), stagger, easing, blur, attention: 'normal' };
      case 'text':
        return { verb: 'fadeIn', dur: D(400), stagger, easing, blur, attention: 'normal' };
      case 'table':
        return { verb: 'slideUp', dur: D(550), stagger, easing, blur, attention: 'normal' };
      case 'chart':
        return { verb: 'scaleIn', dur: D(500), stagger, easing, blur, attention: 'normal' };
      case 'field':
        return { verb: 'slideUp', dur: D(400), stagger, easing, blur, attention: 'normal' };
      case 'actions':
        return { verb: 'fadeIn', dur: D(350), stagger, easing, blur, attention: 'normal' };
      case 'badge':
        return { verb: 'scaleIn', dur: D(300), stagger, easing, blur, attention: 'normal' };
      default:
        return { verb: 'fadeIn', dur: D(450), stagger, easing, blur, attention: 'normal' };
    }
  }

  if (op === 'update') {
    return { verb: 'morphTo', dur: D(600), stagger: 0, easing, blur: 0, attention: 'normal' };
  }

  if (op === 'remove') {
    return { verb: 'dissolveOut', dur: D(350), stagger: 0, easing, blur: blur > 0 ? blur : 0, attention: 'normal' };
  }

  return { verb: 'fadeIn', dur: D(400), stagger: 0, easing, blur: 0, attention: 'normal' };
}

/**
 * Backwards-compatible wrapper. Delegates to compileBehavior.
 */
export function choreograph(op, kind, index = 0, mood = 'neutral', intent = null) {
  return compileBehavior({
    patch: { op, kind, intent },
    node: null,
    scene: null,
    mood,
    index,
  });
}

/**
 * Compute attention policy for existing nodes when a scene changes.
 *
 * @param {string} nodeId   - the node being evaluated
 * @param {object} scene    - current scene state { focus, supporting, mode }
 * @returns {'focused'|'supporting'|'receded'|'normal'}
 */
export function resolveAttention(nodeId, scene) {
  if (!scene || !scene.focus) return 'normal';
  if (scene.focus === nodeId) return 'focused';
  if (scene.supporting?.includes(nodeId)) return 'supporting';
  return 'receded';
}

export const MOODS = Object.keys(MOOD_SCALE);
