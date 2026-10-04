import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON, writeJSON, readVolume, decodeLegacySave } from '../../js/core/save-store.js';

const stories = { citizen: { start: { text: '开始', choices: [] } } };
const saved = () => ({ state: { currentIdentity: 'citizen', currentNode: 'start', inventory: ['水'], health: 90, sanity: 100, history: [] }, timestamp: 1 });

test('invalid JSON is reported without deleting or replacing the original record', () => {
    const raw = '{broken';
    const storage = { getItem: () => raw, setItem: () => assert.fail('must not write') };
    assert.deepEqual(readJSON('nw_save', storage), { ok: false, reason: 'invalid-json' });
    assert.equal(storage.getItem('nw_save'), raw);
});

test('unavailable storage getters and quota errors do not escape', () => {
    const blocked = () => { throw new Error('storage is disabled'); };
    assert.equal(readJSON('nw_save', blocked).ok, false);
    assert.equal(writeJSON('nw_save', saved(), blocked).ok, false);
    const full = { setItem: () => { throw new Error('quota'); } };
    assert.equal(writeJSON('nw_save', saved(), full).ok, false);
});

test('missing records and successful writes are distinct from storage failures', () => {
    let raw = null;
    const storage = { getItem: () => raw, setItem: (_, value) => { raw = value; } };
    assert.deepEqual(readJSON('nw_save', storage), { ok: true, value: null });
    assert.equal(writeJSON('nw_save', saved(), storage).ok, true);
    assert.deepEqual(readJSON('nw_save', storage).value, saved());
});

test('volume accepts legacy numeric strings, zero, and falls back for invalid values', () => {
    const volume = value => readVolume({ getItem: () => JSON.stringify(value) }).value;
    assert.deepEqual(volume({ bgm: '0.2', sfx: 0 }), { bgm: 0.2, sfx: 0 });
    assert.deepEqual(volume({ bgm: 12, sfx: '' }), { bgm: 0.5, sfx: 0.5 });
    assert.deepEqual(readVolume(() => { throw new Error('disabled'); }).value, { bgm: 0.5, sfx: 0.5 });
});

test('legacy states are copied rather than aliased and missing histories are normalized', () => {
    const original = saved();
    delete original.state.history;
    const decoded = decodeLegacySave(original, stories);
    assert.equal(decoded.ok, true);
    assert.deepEqual(decoded.state.history, []);
    decoded.state.inventory.push('新物品');
    assert.deepEqual(original.state.inventory, ['水']);
});

test('invalid identities, inherited nodes and malformed states cannot replace the game state', () => {
    for (const [key, value] of [['currentIdentity', 'missing'], ['currentNode', 'toString'], ['health', NaN], ['sanity', 101], ['inventory', [42]], ['history', {}]]) {
        const original = saved();
        original.state[key] = value;
        assert.equal(decodeLegacySave(original, stories).ok, false, key);
    }
    assert.equal(decodeLegacySave({ state: null }, stories).ok, false);
});
