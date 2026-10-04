import test from 'node:test';
import assert from 'node:assert/strict';
import { Typewriter } from '../../js/ui/typewriter.js';
import { normalizePreferences } from '../../js/ui/preferences.js';

test('skip completes once and a superseded passage never completes', () => {
    const pending = new Map(); let next=0; let completed=0; let text='';
    const writer=new Typewriter({schedule: fn=>{pending.set(++next,fn);return next;}, cancel:id=>pending.delete(id)});
    const render=value=>{text=value;};
    writer.start('旧文', {render,complete:()=>{completed+=100;}});
    writer.start('新文🙂', {render,complete:()=>completed++});
    writer.skip(); writer.skip();
    assert.equal(text,'新文🙂'); assert.equal(completed,1); assert.equal(pending.size,0);
});
test('instant reading completes synchronously once with no timer', () => {
    let completed=0; let text='';
    const writer=new Typewriter({schedule:()=>assert.fail('unexpected timer')});
    writer.start('立即阅读', {delay:0,render:value=>text=value,complete:()=>completed++});
    writer.skip(); assert.equal(text,'立即阅读'); assert.equal(completed,1);
});
test('invalid preferences fall back and system reduced motion is respected', () => {
    assert.deepEqual(normalizePreferences({speed:-1,fontSize:'huge'},true), {speed:30,fontSize:20,reducedMotion:true});
    assert.deepEqual(normalizePreferences({speed:0,fontSize:24,reducedMotion:false},true), {speed:0,fontSize:24,reducedMotion:false});
});

import {collectEnding,readEndings} from '../../js/ui/endings.js';
test('ending collection deduplicates reloads and preserves damaged records', () => {
    const data=new Map(); const provider=()=>({getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)});
    const entry={identity:'citizen',node:'ending1',title:'结局',at:1};
    assert.equal(collectEnding(entry,provider).ok,true);
    assert.equal(collectEnding(entry,provider).ok,true);
    assert.equal(readEndings(provider).value.length,1);
    data.set('nw_endings','broken');
    assert.equal(collectEnding(entry,provider).ok,false);
    assert.equal(data.get('nw_endings'),'broken');
});
