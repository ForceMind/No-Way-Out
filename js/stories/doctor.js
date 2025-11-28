export const doctorData = {
    start: { text: "你是一名医生，城市陷入混乱，你所在的小诊所药品不足。外面有人敲门求助。", choices: [ {text:"开门看看", next:"doctor_open"}, {text:"无视敲门", next:"doctor_ignore"}, {text:"收集药品", next:"doctor_collect"} ] },

    doctor_open: { text: "门外是一名受伤的青年，流着血请求治疗。", choices: [ {text:"给他包扎", next:"doctor_bandage"}, {text:"拒绝", next:"doctor_ignore"} ] },
    doctor_bandage: { text: "你用仅有的纱布为他处理伤口，他告诉你教堂有安全庇护。", choices: [ {text:"去教堂", next:"doctor_church"}, {text:"继续留在诊所", next:"doctor_collect"} ] },

    doctor_ignore: { text: "你没有开门，青年失望地离开。外面传来枪声。", choices: [ {text:"小心探头看看", next:"doctor_peek"}, {text:"继续整理物资", next:"doctor_collect"} ] },
    doctor_peek: { text: "你看到士兵正在街头搜查。", choices: [ {text:"躲回诊所", next:"doctor_collect"}, {text:"从后门离开", next:"doctor_backdoor"} ] },
    doctor_backdoor: { text: "后门通向一条小巷。", choices: [ {text:"走向教堂", next:"doctor_church"}, {text:"朝河边走", next:"doctor_river"} ] },

    doctor_collect: { text: "你在诊所里找到一些药品和绷带，还发现了一把小刀。", choices: [ {text:"带上药品", next:"doctor_plan", effect: {addItem: "药品"}}, {text:"原地等待", next:"ending_doctor_caught"} ] },
    doctor_plan: { text: "你决定利用这些药品换取安全。", choices: [ {text:"去教堂", next:"doctor_church"}, {text:"去西门试试贿赂", next:"doctor_west"} ] },

    doctor_church: { text: "教堂内有大量伤员，修女请求你帮忙救治。", choices: [ {text:"留下帮忙", next:"doctor_help"}, {text:"不想留下", next:"doctor_river"} ] },
    doctor_help: { text: "你为伤员包扎，赢得大家信任。修女希望你能主持这里的临时医疗点。", choices: [ {text:"建立战地医院", next:"doctor_hospital_start"}, {text:"跟随修女去安全区", next:"ending_doctor_safe"}, {text:"寻找别的出路", next:"doctor_river"} ] },

    // 医生-战地医院分支 (Day 1-5)
    doctor_hospital_start: { text: "你决定留在教堂建立战地医院。第一天，伤员不断涌入。", choices: [ {text:"进行检伤分类", next:"doc_day1_triage"}, {text:"先救治重伤员", next:"doc_day1_heavy"} ] },
    doc_day1_triage: { text: "你将伤员分为轻重缓急，效率大大提高。", choices: [ {text:"休息", next:"doc_day1_night", effect: {sanity: 5}} ] },
    doc_day1_heavy: { text: "你耗尽精力救治重伤员，但轻伤员因感染恶化。", choices: [ {text:"自责", next:"doc_day1_night", effect: {sanity: -5}} ] },
    doc_day1_night: { text: "深夜，一名日军军官受重伤被抬到门口。", choices: [ {text:"救治他", next:"doc_day1_save_enemy"}, {text:"拒绝救治", next:"doc_day1_kill_enemy"} ] },
    doc_day1_save_enemy: { text: "医者仁心，你救了他。他醒后留下了一把手术刀作为谢礼离开。", choices: [ {text:"收下", next:"doc_day2_morning", effect: {addItem: "手术刀"}} ] },
    doc_day1_kill_enemy: { text: "你看着他失血过多而死。", choices: [ {text:"处理尸体", next:"doc_day2_morning", effect: {sanity: -5}} ] },

    doc_day2_morning: { text: "第二天。药品告急。", choices: [ {text:"去被炸毁的药店寻找", next:"doc_day2_search"}, {text:"尝试用草药替代", next:"doc_day2_herb"} ] },
    doc_day2_search: { text: "你在废墟中找到一些止痛药，但被流弹擦伤。", choices: [ {text:"包扎自己", next:"doc_day2_noon", effect: {health: -10, addItem: "止痛药"}} ] },
    doc_day2_herb: { text: "你在教堂后院找到一些止血草。", choices: [ {text:"制作草药", next:"doc_day2_noon", effect: {addItem: "草药"}} ] },
    doc_day2_noon: { text: "一名孕妇即将临盆。", choices: [ {text:"接生", next:"doc_day2_birth"}, {text:"由于没有设备放弃", next:"doc_day2_fail"} ] },
    doc_day2_birth: { text: "在简陋的环境下，新生命诞生了。", choices: [ {text:"感到希望", next:"doc_day2_night", effect: {sanity: 20}} ] },
    doc_day2_fail: { text: "孕妇难产而死。", choices: [ {text:"绝望", next:"doc_day2_night", effect: {sanity: -20}} ] },
    doc_day2_night: { text: "你累得在手术台上睡着了。", choices: [ {text:"睡觉", next:"doc_day3_morning"} ] },

    doc_day3_morning: { text: "第三天。伤口感染开始在伤员中蔓延。", choices: [ {text:"隔离感染者", next:"doc_day3_iso"}, {text:"截肢保命", next:"doc_day3_cut"} ] },
    doc_day3_iso: { text: "家属反对隔离，引发了骚乱。", choices: [ {text:"强行隔离", next:"doc_day3_riot"}, {text:"妥协", next:"doc_day3_plague"} ] },
    doc_day3_cut: { text: "你不得不进行多台截肢手术。", choices: [ {text:"麻木", next:"doc_day3_night", effect: {sanity: -10}} ] },
    doc_day3_riot: { text: "骚乱中你被打伤。", choices: [ {text:"忍痛工作", next:"doc_day3_night", effect: {health: -10}} ] },
    doc_day3_plague: { text: "感染失控，更多人死去了。", choices: [ {text:"无力回天", next:"doc_day3_night"} ] },
    doc_day3_night: { text: "你听到教堂外有挖掘的声音。", choices: [ {text:"查看", next:"doc_day3_peek"}, {text:"无视", next:"doc_day4_morning"} ] },
    doc_day3_peek: { text: "日军正在挖掘战壕，似乎准备长期围困。", choices: [ {text:"回屋", next:"doc_day4_morning"} ] },

    doc_day4_morning: { text: "第四天。食物和水都断绝了。", choices: [ {text:"杀马充饥", next:"doc_day4_horse"}, {text:"喝圣水", next:"doc_day4_water"} ] },
    doc_day4_horse: { text: "那是运送伤员的马。", choices: [ {text:"为了生存", next:"doc_day4_noon", effect: {health: 10}} ] },
    doc_day4_water: { text: "圣水缸里也快干了。", choices: [ {text:"祈祷", next:"doc_day4_noon"} ] },
    doc_day4_noon: { text: "日军冲进了教堂。", choices: [ {text:"站出来保护伤员", next:"ending_doctor_hero"}, {text:"混入伤员中", next:"doc_day4_hide"} ] },
    doc_day4_hide: { text: "日军开始屠杀伤员。", choices: [ {text:"闭上眼", next:"ending_doctor_massacre"} ] },

    ending_doctor_hero: { text: "系统：你身穿白大褂挡在伤员面前，被日军刺刀刺穿（医生结局5）", choices: [] },
    ending_doctor_massacre: { text: "系统：你和所有伤员一起被机枪扫射而死（医生结局6）", choices: [] },

    doctor_west: { text: "西门守卫森严，一名士兵发现了你。", choices: [ {text:"用药品贿赂", next:"doctor_bribe", condition: {hasItem: "药品"}}, {text:"假装路过", next:"ending_doctor_caught"} ] },
    doctor_bribe: { text: "你递出药品，士兵收下后放行。", choices: [ {text:"离开", next:"ending_doctor_west_escape"} ] },

    doctor_river: { text: "河边有伤者需要急救，他家人求你帮忙。", choices: [ {text:"救治他", next:"doctor_river_help"}, {text:"无视离开", next:"doctor_river_boat"} ] },
    doctor_river_help: { text: "你救治了伤者，他们感谢地让出一条小船。", choices: [ {text:"乘船逃离", next:"ending_doctor_river_escape"}, {text:"返回教堂", next:"doctor_church"} ] },
    doctor_river_boat: { text: "你找到一条空船。", choices: [ {text:"划船离开", next:"ending_doctor_river_escape"}, {text:"返回", next:"doctor_church"} ] },

    ending_doctor_safe: { text: "系统：你留在教堂救人，最后被日军坑杀（医生结局1）", choices: [] },
    ending_doctor_west_escape: { text: "系统：药品被扔在地上，你被射杀（医生结局2）", choices: [] },
    ending_doctor_river_escape: { text: "系统：逃跑途中被日军汽艇扫射，你中弹身亡（医生结局3）", choices: [] },
    ending_doctor_caught: { text: "系统：你被巡逻士兵抓住并射杀（医生结局4）", choices: [] }
};
