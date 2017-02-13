import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import request from 'superagent';
import Dropzone from 'react-dropzone';
import AppBar from '../AppBar';
import chat from './styles/chat';
import Expression from '../util/expression';
import guid from '../util/guid';
import Cache from '../util/cache';
import ChatItemText from './chat-item-text';
import ChatItemImage from './chat-item-image';
import SendImage from './send-image';

import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ContentSend from 'material-ui/svg-icons/content/send';
import EditorInsertEmoticon from 'material-ui/svg-icons/editor/insert-emoticon';
import ImageControlPoint from 'material-ui/svg-icons/image/control-point';
import NavigationArrowDropDownCircle from 'material-ui/svg-icons/navigation/arrow-drop-down-circle';
import ImageCameraAlt from 'material-ui/svg-icons/image/camera-alt';

class MessageChat extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      showSend: false,
      showMore: false,
      showEmoticon: false,
      Snackbar: {
        open: false,
        message: '',
      }
    };
    this.max = 0;
    this.min = 0;
    this.maxTime = 0;
    this.minTime = 0;
    this.interval;
  }

  componentDidMount() {
    request
      .post(buildURL('message', 'getRoomMessageList'))
      .timeout(5000)
      .field('list_id', this.props.params.roomId)
      .field('order', 'asc')
      .end((error, ret) => {
        if (error) {
          this.state.Snackbar.open = true;
          this.state.Snackbar.message = '网络错误，请求超时.';
          this.setState(this.state);
        } else {
          this.min = ret.body[ret.body.length - 1];
          this.max = ret.body[0];
          ret.body.forEach((message) => {
            let showDate = false;
            if (message.time - this.maxTime >= 300) {
              showDate = true;
              this.maxTime = message.time;
            }
            this.handlePrependChatDataItem(message, showDate);
          });
        }
        this.handleScrollToBottom();
        if (ret.status == 200) {
          this.handleSetInterval();
        } else {
          setTimeout(() => {
            this.componentDidMount();
          }, 3000);
        }
      });
    ;
  }

  handleSetInterval() {
    this.interval = setInterval(this.handleIntervalLoadNewData.bind(this), 3000);
  }

  handleIntervalLoadNewData() {
    request
      .post(buildURL('message', 'getRoomMessageList'))
      .timeout(3000)
      .field('list_id', this.props.params.roomId)
      .field('order', 'asc')
      .field('last_id', this.max ? this.max.message_id : 0)
      .end((error, ret) => {
        if (!error) {
          ret.body.forEach((message) => {
            if (this.max.message_id != message.message_id) {
              this.max = message;
              let showDate = false;
              if (message.time - this.maxTime >= 300) {
                showDate = true;
                this.maxTime = message.time;
              }
              this.handleAppendChatDataItem(message, showDate);
            }
          })
          if (ret.body.length > 0) {
            this.handleScrollToBottom();
          }
        }
      })
    ;
  }

  handleScrollToBottom() {
    document.body.scrollTop = document.body.scrollHeight;
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getRootStyle() {
    if (this.state.showEmoticon == true) {
      return chat.root230;
    } else if (this.state.showMore == true) {
      return chat.rootShowMore
    }
    return chat.root;
  }

  render() {
    // this.handleScrollToBottom();
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={this.getRootStyle()}>
          <AppBar 
            title={'聊天'}
            iconElementLeft={
              <IconButton onTouchTap={goBack}>
                <NavigationChevronLeft />
              </IconButton>
            }
          />
          <div ref={'dataBox'} />
          <div style={chat.toolBar}>
            <div style={chat.toolBarBotton}>
              <div style={chat.insertText}>
                <input
                  style={chat.insertInput}
                  ref={'input'}
                  onChange={this.handleInputChange.bind(this)}
                  onFocus={this.handleInputFocus.bind(this)}
                />
              </div>
              <IconButton
                iconStyle={{
                  color: '#b2b2b2'
                }}
                onTouchTap={this.handleChangeEmoticonShowOrHide.bind(this)}
              >
                <EditorInsertEmoticon />
              </IconButton>
              {this.getMoreDOM()}
            </div>
            <Divider />
            <div style={this.state.showEmoticon == true ? chat.emoticon : {display: 'none'}}>
              {this.getEmoticonDOM()}
            </div>
            <div style={this.state.showMore == true ? styles.more : {display: 'none'}}>
              <Dropzone
                style={styles.moreItem}
                accept={'image/*'}
                multiple={false}
                onDrop={this.handleSendImage.bind(this)}
              >
                <ImageCameraAlt
                  color={'#de6c00'}
                  style={{
                    width: 38,
                    height: 38,
                  }}
                />
                拍照
              </Dropzone>
            </div>
          </div>
          <Snackbar
            open={this.state.Snackbar.open}
            message={this.state.Snackbar.message}
            autoHideDuration={1500}
            onRequestClose={() => {
              this.state.Snackbar.open = false;
              this.setState(this.state);
            }}
          />
        </div>
      </MuiThemeProvider>
    );
  }

  getMoreDOM() {
    if (this.state.showSend == true) {
      return (
        <IconButton
          iconStyle={{
            color: '#b2b2b2',
          }} 
          onTouchTap={this.handleSendText.bind(this)}
        >
          <ContentSend />
        </IconButton>
      );
    } else if (this.state.showMore == true) {
      return (
        <IconButton
          iconStyle={{
            color: '#b2b2b2',
          }} 
          onTouchTap={this.handleHideMore.bind(this)}
        >
          <NavigationArrowDropDownCircle />
        </IconButton>
      );
    }
    return (
      <IconButton
        iconStyle={{
          color: '#b2b2b2',
        }} 
        onTouchTap={this.handleShowMore.bind(this)}
      >
        <ImageControlPoint />
      </IconButton>
    );
  }

  getEmoticonDOM() {
    let arr = [];
    let emoticon = Expression.getAll();
    for(let key in emoticon) {
      arr.push(
        <label
          key={guid()}
          style={{
            width: 100 / 7 + '%',
            height: 45,
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onTouchTap={this.handleAppendInputText.bind(this, key)}
        >
          <img src={emoticon[key]} width={32} height={32} />
        </label>
      );
    }
    return arr;
  }

  handleSendText() {
    let load = loadTips('发送中...');
    request
      .post(buildURL('message', 'sendText'))
      .field('list_id', this.props.params.roomId)
      .field('content', this.refs.input.value)
      .end((error, ret) => {
        if (error) {
          this.state.Snackbar.open = true;
          this.state.Snackbar.message = '发送失败！';
        } else if (ret.body.status == true) {
          this.refs.input.value = '';
          this.state.showSend = false;
        } else {
          this.state.Snackbar.open = true;
          this.state.Snackbar.message = ret.body.message;
        }
        this.setState(this.state);
        load.hide();
      })
    ;
  }

  handleShowMore() {
    this.state.showMore = true;
    this.state.showEmoticon = false;
    this.setState(this.state);
  }

  handleHideMore() {
    this.state.showMore = false;
    this.setState(this.state);
  }

  handleInputFocus() {
    this.state.showEmoticon = false;
    this.handleHideMore();
  }

  handleInputChange(event) {
    if (event.target.value.length > 0) {
      this.state.showSend = true;
    } else {
      this.state.showSend = false;
    }
    this.setState(this.state);
  }

  handleChangeEmoticonShowOrHide() {
    if (this.state.showEmoticon == true) {
      this.state.showEmoticon = false;
    } else {
      this.state.showEmoticon = true;
    }
    this.state.showMore = false;
    this.setState(this.state);
  }

  handleAppendInputText(text) {
    this.refs.input.value += text;
    if (this.state.showSend != true) {
      this.state.showSend = true;
      this.setState(this.state);
    }
  }

  handleAppendChatDataItem(data, showDate) {
    let dom = document.createElement('div');
    dom.style.width = '100%';
    dom.style.height = 'auto';
    this.refs.dataBox.appendChild(dom);
    this.insertDataToDOM(dom, data, showDate);
  }

  handlePrependChatDataItem(data, showDate) {
    //  原生太麻烦了，直接 jQuery
    let dom = document.createElement('div');
    dom.style.width = '100%';
    dom.style.height = 'auto';
    $(this.refs.dataBox).prepend(dom);
    this.insertDataToDOM(dom, data, showDate);
  }

  insertDataToDOM(dom, data, showDate) {
    let ReactComponent;

    switch (data.type) {
      case 'image':
        ReactComponent = ChatItemImage;
        break;

      case 'text':
      default:
        ReactComponent = ChatItemText;
        break;
    }

    ReactDOM.render(
      <ReactComponent showDate={showDate} data={data} />,
      dom
    );
  }

  handleSendImage(files) {
    let file = files[0];
    let dom = document.createElement('div');
    dom.style.width = '100%';
    dom.style.height = 'auto';
    this.refs.dataBox.appendChild(dom);
    ReactDOM.render(
      <SendImage
        showDate={((new Date).getTime() / 1000 - this.maxTime) >= 300}
        uid={TS.MID}
        face={TS.FACE.avatar_big}
        listId={this.props.params.roomId}
        file={file}
        setMaxHandle={this.handleSetMax.bind(this)}
      />,
      dom
    );
    this.state.showMore = false;
    this.setState(this.state);
    this.handleScrollToBottom();
  }

  handleSetMax(data) {
    this.max = data;
    this.maxTime = data.time;
    this.handleScrollToBottom();
  }

}

const styles = {
  more: {
    boxSizing: 'border-box',
    display: 'flex',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  moreItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#bbb',
  }
};

MessageChat.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default MessageChat;
