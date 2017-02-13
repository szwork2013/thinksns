import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Snackbar from 'material-ui/Snackbar';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import ToggleStar from 'material-ui/svg-icons/toggle/star';
import ToggleStarBorder from 'material-ui/svg-icons/toggle/star-border';
import MapsRateReview from 'material-ui/svg-icons/maps/rate-review';

import {Link} from 'react-router';

import AppBar from '../AppBar.jsx';
import CommentBox from '../comment-box.jsx';
import FormatClientName from '../util/FormatClientName.jsx';
import Expression from '../util/expression.jsx';
import guid from '../util/guid.jsx';
import AtUser from '../util/at-user.jsx';
import checkLoginStatus from '../util/check-login-status';

import FeedContentText from './content/text';
import FeedContentImage from './content/image';
import FeedContentVideo from './content/video';

class Reader extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      feed:{
        feedId: props.params.feedId,
        content: '',
        diggCount: 0,
        type: 'post',
        date: 'now',
        from: 0,
        users: [],
        user:{
          username: '',
          face: ''
        },
        followStatus: false,
        starStatus: false,
        images: [],
        video: null,
      },
      Snackbar: {
        open: false,
        message: '',
      }
    };
  }

  componentDidMount() {
    let load = loadTips('加载中...');
    $.ajax({
      url: buildURL('feed', 'getFeedInfo'),
      type: 'POST',
      dataType: 'json',
      data: {feed_id: this.state.feed.feedId},
    })
    .done(function(data) {
      if (typeof data.status != undefined && data.status == false) {
        this.state.Snackbar.open = true;
        this.state.Snackbar.message = data.message;
      } else {
        this.state.feed = data;
      }
    }.bind(this))
    .fail(function() {
      this.state.Snackbar.open = true;
      this.state.Snackbar.message = '请检查网络～';
    }.bind(this))
    .always(function() {
      load.hide();
      this.setState(this.state);
    }.bind(this));
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.root}>
          <AppBar
            title={'分享详情'}
            iconElementLeft={
              <IconButton onTouchTap={goBack}>
                <NavigationChevronLeft />
              </IconButton>
            }
          />
          <div>
            <ListItem
              disabled={true}
              leftAvatar={<Avatar src={this.state.feed.user.face} />}
              primaryText={this.state.feed.user.username}
              secondaryText={
                <div>
                  来自{FormatClientName(this.state.feed.from)} &nbsp; -- &nbsp; 
                  <strong>{this.state.feed.date}</strong>
                </div>
              }
            />
            <FeedContentText content={this.state.feed.content} feedId={this.state.feed.feedId} />
            <FeedContentImage images={this.state.feed.images} />
            <FeedContentVideo video={this.state.feed.video} />
            { /* 点赞的人列表 */
              this.getDiggsDOM()
            }
          </div>
          <CommentBox feedId={this.state.feed.feedId} />
          <Snackbar
            open={this.state.Snackbar.open}
            message={this.state.Snackbar.message}
            autoHideDuration={1500}
            onRequestClose={() => {
              this.state.Snackbar.open = false;
              this.setState(this.state);
            }}
          />
          <div htmlFor={'tool-bar'} style={styles.toolBar}>
            <div style={styles.toolItem}>
              {this.getFollowDOM() /* 喜欢／取消喜欢 */}
            </div>
            <div style={styles.toolItem}>
              {this.getStarDOM( /* 收藏／取消收藏 */)}
            </div>
            <div style={styles.toolItem}>
              <FlatButton
                label={'评论'}
                icon={<MapsRateReview color={'#b2b2b2'} />}
                onTouchTap={() => {
                  this.context.router.push(`/feed/comment/${this.state.feed.feedId}`);
                }}
              />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

  getContentDOM() {
    let content = this.state.feed.content;

    // 表情
    content = Expression.buildDOM(content, (path) => {
      return (
        <img
          className={'ts-emotion'}
          key={guid()}
          src={path}
        />
      );
    });

    // At用户
    content = AtUser(content, (username) => {
      username = username.substr(1);
      return (<Link key={guid()} to={'/user/' + username}>@{username}</Link>);
    });

    return content;
  }

  getFollowDOM() {
    if (this.state.feed.followStatus) {
      return (
        <FlatButton
          label={'取消喜欢'}
          icon={<ActionFavorite />}
          style={{
            color: 'red',
          }}
          labelStyle={{
            color: '#333',
          }}
          onTouchTap={this.handleUnFollow.bind(this)}
        />
      );
    }
    return (
      <FlatButton
        label={'喜欢'}
        icon={<ActionFavoriteBorder />}
        style={{
          color: '#b1b1b1',
        }}
        labelStyle={{
          color: '#333',
        }}
        onTouchTap={this.handleFollow.bind(this)}
      />
    );
  }

  getDiggsDOM() {
    if (!this.state.feed.diggCount) {
      return null;
    }
    return (
      <div style={styles.diggsBox}>
        <div style={styles.diggsLeftAvatars}>
          {this.state.feed.users.map((user, key) => (<Avatar style={styles.diggAvatar} key={key} src={user.face} size={30} />))}
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          {this.state.feed.diggCount}人喜欢
          <NavigationChevronRight style={{marginTop: -2}} color={'#ccc'} />
        </div>
      </div>
    );
  }

  getStarDOM() {
    if (this.state.feed.starStatus) {
      return (
        <FlatButton
          label={'取消收藏'}
          icon={<ToggleStar />}
          style={{
            color: '#0096e5'
          }}
          labelStyle={{
            color: '#333',
          }}
          onTouchTap={this.handleUnStar.bind(this)}
        />
      );
    }
    return (
      <FlatButton
        label={'收藏'}
        icon={<ToggleStarBorder />}
        style={{
          color: '#b1b1b1'
        }}
        labelStyle={{
          color: '#333',
        }}
        onTouchTap={this.handleStar.bind(this)}
      />
    );
  }

  handleStar() {
    if (checkLoginStatus()) {
      let load = loadTips('收藏中...');
      $.ajax({
        url: buildURL('feed', 'star'),
        type: 'POST',
        dataType: 'json',
        data: {feed_id: this.state.feed.feedId},
        timeout: 5000,
      })
      .done(function(data) {
        if (data.status == true) {
          this.state.feed.starStatus = true;
        } else {
          this.state.Snackbar.open = true;
          this.state.Snackbar.message = data.message;
        }
      }.bind(this))
      .fail(function() {
        this.state.Snackbar.open = true;
        this.state.Snackbar.message = '请求超时，请检查网络状态！';
      }.bind(this))
      .always(function() {
        load.hide();
        this.setState(this.state);
      }.bind(this));
    } else {
      this.context.router.push('/sign/up');
    }
  }

  handleUnStar() {
    if (checkLoginStatus()) {
      let load = loadTips('取消中...');
      $.ajax({
        url: buildURL('feed', 'unStar'),
        type: 'POST',
        dataType: 'json',
        data: {feed_id: this.state.feed.feedId},
      })
      .done(function(data) {
        if (data.status) {
          this.state.feed.starStatus = false;
        } else {
          this.state.Snackbar.open = true;
          this.state.Snackbar.message = data.message;
        }
      }.bind(this))
      .fail(function() {
        this.state.Snackbar.open = true;
        this.state.Snackbar.message = '请求超时，请检查网络状态！';
      }.bind(this))
      .always(function() {
        load.hide();
        this.setState(this.state);
      }.bind(this, load));
    } else {
      this.context.router.push('/sign/up');
    }
  }

  handleFollow() {
    if (checkLoginStatus()) {
      let load = loadTips('执行中...');
      $.ajax({
        url: buildURL('feed', 'digg'),
        type: 'POST',
        dataType: 'json',
        data: {feed_id: this.state.feed.feedId},
        timeout: 5000,
      })
      .done(function(data) {
        if (data.status == true) {
          this.state.feed.diggCount += 1;
          this.state.feed.followStatus = true;
        } else {
          this.state.Snackbar.open = true;
          this.state.Snackbar.message = data.message;
        }
      }.bind(this))
      .fail(function() {
        this.state.Snackbar.open = true;
        this.state.Snackbar.message = '请求超时，请检查网络状态！';
      }.bind(this))
      .always(function() {
        load.hide();
        this.setState(this.state);
      }.bind(this));
    } else {
      this.context.router.push('/sign/up');
    }
  }

  handleUnFollow() {
    if (checkLoginStatus()) {
      let load = loadTips('取消中...');
      $.ajax({
        url: buildURL('feed', 'unDigg'),
        type: 'POST',
        dataType: 'json',
        data: {feed_id: this.state.feed.feedId},
        timeout: 5000,
      })
      .done(function(data) {
        if (data.status == true) {
          this.state.feed.diggCount -= 1;
          this.state.feed.followStatus = false;
        } else {
          this.state.Snackbar.open = true;
          this.state.Snackbar.message = data.message;
        }
      }.bind(this))
      .fail(function() {
        this.state.Snackbar.open = true;
        this.state.Snackbar.message = '请求超时，请检查网络状态！';
      }.bind(this))
      .always(function() {
        load.hide();
        this.setState(this.state);
      }.bind(this));
    } else {
      this.context.router.push('/sign/up');
    }
  }
}

const styles = {
  root: {
    paddingTop: 50,
    paddingBottom: 50,
    backgroundColor: '#fff',
  },
  feedContentBox: {
    paddingRight: 16,
    paddingLeft: 16,
  },
  diggsBox: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 16,
    paddingLeft: 16,
    width: '100%',
    alignItems: 'center',
  },
  diggsLeftAvatars: {
    display: 'inline-flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 1,
    overflow: 'hidden',
  },
  diggAvatar: {
    margin: 4,
  },
  toolBar: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    position: 'fixed',
    bottom: 0,
    boxShadow: '0 0 1px 1px #ebebeb',
    zIndex: 9,
    backgroundColor: '#fff',
  },
  toolItem: {
    flexGrow: 1,
    textAlign: 'center',
  },
}

Reader.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Reader;
