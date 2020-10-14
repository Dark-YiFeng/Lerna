---
title: AuthWrapper
nav:
  title: 组件
  path: /components
group:
  title: 业务
  path: /business
  order: 8
legacy: /business/auth-wrapper
---

## auth-wrapper

### AuthWrapper 权限控制组件

通过`rule`来控制用 `AuthWrapper` 包裹的组件展示与否`isShow`、可用与否`disabled`。
`AuthWrapper`只能包含有一个节点，接受类型为`Map`的`rule`，和当前用户角色`roleId`来实现组件权限控制。

### AuthWrapper 组件

#### API

| 参数   | 必须 | 说明     | 类型                                                | 默认值 |
| ------ | ---- | -------- | --------------------------------------------------- | ------ |
| rule   | 是   | 权限规则 | Map(ROLE_KEY\*, {isShow: boolen, disabled: boolen}) | 无     |
| roleId | 是   | 当前角色 | Number                                              | 无     |

如果当前角色没有被设置`rule` ，默认展示，`disabled`按组件自身设置。

- `isShow` 的优先级最高，如果没有该值则默认为显示。
- `disabled`的优先级高于被包裹的子组件自身的`disabled` 。
  如果子组件的`disabled`和`AuthWrapper`的 `disabled` 同时存在，且`AuthWrapper`的 `disabled` 为 `true`, `AuthWrapper`会覆 盖子组件的`disabled`。
  如果`AuthWrapper`没有设置`disabled` 或其值为`falsy`，子组件的 `disabled` 生效。

#### 例子

```javaScript
    const AUTH_RULE = {
        BTN: new Map([
            [ROLE_FINANCIAL, { isShow: true, disabled: false }],
            [ROLE_CINEMA, { isShow: true, disabled: false }],
            [ROLE_CINEMA_LINE, { isShow: true, disabled: false }],
            [ROLE_SYSTEM_VENDOR, { isShow: true, disabled: false }],
        ]),
        INPUT: new Map([
            [ROLE_FINANCIAL, { isShow: true, disabled: false }],
            [ROLE_CINEMA, { isShow: true, disabled: false }],
            [ROLE_CINEMA_LINE, { isShow: true, disabled: false }],
            [ROLE_SYSTEM_VENDOR, { isShow: true, disabled: false }],
        ]),
    }
    ReactDOM.render(
        <>
            < AuthWrapper roleId={roleId} rule={AUTH_RULE.BTN} >
                <Button>xxx</Button>
            </AuthWrapper >
            <AuthWrapper roleId={roleId} rule={AUTH_RULE.INPUT}>
                <Input size="small" disabled={true} />
            </AuthWrapper>
            <Form>
                <Row gutter={8}>
                    <Col xxl={6} xl={8}><Form.Item label="结算单号" style={{ display: "block" }}>
                        //AuthWrapper需要包裹在getFieldDecorator外部
                        <AuthWrapper roleId={roleId} rule={AUTH_RULE.INPUT}>
                            {getFieldDecorator(`settlementId`)(
                                <Input size="small" />
                            )}
                        </AuthWrapper>
                    </Form.Item></Col>
                </Row>
            </Form>
        </>
        ,
        document.getElementById('root')
    );
```

### AuthCheck 函数

AuthCheck({ rule, roleId }): Rule

#### API

| 参数   | 必须 | 说明     | 类型                                                | 默认值 |
| ------ | ---- | -------- | --------------------------------------------------- | ------ |
| rule   | 是   | 权限规则 | Map(ROLE_KEY\*, {isShow: boolen, disabled: boolen}) | 无     |
| roleId | 是   | 当前角色 | Number                                              | 无     |

传入与 AuthWrapper props 相同的参数，返回当前权限`roleId`对应的展示规则`rule`
