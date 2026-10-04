const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const nonempty = value => typeof value === 'string' && value.trim();
const stats = new Set(['health', 'changeHealth', 'sanity', 'hunger', 'fatigue']);

export function effectErrors(effect) {
    if (effect === undefined) return [];
    if (!object(effect)) return ['effect 必须是对象'];
    const errors = [];
    for (const [key, value] of Object.entries(effect)) {
        if (stats.has(key)) {
            if (!Number.isFinite(value)) errors.push(`${key} 必须为有限数值`);
        } else if (['addItem', 'removeItem'].includes(key)) {
            if (!nonempty(value)) errors.push(`${key} 必须为非空物品名称`);
        } else if (key === 'setFlags') {
            if (!object(value) || Object.entries(value).some(([flag, state]) => !nonempty(flag) || typeof state !== 'boolean')) errors.push('setFlags 必须包含布尔值');
        } else if (key === 'resources') {
            if (!object(value) || Object.entries(value).some(([resource, amount]) => !nonempty(resource) || !Number.isInteger(amount))) errors.push('resources 必须包含整数增减值');
        } else if (key === 'advanceTime') {
            if (!Number.isInteger(value) || value < 1 || value > 3) errors.push('advanceTime 必须为 1–3 时段');
        } else if (['startSurvival','startCampaign','endCampaignChapter'].includes(key)) {
            if (value !== true) errors.push(`${key} 必须为 true`);
        } else errors.push(`不支持的效果：${key}`);
    }
    if (Object.hasOwn(effect, 'health') && Object.hasOwn(effect, 'changeHealth')) errors.push('health 与 changeHealth 不能同时存在');
    return errors;
}

export function applyEffects(state, effect = {}) {
    const errors = effectErrors(effect);
    if (errors.length) return { ok: false, reason: errors[0] };
    const next = structuredClone(state);
    const events = [];
    for (const [resource, amount] of Object.entries(effect.resources ?? {})) {
        const value = (Object.hasOwn(next.resources, resource) ? next.resources[resource] : 0) + amount;
        if (value < 0) return { ok: false, reason: '资源不足，行动未执行' };
        next.resources = { ...next.resources, [resource]: value };
        const label={food:"食物",water:"饮水",kit:"物资",work:"落实",proof:"核验",care:"互助",chapterWork:"本章落实",chapterProof:"本章核验"}[resource]??resource;
        if(amount) events.push({type:"resource",message:`${label}${amount>0?"增加":"减少"} ${Math.abs(amount)} 份`});
    }
    const changes = { health: effect.health ?? effect.changeHealth, sanity: effect.sanity, hunger: effect.hunger, fatigue: effect.fatigue };
    const labels = { health: '生命', sanity: '理智', hunger: '饥饿', fatigue: '疲劳' };
    for (const [key, amount] of Object.entries(changes)) {
        if (amount === undefined) continue;
        const before = next[key];
        next[key] = Math.max(0, Math.min(100, before + amount));
        const delta = next[key] - before;
        if (delta) events.push({ type: key, delta, message: `${labels[key]}${delta > 0 ? '增加' : '减少'} ${Math.abs(delta)}` });
    }
    if (effect.removeItem && next.inventory.includes(effect.removeItem)) {
        next.inventory.splice(next.inventory.indexOf(effect.removeItem), 1);
        events.push({ type: 'item', message: `失去物品：${effect.removeItem}` });
    }
    if (effect.addItem && !next.inventory.includes(effect.addItem)) {
        next.inventory.push(effect.addItem);
        events.push({ type: 'item', message: `获得物品：${effect.addItem}` });
    }
    next.flags = { ...next.flags, ...effect.setFlags };
    return { ok: true, state: next, events };
}
