// get nearest scroll element
// http://w3help.org/zh-cn/causes/SD9013
// http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome

const overflowScrollReg = /scroll|auto/i;

function getScrollEventTarget(element, rootParent) {
  // eslint-disable-next-line no-void
  if (rootParent === void 0) {
    rootParent = window;
  }
  let node = element;
  while (
    node &&
    node.tagName !== 'HTML' &&
    node.nodeType === 1 &&
    node !== rootParent
  ) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowScrollReg.test(overflowY)) {
      if (node.tagName !== 'BODY') {
        return node;
      }
      // see: https://github.com/youzan/vant/issues/3823
      const htmlOverflowY = window.getComputedStyle(node.parentNode).overflowY;
      if (overflowScrollReg.test(htmlOverflowY)) {
        return node;
      }
    }
    node = node.parentNode;
  }
  return rootParent;
}
function getScrollTop(element) {
  return 'scrollTop' in element ? element.scrollTop : element.pageYOffset;
}
function setScrollTop(element, value) {
  'scrollTop' in element
    ? (element.scrollTop = value)
    : element.scrollTo(element.scrollX, value);
}
function getRootScrollTop() {
  return (
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}
function setRootScrollTop(value) {
  setScrollTop(window, value);
  setScrollTop(document.body, value);
}
// get distance from element top to page top
function getElementTop(element) {
  return (
    (element === window ? 0 : element.getBoundingClientRect().top) +
    getRootScrollTop()
  );
}
function getVisibleHeight(element) {
  return element === window
    ? element.innerHeight
    : element.getBoundingClientRect().height;
}

export {
  getScrollEventTarget,
  getScrollTop,
  setScrollTop,
  getRootScrollTop,
  setRootScrollTop,
  getElementTop,
  getVisibleHeight,
};
