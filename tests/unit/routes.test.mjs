import test from 'node:test';
import assert from 'node:assert/strict';
import {identities,storyData} from '../../js/data.js';
import {findRoute} from '../../scripts/route-search.mjs';
import {createState,transition} from '../../js/core/engine.js';
for(const identity of identities)test(`${identity.id} has a complete playable classic route`,()=>{
    const route=findRoute(identity.id);let state=createState(identity.id);
    for(const step of route.steps){const result=transition(state,step,storyData);assert.equal(result.ok,true);state=result.state;}
    assert.equal(state.currentNode,route.ending);assert.equal(storyData[identity.id][state.currentNode].choices.length,0);
    assert.equal(state.ruleset,'classic');assert.equal(state.history.length,route.steps.length);
});
for(const [identity,target] of [['refugee','ending_refugee_sewer'],['farmer','ending_farmer_secret']])test(`${identity}.${target} has a complete restored route`,()=>{
    assert.equal(findRoute(identity,{target}).ending,target);
});
