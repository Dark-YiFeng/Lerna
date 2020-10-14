import React from 'react';
import { DatePicker, Row, Col, Input, Button, Icon } from 'antd';

import { disabledDate } from '@/utils/function';
import './index.less';

// eslint-disable-next-line no-unused-vars
const { RangePicker } = DatePicker;

class App extends React.Component {
  static propTypes = {
    onSearch: React.PropTypes.func,
  };
  static defaultProps = { laebl: '', defaultValue: '', hadTimeFilter: false };
  constructor(props) {
    super(props);
    this.state = { input: this.props.defaultValue, period: null };
    this.onInputChange = this.onInputChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onPeriodChange = this.onPeriodChange.bind(this);
    this.emitEmpty = this.emitEmpty.bind(this);
  }
  onSearch() {
    this.props.onSearch(this.state.input, this.state.period);
  }
  onInputChange(e) {
    this.setState({ input: e.target.value });
  }
  emitEmpty() {
    this.setState({ input: '' });
  }
  onPeriodChange(date) {
    this.setState({
      period: {
        startTime: date[0].hour(0).minutes(0),
        endTime: date[1].hour(23).minutes(59),
      },
    });
  }
  render() {
    const { label, hadTimeFilter } = this.props;
    return (
      <div className="search-tab">
        <Row gutter={6}>
          <Col span={2}>
            <span className="label-text">{label}：</span>
          </Col>
          <Col span={6}>
            <Input
              value={this.state.input}
              onChange={this.onInputChange}
              suffix={
                this.state.input ? (
                  <Icon type="close-circle" onClick={this.emitEmpty} />
                ) : null
              }
            />
          </Col>
          <Col span={1}>
            <Button shape="circle" icon="search" onClick={this.onSearch} />
          </Col>
        </Row>
        {hadTimeFilter ? (
          <Row gutter={6}>
            <Col span={2}>
              <span className="label-text">支付时间：</span>
            </Col>
            <Col span={6}>
              <RangePicker
                disabledDate={disabledDate}
                onChange={this.onPeriodChange}
              />
            </Col>
          </Row>
        ) : null}
      </div>
    );
  }
}
export default App;
