/**
 * Painted UI — useAnimated React Hook (v2)
 *
 * Connects an A2UI component to the Animator.
 * Applies CSS transforms each frame based on tween state.
 *
 * Phase B additions:
 * - FLIP relayout: captures positions, animates layout shifts
 * - Attention states: focused / supporting / receded / normal
 * - New verbs: pulse, expand, contract, settle, highlight
 *
 * Performance: subscribes to the animator ONLY while animating.
 * Once settled, unsubscribes and writes final styles once.
 *
 * IMPORTANT: Animated properties (opacity, transform, filter) are managed
 * entirely via direct DOM manipulation — never through React inline styles.
 * This prevents React re-renders from overriding mid-animation values.
 */

import { useRef, useEffect, useLayoutEffect } from 'react';
import { subscribe, alpha, isAnimating } from './animator.js';

// --- Easing functions ---

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function bounce(t) {
  if (t < 0.6) return 2.5 * t * t;
  if (t < 0.8) {
    const p = t - 0.7;
    return 1 + 3 * p;
  }
  const p = t - 0.9;
  return 1 + (1 - t) * 0.3 * Math.sin(p * Math.PI * 4);
}

function getEasing(name) {
  switch (name) {
    case 'bounce': return bounce;
    case 'ease': return easeOut;
    case 'linear': return (t) => t;
    default: return easeInOut;
  }
}

// --- Attention visual targets ---

const ATTENTION_STYLES = {
  focused: { scale: 1.02, opacity: 1.0, blur: 0, brightness: 1.05 },
  supporting: { scale: 1.0, opacity: 0.85, blur: 0, brightness: 1.0 },
  receded: { scale: 0.97, opacity: 0.45, blur: 1.5, brightness: 0.9 },
  normal: { scale: 1.0, opacity: 1.0, blur: 0, brightness: 1.0 },
};

// React-managed style — only non-animated properties.
// Animated props (opacity, transform, filter) are set via direct DOM only.
const STATIC_STYLE = {
  willChange: 'transform, opacity, filter',
};

/**
 * Hook that animates a DOM element based on its stage node state.
 */
