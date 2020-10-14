/* eslint-disable react/jsx-no-script-url */
import React from 'react';
import { Icon, Table, Col, Pagination } from 'antd';

import {
  TAB_ORDER,
  TAB_SERVICE,
  TAB_FEE,
  TAB_COUPON_CONSUME,
  TAB_CARD_CONSUME,
} from './const';

import './table-item.less';

function renderContent(value, record, index) {
  const obj = {
    children: value,
    props: {},
  };
  obj.props.rowSpan = record.rowSpan;
  return obj;
}

class TableItem extends React.Component {
  constructor(props) {
    super(props);
    this.pageSize = 10;
    this.changePage = this.changePage.bind(this);
  }

  generateColumn() {
    const columns = this.renderColumns();
    switch (this.props.currentTabKey) {
      case TAB_ORDER:
        return columns.orderListColumn;
      case TAB_SERVICE:
        return columns.serviceListColumn;
      case TAB_FEE:
        return columns.feeListColumn;
      case TAB_COUPON_CONSUME:
        return columns.couponListColumn;
      case TAB_CARD_CONSUME:
        return columns.cardListColumn;
      default:
        return null;
    }
  }

  renderColumns() {
    const {
      convertPrice,
      convertOrderType,
      convertTime,
      convertServiceType,
    } = this.props.ToolUtil;

    const orderListColumn = [
      {
        title: '订单号',
        dataIndex: 'orderId',
        key: 'orderId',
        render(text, record, index) {
          return renderContent(text, record, index);
        },
      },
      {
        title: '商品名称',
        dataIndex: 'skuList.productName',
        key: 'productName',
        className: 'product-name',
      },
      {
        title: '选项',
        dataIndex: 'skuList.skuName',
        key: 'skuName',
        className: 'skuName',
      },
      {
        title: '购买数量',
        dataIndex: 'skuList.skuCount',
        key: 'skuCount',
        className: 'skuCount',
      },
      {
        title: '结算价',
        dataIndex: 'skuList.costPrice',
        key: 'costPrice',
        className: 'costPrice',
        render(text) {
          const price = convertPrice(text);
          return <div style={{ whiteSpace: 'nowrap' }}>{price}</div>;
        },
      },
      {
        title: '订单结算额',
        dataIndex: 'orderAmount',
        key: 'orderAmount',
        render(text, record, index) {
          return renderContent(convertPrice(text), record, index);
        },
      },
      {
        title: '订单类型',
        dataIndex: 'orderType',
        key: 'orderType',
        render: (text, record, index) => {
          return renderContent(convertOrderType(text), record, index);
        },
      },
      {
        title: '订单生效时间',
        dataIndex: 'effectiveTime',
        key: 'effectiveTime',
        render(text, record, index) {
          return renderContent(convertTime(text), record, index);
        },
      },
      {
        title: '交易完成时间',
        dataIndex: 'finishTime',
        key: 'finishTime',
        render(text, record, index) {
          return renderContent(convertTime(text), record, index);
        },
      },
    ];

    const serviceListColumn = [
      {
        title: '售后单号',
        dataIndex: 'serviceId',
        key: 'serviceId',
        render(text, record, index) {
          return renderContent(text, record, index);
        },
      },
      {
        title: '原始订单号',
        dataIndex: 'orderId',
        key: 'orderId',
        render(text, record, index) {
          return renderContent(text, record, index);
        },
      },
      {
        title: '售后类型',
        dataIndex: 'serviceType',
        key: 'serviceType',
        render: (text, record, index) => {
          return renderContent(convertServiceType(text), record, index);
        },
      },
      {
        title: '商品名称',
        dataIndex: 'skuList.productName',
        key: 'productName',
      },
      {
        title: '选项',
        dataIndex: 'skuList.skuName',
        key: 'skuName',
      },
      {
        title: '售后数量',
        dataIndex: 'skuList.skuCount',
        key: 'skuCount',
      },
      {
        title: '结算价',
        dataIndex: 'skuList.costPrice',
        key: 'costPrice',
        render(text, record) {
          return convertPrice(text);
        },
      },
      {
        title: '退货结算额',
        dataIndex: 'refundAmount',
        key: 'refundAmount',
        render(text, record, index) {
          return renderContent(convertPrice(text), record, index);
        },
      },
      {
        title: '申请时间',
        dataIndex: 'applyTime',
        key: 'applyTime',
        render(text, record, index) {
          return renderContent(convertTime(text), record, index);
        },
      },
      {
        title: '售后完成时间',
        dataIndex: 'finishTime',
        key: 'finishTime',
        render(text, record, index) {
          return renderContent(convertTime(text), record, index);
        },
      },
    ];

    const feeListColumn = [
      {
        title: '售后单号',
        dataIndex: 'serviceId',
        key: 'serviceId',
      },
      {
        title: '原始订单号',
        dataIndex: 'orderId',
        key: 'orderId',
      },
      {
        title: '项目名',
        dataIndex: 'feeName',
        key: 'feeName',
      },
      {
        title: '费用调整额',
        dataIndex: 'feeAmount',
        key: 'feeAmount',
        render(value, row, index) {
          return convertPrice(value);
        },
      },
      {
        title: '生成时间',
        dataIndex: 'createdTime',
        key: 'createdTime',
        render(value, row, index) {
          return convertTime(value);
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '附件',
        dataIndex: 'attachment',
        key: 'attachment',
        render: (text, record) => {
          return text ? (
            <div>
              <a
                href="javascript:;"
                className="nowrap-text a-my-theme"
                onClick={() => window.open(text)}
              >
                {this.resolveAttachment(text)}
                <Icon
                  className="margin-left-4"
                  type="download"
                  theme="outlined"
                />
              </a>
            </div>
          ) : (
            '无附件'
          );
        },
      },
    ];

    const couponListColumn = [
      {
        title: '兑换码',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '关联订单号',
        dataIndex: 'orderId',
        key: 'orderId',
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
      },
      {
        title: '规格',
        dataIndex: 'skuName',
        key: 'skuName',
      },
      {
        title: '核销数量',
        dataIndex: 'exchangeNum',
        key: 'exchangeNum',
      },
      {
        title: '结算价',
        dataIndex: 'costPrice',
        key: 'costPrice',
        render(value, row, index) {
          return convertPrice(value);
        },
      },
      {
        title: '核销结算额',
        dataIndex: 'exchangeAmount',
        key: 'exchangeAmount',
        render(value, row, index) {
          return convertPrice(value);
        },
      },
      {
        title: '核销时间',
        dataIndex: 'exchangeTime',
        key: 'exchangeTime',
        render(value, row, index) {
          return convertTime(value);
        },
      },
      {
        title: '核销门店',
        dataIndex: 'storeName',
        key: 'storeName',
      },
    ];

    const cardListColumn = [
      {
        title: '核销记录编号',
        dataIndex: 'consumeOrderId',
        key: 'consumeOrderId',
      },
      {
        title: '核销金额',
        dataIndex: 'consumeAmount',
        key: 'consumeAmount',
        render(value, row, index) {
          return convertPrice(value);
        },
      },
      {
        title: '折扣率',
        dataIndex: 'consumeRate',
        key: 'consumeRate',
      },
      {
        title: '核销结算额',
        dataIndex: 'cardSettlementAmount',
        key: 'cardSettlementAmount',
        render(value, row, index) {
          return convertPrice(value);
        },
      },
      {
        title: '核销时间',
        dataIndex: 'consumeTime',
        key: 'consumeTime',
        render(value, row, index) {
          return convertTime(value);
        },
      },
      {
        title: '核销门店',
        dataIndex: 'storeName',
        key: 'storeName',
      },
    ];

    return {
      orderListColumn,
      serviceListColumn,
      feeListColumn,
      couponListColumn,
      cardListColumn,
    };
  }

  /** 截取文件名显示 */
  resolveAttachment(url) {
    if (url && url.lastIndexOf('/') !== -1) {
      return url.substring(url.lastIndexOf('/') + 1, url.length);
    }
    return url;
  }

  changePage(current, size) {
    const oldSize = this.pageSize;
    this.pageSize = size;
    const currentPage = oldSize === size ? current : 1;
    this.props.onPageChange(currentPage, size);
  }

  showTotal(total) {
    return `共有${total}条`;
  }

  render() {
    const { children, loading, dataSourceList } = this.props;
    return (
      <div className="table-container">
        {children}
        <Col className="unit-text">
          <span>金额单位（元）</span>
        </Col>
        <Table
          bordered
          className="small-table"
          loading={loading}
          columns={this.generateColumn()}
          dataSource={dataSourceList}
          pagination={false}
        />

        <Pagination
          showSizeChanger
          defaultPageSize={this.pageSize}
          current={this.props.currentPage}
          total={this.props.total || 0}
          onChange={this.changePage}
          onShowSizeChange={this.changePage}
          showTotal={this.showTotal.bind(this)}
          style={{ marginTop: 15, textAlign: 'right' }}
        />
      </div>
    );
  }
}

export default TableItem;
