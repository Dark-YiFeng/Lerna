---
title: BreadcrumdHeader
nav:
  title: 组件
  path: /components
group:
  title: 导航
  path: /nav
  order: 9
legacy: /nav/breadcrumd-header
---

## breadcrumd-header

### BreadcrumbHeader

BreadcrumbHeader 是一个放置在页面顶端的面包屑组件。接收 `BreadcrumbList` 和 `children` 两个 prop。

#### API

| 参数           | 必须 | 说明                               | 类型                         | 默认值    |
| -------------- | ---- | ---------------------------------- | ---------------------------- | --------- |
| BreadcrumbList | 是   | 面包屑没屑不行                     | [{ moduleRoute,moduleName }] | 无        |
| children       | 否   | 右侧可放置一些额外的节点，例如按钮 | ReactDom or Dom              | 无        |
| isShowGoback   | 否   | 是否展示返回按钮                   | Bool                         | undefined |
