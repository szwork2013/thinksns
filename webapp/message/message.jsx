import React, {Component} from 'react';
import request from 'superagent';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';

import SocialPeople from 'material-ui/svg-icons/social/people';
import NotificationSms from 'material-ui/svg-icons/notification/sms';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ContentAdd from 'material-ui/svg-icons/content/add';

import AppBar from '../AppBar.jsx';
import ToolBar from '../tool-bar.jsx';
import ChatList from './chat-list.jsx';
import FriendList from './friend-list.jsx';
import checkLoginStatus from '../util/check-login-status.jsx';

class Message extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      sms: true,
      friend: false,
      select: false,
      title: '消息',
      actionCache: 'sms',
      selectUserIds: [],
      Snackbar: {
        open: false,
        message: '',
      }
    };
  }

  componentDidMount() {
    if (!checkLoginStatus()) {
      this.context.router.push('/sign/up');
    }
  }

  render() {
    if (!checkLoginStatus()) {
      return null;
    }
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.root}>
          <AppBar
            title={this.state.title}
            showMenuIconButton={this.state.select}
            iconElementLeft={this.state.select == true
              ? (<IconButton onTouchTap={this.handleCloseSelect.bind(this)}>
                  <NavigationClose />
                </IconButton>)
              : null
            }
          >
            <IconButton onTouchTap={this.handleMessageClick.bind(this)}>
              <NotificationSms color={this.state.sms == true ? '#40c4ff' : '#9e9e9e'} />
            </IconButton>
            <IconButton onTouchTap={this.handleFriendClick.bind(this)}>
              <SocialPeople color={this.state.friend == true ? '#40c4ff' : '#9e9e9e'} />
            </IconButton>
            {this.state.select == true
              ? (<IconButton onTouchTap={this.handleCreateChatByGroup.bind(this)}>
                  <NavigationCheck color={'#9e9e9e'} />
                </IconButton>)
              : (<IconButton
                  onTouchTap={this.handleSelectFriendClick.bind(this)}
                >
                  <ContentAdd color={'#9e9e9e'} />
                </IconButton>) 
            }
          </AppBar>
          <ChatList status={this.state.sms} />
          <FriendList
            status={this.state.friend || this.state.select}
            select={this.state.select}
            pushHandle={this.handlePushCreateUserId.bind(this)}
            unPushHandle={this.handleUnPushHandleUserId.bind(this)}
          />
          <Snackbar
            open={this.state.Snackbar.open}
            message={this.state.Snackbar.message}
            autoHideDuration={1500}
            onRequestClose={() => {
              this.state.Snackbar.open = false;
              this.setState(this.state);
            }}
          />
          <ToolBar value={'message'} />
        </div>
      </MuiThemeProvider>
    );
  }

  handleMessageClick() {
    this.state.sms = true;
    this.state.friend = false;
    this.state.select = false;
    this.state.selectUserIds = [];
    this.state.title = '消息';
    this.state.actionCache = 'sms';
    this.setState(this.state);
  }

  handleFriendClick() {
    this.state.sms = false;
    this.state.friend = true;
    this.state.select = false;
    this.state.selectUserIds = [];
    this.state.title = '联系人';
    this.state.actionCache = 'friend';
    this.setState(this.state);
  }

  handleSelectFriendClick() {
    this.state.sms = false;
    this.state.friend = false;
    this.state.select = true;
    this.state.selectUserIds = [];
    this.state.title = '选择联系人';
    this.setState(this.state);
  }

  handleCloseSelect() {
    if (this.state.actionCache == 'sms') {
      this.handleMessageClick();
    } else {
      this.handleFriendClick();
    }
  }

  handlePushCreateUserId(uid) {
    if (uid) {
      this.state.selectUserIds.push(uid);
    }
    // this.setState(this.state);
  }

  handleUnPushHandleUserId(uid) {
    let index = this.state.selectUserIds.indexOf(uid);
    if (index > -1) {
      this.state.selectUserIds.splice(index, 1);
    }
  }

  handleCreateChatByGroup() {
    if (this.state.selectUserIds.length <= 0) {
      this.state.Snackbar.open = true;
      this.state.Snackbar.message = '请先择需要发起聊天的联系人！';
      this.setState(this.state);
    } else {
      let load = loadTips('发起聊天...');
      request
        .post(buildURL('message', 'createRoom'))
        .field('ids', this.state.selectUserIds.toString())
        .end((error, ret) => {
          if (error) {
            this.state.Snackbar.open = true;
            this.state.Snackbar.message = '发起聊天失败，请检查网络!';
            this.setState(this.state);
          } else {
            this.handleCloseSelect();
            this.context.router.push('/chat/' + ret.body.message);
          }
          load.hide();
        })
      ;
    }
  }

}

const styles = {
  root: {
    paddingTop: 50,
    paddingBottom: 50,
    backgroundColor: '#fff',
  }
}

Message.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Message;
