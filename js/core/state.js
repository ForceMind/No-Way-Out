export function createState(identity = null) {
    return {
        currentIdentity: identity, currentNode: identity ? 'start' : null,
        inventory: [], health: 100, sanity: 100, history: [],
        flags: {}, resources: {}, hunger: 0, fatigue: 0, ruleset: 'classic'
    };
}

export function normalizeState(state) {
    const next = { ...createState(state.currentIdentity), ...structuredClone(state) };
    next.history ??= [];
    next.flags ??= {};
    next.resources ??= {};
    next.hunger ??= 0;
    next.fatigue ??= 0;
    return next;
}

export function stateErrors(state, stories) {
    const errors = [];
    if (!state || typeof state !== 'object' || Array.isArray(state)) return ['状态必须是对象'];
    if (typeof state.currentIdentity !== 'string' || !Object.hasOwn(stories, state.currentIdentity)) errors.push('身份不存在');
    const nodes = stories[state.currentIdentity];
    if (!nodes || typeof state.currentNode !== 'string' || !Object.hasOwn(nodes, state.currentNode)) errors.push('当前剧情节点不存在');
    for (const key of ['health', 'sanity', 'hunger', 'fatigue']) {
        if (state[key] === undefined && ['hunger', 'fatigue'].includes(key)) continue;
        if (!Number.isFinite(state[key]) || state[key] < 0 || state[key] > 100) errors.push(`${key} 数值无效`);
    }
    if (!Array.isArray(state.inventory) || !state.inventory.every(item => typeof item === 'string' && item.trim())) errors.push('物品列表无效');
    if (state.history !== undefined && !Array.isArray(state.history)) errors.push('历史记录无效');
    else if (state.history?.some(entry => !entry || typeof entry !== 'object' || !['text', 'nodeText', 'from', 'to'].every(key => typeof entry[key] === 'string') || !Number.isFinite(entry.timestamp))) errors.push('历史条目无效');
    for (const key of ['flags', 'resources']) {
        const value = state[key];
        if (value === undefined) continue;
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            errors.push(`${key} 必须是对象`);
            continue;
        }
        if (key === 'flags' ? Object.values(value).some(v => typeof v !== 'boolean') : Object.values(value).some(v => !Number.isInteger(v) || v < 0)) errors.push(`${key} 内容无效`);
    }
    return errors;
}
