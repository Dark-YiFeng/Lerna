/* eslint-disable react/no-string-refs */
import _ from 'underscore';
import React from 'react';
import { message, Icon, Modal, Input } from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';

import { placeSearch, regeoCode, setupMap, getLnglat } from '@mz/utils/map';

// eslint-disable-next-line no-unused-vars
const { Description } = DescriptionList;

import './index.less';

export const getNearbyAddress = (searchKey) => {
  const query = {
    ...searchKey,
    pageSize: 20,
  };
  let result = placeSearch(query)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      console.error('getNearbyAddress error:', e);
      return false;
    });
  return result;
};

export const getRegeoCode = (lnglat) => {
  let result = regeoCode(lnglat)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      console.error('getRegeoCode error:', e);
      return false;
    });
  return result;
};

class DSelectAddress extends React.Component {
  constructor(props) {
    super(props);
    const address = props.address || ``;
    const area = props.area || {};
    const lnglat = props.lnglat || { longitude: 0, latitude: 0 };
    const disabled = !!props.disabled;
    this.state = {
      address,
      area,
      lnglat,
      disabled,
      modalVisible: false,
      searchKey: undefined,
    };
    this.map = undefined;
    this.marker = undefined;
    this.positionPicker = undefined;
  }

  componentDidMount() {
    setupMap('select adres');
  }

  componentWillReceiveProps(nextProps) {
    const pre_address = this.props.address;
    const pre_area = this.props.area;
    const pre_disabled = this.props.disabled;

    const address = nextProps.address || ``;
    const area = nextProps.area || {};
    const lnglat = nextProps.lnglat || { longitude: 0, latitude: 0 };
    const disabled = !!nextProps.disabled;

    if (pre_disabled !== disabled) {
      this.setState({ disabled });
    }

    if (_.isEmpty(pre_address) || !pre_area) {
      this.setState({ address, area, lnglat }, async () => {
        if (!window.AMap) {
          await setupMap('adres');
        }
        let { longitude, latitude } = lnglat;
        if (longitude !== 0 && latitude !== 0) {
          let req = getLnglat(lnglat);
          let res = await getRegeoCode(req);
          if (res) {
            let name = res ? res[0].name : '';
            this.setState({ name });
          }
        }
      });
    } else if (address !== pre_address || !_.isEqual(area, pre_area)) {
      // 修改区域和地址时，需要用户手动重新选取地址
      this.setState(
        {
          name: undefined,
          lnglat: { longitude: 0, latitude: 0 },
        },
        () => {
          let lnglat = { longitude: 0, latitude: 0 };
          this.props.onChange({ lnglat });
        },
      );
    }
  }

  async searchAddress(keyword) {
    let { area } = this.state;
    let searchKey = {
      keyword,
      city: (area && area.cityName) || `全国`,
    };
    let nearBy = await getNearbyAddress(searchKey);
    let pois;
    if (nearBy && nearBy.length) {
      pois = nearBy;
    } else {
      pois = [];
    }
    this.setState({ pois });
  }

  async handleMap() {
    setTimeout(() => {
      AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
        const MAP_OPTIONS = {
          resizeEnable: true,
          zoom: 16,
        };
        let { lnglat } = this.state;
        if (lnglat.longitude !== 0 && lnglat.latitude !== 0) {
          MAP_OPTIONS.center = getLnglat(lnglat);
        }
        // eslint-disable-next-line react/no-string-refs
        this.map = new AMap.Map(this.refs.container, MAP_OPTIONS);
        this.positionPicker = new PositionPicker({
          mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
          map: this.map, // 依赖地图对象
        });
        this.positionPicker.on('success', (positionResult) => {
          let { regeocode } = positionResult;
          let { pois } = regeocode;
          this.setState({ pois });
        });
        this.positionPicker.on('fail', (positionResult) => {
          message.error(`搜索地址失败，请重试`);
          console.error('failed', positionResult);
          this.setState({ pois: [] });
        });
        if (lnglat.longitude === 0 && lnglat.latitude === 0) {
          let { lng, lat } = this.map.getCenter();
          this.positionPicker.start([lng, lat]);
        } else {
          this.positionPicker.start(getLnglat(lnglat));
        }
        this.map.panBy(0, 1);
      });
    }, 800);
  }

  async initAMap() {
    if (!window.AMap || !window.AMapUI) {
      let timeout;
      timeout = setInterval(() => {
        if (window.AMap) {
          this.initAMap();
          clearTimeout(timeout);
        }
      }, 500);
    }
    return true;
  }

  onClickItem(name, location) {
    let lnglat = { longitude: location.lng, latitude: location.lat };
    this.map.setCenter(getLnglat(lnglat));
    this.map.panBy(0, 1);
    this.setState({ name, lnglat });
  }

  handleOk = () => {
    let { lnglat } = this.state;
    this.props.onChange({ lnglat });
    this.setState({ modalVisible: false });
  };

  render() {
    const { name, modalVisible, pois, disabled, searchKey } = this.state;
    const mapSelectAdsModalProp = {
      width: 1000,
      title: `选择位置`,
      className: `map-select-ads-modal`,
      maskClosable: false,
      visible: modalVisible,
      onOk: () => {
        this.handleOk();
      },
      onCancel: () => {
        this.setState({ modalVisible: false });
      },
    };
    return (
      <div className="dmap-select-address-wrap">
        <span
          className={`pointer ${name ? '' : 'a-my-theme'}`}
          onClick={() => {
            if (!disabled) {
              this.setState({ modalVisible: true }, () => {
                this.handleMap();
              });
            }
          }}
        >
          <Icon type="environment" theme="filled" />
          <span>{name ? `${name} 附近` : '点击选择地图位置'}</span>
        </span>

        {modalVisible ? (
          <Modal {...mapSelectAdsModalProp}>
            <div className="dmap-container-wrap">
              <div className="dmap-container" ref="container" />
              <div className="dmap-toast">
                <DescriptionList title="当前位置" col={1}>
                  <Description term="当前选中">{name || '未选择'}</Description>
                </DescriptionList>
              </div>
              <Input.Search
                placeholder="回车或点击图标搜索"
                value={searchKey}
                className="list-search"
                onChange={(e) => {
                  this.setState({ searchKey: e.target.value });
                }}
                onSearch={(value) => {
                  this.searchAddress(value);
                }}
              />
              <div className="dmap-tools" ref>
                {pois && pois.length ? (
                  _.map(pois, (poi, index) => {
                    return (
                      <div
                        key={`poi-${index}`}
                        onClick={() => {
                          this.onClickItem(poi.name, poi.location);
                        }}
                        className="position-list-item"
                      >
                        {poi.name}
                      </div>
                    );
                  })
                ) : (
                  <div
                    className="position-list-item"
                    style={{ color: 'rgba(0, 0, 0, 0.15)' }}
                  >
                    搜索不到位置
                  </div>
                )}
              </div>
            </div>
          </Modal>
        ) : null}
      </div>
    );
  }
}

export default DSelectAddress;
