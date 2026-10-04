export const SURVIVAL_RULESET='survival-v1';
const clamp=value=>Math.max(0,Math.min(100,value));
export function beginSurvival(state) {
    return {...structuredClone(state),ruleset:SURVIVAL_RULESET,resources:{food:2,water:2},hunger:0,fatigue:0,clock:{day:1,period:0,lastSettledDay:0,finished:false}};
}
/** A settlement is keyed by day. Loading/rendering never calls this function. */
export function settleDay(state,day) {
    const next=structuredClone(state);const events=[];
    if (day<=next.clock.lastSettledDay) return {state:next,events};
    if (next.resources.food>0) {next.resources.food--;next.hunger=clamp(next.hunger-15);}
    else {next.hunger=clamp(next.hunger+20);events.push({type:'survival',message:'食物耗尽，饥饿加重'});}
    if (next.resources.water>0) next.resources.water--;
    else {next.health=clamp(next.health-5);next.fatigue=clamp(next.fatigue+15);events.push({type:'survival',message:'缺少饮水，生命减少 5，疲劳增加 15'});}
    if(next.hunger>=40){next.health=clamp(next.health-10);events.push({type:'survival',message:'持续饥饿，生命减少 10'});}
    next.clock.lastSettledDay=day;
    events.push({type:'time',message:`第 ${day} 天结束：消耗每日食物与饮水`});
    return {state:next,events};
}
export function advanceTime(state,amount=1) {
    if(state.ruleset!==SURVIVAL_RULESET || !state.clock) return {ok:false,reason:'此章节未启用生存时间规则'};
    if(state.clock.finished) return {ok:false,reason:'三日行动已经结束'};
    let next=structuredClone(state);const events=[];
    for(let i=0;i<amount;i++){
        if(next.clock.finished) return {ok:false,reason:'行动超出章节时间'};
        next.hunger=clamp(next.hunger+5);next.clock.period++;
        if(next.clock.period===3){const result=settleDay(next,next.clock.day);next=result.state;events.push(...result.events);if(next.clock.day===3){next.clock.finished=true;next.clock.period=2;}else{next.clock.day++;next.clock.period=0;}}
    }
    return {ok:true,state:next,events};
}
