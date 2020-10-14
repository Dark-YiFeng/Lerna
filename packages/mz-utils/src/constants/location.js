import km from 'keymirror';

export default {
  // 点击菜单
  TYPE_MENU_OPEN: 0,
  // 刷新
  TYPE_REFRESH_OPEN: 1,
  ...km({
    // 最近访问的路由页面 hash
    CURRENT_HASH: null,
  }),
};
