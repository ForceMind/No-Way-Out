import {createState,transition} from '../js/core/engine.js';
import {storyData} from '../js/data.js';
export function findRoute(identity,{target,classicOnly=true,maxStates=20000}={}) {
    const queue=[{state:createState(identity),steps:[]}];const seen=new Set();
    for(let cursor=0;cursor<queue.length && cursor<maxStates;cursor++) {
        const {state,steps}=queue[cursor];
        const {history,...values}=state;
        const key=JSON.stringify({...values,inventory:[...state.inventory].sort()});
        if(seen.has(key))continue;seen.add(key);
        const node=storyData[identity][state.currentNode];
        if(target ? state.currentNode===target : node.choices.length===0 && !node.archived) return {identity,ending:state.currentNode,steps};
        node.choices.forEach((choice,choiceIndex)=>{
            if(classicOnly && choice.next.startsWith('city3_'))return;
            const result=transition(state,{nodeKey:state.currentNode,choiceIndex},storyData,{now:()=>1});
            if(result.ok)queue.push({state:result.state,steps:[...steps,{nodeKey:state.currentNode,choiceIndex,text:choice.text,next:result.state.currentNode}]});
        });
    }
    throw new Error(`没有找到可玩的路线：${identity}.${target??'ending'}（已检查 ${seen.size} 个状态）`);
}
