import React, {Component} from 'react';
import request from 'superagent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import {Tabs, Tab} from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import AvPlayCircleOutline from 'material-ui/svg-icons/av/play-circle-outline';
import AppBar from '../AppBar.jsx';
import Cache from '../util/cache.jsx';
import guid from '../util/guid.jsx';
import ShowFeeds from './show-feeds.jsx';
import checkLoginStatus from '../util/check-login-status.jsx';

import womanImage from '../../app/images/user/ic_woman.png';
import manImage from '../../app/images/user/ic_man.png';
import defaultBgImage from '../../app/images/user/default_bg.png';

class UserShow extends Component
{
  constructor(props) {
    super(props);
    this.initState(props);
    this.userInfoCacheName = 'user-show-' + props.params.user;
  }

  initState(props) {
    this.state = {
      user: {
        uid: 0,
        username: props.params.user,
        followCount: 0,
        starCount: 0,
        intro: '暂无简介',
        face: '',
        levelImg: '',
        sex: 0,
        location: '',
        medals: [],
        followUsers: [],
        starUsers: [],
        photoCount: 0,
        photos: [],
        videoCount: 0,
        videos: [],
        'is_me': true,
        'followStatus': false,
      },
      Snackbar: {
        open: false,
        message: '',
      },
    };
  }

  componentDidMount() {
    if (Cache.hasItem(this.userInfoCacheName)) {
      this.state.user = Cache.getItem(this.userInfoCacheName);
      this.setState(this.state);
    } else {
      let load = loadTips('加载中...');
      $.ajax({
        url: buildURL('user', 'showData'),
        type: 'POST',
        dataType: 'json',
        data: {username: this.state.user.username},
        timeout: 5000,
      })
      .done(function(data) {
        if (data.status === true) {
          this.state.user = data;
          Cache.setItem(this.userInfoCacheName, data);
        } else {
          this.state.Snackbar.open = true;
          this.state.Snackbar.message = data.message;
        }
      }.bind(this))
      .fail(function() {
        this.state.Snackbar.open = true;
        this.state.Snackbar.message = '网络错误，请检查网络状态!';
      }.bind(this))
      .always(function() {
        load.hide();
        this.setState(this.state);
      }.bind(this));
    }
  }

  componentWillReceiveProps(props) {
    this.props = props;
    if (props.params.user != this.state.user.username) {
      this.initState(props);
      this.userInfoCacheName = 'user-show-' + props.params.user;
      this.componentDidMount();
    }
  }

