import LOCATION from './constants/location';
import { queryString, isEmpty } from './function';

class Location {
  parseType = () => {
    const type = queryString('type');
    return isEmpty(type) ? LOCATION.TYPE_MENU_OPEN : Number(type);
  };

  // 点击菜单进入
  isMenuOpen = () => {
    return this.parseType() === LOCATION.TYPE_MENU_OPEN;
  };

  // 页面刷新加载
  isRefreshOpen = () => {
    return this.parseType() === LOCATION.TYPE_REFRESH_OPEN;
  };

  // 保存页面 hash 路径
  setCurrentHash = (hash) => {
    const defaultHash = window.location.hash;
    hash = hash || defaultHash;

    sessionStorage.setItem(LOCATION.CURRENT_HASH, encodeURIComponent(hash));
  };

  // 获取页面 hash 路径
  getCurrentHash = () => {
    const hash = sessionStorage.getItem(LOCATION.CURRENT_HASH);
    return hash ? decodeURIComponent(hash) : '';
  };
}

export const LocationHelper = new Location();
