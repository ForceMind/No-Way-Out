# GitHub Pages 部署

发布对象为 0.4.1 游戏与剧情编辑器，主页只有统一的开始游戏入口。预期地址：

- 游戏：https://forcemind.github.io/No-Way-Out/
- 编辑器：https://forcemind.github.io/No-Way-Out/editor.html

以上是预期地址，只有 GitHub Actions 部署成功并实际访问验证后才视为上线。

## 配置与发布

1. 在仓库 Settings → Pages → Build and deployment，将 Source 设为 **GitHub Actions**。
2. 发布分支为 `main`，遵守 github-pages 现有发布分支保护。开发分支不直接部署；先将已验证版本正常合入 main。
3. 推送到 `main` 自动触发工作流；也可在 Actions → Deploy game to GitHub Pages → Run workflow 选择 main 发布。首次设置完成后可对失败运行点击 Re-run all jobs。
4. 检查 build、deploy 与 verify 均成功，再打开部署输出的 page_url。需要确认主页、人物选择、继续存档及 editor.html；检查 release.json 的 contentVersion 为 0.4.1。

部署后独立 verify 作业读取实际站点 deployment.json，确认提交号与本次发布一致，并核对 release.json 中每个文件的 SHA-256、长度与模块 MIME；CDN 尚未更新时有限重试。

部署工作流 `.github/workflows/pages.yml` 使用 Node 24 校验故事并执行实际单元测试，检查结局目录未漂移，再运行仓库打包脚本。仅上传 `dist/no-way-out`，不上传源码仓库、Git 元数据、测试产物和 ZIP。deploy 作业拥有 `pages: write` 和 `id-token: write`；其他作业仅有源码只读权限。并发部署排队，避免中断已有部署。

部署作业会使用内置 Pages 写入权限检查并将 Source 设为 GitHub Actions，避免旧分支构建与新发布互相覆盖；若仓库权限拒绝这项配置写入，再由管理员在 Settings → Pages 中设置。工作流使用 GitHub 内置 GITHUB_TOKEN，不需要在仓库添加个人令牌。没有权限时需仓库管理员完成设置；不应移除已有环境审批要求。

## 当前检查结果 · 2026-10-08

当前环境可以通过既有 HTTPS Git 代理读写本仓库，但 `api.github.com` 和 `forcemind.github.io` 的访问被环境网络策略拒绝。无法从当前机器读取或修改 Pages 设置、查询 Actions 结果、验证线上站点。所需域名已保存到云环境网络草稿，保留原有 github.com 放行项；草稿保存并不等于已经应用到运行环境。

初次开发分支发布已实际触发：build 成功，deploy 被 github-pages 的发布分支保护拒绝。通过允许的 github.com 网页读到了运行状态；设置页需要管理权限，当前无法读取。已确认 main 是本次版本的祖先，改为通过正常快进 main 发布，不修改或绕过环境保护。最终上线以 main 发布的 deploy 与远端 verify 结果为准。

## 后续更新与回退

- 后续将开发成果正常合入 main 会自动部署；开发分支推送仅运行检查。
- 如需恢复旧版本，在 Actions 中重新运行已知成功的发布运行；不要强制改写分支历史。
- 从本地服务器切换到 Pages 是更换站点来源，浏览器 localStorage 存档不会自动迁移；访问 editor.html 与游戏使用同一 Pages 来源。

## 实际上线检查

GitHub Pages 运行 [37749981081](https://github.com/ForceMind/No-Way-Out/actions/runs/37749981081) 已全部成功：发布 0.4.0，并由远端运行器核对发布提交和 49 个实际站点文件的 SHA-256、长度及模块 MIME。游戏地址为 https://forcemind.github.io/No-Way-Out/ 。

Pages 当前 Source 是 legacy。内置 GITHUB_TOKEN 可以发布，但修改 Source 的请求未成功；保留现有设置，不移除任何环境保护。建议仓库管理员将 Settings → Pages → Source 设为 GitHub Actions，避免旧分支构建与新工作流发布互相覆盖。配置写入失败会明确告警，不会省略关键的 deploy 与 verify。

最新排障确认：main 上的旧 Pages 分支构建会在自定义发布后替换站点，造成 deployment.json 消失（HTTP 404）。现有环境保护继续保留；deploy 作业仅增加 actions:read 查询同一提交的内置 Pages 构建状态，有限等待其完成后再正式发布，保证不会被这次旧构建随后覆盖。等待超时与线上核验失败均使发布运行失败。建议管理员仍将 Source 改为 GitHub Actions，消除重复构建。
