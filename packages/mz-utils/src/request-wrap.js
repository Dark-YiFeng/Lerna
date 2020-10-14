/**
 * 封装promise请求方法
 *
 * @export
 * @param {Object} options
 * @param {function} options.api - 请求接口方法
 * @param {string} [options.defaultMsg = "请求失败"] - 请求失败或出错时的message提示
 * @returns {function}
 */
export default function requestWrap({ api, defaultMsg = '请求失败' }) {
  const message = require('antd/lib/message').default;
  if (!api) {
    console.error('RequestWrapper Error: invaild Api option.', api);
    return () => {
      return null;
    };
  }
  return async (req) => {
    const result = await api(req)
      .then((res) => {
        return res || true;
      })
      .catch((err) => {
        console.error('RequestWrapper Error [Api Error]: ', err, '\n', api);
        message.error(`${err.msg}` || `${err.message}` || defaultMsg);
        return null;
      });
    return result;
  };
}
