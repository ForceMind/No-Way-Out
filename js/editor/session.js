import { validateStories } from '../core/story-validator.js';
import { readJSON, writeJSON } from '../core/save-store.js';
import { CONTENT_VERSION } from '../content-manifest.js';
export class EditorSession {
    constructor(data, identities, limit=30) {
        this.data=structuredClone(data); this.identities=identities; this.limit=limit; this.past=[]; this.future=[];
    }
    commit(data) {
        const result=validateStories(data,this.identities);
        if (result.errors.length) throw new Error(`${result.errors[0].path}: ${result.errors[0].message}`);
        this.past.push(this.data); this.past=this.past.slice(-this.limit); this.future=[]; this.data=structuredClone(data);
    }
    undo() { if (!this.past.length) return false; this.future.push(this.data); this.data=this.past.pop(); return true; }
    redo() { if (!this.future.length) return false; this.past.push(this.data); this.data=this.future.pop(); return true; }
    importJSON(text, identity) {
        const value=JSON.parse(text);
        if (!value || typeof value!=='object' || Array.isArray(value)) throw new Error('导入内容必须是 JSON 对象');
        let candidate;
        if (Object.hasOwn(value,'start')) candidate={...this.data,[identity]:value};
        else {
            const allowed=new Set(this.identities.map(item=>item.id));
            if (Object.keys(value).some(key=>!allowed.has(key))) throw new Error('导入文件包含未知身份');
            candidate={...this.data,...value};
        }
        const result=validateStories(candidate,this.identities);
        if (result.errors.length) throw new Error(`${result.errors[0].path}: ${result.errors[0].message}`);
        return {data:candidate,changed:Object.keys(candidate).filter(key=>JSON.stringify(candidate[key])!==JSON.stringify(this.data[key]))};
    }
}
export function exportIdentity(identity,nodes) {
    if (!/^[a-z]+$/.test(identity)) throw new Error('身份 ID 不合法');
    // JSON.parse preserves special keys and cannot turn story text into executable code.
    return `export const ${identity}Data = JSON.parse(${JSON.stringify(JSON.stringify(nodes))});\n`;
}
export function persistDraft(data,form,provider) {
    return writeJSON('nw_editor_draft',{version:1,contentVersion:CONTENT_VERSION,data,form},provider);
}
export function restoreDraft(identities,provider) {
    const record=readJSON('nw_editor_draft',provider);
    if (!record.ok || record.value===null) return record;
    if (record.value.version!==1 || record.value.contentVersion!==CONTENT_VERSION || validateStories(record.value.data,identities).errors.length) return {ok:false,reason:'invalid-draft'};
    const form=record.value.form;
    if (form!==null && (!form || typeof form.identity!=='string' || typeof form.node!=='string' || typeof form.text!=='string' || !Array.isArray(form.inputs) || form.inputs.some(input=>!input || typeof input.text!=='string' || typeof input.next!=='string' || typeof input.effectText!=='string' || (input.conditionText!==undefined && typeof input.conditionText!=='string')))) return {ok:false,reason:'invalid-draft'};
    return record;
}
