import test from 'node:test';
import assert from 'node:assert/strict';
import { identities, storyData } from '../../js/data.js';
import { validateStories } from '../../js/core/story-validator.js';
import { createState, transition } from '../../js/core/engine.js';
import { checkCondition } from '../../js/core/conditions.js';

// Search real playable states, rather than treating every structural edge as available.
function reach(identity, target, item) {
    const queue = [createState(identity)];
    const seen = new Set();
    for (let cursor = 0; cursor < queue.length && cursor < 10000; cursor++) {
        const state = queue[cursor];
        const key = JSON.stringify([state.currentNode, [...state.inventory].sort(), state.health, state.sanity]);
        if (seen.has(key)) continue;
        seen.add(key);
        if (state.currentNode === target && state.inventory.includes(item)) return state;
        storyData[identity][state.currentNode].choices.forEach((choice, choiceIndex) => {
            const result = transition(state, { nodeKey: state.currentNode, choiceIndex }, storyData, {now:()=>1});
            if (result.ok) queue.push(result.state);
        });
    }
    assert.fail(`${identity}.${target} cannot be reached with ${item}`);
}

test('every item requirement has a same-identity acquisition source', () => {
    const warnings = validateStories(storyData, identities).warnings;
    assert.deepEqual(warnings.filter(issue => issue.code === 'item-source'), []);
});

for (const [identity, node, item] of [
    ['citizen', 'pass_explain', '钱币'], ['citizen', 'east1', '钱币'],
    ['refugee', 'east_escape_plan', '钱币'],
    ['teacher', 'teacher_west_pass', '钱币'], ['teacher', 'teacher_pass_teach', '钱币'],
    ['merchant', 'merchant_east', '金条'], ['merchant', 'merchant_west', '金条'],
    ['merchant', 'merchant_church', '金条'], ['merchant', 'merchant_river', '金条'],
    ['agent', 'agent_day3_kill', '手术刀'], ['agent', 'agent_day4_morning', '步枪']
]) {
    test(`${identity}.${node} can unlock ${item} through actual choices`, () => {
        const state = reach(identity, node, item);
        const choiceIndex = storyData[identity][node].choices.findIndex(choice => choice.condition?.hasItem === item);
        assert.ok(choiceIndex >= 0);
        assert.equal(checkCondition(storyData[identity][node].choices[choiceIndex].condition, state).allowed, true);
        const result = transition(state, {nodeKey:node, choiceIndex}, storyData, {now:()=>2});
        assert.equal(result.ok, true);
        if (identity === 'merchant') assert.ok(!result.state.inventory.includes('金条'));
    });
}
