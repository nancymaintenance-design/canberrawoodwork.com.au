# 本地内容后台交互约定

## Product context

负责人编辑中文，Codex 核对英文。本机界面 zh-CN，显示本机时间；网站保留 en-AU / zh-Hans。目标为可操作的键盘和手机界面，不声称已通过完整 WCAG 认证。

## Business-context sources

唯一产品依据是 `docs/superpowers/specs/2026-10-17-typescript-local-admin-design.md` 的用户批准方案及 `AGENTS.md`。本机专用、保存/发布分离、双语修订绑定、历史保留、无邮件发送均按方案。无账单、账号或角色管理；不在本功能新增法律文案和客户隐私采集。

## Visual contract

见 DESIGN.md。运行时 CSS 为权威，公开网站样式不变。单一浅色工作界面。

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Form | admin/ui/editor.ts openEditor + edit-form | 批准方案 | edit | 浏览器保存/失败 |
| Scrollbar | admin/ui/admin.css 全局规则 | DESIGN.md | 目录/弹窗几何 | computed style |
| Toast | editor.ts message + #status | 本约定 | info/error | role=status |
| CRUD | store.mts + editor.ts render/api | 批准方案 | save/restore | local-admin.check + browser QA |

## Dataset navigation

页面目录搜索；内容每页 20 个字段，搜索后重置页码。当前页面保留在 URL；内容搜索属于本机临时编辑状态，不写入共享网址。预先读取完整的本地字段目录用于零网络搜索，而非服务器分页；没有远程查询或排序、批量选择。

## Flow ledger

保存：编辑 → 禁用保存按钮 → 本地写文件 → 留在当前页并关闭编辑层 → 状态提示。失败保留输入、焦点和错误；409 要求刷新，绝不覆盖。取消：未修改直接关闭，未保存改动先显示确认。恢复：新增修订，不抹去历史。图片：单张选择 → 校验 → 复制新文件 → 再保存字段；原照片不覆盖。打包：检查同步、链接、类型 → 创建本地 ZIP；不会发布。依据均为批准方案。

## Async and resilience

显式保存，无自动保存、乐观提交或后台翻译。服务关闭时显示失败并保留未提交值；重启后已保存内容仍在文件中。版本号、排他写锁、Origin/Host/token 负责防覆盖和本机边界；重启后旧 token 必须刷新。没有不可恢复删除或外部付费动作。

## Validation and overlays

纯文本、受限链接和本站图片路径；原生 dialog 提供 modal/inert/焦点控制。表单 novalidate，错误内联关联字段；确认层默认安全选项。页面关闭仅使用 beforeunload 防止未保存内容丢失。上传校验 PNG/JPEG/WebP、10MB；不允许任意文件路径。

## Verification

类型检查、107 项原站回归、本地数据/API模拟测试、Chrome 1440/390px 实际保存/预览/失败/恢复及截图。独立 ZIP 安装重建。后台不提供新增页面、重排、删除页面或自动上线功能。
