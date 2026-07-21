/**
 * Painted UI — Choreographer
 *
 * Pure function: (patch, node, mood) -> motionPlan
 * Decides HOW each change moves. Costs zero tokens.
 * Runs in microseconds. Deterministic. Testable.
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

/**
 * Easing profiles per mood.
 * Used by useAnimated to pick the right curve.
 */
export const MOOD_EASING = {
  calm: 'ease',          // smooth, gentle
  neutral: 'easeInOut',  // standard
  energetic: 'bounce',   // overshoot + settle
  none: 'linear',
};

/**
 * Extra style effects per mood (applied by useAnimated).
 */
export const MOOD_EFFECTS = {
  calm: { blur: 4 },       // enter with slight blur that clears
  neutral: { blur: 0 },
  energetic: { blur: 0 },
  none: { blur: 0 },
};

/**
 * Choreograph a single patch into a motion plan.
 *
 * @param {string} op        - 'add' | 'update' | 'remove'
 * @param {string} kind      - A2UI component kind: 'card', 'metric', 'table', etc.
 * @param {number} index     - Mount order index (for stagger)
 * @param {string} mood      - 'calm' | 'neutral' | 'energetic' | 'none'
 * @returns {{ verb: string, dur: number, stagger: number, easing: string, blur: number }}
 */
export function choreograph(op, kind, index = 0, mood = 'neutral') {
  const scale = MOOD_SCALE[mood] ?? 1.0;
  const D = (ms) => Math.round(ms * scale);
  const stagger = index * (STAGGER_MS[mood] ?? 120);
  const easing = MOOD_EASING[mood] || 'easeInOut';
  const blur = MOOD_EFFECTS[mood]?.blur ?? 0;

  if (op === 'add') {
    switch (kind) {
      case 'metric':
        return { verb: 'scaleIn', dur: D(400), stagger, easing, blur };
      case 'card':
        return { verb: 'fadeIn', dur: D(500), stagger, easing, blur };
      case 'text':
        return { verb: 'fadeIn', dur: D(400), stagger, easing, blur };
      case 'table':
        return { verb: 'slideUp', dur: D(550), stagger, easing, blur };
      case 'chart':
        return { verb: 'scaleIn', dur: D(500), stagger, easing, blur };
      case 'field':
        return { verb: 'slideUp', dur: D(400), stagger, easing, blur };
      case 'actions':
        return { verb: 'fadeIn', dur: D(350), stagger, easing, blur };
      case 'badge':
        return { verb: 'scaleIn', dur: D(300), stagger, easing, blur };
      default:
        return { verb: 'fadeIn', dur: D(450), stagger, easing, blur };
    }
  }

  if (op === 'update') {
    return { verb: 'morphTo', dur: D(600), stagger: 0, easing, blur: 0 };
  }

  if (op === 'remove') {
    return { verb: 'dissolveOut', dur: D(350), stagger: 0, easing, blur: blur > 0 ? blur : 0 };
  }

  return { verb: 'fadeIn', dur: D(400), stagger: 0, easing, blur: 0 };
}

export const MOODS = Object.keys(MOOD_SCALE);
