/* eslint-disable react/no-string-refs */
import React from 'react';
import { message, Button, InputNumber } from 'antd';
import _ from 'underscore';

import { setupMap, stringtoArray } from '@mz/utils/map';

import './index.less';

const MAX_COUNT = 5;
// const SAVE_PLOYGEN = false;
const NO_SAVE_PLOYGEN = true;
const POLYGON_STYPE_LIST = [
  {
    lineStyle: {
      fillColor: '#b8cb50',
      borderWeight: 1,
      strokeColor: '#b8cb50',
      fillOpacity: 0.4,
    },
    blockStyle: '#b8cb50',
  },
  {
    lineStyle: {
      fillColor: '#fab646',
      borderWeight: 1,
      strokeColor: '#fab646',
      fillOpacity: 0.4,
    },
    blockStyle: '#fab646',
  },
  {
    lineStyle: {
      fillColor: '#ff9997',
      borderWeight: 1,
      strokeColor: '#ff9997',
      fillOpacity: 0.4,
    },
    blockStyle: '#ff9997',
  },
];


const handlePolygonPath = (amapPath) => {
  let result = _.map(amapPath, (path) => {
    let { lat, lng } = path;
    return [lng, lat];
  });
  return result;
};

// Form Item rules example ！！！
// eslint-disable-next-line no-unused-vars
const checkDPolygon = (rule, value, callback) => {
  value = value || [];
  this.isCheckDPolygon = false;
  if (value.length === 0) {
    callback('请绘制地图区域');
    return;
  }
  this.isCheckDPolygon = true;
  callback();
};

