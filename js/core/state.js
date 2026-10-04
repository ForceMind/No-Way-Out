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
    if (state.ruleset !== undefined && !['classic','survival-v1'].includes(state.ruleset)) errors.push('未知章节规则');
    if (state.ruleset === 'survival-v1') {
        const clock=state.clock;
        if (!clock || !Number.isInteger(clock.day) || clock.day<1 || clock.day>3 || !Number.isInteger(clock.period) || clock.period<0 || clock.period>2 || !Number.isInteger(clock.lastSettledDay) || clock.lastSettledDay<0 || clock.lastSettledDay>3 || typeof clock.finished!=='boolean' || (clock.finished ? clock.day!==3 || clock.period!==2 || clock.lastSettledDay!==3 : clock.lastSettledDay!==clock.day-1)) errors.push('章节时钟无效');
        if (state.currentIdentity !== 'citizen' || !state.currentNode?.startsWith('city3_') || !Object.hasOwn(nodes??{},'city3_ending_loss')) errors.push('生存规则与章节不匹配');
        if (!state.resources || !['food','water'].every(key=>Object.hasOwn(state.resources,key))) errors.push('缺少章节资源');
    }
    return errors;
}
