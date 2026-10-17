---
version: alpha
name: "Ellis local content admin"
description: "中文内容编辑工作台；公开网站视觉和内容保持原样。"
colors:
  primary: "#975a30"
  ink: "#30251d"
  muted: "#766d64"
  border: "#ded6ca"
  surface: "#fffdfa"
  background: "#f3efe8"
  focus: "#326887"
typography:
  body:
    fontFamily: "Microsoft YaHei, Segoe UI, sans-serif"
    fontSize: "15px"
    lineHeight: "1.65"
rounded:
  DEFAULT: "7px"
  panel: "9px"
  dialog: "12px"
spacing:
  sidebar: "270px"
  field: "20px"
components:
  button: {}
  field: {}
  dialog: {}
---

# Ellis 本地后台设计

## Overview

面向网站负责人，在 Windows 本机编辑中文。参考木作工单的阅读顺序：页面 → 内容位置 → 中文 → 操作。密集、有序的文字表单是主角；不做营销大屏，不添加装饰性空白。本设计只适用于 admin，绝不改变公开网站样式。

## Colors

沿用 Ellis 木色。运行时权威是 `admin/ui/admin.css` 的 `:root`：primary→--brand，ink→--ink，muted→--muted，border→--line，surface→--paper，background→--ground，focus→--focus。此文件镜像实际值，不另建主题生成器。正常模式为浅色，强制对比模式由操作系统控制。

## Typography

中文采用微软雅黑，英文 Segoe UI 回退；正文 15px/1.65。页面标题 30px，手机 25px。标签和所属章节区分层级，长中文、URL 均可换行。没有远程字体或字体加载位移。

## Layout

桌面为 270px 页面目录加内容工作区，900px 目录变为 220px，600px 以下上下排列。内容每页 20 项，不改变公开网站栏目顺序。页面自然滚动，目录和弹窗可以独立滚动。

## Elevation & Depth

边框和背景区分层级；列表不用浮夸阴影。原生 dialog 的 backdrop 区分编辑层，正文不受它影响。

## Shapes

控制按钮 7px、列表 9px、弹窗 12px 圆角。表单以统一横线组织，禁止碎片化彩色卡片。

## Components

原生 button 和 a 分别负责操作和导航；焦点采用 --focus。按钮 busy 时保持文字和尺寸。编辑使用同一个 dialog，状态反馈使用 #status，错误使用 #edit-error。保存后回到原列表；清空搜索立即执行；未保存关闭时确认。滚动条全局继承 CSS，不依赖某个容器类。只有图像选择用操作系统文件选择器，没有日期/下拉选择控件。无动画，因此减少动态效果模式无需额外动画逻辑。

## Do's and Don'ts

- 保留品牌和网站原内容；后台仅编辑内容，不提供任意 HTML/代码注入。
- 标明全站公共字段、中文待同步和本地保存状态。
- 不把打包称为发布，不自动提交 Git 或部署。
- 不通过视觉调整掩盖保存失败或英文缺失。
