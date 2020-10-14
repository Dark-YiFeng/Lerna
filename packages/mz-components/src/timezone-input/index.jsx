import React from 'react';
import { Input } from 'antd';

import './index.less';

class TimeZoneInput extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      earliestTime: value.earliestTime,
      latestTime: value.latestTime,
    };
  }

  componentDidMount() {
    let { earliestTime, latestTime } = this.state.value || {};
    this.setState({ earliestTime, latestTime });
  }

  componentWillReceiveProps(nextProps) {
    let { earliestTime, latestTime } = nextProps.value || {};
    this.setState({ earliestTime, latestTime });
  }

  handleEarliestTimeChange = (e) => {
    const { latestTime } = this.state;
    const earliestTime = parseInt(e.target.value || 0, 10);
    if (isNaN(earliestTime)) {
      return;
    }
    this.setState({ earliestTime, latestTime });
    this.triggerChange({ earliestTime, latestTime });
  };

  handleLatestTimeChange = (e) => {
    const { earliestTime } = this.state;
    const latestTime = parseInt(e.target.value || 0, 10);
    if (isNaN(latestTime)) {
      return;
    }
    this.setState({ earliestTime, latestTime });
    this.triggerChange({ earliestTime, latestTime });
  };

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange({ ...this.state, ...changedValue });
    }
  };

  render() {
    const { state } = this;
    return (
      <span className="timezone-wrap">
        <Input.Group compact>
          <Input
            value={state.earliestTime}
            onChange={this.handleEarliestTimeChange}
            className="time"
            placeholder="可预约时限起"
          />
          <Input className="dash" placeholder="-" disabled />
          <Input
            value={state.latestTime}
            onChange={this.handleLatestTimeChange}
            className="time noborder"
            placeholder="可预约时限止"
          />
          <Input className="text" placeholder="小时" disabled />
        </Input.Group>
      </span>
    );
  }
}
export default TimeZoneInput;
