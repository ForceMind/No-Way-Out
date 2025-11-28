export const agentData = {
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
    ending_agent_survive: { text: "系统：你在黑暗中战斗至最后一刻，最终被捕牺牲（地下党员结局10）", choices: [] },

    agent_church: { text: "你顺利抵达教堂，此处比较安全。", choices: [ {text:"寻找联系人", next:"agent_safehouse2"}, {text:"躲在此处", next:"ending_agent_caught"} ] },
    agent_safehouse: { text: "安全屋内，同志们正在策划突袭。", choices: [ {text:"加入突袭", next:"ending_agent_action"}, {text:"转移情报", next:"ending_agent_win"} ] },
    agent_safehouse2: { text: "你在伤员中找到联系人，并知道了一个安全屋。", choices: [ {text:"告诉敌人", next:"ending_agent_hanjian"}, {text:"躲在此处", next:"ending_agent_caught"}, {text:"前往寻找", next:"agent_safehouse"} ] },

    ending_agent_win: { text: "系统：你成功将情报送出，随后为了掩护同志撤离而牺牲（地下党员结局1）", choices: [] },
    ending_agent_fail: { text: "系统：你销毁了情报，错失良机，自己被日军抓获并砍头（地下党员结局2）", choices: [] },
    ending_agent_river_escape: { text: "系统：你不了解水性，船翻了，你被淹死了（地下党员结局3）", choices: [] },
    ending_agent_east_escape: { text: "系统：你用贿赂逃出东门，全是日军，你被射杀了（地下党员结局4）", choices: [] },
    ending_agent_secret_escape: { text: "系统：你在地下迷路，被困死（地下党员结局5）", choices: [] },
    ending_agent_action: { text: "系统：你在突袭中壮烈牺牲（地下党员结局6）", choices: [] },
    ending_agent_hanjian: { text: "系统：你当了狗汉奸，在睡梦中被勒死（地下党员结局7）", choices: [] },
    ending_agent_caught: { text: "系统：你被日军抓获并砍头（地下党员结局8）", choices: [] }
};
