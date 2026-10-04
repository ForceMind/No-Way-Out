import {checkCondition} from './conditions.js';
/** The same composed passage is shown in game, preview and saved history. */
export function describeNode(node,state) {
    const additions=(node.variants??[]).filter(variant=>checkCondition(variant.condition,state).allowed).map(variant=>variant.text);
    return [node.text,...additions].filter(Boolean).join('\n\n');
}
