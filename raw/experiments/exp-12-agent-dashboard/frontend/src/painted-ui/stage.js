/**
 * Painted UI — Stage
 *
 * The shared state. A Map of id -> node.
 * Directors and Choreographers WRITE it. The Animator READS it.
 * They never talk directly.
 */

import { tween } from './animator.js';
import { choreograph } from './choreographer.js';

// The node map
const nodes = new Map();

// Mount order counter for stagger calculation
let mountIndex = 0;

// Event listeners
const listeners = new Set();

function notify(event, id, node) {
  for (const fn of listeners) fn(event, id, node);
}

/** Subscribe to stage events: ('add'|'update'|'remove', id, node) */
export function onStageChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Get a node by ID */
export function getNode(id) {
  return nodes.get(id);
}

/** Get all nodes as an array, sorted by mount order */
export function getAllNodes() {
  return [...nodes.values()].sort((a, b) => (a._order ?? 0) - (b._order ?? 0));
}

/** Check if a node exists */
export function hasNode(id) {
  return nodes.has(id);
}

/** Reset the stage */
export function clearStage() {
  nodes.clear();
  mountIndex = 0;
}

/**
 * Apply a patch to the stage.
 *
 * @param {object} patch - { op, id, kind, props }
 * @param {string} mood  - current choreography mood
 */
export function applyPatch(patch, mood = 'neutral') {
  const { op, id, kind, props } = patch;

  if (op === 'add') {
    const existing = nodes.get(id);
    if (existing) {
      // Update existing node instead of replacing
      return applyPatch({ op: 'update', id, props }, mood);
    }

    const motion = choreograph('add', kind, mountIndex, mood);
    const node = {
      id,
      kind,
      ...props,
      _order: mountIndex++,
      _enter: {
        t0: performance.now() + motion.stagger,
        dur: motion.dur,
      },
      _verb: motion.verb,
      _easing: motion.easing,
      _blur: motion.blur || 0,
      _tw: {},
    };

    nodes.set(id, node);
    notify('add', id, node);

  } else if (op === 'update') {
    const node = nodes.get(id);
    if (!node) return;

    const motion = choreograph('update', node.kind, 0, mood);

    for (const [key, val] of Object.entries(props || {})) {
      if (typeof val === 'number' && typeof node[key] === 'number') {
        tween(node, key, val, motion.dur);
      } else {
        node[key] = val;
      }
    }

    notify('update', id, node);

  } else if (op === 'remove') {
    const node = nodes.get(id);
    if (!node) return;

    const motion = choreograph('remove', node.kind, 0, mood);
    node._exit = { t0: performance.now(), dur: motion.dur };

    notify('remove', id, node);

    // Clean up after exit animation completes
    setTimeout(() => {
      nodes.delete(id);
    }, motion.dur + 50);

  } else if (op === 'clear') {
    // Remove all nodes with exit animations
    for (const [id, node] of nodes) {
      const motion = choreograph('remove', node.kind, 0, mood);
      node._exit = { t0: performance.now(), dur: motion.dur };
      notify('remove', id, node);
    }
    setTimeout(() => {
      nodes.clear();
      mountIndex = 0;
    }, 400);
  }
}

/**
 * Apply a batch of patches (e.g., from a streamed A2UI response).
 */
export function applyPatches(patches, mood = 'neutral') {
  for (const patch of patches) {
    applyPatch(patch, mood);
  }
}
