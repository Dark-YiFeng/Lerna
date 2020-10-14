import qs from 'querystring';
import _ from 'underscore';

import { jsLoader } from './loader';

const config = {
  v: '1.4.15',
  key: 'd3a562834fc3c90bc7673834e478bd08',
  plugin:
    'AMap.Geolocation,AMap.Marker,AMap.PlaceSearch,AMap.PolyEditor,AMap.MouseTool',
};
const SDK = 'https://webapi.amap.com/maps?';
const UISDK = 'https://webapi.amap.com/ui/1.0/main.js?v=1.0.11';

export const stringtoArray = (value) => {
  if (typeof value !== 'string') return value;
  let res = value
    .slice(1, -1)
    .replace(/],/g, ']~')
    .replace(/\[/g, '')
    .replace(/\]/g, '')
    .split('~');
  res = res.map((n) => {
    return n
      .replace(/ /g, '')
      .split(',')
      .map((v) => {
        return parseFloat(v);
      });
  });
  return res;
};

export const Arraytostring = (arr) => {
  let tmp = _.map(arr, (item) => {
    return `[${item.toString()}]`;
  });
  return `[${tmp.join(',')}]`;
};

export const getLnglat = (lnglat) => {
  let { longitude, latitude } = lnglat;
  if (!longitude || !latitude) return [0, 0];
  let result = [longitude, latitude];
  return result;
};

export const setupMap = function () {
  if (window.AMap) {
    console.warn('amap exist');
    return;
  }
  console.warn('amap loading...');
  jsLoader(`${SDK}${qs.stringify(config)}`, (err, Script) => {
    if (err) {
      return console.warn('amap sdk load fail');
    }
    jsLoader(`${UISDK}`, (err, script) => {
      if (err) {
        return console.warn('amap ui sdk load fail');
      }
      console.warn('amap load success');
    });
  });
};
// setupMap()

// export const resetMap = () => {
//   /* eslint-disable-next-line */
//   this.map && this.map().destroy;
// };

/**
 *
 * @param {Number} pageSize 单页显示结果条数
 * @param {String} keyword 关键字
 * @param {LngLat} cpoint 中心点经纬度
 * @param {Number} radius 半径,取值范围：0-50000
 * @param {String} type 兴趣点类别， 默认值：餐饮服务、商务住宅、生活服务
 */
export const placeSearchNearby = ({
  pageSize = 5,
  keyword = '',
  cpoint,
  radius = 200,
  type,
}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      AMap.service('AMap.PlaceSearch', () => {
        let placeSearch = new AMap.PlaceSearch({
          type: type || '餐饮服务|商务住宅|生活服务',
          pageSize, // 单页显示结果条数
          pageIndex: 1, // 页码
          autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
          extensions: 'all', // 返回基本+详细信息
        });
        placeSearch.searchNearBy(keyword, cpoint, radius, (status, result) => {
          console.log('nearby', status, result);
          if (status === 'complete' && result.info === 'OK') {
            return resolve(result.poiList.pois);
          }
          return reject([]);
        });
      });
    }, 100);
  });
};

/**
 * @param {Object} query 地址查询条件
 */
export const placeSearch = (query, type) => {
  const PlaceSearchOptions = {
    citylimit: true, // 是否强制限制在设置的城市内搜索，默认值为：false
    type: type || '餐饮服务|商务住宅|生活服务',
    city: '全国', // 兴趣点城市
    pageSize: 5, // 单页显示结果条数
    pageIndex: 1, // 页码
    autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
    extensions: 'all', // 返回基本+详细信息
  };
  console.log({
    ...PlaceSearchOptions,
    ...query,
  });
  return new Promise((resolve, reject) => {
    AMap.service('AMap.PlaceSearch', () => {
      let placeSearch = new AMap.PlaceSearch({
        ...PlaceSearchOptions,
        ...query,
      });
      placeSearch.search(query.keyword, (status, result) => {
        console.log('search', status, result);

        if (status === 'complete' && result.info === 'OK') {
          return resolve(query.keyword && result.poiList.pois);
        }
        return reject([]);
      });
    });
  });
};

export const regeoCode = (lnglat, type) => {
  const GeocoderOptions = {
    citylimit: true, // 是否强制限制在设置的城市内搜索，默认值为：false
    type: type || '餐饮服务|商务住宅|生活服务',
    city: '全国', // 兴趣点城市
    pageSize: 5, // 单页显示结果条数
    pageIndex: 1, // 页码
    autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
    extensions: 'all', // 返回基本+详细信息
  };
  console.log('regeoCode lnglat', lnglat);
  return new Promise((resolve, reject) => {
    AMap.plugin('AMap.Geocoder', () => {
      let geocoder = new AMap.Geocoder({ ...GeocoderOptions });
      geocoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          console.log('@#$%@#$$', result);
          let pois = result.regeocode.pois;
          return resolve(pois);
        }
        return reject([]);
      });
    });
  });
};
