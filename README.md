# 无归之城 · No Way Out

以 1937 年南京为背景的浏览器文字冒险，包含十二身份六章连续长篇、旧版短篇，以及市民三日生存章节「灯火未熄」。内容版本 0.4.0。

## 游玩

在仓库目录运行静态服务器：

```bash
python3 -m http.server 8000
```

在浏览器打开本机服务器的 index.html；editor.html 为作者编辑器。ES Modules 需要 HTTP，直接双击文件可能无法加载。游戏无需 npm、构建服务或应用密钥。

- 默认完整长篇：每个身份单次通关实际作出 **208 次选择**，九种结局；六章任务必须全部走完。
- 可切换到明确标注的旧版短篇；短篇不计入长篇规模验收。生命、理智、物资、交接条件与历史会随行动变化。
- 三日章节主动从市民开局进入，管理食物、饮水、时段与疲劳，准备决定转移、相守或困守。规则与已测路线见 [SURVIVAL_GUIDE.md](SURVIVAL_GUIDE.md)。
- 自动档继续、三个手动档、剧情回顾、结局收藏。
- 点击文字、点击「显示全文」或使用空格跳过；设置文字速度、字号、音量及减少动画。

存档在当前站点的 localStorage 保存，换域名或端口不会自动搬迁。旧 nw_save 迁移后保留原记录；格式版本为 2，接受内容 0.2.0/0.3.0/0.4.0。未来版本或损坏自动档保留原记录，可将新的进度保存到手动档。

## 创作

编辑器支持条件与效果、草稿自动恢复、切换保护、撤销/重做、ID/文字搜索、引用查看、独立预览、检查后导入 JSON、完整 JSON 备份和当前身份 JS 导出。导出的 `<身份>.js` 可替换 js/stories/ 中的对应文件；请定期导出完整备份。长篇基础文案在 js/stories/expansions/；共享场景结构在 build.js，各身份任务在 profile 模块。既有导出节点优先于生成节点，因此可保留作者改动；长篇预览从序章开始，通过实际行动建立条件，校验拒绝跳章、单选充数或提前结束。

背景音乐文件为 assets/audio/BGM.mp3；点击和逐字音效由 Web Audio 合成。浏览器不支持音效时可继续游玩。Google 字体为可选资源，不可用时使用本地衬线字体。

## 验证与发布包

```bash
node scripts/validate-stories.mjs --verbose
node --test --test-isolation=none tests/unit/*.test.mjs
python3 tests/e2e/smoke.py
python3 tests/e2e/campaigns.py
python3 scripts/build-release.py
python3 tests/e2e/release.py
```

当前 208 项具名单元测试通过；3237 节点、10860 选项、216 结束节点（210 正式、6 归档），无剧情错误和待处理警告。108 种长篇结局全部以实际引擎走完 208 次决策并验证保存恢复；Chromium 逐身份完整点击通关、中途刷新读档、条件叙事回顾及手机布局通过。另保留十二身份旧版代表路线、两个修通分支、三日章节三类结局、编辑器往返和四屏宽检查。覆盖范围见 [tests/README.md](tests/README.md)。

生成的 dist/no-way-out 可直接放到静态站点根目录或项目子目录；dist/no-way-out-0.4.0.zip 为发布包，release.json 包含文件哈希。游戏已发布到 [GitHub Pages](https://forcemind.github.io/No-Way-Out/)，[剧情编辑器](https://forcemind.github.io/No-Way-Out/editor.html) 使用同一站点。远端发布及全部 49 个资源一致性检查通过；Pages 自动部署工作流已接入。构建方式设置及后续发布见 [PAGES_DEPLOYMENT.md](PAGES_DEPLOYMENT.md)。CI 配置位于 .github/workflows/check.yml，远端结果需实际触发后确认。

## 目录与记录

- js/game.js：页面协调；js/core/：规则、状态、存档、时间与校验。
- js/data.js、js/stories/：十二身份与新章节；js/ui/：阅读、设置与收藏。
- js/editor/：作者界面、候选数据与草稿会话；scripts/、tests/：检查和打包。
- [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md)：完整方案与里程碑；[DEVELOPMENT_LOG.md](DEVELOPMENT_LOG.md)：每步修改、验证和提交。
- [CONTENT_REVIEW.md](CONTENT_REVIEW.md)：原有问题的逐项处理；[ENDING_CATALOG.md](ENDING_CATALOG.md)：结局目录；[RELEASE_NOTES.md](RELEASE_NOTES.md)：版本兼容与交付。

开发分支为 [codex/no-way-out-development](https://github.com/ForceMind/No-Way-Out/tree/codex/no-way-out-development)，每一步更新文档、独立提交并推送。Pages 发布和线上资源检查已通过；其余完整回归 CI 结果单独记录。部署配置见 [PAGES_DEPLOYMENT.md](PAGES_DEPLOYMENT.md)。

Firefox、WebKit、真实手机、玩家平衡试玩、文学润色和史实专家审校仍是后续工作。
