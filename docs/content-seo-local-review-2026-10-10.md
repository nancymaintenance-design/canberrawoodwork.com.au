# Canberra网站内容与SEO本地复核｜2026-10-10

状态：仅本地完成，待用户审阅与批准后再考虑发布。本次未push、未部署、未修改GitHub或Vercel设置。共39个既有公开canonical URL：17个服务页、14篇指南、8个栏目/工具页；另有非canonical 404模板用于错误处理，测试日志中的40个HTML包含该模板。

本轮结果：服务页以实际构件、现场判断和报价范围为中心；指南改为回答读者问题；首页承接Canberra木工总主题，Services负责目录，小活页承接分组任务细节。公司、导航、视觉样式、照片、联系渠道和表单行为保留。照片与业务登记资料的保留不代表本轮已完成真实性核验。

## 研究依据与内容边界

使用提供的《Canberra_Carpentry_AI_Keyword_Map.md》（研究日期2026-09-28）和现有站点资料。390条是研究候选，不是实际询盘、Canberra专属搜索量、已确认资质或所有服务能力。研究地图与本地地图均为390行；本地CBR-C-165、CBR-C-254为品牌化问法，与研究原词不同，未为了文字一致擅改ID或扩大服务承诺。

采纳content-writing的声音、具体性、结构与可读性审阅，以及seo-content的内容、署名、链接与证据边界检查；没有使用固定字数、关键词密度或用文案替代案例的做法。[Google官方people-first内容说明](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)用于指导内容是否回答问题，不把字数当排名目标。相关安全提示仅在需要的指南/服务页链接[ACT建筑审批检查](https://www.planning.act.gov.au/applications-and-assessments/building-approvals/check-if-you-need-a-ba)或[Access Canberra石棉许可信息](https://www.accesscanberra.act.gov.au/business-and-work/building-and-construction/asbestos-assessor-and-removal-licensing)。控制端已于2026-10-10核对这些官方页面；本子任务末次网络工具连接失败，没有据此添加数值豁免条件、法律结论或拆卸/承重DIY步骤。

14篇指南使用“By Ellis Services Group”并链接About；发布日期沿用源站记录2026-09-28，更新日期为实际编辑日2026-10-10，两者均可见且与Article JSON-LD一致。历史发布日期是保留的原始记录，尚未由业务另行佐证；没有新增个人专家、资质或专业复核署名。

## 可测量前后结果

基线为1512094776d6cc876f4ee82b956df29cca8d7790；Task1提交ef7975997de1cb4b32d647dfdb5d4e644ff64cad已经过服务页复核。以下词数严格复用原基线算法：取main内部HTML，删除标签，压缩空白后按空格split；不解码或删除实体，包含面包屑和关闭状态的details文字。它是输出体量指标，不是质量分或字数目标。

| 指标 | 原始基线 | 本地最终输出 |
| --- | ---: | ---: |
| 公开canonical URL | 39 | 39 |
| main总词数 | 27,640 | 27,266 |
| 17服务页词数 | 16,208 | 12,751 |
| 14指南词数 | 6,686 | 9,405 |
| 8栏目/工具页词数 | 4,746 | 5,110 |
| H1/H2重复的页面 | 17 | 0 |
| 每页一个H1 | 39/39 | 39/39 |
| 唯一非空title / description | 39 / 39 | 39 / 39 |
| main标题级别跳跃 | 新闻目录有H1→H3 | 0 |
| 新测试检查的无效内部目的地/片段 | 编辑前检查已通过 | 0 |
| 指南可见日期与Article一致 | 原基线未采集该字段 | 14/14 |
| 指南链接公司署名 | Task2 RED时缺少 | 14/14 |
| FAQPage schema | 0 | 0 |

总词数比原始基线减少374（约1.4%）。Task1之后为24,195，本轮增加3,071；其中指南补足决策内容，目录删去重复研究同义词。没有把增长/缩减直接解释为排名改善。内部链接有效性在Task2修改前已通过；本轮的编辑改善是相关主题的相关阅读、描述性服务锚文本及目录路径，而不是“修复了原本大量坏链接”。

## 39页逐项复核与编辑评分

以下Q、E/E/A/T和G为人工编辑判断，非Google评分、排名预测、专业认证或商业核验。细小分差不代表统计精度，合理判断误差约±10分。

Q满分100：声音与可读表达30、问题具体性25、正文结构20、主题/metadata/链接15、句段易读性10。未运行Flesch测量；可读性项是编辑判断。E/E/A/T各25分，依次为经验、专业性、权威性、信任。经验仅给现有媒体/过程呈现的有限分，照片来源、项目与客户结果未验证；专业性反映解释和边界，不假定作者资格；权威性没有新增外部认可证据；信任反映公司身份、联系、隐私与署名日期的透明度。前后没有做同一人工评分，因此不报告虚构的评分涨幅。

G满分100：问题直接回答25、可独立理解的构件/判断信息25、结构与语义一致20、Owner与来源可追溯20、更新透明度10。它仅表示AI引用准备度；没有测试ChatGPT/Google AI/Perplexity实际引用、抓取资格或曝光。隐私页是工具页，G较低不是要求添加木工关键词。

| URL | 意图与关键词主题 | 逐页变化/复核重点 | main词数前→后 | Q/100 | E/E/A/T 各/25 | G/100 |
| --- | --- | --- | ---: | ---: | --- | ---: |
| / | 总入口；Canberra carpentry、timber repairs | 按构件与维修/安装分流；保留地图、轮播、联系入口 | 802→889 | 82 | 5/14/3/18 | 73 |
| /services/ | 目录；component-based carpentry services | 17个服务入口；移除40条研究同义词堆列，改为范围选择 | 926→665 | 83 | 5/14/3/18 | 72 |
| /services/small-carpentry-jobs/ | 小活清单；grouped repairs、itemised quote | Task1：逐项任务、优先级、最低费用与报价范围 | 1090→929 | 84 | 5/14/3/18 | 76 |
| /services/door-and-frame-repairs/ | 门及框；sticking door、jamb、clearance | Task1：门扇/门框与五金分开判断；地板间隙与可修边界 | 1078→922 | 85 | 5/14/3/18 | 77 |
| /services/timber-window-repairs/ | 木窗；sill、frame、sash | Task1：局部/关联框材、排水、玻璃保留边界 | 901→814 | 85 | 5/14/3/18 | 77 |
| /services/rotten-timber-repairs/ | 通用腐木；moisture、sound timber | Task1：成因、合适保留木材、虫害证据与漏源分工 | 822→699 | 85 | 5/14/3/18 | 78 |
| /services/fascia-and-eaves-repairs/ | 屋檐构件；fascia、bargeboard、lining | Task1：构件/材质区分、排水、进入条件与石棉来源 | 1026→743 | 85 | 5/14/3/18 | 78 |
| /services/deck-repairs/ | 现有平台；boards、frame、finish | Task1：面板/支撑和表面维护分离；Task2合并重复重建指南链接 | 1191→812 | 86 | 5/14/3/18 | 79 |
| /services/timber-fence-repairs/ | 木围栏；posts、rails、palings | Task1：局部/长段维修、柱脚及边界责任 | 967→788 | 84 | 5/14/3/18 | 76 |
| /services/timber-gate-repairs/ | 木门闸；sagging、hinges、post | Task1：整体受力、铺地间隙；电动设备不据词库承诺 | 888→732 | 84 | 5/14/3/18 | 76 |
| /services/skirting-and-architraves/ | 线脚；profile、floor junction | Task1：高度/厚度/材质、地板顺序与油漆范围 | 1110→815 | 85 | 5/14/3/18 | 77 |
| /services/cabinet-door-and-drawer-repairs/ | 柜体小修；hinges、runners、panel | Task1：零件兼容、板材固定、漏水与玻璃边界 | 993→821 | 85 | 5/14/3/18 | 77 |
| /services/interior-carpentry/ | 室内收尾；shelving、renovation finish | Task1：安装清单、基面固定、预留工序与收口 | 810→644 | 83 | 5/14/3/18 | 74 |
| /services/timber-weatherboard-repairs/ | 木外墙板；profile、lap、backing | Task1：型面搭接、背衬、材料识别和饰面 | 732→576 | 84 | 5/14/3/18 | 75 |
| /services/timber-stair-and-handrail-repairs/ | 木楼梯扶手；tread、support、rail | Task1：安全停用、连接与基面；不提供承重DIY | 1071→736 | 85 | 5/14/3/18 | 77 |
| /services/pergola-timber-repairs/ | 凉棚维修；post、beam、connections | Task1：支撑路径、柱/梁/连接和项目检查 | 998→656 | 84 | 5/14/3/18 | 76 |
| /services/custom-joinery/ | 定制储物；layout、manufacture、fit | Task1：测量设计与供应安装；不虚构工厂/展厅 | 854→664 | 83 | 5/14/3/18 | 74 |
| /services/structural-timber-repairs/ | 结构木材；supports、termite findings | Task1：项目资料、专业职责和虫害报告；不承诺免审批 | 841→709 | 84 | 5/14/3/18 | 76 |
| /services/deck-building/ | 新建/扩建；deck layout、materials | Task1：位置尺寸用途、构造与审批区别于旧deck维修 | 836→691 | 84 | 5/14/3/18 | 76 |
| /about/ | 身份与流程；Ellis company、Canberra team | 解释法定实体、现场评估、范围变更；登记不等于资质 | 302→355 | 84 | 5/12/3/19 | 70 |
| /faq/ | 预约与报价；photos、scope、materials | 保留9个一般FAQ；新增材料兼容、维修/替换解释及Owner链接 | 583→680 | 84 | 5/14/3/18 | 76 |
| /news/ | 知识目录；timber repair questions | 问题型标题；新增列表H2；14篇指南与主题组入口 | 621→993 | 83 | 5/14/3/18 | 75 |
| /news/timber-door-sticks-after-rain/ | 信息；why door sticks after rain | 湿度/合页/门框判断；安全观察及先查原因再修边 | 435→723 | 86 | 5/15/3/18 | 80 |
| /news/deck-boards-or-frame/ | 信息；deck boards versus framing | 分清表面与支撑、可安全记录范围及换板/上油区别 | 435→656 | 86 | 5/15/3/18 | 81 |
| /news/rotten-window-sill/ | 信息；can a rotten sill be repaired | 拼接/整段更换、端部与排水、玻璃职责和安全照片 | 646→708 | 86 | 5/15/3/18 | 80 |
| /news/fascia-bargeboard-eaves/ | 信息；difference between roof-edge parts | 构件定义、地面观察、未知衬板和石棉官方链接 | 457→663 | 87 | 5/15/3/18 | 82 |
| /news/leaning-paling-fence/ | 信息；why a fence leans | 柱/横档/板条功能、损坏长度、维修比较与财产权分开 | 341→613 | 85 | 5/15/3/18 | 78 |
| /news/skirting-after-new-flooring/ | 信息；planning skirting after flooring | 完整型面、完工地面、门套交接和饰面逐项确认 | 409→617 | 86 | 5/15/3/18 | 79 |
| /news/why-timber-gates-sag/ | 信息；why gate sags or will not latch | 门柱/合页/门扇受力与间隙；电动系统范围 | 327→615 | 85 | 5/15/3/18 | 79 |
| /news/why-timber-rot-returns/ | 信息；why rot returns after repair | 持续水路、维修边界、构件功能和虫害证据 | 685→750 | 86 | 5/15/3/18 | 81 |
| /news/cabinet-hinges-and-drawer-runners/ | 信息；one hinge or runner repair | 硬件与固定基材区分、零件兼容、渗漏与新柜体不同 | 360→651 | 86 | 5/15/3/18 | 79 |
| /news/timber-weatherboard-damage/ | 信息；individual weatherboard replacement | 型面搭接、隐藏基层、未知材质及油漆边界 | 252→559 | 85 | 5/15/3/18 | 78 |
| /news/loose-timber-stairs/ | 信息；what to do about loose stairs | 停止依赖松动构件、安全记录、基面及ACT项目检查 | 340→587 | 86 | 5/15/3/18 | 81 |
| /news/pergola-post-rot/ | 信息；post repair versus replacement | 不先拆柱；支撑路径、柱脚积水和更换条件 | 561→650 | 86 | 5/15/3/18 | 81 |
| /news/repair-or-rebuild-a-deck/ | 信息；repair versus rebuild deck | 保留三方案表；整体系判断、报价变更、维护与ACT来源 | 996→848 | 88 | 5/15/3/18 | 83 |
| /news/carpentry-jobs-before-selling/ | 信息；prioritise pre-sale repairs | 安全/功能/外观分层、房间清单、柜体小修；不许诺售价 | 442→765 | 85 | 5/15/3/18 | 79 |
| /service-areas/ | 地区确认；Canberra districts、suburbs | 9个地区各自提供访问/任务提示；不推断项目或分办公室 | 1039→954 | 81 | 5/14/3/18 | 69 |
| /contact/ | 询盘；Canberra quote、assessment | 说明联系后流程、现场检查与书面报价；照片可选，不增表单字段 | 304→364 | 84 | 3/10/3/19 | 71 |
| /privacy/ | 隐私工具页；enquiry information | 明确必填/可选资料、文本表单和另寄照片用途、联系方式 | 169→210 | 83 | 1/4/3/17 | 55 |

## QA证据与可重复审计

新增scripts/audit-content.mjs，不依赖第三方库；从sitemap读取39条路由并输出每页title、description、H1/各级标题、原算法词数、正文链接与锚文本、FAQ、可见日期及Article日期。普通检查只需构建后执行：

```powershell
node scripts/test.mjs
node scripts/audit-content.mjs
```

有本地基线文件时可带对比与JSON输出：

```powershell
node scripts/audit-content.mjs --baseline .superpowers/sdd/content-seo-2026-10-10/baseline.json --output .seo-cache/content-audit-2026-10-10.json
```

RED：新增测试先确认新闻列表H1→H3和指南缺少链接署名/日期确实失败；编辑前内部链接/片段检查已通过。GREEN：最终完整node scripts/test.mjs通过33项测试，覆盖既有安全/SEO/联系表单回归及新增39页输出检查。旧有“打印每个研究同义词”“某段文案必须逐字存在”等检查改为保留主题范围和实际服务目的地；未放宽资质、安全、联系方式或schema约束。审计词数还以实体和关闭details的小样本固定算法语义，测试不依赖被忽略的本地基线文件。

控制端已记录：首页本地GET为200，预览仅回环地址监听；门维修页面实际渲染和一个FAQ展开已检查，保留样式。另已抽查新闻目录H1/H2/H3顺序、沿链接进入木门指南、公司署名及发布日期/更新日期，并展开“Should I sand...”安全回答，页面布局与阅读表现保留。这是局部浏览器抽查，不是39页逐页视觉验收。控制端随后逐条请求39个公开URL，39/39均返回HTTP 200。最初并发突发请求超过Python预览服务器监听队列，顺序重查通过，未发现应用代码问题。未提交真实联系表单，未测试真实邮件投递；现有API/表单回归通过不能等同真实邮件送达。未测排名、收录、真实CWV、询盘增长、生产重定向链或第三方引用。

.seo-cache/pages/homepage/content.json记录本地发现、问题、建议和限制；完整审计JSON同置缓存。缓存已加入.gitignore与.vercelignore，不提交、不部署。内部.superpowers与docs也由现有部署忽略排除；用户报告保存在Git源码供复核，不是公开网页。Task1误入Git的内部报告仅从索引取消跟踪，本地文件保留。

## 待业务佐证与用户验收

- 核对公司登记字段、地址、电话、邮箱，以及各项条件业务的实际服务范围；ABN记录不等于ACT专项资质。
- 提供有授权的真实项目说明、照片来源、施工角色与结果，才能增强Experience；现有图片不能被本报告认定为Ellis已完成项目。
- 如要展示资质、保险、供应/制造安排或专业作者，先提供可核验资料；本轮未编造或强化这些证明。
- 核对报价流程、到访费用、预约和资料处理说明是否与实际一致。隐私页没有新增保留期限、供应商、法定权利或合规保证。
- 逐页检查14篇指南的判断条件与安全边界、8个栏目页的表达和39个URL；历史发布日期请业务确认。
- 控制端完成最终本地HTTP/交互复核后，用户批准具体内容与发布安排。本地提交不代表已获发布授权。

当前交付停留在本地审阅阶段。所有计分与文字调整都不能替代业务事实、专业检查或真实网站运行证据。
