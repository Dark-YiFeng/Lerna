/* eslint-disable no-implicit-coercion */

export function goodsOrderStateConversion(value) {
  switch (+value) {
    case 4:
      return '已发货';
    case 6:
      return '发货中';
    case 8:
      return '待发货';
    case 13:
      return '交易完成';
    case 14:
      return '交易关闭';
    default:
      return '';
  }
}
export function convertOrderType(value) {
  switch (value) {
    case 0:
      return '普通订单';
    case 1:
      return '换货订单';
    case 2:
      return '团购订单';
    case 4:
      return '企业大宗订单';
    case 5: // 子单
    case 6: // 父单
      return '同事购订单';
    default:
      return '未定义订单类型';
  }
}
export const resolveOrderType = (value) => {
  switch (+value) {
    case 0:
      return '商品订单';
    case 1:
      return '换货单';
    case 2:
      return '团购订单';
    case 4:
      return '企业大宗订单';
    case 5: // 子单
      return '同事购订单';
    case 6: // 父单
      return '发货号';
    default:
      return '';
  }
};
export const resolveServiceType = (value) => {
  switch (+value) {
    case 0:
      return '整单退费';
    case 1:
      return '退货';
    case 2:
      return '换货';
    case 3:
      return '仅退款';
    case 4:
      return '退费';
    default:
      return '';
  }
};
