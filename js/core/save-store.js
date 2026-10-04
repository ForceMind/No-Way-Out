import { stateErrors, normalizeState } from './state.js';
import { CONTENT_VERSION, COMPATIBLE_CONTENT_VERSIONS, LEGACY_NODE_ALIASES } from '../content-manifest.js';

export const SAVE_VERSION = 2;
export const SAVE_SLOTS = ['auto', 'manual-1', 'manual-2', 'manual-3'];
const storageObject = provider => typeof provider === 'function' ? provider() : provider;
const defaultStorage = () => globalThis.localStorage;

export function readJSON(key, provider = defaultStorage) {
    try {
        const raw = storageObject(provider).getItem(key);
        if (raw === null) return { ok: true, value: null };
        try {
            return { ok: true, value: JSON.parse(raw) };
        } catch {
            return { ok: false, reason: 'invalid-json' };
        }
    } catch {
        return { ok: false, reason: 'storage-unavailable' };
    }
}

export function writeJSON(key, value, provider = defaultStorage) {
    try {
        storageObject(provider).setItem(key, JSON.stringify(value));
        return { ok: true };
    } catch {
        return { ok: false, reason: 'storage-unavailable' };
    }
}

export function readVolume(provider = defaultStorage) {
    const record = readJSON('nw_volume', provider);
    const volume = value => {
        const numeric = typeof value === 'number' || typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN;
        return Number.isFinite(numeric) && numeric >= 0 && numeric <= 1 ? numeric : 0.5;
    };
    return { ok: record.ok, value: { bgm: volume(record.value?.bgm), sfx: volume(record.value?.sfx) } };
}

export function decodeLegacySave(record, stories) {
    const state = record?.state;
    const errors = stateErrors(state, stories);
    if (errors.length) return { ok: false, reason: 'invalid-state', message: errors[0] };
    return { ok: true, state: normalizeState(state) };
}

export function createSave(state, { now = Date.now, contentVersion = CONTENT_VERSION } = {}) {
    return { saveVersion: SAVE_VERSION, contentVersion, savedAt: now(), state: normalizeState(state) };
}

export function decodeSave(record, stories, { compatibleVersions = COMPATIBLE_CONTENT_VERSIONS, aliases = LEGACY_NODE_ALIASES } = {}) {
    if (!record || typeof record !== 'object') return { ok: false, reason: 'invalid-state' };
    if (record.saveVersion === undefined) {
        if (record.contentVersion !== undefined) return { ok: false, reason: 'unsupported-version' };
        const legacy = decodeLegacySave(record, stories);
        if (!legacy.ok) return legacy;
        const savedAt = Number.isFinite(record.timestamp) && record.timestamp >= 0 ? record.timestamp : 0;
        return { ok: true, state: legacy.state, migrated: true, record: createSave(legacy.state, { now: () => savedAt }) };
    }
    if (record.saveVersion !== SAVE_VERSION) return { ok: false, reason: 'unsupported-version' };
    if (!compatibleVersions.includes(record.contentVersion)) return { ok: false, reason: 'unsupported-content' };
    if (!Number.isFinite(record.savedAt) || record.savedAt < 0) return { ok: false, reason: 'invalid-state' };
    const state = structuredClone(record.state);
    if (state && Object.hasOwn(aliases, state.currentIdentity)) {
        const mapping = aliases[state.currentIdentity];
        if (Object.hasOwn(mapping, state.currentNode) && typeof mapping[state.currentNode] === 'string') state.currentNode = mapping[state.currentNode];
    }
    const decoded = decodeLegacySave({ state }, stories);
    if (!decoded.ok) return decoded;
    return { ok: true, state: decoded.state, migrated: false, record: { ...structuredClone(record), state: decoded.state } };
}

export function saveSlot(slot, state, stories, { provider = defaultStorage, now = Date.now } = {}) {
    if (!SAVE_SLOTS.includes(slot)) return { ok: false, reason: 'invalid-slot' };
    const errors = stateErrors(state, stories);
    if (errors.length) return { ok: false, reason: 'invalid-state', message: errors[0] };
    return writeJSON(`nw_save_v2_${slot}`, createSave(state, { now }), provider);
}

export function loadSlot(slot, stories, { provider = defaultStorage, migrate = true, ...options } = {}) {
    if (!SAVE_SLOTS.includes(slot)) return { ok: false, reason: 'invalid-slot' };
    const key = `nw_save_v2_${slot}`;
    let record = readJSON(key, provider);
    if (!record.ok) return record;
    if (record.value === null && slot === 'manual-1') record = readJSON('nw_save', provider);
    if (!record.ok) return record;
    if (record.value === null) return { ok: false, reason: 'missing' };
    const result = decodeSave(record.value, stories, options);
    if (result.ok && result.migrated && migrate) {
        const written = writeJSON(key, result.record, provider);
        if (!written.ok) result.warning = 'migration-not-saved';
    }
    return result;
}

export function listSlots(stories, options = {}) {
    return SAVE_SLOTS.map(slot => ({ slot, ...loadSlot(slot, stories, { ...options, migrate: false }) }));
}
