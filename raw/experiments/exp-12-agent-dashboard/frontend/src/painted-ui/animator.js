/**
 * Painted UI — Animator
 *
 * The frame-rate loop. Runs at 60fps via requestAnimationFrame.
 * Samples tween state from the Stage and calls registered update callbacks.
 * Never waits. Never decides. Just animates.
 */

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/** Sample a tweened value at the current moment */
export function cur(node, key) {
  const tw = node._tw?.[key];
  if (!tw) return node[key] !== undefined ? node[key] : 0;
  const elapsed = performance.now() - tw.t0;
  const t = Math.min(1, elapsed / tw.dur);
  const val = tw.from + (tw.to - tw.from) * easeInOut(t);
  if (t >= 1) {
    node[key] = tw.to;
    delete node._tw[key];
    return tw.to;
  }
  return val;
}

/** Compute enter/exit alpha for a node */
export function alpha(node) {
  const now = performance.now();
  if (node._exit) {
    const t = Math.min(1, (now - node._exit.t0) / node._exit.dur);
    return 1 - easeInOut(t);
  }
  if (node._enter) {
    const t = Math.min(1, (now - node._enter.t0) / node._enter.dur);
    return easeInOut(t);
  }
  return 1;
}

/** Start a tween on a node property */
export function tween(node, key, to, dur, delay = 0) {
  if (!node._tw) node._tw = {};
  node._tw[key] = {
    from: cur(node, key),
    to,
    t0: performance.now() + delay,
    dur,
  };
}

/** Check if a node has any active tweens */
export function isAnimating(node) {
  if (node._enter) {
    const t = (performance.now() - node._enter.t0) / node._enter.dur;
    if (t < 1) return true;
  }
  if (node._exit) return true;
  if (node._tw && Object.keys(node._tw).length > 0) return true;
  return false;
}

// --- Animator loop ---
const listeners = new Set();
let running = false;
let frameCount = 0;

function tick() {
  frameCount++;
  for (const fn of listeners) fn(frameCount);
  if (listeners.size > 0) {
    requestAnimationFrame(tick);
  } else {
    running = false;
  }
}

/** Subscribe to the animation loop. Returns unsubscribe function. */
export function subscribe(fn) {
  listeners.add(fn);
  if (!running) {
    running = true;
    requestAnimationFrame(tick);
  }
  return () => {
    listeners.delete(fn);
  };
}

export function getFrameCount() {
  return frameCount;
}
