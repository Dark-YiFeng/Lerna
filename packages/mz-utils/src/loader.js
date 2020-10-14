/* eslint-disable */
/**
 * JSLoader js异步加载
 * @param  {string} url load加载url
 * @param  {function} callback
 */
function jsLoader(url, callback, id) {
  if (!url || url.length === 0) {
    throw new Error('argument "url" is required !');
  }
  const head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  const script_id = id || url.toString();

  if (document.getElementById(script_id)) {
    callback && typeof callback === 'function' && callback();
    return false;
  }
  script.id = script_id;
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', url);

  if (callback != null) {
    script.onload = script.onreadystatechange = function () {
      if (script.ready) {
        return false;
      }
      if (
        !script.readyState ||
        script.readyState == 'loaded' ||
        script.readyState == 'complete'
      ) {
        script.ready = true;
        if (typeof callback === 'function') {
          callback();
        }
        //IE内存泄露
        script.onload = script.onreadystatechange = null;
        if (head && script.parentNode) {
          head.removeChild(script);
        }
      }
    };
  }
  head.appendChild(script);
}
/**
 * CSSLoader css 异步加载
 * @param  {string} url load加载url
 * @param  {function} callback
 */
function cssLoader(url, callback, id) {
  if (!url || url.length === 0) {
    throw new Error('argument "url" is required !');
  }
  const head = document.getElementsByTagName('head')[0];
  const link = document.createElement('link');
  const link_id = id || url.toString();

  if (document.getElementById(link_id)) {
    callback && typeof callback === 'function' && callback();
    return false;
  }

  link.id = link_id;
  link.setAttribute('type', 'text/css');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', url);

  if (callback != null) {
    link.onload = link.onreadystatechange = function () {
      if (link.ready) {
        return false;
      }
      if (
        !link.readyState ||
        link.readyState == 'loaded' ||
        link.readyState == 'complete'
      ) {
        link.ready = true;
        if (typeof callback === 'function') {
          callback();
        }
        //IE内存泄露
        link.onload = link.onreadystatechange = null;
        if (head && link.parentNode) {
          head.removeChild(link);
        }
      }
    };
  }
  head.appendChild(link);
}

export { jsLoader, cssLoader };
