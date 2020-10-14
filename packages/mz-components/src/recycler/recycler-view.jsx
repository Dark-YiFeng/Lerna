import React from 'react';
import { Tabs, Row, Col, Button, Input, message } from 'antd';
import _ from 'underscore';
import TableItem from './table-item.jsx';

import './recycler-view.less';

import {
  PLATFORM,
  TAB_ORDER,
  TAB_SERVICE,
  TAB_FEE,
  TAB_COUPON_CONSUME,
  TAB_CARD_CONSUME,
} from './const';

// eslint-disable-next-line no-unused-vars
const TabPane = Tabs.TabPane;

function CreateRecycler(decorator) {
  @decorator
  class RecyclerView extends React.Component {
    static propTypes = {
      /* 入账单号列表，例：["1500434343", "1533081600"] */
      billIdList: React.PropTypes.array,
      /* 结算项列表，例：[1, 2, 3] */
      settlementItems: React.PropTypes.array,
      /* 如果需要传入扩展 tab 和组件，例 {tabName: '其它差异调整',key: 9997,component: Button}，注意：key 不能和已定义类型冲突 */
      dynamicTab: React.PropTypes.object,
    };

    constructor(props) {
      super(props);
      this.state = {
        currentTabKey: '',
        tabList: [],
        orderId: '',
        serviceId: '',
        code: '',
        consumeOrderId: '',
        total: 0,
        currentPage: 1,
        loading: false,
      };
      this.pageSize = 10;
      this.handleChange = this.handleChange.bind(this);
      this.handleSearch = this.handleSearch.bind(this);
      this.onPageChange = this.onPageChange.bind(this);
      this.generateTabList = _.debounce(this.generateTabList, 200);
    }

    componentDidMount() {
      this.generateTabList(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this.generateTabList(nextProps);
    }

    generateTabList(props) {
      const { settlementItems, dynamicTab } = props;
      // tabList 已经生成则不再执行
      if (this.state.tabList && this.state.tabList.length) {
        return false;
      }
      if (!settlementItems || !settlementItems.length) {
        return console.warn('settlementItems is empty');
      }

      let settlementItemsClone = JSON.parse(JSON.stringify(settlementItems));
      settlementItemsClone.sort((a, b) => a - b);
      // 含商品订单结算项->添加退货单和费用调整
      if (settlementItemsClone.includes(TAB_ORDER)) {
        settlementItemsClone.splice(1, 0, TAB_SERVICE, TAB_FEE);
      }
      const tabList = settlementItemsClone.map((key) => {
        return this.generateTabItem(key);
      });

      if (dynamicTab) {
        tabList.push({
          key: dynamicTab.key,
          tabName: dynamicTab.tabName,
        });
      }
      this.setState(
        {
          tabList: tabList,
          currentTabKey: settlementItemsClone[0],
        },
        () => {
          this.getList();
        },
      );
    }

    generateTabItem(tabKey) {
      return {
        key: tabKey,
        tabName: this.tabFilter(tabKey),
      };
    }

    tabFilter(tabKey) {
      switch (tabKey) {
        case TAB_ORDER:
          return '商品订单';
        case TAB_COUPON_CONSUME:
          return '电子券核销';
        case TAB_CARD_CONSUME:
          return '卡核销';
        case TAB_SERVICE:
          return '退货单';
        case TAB_FEE:
          return '费用调整';
        default:
          return '未知类型';
      }
    }

    handleChange(text) {
      return (e) => {
        switch (text) {
          case 'tabKey':
            this.resetTableData(e);
            break;
          case 'orderId':
          case 'serviceId':
          case 'code':
          case 'consumeOrderId':
            this.setState({
              [text]: e.target.value.trim(),
            });
            break;
          default:
            break;
        }
      };
    }

    resetTableData(currentKey) {
      this.pageSize = 10;
      this.setState(
        {
          currentTabKey: Number(currentKey),
          orderId: '',
          serviceId: '',
          code: '',
          consumeOrderId: '',
          sourceList: [],
          currentPage: 1,
        },
        () => {
          if (this.isCurrentDynamicTab(this.props.dynamicTab)) {
            return false;
          }
          this.getList();
        },
      );
    }

    /**
     * 当前选中的是否是传入的动态 tab
     */
    isCurrentDynamicTab(dynamicTab) {
      return (
        dynamicTab &&
        dynamicTab.component &&
        this.state.currentTabKey === dynamicTab.key
      );
    }

    handleSearch() {
      this.setState(
        {
          currentPage: 1,
        },
        () => {
          this.getList();
        },
      );
    }

    getList() {
      const req = {
        pageSize: this.pageSize,
        pageNumber: this.state.currentPage,
        billIdList: this.props.billIdList,
      };
      const {
        currentTabKey,
        orderId,
        serviceId,
        code,
        consumeOrderId,
      } = this.state;
      if (
        currentTabKey === TAB_ORDER ||
        currentTabKey === TAB_FEE ||
        currentTabKey === TAB_COUPON_CONSUME
      ) {
        req.orderId = orderId;
      }
      if (currentTabKey === TAB_SERVICE || currentTabKey === TAB_FEE) {
        req.serviceId = serviceId;
      }
      if (currentTabKey === TAB_COUPON_CONSUME) {
        req.code = code;
      }
      if (currentTabKey === TAB_CARD_CONSUME) {
        req.consumeOrderId = consumeOrderId;
      }
      this.sendRequest(this.$ToolUtil.filterRequestArgs(req));
    }

    sendRequest(options) {
      this.setState({ loading: true });
      const tabKey = this.state.currentTabKey;
      const service = this.renderService();
      return service(options)
        .then((res) => {
          const { currentTabKey, currentPage } = this.state;
          /* 判断当前 tab 和请求接口时的对应 tab 是否一致，不一致不加载数据 */
          if (tabKey !== currentTabKey) {
            return false;
          }

          const list = res && res.list ? res.list : [];
          const total = res && res.total ? res.total : 0;
          const resourceFilter =
            currentTabKey === TAB_ORDER || currentTabKey === TAB_SERVICE
              ? this.resetOrderList
              : null;
          const resourceData = resourceFilter
            ? resourceFilter(list, currentPage, this.pageSize)
            : list;
          this.setState({
            sourceList: resourceData,
            total: total,
            loading: false,
          });
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            sourceList: [],
            total: 0,
            loading: false,
          });
          message.error('获取列表失败');
        });
    }

    renderService() {
      const {
        getOrderList,
        getServiceList,
        getFeeList,
        getCouponConsumeList,
        getCardConsumeList,
      } = this.$Api;
      switch (this.state.currentTabKey) {
        case TAB_ORDER:
          return getOrderList;
        case TAB_SERVICE:
          return getServiceList;
        case TAB_FEE:
          return getFeeList;
        case TAB_COUPON_CONSUME:
          return getCouponConsumeList;
        case TAB_CARD_CONSUME:
          return getCardConsumeList;
        default:
          return null;
      }
    }

    resetOrderList(oldList, pageNum, pageSize) {
      let newList = [];
      _.map(oldList, (v, i) => {
        _.map(v.skuList, (item, index) => {
          let arr = _.omit(v, 'skuList');
          arr.skuList = item;
          arr.id = pageSize * (pageNum - 1) + i + 1;
          if (index === 0) {
            arr.rowSpan = v.skuList.length;
          } else {
            arr.rowSpan = 0;
          }
          newList.push(arr);
        });
      });
      return newList;
    }

    onPageChange(current, pageSize) {
      if (pageSize) this.pageSize = pageSize;
      this.setState({ currentPage: current }, () => {
        this.getList();
      });
    }

    render() {
      const { dynamicTab } = this.props;
      const {
        tabList,
        currentTabKey,
        orderId,
        serviceId,
        code,
        consumeOrderId,
        sourceList,
        loading,
        total,
        currentPage,
      } = this.state;
      const isSupplier = this.$platform === PLATFORM.supplier;
      return (
        <div>
          {tabList && tabList.length ? (
            <div className="table-container">
              <Tabs
                className="recycler-list-tabs"
                type={isSupplier ? 'line' : 'card'}
                tabPosition="top"
                defaultActiveKey={`${tabList[0].key}`}
                onChange={this.handleChange('tabKey')}
              >
                {_.map(tabList, (tabItem) => {
                  return (
                    <TabPane tab={tabItem.tabName} key={`${tabItem.key}`} />
                  );
                })}
              </Tabs>
              {this.isCurrentDynamicTab(dynamicTab) ? (
                dynamicTab.component
              ) : (
                <TableItem
                  currentTabKey={currentTabKey}
                  dataSourceList={sourceList}
                  ToolUtil={this.$ToolUtil}
                  onPageChange={this.onPageChange}
                  loading={loading}
                  total={total}
                  currentPage={currentPage}
                >
                  <Row className="margin-bottom-15 margin-top-5">
                    {currentTabKey === TAB_ORDER ||
                    currentTabKey === TAB_FEE ? (
                      <Col span={6} className="col-title">
                        订单号：{' '}
                        <Input
                          placeholder="请输入订单号"
                          value={orderId}
                          onChange={this.handleChange('orderId')}
                          style={{ width: 'calc(100% - 90px)' }}
                        />
                      </Col>
                    ) : null}
                    {currentTabKey === TAB_SERVICE ||
                    currentTabKey === TAB_FEE ? (
                      <Col span={6} className="col-title">
                        售后单号：{' '}
                        <Input
                          placeholder="请输入售后单号"
                          value={serviceId}
                          onChange={this.handleChange('serviceId')}
                          style={{ width: 'calc(100% - 90px)' }}
                        />
                      </Col>
                    ) : null}
                    {currentTabKey === TAB_COUPON_CONSUME ? (
                      <Col span={6} className="col-title">
                        兑换码：{' '}
                        <Input
                          placeholder="请输入兑换码"
                          value={code}
                          onChange={this.handleChange('code')}
                          style={{ width: 'calc(100% - 90px)' }}
                        />
                      </Col>
                    ) : null}
                    {currentTabKey === TAB_COUPON_CONSUME ? (
                      <Col span={7} className="col-title">
                        关联订单号：{' '}
                        <Input
                          placeholder="请输入关联订单号"
                          value={orderId}
                          onChange={this.handleChange('orderId')}
                          style={{ width: 'calc(100% - 120px)' }}
                        />
                      </Col>
                    ) : null}
                    {currentTabKey === TAB_CARD_CONSUME ? (
                      <Col span={7} className="col-title">
                        <span>核销记录编号： </span>
                        <Input
                          placeholder="请填写核销记录编号"
                          value={consumeOrderId}
                          onChange={this.handleChange('consumeOrderId')}
                          style={{ width: 'calc(100% - 120px)' }}
                        />
                      </Col>
                    ) : null}
                    {isSupplier ? (
                      <Col span={6}>
                        <Button
                          type="primary"
                          style={{ width: 90 }}
                          onClick={this.handleSearch}
                        >
                          查询
                        </Button>
                      </Col>
                    ) : (
                      <Col span={6}>
                        <Button
                          shape="circle"
                          icon="search"
                          onClick={this.handleSearch}
                        />
                      </Col>
                    )}
                  </Row>
                </TableItem>
              )}
            </div>
          ) : (
            <div>本供应商没有配置结算项，请联系管理员。</div>
          )}
        </div>
      );
    }
  }
  return RecyclerView;
}

export default CreateRecycler;
