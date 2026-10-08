# GitHub Pages 部署

发布对象为 0.4.0 完整长篇游戏与剧情编辑器。预期地址：

- 游戏：https://forcemind.github.io/No-Way-Out/
- 编辑器：https://forcemind.github.io/No-Way-Out/editor.html

以上是预期地址，只有 GitHub Actions 部署成功并实际访问验证后才视为上线。

## 配置与发布

1. 在仓库 Settings → Pages → Build and deployment，将 Source 设为 **GitHub Actions**。
2. 当前发布分支为 `codex/no-way-out-development`。如 `github-pages` 环境限制部署分支，在 Settings → Environments → github-pages 中允许此分支；原有审批规则继续保留。
3. 推送到 `codex/no-way-out-development` 会自动触发工作流。在 Actions 中找到 **Deploy game to GitHub Pages**，首次设置完成后可对失败运行点击 **Re-run all jobs**。工作流合入默认分支 main 后，才可使用 Run workflow 选择开发分支手动运行。
4. 检查 build 与 deploy 均成功，再打开部署输出的 page_url。需要确认主页、完整长篇选择、继续存档及 editor.html；检查 release.json 的 contentVersion 为 0.4.0。

部署工作流 `.github/workflows/pages.yml` 使用 Node 24 校验故事并执行实际单元测试，检查结局目录未漂移，再运行仓库打包脚本。仅上传 `dist/no-way-out`，不上传源码仓库、Git 元数据、测试产物和 ZIP。deploy 作业拥有 `pages: write` 和 `id-token: write`；其他作业仅有源码只读权限。并发部署排队，避免中断已有部署。

首次 Pages Source 配置需要仓库管理权限。工作流使用 GitHub 内置 GITHUB_TOKEN，不需要在仓库添加个人令牌。没有权限时需仓库管理员完成设置；不应移除已有环境审批要求。

## 当前检查结果 · 2026-10-08

当前环境可以通过既有 HTTPS Git 代理读写本仓库，但 `api.github.com` 和 `forcemind.github.io` 的访问被环境网络策略拒绝。无法从当前机器读取或修改 Pages 设置、查询 Actions 结果、验证线上站点。所需域名已保存到云环境网络草稿，保留原有 github.com 放行项；草稿保存并不等于已经应用到运行环境。

部署工作流与本地静态发布检查已准备好。远端触发、Pages 配置与上线结果仍需通过 GitHub 设置/Actions 或网络配置生效后的实际检查确认。

## 后续更新与回退

- 后续向当前发布分支推送会触发部署。主分支当前仍为旧版本；在合入完整版本前不要手动从旧 main 发布，否则可能覆盖新版站点。
- 如需恢复旧版本，在 Actions 中重新运行已知成功的发布运行；不要强制改写分支历史。
- 从本地服务器切换到 Pages 是更换站点来源，浏览器 localStorage 存档不会自动迁移；访问 editor.html 与游戏使用同一 Pages 来源。
