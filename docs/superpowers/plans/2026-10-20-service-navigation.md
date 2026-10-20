# Canberra Woodwork：服务导航与咨询路径

本轮由当前 Codex 直接实施，不调用 subagent，不推送或发布。

1. 核实 www.canberrawoodwork.com.au → Ellis Services Group → nancymaintenance-design/canberrawoodwork.com.au → 本 source → codex/typescript-local-admin → Vercel canberrawoodwork-com-au。本机 96d853e 与已上线 a095552 的 Git tree 相同；Git HTTPS fetch 不通，使用已连接平台核对部署来源，不重置工作区。
2. 先为显式映射、单服务指南路径、综合指南路径、双语、循环和失配建立失败测试。既有 keyword-map 保留，首页城市业务词不重新分配。
3. content/navigation-map.json 显式列出 102 个公开页面及 Owner、父级、标签、语言配对、索引元数据和依据。读实际内容归属，不根据 URL 拆目录决定父级。
4. src/navigation-paths.mts 用同一映射输出 nav/ol/li 与唯一 BreadcrumbList，保留其他 Schema、canonical 和 hreflang。单服务指南/案例的父服务页同步提供入口；综合内容保持栏目路径并按主题支持商业页。
5. 使用局部、紧凑的服务/指南/案例链接区与现有咨询、电话配置，补齐首页优先入口及地区页服务入口。browser/navigation-paths.ts 条件复用已有 gtag/dataLayer，不安装分析器、不创建数据层、不将导航点击当转化。
6. scripts/build-navigation-preview.mts 生成独立本地候选并输出映射、按真实 href 图计算的点击距离、来源页面分类计数及回归报告。正常 build 不启用新组件，避免未经审批上线。
7. 全量检查 102 页；运行类型检查、原测试与新增测试；浏览器 360/390/768/1440，双语服务/指南/案例/地区路径、键盘及咨询。GSC/GA4 授权缺失及浏览器连接失败不虚报为实时数据；Rich Results/GSC 正式候选验证待部署后进行。

主要风险测试：错父级/循环、中文混入英文路径、Schema 重复、非 Breadcrumb 标记被覆盖、父页无反向入口、同一来源多链接重复计数、埋点包含参数或重复挂载。
