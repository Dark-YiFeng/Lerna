/** 键名获取cookie
 *
 * @param {*} key
 */
export const getCookieByKey = function (key) {
  if (document.cookie.length > 0) {
    let arr = document.cookie.split('; ');
    for (let i = 0; i < arr.length; i++) {
      let arr2 = arr[i].split('=');
      if (arr2[0] === key) {
        let value = arr2[1];
        return value;
      }
    }
  }
};
