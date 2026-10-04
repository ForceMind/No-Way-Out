# 内容处理记录

基线：5367e64（616 节点、860 选项）。0.3.0：633 节点、900 选项、108 个结束节点。当前 0.4.0：3237 节点、10860 选项、216 个结束节点，其中 6 个归档、210 个正式结束节点。原有 25 个不可达节点修通 19 个、归档 6 个；12 处物品来源问题已修复。节点均保留原 ID。

## 原有不可达节点

| 节点 | 决定 | 依据 / 入口 |
| --- | --- | --- |
| citizen.ending3 | 归档保留 | 旧结局草稿缺少相应前置事件，保留 ID 兼容旧记录，等待剧情扩写。 |
| citizen.ending_escape_east | 归档保留 | 旧结局草稿缺少相应前置事件，保留 ID 兼容旧记录，等待剧情扩写。 |
| citizen.ending_escape_west | 归档保留 | 旧结局草稿缺少相应前置事件，保留 ID 兼容旧记录，等待剧情扩写。 |
| refugee.warehouse_info | 修通 | M6：warehouse1 → warehouse_info → 下水道完整分支 |
| refugee.sewer1 | 修通 | M6：warehouse1 → warehouse_info → 下水道完整分支 |
| refugee.sewer_inside1 | 修通 | M6：warehouse1 → warehouse_info → 下水道完整分支 |
| refugee.sewer_rat | 修通 | M6：warehouse1 → warehouse_info → 下水道完整分支 |
| refugee.ending_refugee_sewer | 修通 | M6：warehouse1 → warehouse_info → 下水道完整分支 |
| farmer.farmer_east | 修通 | M1：farmer_food / farmer_family 连接教堂、城门和河边旧分支 |
| farmer.farmer_bribe | 修通 | M1：farmer_food / farmer_family 连接教堂、城门和河边旧分支 |
| farmer.farmer_west | 修通 | M1：farmer_food / farmer_family 连接教堂、城门和河边旧分支 |
| farmer.farmer_hide_west | 修通 | M1：farmer_food / farmer_family 连接教堂、城门和河边旧分支 |
| farmer.farmer_church | 修通 | M1：farmer_food / farmer_family 连接教堂、城门和河边旧分支 |
| farmer.farmer_help_church | 修通 | M1：farmer_food / farmer_family 连接教堂、城门和河边旧分支 |
| farmer.farmer_river | 修通 | M1：farmer_food / farmer_family 连接教堂、城门和河边旧分支 |
| farmer.farmer_boat | 修通 | M1：farmer_food / farmer_family 连接教堂、城门和河边旧分支 |
| farmer.farmer_find_boat | 修通 | M1：farmer_food / farmer_family 连接教堂、城门和河边旧分支 |
| farmer.ending_farmer_safe | 修通 | M1：farmer_food / farmer_family 连接教堂、城门和河边旧分支 |
| farmer.ending_farmer_secret | 修通 | M6：farmer_west → 沿田埂寻找小路 |
| farmer.ending_farmer_east_escape | 修通 | M1：farmer_food / farmer_family 连接教堂、城门和河边旧分支 |
| farmer.ending_farmer_west_escape | 修通 | M1：farmer_food / farmer_family 连接教堂、城门和河边旧分支 |
| farmer.ending_farmer_river_escape | 修通 | M1：farmer_food / farmer_family 连接教堂、城门和河边旧分支 |
| agent.ending_agent_river_escape | 归档保留 | 旧结局草稿缺少相应前置事件，保留 ID 兼容旧记录，等待剧情扩写。 |
| agent.ending_agent_east_escape | 归档保留 | 旧结局草稿缺少相应前置事件，保留 ID 兼容旧记录，等待剧情扩写。 |
| agent.ending_agent_secret_escape | 归档保留 | 旧结局草稿缺少相应前置事件，保留 ID 兼容旧记录，等待剧情扩写。 |

## 原有物品来源问题

| 原条件位置 | 处理 |
| --- | --- |
| citizen.pass_explain.choices[1] | M2：relative_secret 可带走旧钱币 |
| citizen.east1.choices[0] | M2：relative_secret 可带走旧钱币 |
| refugee.east_escape_plan.choices[0] | M2：shop1 可寻找柜台零钱 |
| teacher.teacher_west_pass.choices[1] | M2：teacher_collect 可带上自己的零钱 |
| teacher.teacher_pass_teach.choices[1] | M2：teacher_collect 可带上自己的零钱 |
| merchant.merchant_east.choices[0] | M2：条件统一金条，商铺与逃跑开局均有来源；四处支付消耗金条 |
| merchant.merchant_west.choices[0] | M2：条件统一金条，商铺与逃跑开局均有来源；四处支付消耗金条 |
| merchant.merchant_church.choices[0] | M2：条件统一金条，商铺与逃跑开局均有来源；四处支付消耗金条 |
| merchant.merchant_river.choices[0] | M2：条件统一金条，商铺与逃跑开局均有来源；四处支付消耗金条 |
| farmer.farmer_east.choices[0] | M1：farmer_family 带上铜钱 |
| agent.agent_day3_kill.choices[1] | M2：agent_prepare 在当前身份选择步枪或手术刀 |
| agent.agent_day4_morning.choices[0] | M2：agent_prepare 在当前身份选择步枪或手术刀 |

## 检查范围与内容边界

- 所有身份通过结构、引用、规则和物品来源检查；十二身份各一条经典路线、新章节三类结局及两个修通分支进行浏览器通关。结局目录由当前数据生成，未声称逐条走完全部 102 个正式结局。
- 新三日章节使用虚构人物与个人经历；旧路线保留原有叙事和悲剧结局。归档节点没有充分前置情节，接入前需补写因果并取消 archived。校验阻止正式路线引用归档节点。
- 旧文中的反攻预期、人物行为、军事地点和具体事件未完成史料核验；不将角色的推测表述为经过审校的历史事实。史实专家审校、整体文学润色、真实玩家试玩仍是后续内容工作。
- M1 的两处缺失跳转已修复；M2 针对物品名差异作明确修订，未按模糊名称合并所有贵重物品。

## 十二身份完整长篇

每个身份六章连续任务、208 次实际决策和九种结局。全部 108 种长篇结局经过生产引擎路线见证与中途存档恢复；结构检查禁止循环、跳章、单选充数与提前结束。旧剧情明确为旧版短篇，不计入长篇规模。长篇人物、目标、物件、证据与结局文案见 js/stories/expansions/，场景按共享结构生成，文学润色与专业史实审校仍待后续，不将自动检查作为这些工作的替代。
