import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import AppBar from './AppBar.jsx';
import ToolBar from './tool-bar.jsx';
import Cache from './util/cache.jsx';
import checkLoginStatus from './util/check-login-status.jsx';

class User extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      user: {
        uid: 0,
        username: '',
        face: '',
        intro: '',
        feedNum: 0,
        followNum: 0,
        startNum: 0,
      },
      Snackbar: {
        open: false,
        message: '',
      }
    };
  }

  componentDidMount() {
    if (!checkLoginStatus()) {
      this.context.router.push('/sign/up');
    } else if (Cache.hasItem('user-data-info')) {
      this.state.user = Cache.getItem('user-data-info');
      this.setState(this.state);
    } else {
      let load = loadTips('正在加载...');
      $.ajax({
        url: buildURL('user', 'data'),
        type: 'POST',
        dataType: 'json',
        data: {param1: 'value1'},
      })
      .done(function(data) {
        if (typeof data.status != 'undefined') {
          this.state.Snackbar.open = true;
          this.state.Snackbar.message = data.message;
        } else {
          this.state.user = data;
          Cache.setItem('user-data-info', data);
        }
      }.bind(this))
      .fail(function() {
        this.state.Snackbar.open = true;
        this.state.Snackbar.message = '请检查网络';
      }.bind(this))
      .always(function() {
        load.hide();
        this.setState(this.state);
      }.bind(this));
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.root}>
          <AppBar
            title={'我'}
            showMenuIconButton={false}
            zDepth={0}
          />
          <List
            style={{backgroundColor: '#fff'}}
          >
            <ListItem
              style={{
                backgroundColor: '#fff',
              }}
              leftAvatar={<Avatar src={this.state.user.face} size={50} />}
              rightIcon={<NavigationChevronRight />}
              primaryText={this.state.user.username}
              secondaryTextLines={this.state.user.intro && this.state.user.intro.length > 25 ? 2 : 1}
              secondaryText={this.state.user.intro}
              onTouchTap={this.handlePushPath.bind(this, '/user/' + this.state.user.username)}
            />
          </List>
          <Divider />
          <div style={styles.userInfoNumBox}>
            <FlatButton
              style={styles.userInfoNumItem}
              onTouchTap={this.handlePushPath.bind(this, '/user/feed')}
            >
              <div style={styles.numBox}>
                <span style={styles.numItemNumber}>{this.state.user.feedNum}</span>
                <span style={styles.numItemName}>分享</span>
              </div>
            </FlatButton>
            <FlatButton
              style={styles.userInfoNumItem}
              onTouchTap={this.handlePushPath.bind(this, `/user/more/user/following/${this.state.user.uid}/${encodeURI('关注的人')}`)}
            >
              <div style={styles.numBox}>
                <span style={styles.numItemNumber}>{this.state.user.followNum}</span>
                <span style={styles.numItemName}>关注</span>
              </div>
            </FlatButton>
            <FlatButton
              style={styles.userInfoNumItem}
              onTouchTap={this.handlePushPath.bind(this, `/user/more/user/follower/${this.state.user.uid}/${encodeURI('粉丝')}`)}
            >
              <div style={styles.numBox}>
                <span style={styles.numItemNumber}>{this.state.user.startNum}</span>
                <span style={styles.numItemName}>粉丝</span>
              </div>
            </FlatButton>
          </div>
          <List
            style={{
              backgroundColor: '#fff',
              marginTop: 15,
            }}
          >
            <ListItem
              leftIcon={<ActionSettings />}
              rightIcon={<NavigationChevronRight />}
              primaryText={'设置'}
              onTouchTap={this.handlePushPath.bind(this, '/user/seting')}
            />
          </List>
          <Snackbar
            open={this.state.Snackbar.open}
            message={this.state.Snackbar.message}
            autoHideDuration={1500}
            onRequestClose={() => {
              this.state.Snackbar.open = false;
              this.setState(this.state);
            }}
          />
          <ToolBar value={'user'} />
        </div>
      </MuiThemeProvider>
    );
  }

  handlePushPath(path) {
    this.context.router.push(path);
  }
}

const styles = {
  root: {
    boxSizing: 'border-box',
    width: '100%',
    minHeight: 700,
    paddingTop: 65,
    paddingBottom: 50,
    backgroundColor: '#f1f1f1',
  },
  userInfoNumBox: {
    display: 'flex',
    width: '100%',
    height: 50,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  userInfoNumItem: {
    flexGrow: 1,
    height: 50,
  },
  numBox: {
    width: '100%',
    height: 50,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  numItemNumber: {
    lineHeight: 'initial',
    color: '#000',
    fontSize: 18,
    boxShadow: '-1px 0 0 0 #ebebeb inset',
  },
  numItemName: {
    lineHeight: 'initial',
    color: '#979797',
    fontSize: 14,
    boxShadow: '-1px 0 0 0 #ebebeb inset',
  }
};

User.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default User;

