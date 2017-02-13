import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Drawer from 'material-ui/Drawer';
import Dropzone from 'react-dropzone';
import request from 'superagent';

import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ContentSend from 'material-ui/svg-icons/content/send';
import EditorInsertEmoticon from 'material-ui/svg-icons/editor/insert-emoticon';
import TopicIcon from '../svg-icons/topic';
import AtIcon from '../svg-icons/at';

import AppBar from '../AppBar';
import guid from '../util/guid';
import Expression from '../util/expression';
import Cache from '../util/cache';
import checkLoginStatus from '../util/check-login-status.jsx';
import TopicInsert from '../topic/insert';

import add_images from '../../app/images/send/add_images.png';

class FeedSend extends Component
{
  constructor(props) {
    super(props);
    this.maxTextLength = 140;
    this.state = {
      textNum: this.maxTextLength,
      errorText: '',
      files: [],
      filenames: {},
      Snackbar: {
        open: false,
        message: '',
      },
      Dialog: {
        open: false,
        node: null
      },
      insertTopic: {
        open: false,
      },
      showEmoticon: false,
    };
  }

  componentDidMount() {
    if (!checkLoginStatus()) {
      this.context.router.push('/sign/up');
    } else {
      this.handleTextFocus();
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.root}>
          <AppBar
            title={''}
            iconElementLeft={
              <IconButton onTouchTap={goBack}>
                <NavigationChevronLeft />
              </IconButton>
            }
            iconElementRight={
              <IconButton onTouchTap={this.handleSubmit.bind(this)}>
                <ContentSend />
              </IconButton>
            }
          />
          <div style={styles.editor}>
            <TextField
              hintText={'说点什么吧...'}
              multiLine={true}
              rows={4}
              rowsMax={6}
              fullWidth={true}
              underlineShow={false}
              hintStyle={styles.TextFieldHintStyle}
              ref={'text'}
              onChange={this.handleTextChange.bind(this)}
              errorText={this.state.errorText}
              onFocus={() => {
                this.state.showEmoticon = false;
                this.setState(this.state);
              }}
            />
            <span style={styles.TextFieldNum}>{this.state.textNum}</span>
            <div style={styles.imagesSelectBox}>
              {this.state.files.map((file, key) => {
                let style = {};
                style.backgroundPosition = 'center';
                style.backgroundSize = 'cover';
                style.backgroundImage = 'url(' + file.preview + ')';
                Object.assign(style, styles.imagesSelectItem);
                return (
                  <div
                    key={guid()} 
                    style={style}
                    onTouchTap={() => {
                      this.handleImageTapDelete(file.name, key);
                    }}
                  >
                    {this.state.filenames[file.name] == false
                      ? (<RefreshIndicator
                          size={50}
                          left={-25}
                          top={-25}
                          loadingColor={"#FF9800"}
                          status="loading"
                          style={{
                            marginTop: '50%',
                            marginLeft: '50%',
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                          }}
                        />)
                      : null
                    }
                  </div>
                );
              })}
              <Dropzone
                style={styles.imagesSelectItem}
                onDrop={this.handleFileSelectOnDrop.bind(this)}
                accept={'image/*'}
                multiple={false}
              >
                <img style={styles.imagesSelectImgNodeStyle} src={add_images} />
              </Dropzone>
            </div>
          </div>
          <div style={styles.toolBar}>
            <div style={styles.toolBarButtoms}>
              <IconButton
                onTouchTap={() => {
                  if (this.state.showEmoticon == true) {
                    this.state.showEmoticon = false;
                  } else {
                    this.state.showEmoticon = true;
                  }
                  this.setState(this.state);
                }}
              >
                <EditorInsertEmoticon />
              </IconButton>
              <IconButton
                onTouchTap={() => {
                  this.state.insertTopic.open = true;
                  this.state.showEmoticon = false;
                  this.setState(this.state);
                }}
              >
                <TopicIcon />
              </IconButton>
              {/*<IconButton>
                <AtIcon />
              </IconButton>*/}
            </div>
            <Divider />
            <div
              style={this.state.showEmoticon
                ? {
                  width: '100%',
                  height: 180,
                  overflow: 'hidden',
                  overflowY: 'scroll',
                  display: 'flex',
                  flexWrap: 'wrap',
                }
                : {display: 'none'}
              }
            >
              {this.getEmoticonDOM()}
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
          <Dialog {...this.state.Dialog}>{this.state.Dialog.node}</Dialog>
          <Drawer
            docked={true}
            open={this.state.insertTopic.open}
            width={parseInt(document.body.clientWidth)}
            onRequestChange={() => {
              this.state.insertTopic.open = false;
              this.setState(this.state);
            }}
            containerStyle={styles.topicSelectBox}
          >
            <AppBar
              title={'话题列表'}
              iconElementLeft={
                <IconButton
                  onTouchTap={() => {
                    this.state.insertTopic.open = false;
                    this.setState(this.state);
                  }}
                >
                  <NavigationChevronLeft />
                </IconButton>
              }
            />
            <TopicInsert
              handleSlectTopic={(name) => {
                this.handleAppendTextToInput('#' + name + '#');
                this.state.insertTopic.open = false;
                this.setState(this.state);
              }}
            />
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }

