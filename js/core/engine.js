import { createState, normalizeState, stateErrors } from './state.js';
import { checkCondition } from './conditions.js';
import {beginSurvival,advanceTime,SURVIVAL_RULESET} from './time-system.js';
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
    if (choice.strenuous && state.ruleset === SURVIVAL_RULESET && state.fatigue >= 80) return {ok:false,reason:'过于疲劳，需要先休息'};
    if (choice.effect?.startSurvival && (state.ruleset === SURVIVAL_RULESET || !Object.hasOwn(nodes,'city3_ending_loss'))) return {ok:false,reason:'无法重复开始生存章节'};
    const condition = checkCondition(choice.condition, state);
    if (!condition.allowed) return { ok: false, reason: condition.reason };
    const result = applyEffects(normalizeState(state), choice.effect);
    if (!result.ok) return result;
    let next = result.state;
    if (choice.effect?.startSurvival) next=beginSurvival(next);
    if (choice.effect?.advanceTime) {
        const advanced=advanceTime(next,choice.effect.advanceTime);
        if (!advanced.ok) return advanced;
        next=advanced.state;result.events.push(...advanced.events);
    }
    if (next.ruleset===SURVIVAL_RULESET && next.sanity===0 && !next.flags.crisisSeen) {
        next.flags.crisisSeen=true;result.events.push({type:'crisis',message:'恐惧使你难以集中精神，先寻找可以休息的地方'});
    }
    next.currentNode = choice.next;
    if (next.ruleset===SURVIVAL_RULESET && next.health===0) next.currentNode="city3_ending_loss";
    next.history.push({
        choiceId: choice.id ?? `${state.currentIdentity}:${state.currentNode}:${selection.choiceIndex}`,
        identity: state.currentIdentity, from: state.currentNode, to: next.currentNode,
        text: choice.text, nodeText: node.text, timestamp: now()
    });
    const nextErrors = stateErrors(next, stories);
    if (nextErrors.length) return { ok: false, reason: nextErrors[0] };
    return { ok: true, state: next, events: result.events };
}
