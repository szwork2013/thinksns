import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import Snackbar from 'material-ui/Snackbar';

// 图标
import NavigationMoreHoriz from 'material-ui/svg-icons/navigation/more-horiz';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import CommunicationComment from 'material-ui/svg-icons/communication/comment';
import AVRepeat from 'material-ui/svg-icons/av/repeat';

// 自有组件
import Cache from '../util/cache';
import FeedContentText from './content/text';
import FeedContentImage from './content/image';
import FeedContentVideo from './content/video';
import FormatClientName from '../util/FormatClientName';
import checkLoginStatus from '../util/check-login-status.jsx';

class FeedItem extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      Snackbar: {
        open: false,
        message: '',
      },
    };
  }

  render() {
    return (
      <div style={styles.root}>
        <div style={styles.header}>
          <div
            style={{
              width: 'auto',
              height: 'auto',
              position: 'relative',
            }}
          >
            <Avatar
              size={50}
              src={this.state.data.user.face}
              onTouchTap={() => {
                window.router.push(`/user/${this.state.data.user.username}`);
              }}
            />
            {this.state.data.user.groupicon && (
              <img
                src={this.state.data.user.groupicon}
                style={{
                  width: 20,
                  height: 20,
                  position: 'absolute',
                  bottom: 6,
                  right: -6,
                }}
              />
            )}
          </div>
          <div style={styles.headerContent}>
            <span style={styles.headerUsername}>{this.state.data.user.username}</span>
            <span style={styles.headerMore}>{this.state.data.date}  来自{FormatClientName(this.state.data.feed.from)}</span>
          </div>
        </div>
        <div style={styles.body}>
          <FeedContentText content={this.state.data.feed.content} feedId={this.state.data.feed.id} />
          <FeedContentImage images={this.state.data.images} />
          <FeedContentVideo video={this.state.data.video} />
        </div>
        <div style={styles.footer}>
          <FlatButton
            icon={<AVRepeat />}
            style={{
              color: '#b2b2b2',
              minWidth: 45,
              width: 45,
            }}
            onTouchTap={() => {
              window.router.push(`/send/repoeat/${this.state.data.feed.id}`);
            }}
          />
          <FlatButton
            style={{
              color: '#b2b2b2',
              minWidth: 70,
              width: 70,
            }}
            labelStyle={{
              display: 'inline-block',
              boxSizing: 'border-box',
              minWidth: 33,
              paddingRight: 0,
            }}
            icon={<CommunicationComment />}
            label={this.state.data.feed.commentNum > 99 ? '99+' : this.state.data.feed.commentNum + ''}
            onTouchTap={() => {
              window.router.push(`/feed/comment/${this.state.data.feed.id}`);
            }}
          />
          {this.getStarDOM()}
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
    );
  }

  getStarDOM() {
    if (this.state.data.feed.starStatus == true) {
      return (
        <FlatButton
          style={{
            color: '#0096e6',
            minWidth: 70,
            width: 70,
          }}
          labelStyle={{
            display: 'inline-block',
            boxSizing: 'border-box',
            minWidth: 33,
            paddingRight: 0,
          }}
          icon={<ActionFavoriteBorder />}
          label={this.state.data.feed.starNum > 99 ? '99+' : this.state.data.feed.starNum + ''}
          onTouchTap={this.handleUnStar.bind(this)}
        />
      );
    }
    return (
      <FlatButton
        style={{
          color: '#b2b2b2',
          minWidth: 70,
          width: 70,
        }}
        labelStyle={{
          display: 'inline-block',
          boxSizing: 'border-box',
          minWidth: 33,
          paddingRight: 0,
        }}
        icon={<ActionFavoriteBorder />}
        label={this.state.data.feed.starNum > 99 ? '99+' : this.state.data.feed.starNum + ''}
        onTouchTap={this.handleStar.bind(this)}
      />
    );
  }

  handleStar() {
    if (!checkLoginStatus()) {
      window.router.push('/sign/up');
    } else {
      let load = loadTips('执行中...');
      $.ajax({
        url: buildURL('feed', 'digg'),
        type: 'POST',
        dataType: 'json',
        data: {
          feed_id: this.state.data.feed.id,
        },
        timeout: 5000,
      })
      .done(function(data) {
        if (data.status == true) {
          this.state.data.feed.starStatus = true;
          this.state.data.feed.starNum += 1;
        }
        this.state.Snackbar.open = true;
        this.state.Snackbar.message = data.message;
      }.bind(this))
      .fail(function() {
        this.state.Snackbar.open = true;
        this.state.Snackbar.message = '请求超时，请检查网络状态!';
      }.bind(this))
      .always(function() {
        load.hide();
        this.setState(this.state);
      }.bind(this));
    }
  }

  handleUnStar() {
    if (!checkLoginStatus()) {
      window.router.push('/sign/up');
    } else {
      let load = loadTips('执行中...');
      $.ajax({
        url: buildURL('feed', 'unDigg'),
        type: 'POST',
        dataType: 'json',
        data: {
          feed_id: this.state.data.feed.id,
        },
        timeout: 5000,
      })
      .done(function(data) {
        if (data.status == true) {
          this.state.data.feed.starStatus = false;
          this.state.data.feed.starNum -= 1;
        }
        this.state.Snackbar.open = true;
        this.state.Snackbar.message = data.message;
      }.bind(this))
      .fail(function() {
        this.state.Snackbar.open = true;
        this.state.Snackbar.message = '请求超时，请检查网络状态!';
      }.bind(this))
      .always(function() {
        load.hide();
        this.setState(this.state);
      }.bind(this));
    }
  }

}

const styles = {
  root: {
    boxSizing: 'border-box',
    width: '100%',
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomColor: '#ebebeb',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    boxSizing: 'border-box',
  },
  headerContent: {
    boxSizing: 'border-box',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    paddingLeft: 16,
  },
  headerUsername: {
    width: '100%',
    fontSize: 16,
    color: '#000',
  },
  headerMore: {
    width: '100%',
    fontSize: 14,
    color: '#b0b0b0',
  },
  body: {
    width: '100%',
    height: 'auto',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    boxSizing: 'border-box',
    paddingRight: 12,
  },
};

FeedItem.defaultProps = {
  data: {
    user: {
      uid: 0,
      username: '',
      face: '',
      groupicon: ''
    },
    feed: {
      id: 0,
      content: '',
      from: 0,
      starNum: 0,
      commentNum: 0,
      starStatus: false,
    },
    date: 'new',
    type: 'post',
    images: [],
  }
}

export default FeedItem;