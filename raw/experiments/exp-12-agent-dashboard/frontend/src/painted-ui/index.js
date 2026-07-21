/**
 * Painted UI — Library Entry Point
 *
 * A semantic choreography layer for generative interfaces.
 * The model directs; your device animates.
 */

export { cur, alpha, tween, isAnimating, subscribe, getFrameCount } from './animator.js';
export { choreograph, MOODS } from './choreographer.js';
export { applyPatch, applyPatches, getNode, getAllNodes, hasNode, clearStage, onStageChange } from './stage.js';
export { useAnimated } from './useAnimated.js';
