export const teacherData = {
    start: { text: "你是一名教师，学校已经解散，学生们四散而逃。你独自回到空荡荡的教室。", choices: [ {text:"寻找学生", next:"teacher_search"}, {text:"收集物资", next:"teacher_collect"}, {text:"去教堂", next:"teacher_church_start"} ] },

    teacher_search: { text: "你想起有几名学生可能还躲在图书馆。", choices: [ {text:"前往图书馆", next:"teacher_library"}, {text:"放弃寻找", next:"teacher_collect"} ] },
    teacher_library: { text: "图书馆一片狼藉，你听到二楼传来低声呼喊。", choices: [ {text:"上楼查看", next:"teacher_rescue"}, {text:"不理会", next:"teacher_collect"} ] },
    teacher_rescue: { text: "你找到两名学生，他们哭着请求你带他们离开。", choices: [ {text:"带上学生", next:"teacher_with_students"}, {text:"拒绝", next:"teacher_collect"} ] },
    teacher_with_students: { text: "你带着两名学生，准备寻找安全的路线。", choices: [ {text:"去教堂", next:"teacher_church_start"}, {text:"去河边", next:"teacher_river"} ] },

    teacher_collect: { text: "你在办公室找到一些粉笔和几本书。书中夹着一张城门守卫的排班表。", choices: [ {text:"利用排班表找路线", next:"teacher_gate_plan", effect: {addItem: "排班表"}}, {text:"前往教堂", next:"teacher_church_start"}, {text:"留在学校建立避难所", next:"teacher_school_start"} ] },
    teacher_gate_plan: { text: "排班表显示西门夜间守卫较少。", choices: [ {text:"准备去西门", next:"teacher_west"}, {text:"改去教堂", next:"teacher_church_start"} ] },

    // 教师-学校避难所分支 (Day 1-5)
    teacher_school_start: { text: "你决定留在学校，利用坚固的校舍保护幸存的学生。第一天，你需要清理场地。", choices: [ {text:"清理地下室", next:"school_day1_basement"}, {text:"封锁校门", next:"school_day1_gate"} ] },
    school_day1_basement: { text: "地下室虽然阴暗，但很隐蔽。", choices: [ {text:"布置床铺", next:"school_day1_night"} ] },
    school_day1_gate: { text: "你搬来桌椅堵住校门，但这只能阻挡一时。", choices: [ {text:"休息", next:"school_day1_night"} ] },
    school_day1_night: { text: "夜晚，几个学生因为害怕而哭泣。", choices: [ {text:"讲故事安慰", next:"school_day2_morning", effect: {sanity: 5}}, {text:"严厉制止", next:"school_day2_morning", effect: {sanity: -5}} ] },

    school_day2_morning: { text: "第二天。食物短缺。", choices: [ {text:"去食堂寻找", next:"school_day2_canteen"}, {text:"去教工宿舍", next:"school_day2_dorm"} ] },
    school_day2_canteen: { text: "食堂里只剩下一些发霉的米。", choices: [ {text:"煮粥", next:"school_day2_noon", effect: {addItem: "米粥"}}, {text:"放弃", next:"school_day2_noon"} ] },
    school_day2_dorm: { text: "宿舍里找到一些饼干。", choices: [ {text:"分给学生", next:"school_day2_noon", effect: {sanity: 5}}, {text:"自己留着", next:"school_day2_noon", effect: {health: 5}} ] },
    school_day2_noon: { text: "中午，有难民敲门求助。", choices: [ {text:"接纳", next:"school_day2_accept"}, {text:"拒绝", next:"school_day2_reject"} ] },
    school_day2_accept: { text: "难民带来了外界的消息，但也消耗了更多食物。", choices: [ {text:"询问消息", next:"school_day2_night"} ] },
    school_day2_reject: { text: "难民绝望地离开了。", choices: [ {text:"愧疚", next:"school_day2_night", effect: {sanity: -5}} ] },
    school_day2_night: { text: "你听到远处有日军的巡逻车声。", choices: [ {text:"熄灯", next:"school_day3_morning"} ] },

    school_day3_morning: { text: "第三天。一名学生生病了。", choices: [ {text:"去医务室找药", next:"school_day3_med"}, {text:"物理降温", next:"school_day3_cool"} ] },
    school_day3_med: { text: "医务室在另一栋楼，需要穿过操场。", choices: [ {text:"冒险前往", next:"school_day3_run"}, {text:"放弃", next:"school_day3_cool"} ] },
    school_day3_run: { text: "你在操场上被狙击手发现。", choices: [ {text:"S形跑位", next:"school_day3_safe"}, {text:"趴下", next:"ending_teacher_sniper"} ] },
    school_day3_safe: { text: "你奇迹般地拿到了药并跑了回来。", choices: [ {text:"喂药", next:"school_day3_night"} ] },
    school_day3_cool: { text: "学生的病情加重了。", choices: [ {text:"祈祷", next:"school_day3_night"} ] },
    school_day3_night: { text: "学生在高烧中去世了。", choices: [ {text:"掩埋", next:"school_day4_morning", effect: {sanity: -20}} ] },

    school_day4_morning: { text: "第四天。日军冲进了学校。", choices: [ {text:"带领学生躲藏", next:"school_day4_hide"}, {text:"挺身而出", next:"ending_teacher_hero"} ] },
    school_day4_hide: { text: "你们躲在地下室，听着上面的脚步声。", choices: [ {text:"捂住学生的嘴", next:"school_day4_silence"} ] },
    school_day4_silence: { text: "脚步声渐渐远去。", choices: [ {text:"松手", next:"school_day5_morning"} ] },

    school_day5_morning: { text: "第五天。学校已经不安全了。", choices: [ {text:"突围去教堂", next:"teacher_church_start"}, {text:"分散逃跑", next:"ending_teacher_west_escape"} ] },

    ending_teacher_sniper: { text: "系统：你被狙击手击中头部（教师结局5）", choices: [] },
    ending_teacher_hero: { text: "系统：你为了保护学生，被日军刺刀刺死（教师结局6）", choices: [] },

    teacher_church_start: { text: "教堂内有修女接待你，她需要人帮忙照顾伤员。", choices: [ {text:"留下帮忙", next:"teacher_help"}, {text:"询问逃生路线", next:"teacher_church_info"} ] },
    teacher_help: { text: "你忙了一整天，修女对你表示感谢。", choices: [ {text:"跟随修女去安全区", next:"ending_teacher_safe"}, {text:"转去找其他出路", next:"teacher_river"} ] },
    teacher_church_info: { text: "修女告诉你西门和河边都有可能逃生。", choices: [ {text:"去西门", next:"teacher_west"}, {text:"去河边", next:"teacher_river"} ] },

    teacher_west: { text: "西门有少量士兵巡逻。", choices: [ {text:"偷偷观察", next:"teacher_west_hide"}, {text:"尝试混过去", next:"teacher_west_pass"} ] },
    teacher_west_hide: { text: "你看到一辆马车经过，可能可用作掩护。", choices: [ {text:"跟随马车", next:"ending_teacher_west_escape"}, {text:"另寻出路", next:"teacher_river"} ] },
    teacher_west_pass: { text: "士兵盘问你。", choices: [ {text:"声称自己是教师", next:"teacher_pass_teach"}, {text:"贿赂士兵", next:"teacher_bribe", condition: {hasItem: "钱币"}} ] },
    teacher_pass_teach: { text: "士兵冷哼用枪指着你。", choices: [ {text:"举起双手", next:"ending_teacher_west_escape"} , {text:"贿赂士兵", next:"teacher_bribe", condition: {hasItem: "钱币"}} ] },
    teacher_bribe: { text: "你掏出钱包，企图递给士兵一些钱。", choices: [ {text:"向前塞钱", next:"ending_teacher_west_escape"} ] },

    teacher_river: { text: "河边有几条小船，一些市民正在准备离开。", choices: [ {text:"加入他们", next:"teacher_river_join"}, {text:"自己找船", next:"teacher_river_search"} ] },
    teacher_river_join: { text: "你与其他人一起推船下水。", choices: [ {text:"一起划走", next:"ending_teacher_river_escape"}, {text:"放弃", next:"teacher_church_start"} ] },
    teacher_river_search: { text: "你找到一条破旧的小艇。", choices: [ {text:"修好小艇", next:"teacher_river_fix"}, {text:"寻找更好的船", next:"teacher_river_danger"} ] },
    teacher_river_fix: { text: "你用木板修好小艇并离开。", choices: [ {text:"顺利离开", next:"ending_teacher_river_escape"} ] },
    teacher_river_danger: { text: "在寻找时你被巡逻士兵发现。", choices: [ {text:"逃跑", next:"teacher_river_escape_attempt"}, {text:"反抗", next:"ending_teacher_caught"} ] },
    teacher_river_escape_attempt: { text: "你躲在芦苇丛中，士兵最终离开。", choices: [ {text:"回到小艇", next:"ending_teacher_river_escape"} ] },

    ending_teacher_safe: { text: "系统：你留在教堂，最后被日军坑杀（教师结局1）", choices: [] },
    ending_teacher_west_escape: { text: "系统：你被士兵当场射杀（教师结局2）", choices: [] },
    ending_teacher_river_escape: { text: "系统：你顺利划船进入长江，被日军汽艇扫射沉没（教师结局3）", choices: [] },
    ending_teacher_caught: { text: "系统：你被士兵当场击毙（教师结局4）", choices: [] }
};
