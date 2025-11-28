export const orphanData = {
    start: { text: "你是一名孤儿，父母在战乱中死去，你独自在废墟中求生。", choices: [ {text:"寻找食物", next:"orphan_food"}, {text:"寻找避难所", next:"orphan_shelter"}, {text:"跟随人群", next:"orphan_crowd"} ] },

    orphan_food: { text: "你在垃圾堆里翻找，发现半块发霉的面包。", choices: [ {text:"吃下去", next:"orphan_eat", effect: {health: -10}}, {text:"继续找", next:"orphan_search_more"} ] },
    orphan_eat: { text: "肚子不饿了，但有点痛。", choices: [ {text:"找地方休息", next:"orphan_shelter"} ] },
    orphan_search_more: { text: "你找到了一块干净的饼干。", choices: [ {text:"吃下去", next:"orphan_shelter", effect: {health: 5}} ] },

    orphan_shelter: { text: "天黑了，你需要找个地方睡觉。", choices: [ {text:"破庙", next:"orphan_temple"}, {text:"桥洞", next:"orphan_bridge"} ] },
    orphan_temple: { text: "破庙里已经挤满了难民。", choices: [ {text:"挤进去", next:"orphan_squeeze"}, {text:"离开", next:"orphan_bridge"} ] },
    orphan_squeeze: { text: "你被一个大汉推了出来。", choices: [ {text:"哭泣", next:"orphan_cry"}, {text:"离开", next:"orphan_bridge"} ] },
    orphan_cry: { text: "你的哭声引来了一位好心的修女。", choices: [ {text:"跟她走", next:"orphan_nun"}, {text:"拒绝", next:"orphan_bridge"} ] },
    orphan_nun: { text: "修女带你去了教堂。", choices: [ {text:"留在教堂", next:"ending_orphan_church"} ] },

    orphan_bridge: { text: "桥洞下冷风刺骨。", choices: [ {text:"缩成一团", next:"orphan_cold"}, {text:"生火", next:"orphan_fire"} ] },
    orphan_cold: { text: "你冻得瑟瑟发抖，迷迷糊糊睡着了。", choices: [ {text:"醒来", next:"ending_orphan_freeze"} ] },
    orphan_fire: { text: "你捡了些树枝生火，引来了巡逻兵。", choices: [ {text:"逃跑", next:"orphan_run"}, {text:"求饶", next:"orphan_beg"} ] },
    orphan_run: { text: "你跑得太慢被抓住了。", choices: [ {text:"结局", next:"ending_orphan_caught"} ] },
    orphan_beg: { text: "士兵看你可怜，扔给你一块糖。", choices: [ {text:"吃糖", next:"ending_orphan_candy"} ] },

    orphan_crowd: { text: "你跟着人群往城外走。", choices: [ {text:"紧跟", next:"orphan_follow_tight"}, {text:"掉队", next:"orphan_lost"} ] },
    orphan_follow_tight: { text: "人群冲散了关卡，你混了出去。", choices: [ {text:"结局", next:"ending_orphan_escape"} ] },
    orphan_lost: { text: "你被人流挤到了路边。", choices: [ {text:"哭泣", next:"orphan_cry"} ] },

    ending_orphan_church: { text: "系统：你在教堂里度过了余生，虽然清贫但很安全（孤儿结局1）", choices: [] },
    ending_orphan_freeze: { text: "系统：你在寒冷的冬夜里永远睡着了（孤儿结局2）", choices: [] },
    ending_orphan_caught: { text: "系统：你被抓去做了苦力，最终累死（孤儿结局3）", choices: [] },
    ending_orphan_candy: { text: "系统：你吃着糖，在战火中露出了一丝微笑，随后被流弹击中（孤儿结局4）", choices: [] },
    ending_orphan_escape: { text: "系统：你逃出了城，被一户农家收养（孤儿结局5）", choices: [] }
};
