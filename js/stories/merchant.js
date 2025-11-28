export const merchantData = {
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
    ending_merchant_survive: { text: "系统：你失去了所有财富，作为乞丐在街头冻饿而死（商人结局10）", choices: [] },

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
};
