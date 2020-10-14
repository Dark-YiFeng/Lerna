import _ from 'underscore';
import React from 'react';
import { Checkbox, InputNumber, Row, Col } from 'antd';

import './index.less';

class CheckBoxandInput extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value || [];
    const options = props.options || [];
    const disabled = props.disabled || false;
    let plainOptions = [];
    _.map(options, (option) => {
      plainOptions.push(`${option.value}`);
    });
    this.state = {
      disabled,
      options,
      value,
      plainOptions,
      checkAll: false,
      indeterminate: false,
      rangeValue: [],
      deliveryFee: [],
      checkAllDeliveryFee: undefined,
    };
  }

  componentDidMount() {
    let res = this.handleValue(this.state.value, this.state.options);
    this.setState({ ...res }, () => {
      this.formatFormValue();
    });
  }

  componentWillReceiveProps(nextProps) {
    let { value, options, disabled } = nextProps;
    let preValue = this.props.value;
    let preOptions = this.props.options;
    let preDisabled = this.props.options;
    if (
      _.isEqual(preOptions, options) &&
      _.isEqual(preValue, value) &&
      _.isEqual(preDisabled, disabled)
    )
      return;
    let res = this.handleValue(value, options);
    let plainOptions = [];
    _.map(options, (option) => {
      plainOptions.push(`${option.value}`);
    });
    this.setState({
      ...res,
      disabled,
      value,
      plainOptions,
      options: options || [],
    });
  }

  handleValue(data, options) {
    let rangeValueArr = [];
    let deliveryFeeArr = [];
    let checkAll = false;
    // eslint-disable-next-line no-unused-vars,guard-for-in
    for (let n in options) {
      deliveryFeeArr.push(0);
    }
    if (data && data.length) {
      checkAll = options.length === data.length;
      _.map(data, (item) => {
        let { rangeValue, deliveryFee } = item;
        rangeValueArr.push(`${rangeValue}`);
        for (let index = 0; index < options.length; index++) {
          let option = options[index];
          let { value } = option;
          if (rangeValue !== value) continue;
          deliveryFeeArr[index] = deliveryFee || 0;
        }
      });
    } else {
      checkAll = true;
      _.map(options, (option) => {
        rangeValueArr.push(`${option.value}`);
      });
    }
    return {
      checkAll,
      rangeValue: rangeValueArr,
      deliveryFee: deliveryFeeArr,
    };
  }

  getCheckAllDeliveryFee(deliveryFee) {
    let tmp = _.uniq(deliveryFee);
    return tmp.length === 1 ? deliveryFee[0] : undefined;
  }

  onChangeCheckBox = (rangeValue) => {
    const { options } = this.state;
    this.setState(
      {
        rangeValue,
        indeterminate:
          !!rangeValue.length && rangeValue.length < options.length,
        checkAll: rangeValue.length === options.length,
        checkAllDeliveryFee: undefined,
      },
      () => {
        this.formatFormValue();
      },
    );
  };

  onChangeCheckAll = (e) => {
    const { plainOptions } = this.state;
    this.setState(
      {
        rangeValue: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked,
      },
      () => {
        this.formatFormValue();
      },
    );
  };

  onChangeItemInput = (index, e) => {
    let { deliveryFee } = this.state;
    deliveryFee[index] = e;
    this.setState(
      {
        deliveryFee,
        checkAllDeliveryFee: this.getCheckAllDeliveryFee(deliveryFee),
      },
      () => {
        if (_.isNumber(e)) {
          this.formatFormValue();
        }
      },
    );
  };

  onChangeCheckAllInput = (e) => {
    const { options } = this.state;
    let deliveryFee = [];
    // eslint-disable-next-line no-unused-vars,guard-for-in
    for (let n in options) {
      deliveryFee.push(e);
    }
    this.setState({ checkAllDeliveryFee: e, deliveryFee }, () => {
      if (_.isNumber(e)) {
        this.formatFormValue();
      }
    });
  };

  formatFormValue() {
    const { options, plainOptions } = this.state;
    let { checkAll, checkAllDeliveryFee, rangeValue, deliveryFee } = this.state;
    let changedValue = [];
    if (checkAll && !!checkAllDeliveryFee) {
      _.map(options, (option) => {
        let { value } = option;
        let tmp = {
          rangeType: 1, // 按行政区选择区域
          rangeValue: `${value}`,
          isFreeDelivery: deliveryFee[0] ? 0 : 1,
          deliveryFee: deliveryFee[0],
        };
        changedValue.push(tmp);
      });
    } else {
      if (rangeValue && rangeValue.length) {
        _.map(rangeValue, (range) => {
          let index = plainOptions.indexOf(range);
          let fee = deliveryFee[index];
          let tmp = {
            rangeType: 1, // 按行政区选择区域
            rangeValue: `${range}`,
            isFreeDelivery: fee ? 0 : 1,
            deliveryFee: fee,
          };
          changedValue.push(tmp);
        });
      }
    }
    this.triggerChange(changedValue);
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  };

  render() {
    const {
      disabled,
      indeterminate,
      checkAll,
      checkAllDeliveryFee,
      rangeValue,
      options,
      deliveryFee,
    } = this.state;
    return (
      <span className="checkBox-input-wrap">
        <Checkbox
          indeterminate={indeterminate}
          onChange={this.onChangeCheckAll}
          checked={checkAll}
          className="d-checkbox-wrap"
          style={{ marginBottom: 10 }}
          disabled={disabled}
        >
          <span className="checkbox-label">全选</span>
          <InputNumber
            disabled={disabled}
            size="small"
            min={0}
            precision={2}
            className="checkbox-input"
            value={checkAllDeliveryFee}
            onChange={this.onChangeCheckAllInput}
          />
        </Checkbox>
        <Checkbox.Group
          style={{ width: '100%' }}
          value={rangeValue}
          onChange={this.onChangeCheckBox}
          disabled={disabled}
        >
          <Row>
            {_.map(options, (item, index) => {
              let isChecked = rangeValue.includes(`${item.value}`);
              let value = deliveryFee[index];
              return (
                <Col span={8} key={`${index}-option`}>
                  <Checkbox value={`${item.value}`} className="d-checkbox-wrap">
                    <span className="checkbox-label">{item.label}</span>
                    <InputNumber
                      size="small"
                      min={0}
                      precision={2}
                      className="checkbox-input"
                      disabled={disabled || !isChecked}
                      value={value}
                      onChange={this.onChangeItemInput.bind(this, index)}
                    />
                  </Checkbox>
                </Col>
              );
            })}
          </Row>
        </Checkbox.Group>
      </span>
    );
  }
}
export default CheckBoxandInput;
