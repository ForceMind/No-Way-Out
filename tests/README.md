# 检查说明

游戏运行没有第三方依赖。开发检查使用 Node.js 24 与 Python 3.12；浏览器依赖固定在 requirements.txt，当前云镜像已具备 Playwright 1.62.0 和 Chromium。

```bash
node scripts/validate-stories.mjs --verbose
node --test --test-isolation=none tests/unit/*.test.mjs
python3 tests/e2e/smoke.py
python3 tests/e2e/campaigns.py
python3 scripts/build-release.py
python3 tests/e2e/release.py
```

当前共 208 个具名单元用例，无跳过。云机器默认 Node 进程隔离曾只报告文件通过却未执行用例，所以必须保留 --test-isolation=none，并检查实际用例数。规则包括原子失败、旧效果别名、来源通路、迁移、异常存储、编辑器往返、逐字完成、资源与三日结算。

浏览器脚本自行管理随机端口服务器与临时浏览器上下文，不依赖已有服务；完成时仅关闭自己创建的服务器。默认采用系统 Chromium，否则采用 Playwright 浏览器，可使用 --browser-path 或 CHROMIUM_PATH 指定。代理继承环境配置，仅本地服务器不走代理，TLS 校验保持开启。

campaigns.py 在 390 像素 Chromium 中逐身份实际执行 208 次按钮选择，验证 120 次选择后刷新与手动读档、条件叙事与历史、九种结局类型的代表路线及编辑器长篇预览。所有 108 个长篇结局另由单元测试逐条引擎通关并验证存档恢复。

smoke.py 验证兼容存档路线、两个修通分支、三日章节旧存档恢复、游戏与编辑器主要交互、四个屏宽、模态框键盘焦点、版本保护和异常存储。release.py 验证生成目录在根路径与项目子路径下的全部文件哈希、JS MIME、十二模块、实际结局和编辑器；记录本机测量至 test-results/release-metrics.json。Google 字体请求失败为可选资源问题，其他应用资源错误会失败。

失败时保留原始异常/退出码，保存可用页面截图、浏览器追踪及错误列表至 test-results/。产物不提交到 Git；CI 的 upload-artifact 会保存它们。所有 CI 命令已在当前环境执行，GitHub Actions 本身尚未远端触发。

其他机器首次准备测试依赖：

```bash
python3 -m pip install -r tests/requirements.txt
python3 -m playwright install --with-deps chromium
```

这些下载只用于开发检查，需要所在机器的网络允许相应包与浏览器下载。无需为游戏增加 npm 或第三方运行库。

Firefox、WebKit、真实手机、完整结局逐条试玩、玩家平衡与史实审校尚未覆盖。

0.4.1 的新游戏只有人物主线。campaigns.py 验证主页没有模式和选择次数宣传、游戏不展示决策预算，十二身份均直接开始完整主线。smoke.py 使用实际存档格式构造历史存档来验证兼容，未增加调试模式、隐藏参数或产品入口；屏宽、继续、保存和跳过文本均通过统一新游戏流程检查。
