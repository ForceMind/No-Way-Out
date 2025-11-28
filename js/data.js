export const identities = ["市民","难民","学生","教师","医生","商人","农夫","地下党员","孤儿","修女","流浪汉","车夫"];

export const identityDialogues = {
  "市民": "你是南京的普通市民，日军的铁蹄践踏了你的家园。",
  "难民": "你背井离乡，带着一家老小逃到南京城，却发现此处更危险。",
  "学生": "你是中央大学的学生，书本无法告诉你该如何面对眼前的屠戮。",
  "教师": "作为教师，你想保护学生，但力量显得渺小。",
  "医生": "你是城里的医生，满目疮痍让你不得不选择去救谁。",
  "商人": "你曾经富有，但财富换不来安全。",
  "农夫": "你是乡下的农夫，被逼进城找寻生路。",
  "地下党员": "你是地下工作者，使命是传递情报与救人。",
  "孤儿": "你无家可归，只能在废墟中寻找生存的机会。",
  "修女": "你在教堂里避难，想为弱者提供庇护。",
  "流浪汉": "你无处可去，只能在废墟间寻找残羹冷炙。",
  "车夫": "你拉着破车，载着希望与恐惧穿行于城中。"
};

export const dialogues = {
  市民: {
    start: { text: "邻居：城中已不再安全，你要去哪里避难？", choices: [ {text:"去防空洞", next:"shelter"}, {text:"去教堂避难", next:"church"}, {text:"留在家中", next:"home"}, {text:"去亲戚家", next:"relative1"} ] },

    // 亲戚家分支
    relative1: { text: "你来到亲戚家，但发现家里没人，物资也所剩无几。", choices: [ {text:"翻找食物", next:"relative_food"}, {text:"上街寻找", next:"street1"}, {text:"继续等待", next:"relative_wait"} ] },
    relative_food: { text: "你找到一些干粮和一壶水。要不要再搜搜？", choices: [ {text:"继续搜寻", next:"relative_more"}, {text:"拿走现有食物", next:"relative_leave", effect: {addItem: "干粮", health: 10}} ] },
    relative_more: { text: "你翻开柜子，发现一张藏有暗门的地板。", choices: [ {text:"打开暗门", next:"relative_secret"}, {text:"不碰它", next:"relative_leave"} ] },
    relative_secret: { text: "暗门下面有些旧钱币和一把生锈的小刀。要拿走吗？", choices: [ {text:"拿走", next:"relative_leave", effect: {addItem: "小刀"}}, {text:"不拿", next:"relative_leave"} ] },
    relative_leave: { text: "你背上物资，天色渐暗。", choices: [ {text:"在亲戚家休息一晚", next:"relative_rest", effect: {health: 20}}, {text:"直接离开", next:"street1"}, {text:"寻找长期避难所", next:"survival_start"} ] },
    relative_rest: { text: "你睡得很不安稳，半夜听到敲门声。", choices: [ {text:"开门看看", next:"relative_open"}, {text:"继续装睡", next:"relative_hide"} ] },
    relative_open: { text: "门外是一名陌生难民，他请求留宿。", choices: [ {text:"允许他进来", next:"relative_guest"}, {text:"拒绝", next:"relative_hide"} ] },
    relative_guest: { text: "他和你分享了外面的情报：东门晚上有漏洞。", choices: [ {text:"前往东门", next:"east1"}, {text:"等待天亮", next:"relative_escape"} ] },
    relative_wait: { text: "夜里传来日军的脚步声。", choices: [ {text:"继续躲藏", next:"relative_hide"}, {text:"翻墙逃走", next:"street1"} ] },
    relative_hide: { text: "你屏住呼吸，日军翻找屋子但未发现你。", choices: [ {text:"等他们离开", next:"relative_escape"}, {text:"突然冲出", next:"ending_caught1"} ] },
    relative_escape: { text: "天亮后，你决定下一步行动。", choices: [ {text:"去教堂", next:"church"}, {text:"去防空洞", next:"shelter"}, {text:"上街", next:"street1"} ] },

    // 防空洞分支
    shelter: { text: "防空洞里挤满了人，空气混浊。你是继续待下去还是出去？", choices: [ {text:"继续待下去", next:"shelter_wait"}, {text:"离开", next:"street1"}, {text:"四处打听消息", next:"shelter_rumor"} ] },
    shelter_rumor: { text: "有人说北门昨晚有人逃出去。你要相信吗？", choices: [ {text:"去北门", next:"north1"}, {text:"留在防空洞", next:"shelter_wait"} ] },
    north1: { text: "北门戒备森严，但有一条小巷通往后方。", choices: [ {text:"潜行小巷", next:"north_sneak"}, {text:"回头", next:"street2"} ] },
    north_sneak: { text: "你踩到碎石发出响声，一名士兵转头。", choices: [ {text:"藏身墙角", next:"north_hide"}, {text:"冲过去", next:"ending_caught1"} ] },
    north_hide: { text: "你屏住呼吸，士兵没有发现你。", choices: [ {text:"沿小巷前进", next:"north_escape"}, {text:"返回", next:"street2"} ] },
    north_escape: { text: "小巷通向一条河沟，可能通向城外。", choices: [ {text:"顺河沟走", next:"ending_escape_river"}, {text:"返回", next:"street2"} ] },
    shelter_wait: { text: "一位老人咳嗽不停，你要帮他吗？", choices: [ {text:"递水", next:"help_old", condition: {hasItem: "水"}}, {text:"无视", next:"ignore_old"} ] },
    help_old: { text: "老人感激地告诉你西门有秘密通道，并塞给你一块怀表。", choices: [ {text:"去西门", next:"west1", effect: {addItem: "怀表"}}, {text:"留下", next:"shelter_stay"} ] },
    ignore_old: { text: "轰炸声逼近，防空洞震动。", choices: [ {text:"继续待下去", next:"shelter_shake"}, {text:"逃出", next:"street1"} ] },
    shelter_shake: { text: "防空洞入口塌陷。你要挖出口吗？", choices: [ {text:"尝试挖出口", next:"dig_exit"}, {text:"等待救援", next:"ending_dead1"} ] },
    shelter_stay: { text: "空气愈加稀薄。", choices: [ {text:"尝试挖出口", next:"dig_exit"}, {text:"等待救援", next:"ending2"} ] },
    dig_exit: { text: "你找到裂缝通向外面。", choices: [ {text:"去河边", next:"river1"}, {text:"去西门", next:"west1"} ] },

    // 街道与巡逻分支
    street1: { text: "街上有日军巡逻，你要怎么做？", choices: [ {text:"躲藏", next:"hide1"}, {text:"假装镇定走过", next:"pass1"}, {text:"沿小路绕行", next:"street3"} ] },
    street3: { text: "小路杂草丛生，你踩到铁罐发出声响。", choices: [ {text:"躲在草丛", next:"hide_grass"}, {text:"快速离开", next:"street2"} ] },
    hide_grass: { text: "士兵巡逻过来，几乎踩到你。你准备怎么办？", choices: [ {text:"屏住呼吸", next:"hide_grass2"}, {text:"投掷石头引开", next:"hide_grass_stone"} ] },
    hide_grass2: { text: "士兵停顿片刻然后离开，你出了一身冷汗。", choices: [ {text:"继续前行", next:"street2"}, {text:"等更久再走", next:"street2_wait"} ] },
    hide_grass_stone: { text: "石头吸引了士兵的注意力，他们走向另一边。", choices: [ {text:"趁机离开", next:"street2"}, {text:"再等一会儿", next:"street2_wait"} ] },
    street2_wait: { text: "你又等了几分钟，夜色更深，街道更安静。", choices: [ {text:"继续走向三岔口", next:"street2"}, {text:"回头", next:"street1"} ] },

    pass1: { text: "日军对你投来怀疑的目光，你要怎么办？", choices: [ {text:"加快脚步", next:"pass2"}, {text:"走进小巷", next:"street2"} ] },
    pass2: { text: "你加快了脚步，士兵大声喝令你停下。", choices: [ {text:"解释自己是百姓", next:"pass_explain"}, {text:"继续跑", next:"ending_caught1"} ] },
    pass_explain: { text: "士兵狐疑地打量你。", choices: [ {text:"低头赔笑", next:"street2"}, {text:"掏钱贿赂", next:"pass_bribe", condition: {hasItem: "钱币"}} ] },
    pass_bribe: { text: "你递出一些钱币，士兵将你赶走。", choices: [ {text:"赶快离开", next:"street2"} ] },

    hide1: { text: "你躲进废墟，一名小孩哭了。你帮他吗？", choices: [ {text:"安抚小孩", next:"help_child"}, {text:"离开", next:"leave_child"} ] },
    help_child: { text: "小孩告诉你教堂安全，还给了你一块干面包。", choices: [ {text:"去教堂", next:"church"}, {text:"继续前行", next:"street2", effect: {addItem: "干面包"}} ] },
    leave_child: { text: "你甩开小孩，继续走。前面有士兵拦路。", choices: [ {text:"绕路", next:"street2"}, {text:"硬闯", next:"ending_caught1"} ] },
    street2: { text: "前面分三条路：东门、西门、河边。", choices: [ {text:"去东门", next:"east1"}, {text:"去西门", next:"west1"}, {text:"去河边", next:"river1"} ] },

    // 生存循环模式 (增加长度)
    survival_start: { text: "你暂时找到了一个安全的废弃小屋。接下来的日子，你必须想办法活下去。", choices: [ {text:"开始第一天", next:"day1_morning"} ] },
    
    day1_morning: { text: "第一天清晨。寒风刺骨，你感到饥饿。", choices: [ {text:"外出寻找食物", next:"day1_search_food"}, {text:"在屋内休息", next:"day1_rest"} ] },
    day1_search_food: { text: "你在附近的垃圾堆里翻找。", choices: [ {text:"找到半个馒头", next:"day1_noon", effect: {addItem: "馒头", health: 5}}, {text:"一无所获", next:"day1_noon", effect: {health: -5}} ] },
    day1_rest: { text: "你缩在角落里减少消耗。", choices: [ {text:"等待中午", next:"day1_noon", effect: {health: 5}} ] },
    
    day1_noon: { text: "中午时分，远处传来枪声。", choices: [ {text:"查看情况", next:"day1_event"}, {text:"保持安静", next:"day1_night"} ] },
    day1_event: { text: "你看到一队难民被押送。", choices: [ {text:"试图解救", next:"ending_caught1"}, {text:"忍痛无视", next:"day1_night", effect: {health: -5}} ] },
    
    day1_night: { text: "夜幕降临，气温骤降。", choices: [ {text:"生火取暖", next:"day1_fire"}, {text:"裹紧衣服睡觉", next:"day2_morning"} ] },
    day1_fire: { text: "火光温暖了你，但也可能引来敌人。", choices: [ {text:"熄灭火堆", next:"day2_morning"}, {text:"继续取暖", next:"ending_caught1"} ] },

    day2_morning: { text: "第二天清晨。你还活着，但身体更加虚弱。", choices: [ {text:"去河边取水", next:"day2_water"}, {text:"去教堂求助", next:"church"} ] },
    day2_water: { text: "河水冰冷刺骨。", choices: [ {text:"喝生水", next:"day2_sick", effect: {health: -10}}, {text:"带水回去烧开", next:"day2_noon", effect: {addItem: "水"}} ] },
    day2_sick: { text: "你喝坏了肚子，身体极度虚弱。", choices: [ {text:"休息", next:"day2_noon"} ] },
    day2_noon: { text: "中午，一名伤兵爬到了你门口。", choices: [ {text:"救助他", next:"day2_help_soldier"}, {text:"赶走他", next:"day2_alone"} ] },
    day2_help_soldier: { text: "你用仅有的物资救了他，他给了你一把手枪后死去了。", choices: [ {text:"拿走手枪", next:"day3_morning", effect: {addItem: "手枪"}} ] },
    day2_alone: { text: "你独自一人，内心备受煎熬。", choices: [ {text:"熬过这一天", next:"day3_morning"} ] },

    day3_morning: { text: "第三天。全城大搜捕开始了。", choices: [ {text:"躲进地窖", next:"day3_hide"}, {text:"尝试突围", next:"street2"} ] },
    day3_hide: { text: "地窖里阴暗潮湿，你听到头顶的脚步声。", choices: [ {text:"屏住呼吸", next:"day3_safe"}, {text:"咳嗽", next:"ending_caught1"} ] },
    day3_safe: { text: "脚步声远去。你又活过了一劫。", choices: [ {text:"继续苟活", next:"day4_morning"} ] },

    day4_morning: { text: "第四天。连日的饥饿让你头晕眼花。", choices: [ {text:"搜寻隔壁废墟", next:"day4_search"}, {text:"喝水充饥", next:"day4_water", effect: {health: -2}} ] },
    day4_search: { text: "你在废墟中找到半瓶发霉的酒。", choices: [ {text:"喝掉暖身", next:"day4_drunk", effect: {health: 5, sanity: -5}}, {text:"留着消毒", next:"day4_noon", effect: {addItem: "酒精"}} ] },
    day4_water: { text: "水只能暂时缓解胃痛。", choices: [ {text:"休息", next:"day4_noon"} ] },
    day4_drunk: { text: "酒精让你暂时忘记了恐惧，但也让你反应迟钝。", choices: [ {text:"摇晃着睡去", next:"day4_noon"} ] },
    day4_noon: { text: "中午，外面下起了冻雨。", choices: [ {text:"接雨水", next:"day4_rain", effect: {addItem: "雨水"}}, {text:"堵住窗户缝隙", next:"day4_fix"} ] },
    day4_rain: { text: "你接了一些雨水，虽然浑浊但很珍贵。", choices: [ {text:"等待雨停", next:"day4_night"} ] },
    day4_fix: { text: "你用破布堵住了漏风的窗户，屋内稍微暖和了一点。", choices: [ {text:"休息", next:"day4_night", effect: {health: 2}} ] },
    day4_night: { text: "雨夜格外寂静，只有远处的狗叫声。", choices: [ {text:"睡觉", next:"day5_morning"} ] },

    day5_morning: { text: "第五天。你发现存粮已经耗尽。", choices: [ {text:"冒险去远处的商店", next:"day5_shop"}, {text:"在附近挖草根", next:"day5_grass"} ] },
    day5_shop: { text: "你来到一家被洗劫过的商店，货架空空如也。", choices: [ {text:"撬开柜台", next:"day5_counter"}, {text:"去仓库", next:"day5_warehouse"} ] },
    day5_counter: { text: "柜台下有一盒火柴。", choices: [ {text:"拿走", next:"day5_noon", effect: {addItem: "火柴"}} ] },
    day5_warehouse: { text: "仓库里有一只死老鼠。", choices: [ {text:"带回去吃", next:"day5_eat_rat", effect: {addItem: "死老鼠"}}, {text:"恶心离开", next:"day5_noon"} ] },
    day5_grass: { text: "你在墙角挖到一些植物根茎。", choices: [ {text:"生吃", next:"day5_sick", effect: {health: -5}}, {text:"煮熟吃", next:"day5_noon", effect: {health: 2}} ] },
    day5_eat_rat: { text: "你烤了老鼠肉，虽然难吃但补充了体力。", choices: [ {text:"休息", next:"day5_noon", effect: {health: 10}} ] },
    day5_sick: { text: "根茎有毒，你上吐下泻。", choices: [ {text:"忍耐", next:"day5_noon", effect: {health: -10}} ] },
    day5_noon: { text: "中午，你听到有人在敲你的门。", choices: [ {text:"不开门", next:"day5_ignore"}, {text:"询问是谁", next:"day5_ask"} ] },
    day5_ignore: { text: "敲门声持续了一会儿消失了。", choices: [ {text:"松了一口气", next:"day5_night"} ] },
    day5_ask: { text: "门外是一个乞讨的老人。", choices: [ {text:"分他一点食物", next:"day5_help_old", condition: {hasItem: "馒头"}}, {text:"赶走他", next:"day5_night"} ] },
    day5_help_old: { text: "老人感激地给了你一块玉佩。", choices: [ {text:"收下", next:"day5_night", effect: {addItem: "玉佩", removeItem: "馒头"}} ] },
    day5_night: { text: "这一天又过去了。", choices: [ {text:"睡觉", next:"day6_morning"} ] },

    day6_morning: { text: "第六天。你感到身体越来越沉重。", choices: [ {text:"坚持锻炼", next:"day6_exercise"}, {text:"躺着不动", next:"day6_rest"} ] },
    day6_exercise: { text: "你做了一些简单的活动，身体暖和了些。", choices: [ {text:"休息", next:"day6_noon", effect: {health: 2}} ] },
    day6_rest: { text: "你躺了一上午，感觉四肢僵硬。", choices: [ {text:"起来活动", next:"day6_noon"} ] },
    day6_noon: { text: "中午，日军开始挨家挨户搜查。", choices: [ {text:"躲进衣柜", next:"day6_closet"}, {text:"躲到床底", next:"day6_bed"} ] },
    day6_closet: { text: "士兵踢开了门，在屋里翻找。", choices: [ {text:"屏息凝神", next:"day6_safe"} ] },
    day6_bed: { text: "士兵的靴子就在你眼前晃动。", choices: [ {text:"闭上眼睛", next:"day6_safe"} ] },
    day6_safe: { text: "士兵骂骂咧咧地离开了。", choices: [ {text:"出来", next:"day6_night"} ] },
    day6_night: { text: "经历了白天的惊吓，你难以入眠。", choices: [ {text:"强迫自己睡", next:"day7_morning"} ] },

    day7_morning: { text: "第七天。你开始出现幻觉。", choices: [ {text:"自言自语", next:"day7_talk"}, {text:"写遗书", next:"day7_write"} ] },
    day7_talk: { text: "你对着空气说话，仿佛家人就在身边。", choices: [ {text:"哭泣", next:"day7_noon", effect: {sanity: -5}} ] },
    day7_write: { text: "你写下了对家人的思念。", choices: [ {text:"收好遗书", next:"day7_noon", effect: {addItem: "遗书"}} ] },
    day7_noon: { text: "中午，你听到外面有广播声。", choices: [ {text:"出去听", next:"day7_listen"}, {text:"不理会", next:"day7_ignore"} ] },
    day7_listen: { text: "广播里播放着虚假的‘亲善’宣传。", choices: [ {text:"愤怒地回屋", next:"day7_night"}, {text:"感到绝望", next:"day7_night", effect: {sanity: -5}} ] },
    day7_ignore: { text: "你不想听那些谎言。", choices: [ {text:"休息", next:"day7_night"} ] },
    day7_night: { text: "你梦见自己回到了和平年代。", choices: [ {text:"醒来", next:"day8_morning"} ] },

    day8_morning: { text: "第八天。你发烧了。", choices: [ {text:"寻找药物", next:"day8_search_med"}, {text:"物理降温", next:"day8_cool"} ] },
    day8_search_med: { text: "你拖着病体翻找柜子，找到一片退烧药。", choices: [ {text:"吃药", next:"day8_noon", effect: {health: 10}} ] },
    day8_cool: { text: "你用湿布敷在额头上。", choices: [ {text:"休息", next:"day8_noon", effect: {health: 5}} ] },
    day8_noon: { text: "高烧让你昏昏沉沉。", choices: [ {text:"继续睡", next:"day8_night"} ] },
    day8_night: { text: "你感到生命在流逝。", choices: [ {text:"坚持住", next:"day9_morning"} ] },

    day9_morning: { text: "第九天。烧退了，但你虚弱得站不起来。", choices: [ {text:"爬行寻找水", next:"day9_water"}, {text:"躺着等死", next:"ending_dead1"} ] },
    day9_water: { text: "你喝了最后一点水。", choices: [ {text:"喘息", next:"day9_noon"} ] },
    day9_noon: { text: "你听到外面有枪决的声音。", choices: [ {text:"麻木", next:"day9_night"} ] },
    day9_night: { text: "这是最后一个夜晚吗？", choices: [ {text:"闭眼", next:"day10_morning"} ] },

    day10_morning: { text: "第十天。门被撞开了。", choices: [ {text:"看一眼", next:"day10_end"} ] },
    day10_end: { text: "几名日本士兵冲了进来。", choices: [ {text:"拼死一搏", next:"day10_fight", condition: {hasItem: "手枪"}}, {text:"接受命运", next:"ending_caught1"} ] },
    day10_fight: { text: "你开枪打死了一名士兵，趁乱跳窗逃跑。", choices: [ {text:"逃进下水道", next:"day11_sewer"} ] },

    // 市民-下水道生存分支 (Day 11-15)
    day11_sewer: { text: "第十一天。下水道里恶臭难闻，但至少没有士兵。", choices: [ {text:"向深处走", next:"day11_deep"}, {text:"寻找出口", next:"day11_exit_search"} ] },
    day11_deep: { text: "深处有一些微弱的光亮。", choices: [ {text:"靠近", next:"day11_camp"} ] },
    day11_exit_search: { text: "你找不到出口，反而迷路了。", choices: [ {text:"返回", next:"day11_deep"} ] },
    day11_camp: { text: "这里聚集着一群幸存者，他们建立了地下营地。", choices: [ {text:"请求加入", next:"day11_join"}, {text:"抢夺物资", next:"day11_rob"} ] },
    day11_join: { text: "首领打量了你一番，同意你留下，但要上交武器。", choices: [ {text:"交出手枪", next:"day12_morning", effect: {removeItem: "手枪"}}, {text:"拒绝", next:"day11_leave"} ] },
    day11_rob: { text: "你试图抢夺，被众人制服。", choices: [ {text:"被扔进污水沟", next:"ending_sewer_death"} ] },
    day11_leave: { text: "你独自离开了营地。", choices: [ {text:"继续流浪", next:"ending_sewer_death"} ] },

    day12_morning: { text: "第十二天。你在营地里负责清理垃圾。", choices: [ {text:"认真工作", next:"day12_work"}, {text:"偷懒", next:"day12_lazy"} ] },
    day12_work: { text: "首领给了你一块发霉的面包。", choices: [ {text:"吃掉", next:"day12_night", effect: {health: 5}} ] },
    day12_lazy: { text: "你被监工打了一顿。", choices: [ {text:"忍气吞声", next:"day12_night", effect: {health: -5}} ] },
    day12_night: { text: "地下营地的空气很差，很多人在咳嗽。", choices: [ {text:"睡觉", next:"day13_morning"} ] },

    day13_morning: { text: "第十三天。营地里爆发了瘟疫。", choices: [ {text:"照顾病人", next:"day13_help"}, {text:"躲得远远的", next:"day13_hide"} ] },
    day13_help: { text: "你被传染了。", choices: [ {text:"休息", next:"day13_night", effect: {health: -10}} ] },
    day13_hide: { text: "你躲在角落里，看着人们一个个倒下。", choices: [ {text:"恐惧", next:"day13_night", effect: {sanity: -10}} ] },
    day13_night: { text: "死亡的气息弥漫。", choices: [ {text:"坚持", next:"day14_morning"} ] },

    day14_morning: { text: "第十四天。首领死了，营地陷入混乱。", choices: [ {text:"争夺领导权", next:"day14_leader"}, {text:"趁乱逃跑", next:"day14_escape"} ] },
    day14_leader: { text: "你被暴徒杀死。", choices: [ {text:"结束", next:"ending_sewer_riot"} ] },
    day14_escape: { text: "你爬出了下水道，回到了地面。", choices: [ {text:"呼吸新鲜空气", next:"day15_morning"} ] },

    day15_morning: { text: "第十五天。地面上已经是废墟一片。", choices: [ {text:"前往江边", next:"day15_river"}, {text:"前往山林", next:"day15_mountain"} ] },
    day15_river: { text: "江边堆满了尸体。", choices: [ {text:"寻找浮木", next:"ending_river_final"} ] },
    day15_mountain: { text: "你走进山林，最终迷失方向。", choices: [ {text:"结束", next:"ending_mountain_death"} ] },

    ending_sewer_death: { text: "系统：你在下水道中腐烂（市民结局11）", choices: [] },
    ending_sewer_riot: { text: "系统：你死于幸存者内乱（市民结局12）", choices: [] },
    ending_river_final: { text: "系统：你抱住一根浮木漂流，最终体力不支沉入江底（市民结局13）", choices: [] },
    ending_mountain_death: { text: "系统：你在山林中冻饿而死（市民结局14）", choices: [] },

    survival_end: { text: "你在废墟中坚持了数日，最终因饥寒交迫倒在雪地里。", choices: [ {text:"结束", next:"ending_dead1"} ] },

    // 东门与西门
    east1: { text: "东门被封锁。守卫要通行证。", choices: [ {text:"尝试贿赂", next:"bribe1", condition: {hasItem: "钱币"}}, {text:"寻找别路", next:"street2"} ] },
    bribe1: { text: "你拿出钱，守卫犹豫不决。", choices: [ {text:"再给多点", next:"ending_caught1"}, {text:"换条路走", next:"street2"} ] },
    west1: { text: "西门有秘密通道，但有匪徒。", choices: [ {text:"与匪徒谈判", next:"bandit1"}, {text:"寻找其他路", next:"street2"} ] },
    bandit1: { text: "匪徒要求交换物资。", choices: [ {text:"交出手表", next:"ending_caught_bandit"}, {text:"拒绝", next:"fight_bandit"} ] },
    fight_bandit: { text: "你试图打斗但受伤。", choices: [ {text:"逃跑", next:"street2"}, {text:"求饶", next:"ending_caught_bandit"} ] },

    // 河边分支
    river1: { text: "河边有小船，但需要撑过去。你要尝试吗？", choices: [ {text:"直接划船", next:"river_row"}, {text:"返回", next:"street2"}, {text:"等夜晚", next:"river_night"} ] },
    river_row: { text: "你推船入水，水流湍急。是否继续？", choices: [ {text:"坚持划过去", next:"ending_escape_river"}, {text:"靠岸返回", next:"street2"} ] },
    river_night: { text: "夜晚河面起雾，视线很差。你看到一个黑影漂浮在水上。", choices: [ {text:"探查黑影", next:"river_shadow"}, {text:"绕开继续划", next:"ending_escape_river"} ] },
    river_shadow: { text: "那是一具尸体，手里还抓着一个包裹。要拿吗？", choices: [ {text:"取包裹", next:"river_package", effect: {addItem: "地图"}}, {text:"不拿", next:"ending_escape_river"} ] },
    river_package: { text: "包裹里有些钱和一张地图，你带着它继续划船。", choices: [ {text:"利用地图找出口", next:"ending_escape_river"} ] },

    // 教堂分支
    church: { text: "教堂里有修女和难民。修女邀请你帮忙。", choices: [ {text:"帮忙", next:"church_help"}, {text:"离开", next:"street1"}, {text:"询问消息", next:"church_info"} ] },
    church_info: { text: "一名神父悄声告诉你：南门可能守备较松。", choices: [ {text:"去南门", next:"south1"}, {text:"留在教堂", next:"church_help"} ] },
    south1: { text: "南门附近有军犬巡逻。", choices: [ {text:"绕过军犬", next:"ending_escape_south"}, {text:"返回", next:"street2"} ] },
    church_help: { text: "你帮忙分发食物。有人问你要不要加入抵抗。", choices: [ {text:"加入", next:"resist1"}, {text:"拒绝", next:"church_stay"} ] },
    resist1: { text: "你加入了抵抗组织，是否行动？", choices: [ {text:"去救人", next:"rescue1"}, {text:"去收集情报", next:"intel1"} ] },
    rescue1: { text: "你救了几位市民，安全撤回。", choices: [ {text:"返回教堂", next:"church_stay"}, {text:"继续行动", next:"rescue2"} ] },
    rescue2: { text: "你再次出击，但遇到日军。", choices: [ {text:"交火", next:"ending_rescue_fail"}, {text:"撤退", next:"church_stay"} ] },
    intel1: { text: "你偷偷来到了日军营地外围。", choices: [ {text:"偷偷潜入", next:"ending_resist_win"}, {text:"害怕返回", next:"ending_resist_fail"} ] },
    church_stay: { text: "你留在教堂，暂时安全，但外界愈发危险。", choices: [ {text:"继续帮忙", next:"ending_safe"}, {text:"冒险离开", next:"street1"} ] },

    // 家中分支
    home: { text: "你躲在家里。外面越来越危险。", choices: [ {text:"继续等待", next:"ending1"}, {text:"出去看看", next:"street1"}, {text:"爬上屋顶观察", next:"home_roof"} ] },
    home_roof: { text: "你看到南边有火光，北边有巡逻士兵。", choices: [ {text:"去南边", next:"south1"}, {text:"去北边", next:"north1"} ] },

    // 结局
    ending1: { text: "系统：你留在家中，最终被日军抓走枪决（市民结局1）", choices: [] },
    ending2: { text: "系统：防空洞塌陷，你被埋在废墟（市民结局2）", choices: [] },
    ending3: { text: "系统：你搭上小船，却在河中央被日军巡逻艇发现射杀（市民结局3）", choices: [] },
    ending_caught1: { text: "系统：你被士兵抓住并处决（市民结局4）", choices: [] },
    ending_dead1: { text: "系统：你在塌陷中窒息死亡（市民结局5）", choices: [] },
    ending_escape_east: { text: "系统：你贿赂守卫后仍被反锁在城门内遭枪决（市民结局6）", choices: [] },
    ending_escape_west: { text: "系统：你试图通过西门秘密通道逃跑却被匪徒杀死（市民结局7）", choices: [] },
    ending_caught_bandit: { text: "系统：你被匪徒劫杀（市民结局8）", choices: [] },
    ending_escape_river: { text: "系统：划船时动作太大船翻了，你落水溺亡（市民结局9）", choices: [] },
    ending_escape_south: { text: "系统：你趁夜绕过军犬，却被埋伏的士兵发现枪杀（市民结局10）", choices: [] },
    ending_resist_win: { text: "系统：你被暗哨发现并射杀（市民结局9）", choices: [] },
    ending_resist_fail: { text: "系统：你待在教堂里，最后被日军坑杀（市民结局9）", choices: [] }
   },
  难民: {
    start: { text: "你背着行李和家人穿过混乱的街道，一名陌生难民拉住你：‘一起走吗？’", choices: [ {text:"和他结伴", next:"ally1"}, {text:"拒绝同行", next:"alone1"}, {text:"观察他的意图", next:"check_ally"} ] },
    check_ally: { text: "他看起来十分焦急，还带着一个小女孩。", choices: [ {text:"决定结伴", next:"ally1"}, {text:"还是拒绝", next:"alone1"} ] },

    ally1: { text: "你们结伴而行，他告诉你南边有个安全的仓库。", choices: [ {text:"去仓库", next:"warehouse1"}, {text:"先去找水", next:"water1"}, {text:"找食物", next:"food_search1"} ] },
    food_search1: { text: "你们在街边翻找破损的商店。", choices: [ {text:"进入杂货店", next:"shop1"}, {text:"去面包房", next:"bakery1"} ] },
    shop1: { text: "杂货店里有一些罐头和米袋。", choices: [ {text:"拿走罐头", next:"warehouse1", effect: {addItem: "罐头"}}, {text:"拿米袋", next:"warehouse1", effect: {addItem: "米袋"}}, {text:"全拿", next:"warehouse_suspect", effect: {addItem: "大量物资"}} ] },
    bakery1: { text: "面包房里剩下几块发霉的面包。", choices: [ {text:"清理霉斑后吃", next:"warehouse1", effect: {changeHealth: -10}}, {text:"扔掉", next:"warehouse1"} ] },
    warehouse_suspect: { text: "你们搬着大量物资离开，引起了旁人注意。", choices: [ {text:"分一些给别人", next:"warehouse1", effect: {removeItem: "大量物资"}}, {text:"快速离开", next:"warehouse1"} ] },

    water1: { text: "你们找到一口井，但井旁有日军哨兵。", choices: [ {text:"偷偷取水", next:"water_sneak"}, {text:"放弃", next:"warehouse1"} ] },
    water_sneak: { text: "你悄悄打水，哨兵似乎听到了声音。", choices: [ {text:"装作乞丐", next:"water_beg"}, {text:"迅速离开", next:"warehouse1"} ] },
    water_beg: { text: "哨兵用枪驱赶你，你低声求饶后逃走。", choices: [ {text:"返回仓库", next:"warehouse1"} ] },

    warehouse1: { text: "仓库里聚集了许多难民，他们在商议逃生路线。有人提议建立临时营地，等待救援。", choices: [ {text:"跟随大队走", next:"team1"}, {text:"单独探索", next:"alone1"}, {text:"留在仓库建立营地", next:"refugee_camp_start"} ] },

    // 难民-仓库营地分支 (Day 1-5)
    refugee_camp_start: { text: "第一天。你决定留在仓库，和大家抱团取暖。你需要选择一个角色。", choices: [ {text:"负责搜寻物资", next:"camp_scout"}, {text:"负责照顾老弱", next:"camp_care"} ] },
    camp_scout: { text: "你带队出去寻找食物，在一处废墟发现了米缸。", choices: [ {text:"搬回仓库", next:"camp_day1_night", effect: {addItem: "米缸"}}, {text:"私藏一部分", next:"camp_day1_night", effect: {addItem: "私藏米"}} ] },
    camp_care: { text: "你留下来照顾生病的老人，获得大家的感激。", choices: [ {text:"休息", next:"camp_day1_night", effect: {sanity: 5}} ] },
    camp_day1_night: { text: "夜晚，仓库外传来枪声。大家都很害怕。", choices: [ {text:"轮流守夜", next:"camp_day2_morning"} ] },

    camp_day2_morning: { text: "第二天。一名难民发高烧了，可能是传染病。", choices: [ {text:"建议隔离", next:"camp_day2_iso"}, {text:"隐瞒病情", next:"camp_day2_hide"} ] },
    camp_day2_iso: { text: "家属激烈反对，引发了争执。", choices: [ {text:"强行隔离", next:"camp_day2_conflict"}, {text:"妥协", next:"camp_day2_spread"} ] },
    camp_day2_conflict: { text: "你被打了一拳，但病人被隔离了。", choices: [ {text:"忍痛", next:"camp_day2_night", effect: {health: -5}} ] },
    camp_day2_spread: { text: "病情开始蔓延。", choices: [ {text:"担忧", next:"camp_day2_night", effect: {sanity: -10}} ] },
    camp_day2_hide: { text: "你选择不说，但心里不安。", choices: [ {text:"愧疚", next:"camp_day2_night", effect: {sanity: -5}} ] },
    camp_day2_night: { text: "仓库里的空气变得浑浊。", choices: [ {text:"睡觉", next:"camp_day3_morning"} ] },

    camp_day3_morning: { text: "第三天。日军搜查队靠近了仓库。", choices: [ {text:"全体静默", next:"camp_day3_silent"}, {text:"分批撤离", next:"camp_day3_evac"} ] },
    camp_day3_silent: { text: "婴儿突然哭了起来。", choices: [ {text:"捂住婴儿的嘴", next:"camp_day3_baby"}, {text:"暴露", next:"ending_refugee_massacre"} ] },
    camp_day3_baby: { text: "婴儿停止了哭泣（窒息），日军离开了。", choices: [ {text:"痛哭", next:"camp_day3_night", effect: {sanity: -50}} ] },
    camp_day3_evac: { text: "撤离途中遭遇巡逻队。", choices: [ {text:"四散逃跑", next:"ending_refugee_scatter"} ] },
    camp_day3_night: { text: "经历了白天的惊魂，大家士气低落。", choices: [ {text:"鼓励大家", next:"camp_day4_morning"} ] },

    camp_day4_morning: { text: "第四天。仓库已经不安全了，必须突围。", choices: [ {text:"冲向江边", next:"camp_day4_river"}, {text:"冲向西门", next:"camp_day4_west"} ] },
    camp_day4_river: { text: "江边有日军机枪阵地。", choices: [ {text:"冲锋", next:"ending_refugee_river_death"} ] },
    camp_day4_west: { text: "西门大开，似乎是陷阱。", choices: [ {text:"硬着头皮冲", next:"ending_refugee_west_trap"} ] },

    ending_refugee_massacre: { text: "系统：日军发现了仓库，所有人被屠杀（难民结局11）", choices: [] },
    ending_refugee_scatter: { text: "系统：你在逃跑中被流弹击中身亡（难民结局12）", choices: [] },
    ending_refugee_river_death: { text: "系统：你倒在了通往江边的路上（难民结局13）", choices: [] },
    ending_refugee_west_trap: { text: "系统：你冲出西门，踩中了地雷（难民结局14）", choices: [] },

    warehouse_info: { text: "有人低声说西门有一条未封死的下水道。", choices: [ {text:"去查看", next:"sewer1"}, {text:"不相信", next:"team1"} ] },
    sewer1: { text: "下水道口臭气熏天，但也许能通到城外。", choices: [ {text:"进入", next:"sewer_inside1"}, {text:"放弃", next:"warehouse1"} ] },
    sewer_inside1: { text: "你在黑暗的管道里摸索前行，前方传来奇怪的声响。", choices: [ {text:"靠近查看", next:"sewer_rat"}, {text:"原路返回", next:"warehouse1"} ] },
    sewer_rat: { text: "一群老鼠吓得你差点摔倒。", choices: [ {text:"继续前进", next:"ending_refugee_sewer"}, {text:"退出", next:"warehouse1"} ] },

    team1: { text: "大队计划夜里从西门突围。", choices: [ {text:"参与突围", next:"west_escape"}, {text:"改去东门", next:"east_escape_plan"} ] },
    west_escape: { text: "夜里你们出发，西门有日军放哨。", choices: [ {text:"掩护大家", next:"fight_guard"}, {text:"悄悄绕过", next:"ending_refugee_west"}, {text:"等人分散后再走", next:"west_wait"} ] },
    west_wait: { text: "你决定等一会儿，巡逻似乎减少。", choices: [ {text:"趁机离开", next:"ending_refugee_west"}, {text:"跟随大队", next:"fight_guard"} ] },
    fight_guard: { text: "你扔出石块吸引注意，自己中枪倒地。", choices: [ {text:"坚持爬走", next:"ending_refugee_wounded"}, {text:"被抓", next:"ending_refugee_caught"} ] },

    east_escape_plan: { text: "你独自去东门探路，发现关卡紧闭。", choices: [ {text:"尝试贿赂", next:"refugee_bribe", condition: {hasItem: "钱币"}}, {text:"返回仓库", next:"warehouse1"} ] },
    refugee_bribe: { text: "你拿出仅有的钱币。", choices: [ {text:"全部给出", next:"ending_refugee_east"}, {text:"留一半", next:"ending_refugee_fail"} ] },

    alone1: { text: "你拒绝了同伴，自己沿街前进，遇到一对母子。", choices: [ {text:"帮助他们", next:"help_mother"}, {text:"无视离开", next:"street_refugee1"} ] },
    help_mother: { text: "母亲请求你带她孩子去安全地。", choices: [ {text:"答应", next:"child_carry"}, {text:"拒绝", next:"street_refugee1"} ] },
    child_carry: { text: "你背起孩子，他告诉你北边有修道院。", choices: [ {text:"去修道院", next:"monastery1"}, {text:"继续寻找出路", next:"street_refugee1"} ] },

    street_refugee1: { text: "街道上有士兵搜查。", choices: [ {text:"躲藏", next:"hide_refugee1"}, {text:"假装镇定", next:"pass_refugee1"} ] },
    hide_refugee1: { text: "你钻进残破的车厢。士兵从旁经过。", choices: [ {text:"继续等待", next:"street_refugee2"}, {text:"趁机离开", next:"street_refugee2"} ] },
    pass_refugee1: { text: "士兵对你投来疑惑的目光。", choices: [ {text:"递上口粮贿赂", next:"ending_refugee_safe", condition: {hasItem: "罐头"}}, {text:"低头快走", next:"street_refugee2"} ] },
    street_refugee2: { text: "你来到三岔路：东门、西门、河边。", choices: [ {text:"去东门", next:"east_escape_plan"}, {text:"去西门", next:"west_escape"}, {text:"去河边", next:"refugee_river"} ] },

    refugee_river: { text: "河边有难民在争抢一条小船。", choices: [ {text:"加入争抢", next:"refugee_fight"}, {text:"寻找别船", next:"refugee_boat_search"}, {text:"等待机会", next:"river_wait"} ] },
    river_wait: { text: "你等到夜晚，河面起雾，争抢的人散去。", choices: [ {text:"悄悄划走", next:"ending_refugee_boat_escape"}, {text:"放弃", next:"street_refugee2"} ] },
    refugee_fight: { text: "争抢中有人掉入水里。", choices: [ {text:"救人", next:"refugee_rescue"}, {text:"抢船", next:"ending_refugee_boat_escape"} ] },
    refugee_rescue: { text: "你被他按在水里无法喘息。", choices: [ {text:"坚持救人", next:"ending_refugee_fight_escape"}, {text:"逃生上岸", next:"ending_refugee_boat2_escape"} ] },
    refugee_boat_search: { text: "你找到一只破旧的小艇。", choices: [ {text:"冒险乘坐", next:"ending_refugee_boat_escape"}, {text:"放弃", next:"street_refugee2"} ] },

    monastery1: { text: "修道院里有少量食物和药品。", choices: [ {text:"休息一晚", next:"monastery_rest"}, {text:"问路", next:"monastery_info"} ] },
    monastery_rest: { text: "夜里传来枪声，修女催促大家离开。", choices: [ {text:"跟随修女", next:"ending_refugee_safe"}, {text:"自己寻找出路", next:"street_refugee2"} ] },
    monastery_info: { text: "修女告诉你南边河口较安全。", choices: [ {text:"前往河口", next:"refugee_river"} ] },

    // 结局
    ending_refugee_west: { text: "系统：你跟随大队突围时被射杀（难民结局1）", choices: [] },
    ending_refugee_wounded: { text: "系统：你被士兵用刺刀刺入胸膛（难民结局2）", choices: [] },
    ending_refugee_caught: { text: "系统：你被士兵用军刀砍头（难民结局3）", choices: [] },
    ending_refugee_east: { text: "系统：你被一刀砍死（难民结局4）", choices: [] },
    ending_refugee_fail: { text: "系统：你被刺刀多次刺死（难民结局5）", choices: [] },
    ending_refugee_safe: { text: "系统：你被一刀刺入胸膛（难民结局6）", choices: [] },
    ending_refugee_fight_escape: { text: "系统：你呛水过多被淹死（难民结局7）", choices: [] },
    ending_refugee_boat_escape: { text: "系统：你逃亡过程中船漏水了，你被淹死了（难民结局8）", choices: [] },
    ending_refugee_boat2_escape: { text: "系统：你没有抢到船，待在岸边被日军射杀（难民结局9）", choices: [] },
    ending_refugee_sewer: { text: "系统：你在下水道被淹死（难民结局10）", choices: [] }
},
  学生: {
    start: { text: "学校早已停课，你和几位同学藏在一栋废弃的教室楼里。有人说城中有安全区。", choices: [ {text:"和同学们商量逃跑", next:"student_meeting"}, {text:"独自行动", next:"student_alone"} ] },
    student_meeting: { text: "大家意见不一，有人想去教堂，有人想去河边。", choices: [ {text:"投票决定", next:"student_vote"}, {text:"听从班长意见", next:"student_leader"} ] },
    student_vote: { text: "投票结果：多数人想去教堂避难。", choices: [ {text:"跟随大家去教堂", next:"student_church"}, {text:"自己改去河边", next:"student_river"} ] },
    student_leader: { text: "班长建议大家分组行动，减少风险。", choices: [ {text:"和班长一组", next:"student_team_leader"}, {text:"和好朋友一组", next:"student_friend"} ] },
    student_team_leader: { text: "班长带你们绕小路前往教堂。途中遇到士兵搜查。", choices: [ {text:"藏进草丛", next:"student_hide"}, {text:"假装镇定", next:"student_check"} ] },
    student_friend: { text: "你和朋友沿另一条路走，发现一辆废弃的马车。", choices: [ {text:"爬上车躲藏", next:"student_cart"}, {text:"绕路前进", next:"student_river"} ] },
    student_hide: { text: "你们屏住呼吸，士兵未发现你们。", choices: [ {text:"继续前往教堂", next:"student_church"} ] },
    student_check: { text: "士兵盘问你们的身份。", choices: [ {text:"说自己是学生", next:"student_safe"}, {text:"撒谎说是乞丐", next:"student_trouble"} ] },
    student_safe: { text: "士兵冷笑后要搜身。", choices: [ {text:"举起双手", next:"student_check_end"} ] },
    student_trouble: { text: "士兵怀疑你们，要求搜身。", choices: [ {text:"配合搜查", next:"student_check_end"}, {text:"试图逃跑", next:"ending_student_caught"} ] },
    student_check_end: { text: "你被搜出学生证，士兵不再为难。", choices: [ {text:"前往教堂", next:"student_church"} ] },
    student_church: { text: "教堂内有修女接待你们，她需要人手帮忙分发食物。", choices: [ {text:"留下帮忙", next:"student_help"}, {text:"询问逃生路线", next:"student_info"} ] },
    student_help: { text: "你们帮忙搬运食物，赢得修女信任。修女建议你们暂时留在教堂帮忙。", choices: [ {text:"留在教堂建立防线", next:"student_camp_start"}, {text:"跟随修女去安全区", next:"ending_student_safe"}, {text:"再探索其他路线", next:"student_river"} ] },
    student_info: { text: "修女告诉你河边可能有船只。", choices: [ {text:"前往河边", next:"student_river"} ] },
    student_river: { text: "河边有几条小船，但有巡逻士兵。", choices: [ {text:"等夜里行动", next:"student_river_night"}, {text:"尝试强行划船", next:"ending_student_danger"} ] },
    student_river_night: { text: "夜幕降临，你悄悄靠近小船。但你发现船底有破洞。", choices: [ {text:"尝试修补", next:"student_wild_start"}, {text:"划船离开", next:"ending_student_river_escape"}, {text:"改变主意", next:"student_church"} ] },
    student_cart: { text: "你躲在马车里，听到士兵的脚步声逼近。", choices: [ {text:"屏住呼吸", next:"student_safe_cart"}, {text:"跳下逃跑", next:"ending_student_caught"} ] },
    student_safe_cart: { text: "士兵走过，你成功逃过一劫。", choices: [ {text:"前往河边", next:"student_river"} ] },
    student_alone: { text: "你决定独自行动，路过学校图书馆时，看到有书籍散落。", choices: [ {text:"拿一本日记", next:"student_journal", effect: {addItem: "日记"}}, {text:"不理会", next:"student_alone2"} ] },
    student_journal: { text: "日记里记载了秘密通道的线索。", choices: [ {text:"按线索行动", next:"student_secret_path"}, {text:"尝试去河边", next:"student_river"} ] },
    student_alone2: { text: "你走出学校，考虑应该去哪里。", choices: [ {text:"去教堂", next:"student_church"}, {text:"想办法出城", next:"ending_student_river_escape"},{text:"去河边", next:"student_river"} ] },
    student_secret_path: { text: "你沿着线索找到一条隐蔽的小巷。", choices: [ {text:"继续前进", next:"ending_student_secret_escape"}, {text:"犹豫返回", next:"student_church"} ] },

    // 学生-教堂防线分支 (Day 1-5)
    student_camp_start: { text: "你决定留在教堂，组织难民建立防线。第一天，你需要分配任务。", choices: [ {text:"加固大门", next:"camp_day1_gate"}, {text:"清点物资", next:"camp_day1_food"} ] },
    camp_day1_gate: { text: "你带领几个年轻人搬来桌椅堵住大门。", choices: [ {text:"休息", next:"camp_day1_night", effect: {health: -2}} ] },
    camp_day1_food: { text: "物资比想象中少，只能维持三天。", choices: [ {text:"实行配给制", next:"camp_day1_night"}, {text:"隐瞒实情", next:"camp_day1_night"} ] },
    camp_day1_night: { text: "夜晚，教堂外传来惨叫声。", choices: [ {text:"无视", next:"camp_day2_morning"}, {text:"查看", next:"camp_day1_event"} ] },
    camp_day1_event: { text: "一名受伤的士兵倒在门口。", choices: [ {text:"救进来", next:"camp_day2_morning", effect: {addItem: "步枪"}}, {text:"不开门", next:"camp_day2_morning"} ] },

    camp_day2_morning: { text: "第二天。有人提议主动出击寻找补给。", choices: [ {text:"同意出击", next:"camp_day2_raid"}, {text:"坚守不出", next:"camp_day2_defend"} ] },
    camp_day2_raid: { text: "你们突袭了附近的哨所，抢到一些弹药，但牺牲了一名同学。", choices: [ {text:"撤回", next:"camp_day2_night", effect: {sanity: -10, addItem: "弹药"}} ] },
    camp_day2_defend: { text: "你们加固了窗户。大家情绪低落。", choices: [ {text:"鼓励大家", next:"camp_day2_night", effect: {sanity: 5}} ] },
    camp_day2_night: { text: "今晚格外安静。", choices: [ {text:"轮流守夜", next:"camp_day3_morning"} ] },

    camp_day3_morning: { text: "第三天。日军发现了教堂，开始试探性进攻。", choices: [ {text:"还击", next:"camp_day3_fight", condition: {hasItem: "步枪"}}, {text:"死守", next:"camp_day3_hold"} ] },
    camp_day3_fight: { text: "你用步枪击退了先头部队。", choices: [ {text:"欢呼", next:"camp_day3_night"} ] },
    camp_day3_hold: { text: "大门快被撞开了。", choices: [ {text:"顶住", next:"camp_day3_night", effect: {health: -10}} ] },
    camp_day3_night: { text: "大家都受了伤，弹药也快尽了。", choices: [ {text:"写遗书", next:"camp_day4_morning"} ] },

    camp_day4_morning: { text: "第四天。日军架起了机枪。", choices: [ {text:"从后门突围", next:"camp_day4_escape"}, {text:"决一死战", next:"ending_student_hero"} ] },
    camp_day4_escape: { text: "你们冲出后门，大部分人倒在了血泊中。", choices: [ {text:"继续跑", next:"ending_student_caught"} ] },

    // 学生-野外生存分支 (Day 1-5)
    student_wild_start: { text: "你修好了船，划到了对岸的芦苇荡里。这里暂时安全。", choices: [ {text:"搭建庇护所", next:"wild_day1_build"}, {text:"寻找食物", next:"wild_day1_food"} ] },
    wild_day1_build: { text: "你用芦苇搭了个窝棚。", choices: [ {text:"休息", next:"wild_day1_night"} ] },
    wild_day1_food: { text: "你抓到几只螃蟹。", choices: [ {text:"生吃", next:"wild_day1_night", effect: {health: -5}}, {text:"烤熟", next:"wild_day1_night"} ] },
    wild_day1_night: { text: "河边的蚊虫很多。", choices: [ {text:"忍受", next:"wild_day2_morning"} ] },

    wild_day2_morning: { text: "第二天。你看到河面上有巡逻艇。", choices: [ {text:"躲进深处", next:"wild_day2_hide"}, {text:"观察规律", next:"wild_day2_watch"} ] },
    wild_day2_hide: { text: "你一整天不敢动弹。", choices: [ {text:"睡觉", next:"wild_day2_night"} ] },
    wild_day2_watch: { text: "你发现他们每小时巡逻一次。", choices: [ {text:"记下", next:"wild_day2_night"} ] },
    wild_day2_night: { text: "你发烧了。", choices: [ {text:"喝河水", next:"wild_day3_morning", effect: {health: -5}} ] },

    wild_day3_morning: { text: "第三天。你听到有人在芦苇荡里走动。", choices: [ {text:"拿起身边的木棍", next:"wild_day3_encounter"}, {text:"逃跑", next:"ending_student_river_escape"} ] },
    wild_day3_encounter: { text: "是一个逃兵。", choices: [ {text:"攻击他", next:"wild_day3_kill"}, {text:"交流", next:"wild_day3_talk"} ] },
    wild_day3_kill: { text: "你杀了他，抢走了他的干粮。", choices: [ {text:"吃掉", next:"wild_day3_night", effect: {sanity: -20, health: 10}} ] },
    wild_day3_talk: { text: "他也是学生，被抓壮丁逃出来的。", choices: [ {text:"结伴", next:"wild_day3_night"} ] },
    wild_day3_night: { text: "多了一个人，多了一份照应。", choices: [ {text:"轮流睡", next:"wild_day4_morning"} ] },

    wild_day4_morning: { text: "第四天。日军开始放火烧芦苇荡。", choices: [ {text:"跳河", next:"ending_student_river_escape"}, {text:"冲出去", next:"ending_student_caught"} ] },

    ending_student_hero: { text: "系统：你和同学们战至最后一刻，全员殉国（学生结局6）", choices: [] },

    ending_student_safe: { text: "系统：你留在教堂，最终被日军坑杀（学生结局1）", choices: [] },
    ending_student_caught: { text: "系统：你被士兵开枪射杀（学生结局2）", choices: [] },
    ending_student_danger: { text: "系统：你试图划船被巡逻发现并射杀（学生结局3）", choices: [] },
    ending_student_river_escape: { text: "系统：你被士兵发现并射杀（学生结局4）", choices: [] },
    ending_student_secret_escape: { text: "系统：你逃出城外被日军射杀（学生结局5）", choices: [] }
},
  教师: {
    start: { text: "你是一名教师，学校已经解散，学生们四散而逃。你独自回到空荡荡的教室。", choices: [ {text:"寻找学生", next:"teacher_search"}, {text:"收集物资", next:"teacher_collect"}, {text:"去教堂", next:"teacher_church_start"} ] },

    teacher_search: { text: "你想起有几名学生可能还躲在图书馆。", choices: [ {text:"前往图书馆", next:"teacher_library"}, {text:"放弃寻找", next:"teacher_collect"} ] },
    teacher_library: { text: "图书馆一片狼藉，你听到二楼传来低声呼喊。", choices: [ {text:"上楼查看", next:"teacher_rescue"}, {text:"不理会", next:"teacher_collect"} ] },
    teacher_rescue: { text: "你找到两名学生，他们哭着请求你带他们离开。", choices: [ {text:"带上学生", next:"teacher_with_students"}, {text:"拒绝", next:"teacher_collect"} ] },
    teacher_with_students: { text: "你带着两名学生，准备寻找安全的路线。", choices: [ {text:"去教堂", next:"teacher_church_start"}, {text:"去河边", next:"teacher_river"} ] },

    teacher_collect: { text: "你在办公室找到一些粉笔和几本书。书中夹着一张城门守卫的排班表。", choices: [ {text:"利用排班表找路线", next:"teacher_gate_plan", effect: {addItem: "排班表"}}, {text:"前往教堂", next:"teacher_church_start"}, {text:"留在学校建立避难所", next:"teacher_school_start"} ] },
    teacher_gate_plan: { text: "排班表显示西门夜间守卫较少。", choices: [ {text:"准备去西门", next:"teacher_west"}, {text:"改去教堂", next:"teacher_church_start"} ] },

    // 教师-学校避难所分支 (Day 1-5)
    teacher_school_start: { text: "你决定留在学校，利用坚固的校舍保护幸存的学生。第一天，你需要清理场地。", choices: [ {text:"清理地下室", next:"school_day1_basement"}, {text:"封锁校门", next:"school_day1_gate"} ] },
    school_day1_basement: { text: "地下室虽然阴暗，但很隐蔽。", choices: [ {text:"布置床铺", next:"school_day1_night"} ] },
    school_day1_gate: { text: "你搬来桌椅堵住校门，但这只能阻挡一时。", choices: [ {text:"休息", next:"school_day1_night"} ] },
    school_day1_night: { text: "夜晚，几个学生因为害怕而哭泣。", choices: [ {text:"讲故事安慰", next:"school_day2_morning", effect: {sanity: 5}}, {text:"严厉制止", next:"school_day2_morning", effect: {sanity: -5}} ] },

    school_day2_morning: { text: "第二天。食物短缺。", choices: [ {text:"去食堂寻找", next:"school_day2_canteen"}, {text:"去教工宿舍", next:"school_day2_dorm"} ] },
    school_day2_canteen: { text: "食堂里只剩下一些发霉的米。", choices: [ {text:"煮粥", next:"school_day2_noon", effect: {addItem: "米粥"}}, {text:"放弃", next:"school_day2_noon"} ] },
    school_day2_dorm: { text: "宿舍里找到一些饼干。", choices: [ {text:"分给学生", next:"school_day2_noon", effect: {sanity: 5}}, {text:"自己留着", next:"school_day2_noon", effect: {health: 5}} ] },
    school_day2_noon: { text: "中午，有难民敲门求助。", choices: [ {text:"接纳", next:"school_day2_accept"}, {text:"拒绝", next:"school_day2_reject"} ] },
    school_day2_accept: { text: "难民带来了外界的消息，但也消耗了更多食物。", choices: [ {text:"询问消息", next:"school_day2_night"} ] },
    school_day2_reject: { text: "难民绝望地离开了。", choices: [ {text:"愧疚", next:"school_day2_night", effect: {sanity: -5}} ] },
    school_day2_night: { text: "你听到远处有日军的巡逻车声。", choices: [ {text:"熄灯", next:"school_day3_morning"} ] },

    school_day3_morning: { text: "第三天。一名学生生病了。", choices: [ {text:"去医务室找药", next:"school_day3_med"}, {text:"物理降温", next:"school_day3_cool"} ] },
    school_day3_med: { text: "医务室在另一栋楼，需要穿过操场。", choices: [ {text:"冒险前往", next:"school_day3_run"}, {text:"放弃", next:"school_day3_cool"} ] },
    school_day3_run: { text: "你在操场上被狙击手发现。", choices: [ {text:"S形跑位", next:"school_day3_safe"}, {text:"趴下", next:"ending_teacher_sniper"} ] },
    school_day3_safe: { text: "你奇迹般地拿到了药并跑了回来。", choices: [ {text:"喂药", next:"school_day3_night"} ] },
    school_day3_cool: { text: "学生的病情加重了。", choices: [ {text:"祈祷", next:"school_day3_night"} ] },
    school_day3_night: { text: "学生在高烧中去世了。", choices: [ {text:"掩埋", next:"school_day4_morning", effect: {sanity: -20}} ] },

    school_day4_morning: { text: "第四天。日军冲进了学校。", choices: [ {text:"带领学生躲藏", next:"school_day4_hide"}, {text:"挺身而出", next:"ending_teacher_hero"} ] },
    school_day4_hide: { text: "你们躲在地下室，听着上面的脚步声。", choices: [ {text:"捂住学生的嘴", next:"school_day4_silence"} ] },
    school_day4_silence: { text: "脚步声渐渐远去。", choices: [ {text:"松手", next:"school_day5_morning"} ] },

    school_day5_morning: { text: "第五天。学校已经不安全了。", choices: [ {text:"突围去教堂", next:"teacher_church_start"}, {text:"分散逃跑", next:"ending_teacher_west_escape"} ] },

    ending_teacher_sniper: { text: "系统：你被狙击手击中头部（教师结局5）", choices: [] },
    ending_teacher_hero: { text: "系统：你为了保护学生，被日军刺刀刺死（教师结局6）", choices: [] },

    teacher_church_start: { text: "教堂内有修女接待你，她需要人帮忙照顾伤员。", choices: [ {text:"留下帮忙", next:"teacher_help"}, {text:"询问逃生路线", next:"teacher_church_info"} ] },
    teacher_help: { text: "你忙了一整天，修女对你表示感谢。", choices: [ {text:"跟随修女去安全区", next:"ending_teacher_safe"}, {text:"转去找其他出路", next:"teacher_river"} ] },
    teacher_church_info: { text: "修女告诉你西门和河边都有可能逃生。", choices: [ {text:"去西门", next:"teacher_west"}, {text:"去河边", next:"teacher_river"} ] },

    teacher_west: { text: "西门有少量士兵巡逻。", choices: [ {text:"偷偷观察", next:"teacher_west_hide"}, {text:"尝试混过去", next:"teacher_west_pass"} ] },
    teacher_west_hide: { text: "你看到一辆马车经过，可能可用作掩护。", choices: [ {text:"跟随马车", next:"ending_teacher_west_escape"}, {text:"另寻出路", next:"teacher_river"} ] },
    teacher_west_pass: { text: "士兵盘问你。", choices: [ {text:"声称自己是教师", next:"teacher_pass_teach"}, {text:"贿赂士兵", next:"teacher_bribe", condition: {hasItem: "钱币"}} ] },
    teacher_pass_teach: { text: "士兵冷哼用枪指着你。", choices: [ {text:"举起双手", next:"ending_teacher_west_escape"} , {text:"贿赂士兵", next:"teacher_bribe", condition: {hasItem: "钱币"}} ] },
    teacher_bribe: { text: "你掏出钱包，企图递给士兵一些钱。", choices: [ {text:"向前塞钱", next:"ending_teacher_west_escape"} ] },

    teacher_river: { text: "河边有几条小船，一些市民正在准备离开。", choices: [ {text:"加入他们", next:"teacher_river_join"}, {text:"自己找船", next:"teacher_river_search"} ] },
    teacher_river_join: { text: "你与其他人一起推船下水。", choices: [ {text:"一起划走", next:"ending_teacher_river_escape"}, {text:"放弃", next:"teacher_church_start"} ] },
    teacher_river_search: { text: "你找到一条破旧的小艇。", choices: [ {text:"修好小艇", next:"teacher_river_fix"}, {text:"寻找更好的船", next:"teacher_river_danger"} ] },
    teacher_river_fix: { text: "你用木板修好小艇并离开。", choices: [ {text:"顺利离开", next:"ending_teacher_river_escape"} ] },
    teacher_river_danger: { text: "在寻找时你被巡逻士兵发现。", choices: [ {text:"逃跑", next:"teacher_river_escape_attempt"}, {text:"反抗", next:"ending_teacher_caught"} ] },
    teacher_river_escape_attempt: { text: "你躲在芦苇丛中，士兵最终离开。", choices: [ {text:"回到小艇", next:"ending_teacher_river_escape"} ] },

    ending_teacher_safe: { text: "系统：你留在教堂，最后被日军坑杀（教师结局1）", choices: [] },
    ending_teacher_west_escape: { text: "系统：你被士兵当场射杀（教师结局2）", choices: [] },
    ending_teacher_river_escape: { text: "系统：你顺利划船进入长江，不幸翻船被淹死（教师结局3）", choices: [] },
    ending_teacher_caught: { text: "系统：你被士兵当场击毙（教师结局4）", choices: [] }
},
医生: {
    start: { text: "你是一名医生，城市陷入混乱，你所在的小诊所药品不足。外面有人敲门求助。", choices: [ {text:"开门看看", next:"doctor_open"}, {text:"无视敲门", next:"doctor_ignore"}, {text:"收集药品", next:"doctor_collect"} ] },

    doctor_open: { text: "门外是一名受伤的青年，流着血请求治疗。", choices: [ {text:"给他包扎", next:"doctor_bandage"}, {text:"拒绝", next:"doctor_ignore"} ] },
    doctor_bandage: { text: "你用仅有的纱布为他处理伤口，他告诉你教堂有安全庇护。", choices: [ {text:"去教堂", next:"doctor_church"}, {text:"继续留在诊所", next:"doctor_collect"} ] },

    doctor_ignore: { text: "你没有开门，青年失望地离开。外面传来枪声。", choices: [ {text:"小心探头看看", next:"doctor_peek"}, {text:"继续整理物资", next:"doctor_collect"} ] },
    doctor_peek: { text: "你看到士兵正在街头搜查。", choices: [ {text:"躲回诊所", next:"doctor_collect"}, {text:"从后门离开", next:"doctor_backdoor"} ] },
    doctor_backdoor: { text: "后门通向一条小巷。", choices: [ {text:"走向教堂", next:"doctor_church"}, {text:"朝河边走", next:"doctor_river"} ] },

    doctor_collect: { text: "你在诊所里找到一些药品和绷带，还发现了一把小刀。", choices: [ {text:"带上药品", next:"doctor_plan", effect: {addItem: "药品"}}, {text:"原地等待", next:"ending_doctor_caught"} ] },
    doctor_plan: { text: "你决定利用这些药品换取安全。", choices: [ {text:"去教堂", next:"doctor_church"}, {text:"去西门试试贿赂", next:"doctor_west"} ] },

    doctor_church: { text: "教堂内有大量伤员，修女请求你帮忙救治。", choices: [ {text:"留下帮忙", next:"doctor_help"}, {text:"不想留下", next:"doctor_river"} ] },
    doctor_help: { text: "你为伤员包扎，赢得大家信任。修女希望你能主持这里的临时医疗点。", choices: [ {text:"建立战地医院", next:"doctor_hospital_start"}, {text:"跟随修女去安全区", next:"ending_doctor_safe"}, {text:"寻找别的出路", next:"doctor_river"} ] },

    // 医生-战地医院分支 (Day 1-5)
    doctor_hospital_start: { text: "你决定留在教堂建立战地医院。第一天，伤员不断涌入。", choices: [ {text:"进行检伤分类", next:"doc_day1_triage"}, {text:"先救治重伤员", next:"doc_day1_heavy"} ] },
    doc_day1_triage: { text: "你将伤员分为轻重缓急，效率大大提高。", choices: [ {text:"休息", next:"doc_day1_night", effect: {sanity: 5}} ] },
    doc_day1_heavy: { text: "你耗尽精力救治重伤员，但轻伤员因感染恶化。", choices: [ {text:"自责", next:"doc_day1_night", effect: {sanity: -5}} ] },
    doc_day1_night: { text: "深夜，一名日军军官受重伤被抬到门口。", choices: [ {text:"救治他", next:"doc_day1_save_enemy"}, {text:"拒绝救治", next:"doc_day1_kill_enemy"} ] },
    doc_day1_save_enemy: { text: "医者仁心，你救了他。他醒后留下了一把手术刀作为谢礼离开。", choices: [ {text:"收下", next:"doc_day2_morning", effect: {addItem: "手术刀"}} ] },
    doc_day1_kill_enemy: { text: "你看着他失血过多而死。", choices: [ {text:"处理尸体", next:"doc_day2_morning", effect: {sanity: -5}} ] },

    doc_day2_morning: { text: "第二天。药品告急。", choices: [ {text:"去被炸毁的药店寻找", next:"doc_day2_search"}, {text:"尝试用草药替代", next:"doc_day2_herb"} ] },
    doc_day2_search: { text: "你在废墟中找到一些止痛药，但被流弹擦伤。", choices: [ {text:"包扎自己", next:"doc_day2_noon", effect: {health: -10, addItem: "止痛药"}} ] },
    doc_day2_herb: { text: "你在教堂后院找到一些止血草。", choices: [ {text:"制作草药", next:"doc_day2_noon", effect: {addItem: "草药"}} ] },
    doc_day2_noon: { text: "一名孕妇即将临盆。", choices: [ {text:"接生", next:"doc_day2_birth"}, {text:"由于没有设备放弃", next:"doc_day2_fail"} ] },
    doc_day2_birth: { text: "在简陋的环境下，新生命诞生了。", choices: [ {text:"感到希望", next:"doc_day2_night", effect: {sanity: 20}} ] },
    doc_day2_fail: { text: "孕妇难产而死。", choices: [ {text:"绝望", next:"doc_day2_night", effect: {sanity: -20}} ] },
    doc_day2_night: { text: "你累得在手术台上睡着了。", choices: [ {text:"睡觉", next:"doc_day3_morning"} ] },

    doc_day3_morning: { text: "第三天。伤口感染开始在伤员中蔓延。", choices: [ {text:"隔离感染者", next:"doc_day3_iso"}, {text:"截肢保命", next:"doc_day3_cut"} ] },
    doc_day3_iso: { text: "家属反对隔离，引发了骚乱。", choices: [ {text:"强行隔离", next:"doc_day3_riot"}, {text:"妥协", next:"doc_day3_plague"} ] },
    doc_day3_cut: { text: "你不得不进行多台截肢手术。", choices: [ {text:"麻木", next:"doc_day3_night", effect: {sanity: -10}} ] },
    doc_day3_riot: { text: "骚乱中你被打伤。", choices: [ {text:"忍痛工作", next:"doc_day3_night", effect: {health: -10}} ] },
    doc_day3_plague: { text: "感染失控，更多人死去了。", choices: [ {text:"无力回天", next:"doc_day3_night"} ] },
    doc_day3_night: { text: "你听到教堂外有挖掘的声音。", choices: [ {text:"查看", next:"doc_day3_peek"}, {text:"无视", next:"doc_day4_morning"} ] },
    doc_day3_peek: { text: "日军正在挖掘战壕，似乎准备长期围困。", choices: [ {text:"回屋", next:"doc_day4_morning"} ] },

    doc_day4_morning: { text: "第四天。食物和水都断绝了。", choices: [ {text:"杀马充饥", next:"doc_day4_horse"}, {text:"喝圣水", next:"doc_day4_water"} ] },
    doc_day4_horse: { text: "那是运送伤员的马。", choices: [ {text:"为了生存", next:"doc_day4_noon", effect: {health: 10}} ] },
    doc_day4_water: { text: "圣水缸里也快干了。", choices: [ {text:"祈祷", next:"doc_day4_noon"} ] },
    doc_day4_noon: { text: "日军冲进了教堂。", choices: [ {text:"站出来保护伤员", next:"ending_doctor_hero"}, {text:"混入伤员中", next:"doc_day4_hide"} ] },
    doc_day4_hide: { text: "日军开始屠杀伤员。", choices: [ {text:"闭上眼", next:"ending_doctor_massacre"} ] },

    ending_doctor_hero: { text: "系统：你身穿白大褂挡在伤员面前，被日军刺刀刺穿（医生结局5）", choices: [] },
    ending_doctor_massacre: { text: "系统：你和所有伤员一起被机枪扫射而死（医生结局6）", choices: [] },

    doctor_west: { text: "西门守卫森严，一名士兵发现了你。", choices: [ {text:"用药品贿赂", next:"doctor_bribe", condition: {hasItem: "药品"}}, {text:"假装路过", next:"ending_doctor_caught"} ] },
    doctor_bribe: { text: "你递出药品，士兵收下后放行。", choices: [ {text:"离开", next:"ending_doctor_west_escape"} ] },

    doctor_river: { text: "河边有伤者需要急救，他家人求你帮忙。", choices: [ {text:"救治他", next:"doctor_river_help"}, {text:"无视离开", next:"doctor_river_boat"} ] },
    doctor_river_help: { text: "你救治了伤者，他们感谢地让出一条小船。", choices: [ {text:"乘船逃离", next:"ending_doctor_river_escape"}, {text:"返回教堂", next:"doctor_church"} ] },
    doctor_river_boat: { text: "你找到一条空船。", choices: [ {text:"划船离开", next:"ending_doctor_river_escape"}, {text:"返回", next:"doctor_church"} ] },

    ending_doctor_safe: { text: "系统：你留在教堂救人，最后被日军坑杀（医生结局1）", choices: [] },
    ending_doctor_west_escape: { text: "系统：药品被扔在地上，你被射杀（医生结局2）", choices: [] },
    ending_doctor_river_escape: { text: "系统：逃跑途中翻船了，你被淹死了（医生结局3）", choices: [] },
    ending_doctor_caught: { text: "系统：你被巡逻士兵抓住并射杀（医生结局4）", choices: [] }
},
商人: {
    start: { text: "你是一名商人，战争让你的商铺变得破败。你需要决定是保住财富还是活命。", choices: [ {text:"收集剩余货物", next:"merchant_collect"}, {text:"带上金银逃跑", next:"merchant_escape_plan"}, {text:"去教堂避难", next:"merchant_church"} ] },

    merchant_collect: { text: "你翻找商铺，发现一些布匹和罐头。你必须做出选择，背包空间有限。", choices: [ {text:"带上布匹(高价值)", next:"merchant_market", effect: {addItem: "布匹"}}, {text:"带上罐头(生存)", next:"merchant_market", effect: {addItem: "罐头"}}, {text:"带上藏在暗格的金条", next:"merchant_market", effect: {addItem: "金条"}} ] },
    merchant_market: { text: "你准备去黑市换取情报。", choices: [ {text:"去黑市", next:"merchant_blackmarket"}, {text:"改去河边", next:"merchant_river"} ] },
    merchant_blackmarket: { text: "黑市上有一群陌生人，他们对你的货物虎视眈眈。", choices: [ {text:"用货物换情报", next:"merchant_info", condition: {hasItem: "布匹"}}, {text:"用金条换情报", next:"merchant_info_gold", condition: {hasItem: "金条"}}, {text:"拒绝交易", next:"merchant_danger"} ] },
    merchant_info: { text: "你换得一张西门守军贿赂名单。", choices: [ {text:"去西门", next:"merchant_west"}, {text:"回家藏货", next:"merchant_hide"} ] },
    merchant_info_gold: { text: "金条让对方眼红，他们给了你情报，但似乎想黑吃黑。", choices: [ {text:"赶紧离开", next:"merchant_chase"}, {text:"雇佣保镖", next:"merchant_bodyguard", condition: {hasItem: "金条"}} ] },
    merchant_chase: { text: "你在巷子里狂奔，后面有人追赶。", choices: [ {text:"躲进垃圾桶", next:"merchant_hide_trash"}, {text:"跑向教堂", next:"merchant_church"} ] },
    merchant_hide_trash: { text: "你躲过了一劫，但浑身恶臭。", choices: [ {text:"前往西门", next:"merchant_west"} ] },
    merchant_bodyguard: { text: "你用剩下的金子雇佣了一名流浪武师。", choices: [ {text:"前往西门", next:"merchant_west_safe"} ] },
    merchant_west_safe: { text: "有保镖护送，你安全到达西门。", choices: [ {text:"贿赂守卫", next:"ending_merchant_west_escape"} ] },

    merchant_danger: { text: "他们试图抢劫你。", choices: [ {text:"交出货物", next:"merchant_info"}, {text:"反抗", next:"ending_merchant_dead"} ] },
    merchant_hide: { text: "你带着货物回到家，但街上越来越危险。", choices: [ {text:"继续躲藏", next:"merchant_day1_start"}, {text:"换条路走", next:"merchant_river"} ] },

    // 商人-资产保卫战分支 (Day 1-5)
    merchant_day1_start: { text: "第一天。你决定死守家中的财物，等待局势好转。", choices: [ {text:"加固门窗", next:"merch_day1_fortify"}, {text:"清点库存", next:"merch_day1_stock"} ] },
    merch_day1_fortify: { text: "你用木板封死了窗户。", choices: [ {text:"休息", next:"merch_day1_night"} ] },
    merch_day1_stock: { text: "你还有不少罐头和烟酒。", choices: [ {text:"休息", next:"merch_day1_night"} ] },
    merch_day1_night: { text: "有人在撬你的门。", choices: [ {text:"大声呵斥", next:"merch_day1_shout"}, {text:"从后门逃跑", next:"merchant_river"} ] },
    merch_day1_shout: { text: "撬门声停止了。", choices: [ {text:"警惕", next:"merch_day2_morning"} ] },

    merch_day2_morning: { text: "第二天。一名日本军官带着翻译来到你家。", choices: [ {text:"开门迎接", next:"merch_day2_welcome"}, {text:"装作没人", next:"merch_day2_ignore"} ] },
    merch_day2_welcome: { text: "军官看中了你的古董花瓶。", choices: [ {text:"献上花瓶", next:"merch_day2_gift"}, {text:"开高价", next:"merch_day2_bargain"} ] },
    merch_day2_gift: { text: "军官很高兴，给了你一张‘良民证’。", choices: [ {text:"收下", next:"merch_day2_night", effect: {addItem: "良民证"}} ] },
    merch_day2_bargain: { text: "军官大怒，拔出了刀。", choices: [ {text:"求饶", next:"merch_day2_gift"}, {text:"反抗", next:"ending_merchant_dead"} ] },
    merch_day2_ignore: { text: "士兵破门而入，发现你在家。", choices: [ {text:"被捕", next:"ending_merchant_caught"} ] },
    merch_day2_night: { text: "有了良民证，你暂时安全了。", choices: [ {text:"睡觉", next:"merch_day3_morning"} ] },

    merch_day3_morning: { text: "第三天。你可以凭证件在部分区域活动。", choices: [ {text:"去黑市倒卖物资", next:"merch_day3_trade"}, {text:"去教堂捐赠", next:"merchant_church"} ] },
    merch_day3_trade: { text: "你用烟酒换来了大量金条。", choices: [ {text:"贪婪", next:"merch_day3_night", effect: {addItem: "大量金条"}} ] },
    merch_day3_night: { text: "你抱着金条入睡，但内心充满恐惧。", choices: [ {text:"失眠", next:"merch_day4_morning", effect: {sanity: -10}} ] },

    merch_day4_morning: { text: "第四天。全城开始大屠杀，良民证也不管用了。", choices: [ {text:"带着金条逃跑", next:"merch_day4_run"}, {text:"抛弃财物逃跑", next:"merch_day4_light"} ] },
    merch_day4_run: { text: "金条太重，你跑不快。", choices: [ {text:"被追上", next:"ending_merchant_rich_death"} ] },
    merch_day4_light: { text: "你扔掉了所有积蓄，只求活命。", choices: [ {text:"躲进废墟", next:"merch_day5_morning"} ] },

    merch_day5_morning: { text: "第五天。你一无所有，但还活着。", choices: [ {text:"混入难民队伍", next:"ending_merchant_survive"} ] },

    ending_merchant_rich_death: { text: "系统：你抱着金条被日军追上刺死，财物被抢走（商人结局9）", choices: [] },
    ending_merchant_survive: { text: "系统：你失去了所有财富，作为乞丐活了下来（商人结局10）", choices: [] },

    merchant_escape_plan: { text: "你拿出一些金银首饰，打算用来贿赂士兵。", choices: [ {text:"去东门", next:"merchant_east"}, {text:"去西门", next:"merchant_west"} ] },
    merchant_east: { text: "东门士兵有些松懈。", choices: [ {text:"拿出金银贿赂", next:"ending_merchant_east_escape", condition: {hasItem: "金银"}}, {text:"改走河边", next:"merchant_river"} ] },
    merchant_west: { text: "西门士兵盘查严格。", choices: [ {text:"贿赂士兵", next:"ending_merchant_west_escape", condition: {hasItem: "金银"}}, {text:"寻找秘密通道", next:"merchant_secret"} ] },
    merchant_secret: { text: "你跟随线人发现一条小巷。", choices: [ {text:"跟随线人进入", next:"ending_merchant_secret_escape"}, {text:"独自寻找其他路线", next:"ending_merchant_dead"} ] },

    merchant_church: { text: "教堂内有许多难民，修女对你随身的珠宝很在意。", choices: [ {text:"捐出一些珠宝", next:"merchant_church_help", condition: {hasItem: "金银"}}, {text:"拒绝捐赠", next:"merchant_river"} ] },
    merchant_church_help: { text: "修女感谢你，告诉你安全路线。", choices: [ {text:"沿路线逃生", next:"ending_merchant_safe"} ] },

    merchant_river: { text: "河边有船夫正在等待。", choices: [ {text:"用金银买船", next:"ending_merchant_river_escape", condition: {hasItem: "金银"}}, {text:"寻找偷渡船", next:"merchant_boat_search"} ] },
    merchant_boat_search: { text: "你找到一条破船，必须修理才能用。", choices: [ {text:"修理破船", next:"ending_merchant_river2_escape"}, {text:"放弃", next:"merchant_river"} ] },

    ending_merchant_safe: { text: "系统：你被城外日军砍杀（商人结局1）", choices: [] },
    ending_merchant_east_escape: { text: "系统：你从东门逃出,被日军炸死（商人结局2）", choices: [] },
    ending_merchant_west_escape: { text: "系统：你用金银从西门脱身，遇到日军被射杀（商人结局3）", choices: [] },
    ending_merchant_river_escape: { text: "系统：你在长江被日军飞机扫射致死（商人结局4）", choices: [] },
    ending_merchant_river2_escape: { text: "系统：你修船时被人背后偷袭致死（商人结局5）", choices: [] },
    ending_merchant_secret_escape: { text: "系统：你沿秘密通道离开城市，逃亡途中被飞机炸死（商人结局6）", choices: [] },
    ending_merchant_dead: { text: "系统：你在混乱中被土匪杀害（商人结局7）", choices: [] },
    ending_merchant_caught: { text: "系统：你被日军抓住集体枪毙（商人结局8）", choices: [] }
},
农夫: {
    start: { text: "你是一名农夫，平日里在城郊种地。日军入侵后，你被困在城内。", choices: [ {text:"带上锄头防身", next:"farmer_tool", effect: {addItem: "锄头"}}, {text:"寻找食物", next:"farmer_food"}, {text:"去找家人", next:"farmer_family"} ] },

    farmer_tool: { text: "你拿起锄头，这不仅是工具，也是武器。你决定找个地方安顿下来。", choices: [ {text:"寻找废弃院落", next:"farmer_day1_start"} ] },

    // 农夫-生存循环 (Day 1-5)
    farmer_day1_start: { text: "第一天。你找到一处带院子的废墟。虽然破败，但土地还在。", choices: [ {text:"翻整土地", next:"farmer_day1_work"}, {text:"加固围墙", next:"farmer_day1_wall"} ] },
    farmer_day1_work: { text: "你出于本能翻整了土地，发现了一些被埋藏的红薯。", choices: [ {text:"烤红薯", next:"farmer_day1_night", effect: {health: 5, addItem: "红薯"}}, {text:"留作种子", next:"farmer_day1_night", effect: {sanity: 5}} ] },
    farmer_day1_wall: { text: "你用碎砖加固了围墙，更有安全感了。", choices: [ {text:"休息", next:"farmer_day1_night", effect: {sanity: 5}} ] },
    farmer_day1_night: { text: "夜晚，你睡在自己整理的角落里，听着外面的炮火声。", choices: [ {text:"睡觉", next:"farmer_day2_morning"} ] },

    farmer_day2_morning: { text: "第二天。有人路过你的院子，看起来很饿。", choices: [ {text:"分给他红薯", next:"farmer_day2_share", condition: {hasItem: "红薯"}}, {text:"赶走他", next:"farmer_day2_shoo"}, {text:"邀请他帮忙", next:"farmer_day2_help"} ] },
    farmer_day2_share: { text: "那人感激涕零，告诉你附近日军的巡逻规律。", choices: [ {text:"记下", next:"farmer_day2_night", effect: {sanity: 5}} ] },
    farmer_day2_shoo: { text: "那人骂骂咧咧地走了。", choices: [ {text:"无视", next:"farmer_day2_night"} ] },
    farmer_day2_help: { text: "那人是个泥瓦匠，帮你修补了屋顶。", choices: [ {text:"感谢", next:"farmer_day2_night"} ] },
    farmer_day2_night: { text: "有了屋顶/围墙，今晚睡得安稳些。", choices: [ {text:"睡觉", next:"farmer_day3_morning"} ] },

    farmer_day3_morning: { text: "第三天。一队日军征用劳工搬运物资。", choices: [ {text:"主动加入", next:"farmer_day3_labor"}, {text:"躲藏", next:"farmer_day3_hide"} ] },
    farmer_day3_labor: { text: "你凭借力气干活，日军给了你一个饭团，没有杀你。", choices: [ {text:"吃掉", next:"farmer_day3_night", effect: {health: 10}}, {text:"藏起来", next:"farmer_day3_night", effect: {addItem: "饭团"}} ] },
    farmer_day3_hide: { text: "你躲在地窖里，听着上面日军抓人的惨叫声。", choices: [ {text:"发抖", next:"farmer_day3_night", effect: {sanity: -10}} ] },
    farmer_day3_night: { text: "你活过了又一天。", choices: [ {text:"睡觉", next:"farmer_day4_morning"} ] },

    farmer_day4_morning: { text: "第四天。你在翻地时挖出了一箱金条。", choices: [ {text:"占为己有", next:"farmer_day4_gold", effect: {addItem: "金条"}}, {text:"埋回去", next:"farmer_day4_bury"} ] },
    farmer_day4_gold: { text: "你从未见过这么多钱，心跳加速。", choices: [ {text:"藏好", next:"farmer_day4_night"} ] },
    farmer_day4_bury: { text: "乱世黄金不如粮，你觉得这是祸害。", choices: [ {text:"继续种地", next:"farmer_day4_night", effect: {sanity: 5}} ] },
    farmer_day4_night: { text: "明天必须离开了，战火越来越近。", choices: [ {text:"准备行囊", next:"farmer_day5_morning"} ] },

    farmer_day5_morning: { text: "第五天。全城大搜捕开始了。", choices: [ {text:"带上金条逃跑", next:"farmer_day5_gold_run", condition: {hasItem: "金条"}}, {text:"带上锄头突围", next:"farmer_day5_fight"}, {text:"装作尸体", next:"farmer_day5_fake"} ] },
    farmer_day5_gold_run: { text: "你背着沉重的金条跑不快，被日军追上。", choices: [ {text:"交出金条求饶", next:"ending_farmer_gold_death"}, {text:"反抗", next:"ending_farmer_gold_death"} ] },
    farmer_day5_fight: { text: "你挥舞锄头击倒了一名士兵，抢夺了枪支。", choices: [ {text:"冲出城门", next:"ending_farmer_hero"} ] },
    farmer_day5_fake: { text: "你躺在死人堆里，日军在补枪。", choices: [ {text:"屏住呼吸", next:"ending_farmer_survive"}, {text:"忍不住动了", next:"ending_farmer_caught"} ] },

    ending_farmer_gold_death: { text: "系统：日军抢走了金条，并把你当做小偷枪毙（农夫结局11）", choices: [] },
    ending_farmer_hero: { text: "系统：你杀出一条血路，虽然身负重伤但成功逃脱（农夫结局12）", choices: [] },
    ending_farmer_survive: { text: "系统：你在尸体堆里躲过了搜查，夜晚爬出了城（农夫结局13）", choices: [] },

    farmer_east: { text: "东门守卫严密。", choices: [ {text:"尝试贿赂", next:"farmer_bribe", condition: {hasItem: "钱币"}}, {text:"寻找其他路", next:"farmer_west"} ] },
    farmer_bribe: { text: "你拿出仅有的铜钱。", choices: [ {text:"全部给出", next:"ending_farmer_east_escape"}, {text:"放弃", next:"farmer_west"} ] },

    farmer_west: { text: "西门周围有几名士兵巡逻。", choices: [ {text:"躲在车后", next:"farmer_hide_west"}, {text:"试着混过去", next:"ending_farmer_caught"} ] },
    farmer_hide_west: { text: "你趁士兵不注意从旁边的小道溜出去。", choices: [ {text:"成功逃出", next:"ending_farmer_west_escape"} ] },

    farmer_church: { text: "教堂里有修女安抚难民，她问你是否愿意帮忙耕地换食物。", choices: [ {text:"答应", next:"farmer_help_church"}, {text:"拒绝", next:"farmer_river"} ] },
    farmer_help_church: { text: "你在教堂花园种下蔬菜，获得修女信任。", choices: [ {text:"跟随修女逃生", next:"ending_farmer_safe"}, {text:"自己找路", next:"farmer_river"} ] },

    farmer_river: { text: "河边有村民正在修船。", choices: [ {text:"帮忙修船", next:"farmer_boat"}, {text:"自己找船", next:"farmer_find_boat"} ] },
    farmer_boat: { text: "你帮忙修好船，获得上船资格。", choices: [ {text:"随船离开", next:"ending_farmer_river_escape"} ] },
    farmer_find_boat: { text: "你找到一条小木船。", choices: [ {text:"独自划走", next:"ending_farmer_river_escape"}, {text:"放弃", next:"farmer_west"} ] },

    ending_farmer_safe: { text: "系统：你留在教堂，被日军坑杀（农夫结局1）", choices: [] },
    ending_farmer_secret: { text: "系统：你沿秘密小路逃出，被城外日军射杀（农夫结局2）", choices: [] },
    ending_farmer_east_escape: { text: "系统：你贿赂士兵从东门逃出，被城外日军射杀（农夫结局3）", choices: [] },
    ending_farmer_west_escape: { text: "系统：你从西门小道溜出，被城墙上方士兵射杀（农夫结局4）", choices: [] },
    ending_farmer_river_escape: { text: "系统：你在船上被日军飞机扫射死亡（农夫结局5）", choices: [] },
    ending_farmer_caught: { text: "系统：你被巡逻士兵抓住并射杀（农夫结局6）", choices: [] }
},
地下党员: {
    start: { text: "你是一名潜伏在城内的地下党员，任务是搜集情报并保护平民。", choices: [ {text:"联系组织", next:"agent_contact"}, {text:"独自行动", next:"agent_alone"}, {text:"前往秘密据点", next:"agent_hideout"} ] },

    agent_contact: { text: "你通过暗号与一名信使见面，他交给你一份情报。", choices: [ {text:"藏好情报", next:"agent_hide_info", effect: {addItem: "情报"}}, {text:"立即传送情报", next:"agent_risk"} ] },
    agent_hide_info: { text: "你将情报藏在旧书中。晚上有人来敲门。", choices: [ {text:"开门", next:"agent_meet_friend"}, {text:"不开门", next:"agent_wait"} ] },
    agent_meet_friend: { text: "是组织派来的同志，他带你去一个安全屋。", choices: [ {text:"前往安全屋", next:"agent_safehouse"} ] },
    agent_wait: { text: "你选择不开门，第二天有士兵在附近巡逻。", choices: [ {text:"躲在屋内", next:"ending_agent_caught"}, {text:"转移", next:"agent_hideout"} ] },

    agent_risk: { text: "你准备把情报交给教堂的联系人，但路上有士兵。", choices: [ {text:"绕路", next:"agent_church"}, {text:"假装平民", next:"agent_check"} ] },
    agent_check: { text: "士兵盘查你的物品。", choices: [ {text:"将情报藏进衣服", next:"agent_escape"}, {text:"硬闯", next:"ending_agent_caught"} ] },
    agent_escape: { text: "你幸运地躲过盘查，继续赶往教堂。", choices: [ {text:"抵达教堂", next:"agent_church"} ] },

    agent_alone: { text: "你独自走在街道上，发现一名同志被捕。", choices: [ {text:"尝试营救", next:"agent_rescue"}, {text:"暗中跟随", next:"agent_follow"} ] },
    agent_rescue: { text: "你与士兵交火，成功救下同志，但自己受伤。", choices: [ {text:"回安全屋", next:"agent_safehouse"}, {text:"去教堂求助", next:"agent_church"} ] },
    agent_follow: { text: "你跟着士兵来到西门岗哨。", choices: [ {text:"潜入岗哨", next:"agent_infiltrate"}, {text:"返回", next:"agent_hideout"} ] },
    agent_infiltrate: { text: "你潜入岗哨发现了敌军调动计划。", choices: [ {text:"带走计划", next:"ending_agent_win", effect: {addItem: "调动计划"}}, {text:"销毁计划", next:"ending_agent_fail"} ] },

    agent_hideout: { text: "秘密据点里有几位同志在整理情报。书记告诉你，组织需要你在城内潜伏五天，配合即将到来的反攻。", choices: [ {text:"接受任务", next:"agent_day1_start"}, {text:"表示太危险", next:"agent_church"} ] },

    // 地下党员-潜伏任务分支 (Day 1-5)
    agent_day1_start: { text: "第一天。你需要一个伪装身份。", choices: [ {text:"伪装成车夫", next:"agent_day1_rickshaw"}, {text:"伪装成乞丐", next:"agent_day1_beggar"} ] },
    agent_day1_rickshaw: { text: "你拉着黄包车在街头穿梭，观察日军动向。", choices: [ {text:"拉一名日本军官", next:"agent_day1_officer"}, {text:"拉一名富商", next:"agent_day1_merchant"} ] },
    agent_day1_officer: { text: "军官在车上谈论着‘南门’和‘午夜’。", choices: [ {text:"记下情报", next:"agent_day1_night", effect: {addItem: "口头情报"}} ] },
    agent_day1_merchant: { text: "富商给了你不少赏钱。", choices: [ {text:"收下", next:"agent_day1_night", effect: {addItem: "钱币"}} ] },
    agent_day1_beggar: { text: "你衣衫褴褛地坐在路边。", choices: [ {text:"观察哨所", next:"agent_day1_watch"}, {text:"向士兵乞讨", next:"agent_day1_beg"} ] },
    agent_day1_watch: { text: "你摸清了哨兵的换岗规律。", choices: [ {text:"记下", next:"agent_day1_night", effect: {addItem: "换岗规律"}} ] },
    agent_day1_beg: { text: "士兵踢了你一脚。", choices: [ {text:"忍耐", next:"agent_day1_night", effect: {health: -5}} ] },
    agent_day1_night: { text: "夜深了，你回到据点汇报。", choices: [ {text:"汇报情报", next:"agent_day2_morning"}, {text:"休息", next:"agent_day2_morning"} ] },

    agent_day2_morning: { text: "第二天。上级要求你破坏敌人的通讯线路。", choices: [ {text:"前往电报局", next:"agent_day2_office"}, {text:"破坏路边电话线", next:"agent_day2_wire"} ] },
    agent_day2_office: { text: "电报局守卫森严。", choices: [ {text:"乔装进入", next:"agent_day2_disguise"}, {text:"放弃", next:"agent_day2_fail"} ] },
    agent_day2_disguise: { text: "你假装成维修工混了进去，剪断了主电缆。", choices: [ {text:"撤离", next:"agent_day2_success"} ] },
    agent_day2_wire: { text: "你在偏僻路段剪断了电话线。", choices: [ {text:"撤离", next:"agent_day2_success"} ] },
    agent_day2_success: { text: "任务完成，敌人的指挥陷入短暂混乱。", choices: [ {text:"回据点", next:"agent_day2_night"} ] },
    agent_day2_fail: { text: "你没能完成任务，组织对你表示失望。", choices: [ {text:"回据点", next:"agent_day2_night"} ] },
    agent_day2_night: { text: "今晚全城戒严。", choices: [ {text:"睡觉", next:"agent_day3_morning"} ] },

    agent_day3_morning: { text: "第三天。组织发现了一名叛徒。", choices: [ {text:"执行锄奸任务", next:"agent_day3_kill"}, {text:"负责转移据点", next:"agent_day3_move"} ] },
    agent_day3_kill: { text: "你跟踪叛徒到了茶馆。", choices: [ {text:"下毒", next:"agent_day3_poison"}, {text:"暗巷刺杀", next:"agent_day3_stab", condition: {hasItem: "手术刀"}} ] }, // 手术刀可能来自医生线，这里假设通用物品或之前获得
    agent_day3_poison: { text: "你在他的茶里下了毒。", choices: [ {text:"确认死亡后离开", next:"agent_day3_done"} ] },
    agent_day3_stab: { text: "你干净利落地解决了叛徒。", choices: [ {text:"离开", next:"agent_day3_done"} ] },
    agent_day3_move: { text: "你协助同志们搬运文件。", choices: [ {text:"销毁带不走的", next:"agent_day3_done"} ] },
    agent_day3_done: { text: "危机暂时解除。", choices: [ {text:"休息", next:"agent_day4_morning"} ] },

    agent_day4_morning: { text: "第四天。决战前夕，需要刺杀日军大佐。", choices: [ {text:"狙击", next:"agent_day4_sniper", condition: {hasItem: "步枪"}}, {text:"自杀式袭击", next:"agent_day4_bomb"} ] },
    agent_day4_sniper: { text: "你埋伏在高楼，瞄准了大佐。", choices: [ {text:"开枪", next:"agent_day4_shot"} ] },
    agent_day4_shot: { text: "一击毙命！全城警报大作。", choices: [ {text:"撤退", next:"agent_day5_morning"} ] },
    agent_day4_bomb: { text: "你绑上炸药，冲向大佐的座驾。", choices: [ {text:"引爆", next:"ending_agent_hero"} ] },

    agent_day5_morning: { text: "第五天。日军疯狂搜捕刺客。", choices: [ {text:"躲在下水道", next:"agent_day5_sewer"}, {text:"强行突围", next:"ending_agent_caught"} ] },
    agent_day5_sewer: { text: "你在下水道躲了一整天，直到外面枪声平息。", choices: [ {text:"等待黎明", next:"ending_agent_survive"} ] },

    ending_agent_hero: { text: "系统：你与日军大佐同归于尽，你的名字将永垂不朽（地下党员结局9）", choices: [] },
    ending_agent_survive: { text: "系统：你成功活了下来，继续在黑暗中战斗（地下党员结局10）", choices: [] },

    agent_church: { text: "你顺利抵达教堂，此处比较安全。", choices: [ {text:"寻找联系人", next:"agent_safehouse2"}, {text:"躲在此处", next:"ending_agent_caught"} ] },
    agent_safehouse: { text: "安全屋内，同志们正在策划突袭。", choices: [ {text:"加入突袭", next:"ending_agent_action"}, {text:"转移情报", next:"ending_agent_win"} ] },
    agent_safehouse2: { text: "你在伤员中找到联系人，并知道了一个安全屋。", choices: [ {text:"告诉敌人", next:"ending_agent_hanjian"}, {text:"躲在此处", next:"ending_agent_caught"}, {text:"前往寻找", next:"agent_safehouse"} ] },

    ending_agent_win: { text: "系统：你成功将情报送出，组织的行动取得胜利（地下党员结局1）", choices: [] },
    ending_agent_fail: { text: "系统：你销毁了情报，错失良机，自己被日军抓获并砍头（地下党员结局2）", choices: [] },
    ending_agent_river_escape: { text: "系统：你不了解水性，船翻了，你被淹死了（地下党员结局3）", choices: [] },
    ending_agent_east_escape: { text: "系统：你用贿赂逃出东门，全是日军，你被射杀了（地下党员结局4）", choices: [] },
    ending_agent_secret_escape: { text: "系统：你在地下迷路，被困死（地下党员结局5）", choices: [] },
    ending_agent_action: { text: "系统：你在突袭中壮烈牺牲（地下党员结局6）", choices: [] },
    ending_agent_hanjian: { text: "系统：你当了狗汉奸，在睡梦中被勒死（地下党员结局7）", choices: [] },
    ending_agent_caught: { text: "系统：你被日军抓获并砍头（地下党员结局8）", choices: [] }
},
孤儿: {
    start: { text: "你是一个失去家人的孤儿，独自徘徊在被毁的街道上。你必须找到安全的地方。", choices: [ {text:"去废墟找食物", next:"orphan_ruin"}, {text:"寻找教堂庇护", next:"orphan_church"}, {text:"跟随难民队伍", next:"orphan_refugee"} ] },

    orphan_ruin: { text: "你在废墟中翻找，发现一只破旧的木盒。", choices: [ {text:"打开木盒", next:"orphan_box"}, {text:"放弃继续找", next:"orphan_more_search"} ] },
    orphan_box: { text: "木盒里有一块面包和一张手写的地图。", choices: [ {text:"吃掉面包", next:"orphan_map", effect: {changeHealth: 10}}, {text:"留着面包", next:"orphan_map", effect: {addItem: "面包"}} ] },
    orphan_more_search: { text: "你没找到更多食物，反而惊动了附近的士兵。", choices: [ {text:"躲起来", next:"orphan_hide_ruin"}, {text:"跑走", next:"ending_orphan_caught"} ] },
    orphan_hide_ruin: { text: "你藏在石块后，士兵搜查了一会儿便离开。", choices: [ {text:"拿着地图走", next:"orphan_map", effect: {addItem: "地图"}} ] },
    orphan_map: { text: "地图显示河边有一条小路通往城外。", choices: [ {text:"前往河边", next:"orphan_river"}, {text:"先去教堂", next:"orphan_church"} ] },

    orphan_church: { text: "教堂里有修女和难民，她看到你很可怜，递给你一块面包。", choices: [ {text:"留下", next:"orphan_church_stay"}, {text:"感谢后离开", next:"orphan_river", effect: {addItem: "面包"}} ] },
    orphan_church_stay: { text: "你在教堂过夜，听到修女说河边有船只。但你觉得教堂也不安全。", choices: [ {text:"第二天去河边", next:"orphan_river"}, {text:"继续留在教堂", next:"ending_orphan_safe"}, {text:"开始流浪生活", next:"orphan_day1_start"} ] },

    // 孤儿-流浪生存分支 (Day 1-5)
    orphan_day1_start: { text: "第一天。你决定靠自己活下去。你需要一个藏身之处。", choices: [ {text:"桥洞下", next:"orphan_day1_bridge"}, {text:"废弃狗窝", next:"orphan_day1_doghouse"} ] },
    orphan_day1_bridge: { text: "桥洞下很冷，但能避雨。", choices: [ {text:"缩成一团", next:"orphan_day1_night", effect: {health: -5}} ] },
    orphan_day1_doghouse: { text: "狗窝虽然小，但铺着干草，很暖和。", choices: [ {text:"钻进去", next:"orphan_day1_night", effect: {health: 5}} ] },
    orphan_day1_night: { text: "夜晚，你听到巡逻队的脚步声。", choices: [ {text:"屏住呼吸", next:"orphan_day2_morning"} ] },

    orphan_day2_morning: { text: "第二天。肚子饿得咕咕叫。", choices: [ {text:"去街上乞讨", next:"orphan_day2_beg"}, {text:"去市场偷窃", next:"orphan_day2_steal"} ] },
    orphan_day2_beg: { text: "你跪在路边，大部分人无视你。", choices: [ {text:"坚持乞讨", next:"orphan_day2_beg_result"} ] },
    orphan_day2_beg_result: { text: "一个好心的妇人给了你半个红薯。", choices: [ {text:"狼吞虎咽", next:"orphan_day2_night", effect: {health: 10}} ] },
    orphan_day2_steal: { text: "你盯上了一个卖烧饼的摊位。", choices: [ {text:"趁乱拿一个", next:"orphan_day2_steal_success"}, {text:"放弃", next:"orphan_day2_night"} ] },
    orphan_day2_steal_success: { text: "你成功偷到了烧饼，但被摊主追打。", choices: [ {text:"拼命跑", next:"orphan_day2_night", effect: {health: -5, addItem: "烧饼"}} ] },
    orphan_day2_night: { text: "你吃着得来的食物，感到一丝满足。", choices: [ {text:"睡觉", next:"orphan_day3_morning"} ] },

    orphan_day3_morning: { text: "第三天。你遇到了另一个流浪儿‘小石头’。", choices: [ {text:"和他结伴", next:"orphan_day3_friend"}, {text:"赶走他", next:"orphan_day3_alone"} ] },
    orphan_day3_friend: { text: "小石头告诉你，他知道一个秘密的地窖。", choices: [ {text:"跟他去", next:"orphan_day3_cellar"} ] },
    orphan_day3_cellar: { text: "地窖里藏着一些干粮和水。", choices: [ {text:"分享食物", next:"orphan_day3_night", effect: {sanity: 10}} ] },
    orphan_day3_alone: { text: "你独自一人，感到孤独。", choices: [ {text:"发呆", next:"orphan_day3_night", effect: {sanity: -5}} ] },
    orphan_day3_night: { text: "两个人挤在一起比一个人暖和多了。", choices: [ {text:"睡觉", next:"orphan_day4_morning"} ] },

    orphan_day4_morning: { text: "第四天。日军开始抓捕壮丁和劳工，连孩子也不放过。", choices: [ {text:"躲在地窖里", next:"orphan_day4_hide"}, {text:"出去探风", next:"orphan_day4_scout"} ] },
    orphan_day4_hide: { text: "你们在地窖里躲了一整天。", choices: [ {text:"忍耐饥饿", next:"orphan_day4_night", effect: {health: -5}} ] },
    orphan_day4_scout: { text: "你看到一队士兵正朝这边走来。", choices: [ {text:"跑回去报信", next:"orphan_day4_warn"}, {text:"自己逃跑", next:"orphan_day4_run_alone"} ] },
    orphan_day4_warn: { text: "你和小石头及时转移了。", choices: [ {text:"躲进下水道", next:"orphan_day5_morning"} ] },
    orphan_day4_run_alone: { text: "你抛弃了小石头，独自逃跑。", choices: [ {text:"愧疚", next:"orphan_day5_morning", effect: {sanity: -20}} ] },
    orphan_day4_night: { text: "外面全是抓人的声音。", choices: [ {text:"祈祷", next:"orphan_day5_morning"} ] },

    orphan_day5_morning: { text: "第五天。你们发现下水道通往城外。", choices: [ {text:"钻过铁栅栏", next:"orphan_day5_escape"}, {text:"寻找其他出口", next:"orphan_day5_search"} ] },
    orphan_day5_escape: { text: "因为身材瘦小，你们成功钻过了栅栏。", choices: [ {text:"重见天日", next:"ending_orphan_survive"} ] },
    orphan_day5_search: { text: "你们迷路了。", choices: [ {text:"继续找", next:"ending_orphan_lost"} ] },

    ending_orphan_survive: { text: "系统：你和小石头逃出了南京城，在战火中相依为命活了下来（孤儿结局5）", choices: [] },
    ending_orphan_lost: { text: "系统：你们在下水道中迷失方向，最终饿死（孤儿结局6）", choices: [] },

    orphan_refugee: { text: "你跟在一群难民身后，他们讨论西门是否能逃出去。", choices: [ {text:"跟去西门", next:"orphan_west"}, {text:"离开队伍去河边", next:"orphan_river"} ] },
    orphan_west: { text: "西门守军严密，难民中有人建议贿赂。", choices: [ {text:"凑钱贿赂", next:"ending_orphan_west_escape", condition: {hasItem: "钱币"}}, {text:"放弃改走河边", next:"orphan_river"} ] },

    orphan_river: { text: "河边停着一条小船。你太小无法单独撑船。", choices: [ {text:"等待他人", next:"orphan_wait_boat"}, {text:"尝试自己划", next:"orphan_try_boat"} ] },
    orphan_wait_boat: { text: "一个船夫经过，他问你是否有食物交换。", choices: [ {text:"给他面包", next:"ending_orphan_river_escape", condition: {hasItem: "面包"}}, {text:"没有食物", next:"orphan_try_boat"} ] },
    orphan_try_boat: { text: "你笨拙地推船下水，但力量不够。", choices: [ {text:"呼喊求助", next:"orphan_boat_help"}, {text:"放弃返回", next:"orphan_church"} ] },
    orphan_boat_help: { text: "一名陌生难民帮你上船。", choices: [ {text:"一起离开", next:"ending_orphan_river_escape"} ] },

    ending_orphan_safe: { text: "系统：你留在教堂，被日军坑杀（孤儿结局1）", choices: [] },
    ending_orphan_west_escape: { text: "系统：你跟随难民贿赂守军，被当场射杀（孤儿结局2）", choices: [] },
    ending_orphan_river_escape: { text: "系统：你搭乘的小船被日军飞机炸沉（孤儿结局3）", choices: [] },
    ending_orphan_caught: { text: "系统：你被士兵抓住并射杀（孤儿结局4）", choices: [] }
},
修女: {
    start: { text: "你是城中教堂的修女，战争让教堂成为了难民的避难所。你需要在保护信众和寻找出路之间做出抉择。", choices: [ {text:"帮助难民", next:"nun_help_refugees"}, {text:"与士兵交涉", next:"nun_negotiate"}, {text:"秘密寻找逃生路线", next:"nun_secret_route"} ] },

    nun_help_refugees: { text: "教堂里挤满了饥饿的难民，你需要分发有限的食物。", choices: [ {text:"平均分配", next:"nun_food_fair"}, {text:"优先照顾儿童", next:"nun_food_children"} ] },
    nun_food_fair: { text: "难民们对你的公平感到感激。", choices: [ {text:"组织祈祷", next:"nun_pray"}, {text:"带领他们逃生", next:"nun_escape_plan"} ] },
    nun_food_children: { text: "一些大人不满你的做法，教堂气氛紧张。", choices: [ {text:"安抚大人", next:"nun_persuade"}, {text:"无视他们", next:"nun_escape_plan"} ] },
    nun_persuade: { text: "你劝说他们团结一致，共同生存。", choices: [ {text:"他们被说服", next:"nun_pray"}, {text:"他们仍然愤怒", next:"nun_escape_plan"} ] },

    nun_pray: { text: "祈祷让大家暂时平静，但外面的炮火越来越近。", choices: [ {text:"准备撤离", next:"nun_escape_plan"}, {text:"继续坚守", next:"ending_nun_church_fall"} ] },
    nun_escape_plan: { text: "你决定带一部分人从教堂后门离开。", choices: [ {text:"走向西门", next:"nun_west"}, {text:"走向河边", next:"nun_river"} ] },

    nun_negotiate: { text: "听闻几名日军士兵走进教堂，你需要保护难民。", choices: [ {text:"与他们谈判", next:"nun_talk"}, {text:"躲避他们", next:"nun_hide"} ] },
    nun_talk: { text: "你走出房间，在院子里面对士兵。", choices: [ {text:"放他们进去", next:"nun_escape_plan"}, {text:"拒绝进入", next:"nun_resist"} ] },
    nun_resist: { text: "你张开双臂阻挡在士兵面前。", choices: [ {text:"不准进来", next:"ending_nun_caught"}, {text:"带领难民反抗", next:"ending_nun_caught2"} ] },
    nun_hide: { text: "你带着孩子们躲在地下室。", choices: [ {text:"等士兵离开", next:"nun_escape_plan"}, {text:"偷偷转移", next:"nun_river"} ] },

    nun_secret_route: { text: "你记得教堂旁的墓地下有一条古老的地道。", choices: [ {text:"进入地道", next:"nun_tunnel"}, {text:"暂时不走", next:"nun_help_refugees"} ] },
    nun_tunnel: { text: "地道昏暗潮湿，你带着几名孩子前行。", choices: [ {text:"继续走", next:"ending_nun_tunnel_escape"}, {text:"返回教堂", next:"nun_help_refugees"} ] },

    // 修女-信仰与救赎分支 (Day 1-5)
    nun_day1_start: { text: "第一天。你决定留在教堂，用信仰守护这片净土。你需要安抚恐慌的难民。", choices: [ {text:"带领大家祈祷", next:"nun_day1_pray"}, {text:"分发圣餐", next:"nun_day1_food"} ] },
    nun_day1_pray: { text: "祈祷声盖过了远处的炮火声，人们的心灵得到了片刻安宁。", choices: [ {text:"休息", next:"nun_day1_night", effect: {sanity: 10}} ] },
    nun_day1_food: { text: "食物不多了，你把自己的那份也分了出去。", choices: [ {text:"忍受饥饿", next:"nun_day1_night", effect: {health: -5}} ] },
    nun_day1_night: { text: "深夜，一名日军士兵闯入教堂忏悔室。", choices: [ {text:"倾听他的忏悔", next:"nun_day1_listen"}, {text:"把他赶出去", next:"nun_day1_reject"} ] },
    nun_day1_listen: { text: "他哭诉着自己的罪行，临走时留下了一袋米。", choices: [ {text:"收下", next:"nun_day2_morning", effect: {addItem: "米袋"}} ] },
    nun_day1_reject: { text: "他愤怒地离开了，你感到不安。", choices: [ {text:"祈祷", next:"nun_day2_morning"} ] },

    nun_day2_morning: { text: "第二天。教堂外聚集了更多难民，但大门快被挤破了。", choices: [ {text:"打开大门接纳", next:"nun_day2_open"}, {text:"只接纳妇孺", next:"nun_day2_limit"} ] },
    nun_day2_open: { text: "教堂里人满为患，卫生状况恶化。", choices: [ {text:"组织清洁", next:"nun_day2_clean"} ] },
    nun_day2_limit: { text: "被拒之门外的男人们在咒骂。", choices: [ {text:"心怀愧疚", next:"nun_day2_clean", effect: {sanity: -5}} ] },
    nun_day2_clean: { text: "你忙碌了一整天，精疲力尽。", choices: [ {text:"休息", next:"nun_day2_night", effect: {health: -5}} ] },
    nun_day2_night: { text: "你梦见天使在哭泣。", choices: [ {text:"醒来", next:"nun_day3_morning"} ] },

    nun_day3_morning: { text: "第三天。日军军官要求征用教堂。", choices: [ {text:"据理力争", next:"nun_day3_argue"}, {text:"顺从", next:"nun_day3_obey"} ] },
    nun_day3_argue: { text: "你引用国际公约，军官暂时退却，但眼神凶狠。", choices: [ {text:"加强戒备", next:"nun_day3_night"} ] },
    nun_day3_obey: { text: "难民们被赶到了院子里，许多人冻得瑟瑟发抖。", choices: [ {text:"分发衣物", next:"nun_day3_night"} ] },
    nun_day3_night: { text: "你听到院子里传来惨叫声。", choices: [ {text:"冲出去查看", next:"nun_day3_check"}, {text:"不敢出去", next:"nun_day4_morning"} ] },
    nun_day3_check: { text: "几名士兵正在施暴。", choices: [ {text:"阻止他们", next:"ending_nun_martyr"}, {text:"躲回屋内", next:"nun_day4_morning", effect: {sanity: -20}} ] },

    nun_day4_morning: { text: "第四天。教堂已经不再安全。", choices: [ {text:"带领大家突围", next:"nun_escape_plan"}, {text:"死守圣坛", next:"nun_day4_altar"} ] },
    nun_day4_altar: { text: "你和最后的信徒围坐在圣坛前。", choices: [ {text:"唱圣歌", next:"nun_day4_sing"} ] },
    nun_day4_sing: { text: "圣歌声中，大门被撞开。", choices: [ {text:"闭上眼睛", next:"ending_nun_church_fall"} ] },

    ending_nun_martyr: { text: "系统：你为了保护难民，被士兵残忍杀害，成为了殉道者（修女结局5）", choices: [] },

    nun_west: { text: "西门守卫发现了你们。", choices: [ {text:"请求通行", next:"nun_bribe_west"}, {text:"寻找小路", next:"nun_secret_path"} ] },
    nun_bribe_west: { text: "你用教堂的银十字架换取通行。", choices: [ {text:"通过西门", next:"ending_nun_west_escape"} ] },
    nun_secret_path: { text: "你找到一条小路通向西门外。", choices: [ {text:"偷偷离开", next:"ending_nun_west_escape"} ] },

    nun_river: { text: "河边有一条小船。难民请求你带他们一起走。", choices: [ {text:"同意带他们", next:"ending_nun_river_escape"}, {text:"只带孩子", next:"ending_nun_river_escape"} ] },

    ending_nun_church_fall: { text: "系统：你坚持留在教堂，最终与难民一同被日军坑杀（修女结局1）", choices: [] },
    ending_nun_west_escape: { text: "系统：你离开后遇上日军被凌辱（修女结局2）", choices: [] },
    ending_nun_river_escape: { text: "系统：你乘船被日军飞机炸毁（修女结局3）", choices: [] },
    ending_nun_tunnel_escape: { text: "系统：你带孩子掉入大坑溺亡（修女结局4）", choices: [] },
    ending_nun_caught: { text: "系统：你被士兵抓住并被凌辱（修女结局5）", choices: [] },
    ending_nun_caught2: { text: "系统：你和难民被士兵用机枪全部射杀（修女结局6）", choices: [] }
},
流浪汉: {
    start: { text: "你是城中的流浪汉，平日以捡拾残羹剩饭为生。战火中，你必须找到一条活路。", choices: [ {text:"去废墟找食物", next:"hobo_ruin"}, {text:"前往教堂", next:"hobo_church"}, {text:"沿河边行走", next:"hobo_river"} ] },

    hobo_ruin: { text: "你在废墟中翻找，发现一件破外套和一块干面包。", choices: [ {text:"穿上外套", next:"hobo_hide", effect: {addItem: "外套"}}, {text:"拿走面包", next:"hobo_hide", effect: {addItem: "面包"}} ] },
    hobo_hide: { text: "夜晚将至，你躲在破墙后。", choices: [ {text:"继续等待", next:"hobo_danger"}, {text:"出去看看", next:"hobo_street"} ] },
    hobo_danger: { text: "夜里有士兵搜查，听到他们的脚步声。", choices: [ {text:"屏住呼吸", next:"hobo_safe_night"}, {text:"逃跑", next:"ending_hobo_caught"} ] },
    hobo_safe_night: { text: "士兵离开了，你活过了这一夜。但你意识到，这样躲藏不是长久之计。", choices: [ {text:"开始流浪生存", next:"hobo_day1_start"}, {text:"第二天去教堂", next:"hobo_church"}, {text:"去河边", next:"hobo_river"} ] },

    // 流浪汉-极度生存挑战分支 (Day 1-5)
    hobo_day1_start: { text: "第一天。你比任何人都适应这种混乱，因为你本就一无所有。你需要寻找更隐蔽的住所。", choices: [ {text:"废弃下水道口", next:"hobo_day1_sewer"}, {text:"富人区垃圾房", next:"hobo_day1_trash"} ] },
    hobo_day1_sewer: { text: "这里虽然臭，但没人会来。", choices: [ {text:"安顿下来", next:"hobo_day1_night"} ] },
    hobo_day1_trash: { text: "垃圾房里或许能找到好东西。", choices: [ {text:"翻找", next:"hobo_day1_find"} ] },
    hobo_day1_find: { text: "你找到半瓶没喝完的红酒。", choices: [ {text:"喝掉暖身", next:"hobo_day1_night", effect: {sanity: 5, health: 2}}, {text:"留着", next:"hobo_day1_night", effect: {addItem: "红酒"}} ] },
    hobo_day1_night: { text: "夜晚，寒风刺骨。你只有一件单薄的衣服。", choices: [ {text:"缩成一团", next:"hobo_day2_morning", effect: {health: -5}} ] },

    hobo_day2_morning: { text: "第二天。你看到街上有死去的士兵。", choices: [ {text:"搜尸", next:"hobo_day2_loot"}, {text:"不敢靠近", next:"hobo_day2_hungry"} ] },
    hobo_day2_loot: { text: "你扒下士兵的军大衣，还找到几颗子弹。", choices: [ {text:"穿上大衣", next:"hobo_day2_noon", effect: {addItem: "军大衣", health: 5}}, {text:"藏起子弹", next:"hobo_day2_noon", effect: {addItem: "子弹"}} ] },
    hobo_day2_hungry: { text: "你饿得头晕眼花。", choices: [ {text:"吃树皮", next:"hobo_day2_noon", effect: {health: -2}} ] },
    hobo_day2_noon: { text: "你遇到一只流浪狗，它嘴里叼着一块肉。", choices: [ {text:"抢夺", next:"hobo_day2_fight_dog"}, {text:"引诱", next:"hobo_day2_tame_dog"} ] },
    hobo_day2_fight_dog: { text: "你被咬伤了，但抢到了肉。", choices: [ {text:"烤肉吃", next:"hobo_day2_night", effect: {health: 5}} ] },
    hobo_day2_tame_dog: { text: "你分了一点食物给它，它似乎想跟着你。", choices: [ {text:"收留它", next:"hobo_day2_night", effect: {addItem: "流浪狗"}} ] },
    hobo_day2_night: { text: "有了大衣（或狗），今晚暖和多了。", choices: [ {text:"睡觉", next:"hobo_day3_morning"} ] },

    hobo_day3_morning: { text: "第三天。你发现有人在跟踪你。", choices: [ {text:"设伏", next:"hobo_day3_ambush"}, {text:"逃跑", next:"hobo_day3_run"} ] },
    hobo_day3_ambush: { text: "你利用地形反杀了跟踪者，发现他是另一个想抢你大衣的流浪汉。", choices: [ {text:"搜身", next:"hobo_day3_loot_hobo"} ] },
    hobo_day3_loot_hobo: { text: "他身上只有一张全家福。", choices: [ {text:"叹息", next:"hobo_day3_night", effect: {sanity: -5}} ] },
    hobo_day3_run: { text: "你跑得气喘吁吁，甩掉了他。", choices: [ {text:"休息", next:"hobo_day3_night"} ] },
    hobo_day3_night: { text: "这个城市正在死去，你也一样。", choices: [ {text:"坚持", next:"hobo_day4_morning"} ] },

    hobo_day4_morning: { text: "第四天。你听说日军在招募劳工清理尸体，给饭吃。", choices: [ {text:"去报名", next:"hobo_day4_work"}, {text:"宁死不去", next:"hobo_day4_starve"} ] },
    hobo_day4_work: { text: "你被带到江边搬运尸体，场面如同地狱。", choices: [ {text:"呕吐", next:"hobo_day4_noon", effect: {sanity: -20}} ] },
    hobo_day4_noon: { text: "监工给了你两个饭团。", choices: [ {text:"狼吞虎咽", next:"hobo_day4_night", effect: {health: 20}} ] },
    hobo_day4_starve: { text: "你饿得只能躺在地上不动。", choices: [ {text:"等死", next:"ending_hobo_starve"} ] },
    hobo_day4_night: { text: "你看着满手的血腥，无法入睡。", choices: [ {text:"哭泣", next:"hobo_day5_morning"} ] },

    hobo_day5_morning: { text: "第五天。劳工队要被集体处决了。", choices: [ {text:"装死", next:"hobo_day5_fake_death"}, {text:"反抗", next:"ending_hobo_resist"} ] },
    hobo_day5_fake_death: { text: "你躺在尸体堆里，屏住呼吸。机枪扫射过后，你感到身上压着沉重的尸体。", choices: [ {text:"等待天黑", next:"ending_hobo_survive"} ] },

    ending_hobo_starve: { text: "系统：你饿死在街头，无人收尸（流浪汉结局7）", choices: [] },
    ending_hobo_resist: { text: "系统：你举起石头冲向日军，被乱枪打死（流浪汉结局8）", choices: [] },
    ending_hobo_survive: { text: "系统：你从尸坑中爬出，成为了这座死城的幽灵（流浪汉结局9）", choices: [] },

    hobo_church: { text: "教堂内的修女见到你很可怜，给你一块面包。", choices: [ {text:"留下帮忙", next:"hobo_help"}, {text:"离开教堂", next:"hobo_river", effect: {addItem: "面包"}} ] },
    hobo_help: { text: "你帮忙打扫教堂，修女告诉你一条安全路。", choices: [ {text:"沿路逃生", next:"ending_hobo_safe"}, {text:"不离开", next:"ending_hobo_church"} ] },

    hobo_river: { text: "河边有几条船，但看守严密。", choices: [ {text:"偷偷靠近", next:"hobo_boat_attempt"}, {text:"等夜里行动", next:"hobo_river_night"} ] },
    hobo_boat_attempt: { text: "你试图潜入一条船，船夫发现了你。", choices: [ {text:"求他带你走", next:"hobo_beg_boat"}, {text:"跳入河里", next:"ending_hobo_drown"} ] },
    hobo_beg_boat: { text: "船夫看你可怜，让你上船。", choices: [ {text:"顺利离开", next:"ending_hobo_river_escape"} ] },
    hobo_river_night: { text: "夜晚，船只无人看守。", choices: [ {text:"划船离开", next:"ending_hobo_river_escape"}, {text:"犹豫放弃", next:"hobo_church"} ] },

    hobo_street: { text: "街上有士兵巡逻。", choices: [ {text:"躲进小巷", next:"hobo_alley"}, {text:"装作乞丐", next:"hobo_beg_street"} ] },
    hobo_alley: { text: "小巷里有几名匪徒，他们盯上了你。", choices: [ {text:"拿出面包贿赂", next:"hobo_escape_bandit", condition: {hasItem: "面包"}}, {text:"被打劫", next:"ending_hobo_dead"} ] },
    hobo_escape_bandit: { text: "匪徒拿了面包放你走。", choices: [ {text:"赶紧离开", next:"hobo_river"} ] },
    hobo_beg_street: { text: "士兵对你不感兴趣，挥手让你走。", choices: [ {text:"趁机去河边", next:"hobo_river"} ] },

    ending_hobo_safe: { text: "系统：你被日军用刺刀刺死（流浪汉结局1）", choices: [] },
    ending_hobo_church: { text: "系统：你留在教堂，被日军坑杀（流浪汉结局2）", choices: [] },
    ending_hobo_river_escape: { text: "系统：你被守在墙外的日军发现并射杀（流浪汉结局3）", choices: [] },
    ending_hobo_caught: { text: "系统：你被巡逻士兵开枪射杀（流浪汉结局4）", choices: [] },
    ending_hobo_drown: { text: "系统：你跳河逃生失败，溺亡（流浪汉结局5）", choices: [] },
    ending_hobo_dead: { text: "系统：你被匪徒杀害（流浪汉结局6）", choices: [] }
},
车夫: {
    start: { text: "你是一名车夫，平日拉客维生。战火让你和马车困在城里。", choices: [ {text:"带上马车逃生", next:"driver_cart"}, {text:"先找粮草喂马", next:"driver_feed"}, {text:"去教堂避难", next:"driver_church"} ] },

    driver_cart: { text: "你驾着马车来到街上，遇到士兵盘查。", choices: [ {text:"用银钱贿赂", next:"driver_bribe", condition: {hasItem: "钱币"}}, {text:"假装运送物资", next:"driver_fake"} ] },
    driver_bribe: { text: "士兵收下银钱后放你通行。", choices: [ {text:"继续前往西门", next:"driver_west"}, {text:"改走东门", next:"driver_east"} ] },
    driver_fake: { text: "士兵半信半疑，掀开你的马车帘子。", choices: [ {text:"保持镇定", next:"driver_check_pass"}, {text:"趁乱逃跑", next:"ending_driver_caught"} ] },
    driver_check_pass: { text: "士兵没有发现异常，挥手放行。", choices: [ {text:"驱车去西门", next:"driver_west"} ] },

    driver_feed: { text: "你找来些干草喂马。突然听到外面传来枪声。", choices: [ {text:"迅速驾车离开", next:"driver_cart"}, {text:"躲进马厩", next:"driver_hide"} ] },
    driver_hide: { text: "你藏在马厩里，士兵搜查但未发现你。", choices: [ {text:"等他们离开后上路", next:"driver_cart"} ] },

    // 车夫-城市地图探索分支 (Day 1-5)
    driver_day1_start: { text: "第一天。你决定利用自己对地形的熟悉，在城中寻找生机。你需要先去哪里？", choices: [ {text:"去富人区接活", next:"driver_day1_rich"}, {text:"去贫民窟送货", next:"driver_day1_poor"} ] },
    driver_day1_rich: { text: "富人们急于逃命，愿意出高价。", choices: [ {text:"接送一家人去码头", next:"driver_day1_dock", effect: {addItem: "金戒指"}}, {text:"接送官员去使馆区", next:"driver_day1_embassy", effect: {addItem: "通行证"}} ] },
    driver_day1_dock: { text: "码头人山人海，你费了好大劲才挤进去。", choices: [ {text:"收钱离开", next:"driver_day1_night"} ] },
    driver_day1_embassy: { text: "使馆区相对安全，官员给了你一张特别通行证。", choices: [ {text:"收下", next:"driver_day1_night"} ] },
    driver_day1_poor: { text: "贫民窟的人们虽然没钱，但消息灵通。", choices: [ {text:"帮忙运送伤员", next:"driver_day1_info"} ] },
    driver_day1_info: { text: "作为回报，他们告诉你一条避开日军的小道。", choices: [ {text:"记下路线", next:"driver_day1_night", effect: {addItem: "小道地图"}} ] },
    driver_day1_night: { text: "晚上，你把马车藏在废弃仓库。", choices: [ {text:"给马喂料", next:"driver_day2_morning", effect: {removeItem: "干草"}}, {text:"自己休息", next:"driver_day2_morning"} ] },

    driver_day2_morning: { text: "第二天。马儿饿得直叫。", choices: [ {text:"去寻找草料", next:"driver_day2_grass"}, {text:"去寻找水源", next:"driver_day2_water"} ] },
    driver_day2_grass: { text: "你在公园草坪割了一些草。", choices: [ {text:"喂马", next:"driver_day2_noon", effect: {addItem: "干草"}} ] },
    driver_day2_water: { text: "你在消防栓接了些水。", choices: [ {text:"喂马喝水", next:"driver_day2_noon"} ] },
    driver_day2_noon: { text: "一名日军拦住了你的车。", choices: [ {text:"出示通行证", next:"driver_day2_pass", condition: {hasItem: "通行证"}}, {text:"低头哈腰", next:"driver_day2_bow"} ] },
    driver_day2_pass: { text: "日军看了一眼放行了。", choices: [ {text:"赶紧走", next:"driver_day2_night"} ] },
    driver_day2_bow: { text: "日军征用了你的马车运送弹药。", choices: [ {text:"忍痛交出", next:"driver_day2_lost_cart"}, {text:"反抗", next:"ending_driver_caught"} ] },
    driver_day2_lost_cart: { text: "你失去了马车，只能步行。", choices: [ {text:"沮丧", next:"driver_day2_night", effect: {sanity: -20}} ] },
    driver_day2_night: { text: "没有了马车，你只能睡在街角。", choices: [ {text:"睡觉", next:"driver_day3_morning"} ] },

    driver_day3_morning: { text: "第三天。如果你还有马车，可以尝试冲卡。", choices: [ {text:"尝试冲西门", next:"driver_day3_rush", condition: {hasItem: "通行证"}}, {text:"继续在城内苟活", next:"driver_day3_stay"} ] },
    driver_day3_rush: { text: "你驾车冲向西门，挥舞着通行证。", choices: [ {text:"加速", next:"ending_driver_success"} ] },
    driver_day3_stay: { text: "你决定再等等。", choices: [ {text:"寻找食物", next:"driver_day3_food"} ] },
    driver_day3_food: { text: "你找到半袋米。", choices: [ {text:"带走", next:"driver_day3_night", effect: {addItem: "米袋"}} ] },
    driver_day3_night: { text: "夜里，你听到马儿不安的嘶鸣。", choices: [ {text:"安抚", next:"driver_day4_morning"} ] },

    driver_day4_morning: { text: "第四天。日军开始屠杀牲畜。", choices: [ {text:"把马放生", next:"driver_day4_free"}, {text:"藏好马匹", next:"driver_day4_hide"} ] },
    driver_day4_free: { text: "你解开缰绳，马儿跑远了。", choices: [ {text:"独自逃生", next:"driver_day5_morning"} ] },
    driver_day4_hide: { text: "你试图把马藏进屋里，但被发现了。", choices: [ {text:"被捕", next:"ending_driver_caught"} ] },

    driver_day5_morning: { text: "第五天。你独自一人混在难民堆里。", choices: [ {text:"前往安全区", next:"ending_driver_survive"} ] },

    ending_driver_success: { text: "系统：凭借通行证和马车，你奇迹般地冲出了封锁线（车夫结局6）", choices: [] },
    ending_driver_survive: { text: "系统：你失去了马车，但保住了性命（车夫结局7）", choices: [] },

    driver_church: { text: "教堂里的修女看到你的马车，请你帮忙运送难民。", choices: [ {text:"答应", next:"driver_help_church"}, {text:"拒绝", next:"driver_cart"} ] },
    driver_help_church: { text: "你载着难民前往安全区。", choices: [ {text:"驶向西门", next:"driver_west"}, {text:"驶向河边", next:"driver_river"} ] },

    driver_west: { text: "西门有守军，你需要决定。", choices: [ {text:"贿赂守军", next:"ending_driver_west_escape", condition: {hasItem: "钱币"}}, {text:"寻找旁边小路", next:"driver_secret"} ] },
    driver_secret: { text: "你找到一个被炸开的城墙缺口，成功避开守军。", choices: [ {text:"逃出城外", next:"ending_driver2_west_escape"} ] },

    driver_east: { text: "东门戒备森严。", choices: [ {text:"强行冲过去", next:"ending_driver_fail"}, {text:"放弃改走河边", next:"driver_river"} ] },

    driver_river: { text: "河边有船夫招手，但需要钱带你走。", choices: [ {text:"支付费用", next:"ending_driver_river_escape", condition: {hasItem: "钱币"}}, {text:"自己划船", next:"ending_driver_river_escape"} ] },

    ending_driver_west_escape: { text: "系统：你因为贿赂守军被射杀（车夫结局1）", choices: [] },
    ending_driver2_west_escape: { text: "系统：你被守在城墙外的日军射杀（车夫结局2）", choices: [] },
    ending_driver_river_escape: { text: "系统：你被船夫打下水，淹死在长江（车夫结局3）", choices: [] },
    ending_driver_fail: { text: "系统：你在冲击东门时被射杀（车夫结局4）", choices: [] },
    ending_driver_caught: { text: "系统：你被士兵抓住并射杀（车夫结局5）", choices: [] }
}
};
