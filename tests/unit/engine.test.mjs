import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, transition } from '../../js/core/engine.js';
import { checkCondition } from '../../js/core/conditions.js';
import { storyData } from '../../js/data.js';

const stories = effect => ({ sample: {
    start: { text: '原始剧情', choices: [{ id: 'sample-go', text: '前往', next: 'end', effect }] },
    end: { text: '结局', choices: [] }
} });
const action = { nodeKey: 'start', choiceIndex: 0 };

test('a choice commits once, preserves source objects and stores a historical snapshot', () => {
    const state = createState('sample');
    const data = stories({ health: -15, addItem: '水' });
    const before = structuredClone({ state, data });
    const result = transition(state, action, data, { now: () => 123 });
    assert.equal(result.ok, true);
    assert.equal(result.state.currentNode, 'end');
    assert.equal(result.state.health, 85);
    assert.deepEqual(result.state.inventory, ['水']);
    assert.deepEqual(result.state.history, [{ choiceId: 'sample-go', identity: 'sample', from: 'start', to: 'end', text: '前往', nodeText: '原始剧情', timestamp: 123 }]);
    assert.deepEqual({ state, data }, before);
    assert.equal(transition(result.state, action, data).ok, false);
    assert.equal(result.state.health, 85);
    assert.equal(result.state.history.length, 1);
});

test('missing targets abort before any effects or history are committed', () => {
    const state = createState('sample');
    const data = stories({ health: -30, addItem: '物品' });
    data.sample.start.choices[0].next = 'missing';
    const before = structuredClone(state);
    assert.equal(transition(state, action, data).ok, false);
    assert.deepEqual(state, before);
});

test('unmet item and stat conditions leave the original state untouched', () => {
    const state = createState('sample');
    const data = stories({ health: -20 });
    data.sample.start.choices[0].condition = { hasItem: '水' };
    assert.equal(transition(state, action, data).ok, false);
    assert.equal(checkCondition({ minHealth: 100 }, state).allowed, true);
    assert.equal(checkCondition({ minSanity: 50 }, { ...state, sanity: 20 }).allowed, false);
    assert.equal(state.health, 100);
});

test('unknown rules and conflicting health aliases cannot silently execute', () => {
    const state = createState('sample');
    assert.equal(transition(state, action, stories({ health: -10, changeHealth: -10 })).ok, false);
    assert.equal(transition(state, action, stories({ typoEffect: true })).ok, false);
    assert.equal(checkCondition({ unsupported: true }, state).allowed, false);
});

test('resource costs and flags are applied atomically', () => {
    const state = createState('sample');
    state.resources = { food: 1 };
    const data = stories({ health: -5, resources: { food: -2 }, setFlags: { helped: true } });
    assert.equal(transition(state, action, data).ok, false);
    assert.equal(state.health, 100);
    assert.deepEqual(state.resources, { food: 1 });
    assert.deepEqual(state.flags, {});
    data.sample.start.choices[0].effect.resources.food = -1;
    const result = transition(state, action, data);
    assert.equal(result.ok, true);
    assert.equal(result.state.resources.food, 0);
    assert.equal(result.state.flags.helped, true);
});

test('numeric boundaries report actual changes and preserve classic zero-health behavior', () => {
    const state = createState('sample');
    const healed = transition(state, action, stories({ health: 10 }));
    assert.equal(healed.state.health, 100);
    assert.equal(healed.events.length, 0);
    const harmed = transition(state, action, stories({ health: -150 }));
    assert.equal(harmed.state.health, 0);
    assert.equal(harmed.state.currentNode, 'end');
    assert.equal(harmed.events[0].delta, -100);
});

test('legacy states receive additive defaults without altering existing values', () => {
    const state = { currentIdentity: 'sample', currentNode: 'start', health: 90, sanity: 80, inventory: [] };
    const result = transition(state, action, stories());
    assert.equal(result.ok, true);
    assert.equal(result.state.health, 90);
    assert.deepEqual(result.state.flags, {});
    assert.equal(result.state.history.length, 1);
});

test('existing refugee changeHealth choices retain their original behavior', () => {
    const state = createState('refugee');
    state.currentNode = 'bakery1';
    const result = transition(state, { nodeKey: 'bakery1', choiceIndex: 0 }, storyData);
    assert.equal(result.ok, true);
    assert.equal(result.state.health, 90);
    assert.equal(result.state.currentNode, 'warehouse1');
});
