import React, {Component} from 'react';
import request from 'superagent';
import Snackbar from 'material-ui/Snackbar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import guid from '../util/guid';
import Cache from '../util/cache';
import checkLoginStatus from '../util/check-login-status';

import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

class WeibaIndex extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      follow: [],
      tops: [],
      Snackbar: {
        open: false,
        message: '',
      }
    }
  }

  componentDidMount() {
    let cacheKeyName = 'weiba-index';
    if (Cache.hasItem(cacheKeyName)) {
      this.setState(Cache.getItem(cacheKeyName));
    } else {
      request
      .get(buildURL('weiba', 'getIndex'))
        .end((error, ret) => {
          if (error) {
            this.state.Snackbar.open = true;
            this.state.Snackbar.message = '请求失败，请检查网络!';
          } else {
            this.state.follow = ret.body.follow;
            this.state.tops = ret.body.tops;
            Cache.setItem(cacheKeyName, this.state);
          }
          this.setState(this.state);
        })
      ;
    }
  }

  render() {
    return (
      <div>
          <List
            style={styles.List}
          >
            {this.state.follow.map((weiba) => {
              return [
                <ListItem
                  key={guid()}
                  leftAvatar={<Avatar src={weiba.avatar_big} />}
                  primaryText={weiba.weiba_name}
                  secondaryText={weiba.intro}
                  onTouchTap={() => {
                    this.context.router.push(`/weiba/reader/${weiba.weiba_id}`);
                  }}
                />,
                <Divider />
              ];
            })}
            {this.getUserNoLoginDOM()}
            <div
              style={{
                boxSizing: 'border-box',
                width: '100%',
                paddingTop: 4,
                paddingBottom: 4,
                textAlign: 'center',
                fontSize: 24,
                fontWeight: 300,
                color: '#979797',
              }}
              onTouchTap={() => {
                this.context.router.push('/weiba/all');
              }}
            >
              全部微吧
            </div>
          </List>
        <Subheader>推荐的</Subheader>
        <List
          style={styles.List2}
        >
          {this.state.tops.map((weiba) => {
            return [
              <ListItem
                key={guid()}
                leftAvatar={<Avatar src={weiba.avatar_big} />}
                primaryText={weiba.weiba_name}
                secondaryText={weiba.intro}
                rightIcon={<NavigationChevronRight />}
                onTouchTap={() => {
                  this.context.router.push(`/weiba/reader/${weiba.weiba_id}`);
                }}
              />,
              <Divider />
            ];
          })}
        </List>
        <Snackbar
          open={this.state.Snackbar.open}
          message={this.state.Snackbar.message}
        />
      </div>
    );
  }

  getUserNoLoginDOM() {
    if (!checkLoginStatus()) {
      return (
        <div
          style={{
            boxSizing: 'border-box',
            width: '100%',
            paddingTop: 4,
            paddingBottom: 4,
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 300,
            color: '#0699e5',
            borderBottom: '1px solid #ebebeb',
          }}
          onTouchTap={() => {
            this.context.router.push('/sign/up');
          }}
        >
          去登录吧
        </div>
      );
    }
    return null;
  }
}
  
const styles = {
  List: {
    backgroundColor: '#fff',
    marginTop: 12,
  },
  List2: {
    backgroundColor: '#fff',
  },
};

WeibaIndex.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default WeibaIndex;