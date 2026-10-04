import test from 'node:test';
import assert from 'node:assert/strict';
import {storyData} from '../../js/data.js';
import {createState,transition} from '../../js/core/engine.js';
import {createCampaignState} from '../../js/core/campaign.js';
import {createSave,decodeSave} from '../../js/core/save-store.js';
import {stateErrors} from '../../js/core/state.js';
import {describeNode} from '../../js/core/narrative.js';
import {walkCampaign} from '../../scripts/campaign-routes.mjs';
test('all twelve identities provide complete long campaigns',()=>assert.equal(ids.length,12));
const ids=Object.keys(storyData).filter(id=>storyData[id][`campaign_${id}_start`]);
for(const id of ids) {
 test(`${id}: all campaign branches advance exactly one consequential scene`,()=>{
  const nodes=storyData[id];let endings=0;
  for(const [key,node] of Object.entries(nodes).filter(([,n])=>n.campaign)) {
   if(!node.choices.length){endings++;assert.equal(node.campaign.step,208);continue;}
   assert.ok(node.choices.length>=2,key);
   for(const choice of node.choices){assert.equal(nodes[choice.next].campaign.step,node.campaign.step+1,key);assert.ok(choice.outcome?.trim());}
   if(node.campaign.step<207)assert.ok(new Set(node.choices.map(c=>JSON.stringify(c.effect))).size>=2,key);
  }
  assert.ok(endings>=6);
 });
 for(const [key,node] of Object.entries(storyData[id]).filter(([,n])=>n.campaign&&n.choices.length===0)) {
  test(`${id}: ${node.ending.kind} completes after 208 actual decisions, including save resume`,()=>{
   const normal=walkCampaign(id,node.ending.kind);
   const resumed=walkCampaign(id,node.ending.kind,{resume:state=>{
    const decoded=decodeSave(createSave(state,{now:()=>1}),storyData);assert.equal(decoded.ok,true);return decoded.state;
   }});
   assert.equal(normal.state.currentNode,key);assert.equal(normal.steps.length,208);
   assert.equal(normal.state.campaign.decisions,208);assert.equal(normal.state.history.length,208);
   assert.deepEqual(resumed.state,normal.state);assert.deepEqual(stateErrors(normal.state,storyData),[]);
  });
 }
}
test('campaign rejects forged counts, skips, stale actions and preserves source state',()=>{
 const state=createCampaignState('orphan'),before=structuredClone(state);
 assert.equal(transition(state,{nodeKey:'wrong',choiceIndex:0},storyData).ok,false);
 assert.deepEqual(state,before);
 const forged={...state,campaign:{decisions:207}};
 assert.ok(stateErrors(forged,storyData).length);
 const modified=structuredClone(storyData);modified.orphan[state.currentNode].choices[0].next='campaign_orphan_decision';
 assert.equal(transition(state,{nodeKey:state.currentNode,choiceIndex:0},modified).ok,false);
 const entered=transition(createState('orphan'),{nodeKey:'start',choiceIndex:storyData.orphan.start.choices.length-1},storyData);
 assert.equal(entered.ok,true);assert.equal(entered.state.campaign.decisions,0);
 assert.equal(stateErrors(entered.state,storyData).length,0);
});
test('campaign history records the actual conditional narrative and outcome',()=>{
 const start=createCampaignState('orphan');
 const first=transition(start,{nodeKey:start.currentNode,choiceIndex:0},storyData).state;
 const second=transition(first,{nodeKey:first.currentNode,choiceIndex:1},storyData).state;
 const node=storyData.orphan[second.currentNode],displayed=describeNode(node,second);
 assert.ok(displayed.includes('你已经核对过上一处疑点'));
 const next=transition(second,{nodeKey:second.currentNode,choiceIndex:3},storyData);
 assert.equal(next.state.history.at(-1).nodeText,displayed);assert.ok(next.state.history.at(-1).outcome);
});