  render() {
    let type = this.props.params.type;
    if (type != 'home' && type != 'feed' && type != 'photo') {
      type = 'feed';
    }
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.root}>
          <AppBar
            title={<span style={styles.AppBarTitleStyle}>Seven</span>}
            iconElementLeft={
              <IconButton onTouchTap={goBack}>
                <NavigationChevronLeft />
              </IconButton>
            }
            style={styles.AppBarStyle}
          />
          <div
            style={{
              boxSizing: 'border-box',
              width: '100%',
              height: 300,
              textAlign: 'center',
              paddingTop: 70,
              backgroundImage: `url(${this.state.user.backgroundImage || defaultBgImage})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <Avatar src={this.state.user.face} size={100} />
            <div style={styles.username}>
              <span style={styles.usernameTitle}>{this.state.user.username}</span>
              {this.state.user.sex == 2
                ? (<img style={styles.usernameSex} src={womanImage} />)
                : (<img style={styles.usernameSex} src={manImage} />)
              }
              <img style={styles.usernameLevel} src={this.state.user.levelImg} />
            </div>
            <div style={styles.moreInfo}>
              关注&nbsp; {this.state.user.starCount}
              <span style={styles.moreInfoSpan}>|</span>
              粉丝&nbsp; {this.state.user.followCount}
            </div>
            <div style={styles.intro}>{this.state.user.intro}</div>
          </div>
          <Tabs
            initialSelectedIndex={1}
            tabItemContainerStyle={{
              boxShadow: '0 1px 2px 0 #ebebeb',
            }}
            style={styles.TabsStyle}
            inkBarStyle={{
              backgroundColor: '#0096e5',
            }}
            value={type}
          >
            <Tab
              label={'主页'}
              value={'home'}
              onActive={() => {
                this.context.router.replace(`/user/${this.state.user.username}/home`);
              }}
            >
              <div style={styles.itemBox}>
                <div
                  style={styles.itemHeader}
                  onTouchTap={() => {
                    this.context.router.push('/user/info/' + this.state.user.uid);
                  }}
                >
                  <span>基本资料</span>
                  <NavigationChevronRight color={'#979797'} />
                </div>
                <div style={styles.itemBody}>
                  <span style={styles.itemTitle}>简介</span>
                  <div style={styles.itemContent}>{this.state.user.intro}</div>
                </div>
                <div style={styles.itemBody}>
                  <span style={styles.itemTitle}>来自</span>
                  <div style={styles.itemContent}>{this.state.user.location}</div>
                </div>
              </div>
              <div style={styles.itemBox}>
                <div style={styles.itemBody}>
                  <span style={styles.itemTitle}>勋章</span>
                  <div style={styles.medals}>
                    {this.state.user.medals.map((src) => <img style={styles.medalsImg} key={guid()} src={src} />)}
                  </div>
                </div>
              </div>
              <div style={styles.itemBox}>
                <div
                  style={styles.itemHeader}
                  onTouchTap={() => {
                    this.context.router.push(`/user/more/user/following/${this.state.user.uid}/${encodeURI('关注的人')}`);
                  }}
                >
                  <span>关注</span>
                  <span style={styles.itemHeaderConter}>{this.state.user.starCount}</span>
                  <NavigationChevronRight color={'#979797'} />
                </div>
                <div style={styles.users}>
                  {this.state.user.starUsers.map((user) => {
                    return (
                      <div
                        key={guid()}
                        style={styles.usersItem}
                        onTouchTap={() => {
                          this.context.router.push(`/user/${encodeURI(user.username)}`);
                        }}
                      >
                        <Avatar src={user.face} size={42} />
                        <div style={styles.usersItemUsername}>{user.username}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={styles.itemBox}>
                <div
                  style={styles.itemHeader}
                  onTouchTap={() => {
                    this.context.router.push(`/user/more/user/follower/${this.state.user.id}/${encodeURI('粉丝')}`)
                  }}
                >
                  <span>粉丝</span>
                  <span style={styles.itemHeaderConter}>{this.state.user.followCount}</span>
                  <NavigationChevronRight color={'#979797'} />
                </div>
                <div style={styles.users}>
                  {this.state.user.followUsers.map((user) => {
                    return (
                      <div
                        key={guid()}
                        style={styles.usersItem}
                        onTouchTap={() => {
                          this.context.router.push('/user/' + user.username);
                        }}
                      >
                        <Avatar src={user.face} size={42} />
                        <div style={styles.usersItemUsername}>{user.username}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Tab>
            <Tab
              label={'分享'}
              value={'feed'}
              onActive={() => {
                this.context.router.replace(`/user/${this.state.user.username}/feed`);
              }}
            >
              <ShowFeeds uid={this.state.user.uid} />
            </Tab>
            <Tab
              label={'相册'}
              value={'photo'}
              onActive={() => {
                this.context.router.replace(`/user/${this.state.user.username}/photo`);
              }}
            >
              <div style={styles.itemBox}>
                <div
                  style={styles.itemHeader}
                  onTouchTap={() => {
                    this.context.router.push('/user/photo/' + this.state.user.uid)
                  }}
                >
                  <span>照片</span>
                  <span style={styles.itemHeaderConter}>{this.state.user.photoCount}</span>
                  <span>更多</span>
                </div>
              </div>
              <div style={{
                width: '100%',
                height: 'auto',
                display: 'flex',
              }}>
                {this.state.user.photos.map((src) => (
                  <div
                    key={guid()}
                    style={{
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundImage: 'url(' + src + ')',
                      width: '25%',
                      height: 0,
                      paddingBottom: '25%',
                    }}
                  />
                ))}
              </div>
              <div style={styles.itemBox}>
                <div
                  style={styles.itemHeader}
                  onTouchTap={() => {
                    // this.context.router.push('/user/')
                  }}
                >
                  <span>视频</span>
                  <span style={styles.itemHeaderConter}>{this.state.user.videoCount}</span>
                  <span>更多</span>
                </div>
              </div>
              <div style={{
                width: '100%',
                height: 'auto',
                display: 'flex',
                // backgroundColor: '#fff',
              }}>
                {this.state.user.videos.map((video) => (
                  <div
                    key={guid()}
                    style={{
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundImage: 'url(' + video.img + ')',
                      width: '25%',
                      height: 0,
                      paddingBottom: '25%',
                      position: 'relative',
                    }}
                  >
                    <AvPlayCircleOutline
                      style={{
                        position: 'absolute',
                        width: 42,
                        height: 42,
                        top: '50%',
                        left: '50%',
                        marginTop: -21,
                        marginLeft: -21,
                      }}
                      color={'#fff'}
                    />
                  </div>
                ))}
              </div>
            </Tab>
          </Tabs>
          {this.getUserBottomFixledBarDOM()}
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

  getUserBottomFixledBarDOM() {
    if (this.state.user.is_me) {
      return null;
    }
    return (
      <div
        style={{
          display: 'flex',
          position: 'fixed',
          bottom: 0,
          width: '100%',
          height: 48,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
          boxShadow: '0px 0px 1px 1px #ebebeb',
        }}
        className={'filter-bg-fff'}
      >
        <div
          style={{
            flexGrow: 1,
            width: '100%',
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 400
          }}
          onTouchTap={this.handleUserFollow.bind(this)}
        >
          {this.state.user.followStatus == true ? '取消关注' : '＋关注'}
        </div>
        <div
          style={{
            width: '1px',
            minWidth: '1px',
            height: '100%',
            boxSizing: 'border-box',
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <span
            style={{
              width: '100%',
              height: '100%',
              display: 'inline-block',
              backgroundColor: '#b2b2b2',
              border: 'none',
            }}
          />
        </div>
        <div
          style={{
            flexGrow: 1,
            width: '100%',
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 400
          }}
          onTouchTap={this.handleCreateChat.bind(this)}
        >
          聊天
        </div>
      </div>
    );
  }

  handleUserFollow() {
    if (!checkLoginStatus()) {
      this.context.router.push('/sign/up');
    } else {
      let load = loadTips('操作中...');
      request
        .post(buildURL('user', 'star'))
        .field('uid', this.state.user.uid)
        .end((error, ret) => {
          if (!error) {
            this.state.user.followStatus = !this.state.user.followStatus;
            Cache.setItem(this.userInfoCacheName, this.state.user);
          } else {
            this.state.Snackbar.open = true;
            this.state.Snackbar.message = '网络错误，请检查网络状态';
          }
          this.setState(this.state);
          load.hide();
        })
      ;
    }
  }

  handleCreateChat() {
    if (!checkLoginStatus()) {
      this.context.router.push('/sign/up');
    } else {
      let load = loadTips('发起聊天...');
      request
        .post(buildURL('message', 'createRoom'))
        .field('ids', this.state.user.uid)
        .end((error, ret) => {
          load.hide();
          if (error) {
            this.state.Snackbar.open = true;
            this.state.Snackbar.message = '发起聊天失败，请检查网络!';
            this.setState(this.state);
          } else {
            this.context.router.push('/chat/' + ret.body.message);
          }
        })
      ;
    }
  }

}

const styles = {
  root: {
    paddingBottom: 50,
  },
  AppBarStyle: {
    transition: 'all 1500ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    backgroundColor: 'transparent',
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    boxShadow: 'none',
  },
  AppBarTitleStyle: {
    transition: 'all 1500ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    color: 'transparent',
  },
  username: {
    width: '100%',
    height: 40,
    fontSize: 20,
    paddingTop: 10,
  },
  usernameTitle: {
    color: '#fff',
    paddingRight: 5,
  },
  usernameSex: {
    height: 20,
    paddingRight: 5,
  },
  usernameLevel: {
    height: 10,
  },
  moreInfo: {
    width: '100%',
    height: 24,
    fontSize: 14,
    color: '#fff',
  },
  moreInfoSpan: {
    width: 1,
    height: '100%',
    paddingRight: 10,
    paddingLeft: 10,
    color: '#eee',
  },
  intro: {
    boxSizing: 'border-box',
    width: '100%',
    paddingRight: 12,
    paddingLeft: 12,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontSize: 14,
    color: '#fff',
  },
  TabsStyle: {
    backgroundColor: '#f1f1f1',
  },
  itemBox: {
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 16,
  },
  itemHeader: {
    display: 'flex',
    width: '100%',
    height: 32,
    paddingRight: 12,
    paddingLeft: 12,
    boxSizing: 'border-box',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ebebeb',
    color: '#979797',
    fontSize: 14,
  },
  itemHeaderConter: {
    flexGrow: 1,
    paddingLeft: 12,
    color: '#333',
  },
  itemBody: {
    display: 'flex',
    boxSizing: 'border-box',
    paddingTop: 6,
    paddingRight: 12,
    paddingBottom: 6,
    paddingLeft: 12,
    borderBottom: '1px solid #ebebeb',
    minHeight: 42,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemTitle: {
    color: '#979797',
    paddingRight: 12,
    minWidth: 32,
  },
  itemContent: {
    flexGrow: 1,
    // width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  medals: {
    flexGrow: 1,
    width: '100%',
    display: 'flex',
  },
  medalsImg: {
    height: 30,
    minWidth: 30,
    marginRight: 6,
  },
  users: {
    display: 'flex',
    width: '100%',
    boxSizing: 'border-box',
    padding: 10,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  usersItem: {
    width: 100 / 7 + '%',
    textAlign: 'center',
  },
  usersItemUsername: {
    width: '100%',
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }
};

UserShow.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default UserShow;