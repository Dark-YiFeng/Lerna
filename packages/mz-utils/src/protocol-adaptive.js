const rProtocol = /^http(s)?:/i;
const protocol = location.protocol;

/**
 * url自适应
 * @param url 传入url，替换协议为自适应，遇到非http(s)协议，自动拼接[rollbackProtocol]
 * @param rollbackProtocol 传入rollback protocol非http(s)默认使用https，如需更改，传入期望值
 * @returns {string}
 */
function protocolAdaptive(url = '', rollbackProtocol = 'https:') {
  const targetProtocol = rProtocol.test(protocol) ? '' : rollbackProtocol;
  if (rProtocol.test(url)) {
    return url.replace(rProtocol, targetProtocol);
  }
  return `${targetProtocol}${url}`;
}

export default protocolAdaptive;
