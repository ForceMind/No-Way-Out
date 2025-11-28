export const studentData = {
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
};
