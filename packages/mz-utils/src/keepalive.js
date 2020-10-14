export const keepAlive = function (arr) {
  arr.forEach((item) => {
    if (item) {
      window.localStorage.setItem(item.key, item.value);
    }
  });
};

export const getAlive = function (arr) {
  // await arr[0].callback(JSON.parse(window.localStorage.getItem(arr[0].data)))
  // await arr[1].callback(JSON.parse(window.localStorage.getItem(arr[1].data)))
  arr.forEach((item, index) => {
    if (item) {
      if (index === 0) {
        item.instance.setState(
          JSON.parse(window.localStorage.getItem(item.data)),
        );
      } else {
        item.instance.props.form.setFieldsValue(
          JSON.parse(window.localStorage.getItem(item.data)),
        );
      }
    }
  });
};

export const removeAlive = function (arr) {
  arr.forEach((item) => {
    if (item) {
      window.localStorage.removeItem(item);
    }
  });
};
