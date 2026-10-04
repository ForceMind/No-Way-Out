import { createState, normalizeState, stateErrors } from './state.js';
import { checkCondition } from './conditions.js';
import { applyEffects } from './choice-effects.js';

export { createState };

/** A failed or stale action never changes the source state. */
export function transition(state, selection, stories, { now = Date.now } = {}) {
    const errors = stateErrors(state, stories);
    if (errors.length) return { ok: false, reason: errors[0] };
    if (selection?.nodeKey !== state.currentNode || !Number.isInteger(selection.choiceIndex)) return { ok: false, reason: '当前剧情已变化，请重新选择' };
    const node = stories[state.currentIdentity][state.currentNode];
    if (!Array.isArray(node?.choices)) return { ok: false, reason: '当前剧情格式无效' };
    const choice = node.choices[selection.choiceIndex];
    if (!choice) return { ok: false, reason: '选项不存在' };
    const nodes = stories[state.currentIdentity];
    if (!Object.hasOwn(nodes, choice.next) || !nodes[choice.next]?.text) return { ok: false, reason: '目标剧情不存在，行动未执行' };
    const condition = checkCondition(choice.condition, state);
    if (!condition.allowed) return { ok: false, reason: condition.reason };
    const result = applyEffects(normalizeState(state), choice.effect);
    if (!result.ok) return result;
    const next = result.state;
    next.currentNode = choice.next;
    next.history.push({
        choiceId: choice.id ?? `${state.currentIdentity}:${state.currentNode}:${selection.choiceIndex}`,
        identity: state.currentIdentity, from: state.currentNode, to: choice.next,
        text: choice.text, nodeText: node.text, timestamp: now()
    });
    const nextErrors = stateErrors(next, stories);
    if (nextErrors.length) return { ok: false, reason: nextErrors[0] };
    return { ok: true, state: next, events: result.events };
}
