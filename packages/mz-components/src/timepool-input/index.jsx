import React from 'react';
import { Input, TimePicker } from 'antd';
import moment from 'moment';

import './index.less';

class TimePoolInput extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value || {};
    const disabled = props.disabled || false;
    this.state = {
      disabled,
      morningTime: value.morningTime || {
        beginTime: undefined,
        endTime: undefined,
      },
      afternoonTime: value.afternoonTime || {
        beginTime: undefined,
        endTime: undefined,
      },
    };
  }
  componentDidMount() {
    const value = this.state.value || {};
    let morningTime = value.morningTime || {
      beginTime: undefined,
      endTime: undefined,
    };
    let afternoonTime = value.afternoonTime || {
      beginTime: undefined,
      endTime: undefined,
    };
    this.setState({ morningTime, afternoonTime });
  }
  componentWillReceiveProps(nextProps) {
    const value = nextProps.value || {};
    const disabled = nextProps.disabled || false;
    let morningTime = value.morningTime || {
      beginTime: undefined,
      endTime: undefined,
    };
    let afternoonTime = value.afternoonTime || {
      beginTime: undefined,
      endTime: undefined,
    };
    this.setState({ morningTime, afternoonTime, disabled });
  }
  range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  disabledHours(type) {
    switch (type) {
      case 'morning':
        return this.range(13, 24);
      case 'afternoon':
        return this.range(0, 12);
    }
  }
  disabledMinutes(selectedHour) {
    if (selectedHour === 12) {
      return;
      // eslint-disable-next-line no-unreachable
      this.range(1, 60);
    }
  }
  handleMorningTimeChange = (type, e) => {
    let { morningTime, afternoonTime } = this.state;
    morningTime[type] = e;
    this.setState({ morningTime, afternoonTime });
    this.triggerChange({ morningTime, afternoonTime });
  };
  handleAfternoonTimeChange = (type, e) => {
    let { morningTime, afternoonTime } = this.state;
    afternoonTime[type] = e;
    this.setState({
      morningTime,
      afternoonTime,
    });
    this.triggerChange({ morningTime, afternoonTime });
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
      <span className="timepool-wrap">
        <Input.Group compact className="input-group">
          <TimePicker
            disabled={state.disabled}
            defaultOpenValue={moment('00:00', 'HH:mm')}
            value={state.morningTime.beginTime}
            onChange={this.handleMorningTimeChange.bind(this, 'beginTime')}
            format="HH:mm"
            disabledHours={() => this.disabledHours('morning')}
            suffixIcon=""
            className="time"
          />
          <Input className="dash" placeholder="-" disabled />
          <TimePicker
            disabled={state.disabled}
            defaultOpenValue={moment('12:00', 'HH:mm')}
            value={state.morningTime.endTime}
            onChange={this.handleMorningTimeChange.bind(this, 'endTime')}
            format="HH:mm"
            disabledHours={() => this.disabledHours('morning')}
            disabledMinutes={(selectedHour) =>
              this.disabledMinutes(selectedHour)
            }
            suffixIcon=""
            className="noborder time"
          />
          <Input className="text" placeholder="/上午" disabled />
        </Input.Group>
        <span className="wave">~</span>
        <Input.Group compact className="input-group">
          <TimePicker
            disabled={state.disabled}
            defaultOpenValue={moment('12:00', 'HH:mm')}
            value={state.afternoonTime.beginTime}
            onChange={this.handleAfternoonTimeChange.bind(this, 'beginTime')}
            format="HH:mm"
            disabledHours={() => this.disabledHours('afternoon')}
            suffixIcon=""
            className="time"
          />
          <Input className="dash" placeholder="-" disabled />
          <TimePicker
            disabled={state.disabled}
            defaultOpenValue={moment('23:59', 'HH:mm')}
            value={state.afternoonTime.endTime}
            onChange={this.handleAfternoonTimeChange.bind(this, 'endTime')}
            format="HH:mm"
            disabledHours={() => this.disabledHours('afternoon')}
            suffixIcon=""
            className="noborder time"
          />
          <Input className="text" placeholder="/下午" disabled />
        </Input.Group>
      </span>
    );
  }
}

export default TimePoolInput;
