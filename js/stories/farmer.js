export const farmerData = {
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
    ending_farmer_hero: { text: "系统：你杀出一条血路逃出城门，但最终因失血过多倒在荒野（农夫结局12）", choices: [] },
    ending_farmer_survive: { text: "系统：你在尸体堆里躲过了搜查，夜晚爬出城后踩中地雷身亡（农夫结局13）", choices: [] },

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
};
