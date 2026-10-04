import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,transition} from '../../js/core/engine.js';
import {beginSurvival,advanceTime,settleDay} from '../../js/core/time-system.js';
import {stateErrors} from '../../js/core/state.js';
import {createSave,decodeSave} from '../../js/core/save-store.js';
import {storyData} from '../../js/data.js';
const prefix=['citizen_survival_chapter','city3_begin'];
const transfer=['city3_d1_clue','city3_d1_water','city3_d1_rest','city3_d2_verify','city3_d2_food','city3_d2_sleep','city3_d3_water','city3_d3_rest2','city3_d3_prepare','city3_transfer'];
const shelter=['city3_d1_food','city3_d1_help','city3_d1_repair','city3_d2_rest','city3_d2_water','city3_d2_sleep','city3_d3_food','city3_d3_rest2','city3_d3_prepare','city3_shelter'];
function choose(state,id) {
    const choiceIndex=storyData.citizen[state.currentNode].choices.findIndex(choice=>choice.id===id);
    assert.ok(choiceIndex>=0,`${state.currentNode}: ${id}`);
    const result=transition(state,{nodeKey:state.currentNode,choiceIndex},storyData,{now:()=>123});
    assert.equal(result.ok,true,`${id}: ${result.reason}`);return result.state;
}
const follow=(ids,state=createState('citizen'))=>ids.reduce(choose,state);

test('three days settle once, update resources and leave the source untouched',()=>{
    const initial=beginSurvival(createState('citizen'));
    const original=structuredClone(initial);
    const first=advanceTime(initial,3);assert.equal(first.ok,true);
    assert.deepEqual(initial,original);assert.deepEqual(first.state.resources,{food:1,water:1});
    assert.deepEqual(first.state.clock,{day:2,period:0,lastSettledDay:1,finished:false});
    assert.deepEqual(settleDay(first.state,1).state,first.state);
    const second=advanceTime(first.state,3);const third=advanceTime(second.state,3);
    assert.equal(third.state.clock.finished,true);assert.equal(third.state.clock.lastSettledDay,3);
    assert.equal(advanceTime(third.state).ok,false);
});
test('food and water exhaustion damage health deterministically',()=>{
    const state=beginSurvival(createState('citizen'));state.resources={food:0,water:0};state.hunger=35;
    const result=advanceTime(state,3);assert.equal(result.state.health,85);assert.equal(result.state.fatigue,15);
    assert.equal(result.state.hunger,70);assert.deepEqual(result.state.resources,{food:0,water:0});
});
test('transfer and shelter endings are reachable with distinct preparations',()=>{
    const escaped=follow([...prefix,...transfer]);const stayed=follow([...prefix,...shelter]);
    assert.equal(escaped.currentNode,'city3_ending_transfer');assert.equal(stayed.currentNode,'city3_ending_shelter');
    assert.equal(escaped.clock.lastSettledDay,3);assert.equal(stayed.clock.lastSettledDay,3);
    assert.deepEqual(follow([...prefix,...transfer]),escaped);
});
test('second-day choices retain the first-day consequences',()=>{
    const informed=follow([...prefix,...transfer.slice(0,3)]);const helped=follow([...prefix,...shelter.slice(0,3)]);
    assert.equal(informed.currentNode,'city3_d2_m');assert.equal(helped.currentNode,'city3_d2_m');
    assert.equal(informed.flags.clue,true);assert.equal(helped.flags.helped,true);assert.equal(helped.flags.repaired,true);
    assert.notDeepEqual(informed.resources,helped.resources);
});
test('resource-depleted play still reaches an authored loss ending',()=>{
    const ids=['city3_d1_clue','city3_d1_help','city3_d1_rest','city3_d2_rest','city3_d2_help','city3_d2_sleep','city3_d3_rest','city3_d3_rest2','city3_d3_prepare','city3_wait'];
    // Day 2 help is unaffordable, so use a strenuous water trip instead.
    ids[4]='city3_d2_water';
    const state=follow([...prefix,...ids]);assert.equal(state.currentNode,'city3_ending_loss');assert.equal(state.resources.food,0);
});
test('zero health forces loss in the new chapter and remains compatible in classic mode',()=>{
    const state=follow([...prefix,...transfer.slice(0,5),'city3_d2_risk']);
    assert.equal(state.health,0);assert.equal(state.currentNode,'city3_ending_loss');assert.equal(state.history.at(-1).to,'city3_ending_loss');
    const classic=createState('citizen');classic.health=0;
    assert.equal(transition(classic,{nodeKey:'start',choiceIndex:0},storyData).ok,true);
});
test('fatigue blocks strenuous actions atomically, while rest remains usable',()=>{
    const state=follow(prefix);state.fatigue=80;
    const result=transition(state,{nodeKey:state.currentNode,choiceIndex:0},storyData);
    assert.equal(result.ok,false);assert.equal(state.history.length,2);assert.equal(state.clock.period,0);
    const rested=follow([...prefix,...transfer.slice(0,3)]);rested.fatigue=90;
    const next=choose(rested,'city3_d2_rest');assert.equal(next.fatigue,65);
});
test('save resume yields identical subsequent results without another settlement',()=>{
    const mid=follow([...prefix,...transfer.slice(0,3)]);const record=createSave(mid,{now:()=>123});
    const restored=decodeSave(record,storyData);assert.equal(restored.ok,true);assert.deepEqual(restored.state,mid);
    assert.deepEqual(follow(transfer.slice(3),restored.state),follow(transfer.slice(3),mid));
    assert.deepEqual(decodeSave(createSave(mid,{contentVersion:'0.2.0'}),storyData).state,mid);
});
test('invalid rulesets and impossible clocks are rejected before gameplay resumes',()=>{
    const state=follow(prefix);state.clock.lastSettledDay=3;
    assert.ok(stateErrors(state,storyData).length);assert.equal(decodeSave(createSave(state),storyData).ok,false);
    state.ruleset='unknown';assert.ok(stateErrors(state,storyData).includes('未知章节规则'));
});
test('sanity zero records a crisis once without forcing a death ending',()=>{
    let state=follow(prefix);state.sanity=0;
    state=choose(state,'city3_d1_clue');assert.equal(state.flags.crisisSeen,true);assert.equal(state.currentNode,'city3_d1_n');
    const index=storyData.citizen[state.currentNode].choices.findIndex(choice=>choice.id==='city3_d1_water');
    const next=transition(state,{nodeKey:state.currentNode,choiceIndex:index},storyData);
    assert.ok(!next.events.some(event=>event.type==='crisis'));
});
