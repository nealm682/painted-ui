/**
 * Painted UI — Stage
 *
 * The shared state. A Map of id -> node.
 * Directors and Choreographers WRITE it. The Animator READS it.
 * They never talk directly.
 *
 * Phase B: now handles scene patches, intent envelopes,
 * and attention policy.
 */

import { tween } from './animator.js';
import { compileBehavior, resolveAttention } from './choreographer.js';

// The node map
const nodes = new Map();

// Mount order counter for stagger calculation
let mountIndex = 0;

// Version counter — bumps on every stage mutation so useAnimated
// can distinguish real changes from unrelated React re-renders
let stageVersion = 0;

// Scene state — drives attention policy
let currentScene = {
  mode: 'overview',       // overview | investigate | act
  focus: null,            // id of the focused component
  supporting: [],         // ids of supporting components
  tempo: 'brisk',         // deliberate | brisk
  continuity: 'preserve', // preserve | reset
};

// Event listeners
const listeners = new Set();

function notify(event, id, node) {
  for (const fn of listeners) fn(event, id, node);
}

/** Subscribe to stage events: ('add'|'update'|'remove'|'scene', id, node) */
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

/** Get current scene state */
export function getScene() {
  return { ...currentScene };
}

/**
 * Reset the stage instantly (no animation).
 */
export function clearStage() {
  nodes.clear();
  mountIndex = 0;
  currentScene = {
    mode: 'overview',
    focus: null,
    supporting: [],
    tempo: 'brisk',
    continuity: 'preserve',
  };
  notify('clear', null, null);
}

/**
 * Animated clear: dissolve all nodes out over ~500ms, then reset.
 * Returns a promise that resolves when the stage is empty —
 * use as a visual bridge while waiting for a new response.
 */
export function dissolveStage(mood = 'neutral') {
  return new Promise((resolve) => {
    if (nodes.size === 0) {
      resolve();
      return;
    }

    let maxDur = 0;
    for (const [id, node] of nodes) {
      const motion = compileBehavior({
        patch: { op: 'remove', id, kind: node.kind },
        node, scene: currentScene, mood, index: 0,
      });
      const dur = motion.dur;
      if (dur > maxDur) maxDur = dur;
      node._exit = { t0: performance.now(), dur };
      notify('remove', id, node);
    }

    setTimeout(() => {
      nodes.clear();
      mountIndex = 0;
      currentScene = {
        mode: 'overview',
        focus: null,
        supporting: [],
        tempo: 'brisk',
        continuity: 'preserve',
      };
      notify('clear', null, null);
      resolve();
    }, maxDur + 50);
  });
}

/**
 * Apply attention policy to all existing nodes based on current scene.
 * Called when a scene patch arrives.
 */
function applyAttentionPolicy(scene, mood) {
  for (const [id, node] of nodes) {
    const attention = resolveAttention(id, scene);
    if (node._attention !== attention) {
      node._attention = attention;
      node._attentionT0 = performance.now();
      node._attentionDur = scene.tempo === 'deliberate' ? 500 : 350;
      notify('attention', id, node);
    }
  }
}

/**
 * Apply a patch to the stage.
 *
 * @param {object} patch - { op, id, kind, props, intent? }
 * @param {string} mood  - current choreography mood
 */
export function applyPatch(patch, mood = 'neutral') {
  const { op, id, kind, props, intent } = patch;

  // --- Scene patch: directs attention for the whole screen ---
  if (op === 'scene') {
    const sceneIntent = patch.intent || {};
    const prevScene = { ...currentScene };

    if (sceneIntent.continuity === 'reset') {
      currentScene = {
        mode: sceneIntent.mode || 'overview',
        focus: sceneIntent.focus || null,
        supporting: sceneIntent.supporting || [],
        tempo: sceneIntent.tempo || 'brisk',
        continuity: 'reset',
      };
    } else {
      currentScene = {
        mode: sceneIntent.mode || currentScene.mode,
        focus: sceneIntent.focus !== undefined ? sceneIntent.focus : currentScene.focus,
        supporting: sceneIntent.supporting || currentScene.supporting,
        tempo: sceneIntent.tempo || currentScene.tempo,
        continuity: 'preserve',
      };
    }

    applyAttentionPolicy(currentScene, mood);
    notify('scene', null, currentScene);
    return;
  }

  if (op === 'add') {
    const existing = nodes.get(id);
    if (existing) {
      return applyPatch({ op: 'update', id, props, intent }, mood);
    }

    const motion = compileBehavior({
      patch, node: null, scene: currentScene, mood, index: mountIndex,
    });
    const attention = resolveAttention(id, currentScene);

    const node = {
      id,
      kind,
      ...props,
      _order: mountIndex++,
      _version: ++stageVersion,
      _enter: {
        t0: performance.now() + motion.stagger,
        dur: motion.dur,
      },
      _verb: motion.verb,
      _easing: motion.easing,
      _blur: motion.blur || 0,
      _attention: intent?.action === 'focus' ? 'focused' : attention,
      _attentionT0: performance.now(),
      _attentionDur: 350,
      _tw: {},
    };

    nodes.set(id, node);
    notify('add', id, node);

  } else if (op === 'update') {
    const node = nodes.get(id);
    if (!node) return;

    const motion = compileBehavior({
      patch, node, scene: currentScene, mood, index: 0,
    });

    // Intent-driven verb override (e.g. warn -> pulse)
    if (intent?.action) {
      node._verb = motion.verb;
      node._easing = motion.easing;

      if (motion.attention !== 'normal') {
        node._attention = motion.attention;
        node._attentionT0 = performance.now();
        node._attentionDur = motion.dur;
      }

      // For pulse/warn: trigger a re-enter animation
      if (motion.verb === 'pulse') {
        node._pulse = { t0: performance.now(), dur: motion.dur };
      }
    }

    node._version = ++stageVersion;

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

    const motion = compileBehavior({
      patch, node, scene: currentScene, mood, index: 0,
    });
    node._exit = { t0: performance.now(), dur: motion.dur };

    notify('remove', id, node);

    setTimeout(() => {
      nodes.delete(id);
    }, motion.dur + 50);

  } else if (op === 'clear') {
    for (const [nid, node] of nodes) {
      const motion = compileBehavior({
        patch: { op: 'remove', id: nid, kind: node.kind },
        node, scene: currentScene, mood, index: 0,
      });
      node._exit = { t0: performance.now(), dur: motion.dur };
      notify('remove', nid, node);
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
