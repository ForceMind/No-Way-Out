const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
import { conditionErrors } from './conditions.js';
import { effectErrors } from './choice-effects.js';

/** Validate data without mutating it or interpreting story text as code. */
export function validateStories(stories, identities, { initialItems = {} } = {}) {
    const errors = [];
    const warnings = [];
    const stats = { identities: 0, nodes: 0, choices: 0, endings: 0 };
    const issue = (list, code, path, message) => list.push({ code, path, message });
    if (!object(stories) || !Array.isArray(identities)) {
        issue(errors, 'format', 'stories', '剧情必须是对象，身份必须是数组');
        return { errors, warnings, stats };
    }
    const seen = new Set();
    for (const identity of identities) {
        const id = identity?.id;
        if (!nonempty(id) || seen.has(id)) {
            issue(errors, 'identity', 'identities', '身份 ID 必须非空且不能重复');
            continue;
        }
        seen.add(id);
        stats.identities++;
        const nodes = Object.hasOwn(stories, id) ? stories[id] : null;
        if (!object(nodes)) {
            issue(errors, 'identity', id, '身份缺少剧情对象');
            continue;
        }
        if (!Object.hasOwn(nodes, 'start') || !object(nodes.start)) {
            issue(errors, 'start', id, '身份缺少有效的 start 节点');
        }
        const sources = new Set(initialItems[id] ?? []);
        for (const node of Object.values(nodes)) {
            if (!Array.isArray(node?.choices)) continue;
            for (const choice of node.choices) {
                if (nonempty(choice?.effect?.addItem)) sources.add(choice.effect.addItem);
            }
        }
        for (const [key, node] of Object.entries(nodes)) {
            const path = `${id}.${key}`;
            stats.nodes++;
            if (!object(node) || !nonempty(node.text) || !Array.isArray(node.choices)) {
                issue(errors, 'node', path, '节点必须包含非空 text 和 choices 数组');
                continue;
            }
            if (node.choices.length === 0) stats.endings++;
            if (node.archived !== undefined && typeof node.archived !== 'boolean') issue(errors,'archive',path,'archived 必须为布尔值');
            if (node.archived && (!nonempty(node.archiveReason) || node.choices.length)) issue(errors,'archive',path,'归档必须是无选项节点，并填写归档原因');
            if(node.variants!==undefined) {
                if(!Array.isArray(node.variants)) issue(errors,'variants',path,'variants 必须为数组');
                else for(const variant of node.variants) {
                    if(!object(variant)||!nonempty(variant.text)) issue(errors,'variants',path,'条件叙事必须包含文本');
                    for(const message of conditionErrors(variant?.condition)) issue(errors,'variants',path,message);
                }
            }
            const choiceIds = new Set();
            node.choices.forEach((choice, index) => {
                stats.choices++;
                const choicePath = `${path}.choices[${index}]`;
                if (!object(choice) || !nonempty(choice.text)) {
                    issue(errors, 'choice', choicePath, '选项必须包含非空 text');
                    return;
                }
                if (choice.id !== undefined) {
                    if (!nonempty(choice.id) || choiceIds.has(choice.id)) issue(errors,'choice-id',choicePath,'选项 ID 必须非空，且在节点内唯一');
                    choiceIds.add(choice.id);
                }
                if(choice.outcome!==undefined&&!nonempty(choice.outcome)) issue(errors,'outcome',choicePath,'行动后果必须为非空文本');
                if (choice.strenuous !== undefined && typeof choice.strenuous !== 'boolean') issue(errors,'choice',choicePath,'strenuous 必须为布尔值');
                if (choice.visibility !== undefined && !['locked','secret'].includes(choice.visibility)) issue(errors,'choice',choicePath,'visibility 必须为 locked 或 secret');
                if (!nonempty(choice.next) || !Object.hasOwn(nodes, choice.next) || !object(nodes[choice.next])) {
                    issue(errors, 'target', choicePath, `跳转目标不存在：${String(choice.next)}`);
                }
                if (choice.condition !== undefined) {
                    for (const message of conditionErrors(choice.condition)) issue(errors, 'condition', choicePath, message);
                    if (nonempty(choice.condition?.hasItem) && !sources.has(choice.condition.hasItem)) issue(warnings, 'item-source', choicePath, `当前身份缺少物品获取来源：${choice.condition.hasItem}`);
                }
                if (choice.effect !== undefined) {
                    for (const message of effectErrors(choice.effect)) issue(errors, 'effect', choicePath, message);
                }
            });
        }
        const visited = new Set();
        const pending = ['start'];
        while (pending.length) {
            const key = pending.pop();
            if (visited.has(key) || !Object.hasOwn(nodes, key) || !object(nodes[key])) continue;
            visited.add(key);
            for (const choice of Array.isArray(nodes[key].choices) ? nodes[key].choices : []) {
                if (nonempty(choice?.next)) pending.push(choice.next);
            }
        }
        for (const key of Object.keys(nodes)) {
            if (nodes[key]?.archived && visited.has(key)) issue(errors,'archive',`${id}.${key}`,'正式路线引用了归档节点，请先取消归档并完成内容审查');
            else if (!visited.has(key)) issue(warnings, nodes[key]?.archived ? 'archived' : 'unreachable', `${id}.${key}`, nodes[key]?.archived ? nodes[key].archiveReason : '从 start 结构上不可达；需核对是否为保留内容');
        }
    }
    return { errors, warnings, stats };
}
