const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const numericEffects = new Set(['health', 'changeHealth', 'sanity']);
const itemEffects = new Set(['addItem', 'removeItem']);

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
            node.choices.forEach((choice, index) => {
                stats.choices++;
                const choicePath = `${path}.choices[${index}]`;
                if (!object(choice) || !nonempty(choice.text)) {
                    issue(errors, 'choice', choicePath, '选项必须包含非空 text');
                    return;
                }
                if (!nonempty(choice.next) || !Object.hasOwn(nodes, choice.next) || !object(nodes[choice.next])) {
                    issue(errors, 'target', choicePath, `跳转目标不存在：${String(choice.next)}`);
                }
                if (choice.condition !== undefined) {
                    if (!object(choice.condition)) {
                        issue(errors, 'condition', choicePath, 'condition 必须是对象');
                    } else {
                        for (const [name, value] of Object.entries(choice.condition)) {
                            if (name !== 'hasItem' || !nonempty(value)) {
                                issue(errors, 'condition', choicePath, `无效或不支持的条件：${name}`);
                            } else if (!sources.has(value)) {
                                issue(warnings, 'item-source', choicePath, `当前身份缺少物品获取来源：${value}`);
                            }
                        }
                    }
                }
                if (choice.effect !== undefined) {
                    if (!object(choice.effect)) {
                        issue(errors, 'effect', choicePath, 'effect 必须是对象');
                    } else {
                        for (const [name, value] of Object.entries(choice.effect)) {
                            if (numericEffects.has(name) ? typeof value !== 'number' || !Number.isFinite(value) : itemEffects.has(name) ? !nonempty(value) : true) {
                                issue(errors, 'effect', choicePath, `无效或不支持的效果：${name}`);
                            }
                        }
                        if (Object.hasOwn(choice.effect, 'health') && Object.hasOwn(choice.effect, 'changeHealth')) {
                            issue(errors, 'effect', choicePath, 'health 与 changeHealth 不能同时存在');
                        }
                    }
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
            if (!visited.has(key)) issue(warnings, 'unreachable', `${id}.${key}`, '从 start 结构上不可达；需核对是否为保留内容');
        }
    }
    return { errors, warnings, stats };
}
