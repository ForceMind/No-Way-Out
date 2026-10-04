import test from 'node:test';
import assert from 'node:assert/strict';
import { buildNodeDraft, DraftError } from '../../js/editor/model.js';

const original = {
    text: '原剧情', chapter: 'chapter-1', metadata: { author: '作者' },
    choices: [
        { id: 'give-water', text: '递水', next: 'help', condition: { hasItem: '水' }, custom: { important: true } },
        { id: 'leave', text: '离开', next: 'street', effect: { health: -5 } }
    ]
};
const input = choice => ({ original: choice, text: choice.text, next: choice.next, effectText: JSON.stringify(choice.effect ?? {}) });

test('untouched editor round-trip preserves all node and choice fields', () => {
    assert.deepEqual(buildNodeDraft(original, original.text, original.choices.map(input)), original);
});

test('deleting and reordering rows retains the corresponding original metadata', () => {
    const before = structuredClone(original);
    const result = buildNodeDraft(original, '修改后', [input(original.choices[1])]);
    assert.equal(result.choices.length, 1);
    assert.equal(result.choices[0].id, 'leave');
    assert.equal(result.choices[0].effect.health, -5);
    assert.deepEqual(original, before);
    const reversed = buildNodeDraft(original, original.text, original.choices.toReversed().map(input));
    assert.equal(reversed.choices[1].condition.hasItem, '水');
});

test('invalid JSON reports the exact row without mutating the source', () => {
    const before = structuredClone(original);
    const rows = original.choices.map(input);
    rows[1].effectText = '{"health":';
    assert.throws(() => buildNodeDraft(original, '未保存修改', rows), error => error instanceof DraftError && error.index === 1 && error.field === 'choice-effect');
    assert.deepEqual(original, before);
});

test('non-object effects and empty targets are rejected', () => {
    for (const effectText of ['null', '[]', '42']) {
        assert.throws(() => buildNodeDraft(original, original.text, [{ ...input(original.choices[0]), effectText }]), DraftError);
    }
    assert.throws(() => buildNodeDraft(original, original.text, [{ ...input(original.choices[0]), next: ' ' }]), DraftError);
});

test('quotes, markup and newlines remain plain string content', () => {
    const text = '他说："慢点喝"\n<span>原文</span>和\'单引号\'';
    const result = buildNodeDraft(original, text, [{ ...input(original.choices[0]), text }]);
    assert.equal(result.text, text);
    assert.equal(result.choices[0].text, text);
    assert.deepEqual(JSON.parse(JSON.stringify(result)), result);
});
