# Canberra Woodwork 双语维护规则

本目录服从 E:/Ellis-Services/AGENTS.md。用户于2026-10-16要求：全站中英双语，今后修改需同步；当前双语版本仅授权本地预览，确认后才能部署。

- 英文页面保留现有地址，中文对应 `/zh/`。导航“中文服务”紧随 Contact；中文页“English”切回同一页面。两种语言共享布局、图片、锚点、业务事实与表单API。
- 修改英文原文、标题、描述、alt、表单标签或无障碍名称时，同步更新 `src/locales/zh-Hans.json` 中对应的 `en` / `zh`；原文哈希及原文内容必须匹配。`src/localization.mjs` 遇缺译或旧译即使构建失败，禁止增加静默英文回退绕过检查。
- `node scripts/translation-inventory.mjs` 会重新渲染当前全部英文源页面，提取待维护文本并保留未变更原文的中文译文；新内容留空待翻译。更新译文后运行完整构建。不要从旧dist手工拷贝文本；删除旧条目须核对正文与schema用途。
- 所有运行时提示同时修改 `public/assets/i18n.js` 的 en/zh 文案。新增页面经统一 `bilingualPages` 构建，新增内链、metadata、schema与文章feed须核验两种语言。
- 中文事实不得偏离英文；中文独立修改如涉及服务范围、案例事实、联系人或流程，必须同步英文源内容。翻译措辞修正可仅调整译文，不改变事实。
- 保持电话 `0405 878 406` / `tel:+61405878406`，邮箱 `brian@elliservices.com.au` 及现有API/Resend行为。品牌、产品名称、街道地址和当地英文城区名可保留原文。
- 交付前运行 `node scripts/test.mjs`，浏览器检查中英切换、中文FAQ、表单提示、手机导航、文章与案例。生产发布必须得到用户当次明确授权，走 GitHub → Vercel。
