---
title: TimepoolInput
nav:
  title: 组件
  path: /components
group:
  title: 表单
  path: /form
  order: 7
legacy: /form/timepool-input
---

## 商品订单、退货单、费用调整、电子券核销、卡核销列表 通用组件

> 组件修改需同时兼容供应商系统和供应链系统，平台通过 `PLATFORM` 来判断，在供应商或者供应链中任何一处对该组件作出修改，需同步

### Examples

默认写法

```
import RecyclerView from '../../../../component/recycler/index'

<RecyclerView
    settlementItems={detail.settlementItems}
    billIdList={[this.billId]}
/>
```

扩展 tab 写法

```
import RecyclerView from '../../../../component/recycler/index'

const DiffTabComponent = {
    tabName: '其它差异调整',
    key: 9996,
    component:  <DiffTab settlementId={settlementInfo.settlementId}/>
}

<RecyclerView
    settlementItems={settlementInfo.settlementItems}
    billIdList={billIdList}
    dynamicTab={DiffTabComponent}
/>

```

### 参数

1、 `settlementItems`（结算项列表）

- 商品订单
  - 退货单
  - 费用调整
- 电子券核销
- 卡核销

2、 `billIdList`（对账单号列表）

3、 `dynamicTab`（需要传入的扩展 tab 和组件）

### API

参数说明如下：

| 参数            | 是否必须 | 说明         | 类型         | 默认值   |
| --------------- | -------- | ------------ | ------------ | -------- |
| settlementItems | Y        | 对账单号列表 | String Array | []       |
| billIdList      | Y        | 结算项列表   | Int Array    | []       |
| dynamicTab      | N        | tab 扩展配置 | Object       | undefind |

##### settlementItems 类型对应说明

| type | 说明       | 关联说明               |
| ---- | ---------- | ---------------------- |
| 1    | 商品订单   | 无                     |
| 2    | 电子券核销 | 无                     |
| 3    | 卡核销     | 无                     |
| 9998 | 退货单     | 商品订单存在时自动添加 |
| 9999 | 费用调整   | 商品订单存在时自动添加 |

##### dynamicTab 字段说明

| 参数      | 说明                | 类型   |
| --------- | ------------------- | ------ |
| tabName   | 需要扩展的 tab 名称 | String |
| key       | 对应的 tab 标识     | Int    |
| component | 传入的组件          | 组件   |

**`特别注意： key 不能和上面 settlementItems 已定义类型冲突`**
