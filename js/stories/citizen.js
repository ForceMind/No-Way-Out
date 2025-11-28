export const citizenData = {
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
    
    // 修复逻辑：小巷通向河沟，不能直接跳到划船结局
    north_escape: { text: "小巷尽头是一条淤泥堆积的河沟，直通城外护城河。", choices: [ {text:"涉水通过", next:"north_ditch_wade"}, {text:"沿岸寻找", next:"north_ditch_search"}, {text:"返回", next:"street2"} ] },
    north_ditch_wade: { text: "冬天的河水刺骨冰凉，淤泥吸住了你的双腿。", choices: [ {text:"挣扎前行", next:"ending_ditch_freeze"}, {text:"呼救", next:"ending_caught1"} ] },
    north_ditch_search: { text: "你在岸边发现了一块浮木。", choices: [ {text:"抱木漂流", next:"ending_river_final"} ] },

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

    // 生存循环模式
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
    ending_resist_fail: { text: "系统：你待在教堂里，最后被日军坑杀（市民结局9）", choices: [] },
    ending_ditch_freeze: { text: "系统：你在冰冷的河沟中失温冻死（市民结局11）", choices: [] },
    ending_river_final: { text: "系统：你抱住一根浮木漂流，最终体力不支沉入江底（市民结局13）", choices: [] },
    ending_sewer_death: { text: "系统：你在下水道中腐烂（市民结局11）", choices: [] },
    ending_sewer_riot: { text: "系统：你死于幸存者内乱（市民结局12）", choices: [] },
    ending_mountain_death: { text: "系统：你在山林中冻饿而死（市民结局14）", choices: [] },
    ending_rescue_fail: { text: "系统：你在交火中中弹身亡（市民结局15）", choices: [] },
    ending_safe: { text: "系统：你留在教堂，最终被日军坑杀（市民结局16）", choices: [] }
};
