const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const name = value => typeof value === 'string' && value.trim().length > 0;
const names = { food: '食物', water: '饮水' };

export function conditionErrors(condition) {
    if (condition === undefined) return [];
    if (!object(condition)) return ['condition 必须是对象'];
    const errors = [];
    for (const [key, value] of Object.entries(condition)) {
        if (key === 'hasItem' || key === 'hasFlag') {
            if (!name(value)) errors.push(`${key} 必须为非空名称`);
        } else if (['minHealth', 'minSanity', 'maxFatigue'].includes(key)) {
            if (!Number.isFinite(value) || value < 0 || value > 100) errors.push(`${key} 必须为 0–100 的数值`);
        } else if (key === 'flags') {
            if (!object(value) || Object.entries(value).some(([flag, expected]) => !name(flag) || typeof expected !== 'boolean')) errors.push('flags 必须包含布尔值');
        } else if (key === 'resources') {
            if (!object(value) || Object.entries(value).some(([resource, amount]) => !name(resource) || !Number.isInteger(amount) || amount < 0)) errors.push('resources 必须包含非负整数');
        } else errors.push(`不支持的条件：${key}`);
    }
    return errors;
}

export function checkCondition(condition, state) {
    const errors = conditionErrors(condition);
    if (errors.length) return { allowed: false, reason: errors[0] };
    if (!condition) return { allowed: true, reason: '' };
    if (condition.hasItem && !state.inventory.includes(condition.hasItem)) return { allowed: false, reason: `需要物品：${condition.hasItem}` };
    if (condition.minHealth !== undefined && state.health < condition.minHealth) return { allowed: false, reason: `生命需要达到 ${condition.minHealth}` };
    if (condition.minSanity !== undefined && state.sanity < condition.minSanity) return { allowed: false, reason: `理智需要达到 ${condition.minSanity}` };
    if (condition.maxFatigue !== undefined && (state.fatigue ?? 0) > condition.maxFatigue) return { allowed: false, reason: '过于疲劳，需要休息' };
    if (condition.hasFlag && (!Object.hasOwn(state.flags ?? {}, condition.hasFlag) || state.flags[condition.hasFlag] !== true)) return { allowed: false, reason: '尚未完成前置事件' };
    for (const [flag, value] of Object.entries(condition.flags ?? {})) {
        if ((Object.hasOwn(state.flags ?? {}, flag) ? state.flags[flag] : false) !== value) return { allowed: false, reason: '尚未满足前置事件' };
    }
    for (const [resource, amount] of Object.entries(condition.resources ?? {})) {
        const available = Object.hasOwn(state.resources ?? {}, resource) ? state.resources[resource] : 0;
        if (available < amount) return { allowed: false, reason: `${Object.hasOwn(names, resource) ? names[resource] : resource}不足，需要 ${amount} 份` };
    }
    return { allowed: true, reason: '' };
}
