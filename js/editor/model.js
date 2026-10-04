export class DraftError extends Error {
    constructor(message, field, index = null) {
        super(message);
        this.name = 'DraftError';
        this.field = field;
        this.index = index;
    }
}

/** Build a complete candidate first, preserving fields the form does not edit. */
export function buildNodeDraft(original, text, inputs) {
    if (typeof text !== 'string' || !text.trim()) throw new DraftError('剧情文本不能为空', 'node-text');
    const choices = inputs.map((input, index) => {
        if (!input.text?.trim()) throw new DraftError(`选项 ${index + 1} 的文本不能为空`, 'choice-text', index);
        if (!input.next?.trim()) throw new DraftError(`选项 ${index + 1} 的跳转节点不能为空`, 'choice-next', index);
        let effect;
        try {
            effect = JSON.parse(input.effectText || '{}');
        } catch {
            throw new DraftError(`选项 ${index + 1} 的效果 JSON 不合法；修改尚未保存`, 'choice-effect', index);
        }
        if (effect === null || typeof effect !== 'object' || Array.isArray(effect)) {
            throw new DraftError(`选项 ${index + 1} 的效果必须是 JSON 对象`, 'choice-effect', index);
        }
        const choice = { ...structuredClone(input.original ?? {}), text: input.text, next: input.next.trim() };
        if (Object.hasOwn(choice, 'effect') || Object.keys(effect).length) choice.effect = effect;
        if (input.conditionText !== undefined) {
            let condition;
            try {condition = JSON.parse(input.conditionText || '{}');}
            catch {throw new DraftError(`选项 ${index + 1} 的条件 JSON 不合法`, 'choice-condition', index);}
            if (!condition || typeof condition !== 'object' || Array.isArray(condition)) throw new DraftError('条件必须是 JSON 对象', 'choice-condition', index);
            if (Object.keys(condition).length) choice.condition=condition;
            else delete choice.condition;
        }
        return choice;
    });
    return { ...structuredClone(original), text, choices };
}
