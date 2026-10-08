import {createCampaignState} from '../core/campaign.js';
import {describeNode} from '../core/narrative.js';

    import { identities, storyData } from '../data.js';
    import { buildNodeDraft, DraftError } from './model.js';
    import { EditorSession, exportIdentity, persistDraft, restoreDraft } from './session.js';
    import {createState,transition} from '../core/engine.js';
    import {checkCondition} from '../core/conditions.js';
    import { validateStories } from '../core/story-validator.js';

    // Deep copy to avoid direct mutation issues until save
    const session = new EditorSession(storyData, identities);
    let currentData = session.data;
    let baseline = null;
    let draftWritable = true;
    let currentIdentity = identities[0].id;
    let currentNodeKey = null;

    const identityListEl = document.getElementById('identity-list');
    const nodeListEl = document.getElementById('node-list');
    const editForm = document.getElementById('edit-form');
    const noSelection = document.getElementById('no-selection');
    const choicesEditor = document.getElementById('choices-editor');
    const choiceMetadata = new WeakMap();

    function clearError() {
        document.getElementById('editor-error').style.display = 'none';
        document.querySelectorAll('[aria-invalid]').forEach(input => input.removeAttribute('aria-invalid'));
    }

    function showError(error) {
        const element = document.getElementById('editor-error');
        element.textContent = error.message;
        element.style.display = 'block';
        const input = error.index === null || error.index === undefined
            ? document.getElementById(error.field)
            : choicesEditor.children[error.index]?.querySelector(`.${error.field}`);
        if (input) {
            input.setAttribute('aria-invalid', 'true');
            input.focus();
        }
    }

    function init() {
        renderIdentities();
        selectIdentity(currentIdentity);
    }

    function renderIdentities() {
        identityListEl.innerHTML = '';
        identities.forEach(idObj => {
            const div = document.createElement('button');
            div.className = `identity-item ${idObj.id === currentIdentity ? 'active' : ''}`;
            div.textContent = idObj.name;
            div.onclick = () => selectIdentity(idObj.id);
            identityListEl.appendChild(div);
        });
    }

    function selectIdentity(id, bypass=false) {
        if (!bypass && isDirty()) {guard(() => selectIdentity(id,true));return;}
        currentIdentity = id;
        currentNodeKey = null;
        clearError();
        renderIdentities();
        renderNodes();
        editForm.style.display = 'none';
        noSelection.style.display = 'block';
    }

    function renderNodes() {
        nodeListEl.innerHTML = '';
        const nodes = currentData[currentIdentity] || {};
        const search=document.getElementById('node-search').value.toLowerCase();
        Object.keys(nodes).filter(key => key.toLowerCase().includes(search) || nodes[key].text.toLowerCase().includes(search)).forEach(key => {
            const div = document.createElement('button');
            div.className = `node-item ${key === currentNodeKey ? 'active' : ''}`;
            div.textContent = nodes[key].archived ? `${key}（归档）` : key;
            div.onclick = () => selectNode(key);
            nodeListEl.appendChild(div);
        });
    }

    function selectNode(key, bypass=false) {
        if (!bypass && isDirty()) {guard(() => selectNode(key,true));return;}
        clearError();
        currentNodeKey = key;
        renderNodes();
        
        const node = currentData[currentIdentity][key];
        document.getElementById('node-key').value = key;
        document.getElementById('node-text').value = node.text;
        
        renderChoices(node.choices || []);
        
        editForm.style.display = 'block';
        noSelection.style.display = 'none';
        baseline=JSON.stringify(captureForm());
        renderReferences();
    }

    function renderChoices(choices) {
        choicesEditor.innerHTML = '';
        choices.forEach(appendChoice);
    }

    function appendChoice(choice) {
        const div = document.createElement('div');
        div.className = 'choice-item';
        choiceMetadata.set(div, structuredClone(choice));
        for (const [labelText, className, value] of [
            ['选项文本:', 'choice-text', choice.text ?? ''],
            ['跳转节点 (Next):', 'choice-next', choice.next ?? ''],
            ['效果 (Effect - JSON):', 'choice-effect', JSON.stringify(choice.effect ?? {})],
            ['条件 (Condition - JSON):', 'choice-condition', JSON.stringify(choice.condition ?? {})]
        ]) {
            const group = document.createElement('div');
            group.style.marginBottom = '5px';
            const label = document.createElement('label');
            label.textContent = labelText;
            const input = document.createElement('input');
            input.type = 'text';
            input.className = className;
            input.value = value;
            label.appendChild(input);
            group.appendChild(label);
            div.appendChild(group);
        }
        const tools=document.createElement('div');
        for (const [text,kind] of [['物品条件','item'],['最低生命','health'],['获得物品','gain'],['生命变化','delta']]) {
            const button=document.createElement('button');button.className='btn';button.textContent=text;
            button.addEventListener('click',()=>{
                const value=prompt(text);if (value===null) return;
                const target=div.querySelector(kind==='gain'||kind==='delta'?'.choice-effect':'.choice-condition');
                try {const rule=JSON.parse(target.value); const key={item:'hasItem',health:'minHealth',gain:'addItem',delta:'health'}[kind];rule[key]=kind==='health'||kind==='delta'?Number(value):value;target.value=JSON.stringify(rule);queuePersist();}
                catch {showError(new Error('请先修复 JSON，再使用常用字段按钮'));}
            });tools.append(button);
        }
        div.append(tools);
        const remove = document.createElement('button');
        remove.className = 'btn btn-danger';
        remove.textContent = '删除';
        remove.addEventListener('click', () => {div.remove();queuePersist();});
        div.appendChild(remove);
        choicesEditor.appendChild(div);
    }

    window.addChoice = () => {appendChoice({ id:`choice_${crypto.randomUUID()}`, text: '新选项', next: '', effect: {} });queuePersist();};
    window.removeChoice = index => choicesEditor.children[index]?.remove();

    window.saveCurrentNode = () => {
        if (!currentNodeKey) return;
        
        clearError();
        try {
            const inputs = captureForm().inputs;
            const draft = buildNodeDraft(currentData[currentIdentity][currentNodeKey], document.getElementById('node-text').value, inputs);
            const nodes = { ...currentData[currentIdentity], [currentNodeKey]: draft };
            const result = validateStories({ [currentIdentity]: nodes }, [{ id: currentIdentity }]);
            if (result.errors.length) {
                const issue = result.errors[0];
                const index = issue.path.match(/choices\[(\d+)\]/)?.[1];
                throw new DraftError(issue.message, issue.code === 'target' ? 'choice-next' : issue.code === 'condition' ? 'choice-condition' : 'choice-effect', index === undefined ? null : Number(index));
            }
            session.commit({...currentData,[currentIdentity]:nodes});
            currentData=session.data;
            baseline=JSON.stringify(captureForm());
            persist();renderReferences();updateUndo();
            alert('节点已保存！记得导出备份。');
            return true;
        } catch (error) {
            showError(error);
            return false;
        }
    };

    window.addNode = (bypass=false) => {
        if (!bypass && isDirty()) {guard(()=>window.addNode(true));return;}
        const key = prompt("请输入新节点ID (例如: street_event_1):");
        if (key === null) return;
        if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(key)) {
            showError(new Error('节点 ID 需以字母开头，只包含字母、数字和下划线'));
        } else if (!Object.hasOwn(currentData[currentIdentity], key)) {
            session.commit({...currentData,[currentIdentity]:{...currentData[currentIdentity],[key]:{text:"新剧情...",choices:[]}}});
            currentData=session.data;
            renderNodes();
            selectNode(key,true);persist();updateUndo();
        } else if (currentData[currentIdentity][key]) {
            alert("节点ID已存在");
        }
    };

    window.deleteCurrentNode = () => {
        if (!currentNodeKey) return;
        if (currentNodeKey === 'start') {
            showError(new Error('不能删除身份的 start 节点'));
            return;
        }
        const references = Object.entries(currentData[currentIdentity]).filter(([key, node]) => key !== currentNodeKey && node.choices.some(choice => choice.next === currentNodeKey)).map(([key]) => key);
        if (references.length) {
            showError(new Error(`不能删除：节点被 ${references.join('、')} 引用，请先修改跳转`));
            return;
        }
        if (confirm("确定删除此节点吗？")) {
            const nodes={...currentData[currentIdentity]};delete nodes[currentNodeKey];
            session.commit({...currentData,[currentIdentity]:nodes});currentData=session.data;
            currentNodeKey = null;
            renderNodes();
            editForm.style.display = 'none';
            noSelection.style.display = 'block';persist();updateUndo();
        }
    };

    function download(name, text, type) {
        const url=URL.createObjectURL(new Blob([text],{type})); const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
    window.exportData = () => {download('storyData.json',JSON.stringify(currentData,null,2),'application/json');alert('完整 JSON 备份已导出。');};

    function captureForm() {
        if (!currentNodeKey) return null;
        return {identity:currentIdentity,node:currentNodeKey,text:document.getElementById('node-text').value,inputs:Array.from(choicesEditor.children,item=>({original:choiceMetadata.get(item),text:item.querySelector('.choice-text').value,next:item.querySelector('.choice-next').value,effectText:item.querySelector('.choice-effect').value,conditionText:item.querySelector('.choice-condition').value}))};
    }
    function isDirty() {return currentNodeKey && JSON.stringify(captureForm())!==baseline;}
    let pendingSwitch=null;
    function guard(action) {pendingSwitch=action;document.getElementById('unsaved-modal').showModal();}
    document.getElementById('draft-cancel').onclick=()=>{pendingSwitch=null;document.getElementById('unsaved-modal').close();};
    document.getElementById('draft-discard').onclick=()=>{const action=pendingSwitch;pendingSwitch=null;document.getElementById('unsaved-modal').close();action?.();persist();};
    document.getElementById('draft-save').onclick=()=>{if (!window.saveCurrentNode()) return;const action=pendingSwitch;pendingSwitch=null;document.getElementById('unsaved-modal').close();action?.();persist();};
    let persistTimer=null;
    function persist() {
        if (!draftWritable) return;
        const result=persistDraft(currentData,captureForm());
        document.getElementById('draft-status').textContent=result.ok ? isDirty()?'草稿自动保存，节点修改尚未提交':'草稿已保存，请定期导出备份' : '浏览器无法保存草稿，请导出备份';
    }
    function queuePersist() {clearTimeout(persistTimer);persistTimer=setTimeout(persist,200);}
    document.getElementById('edit-form').addEventListener('input',queuePersist);
    window.addEventListener('beforeunload',event=>{persist();if(isDirty()){event.preventDefault();event.returnValue='';}});
    document.getElementById('node-search').addEventListener('input',renderNodes);
    function renderReferences() {
        const incoming=Object.entries(currentData[currentIdentity]).filter(([,node])=>node.choices.some(choice=>choice.next===currentNodeKey)).map(([key])=>key);
        const outgoing=currentData[currentIdentity][currentNodeKey].choices.map(choice=>choice.next);
        document.getElementById('node-references').textContent=`引用此节点：${incoming.join('、')||'无'}；前往：${outgoing.join('、')||'结局'}`;
    }
    function updateUndo() {document.getElementById('undo-btn').disabled=!session.past.length;document.getElementById('redo-btn').disabled=!session.future.length;}
    for (const name of ['undo','redo']) document.getElementById(`${name}-btn`).onclick=()=>{
        const action=()=>{if(!session[name]())return;currentData=session.data;if(currentNodeKey && Object.hasOwn(currentData[currentIdentity],currentNodeKey))selectNode(currentNodeKey,true);else selectIdentity(currentIdentity,true);persist();updateUndo();};
        if(isDirty())guard(action);else action();
    };
    document.getElementById('export-identity').onclick=()=>download(`${currentIdentity}.js`,exportIdentity(currentIdentity,currentData[currentIdentity]),'text/javascript');
    document.getElementById('import-btn').onclick=()=>{const action=()=>document.getElementById('import-file').click();if(isDirty())guard(action);else action();};
    document.getElementById('import-file').onchange=async event=>{
        const file=event.target.files[0];if(!file)return;
        try {const result=session.importJSON(await file.text(),currentIdentity);if(confirm(`检查通过，将更新 ${result.changed.length} 个身份：${result.changed.join('、')||'无变更'}。继续？`)){session.commit(result.data);currentData=session.data;selectIdentity(currentIdentity,true);persist();updateUndo();}}
        catch(error){showError(error);}finally{event.target.value='';}
    };
    let previewState;
    function previewRestart() {
        if(currentData[currentIdentity][currentNodeKey]?.campaign) previewState=createCampaignState(currentIdentity);
        else {previewState=createState(currentIdentity);previewState.currentNode=currentNodeKey;}
        previewState.inventory=document.getElementById('preview-items').value.split(/[,，]/).map(value=>value.trim()).filter(Boolean);renderPreview();
    }
    function renderPreview() {
        const node=currentData[previewState.currentIdentity][previewState.currentNode];
        document.getElementById('preview-text').textContent=describeNode(node,previewState);
        document.getElementById('preview-status').textContent=`${previewState.ruleset==='campaign-v1'?`从序章建立预览进度 · 已选择 ${previewState.campaign.decisions} 次 · `:''}${previewState.currentNode} · 生命 ${previewState.health} · 理智 ${previewState.sanity}`;
        const choices=document.getElementById('preview-choices');choices.replaceChildren();
        node.choices.forEach((choice,index)=>{const button=document.createElement('button');const condition=choice.strenuous && previewState.ruleset==='survival-v1' && previewState.fatigue>=80 ? {allowed:false,reason:'疲劳过高'} : checkCondition(choice.condition,previewState);button.textContent=choice.text+(condition.allowed?'':`（${choice.lockReason??condition.reason}）`);button.disabled=!condition.allowed;button.onclick=()=>{const result=transition(previewState,{nodeKey:previewState.currentNode,choiceIndex:index},currentData);if(result.ok){previewState=result.state;renderPreview();}else showError(new Error(result.reason));};choices.append(button);});
        if(!node.choices.length)choices.textContent='此节点为结局。';
    }
    document.getElementById('preview-btn').onclick=()=>{if(isDirty()){showError(new Error('请先保存节点，再预览'));return;}previewRestart();document.getElementById('preview-modal').showModal();};
    document.getElementById('preview-restart').onclick=previewRestart;
    document.getElementById('preview-close').onclick=()=>document.getElementById('preview-modal').close();
    document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const controls=[...dialog.querySelectorAll('button:not(:disabled),input')];const first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}));
    init();updateUndo();
    const restored=restoreDraft(identities);
    if (!restored.ok) {draftWritable=false;showError(new Error('旧草稿无法读取，原记录已保留；当前可编辑并导出，自动保存暂停。'));}
    else if(restored.value && confirm('发现上次编辑草稿，恢复吗？')) {
        currentData=structuredClone(restored.value.data);session.data=currentData;
        const form=restored.value.form;
        if(form && Object.hasOwn(currentData,form.identity) && Object.hasOwn(currentData[form.identity],form.node)) {
            selectIdentity(form.identity,true);selectNode(form.node,true);
            document.getElementById('node-text').value=form.text;
            choicesEditor.replaceChildren();
            for(const input of form.inputs ?? []){appendChoice(input.original??{});const row=choicesEditor.lastElementChild;for(const [field,value] of [['text',input.text],['next',input.next],['effect',input.effectText],['condition',input.conditionText]])row.querySelector(`.choice-${field}`).value=value??'';}
        }else selectIdentity(currentIdentity,true);
        document.getElementById('draft-status').textContent='上次草稿已恢复；无效 JSON 也会保留供修复。';
    }
