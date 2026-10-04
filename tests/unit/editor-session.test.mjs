import test from 'node:test';
import assert from 'node:assert/strict';
import {EditorSession,exportIdentity,persistDraft,restoreDraft} from '../../js/editor/session.js';
const data={citizen:{start:{text:'开局',extra:'保留',choices:[{text:'走',next:'end',condition:{minHealth:1}}]},end:{text:'结束',choices:[]}}};
const identities=[{id:'citizen'}];
test('import validates before committing and undo/redo retain every field',()=>{
    const session=new EditorSession(data,identities);
    assert.throws(()=>session.importJSON('{"start":{"text":"坏","choices":[{"text":"走","next":"missing"}]}}','citizen'));
    assert.deepEqual(session.data,data);
    const copy=structuredClone(data);copy.citizen.start.text='更新';
    const parsed=session.importJSON(JSON.stringify(copy),'citizen');assert.deepEqual(parsed.changed,['citizen']);
    session.commit(parsed.data);session.undo();assert.deepEqual(session.data,data);session.redo();assert.deepEqual(session.data,copy);
});
test('generated identity module imports with exact conditions and special text',async()=>{
    const nodes=structuredClone(data.citizen);nodes.start.text='引号" 换行\n </script> ${notCode}';
    const imported=await import(`data:text/javascript;base64,${Buffer.from(exportIdentity('citizen',nodes)).toString('base64')}`);
    assert.deepEqual(imported.citizenData,nodes);
});
test('editor draft restores raw unsaved fields and does not overwrite corrupt records',()=>{
    const values=new Map();const provider=()=>({getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)});
    const form={identity:'citizen',node:'start',text:'未保存',inputs:[{text:'走',next:'end',effectText:'{bad'}]};
    assert.equal(persistDraft(data,form,provider).ok,true);assert.deepEqual(restoreDraft(identities,provider).value.form,form);
    values.set('nw_editor_draft','broken');assert.equal(restoreDraft(identities,provider).ok,false);assert.equal(values.get('nw_editor_draft'),'broken');
});
