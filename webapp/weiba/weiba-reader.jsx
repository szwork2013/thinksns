import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import Snackbar from 'material-ui/Snackbar';
import request from 'superagent';
import AppBar from '../AppBar';
import Posts from './posts';

import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';

import blurImage from '../../app/images/blur.jpg';

class WeibaReader extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      weiba: {},
      Snackbar: {
        open: false,
        message: '',
      }
    }
  }

  componentDidMount() {
    request
      .post(buildURL('weiba', 'getInfo'))
      .field('weiba_id', this.props.params.weibaId)
      .end((error, ret) => {
        if (error) {
          this.state.Snackbar.open = true;
          this.state.Snackbar.message = '网络错误，请求数据失败!';
        } else {
          this.state.weiba = ret.body.message;
        }
        this.setState(this.state);
      })
    ;
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.root}>
          <AppBar
            title={this.state.weiba.weiba_name}
            iconElementLeft={
              <IconButton onTouchTap={goBack}>
                <NavigationChevronLeft />
              </IconButton>
            }
          />
          <div
            style={{
              boxSizing: 'border-box',
              width: '100%',
              padding: 12,
              display: 'flex',
              flexDirection: 'row',
              paddingTop: 34,
              backgroundImage: `url(${blurImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Avatar size={70} src={this.state.weiba.avatar_big} />
            <div style={styles.headerInfo}>
              <h3 style={styles.headerTitle}>{this.state.weiba.weiba_name}</h3>
              <div style={styles.headerBody}>
                <div style={styles.headerBodyNum}>成员 {this.state.weiba.follower_count}  帖子 {this.state.weiba.thread_count}</div>
                <div style={styles.headerStarButtom} onTouchTap={this.handleFollow.bind(this)}>{this.state.weiba.isfollow ? '取消关注' : '关注'}</div>
              </div>
            </div>
          </div>
          {this.state.weiba.weiba_id && (
            <Posts weibaId={this.state.weiba.weiba_id} num={30} />
          )}
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

  handleFollow() {
    let load = loadTips('操作中...');
    if (this.state.weiba.isfollow) {
      request
        .post(buildURL('weiba', 'weibaUnFollow'))
        .field('weiba_id', this.state.weiba.weiba_id)
        .end((error, ret) => {
          this.state.Snackbar.open = true;
          this.state.Snackbar.message = ret.body.message || error;
          if (!error) {
            this.state.weiba.isfollow = 0;
            this.state.weiba.follower_count -= 1;
          }
          load.hide();
          this.setState(this.state);
        })
      ;
    } else {
      request
        .post(buildURL('weiba', 'weibaFollow'))
        .field('weiba_id', this.state.weiba.weiba_id)
        .end((error, ret) => {
          this.state.Snackbar.open = true;
          this.state.Snackbar.message = ret.body.message || error;
          if (!error) {
            this.state.weiba.isfollow = 1;
            this.state.weiba.follower_count += 1;
          }
          load.hide();
          this.setState(this.state);
        })
      ;
    }
  }
}

const styles = {
  root: {
    width: '100%',
    paddingTop: 50,
  },
  headerInfo: {
    flexGrow: 1,
    boxSizing: 'border-box',
    marginLeft: 12,
    height: 78,
    overflow: 'hidden',
  },
  headerTitle: {
    margin: 0,
    padding: 0,
    color: '#fff',
    fontWeight: 300,
  },
  headerBody: {
    display: 'flex',
    width: '100%',
    height: 40,
    color: '#fff',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBodyNum: {
    flexGrow: 1,
  },
  headerStarButtom: {
    width: 'auto',
    height: 26,
    lineHeight: '26px',
    paddingRight: 8,
    paddingLeft: 8,
    textAlign: 'center',
    color: '#fff',
    border: '1px solid #fff',
    borderRadius: 6,
  }
}

export default WeibaReader;
