# 无归之城 (No Way Out)

一款基于文本的生存冒险游戏，背景设定在1937年的南京。

## 游戏特色
- **多重身份**：体验市民、难民、学生、士兵等多种身份的独特视角。
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
游戏已预留音频接口。若要添加音效：
1. 将音频文件放入 `assets/audio/` 文件夹。
2. 打开 `js/game.js`，找到 `playBGM` 和 `playSFX` 方法。
3. 取消注释相关代码，并确保文件名匹配。

## 文件结构
- `index.html`: 游戏入口。
- `css/style.css`: 样式表。
- `js/game.js`: 游戏核心引擎。
- `js/data.js`: 剧情文本与数据。
- `assets/`: 资源文件夹。
