import React from 'react';
import PropTypes from 'prop-types';
import { Form, message, Select, Input, TreeSelect, Row, Col } from 'antd';
import './style/index.less';

// eslint-disable-next-line no-unused-vars
const FormItem = Form.Item;

@Form.create()
class FormGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static propsType = {
    formType: PropTypes.array.isRequired,
    wrappedComponentRef: PropTypes.object,
  };
  createOptions(selectOptions) {
    let Options = null;
    // 区分数组或者对象
    if (!selectOptions) {
      console.error('请传入selectOptions字段,类型为数组或对象');
      return;
    }
    if (Array.isArray(selectOptions)) {
      Options = selectOptions.map((val) => {
        let value =
          val.value !== undefined && val.value !== null ? val.value : val.id;
        let name =
          val.shortName !== undefined && val.shortName !== null
            ? val.shortName
            : val.name;
        return (
          <Select.Option key={value} value={value}>
            {val.label || name}
          </Select.Option>
        );
      });
    }
    return Options;
  }
  renderControl(val, index) {
    const { controlType = 1, selectOptions = [], controlProps = {} } = val;
    let ControlType = controlType;
    let Options = null;
    if (typeof ControlType === 'function') {
      // 处理Selcect等情况
      if (ControlType.name === 'Select') {
        Options = this.createOptions(selectOptions);
        return <Select {...controlProps}>{Options}</Select>;
      }
      return <ControlType {...controlProps} />;
    } else if (typeof controlType === 'object') {
      return ControlType;
    } else {
      if (ControlType === 1) {
        return <Input {...controlProps} />;
      } else if (ControlType === 2) {
        Options = this.createOptions(selectOptions);
        return <Select {...controlProps}>{Options}</Select>;
      } else if (ControlType === 3) {
        return <TreeSelect {...controlProps} />;
      }
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 10 },
    //     lg: { span: 4 }
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 14 },
    //     lg: { span: 20 }
    //   }
    // };
    const { formType } = this.props;
    if (!formType) return message.error('请传入formType');
    let formItems = formType.map((val, index) => {
      let { fieldDecorator = {} } = val;
      return (
        // <Col style={{ paddingLeft: 32, paddingRight: 32 }} xs={24} sm={24} md={12} lg={8} key={index}>
        // <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8} key={index}>
        <Col xs={24} sm={12} md={8} key={index}>
          <FormItem label={val.label}>
            {getFieldDecorator(`${val.id}`, {
              ...fieldDecorator,
            })(this.renderControl(val, index))}
          </FormItem>
        </Col>
      );
    });
    return (
      <div className="filter-form">
        {/* <Form {...formItemLayout}> */}
        <Form>
          <Row
            gutter={[{ xs: 30, sm: 30, md: 30, lg: 30, xl: 60 }]}
            type="flex"
          >
            {formItems}
            {this.props.children && (
              <Col
                style={{ flex: 1, textAlign: 'right' }}
                className="line-height-40"
              >
                {this.props.children}
              </Col>
            )}
          </Row>
          {/* <Row>
          </Row> */}
        </Form>
      </div>
    );
  }
}

export default FormGroup;
