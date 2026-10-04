# 无归之城 (No Way Out)

一款基于文本的生存冒险游戏，背景设定在1937年的南京。

## 游戏特色
- **多重身份**：体验市民、难民、学生、医生等 12 种身份的独特视角。
- **分支剧情**：你的每一个选择都会影响最终的结局。
- **生存要素**：管理你的生命值和物品栏，收集关键道具以存活。
- **沉浸体验**：打字机文本效果与深色沉浸式UI。

## 如何运行
由于游戏使用了现代 JavaScript 模块 (ES Modules)，直接双击 `index.html` 可能会因为浏览器的安全策略（CORS）而无法加载。

**推荐方式：**
1. **使用 VS Code Live Server 插件**：
   - 在 VS Code 中打开 `index.html`。
   - 右键点击编辑器内容，选择 "Open with Live Server"。

2. **使用 Python (如果你已安装)**：
   - 在项目根目录下打开终端。
   - 运行 `python -m http.server`。
   - 在浏览器访问 `http://localhost:8000`。

## 自定义音乐与音效
背景音乐已启用，文件为 `assets/audio/BGM.mp3`。替换音乐时保持该路径，或更新 `js/game.js` 中的 `bgmUrl`。点击和打字音效由 Web Audio 合成，不需要另外的音效文件。

游戏设置可调整音乐与音效音量。浏览器存储不可用时，音量在本次运行中仍生效，并提示无法保存。

## 文件结构
- `index.html`: 游戏入口。
- `css/style.css`: 样式表。
- `js/game.js`: 游戏核心引擎。
- `js/data.js`: 剧情文本与数据。
- `assets/`: 资源文件夹。
- `js/core/`: 共用剧情校验与存储保护。
- `js/editor/`: 编辑草稿模型与字段保留。
- `scripts/`: 命令行剧情检查。
- `tests/`: 单元及浏览器回归检查。

## 开发计划与验证

- 完整方案：DEVELOPMENT_PLAN.md。
- 逐步开发及实际验证记录：DEVELOPMENT_LOG.md。

在仓库根目录运行（Node.js 24）：

```bash
node scripts/validate-stories.mjs
node --test --test-isolation=none tests/unit/*.test.mjs
```

剧情校验遇到缺失跳转、格式或规则错误时返回非零状态；`--verbose` 展示待核对警告，`--json` 输出结构化结果。

浏览器回归使用 Python Playwright，自动启动并关闭本地静态服务器：

```bash
python3 tests/e2e/smoke.py
```

默认使用系统 Chromium；可通过 `--browser-path` 指定浏览器路径。当前云镜像已预装所需工具。

## 当前开发状态

M1 稳定性阶段已完成：农夫三个开局选项可继续，编辑器删除与保存保留条件和草稿，无效 JSON 与被引用节点删除受到保护，损坏存档和存储异常可恢复。

最近验证：19 项单元测试通过；剧情检查无错误，当前 618 个节点、865 个选项。23 项待核对警告属于后续内容与条件来源整理，详情见开发记录。

后续按计划推进 M2 核心规则与版本化存档。每一步都会更新开发记录并独立提交。
