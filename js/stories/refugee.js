export const refugeeData = {
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
};