export function useAnimated(node) {
  const ref = useRef(null);
  const prevRect = useRef(null);
  const unsubRef = useRef(null);
  const lastVersion = useRef(0);

  // --- Set initial opacity BEFORE first paint (useLayoutEffect = before browser paint) ---
  // This runs synchronously after DOM mutation, before the browser paints.
  // React never touches opacity/transform/filter — the animator owns them.
  useLayoutEffect(() => {
    if (ref.current && node) {
      ref.current.style.opacity = '0';
    }
  }, []); // mount only

  // --- FLIP: only measure when the node actually changed ---
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !node) return;

    const version = node._version || 0;
    if (version === lastVersion.current && prevRect.current) {
      return;
    }
    lastVersion.current = version;

    const curr = el.getBoundingClientRect();

    if (prevRect.current) {
      const dx = prevRect.current.left - curr.left;
      const dy = prevRect.current.top - curr.top;

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        node._flip = { dx, dy, t0: performance.now(), dur: 400 };
        ensureSubscribed();
      }
    }

    prevRect.current = curr;
  });

  function ensureSubscribed() {
    if (unsubRef.current) return;
    unsubRef.current = subscribe(animationTick);
  }

  function animationTick() {
    const el = ref.current;
    if (!el || !node) return;

    const now = performance.now();
    const a = alpha(node);
    const verb = node._verb || 'fadeIn';
    const easingFn = getEasing(node._easing || 'easeInOut');
    const blurAmount = node._blur || 0;
    const enterProgress = getEnterProgress(node, easingFn);

    let transform = '';
    let opacity = a;
    let filter = '';

    // --- FLIP animation (position continuity) ---
    if (node._flip) {
      const elapsed = now - node._flip.t0;
      const t = Math.min(1, elapsed / node._flip.dur);
      const eased = easeInOut(t);
      const flipX = node._flip.dx * (1 - eased);
      const flipY = node._flip.dy * (1 - eased);
      transform = `translate(${flipX}px, ${flipY}px)`;
      if (t >= 1) node._flip = null;
    }

    // --- Exit animation ---
    if (node._exit) {
      const exitProgress = 1 - a;
      transform += ` translateY(${exitProgress * -8}px) scale(${1 - exitProgress * 0.03})`;
      opacity = a;
      if (blurAmount > 0) {
        filter = `blur(${exitProgress * blurAmount}px)`;
      }

    // --- Enter animation ---
    } else if (enterProgress < 1) {
      const inv = 1 - enterProgress;
      switch (verb) {
        case 'fadeIn':
          transform += ` translateY(${inv * 16}px)`;
          break;
        case 'scaleIn':
          transform += ` scale(${0.88 + 0.12 * enterProgress})`;
          break;
        case 'slideUp':
          transform += ` translateY(${inv * 24}px)`;
          break;
        case 'slideIn':
          transform += ` translateX(${inv * 30}px)`;
          break;
        case 'expand':
          transform += ` scale(${0.7 + 0.3 * enterProgress}) translateY(${inv * -10}px)`;
          break;
        case 'contract':
          transform += ` scale(${1 + 0.1 * inv})`;
          break;
        default:
          transform += ` translateY(${inv * 16}px)`;
      }
      if (blurAmount > 0) {
        filter = `blur(${inv * blurAmount}px)`;
      }

    // --- Pulse animation (warn intent) ---
    } else if (node._pulse) {
      const elapsed = now - node._pulse.t0;
      const t = Math.min(1, elapsed / node._pulse.dur);
      if (t < 1) {
        const pulseT = t < 0.4 ? t / 0.4 : 1 - (t - 0.4) / 0.6;
        const pulseScale = 1 + 0.03 * easeOut(pulseT);
        transform += ` scale(${pulseScale})`;
      } else {
        node._pulse = null;
      }
    }

    // --- Attention state (scene-driven focus/recede) ---
    const attention = node._attention || 'normal';
    const hasActiveAttention = attention !== 'normal' && !node._exit && enterProgress >= 1;
    let attentionSettled = true;

    if (hasActiveAttention) {
      const target = ATTENTION_STYLES[attention];
      let attentionProgress = 1;

      if (node._attentionT0) {
        const elapsed = now - node._attentionT0;
        const dur = node._attentionDur || 350;
        attentionProgress = Math.min(1, elapsed / dur);
        attentionProgress = easeInOut(attentionProgress);
        if (attentionProgress < 1) attentionSettled = false;
      }

      const normalStyle = ATTENTION_STYLES.normal;
      const scale = normalStyle.scale + (target.scale - normalStyle.scale) * attentionProgress;
      const attOpacity = normalStyle.opacity + (target.opacity - normalStyle.opacity) * attentionProgress;
      const attBlur = normalStyle.blur + (target.blur - normalStyle.blur) * attentionProgress;
      const brightness = normalStyle.brightness + (target.brightness - normalStyle.brightness) * attentionProgress;

      transform += ` scale(${scale})`;
      opacity *= attOpacity;
      if (attBlur > 0) {
        filter = filter ? `${filter} blur(${attBlur}px)` : `blur(${attBlur}px)`;
      }
      if (brightness !== 1.0) {
        filter = filter ? `${filter} brightness(${brightness})` : `brightness(${brightness})`;
      }
    }

    // Write directly to DOM — React never touches these properties
    el.style.opacity = String(opacity);
    el.style.transform = transform.trim();
    el.style.filter = filter;

    // --- Settle: unsubscribe when all animations are done ---
    const stillAnimating = isAnimating(node) || a < 1 || node._flip || node._pulse
        || (hasActiveAttention && !attentionSettled);

    if (!stillAnimating) {
      // Write explicit final resting values
      if (hasActiveAttention) {
        const target = ATTENTION_STYLES[attention];
        el.style.opacity = String(target.opacity);
        el.style.transform = target.scale !== 1 ? `scale(${target.scale})` : '';
        const filters = [];
        if (target.blur > 0) filters.push(`blur(${target.blur}px)`);
        if (target.brightness !== 1.0) filters.push(`brightness(${target.brightness})`);
        el.style.filter = filters.join(' ');
      } else {
        el.style.opacity = '1';
        el.style.transform = '';
        el.style.filter = '';
      }

      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
      prevRect.current = el.getBoundingClientRect();
    }
  }

  // --- Start animating when node appears or changes ---
  useEffect(() => {
    if (!node || !ref.current) return;
    ensureSubscribed();
    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
  }, [node]);

  // Return ONLY non-animated styles. Opacity/transform/filter are
  // managed via direct DOM so React re-renders can't interfere.
  return { ref, style: STATIC_STYLE };
}

function getEnterProgress(node, easingFn) {
  if (!node._enter) return 1;
  const elapsed = performance.now() - node._enter.t0;
  if (elapsed < 0) return 0;
  const t = Math.min(1, elapsed / node._enter.dur);
  return easingFn(t);
}

export default useAnimated;
