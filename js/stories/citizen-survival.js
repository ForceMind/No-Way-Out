const action=(id,text,next,effect={},condition)=>({id,text,next,effect:{...effect,advanceTime:1},...(condition?{condition,visibility:'locked'}:{})});
const work=(id,text,next,effect={},condition)=>({...action(id,text,next,effect,condition),strenuous:true});
const node=(day,period,text,choices)=>({chapter:'三日 · 灯火未熄',location:`第${day}天${period}`,text,choices});
export const citizenSurvivalData={
    city3_intro:{chapter:'三日 · 灯火未熄',location:'城南废屋',text:'你和邻居阿兰带着孩子藏进一间废屋。屋里只有两份食物、两份饮水。接下来的三天，你需要决定是寻找可靠的转移消息，还是将这里修成能遮蔽几个人的临时避难所。\n每个行动耗费一个时段，每天结束消耗一份食物与饮水。缺粮加重饥饿，缺水损伤生命；疲劳达到80时需要先休息。结局由你的准备决定。这是一段虚构的个人经历。',choices:[{id:'city3_begin',text:'留下来，与邻居共度三日',next:'city3_d1_m',effect:{startSurvival:true}}]},
    city3_d1_m:node(1,'清晨','门外安静下来。孩子问还有多少东西可以吃。阿兰说她听见有人谈起河边的一处转移点，但谁也不能确定消息是否可靠。',[
        work('city3_d1_food','寻找干粮（食物 +2，疲劳 +15）','city3_d1_n',{resources:{food:2},fatigue:15}),
        work('city3_d1_clue','向旧邻居打听消息（获得线索，疲劳 +10）','city3_d1_n',{setFlags:{clue:true},fatigue:10})]),
    city3_d1_n:node(1,'午后','楼梯下坐着一名受伤的陌生人。他知道如何修补屋顶，却已经两天没有吃东西。院里的水缸还有一些积水。',[
        work('city3_d1_water','收集并煮净积水（饮水 +2，疲劳 +15）','city3_d1_e',{resources:{water:2},fatigue:15}),
        action('city3_d1_help','分出食物，接纳伤者（食物 -1，建立互助）','city3_d1_e',{resources:{food:-1},setFlags:{helped:true},sanity:5,fatigue:10},{resources:{food:1}})]),
    city3_d1_e:node(1,'夜晚','雨水沿破窗滴进来。你可以趁夜色遮蔽修补窗洞，也可以让紧绷了一天的身体休息。今夜之后，食物和饮水都要再少一份。',[
        work('city3_d1_repair','封住窗洞（修好避难所，疲劳 +15）','city3_d2_m',{setFlags:{repaired:true},fatigue:15}),
        action('city3_d1_rest','轮流守夜并休息（疲劳 -25）','city3_d2_m',{fatigue:-25})]),
    city3_d2_m:node(2,'清晨','第二天，街口出现新的封锁。阿兰把转移消息又问了一遍：昨天只是传闻，今天仍要找到亲眼见过路线的人。屋顶也还需要查看。',[
        work('city3_d2_verify','沿昨日线索核对路线（确认转移消息，疲劳 +10）','city3_d2_n',{setFlags:{verifiedClue:true},fatigue:10},{hasFlag:'clue'}),
        work('city3_d2_witness','绕路寻找亲眼见过路线的人（确认消息，疲劳 +25）','city3_d2_n',{setFlags:{verifiedClue:true},fatigue:25}),
        work('city3_d2_repair','加固屋顶（修好避难所，疲劳 +15）','city3_d2_n',{setFlags:{repaired:true},fatigue:15}),
        action('city3_d2_rest','留下休息（疲劳 -25）','city3_d2_n',{fatigue:-25})]),
    city3_d2_n:node(2,'午后','伤者想起附近药铺后院的水井。孩子把昨天分到的干粮藏在衣袋里，问能不能也给别人一小块。你能去的地方并不多。',[
        work('city3_d2_water','去后院取水（饮水 +2，疲劳 +15）','city3_d2_e',{resources:{water:2},fatigue:15}),
        work('city3_d2_food','寻找未烧毁的粮袋（食物 +2，疲劳 +20）','city3_d2_e',{resources:{food:2},fatigue:20}),
        action('city3_d2_help','分粮照顾伤者（食物 -1，建立互助）','city3_d2_e',{resources:{food:-1},setFlags:{helped:true},sanity:5},{resources:{food:1}})]),
    city3_d2_e:node(2,'夜晚','外面的脚步越来越近。孩子缩在阿兰身旁。安慰他们不会让危险消失，但至少能让这间屋子里的声音小一些。',[
        action('city3_d2_comfort','守着孩子，安慰邻居（理智 +10，疲劳 +10）','city3_d3_m',{sanity:10,fatigue:10}),
        action('city3_d2_sleep','交班后休息（疲劳 -25）','city3_d3_m',{fatigue:-25}),
        action('city3_d2_risk','冒险穿过有枪声的街道（生命 -100）','city3_d3_m',{health:-100})]),
    city3_d3_m:node(3,'清晨','第三天的天色灰白。离开的窗口已经很窄；留下的人则需要够撑过今晚的食物。你必须把最后的体力用在最需要的地方。',[
        work('city3_d3_food','搜集最后的食物（食物 +2，疲劳 +20）','city3_d3_n',{resources:{food:2},fatigue:20}),
        work('city3_d3_water','补充路上的饮水（饮水 +2，疲劳 +15）','city3_d3_n',{resources:{water:2},fatigue:15}),
        action('city3_d3_rest','保存体力（疲劳 -25）','city3_d3_n',{fatigue:-25})]),
    city3_d3_n:node(3,'午后','阿兰问你是否已经想好去处。伤者可以帮忙封住入口，也可以为你画出他知道的巷道。你只能再做一件事。',[
        action('city3_d3_rest2','休息，等待夜色（疲劳 -25）','city3_d3_e',{fatigue:-25}),
        work('city3_d3_repair','封住最后一个入口（修好避难所，疲劳 +10）','city3_d3_e',{setFlags:{repaired:true},fatigue:10}),
        work('city3_d3_verify','再次核对巷道（确认消息，疲劳 +15）','city3_d3_e',{setFlags:{verifiedClue:true},fatigue:15})]),
    city3_d3_e:node(3,'夜晚','第三个夜晚到了。你将剩下的东西分开打包，让每个人知道接下来要做什么。屋里的灯被遮住，只剩孩子掌心里的一点暖意。',[
        action('city3_d3_prepare','轮流休息，作最后准备（疲劳 -20）','city3_decision',{fatigue:-20})]),
    city3_decision:{chapter:'三日 · 灯火未熄',location:'最后的决定',text:'三天已经过去。准备充分不能保证明天的安全，但它让此刻的选择有了依据。你看着邻居、孩子和伤者，决定下一步。',choices:[
        {id:'city3_transfer',text:'带邻居和孩子沿核实的路线转移',next:'city3_ending_transfer',condition:{flags:{verifiedClue:true},minHealth:30,maxFatigue:79,resources:{water:1}},effect:{resources:{water:-1}},visibility:'locked'},
        {id:'city3_shelter',text:'与互助的人守住修好的避难所',next:'city3_ending_shelter',condition:{flags:{helped:true,repaired:true},minSanity:20,resources:{food:1}},effect:{resources:{food:-1}},visibility:'locked'},
        {id:'city3_wait',text:'没有准备好，只能继续躲藏',next:'city3_ending_loss'}]},
    city3_ending_transfer:{ending:{title:'灯火未熄 · 转移',kind:'transfer'},text:'你们把仅剩的饮水带在身上，沿已经核实的巷道走向另一间藏身的屋子。途中阿兰一直握着孩子的手。天快亮时，你终于能靠着墙坐下。危险没有结束，但你们带着彼此走过了这三天。',choices:[]},
    city3_ending_shelter:{ending:{title:'灯火未熄 · 相守',kind:'shelter'},text:'你决定留下。伤者撑着受伤的腿守住入口，阿兰照看孩子，你把最后一份食物分进几只碗里。修补过的屋顶挡住了雨。这间废屋还不是安全的家，但在第三个夜晚，你们没有让任何一个人独自面对黑暗。',choices:[]},
    city3_ending_loss:{ending:{title:'灯火未熄 · 困守',kind:'loss'},text:'伤势、匮乏或迟疑让你失去了转移的机会。你们只能更深地躲进废屋，等待一个无法保证到来的消息。孩子不再问什么时候可以出去。屋外的声音仍在继续，三天的选择留在你记忆里。',choices:[]}
};
