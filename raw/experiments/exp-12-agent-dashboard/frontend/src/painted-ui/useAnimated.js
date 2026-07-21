/**
 * Painted UI — useAnimated React Hook
 *
 * Connects an A2UI component to the Animator.
 * Applies CSS transforms each frame based on tween state.
 * Supports mood-driven easing (bounce, blur, ease).
 */

import { useRef, useEffect, useState } from 'react';
import { subscribe, alpha, isAnimating } from './animator.js';

// Easing functions
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function bounce(t) {
  // Overshoot then settle
  if (t < 0.6) {
    return 2.5 * t * t;
  }
  if (t < 0.8) {
    const p = t - 0.7;
    return 1 + 3 * p; // overshoot to ~1.09
  }
  // settle back
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

/**
 * Hook that animates a DOM element based on its stage node state.
 *
 * @param {object} node - Stage node with _enter, _exit, _verb, _tw
 * @param {{ thinking?: boolean }} options
 * @returns {{ ref: React.RefObject, style: object }}
 */
export function useAnimated(node, options = {}) {
  const ref = useRef(null);
  const [, forceRender] = useState(0);

  useEffect(() => {
    if (!node || !ref.current) return;

    const unsubscribe = subscribe(() => {
      const el = ref.current;
      if (!el) return;

      const a = alpha(node);
      const verb = node._verb || 'fadeIn';
      const easingFn = getEasing(node._easing || 'easeInOut');
      const blurAmount = node._blur || 0;
      const enterProgress = getEnterProgress(node, easingFn);

      let transform = '';
      let opacity = a;
      let filter = '';

      if (node._exit) {
        // Exit animation
        const exitProgress = 1 - a;
        transform = `translateY(${exitProgress * -8}px) scale(${1 - exitProgress * 0.03})`;
        opacity = a;
        if (blurAmount > 0) {
          filter = `blur(${exitProgress * blurAmount}px)`;
        }
      } else if (enterProgress < 1) {
        // Enter animation
        const inv = 1 - enterProgress;
        switch (verb) {
          case 'fadeIn':
            transform = `translateY(${inv * 16}px)`;
            break;
          case 'scaleIn':
            transform = `scale(${0.88 + 0.12 * enterProgress})`;
            break;
          case 'slideUp':
            transform = `translateY(${inv * 24}px)`;
            break;
          case 'slideIn':
            transform = `translateX(${inv * 30}px)`;
            break;
          default:
            transform = `translateY(${inv * 16}px)`;
        }
        // Blur on enter (calm mood)
        if (blurAmount > 0) {
          filter = `blur(${inv * blurAmount}px)`;
        }
      }

      el.style.opacity = opacity;
      el.style.transform = transform;
      el.style.filter = filter;

      // Clean up when animations are done
      if (!isAnimating(node) && a === 1) {
        el.style.opacity = '';
        el.style.transform = '';
        el.style.filter = '';
      }
    });

    return unsubscribe;
  }, [node]);

  const initialStyle = node ? getInitialStyle(node) : {};

  return { ref, style: initialStyle };
}

function getEnterProgress(node, easingFn) {
  if (!node._enter) return 1;
  const elapsed = performance.now() - node._enter.t0;
  if (elapsed < 0) return 0;
  const t = Math.min(1, elapsed / node._enter.dur);
  return easingFn(t);
}

function getInitialStyle(node) {
  return {
    opacity: 0,
    willChange: 'transform, opacity, filter',
    transition: 'none',
  };
}

export default useAnimated;
