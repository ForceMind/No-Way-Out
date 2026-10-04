import test from 'node:test';
import assert from 'node:assert/strict';
import { validateStories } from '../../js/core/story-validator.js';

const identities = [{ id: 'sample' }];
const story = () => ({ sample: {
    start: { text: '开始', choices: [{ text: '继续', next: 'end' }] },
    end: { text: '结束', choices: [] }
} });

test('valid story is accepted and left unchanged', () => {
    const data = story();
    const before = JSON.stringify(data);
    assert.deepEqual(validateStories(data, identities), {
        errors: [], warnings: [], stats: { identities: 1, nodes: 2, choices: 1, endings: 1 }
    });
    assert.equal(JSON.stringify(data), before);
});

test('missing and inherited jump targets are rejected with the choice path', () => {
    for (const target of ['absent', 'toString']) {
        const data = story();
        data.sample.start.choices[0].next = target;
        const errors = validateStories(data, identities).errors;
        assert.equal(errors.length, 1);
        assert.equal(errors[0].code, 'target');
        assert.equal(errors[0].path, 'sample.start.choices[0]');
        assert.match(errors[0].message, new RegExp(target));
    }
});

test('missing starts, invalid nodes and duplicate identities are reported', () => {
    const data = { sample: { end: null } };
    assert.deepEqual(validateStories(data, [...identities, ...identities]).errors.map(e => e.code), ['start', 'node', 'identity']);
    assert.equal(validateStories(null, identities).errors[0].code, 'format');
});

test('nonfinite effects, ambiguous health changes and unknown rules cannot silently pass', () => {
    const data = story();
    data.sample.start.choices[0].effect = { health: Infinity, changeHealth: -5, unsupported: 1 };
    data.sample.start.choices[0].condition = { minHealth: 10 };
    const result = validateStories(data, identities);
    assert.equal(result.errors.filter(e => e.code === 'effect').length, 3);
    assert.equal(result.errors.filter(e => e.code === 'condition').length, 1);
});

test('conditional reachability is not confused with structural reachability', () => {
    const data = story();
    data.sample.start.choices[0].condition = { hasItem: '钥匙' };
    data.sample.unused = { text: '保留内容', choices: [] };
    const result = validateStories(data, identities);
    assert.equal(result.errors.length, 0);
    assert.deepEqual(result.warnings.map(e => e.code), ['item-source', 'unreachable']);
    assert.equal(result.warnings[1].path, 'sample.unused');
});

test('declared initial items and choice effects satisfy item-source checks', () => {
    const data = story();
    data.sample.start.choices[0].condition = { hasItem: '钥匙' };
    assert.equal(validateStories(data, identities, { initialItems: { sample: ['钥匙'] } }).warnings.length, 0);
    data.sample.start.choices[0].effect = { addItem: '钥匙', health: -5 };
    assert.equal(validateStories(data, identities).warnings.length, 0);
});
