export const driverData = {
    start: { text: "你是一名黄包车夫，靠力气吃饭。", choices: [ {text:"拉客", next:"driver_work"}, {text:"回家", next:"driver_home"}, {text:"躲避", next:"driver_hide"} ] },

    driver_work: { text: "街上乱哄哄的。", choices: [ {text:"拉有钱人", next:"driver_rich"}, {text:"拉伤员", next:"driver_injured"} ] },
    driver_rich: { text: "有钱人要去码头。", choices: [ {text:"去码头", next:"driver_pier"}, {text:"不去", next:"driver_refuse"} ] },
    driver_pier: { text: "到了码头，有钱人给了你一大笔钱。", choices: [ {text:"买船票", next:"driver_ticket"}, {text:"回家", next:"driver_home_rich"} ] },
    driver_ticket: { text: "船票已经卖光了。", choices: [ {text:"强行上船", next:"ending_driver_drown"}, {text:"等待", next:"ending_driver_wait"} ] },
    driver_home_rich: { text: "你带着钱回家，发现家已经被炸了。", choices: [ {text:"痛哭", next:"ending_driver_despair"} ] },

    driver_injured: { text: "你免费拉着伤员去医院。", choices: [ {text:"快跑", next:"driver_fast"} ] },
    driver_fast: { text: "你累得气喘吁吁，终于到了医院。", choices: [ {text:"离开", next:"ending_driver_good"} ] },

    driver_home: { text: "你回到家，老婆孩子都很害怕。", choices: [ {text:"安慰", next:"driver_comfort"}, {text:"带他们跑", next:"driver_run_family"} ] },
    driver_comfort: { text: "日军破门而入。", choices: [ {text:"拼命", next:"ending_driver_fight"} ] },
    driver_run_family: { text: "你拉着老婆孩子往城外跑。", choices: [ {text:"走小路", next:"driver_path"}, {text:"走大路", next:"driver_road"} ] },
    driver_path: { text: "小路很难走，但没有日军。", choices: [ {text:"坚持", next:"ending_driver_escape"} ] },
    driver_road: { text: "大路上全是难民和溃兵。", choices: [ {text:"随波逐流", next:"ending_driver_lost"} ] },

    driver_hide: { text: "你把车藏好，躲在屋里。", choices: [ {text:"等待", next:"driver_wait"} ] },
    driver_wait: { text: "有人敲门。", choices: [ {text:"开门", next:"driver_open"}, {text:"不开", next:"driver_ignore"} ] },
    driver_open: { text: "是几个溃兵，抢了你的车。", choices: [ {text:"反抗", next:"ending_driver_killed"}, {text:"顺从", next:"ending_driver_poor"} ] },
    driver_ignore: { text: "门被撞开了。", choices: [ {text:"结局", next:"ending_driver_killed"} ] },

    ending_driver_drown: { text: "系统：你被挤下水淹死了（车夫结局1）", choices: [] },
    ending_driver_wait: { text: "系统：你没等到船，却等来了日军（车夫结局2）", choices: [] },
    ending_driver_despair: { text: "系统：你失去了一切，在绝望中自杀（车夫结局3）", choices: [] },
    ending_driver_good: { text: "系统：你做了一件好事，心里很踏实（车夫结局4）", choices: [] },
    ending_driver_fight: { text: "系统：你为了保护家人战死（车夫结局5）", choices: [] },
    ending_driver_escape: { text: "系统：你们一家人逃到了乡下，平安度过战争（车夫结局6）", choices: [] },
    ending_driver_lost: { text: "系统：你和家人走散了，孤独终老（车夫结局7）", choices: [] },
    ending_driver_killed: { text: "系统：你被乱枪打死（车夫结局8）", choices: [] },
    ending_driver_poor: { text: "系统：你失去了谋生工具，沦为乞丐（车夫结局9）", choices: [] },
    driver_refuse: { text: "你拒绝了有钱人。", choices: [ {text:"回家", next:"driver_home"} ] }
};
