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
    if (!state || typeof state !== 'object' || Array.isArray(state)) return { ok: false, reason: 'invalid-state' };
    if (typeof state.currentIdentity !== 'string' || !Object.hasOwn(stories, state.currentIdentity)) return { ok: false, reason: 'invalid-identity' };
    const nodes = stories[state.currentIdentity];
    if (typeof state.currentNode !== 'string' || !Object.hasOwn(nodes, state.currentNode)) return { ok: false, reason: 'invalid-node' };
    if (!['health', 'sanity'].every(key => Number.isFinite(state[key]) && state[key] >= 0 && state[key] <= 100)) return { ok: false, reason: 'invalid-stats' };
    if (!Array.isArray(state.inventory) || !state.inventory.every(item => typeof item === 'string' && item.trim())) return { ok: false, reason: 'invalid-inventory' };
    if (state.history !== undefined && !Array.isArray(state.history)) return { ok: false, reason: 'invalid-history' };
    return { ok: true, state: { ...structuredClone(state), history: structuredClone(state.history ?? []) } };
}