class DPolygon extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value || [];
    const center = props.center || '';
    const disabled = !!props.disabled;
    this.state = {
      value,
      center,
      disabled,
      isEdit: false,
      editingPloygen: undefined,
      polygonState: {},
      polygonArr: [],
      polygonIndex: 0,
    };
    this.map = undefined;
    this.isAdding = false;
  }

  async componentDidMount() {
    let isSetup = await setupMap('polygon');
    console.log('isSetup', isSetup);
    if (isSetup) {
      let isLoadMap = await this.initAMap();
      if (isLoadMap) {
        this.handleValue();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    let { value, center, disabled } = nextProps;
    this.setState({ value, disabled: !!disabled, center });
  }

  async initAMap() {
    if (!window.AMap) {
      let timeout;
      timeout = setInterval(() => {
        if (window.AMap) {
          this.initAMap();
          clearTimeout(timeout);
        }
      }, 500);
      return false;
    }
    let { center } = this.state;
    const mapOption = {
      resizeEnable: true,
      zoom: 16,
    };
    let data = this.state.value;
    let hasPolygon = data && data.length;
    if (center !== '0,0' && !hasPolygon) {
      mapOption.center = center.split(',');
    }
    // eslint-disable-next-line react/no-string-refs
    this.map = new AMap.Map(this.refs.container, mapOption);
    return true;
  }

  handleValue(data = this.state.value) {
    let polygon_path = {};
    let polygonArr = [];
    if (data && data.length) {
      _.map(data, (item, index) => {
        let { rangeValue } = item;
        item.rangeValue = stringtoArray(rangeValue);
        polygon_path[`polygon_${index}`] = stringtoArray(rangeValue);
        polygonArr.push(`polygon_${index}`);
      });
    }
    let polygonArrLen = polygonArr.length;
    let polygonIndex = polygonArrLen ? polygonArrLen - 1 : 0;
    this.setState(
      {
        value: data,
        polygonArr,
        polygonIndex,
        polygonState: polygon_path,
      },
      () => {
        this.drawPolygon();
      },
    );
  }

  drawPolygon() {
    const OverlayGroupCount = this.map.getAllOverlays().length;
    let { polygonState, polygonArr } = this.state;
    if (OverlayGroupCount === polygonArr.length) return;
    let polygons = [];
    _.map(polygonArr, (pName, index) => {
      let path = polygonState[pName];
      let newPolygon = new AMap.Polygon({
        path,
        ...POLYGON_STYPE_LIST[index % POLYGON_STYPE_LIST.length].lineStyle,
      });
      polygons.push(newPolygon);
      let plg = new AMap.OverlayGroup([newPolygon]);
      this.map.add(plg);

      this.setState({ [pName]: newPolygon });
    });
    this.map.setFitView(polygons);
  }

  onEdit(polygonName, polygon) {
    if (this.state.isEdit) this.polyEditor.close();

    this.polyEditor = new AMap.PolyEditor(this.map, polygon);
    this.polyEditor.open();

    let editingPloygen = polygonName;

    this.polyEditor.on('adjust', (event) => {
      this.handleEditPolygon(event.target, editingPloygen);
    });
    this.setState({ isEdit: true, editingPloygen });
  }

  onCloseEdit() {
    this.polyEditor.close();
    this.setState({ isEdit: false, editingPloygen: undefined });
  }

  handleEditPolygon(polygon, editingPloygen) {
    let { value, polygonArr, polygonState } = this.state;
    let path = handlePolygonPath(polygon.getPath());
    let index = polygonArr.indexOf(editingPloygen);
    polygonState[editingPloygen] = path;
    value[index] = Object.assign(value[index], { rangeValue: path });
    this.triggerChange(value);
    this.setState({ value, polygonState });
  }

  addPloygen() {
    const self = this;
    if (this.isAdding) return;
    this.isAdding = true;
    let { value, polygonArr, polygonState, polygonIndex, isEdit } = this.state;
    if (!value) value = [];
    if (isEdit) this.onCloseEdit();

    if (polygonArr.length >= MAX_COUNT)
      return message.warning(`最多添加${MAX_COUNT}个地图围栏`);
    message.info(`开始绘制地图围栏后，双击或右键结束。`);
    polygonIndex++;
    let mouseTool = new AMap.MouseTool(this.map);
    let newPolygonstyle =
      POLYGON_STYPE_LIST[polygonIndex % POLYGON_STYPE_LIST.length].lineStyle;
    mouseTool.polygon({ ...newPolygonstyle });

    mouseTool.on('draw', (event) => {
      message.info(`地图围栏绘制完成`);
      let newPolygon = event.obj;
      mouseTool.close(NO_SAVE_PLOYGEN);

      let path = handlePolygonPath(newPolygon.getPath());
      let tmp = {
        rangeType: 2,
        rangeValue: path,
        isFreeDelivery: 0,
        deliveryFee: 0,
      };
      polygonArr.push(`polygon_${polygonIndex}`);
      value.push(tmp);
      polygonState[`polygon_${polygonIndex}`] = path;

      self.map.add(new AMap.OverlayGroup([event.obj]));
      this.triggerChange(value);
      this.isAdding = false;
      self.setState({
        value,
        polygonArr,
        polygonState,
        polygonIndex,
        [`polygon_${polygonIndex}`]: newPolygon,
      });
    });
  }

  delPloygen() {
    let { editingPloygen, value, polygonArr, polygonState } = this.state;
    let delIndex = polygonArr.indexOf(editingPloygen);

    // delete over lay
    let allOverlays = this.map.getAllOverlays();
    // eslint-disable-next-line no-unused-expressions
    allOverlays[delIndex];
    this.map.remove(allOverlays[delIndex]);

    // delete data
    value.splice(delIndex, 1);
    polygonArr.splice(delIndex, 1);
    delete polygonState[editingPloygen];

    this.onCloseEdit();

    this.setState(
      {
        value,
        polygonArr,
        polygonState,
        [editingPloygen]: undefined,
      },
      () => {
        this.triggerChange(value);
      },
    );
  }

  onChangeInput(index, e) {
    let { value } = this.state;
    value[index].deliveryFee = e;
    value[index].isFreeDelivery = e ? 1 : 0;
    this.setState({ value });
    this.triggerChange(value);
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    // let { value } = this.state;
    if (onChange) {
      onChange(changedValue);
    }
  };

  reloadMap = async () => {
    let isLoadMap = await this.initAMap();
    if (isLoadMap) {
      this.handleValue();
    }
  };

  render() {
    const { value, polygonArr, isEdit, disabled } = this.state;
    let polygonArrLen = (polygonArr && polygonArr.length) || 0;
    return (
      <div className="dmap-wrap">
        <div className="dmap-container-wrap">
          <div className="dmap-container" ref="container" />
          <div className="dmap-tools-top">
            <Button
              key="reload"
              icon="reload"
              onClick={() => {
                this.reloadMap();
              }}
            />
          </div>
          <div className="dmap-tools-bottom">
            {isEdit
              ? [
                <Button
                  key="delete"
                  icon="delete"
                  type="danger"
                  onClick={() => {
                    this.delPloygen();
                  }}
                />,
                <Button
                  key="save"
                  icon="save"
                  type="primary"
                  onClick={() => {
                    this.onCloseEdit();
                  }}
                />,
              ]
              : null}
          </div>
        </div>
        <div className="dmap-input-wrap">
          {_.map(polygonArr, (polygon, index) => {
            let polygonIndex = polygon.split('_')[1];
            let styleIndex = polygonIndex % POLYGON_STYPE_LIST.length;
            return (
              <div
                className="dmap-input"
                key={`dmap-input-${index}`}
                onClick={() => {
                  if (!disabled) {
                    this.onEdit(polygon, this.state[polygon]);
                  }
                }}
              >
                <span
                  className="input-block"
                  style={{
                    background: POLYGON_STYPE_LIST[styleIndex].blockStyle,
                  }}
                />
                <span className="input-text">配送费</span>
                <span className="input">
                  <InputNumber
                    disabled={disabled}
                    min={0}
                    size="small"
                    value={value[index].deliveryFee}
                    onChange={this.onChangeInput.bind(this, index)}
                  />
                </span>
              </div>
            );
          })}
          {!disabled && polygonArrLen < MAX_COUNT ? (
            <Button
              icon="plus"
              size="small"
              shape="circle"
              className="dmap-input"
              onClick={() => {
                this.addPloygen();
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default DPolygon;
