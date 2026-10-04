import {storyData} from '../js/data.js';
import {createCampaignState} from '../js/core/campaign.js';
import {transition} from '../js/core/engine.js';
/** Deterministic witnesses execute the production engine; no forced state or skipped scenes. */
export function walkCampaign(identity,endingKind,{resume}={}) {
 let state=createCampaignState(identity);const steps=[];
 for(let count=0;count<500;count++) {
  const node=storyData[identity][state.currentNode];
  if(!node.choices.length)return {state,steps};
  let index;
  if(state.currentNode.endsWith('_decision')) index=node.choices.findIndex(c=>c.next.endsWith(`_ending_${endingKind}`));
  else if(state.currentNode.endsWith('_start')) index=0;
  else if(state.currentNode.endsWith('_handoff')) index=endingKind==='guard'?1:endingKind==='loss'?2:0;
  else if(endingKind==='guard')index=count%2===0?2:3;
  else if(endingKind==='loss')index=3;
  else if(state.currentNode.includes('_epilogue_'))index=1;
  else {const stage=Number(state.currentNode.split('_').at(-1));index=stage<8?0:stage<13?1:stage%2===0?2:3;}
  const selection={nodeKey:state.currentNode,choiceIndex:index};
  const result=transition(state,selection,storyData,{now:()=>count+1});
  if(!result.ok)throw new Error(`${identity}.${endingKind} ${selection.nodeKey}: ${result.reason}`);
  steps.push({...selection,next:result.state.currentNode});state=result.state;
  if(resume&&count===104)state=resume(state);
 }
 throw new Error('Campaign exceeded 500 decisions');
}
