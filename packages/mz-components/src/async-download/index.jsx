import React from 'react';
import { message, Modal, Spin, Icon } from 'antd';
import moment from 'moment';
import { handleDownload, convertProgressText } from '@mz/utils/index.js';
// import Service from '../../mng/service/common/common.js';
import './index.less';

const Service = {};

const ONE_MIN = 60000;
const CANCEL_PROGRESS = -1;

class AsyncDownload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: props.fileName,
      progressStatus: 0,
      progressTime: 0,
      visible: false,
      isProgressSlow: false,
      hasCancelProgress: false,
    };
    this.getProgress = undefined;
  }
  componentDidMount() {
    this.props.onRef('AsyncDownload', this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState((preState) => {
      if (preState.fileName !== nextProps.fileName) {
        return { fileName: nextProps.fileName };
      }
    });
  }
  componentWillUnmount() {
    clearInterval(this.getProgress);
  }
  startExportProgress(exportToken) {
    const self = this;
    self.getExportProgress(exportToken);
    clearInterval(this.getProgress);
    self.setState({ visible: true, progressTime: 0, isProgressSlow: false });
    this.getProgress = setInterval(() => {
      let time = self.state.progressTime + 3000;
      let isProgressSlow = false;
      if (time > ONE_MIN) {
        isProgressSlow = true;
      }
      self.setState({ progressTime: time, isProgressSlow });
      self.getExportProgress(exportToken);
    }, 3000);
  }
  getExportProgress(exportToken) {
    const self = this;
    Service.getExportProgress(exportToken)
      .then((res) => {
        if (res.progressStatus !== 0 && !self.state.hasCancelProgress) {
          self.cleanProgress(res.progressStatus, exportToken);
        }
        self.setState({ progressStatus: res.progressStatus });
      })
      .catch((e) => {
        console.error('getExportProgress error:', e);
        self.cleanProgress(2, null);
        return message.error(e.msg || '获取下载进度失败');
      });
  }
  cleanProgress(status, exportToken) {
    clearInterval(this.getProgress);
    const self = this;
    const CLOSE_TIME = status !== 2 ? 1000 : 2000;
    this.setState({
      hasCancelProgress: status === CANCEL_PROGRESS,
      progressTime: 0,
      isProgressSlow: false,
    });
    setTimeout(() => {
      self.setState({ visible: false, progressStatus: 0 });
    }, CLOSE_TIME);
    if (status === 1) {
      // download let date =
      moment().format('YYYYMMDDHHmmss');
      // eslint-disable-next-line no-undef
      handleDownload(
        `/api/download/public/export-data`,
        // eslint-disable-next-line no-undef
        `${this.state.fileName}${date}`,
        {
          exportToken,
        },
      );
    }
  }
  render() {
    const { visible } = this.state;
    if (visible) {
      return (
        <div className="sms-modal-view">
          <Modal
            visible={visible}
            width={450}
            maskClosable={false}
            wrapClassName="progress-modal"
            footer={null}
          >
            <div className="progress">
              {this.state.progressStatus === 0 ? (
                <Spin size="large" />
              ) : this.state.progressStatus === 1 ? (
                <Icon
                  type="check-circle"
                  theme="filled"
                  style={{ fontSize: '45px', color: '#52c41a' }}
                />
              ) : (
                    <Icon
                      type="close-circle"
                      theme="filled"
                      style={{ fontSize: '45px', color: '#f5222d' }}
                    />
                  )}
              <div className="progress-text">
                {convertProgressText(this.state.progressStatus)}
                <br />
                {this.state.isProgressSlow ? '数据量较大，请您耐心等待。' : ''}
              </div>
            </div>
          </Modal>
        </div>
      );
    } else {
      return null;
    }
  }
}
export default AsyncDownload;
