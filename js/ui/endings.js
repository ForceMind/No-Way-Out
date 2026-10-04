import {readJSON,writeJSON} from '../core/save-store.js';
export function readEndings(provider) {
    const record=readJSON('nw_endings',provider);
    const valid=Array.isArray(record.value) && record.value.every(entry=>entry && typeof entry.identity==='string' && typeof entry.node==='string' && typeof entry.title==='string' && Number.isFinite(entry.at));
    return {...record,value:valid ? record.value : [],valid:record.value===null || valid};
}
export function collectEnding(entry,provider) {
    const result=readEndings(provider);
    if (!result.ok || !result.valid) return {ok:false,reason:'invalid-collection'};
    if (result.value.some(item=>item.identity===entry.identity && item.node===entry.node)) return {ok:true};
    return writeJSON('nw_endings',[...result.value,structuredClone(entry)],provider);
}
