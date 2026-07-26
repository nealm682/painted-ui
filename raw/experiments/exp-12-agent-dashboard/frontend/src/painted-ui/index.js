/**
 * Painted UI — Library Entry Point
 *
 * A semantic choreography layer for generative interfaces.
 * The model directs; your device animates.
 */

export { cur, alpha, tween, isAnimating, subscribe, getFrameCount } from './animator.js';
export { choreograph, compileBehavior, resolveAttention, MOODS } from './choreographer.js';
export { PatchStreamParser } from './parser.js';
export { applyPatch, applyPatches, getNode, getAllNodes, hasNode, clearStage, dissolveStage, onStageChange, getScene } from './stage.js';
export { useAnimated } from './useAnimated.js';
