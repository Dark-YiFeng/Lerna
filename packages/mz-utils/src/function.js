import _ from 'underscore';
import moment from 'moment';

/**
 * 检测对象是否为空
 * null、undefined、'' 为 true
 * 空对象{}、空数组[], NaN 为 true
 * @param {any} target
 */
export const isEmpty = (target) => {
  if (target === null || target === '') {
    return true;
  }
  const targetString = Object.prototype.toString.call(target).split(' ')[1];
  const type = targetString.substring(0, targetString.length - 1);
  switch (type) {
    case 'Object':
      return Object.keys(target).length === 0;
    case 'Array':
      return target.length === 0;
    case 'Number':
      return isNaN(target);
    default:
      return false;
  }
};

/**
 * 获取 url 参数
 */
export const queryString = (key) => {
  const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
  const { search, hash } = window.location;
  let r = null;
  if (search) {
    r = search.substring(1).match(reg);
  } else if (hash) {
    r = hash.split('?')[1] ? hash.split('?')[1].match(reg) : null;
  }
  if (r) {
    const value = decodeURIComponent(r[2]);
    return value.endsWith('/') ? value.substring(0, value.length - 1) : value;
  }
  return null;
};

export function isNumber(value) {
  let reg = /^[0-9]*$/;
  if (!reg.test(value)) {
    return false;
  } else {
    return true;
  }
}

export function disabledDate(str) {
  return str;
}

export function formatFileName(str) {
  return str.substring(str.lastIndexOf('/') + 15);
}

export function isNumberAndletter(value) {
  let reg = /^[A-Za-z0-9]+$/;
  if (!reg.test(value)) {
    return false;
  } else {
    return true;
  }
}

export function redirect(location = '/') {
  const hashReg = /^#w+/;
  if (hashReg.test(location)) {
    window.location.hash = location;
    return;
  }
  window.location.href = location;
}

export function goback() {
  window.history.back();
}

export function obj2key(obj, keys) {
  let n = keys.length;
  let key = [];
  while (n--) {
    key.push(obj[keys[n]]);
  }
  return key.join('|');
}

export function uniqeByKeys(array, keys) {
  let arr = [];
  let hash = {};
  for (let i = 0, j = array.length; i < j; i++) {
    let k = obj2key(array[i], keys);
    if (!(k in hash)) {
      hash[k] = true;
      arr.push(array[i]);
    }
  }
  return arr;
}

export function handleDownload(url, title = '文件名', data) {
  console.log(url);
  const param = JSON.stringify(data);
  const queryUrl = `${url}/?param=${param}&title=${title}`;
  window.open(queryUrl);
}

export function incrementalArray(length) {
  return Array.from({ length }).map((v, k) => k);
}

export function numberNegative(n) {
  return n === '0' ? '0' : `-${n}`;
}

export function fileName(str) {
  if (str.substring(str.lastIndexOf('/') + 1).length < 15) {
    return str.substring(str.lastIndexOf('/') + 1);
  } else {
    return str.substring(str.lastIndexOf('/') + 15);
  }
}

/**
 * 过滤空参、null、undefined、NaN，不过滤 0
 */
export function filterRequestArgs(args) {
  return _.omit(args, (value) => {
    return !value && value !== 0;
  });
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function formatTimeNew(timeArray, showTime = false) {
  if (!timeArray || timeArray.length === 0) return [undefined, undefined];
  let beginTime;
  let endTime;
  if (showTime) {
    beginTime = timeArray[0].format('YYYY-MM-DD HH:mm:ss');
    endTime = timeArray[1].format('YYYY-MM-DD HH:mm:ss');
  } else {
    beginTime = timeArray[0].format('YYYY-MM-DD') + ' 00:00:00';
    endTime = timeArray[1].format('YYYY-MM-DD') + ' 23:59:59';
  }
  return [moment(beginTime).unix(), moment(endTime).unix()];
}
// 防抖
export function debounce(fn) {
  let timeout = null;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, 500);
  };
}

export function checkMobile(value) {
  return /^1(2|3|4|5|6|7|8|9)\d{9}$/.test(value);
}

export function convertProgressStatus(value) {
  switch (value) {
    case 0:
      return 'active';
    case 1:
      return 'success';
    case 2:
      return 'exception';
    default:
      return '';
  }
}

export function convertProgressText(value) {
  switch (value) {
    case 0:
      return '下载中';
    case 1:
      return '下载成功';
    case 2:
      return '下载异常，请联系管理员';
    default:
      return '';
  }
}

export function getUrlParameter(parameter, location = window.location) {
  let { search } = location;
  const parameterMap = new Map();
  search
    .substr(1)
    .split('&')
    .forEach((v) => {
      let a = v.split('=');
      parameterMap.set(...a);
    });
  return parameterMap.get(`${parameter}`);
}

export function formatPublicFileName(str) {
  return str.substring(str.lastIndexOf('/') + 15);
}
