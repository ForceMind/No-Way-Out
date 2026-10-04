/** Six continuous chapters. Every scene is a consequential, multi-option decision. */
export const CAMPAIGN_DECISIONS=208;
const scenes=m=>[
 ['约定',`${m.contact}在${m.place}等你。${m.opening}目标是${m.goal}。`,[`列出${m.item}的交接顺序`,`追问${m.contact}尚未说出的困难`,`先听${m.dependent}的要求`,'保留一份备用物资']],
 ['清点',`${m.item}和其他东西堆在一起，不能凭外观判断缺了什么。`,[`按用途重新分装${m.item}`,'逐件记录缺口',`替${m.helper}清点随身东西`,'回收无人认领的空包']],
 ['工具',`${m.tool}关系到${m.obstacle}，借出的东西却未必会归还。`,[`备妥${m.tool}`,`查验${m.tool}的损耗`,`把${m.tool}先借给${m.helper}`,'收好备用零件']],
 ['归属',`有人说${m.item}应该留给原来的主人。${m.contact}不能替那个人作决定。`,['与主人商定暂借期限','核查原先的登记',`让${m.dependent}先拿所需的一份`,'留下一份东西作押']],
 ['容量',`包裹变重，带走更多东西会拖慢去${m.destination}的行程。`,[`给${m.item}换轻便包裹`,'记录丢弃物品的位置',`替${m.helper}分担重量`,'只带够用的东西']],
 ['消息',`${m.informant}提起${m.evidence}，其中一部分只是转述。`,['按可靠的部分调整安排',`核实${m.evidence}的时间来源`,'提醒等候者不要信传闻','暂不交换尚未核实的东西']],
 ['见证',`另一人的说法与${m.informant}对不上，你只能先确认一件事。`,['确认交接点仍有人','寻找第二个独立见证',`确认${m.dependent}有人照应`,'寻找可以退回的地点']],
 ['登记',`纸上写着${m.destination}，但字迹被水洇开了。`,['另抄一份交接位置','对照原件辨认模糊处','替不会写字的人留下名字','保存纸张等以后再补']],
 ['隐私',`有人要求公开${m.dependent}的姓名，声称这样方便找人。`,['只给接收者必要信息','询问索要名单的理由',`先征得${m.dependent}同意`,'把副本留在出发点']],
 ['分配',`${m.helper}想多带一份${m.item}，现有储备无法满足每个人。`,['按这趟任务重新分配','记下各人的领取数','把自己的份额让给弱者','保留应急份额']],
 ['启程',`${m.route}有遮挡，${m.alternate}更短；${m.danger}使原先的安排不再可靠。`,[`沿${m.route}分段前行`,'先观察两个路口',`跟着${m.helper}共同出发`,'等人群过去再走']],
 ['路标',`转角的标记被遮住，后面的人可能走向${m.alternate}。`,['补一道清楚的路标','辨认标记是谁留下的','留在转角接应同行者','把多余的标记收回']],
 ['声音',`墙外传来的声响无法辨明，${m.helper}停住脚步。`,['改走已有遮挡的通道','观察声音来自哪边','扶住受惊的同行者','留在门内恢复体力']],
 ['通行',`通道一次只能过一个人，${m.item}卡在门槛上。`,['重新打包后逐件传递','确认另一端是否有人接应',`先扶${m.dependent}过去`,'取下碍事的备用物件']],
 ['岔路',`一名路人指向另一条通道，却说不清是否通往${m.destination}。`,['沿原先确认的路继续','问清他最近经过的时间','让同行者一起商量','在原处等下一条消息']],
 ['失物',`包裹上少了一根扎绳，回头找可能耽误交接。`,['用布条重新固定','查验其他东西是否也少了','替同行者检查松开的包裹','用备用绳避免折返']],
 ['求助',`${m.helper}护着${m.dependent}，需要有人腾出手。`,['把物件集中后腾出一只手','询问具体需要哪种协助',`替${m.dependent}承担一段路`,'找一处能坐下的门廊']],
 ['伤势',`一处擦伤开始渗血，继续走会弄脏${m.item}。`,['固定包裹，隔开伤口','检查伤势是否正在加重','帮助同行者包扎','停下清理自己的伤口']],
 ['等候',`${m.recipient}还没出现，等候的人担心约定已经失效。`,['分出人手守住交接点','核对约定的时间','向等候者说明目前进展','保存物资，不另作承诺']],
 ['口信',`一个孩子带来一句口信，却没记住传话人的名字。`,['把可确认的部分写下来','复问原话而不是推测意思','陪孩子回到熟悉的人身边','留出一份东西等核实后再交']],
 ['对照',`${m.recipient}终于来到${m.destination}，先要知道${m.evidence}的来源。`,['按顺序说明这趟经过',`出示已核对的${m.evidence}`,'让同行者补充自己的经历','说明准备不足的部分']],
 ['差额',`接收者发现${m.item}的数量和早先的口信不一致。`,['调整交接量，不掩盖缺口','逐项对照领取记录','先满足最急需的人','保留一份避免再次短缺']],
 ['责任',`谁负责下一段尚未说定，${m.contact}不能一直等下去。`,['承担明确的一项工作','写清各人的责任边界','协助能力不足的接收者','留下交接记录后收回余物']],
 ['分歧',`${m.helper}认为应该先救急，${m.recipient}坚持完成原定任务。`,['拆成两项可落实的安排','核对两边说法的依据',`支持${m.dependent}先得到照应`,'保留自己的应急份额']],
 ['障碍',`现在必须处理${m.obstacle}。${m.lastRisk}`,`用${m.tool}尝试已准备的办法|核查障碍与先前消息是否一致|先把${m.dependent}安置妥当|撤回不能安全使用的东西`.split('|')],
 ['试行',`办法刚开始奏效，旁边的人却催你把所有${m.item}都交出去。`,['先完成一小份，再扩大交接','检验第一份的实际结果','让最需要的人先试用','留住备用份额']],
 ['承认',`有一处问题不是靠${m.tool}就能解决。隐瞒会把责任推给后来的人。`,['明确问题并修改安排','记录无法证实的部分','向受影响的人说明情况','中止这一部分并回收物件']],
 ['补缺',`${m.destination}里还有一处无人照管的缺口。`,['安排剩下的物件补缺','确认缺口是否已被登记','留下来协助等候的人','只留下够用的部分']],
 ['回报',`${m.contact}等待回音；有的人只想听好消息。`,['逐项报告已经完成的事','带回可以复查的记录','报告仍需要援助的人','明确哪些资源尚未交出']],
 ['交班',`如果你离开${m.destination}，接手的人需要知道下一步怎么办。`,['交代工具与物件的用法','留下记录和查验办法','陪接手者做完第一次安排','收起属于自己的剩余物资']],
 ['告别',`${m.dependent}问你是否还会回来。没有人能保证下一段路的安全。`,['约定一个力所能及的回访','留下能辨认的联系记号','陪对方多坐一会儿','说明自己必须先安顿下来']],
 ['收尾',`${m.resolution}这一章即将结束，剩下的东西和未完成的事都要有人记住。`,['整理可继续执行的安排','封存核实过的记录','把照应人的工作交清楚','带回可以留给下一章的物资']]
];
const types=['work','proof','care','reserve'];
export function buildExpansion(identity,profile) {
 const root=`campaign_${identity}`,nodes={};
 const add=(key,step,chapter,text,actions)=>{
  nodes[key]={chapter:`${profile.title} · ${chapter}`,location:profile.base,campaign:{step},text,choices:actions.map((a,i)=>({id:`${key}_${i}`,text:a.text,next:a.next,effect:a.effect??{},outcome:a.outcome,...(a.lockReason?{lockReason:a.lockReason}:{}),...(a.condition?{condition:a.condition,visibility:'locked'}:{})}))};
 };
 const first=`${root}_0_0`;
 add(`${root}_start`,0,'序章',`${profile.intro}\n\n六份托付连成一段路。你要走完所有章节，才能知道自己最终把什么留给了别人。`,[
  {text:'承担筹备，先清点可以使用的物资',next:first,effect:{resources:{kit:3,work:1}},outcome:'你接下筹备的责任，多留了三份备用物资。'},
  {text:'先听大家的处境，再和他们一起出发',next:first,effect:{resources:{care:2,proof:1}},outcome:'你记下了大家的困难，出发的安排由共同的需要决定。'}]);
 profile.missions.forEach((m,c)=>{
  const chapter=`第 ${c+1} 章 · ${m.title}`;
  scenes(m).forEach(([label,text,actions],s)=>{
   const key=`${root}_${c}_${s}`,next=s===31?`${root}_${c}_handoff`:`${root}_${c}_${s+1}`;
   add(key,1+c*33+s,chapter,`${label}：${text}`,actions.map((text,i)=>({text,next,effect:{resources:i===0?{work:1,chapterWork:1}:i===1?{proof:1,chapterProof:1}:i===2?{care:1,kit:-1}:{kit:1},...(i===2?{health:-1}:i===3?{health:2}:{}),setFlags:Object.fromEntries(types.map((type,j)=>[`${root}_previous_${type}`,j===i]))},condition:i===2?{minHealth:2,resources:{kit:1}}:undefined,outcome:`你选择了「${text}」。`+[`你把${m.goal}向前推进了一步，但没有额外照顾等候的人。`,`你补了一项可复查的依据，${m.evidence}的来路更清楚了。`,`你让需要照应的人少承担了一段困难，自己的储备减少了。`,'你保住了一份物资并恢复了体力，这一处工作留给后来的人。'][i]})));
   nodes[key].variants=types.map(type=>({condition:{hasFlag:`${root}_previous_${type}`},text:{work:`上一步落实了工作，${m.contact}继续等待接下来的安排。`,proof:`你已经核对过上一处疑点；${m.recipient}需要知道这些记录如何保存。`,care:`上一处求助得到了回应，${m.helper}提醒你别把自己的体力用尽。`,reserve:'你保留了余力，但有些事情还没有做完。'}[type]}));
  });
  const next=c===5?`${root}_epilogue_0`:`${root}_${c+1}_0`;
  add(`${root}_${c}_handoff`,33+c*33,chapter,`${m.contact}要你为「${m.title}」留下一个明确的交接结果。是否完成任务，决定最后能否以它作为今后的立足之处。`,[
   {text:`落实「${m.title}」的后续工作并交付核验记录`,next,condition:{resources:{chapterWork:5,chapterProof:3}},effect:{endCampaignChapter:true,setFlags:{[`${root}_done_${c}`]:true}},outcome:`${m.goal}有了可接续的安排；结局中可以选择回到这份工作。`},
   {text:'把未完成的部分交给互助者，不宣称任务完成',next,effect:{endCampaignChapter:true,resources:{care:2},setFlags:{[`${root}_done_${c}`]:false}},outcome:'你没有把互助等同于原定任务成功，仍需在下一章继续寻找出路。'},
   {text:'带回剩余物资，留下尚未完成的记录',next,effect:{endCampaignChapter:true,resources:{kit:2},setFlags:{[`${root}_done_${c}`]:false}},outcome:'你选择保留余力，交接记录明确标出了未竟之事。'}]);
 });
 const epilogues=[['回望','六章中的人和物件不会因你离开就消失。你只能决定先回应哪一项。'],['存放','剩余物资需要放在有人能找到的地方，也可能因此不再属于你。'],['名单','有的人不愿公开名字，有的人怕被遗忘。记录需要征得同意。'],['去向','消息已经过时，你要判断仍可使用哪一部分，而不是假定目的地永久安全。'],['边界','几份工作都希望你留下。你的体力不足以同时承担全部责任。'],['同行','继续上路的人正在会合；留下的人也需要接替的帮手。'],['底线','有人提出一条没有核实、也没有接应的捷径。这一次风险会影响最后的去向。'],['最后准备','告别前还可以整理一次记录或物资，选择以后要承担的生活。']];
 epilogues.forEach(([title,text],s)=>add(`${root}_epilogue_${s}`,199+s,'尾声',`${title}：${text}`,types.map((type,i)=>({text:[`落实${profile.missions[s%6].title}的接续工作`,'再核实一次记录和去向','把余力留给互相照应的人','留住物资，准备独自转移'][i],next:s===7?`${root}_decision`:`${root}_epilogue_${s+1}`,effect:{resources:i===0?{work:1,chapterWork:1}:i===1?{proof:1}:i===2?{care:2,kit:-1}:{kit:1},...(s===6?{setFlags:{[`${root}_unprotected`]:i===3}}:{}),...(i===3?{health:2}:{})},condition:i===2?{minHealth:2,resources:{kit:1}}:undefined,outcome:s===6&&i===3?'你没有核实接应，带着物资独自转移。这条路可能导致失散。':['你安排了下一位接手者。','你把未证实的传言从记录中剔除。','你给共同照应的人留下了一份物资。','你保住了自己的备用物资。'][i]}))));
 const finales=profile.missions.map((m,c)=>({kind:m.id,title:m.endingTitle,text:`你走过了六份托付，最后选择以「${m.title}」的后续工作作为今后的责任。${m.ending}`,condition:{hasFlag:`${root}_done_${c}`},lockReason:`需要先落实「${m.title}」的章节交接`}));
 finales.push({kind:'guard',title:'相互照应',text:profile.endings.guard,condition:{resources:{care:40}}},{kind:'return',title:'带回未竟之事',text:profile.endings.return},{kind:'loss',title:'代价与失散',text:profile.endings.loss,condition:{hasFlag:`${root}_unprotected`},lockReason:'需要先选择未经核实且无人接应的去向'});
 add(`${root}_decision`,207,'最终抉择','你已经走完六章。哪些承诺兑现、记录是否可靠、谁得到照应，都决定哪些生活还可能继续。请选择你最终承担的去向。',finales.map(f=>({text:`选择「${f.title}」`,next:`${root}_ending_${f.kind}`,condition:f.condition,lockReason:f.lockReason,effect:f.kind==='loss'?{health:-25}:{},outcome:f.text})));
 finales.forEach(f=>{nodes[`${root}_ending_${f.kind}`]={chapter:profile.title,campaign:{step:208},ending:{title:`${profile.title} · ${f.title}`,kind:f.kind},text:f.text,choices:[]};});
 return {nodes,entry:{id:`${root}_enter`,text:`进入完整长篇：${profile.title}（208 次决策）`,next:`${root}_start`,effect:{startCampaign:true}}};
}
