import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON, writeJSON, readVolume, decodeLegacySave, createSave, decodeSave, saveSlot, loadSlot, listSlots } from '../../js/core/save-store.js';

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

const memory = () => {
    const values = new Map();
    return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
};

test('legacy migration is idempotent and preserves the original record', () => {
    const provider = memory();
    const raw = JSON.stringify(saved());
    provider.setItem('nw_save', raw);
    const first = loadSlot('manual-1', stories, { provider });
    assert.equal(first.ok, true);
    assert.equal(first.migrated, true);
    assert.equal(first.record.saveVersion, 2);
    assert.equal(provider.getItem('nw_save'), raw);
    const second = loadSlot('manual-1', stories, { provider });
    assert.equal(second.migrated, false);
    assert.deepEqual(second.state, first.state);
});

test('unknown save/content versions are rejected without changing storage', () => {
    for (const change of [{ saveVersion: 999 }, { contentVersion: 'future-content' }]) {
        const provider = memory();
        const raw = JSON.stringify({ ...createSave(saved().state, { now: () => 1 }), ...change });
        provider.setItem('nw_save_v2_manual-1', raw);
        assert.equal(loadSlot('manual-1', stories, { provider }).ok, false);
        assert.equal(provider.getItem('nw_save_v2_manual-1'), raw);
    }
});

test('automatic and three manual slots are independent', () => {
    const provider = memory();
    for (const [index, slot] of ['auto', 'manual-1', 'manual-2', 'manual-3'].entries()) {
        assert.equal(saveSlot(slot, { ...saved().state, health: 90 - index }, stories, { provider, now: () => index }).ok, true);
    }
    assert.deepEqual(listSlots(stories, { provider }).map(row => row.state.health), [90, 89, 88, 87]);
    assert.equal(saveSlot('arbitrary', saved().state, stories, { provider }).ok, false);
});

test('corrupt primary saves do not silently fall back to or overwrite legacy data', () => {
    const provider = memory();
    const legacy = JSON.stringify(saved());
    provider.setItem('nw_save', legacy);
    provider.setItem('nw_save_v2_manual-1', '{broken');
    assert.equal(loadSlot('manual-1', stories, { provider }).reason, 'invalid-json');
    assert.equal(provider.getItem('nw_save'), legacy);
    assert.equal(provider.getItem('nw_save_v2_manual-1'), '{broken');
});

test('listing old saves does not write a migrated record', () => {
    const provider = memory();
    provider.setItem('nw_save', JSON.stringify(saved()));
    assert.equal(listSlots(stories, { provider })[1].ok, true);
    assert.equal(provider.values.has('nw_save_v2_manual-1'), false);
});

test('a valid legacy save remains playable when migration cannot be written', () => {
    const raw = JSON.stringify(saved());
    const provider = { getItem: key => key === 'nw_save' ? raw : null, setItem: () => { throw new Error('quota'); } };
    const result = loadSlot('manual-1', stories, { provider });
    assert.equal(result.ok, true);
    assert.equal(result.warning, 'migration-not-saved');
    assert.equal(result.state.health, 90);
    assert.equal(provider.getItem('nw_save'), raw);
});

test('only explicit node aliases migrate renamed references', () => {
    const record = createSave({ ...saved().state, currentNode: 'old-start' }, { now: () => 1 });
    assert.equal(decodeSave(record, stories).ok, false);
    const migrated = decodeSave(record, stories, { aliases: { citizen: { 'old-start': 'start' } } });
    assert.equal(migrated.ok, true);
    assert.equal(migrated.state.currentNode, 'start');
    assert.equal(record.state.currentNode, 'old-start');
});

test('malformed history entries and negative save timestamps are rejected', () => {
    const record = createSave(saved().state, { now: () => 1 });
    record.state.history = [42];
    assert.equal(decodeSave(record, stories).ok, false);
    assert.equal(decodeSave({ ...createSave(saved().state), savedAt: -1 }, stories).ok, false);
});
