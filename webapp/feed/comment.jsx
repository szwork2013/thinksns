import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import request from 'superagent';
import AppBar from '../AppBar';
import guid from '../util/guid';
import Expression from '../util/expression';
import checkLoginStatus from '../util/check-login-status';

import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ContentSend from 'material-ui/svg-icons/content/send';
import EditorInsertEmoticon from 'material-ui/svg-icons/editor/insert-emoticon';

class FeedComment extends Component
{
  constructor(props) {
    super(props);
    this.maxTextLength = 140;
    this.state = {
      errorText: '',
      showEmoticon: false,
      textNum: this.maxTextLength,
      Snackbar: {
        open: false,
        message: '',
      }
    }
    this.send = false;
  }

  componentDidMount() {
    if (checkLoginStatus()) {
      this.handleTextFocus();
    } else {
      this.context.router.push('/sign/up');
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.root}>
          <AppBar
            title={'回复分享'}
            iconElementLeft={
              <IconButton onTouchTap={this.context.router.goBack}>
                <NavigationChevronLeft />
              </IconButton>
            }
            iconElementRight={
              <IconButton
                onTouchTap={this.handleSubmit.bind(this)}
              >
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
            </div>
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
              <Divider />
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
        </div>
      </MuiThemeProvider>
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
          onTouchTap={() => {
            this.handleAppendTextToInput(key);
          }}
        >
          <img src={emoticon[key]} width={32} height={32} />
        </label>
      );
    }
    return arr;
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

  handleTextFocus() {
    this.refs.text.focus();
  }

  handleSubmit() {
    let content = this.refs.text.getValue();

    if (!content) {
      this.state.Snackbar.open = true;
      this.state.Snackbar.message = '请输入内容！';
      this.setState(this.state);
      return ;
    }

    if (this.send) {
      this.state.Snackbar.open = true;
      this.state.Snackbar.message = '正在发送评论，请勿重新点击!';
      this.setState(this.state);
    } else if (content.length > this.maxTextLength) {
      this.state.errorText = '内容超出' + this.maxTextLength + '字符！';
      this.setState(this.state);
    } else {
      let load = loadTips('回复中...');
      this.send = true;

      const { params: { feedId, cid = 0 } } = this.props;

      request
        .post(buildURL('comment', 'postFeedComment'))
        .field('feed_id', feedId)
        .field('to_cid', cid)
        .field('content', content)
        .end((error, ret) => {
          this.send = false;
          load.hide();
          if (error) {
            this.state.Snackbar.open = true;
            this.state.Snackbar.message = '请求失败，请检查网络是否良好!';
            this.setState(this.state);
          } else if (ret.status == false) {
            this.state.Snackbar.open = true;
            this.state.Snackbar.message = ret.body.message;
          } else {
            this.refs.text.getInputNode().value = '';
            this.context.router.goBack();
          }
        })
      ;
    }
  }

}

FeedComment.contextTypes = {
    router: React.PropTypes.object.isRequired
};

const styles = {
  root: {
    width: '100%',
    paddingTop: 50,
    paddingBottom: 50,
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
};

export default FeedComment;