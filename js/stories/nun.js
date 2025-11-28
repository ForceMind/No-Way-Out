export const nunData = {
    start: { text: "你是一名修女，教堂里收容了许多难民。", choices: [ {text:"照顾伤员", next:"nun_care"}, {text:"祈祷", next:"nun_pray"}, {text:"阻止日军", next:"nun_stop"} ] },

    nun_care: { text: "伤员太多，药品不够了。", choices: [ {text:"去药店找药", next:"nun_pharmacy"}, {text:"尽力而为", next:"nun_try"} ] },
    nun_pharmacy: { text: "药店已经被洗劫一空。", choices: [ {text:"回教堂", next:"nun_back"}, {text:"去医院", next:"nun_hospital"} ] },
    nun_hospital: { text: "医院被日军占领。", choices: [ {text:"请求药品", next:"nun_request"}, {text:"偷药", next:"nun_steal"} ] },
    nun_request: { text: "日军军官看你是修女，给了你一点药。", choices: [ {text:"感谢", next:"nun_back_medicine"} ] },
    nun_steal: { text: "你被发现了。", choices: [ {text:"结局", next:"ending_nun_shot"} ] },
    nun_back_medicine: { text: "你带回了药品，救活了几个人。", choices: [ {text:"结局", next:"ending_nun_saint"} ] },
    nun_try: { text: "看着伤员一个个死去，你很痛苦。", choices: [ {text:"祈祷", next:"nun_pray"} ] },

    nun_pray: { text: "你在十字架前祈祷和平。", choices: [ {text:"继续祈祷", next:"nun_pray_more"}, {text:"去照顾人", next:"nun_care"} ] },
    nun_pray_more: { text: "日军冲进了教堂。", choices: [ {text:"阻拦", next:"nun_block"}, {text:"躲避", next:"nun_hide"} ] },
    nun_block: { text: "你张开双臂挡在难民身前。", choices: [ {text:"结局", next:"ending_nun_sacrifice"} ] },
    nun_hide: { text: "你躲在告解室里，听着外面的惨叫。", choices: [ {text:"结局", next:"ending_nun_survivor"} ] },

    nun_stop: { text: "你站在教堂门口，阻止日军进入。", choices: [ {text:"讲道理", next:"nun_reason"}, {text:"怒斥", next:"nun_scold"} ] },
    nun_reason: { text: "日军根本不听你的。", choices: [ {text:"结局", next:"ending_nun_shot"} ] },
    nun_scold: { text: "日军恼羞成怒。", choices: [ {text:"结局", next:"ending_nun_rape"} ] },
    nun_back: { text: "你空手而归。", choices: [ {text:"祈祷", next:"nun_pray"} ] },

    ending_nun_saint: { text: "系统：你救了很多人，被尊为圣女（修女结局1）", choices: [] },
    ending_nun_shot: { text: "系统：你倒在了血泊中，手里还握着十字架（修女结局2）", choices: [] },
    ending_nun_sacrifice: { text: "系统：你用生命保护了难民，你的精神永存（修女结局3）", choices: [] },
    ending_nun_survivor: { text: "系统：你活了下来，但内心充满了愧疚（修女结局4）", choices: [] },
    ending_nun_rape: { text: "系统：你遭受了非人的折磨后死去（修女结局5）", choices: [] }
};