  getEmoticonDOM() {
    if (Cache.hasItem('send-emoticon-dom')) {
      return Cache.getItem('send-emoticon-dom');
    }
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
          onTouchTap={() => {
            this.handleAppendTextToInput(key);
          }}
        >
          <img src={emoticon[key]} width={32} height={32} />
        </label>
      );
    }
    Cache.setItem('send-emoticon-dom', arr);
    return arr;
  }

  handleSubmit() {
    if (this.refs.text.getValue().length > this.maxTextLength) {
      this.state.errorText = '内容超出' + this.maxTextLength + '字符!';
      this.setState(this.state);
    } else {
      let load = loadTips('发送中...');
      let aids = this.state.files.map((file) => file.attach_id);

      const { params: { type = '', data = '' } } = this.props;

      request
        .post(buildURL('feed', 'send'))
        .timeout(5000)
        .field('content', this.refs.text.getValue())
        .field('aids', aids)
        .field('type', type)
        .field('data', data)
        .end((error, Response) => {
          load.hide();
          if (error) {
            this.state.Snackbar.open = true;
            this.state.Snackbar.message = '请求超时,请检查网络状态!';
            this.setState(this.state);
          } else if (Response.body.status == false) {
            this.state.Snackbar.open = true;
            this.state.Snackbar.message = Response.body.message;
            this.setState(this.state);
          } else {
            this.refs.text.getInputNode().value = '';
            this.context.router.push('/');
          }
        })
      ;
    }
  }

  handleTextFocus() {
    this.refs.text.focus();
  }

  handleTextChange(event) {
    event && event.preventDefault();
    this.state.textNum = this.maxTextLength - this.refs.text.getInputNode().value.length;
    this.state.errorText = '';
    if (this.state.textNum < 0) {
      this.state.errorText = '内容超出' + this.maxTextLength + '字符！';
    }
    this.setState(this.state);
  }

  handleAppendTextToInput(text) {
    this.refs.text.getInputNode().value += text;
    // this.refs.text.handleInputKeyDown();
    this.handleTextChange();
  }

  handleFileSelectOnDrop(files) {
    let file = files[0];
    this.state.showEmoticon = false;

    if (!this.state.filenames.hasOwnProperty(file.name)) {
      this.state.filenames[file.name] = false;
      let data = {
        name: file.name,
        preview: file.preview,
        attach_id: 0,
      };
      let key = this.state.files.push(data);
      key -= 1;
      this.setState(this.state);

      request
        .post(buildURL('file', 'upload'))
        .attach(file.name, file)
        .end((error, Response) => {
          if (error || Response.status !== 200) {
            this.state.Snackbar.open = true;
            this.state.Snackbar.message = '上传失败！';
            delete this.state.filenames[file.name];
            delete this.state.files[key];

          } else if (Response.body.status != 1) {
            this.state.Snackbar.open = true;
            this.state.Snackbar.message = Response.body.message;
            delete this.state.filenames[file.name];
            delete this.state.files[key];

          } else if (Response.body.attach_id > 0) {
            data.attach_id = Response.body.attach_id;
            this.state.filenames[file.name] = true;

          } else {
            delete this.state.filenames[file.name];
            delete this.state.files[key];
          }
          this.setState(this.state);
        })
      ;
    } else {
      this.state.Snackbar.open = true;
      this.state.Snackbar.message = '请勿重复选择照片！';
      this.setState(this.state);
    }
  }

  handleImageTapDelete(name, index) {
    if (this.state.filenames[name] == true) {
      this.state.Dialog = {
        open: true,
        node: '是否删除图片？',
        modal: false,
        onRequestClose: () => {
          this.state.Dialog.open = false;
          this.setState(this.state);
        },
        actions: [
          <FlatButton
            label="删除"
            primary={true}
            onTouchTap={() => {
              delete this.state.filenames[name];
              delete this.state.files[index];
              this.state.Dialog.open = false;
              this.setState(this.state);
            }}
          />,
          <FlatButton
            label="取消"
            primary={true}
            onTouchTap={() => {
              this.state.Dialog.open = false;
              this.setState(this.state);
            }}
          />
        ],
      };
      this.setState(this.state);
    }
  }
}

const styles = {
  root: {
    width: '100%',
    paddingTop: 50,
  },
  editor: {
    width: '100%',
    boxSizing: 'border-box',
    paddingRight: 12,
    paddingLeft: 12,
    position: 'relative',
  },
  TextFieldHintStyle: {
    top: 12,
  },
  TextFieldNum: {
    display: 'block',
    width: '100%',
    paddingTop: 12,
    textAlign: 'right',
  },
  imagesSelectBox: {
    boxSizing: 'border-box',
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap',
  },
  imagesSelectItem: {
    width: '25%',
    height: 0,
    overflow: 'hidden',
    paddingBottom: '25%',
    position: 'relative',
  },
  imagesSelectImgNodeStyle: {
    width: '100%',
  },
  toolBar: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    boxShadow: '0px 0px 1px 1px #ebebeb',
    boxSizing: 'border-box',
    paddingRight: 12,
    paddingLeft: 12,
  },
  toolBarButtoms: {
    width: '100%',
    maxHeight: 50,
  },
  topicSelectBox: {
    paddingTop: 50,
  }
}

FeedSend.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default FeedSend;