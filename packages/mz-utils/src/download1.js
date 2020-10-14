import axios from 'axios';

const download = function (url, data, cb) {
  axios.post(url, data, { responseType: 'blob' }).then((response) => {
    let type = response.headers['content-type'];
    if (type && type.indexOf('application/json') >= 0) {
      let reader = new FileReader();
      reader.readAsText(response.data, 'utf-8');
      reader.onload = function () {
        data = JSON.parse(reader.result);
        cb(data);
      };
      return false;
    }
    const blob = new Blob([response.data]); // 处理文档流
    const elink = document.createElement('a');
    elink.download = response.headers['content-disposition']
      ? decodeURIComponent(
          response.headers['content-disposition'].split('filename=')[1],
        )
      : 'text';
    elink.style.display = 'none';
    elink.href = window.URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    window.URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
  });
};

export default download;
