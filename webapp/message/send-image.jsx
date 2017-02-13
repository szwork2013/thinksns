import React, {Component} from 'react';
import request from 'superagent';
import ChatItem from './chat-item';

import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import AlertError from 'material-ui/svg-icons/alert/error';

class SendImage extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      file: props.file,
      uploadStatus: 'loading',
      errorText: '',
    }
    let date = new Date;
    this.data = {
      face: this.props.face,
      uid: this.props.uid,
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours() + 1}:${date.getMinutes() + 1}`,
      is_me: true,
      time: date.getTime() / 1000,
      type: 'image',
      message_id: 0,
    };
  }

  componentDidMount() {
    this.handleUploadImage();
  }

  render() {
    return (
      <ChatItem
        data={this.data}
        showDate={this.props.showDate}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <img width={'100%'} src={this.props.file.preview} />
          {this.state.errorText
            ? (
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  bottom: -40,
                  textAlign: 'center',
                  backgroundColor: '#b1b1b1',
                  borderRadius: 5
                }}
              >{this.state.errorText}</div>
            )
            : null
          }
          <div
            style={{
              display: 'flex',
              width: 24,
              height: 24,
              position: 'absolute',
              bottom: 0,
              left: -40,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
              backgroundColor: 'transparent',
            }}
          >
            {this.getUploadStatusDOM()}
          </div>
        </div>
      </ChatItem>
    );
  }

  getUploadStatusDOM() {
    if (this.state.uploadStatus == 'loading') {
      return (
        <NavigationRefresh
          style={{
            animationFillMode: 'both',
            animation: 'rotate 1s 0s linear infinite',
          }}
        />
      );
    } else if (this.state.uploadStatus == 'error') {
      return (
        <AlertError
          color={'#ff5600'}
          onTouchTap={() => {
            this.state.uploadStatus = 'loading';
            this.state.errorText = '';
            this.setState(this.state);
            this.handleUploadImage();
          }}
        />
      );
    }

    return null;
  }

  handleUploadImage() {
    request
      .post(buildURL('message', 'sendImage'))
      .field('list_id', this.props.listId)
      .attach(this.state.file.name, this.state.file)
      .end((error, ret) => {
        if (ret.status == 413) {
          this.state.uploadStatus = 'error';
          this.state.errorText = '文件过大。';
        } else if (error) {
          this.state.uploadStatus = 'error';
          this.state.errorText = '网络错误，发送失败!';
        } else if (ret.body.status == false) {
          this.state.uploadStatus = 'error';
          this.state.errorText = ret.body.message;
        } else {
          this.state.uploadStatus = 'success';
          this.state.errorText = '';
          this.data.message_id = ret.body.message;
          this.props.setMaxHandle(this.data);
        }
        this.setState(this.state);
      })
    ;
  }
}

SendImage.defaultProps = {
  showDate: false,
  uid: 0,
  face: '',
  listId: 0,
  file: null,
  setMaxHandle: () => {},
};

SendImage.propTypes = {
  file: React.PropTypes.object.isRequired,
  uid: React.PropTypes.number.isRequired,
  face: React.PropTypes.string.isRequired,
  showDate: React.PropTypes.bool,
  listId: React.PropTypes.any.isRequired,
  setMaxHandle: React.PropTypes.func.isRequired,
};

export default SendImage;
