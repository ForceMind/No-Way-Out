export const hoboData = {
    start: { text: "你是一名流浪汉，早已习惯了城市的冷暖。", choices: [ {text:"翻垃圾", next:"hobo_trash"}, {text:"睡觉", next:"hobo_sleep"}, {text:"看热闹", next:"hobo_watch"} ] },

    hobo_trash: { text: "你翻到了一瓶没喝完的酒。", choices: [ {text:"喝掉", next:"hobo_drink"}, {text:"留着", next:"hobo_keep"} ] },
    hobo_drink: { text: "你喝得醉醺醺的。", choices: [ {text:"发酒疯", next:"hobo_crazy"}, {text:"睡觉", next:"hobo_sleep"} ] },
    hobo_crazy: { text: "你对着日军大骂。", choices: [ {text:"结局", next:"ending_hobo_shot"} ] },
    hobo_keep: { text: "这酒也许能换点东西。", choices: [ {text:"去换吃的", next:"hobo_trade"} ] },
    hobo_trade: { text: "你用酒换了两个馒头。", choices: [ {text:"吃掉", next:"ending_hobo_full"} ] },

    hobo_sleep: { text: "你在墙角睡着了。", choices: [ {text:"继续睡", next:"ending_hobo_dream"}, {text:"被吵醒", next:"hobo_wake"} ] },
    hobo_wake: { text: "日军正在搜查。", choices: [ {text:"装死", next:"hobo_fake_death"}, {text:"逃跑", next:"hobo_run"} ] },
    hobo_fake_death: { text: "日军踢了你一脚，以为你死了。", choices: [ {text:"结局", next:"ending_hobo_survive"} ] },
    hobo_run: { text: "你跑得比兔子还快。", choices: [ {text:"躲进下水道", next:"hobo_sewer"} ] },
    hobo_sewer: { text: "下水道里很臭，但很安全。", choices: [ {text:"结局", next:"ending_hobo_rat"} ] },

    hobo_watch: { text: "你看着日军进城。", choices: [ {text:"鼓掌", next:"hobo_clap"}, {text:"吐口水", next:"hobo_spit"} ] },
    hobo_clap: { text: "日军扔给你几个铜板。", choices: [ {text:"捡起来", next:"ending_hobo_traitor"} ] },
    hobo_spit: { text: "日军没看见。", choices: [ {text:"溜走", next:"hobo_run"} ] },

    ending_hobo_shot: { text: "系统：你死得像个英雄，虽然没人知道你的名字（流浪汉结局1）", choices: [] },
    ending_hobo_full: { text: "系统：你吃饱了，觉得这世道也没那么坏（流浪汉结局2）", choices: [] },
    ending_hobo_dream: { text: "系统：你在梦中回到了家乡，再也没有醒来（流浪汉结局3）", choices: [] },
    ending_hobo_survive: { text: "系统：你靠装死活了下来（流浪汉结局4）", choices: [] },
    ending_hobo_rat: { text: "系统：你成了下水道的国王（流浪汉结局5）", choices: [] },
    ending_hobo_traitor: { text: "系统：你为了几个铜板出卖了尊严（流浪汉结局6）", choices: [] }
};
