---
title: FormGroup
nav:
  title: 组件
  path: /components
group:
  title: 表单
  path: /form
  order: 7
legacy: /form/form-group
---

## form-group

### 特性

1.组件基于 antd 的二次开发

2.布局灵活,自动响应式

### 快速开始

```js
import React from 'react'
import FormGroup from '@jsroot/components/FormGroup'
import './index.less'

class Com extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef()
    // 此时在合成事件中调动this.formRef.current.props.form.getFieldsValue等方法
  }
  get formType() {
    return [
      { id: 'settlementId',label: '缴费编号', controlType: 1 },
      { id: 'settlementId1',label: '费用类型', controlType: Select, selectOptions: [{ label: '影院1', value: 1 }],controlProps: { onSelect: () => { console.log('it was changed') } } },
      { id: 'settlementId2',label: '付款渠道',controlType: 2,selectOptions: [] },
      { id: 'settlementId3',label: '运营商',controlType: 2,selectOptions: [] },
      { id: 'billid',label: '操作时间',controlType: RangePicker,fieldDecorator: {
          rules: [{ required: true, message: '请选择操作时间' }],
        	// onChange: () => {console.log('time was changed')}
       } }
    	]

  }
  render() {
    return (
      <div>
          <FormGroup wrappedComponentRef={this.formRef} formType={this.formType}></FormGroup>
      </div>
    )
	}
}

export defautl Com
```

为防止样式冲突,可以导入 normalize.less 至组件的样式表中

```less
@import '../../../../../stylesheet/normalize.less';

#payment-records-pf {
  // 给定唯一的命名空间
  .my-mixin; // 注意必须添加分号
}
```

## api

- FormGroup 组件

  适用于根据筛选项的不同渲染表格数据的通用列表页,配置式的写法

|        参数         | 说明                                  |  类型  | 是否必传项 | 默认值 |
| :-----------------: | :------------------------------------ | :----: | :--------: | ------ |
|      formType       | 表单控件类型                          | Array  |     是     |        |
| wrappedComponentRef | 获取组件本身,方便调用 form 系列的 api | Object |     否     |        |

其中 formType 数组中的元素对象的属性如下,详情请看以上示例

| 参数           | 说明                                                                                | 类型                                        | 是否必传 | 默认值 |
| -------------- | ----------------------------------------------------------------------------------- | ------------------------------------------- | -------- | ------ |
| id             | getFieldDecorator 绑定的 id 值                                                      | String                                      | 是       |        |
| label          | 表单控件 label 值                                                                   | String                                      | 是       |        |
| controlType    | 控件类型,1 表示 Input,2 表示 Select,或者直接传组件的构造类                          | Number/React Node/Function                  | 是       | 1      |
| selectOptions  | 当 ControlType 指定为 2 即下拉列表时,需传入此项指定下拉框子项                       | `[{ [label/name]: value, [value]: value }]` | 是       | []     |
| fieldDecorator | getFieldDecorator(id, options) 参数                                                 | `{[option]: any}`                           | 否       |        |
| controlProps   | 附加在表单控件自身的 props,如 Select 组件的 onSelect,Input 的 onFucs 等等,详见 antd | `{ [apiName]: function }`                   | 否       |        |

其中 selectOptions 数组中元素对象的属性如下

| 参数  | 说明                   | 类型          | 是否必传 | 默认值 |
| ----- | ---------------------- | ------------- | -------- | ------ |
| label | 下拉框子项的 label 值  | String        | 是       |        |
| Value | 子项的 value 值或者 id | String/Number | 是       |        |

###使用

通过 ref 可获取到 antd Form 组件的方法如 getFieldsValue 等
