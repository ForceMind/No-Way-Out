const fields=['id','title','contact','place','goal','tool','item','informant','evidence','route','alternate','destination','helper','dependent','recipient','obstacle','danger','endingTitle','ending','opening'];
/** Compact authored rows keep all names, objectives and closure text reviewable. */
export function mission(values) {
    const result=Object.fromEntries(fields.map((field,index)=>[field,values[index]]));
    for(const field of fields)if(!result[field])throw new Error(`任务字段缺失：${result.id}.${field}`);
    return {...result,
        preparation:`${result.contact}提醒你，${result.tool}是处理${result.obstacle}的关键，${result.item}则必须完整交到${result.recipient}手里。`,
        information:`消息关系到${result.destination}是否仍接收${result.dependent}。关于${result.evidence}，说得肯定的人不一定看过实物。`,
        travel:`${result.route}有遮挡却要绕远，${result.alternate}省路但更容易碰上${result.danger}。`,
        encounter:`${result.dependent}不能独自完成剩下的一段路；${result.helper}也没有多余的物资。`,
        handoff:`对方要你说清${result.evidence}的来源，以及${result.dependent}是否已经有人照应。`,
        lastRisk:`如果工具或消息不可靠，硬做可能伤到自己，也可能拖累${result.dependent}。你仍可以先照顾人，或中止任务。`,
        resolution:`${result.destination}里的等待不会永远继续。${result.contact}需要的是实际结果，而不是你承诺得多么坚定。`
    };
}
