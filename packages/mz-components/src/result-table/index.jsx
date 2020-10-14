import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Table, Col, Pagination } from 'antd';
import op from 'object-path';

import './index.less';

class ResultTable extends React.Component {
  static propTypes = {
    service: React.PropTypes.func,
    resourceFilter: React.PropTypes.func,
    columns: React.PropTypes.array,
  };
  static defaultProps = {
    pageSize: 10,
    isShowIndex: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      resourceData: [], // 具体数据集
      currentPage: 1, // 当前页数
      loading: false,
    };
    this.lastOptions = {}; // 上一次请求数据的参数集
    this.pageSize = this.props.pageSize;
    this.pageNumber = this.props.pageNumber;
  }
  componentWillReceiveProps(n) {
    // 是否重置列表数据标识
    if (n.resetResourceData) {
      this.setState({
        resourceData: [],
        total: 0,
      });
      this.lastOptions = {};
    }
  }
  getSource(options) {
    const self = this;
    const defaultOptions = {
      pageSize: this.pageSize,
      pageNumber: this.state.currentPage,
    };
    const args = { ...this.lastOptions, ...defaultOptions, ...options };
    this.lastOptions = args;
    // 保证查询的页数与页面一致
    this.setState({ currentPage: args.pageNumber, loading: true });
    return this.props
      .service(args)
      .then((data) => {
        const total = op(data).get('total') || 0;
        const list = op(data).get('list') || [];
        const resourceData = self.props.resourceFilter
          ? self.props.resourceFilter(list, args.pageNumber, args.pageSize)
          : list;
        self.setState(
          {
            total,
            resourceData,
            loading: false,
          },
          () => {
            this.props.handleChange({ total: total, list: [...resourceData] });
          },
        );
        return data;
      })
      .catch((err) => {
        self.setState(
          {
            total: 0,
            resourceData: [],
            loading: false,
          },
          () => {
            this.props.handleChange({ total: 0, list: [] });
          },
        );
      });
  }
  renderColumn() {
    const { isShowIndex, columns } = this.props;
    const indexColumn = {
      title: '序号',
      key: 'index',
      render: (name, record, index) => {
        return this.pageSize * (this.pageNumber - 1) + index + 1;
      },
    };
    return isShowIndex ? [indexColumn, ...columns] : columns;
  }
  paginationConfig() {
    const self = this;
    return {
      total: this.state.total || 0,
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.state.currentPage,
      onChange(current) {
        self.setState({ currentPage: current }, () => {
          self.getSource();
        });
      },
      showTotal(total) {
        return `共有${total}条`;
      },
      onShowSizeChange(current, pageSize) {
        self.pageSize = pageSize;
        self.setState({ currentPage: current }, () => {
          self.getSource();
        });
      },
    };
  }
  changePage(page, size) {
    const oldSize = this.pageSize;
    this.pageSize = size;
    this.setState(
      {
        currentPage: oldSize === size ? page : 1,
      },
      () => {
        this.getSource();
      },
    );
  }
  showTotal(total) {
    return `共有${total}条`;
  }
  render() {
    const { title, children, defaultPagination, scrollX } = this.props;
    return (
      <div className="result-table">
        <h3>{title}</h3>
        {children}
        <Col className={`unit-text ${children ? 'hadChildren' : ''}`}>
          单位：元
        </Col>
        <Table
          bordered
          loading={this.state.loading}
          scroll={{ x: scrollX }}
          columns={this.renderColumn()}
          dataSource={this.state.resourceData}
          pagination={defaultPagination ? this.paginationConfig() : false}
        />
        {defaultPagination ? null : (
          <Pagination
            showSizeChanger
            defaultPageSize={this.pageSize}
            current={this.state.currentPage}
            total={this.state.total}
            onChange={this.changePage.bind(this)}
            onShowSizeChange={this.changePage.bind(this)}
            showTotal={this.showTotal.bind(this)}
            style={{ margin: '15px 0', textAlign: 'right' }}
          />
        )}
      </div>
    );
  }
}

export default ResultTable;
