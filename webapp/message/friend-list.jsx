import React, {Component} from 'react';
import {List} from 'material-ui/List';

import Cache from '../util/cache.jsx';
import FriendGroup from './friend-group.jsx';

class FriendList extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      friends: false,
      keys: [],
    };
    this.cacheKeyName = 'user-friends';
    // console.log(props.pushHandle);
  }

  componentDidMount() {
    if (Cache.hasItem(this.cacheKeyName)) {
      this.setState(Cache.getItem(this.cacheKeyName));
    } else {
      let load = loadTips('加载中...');
      $.ajax({
        url: buildURL('user', 'getFriends'),
        type: 'POST',
        dataType: 'json',
        data: {param1: 'value1'},
      })
      .done(function(data) {
        this.state.friends = data.friends;
        this.state.keys = data.keys;
        Cache.setItem(this.cacheKeyName, this.state);
      }.bind(this))
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        load.hide();
        this.setState(this.state);
      }.bind(this));
    }
  }

  render() {
    if (this.props.status === false) {
      return null;
    } else if (!this.state.friends || this.state.keys.length <= 0) {
      return (
        <TipsEmpty message={'暂时没有联系人！'} />
      );
    }
    return (
      <List>
        {this.state.keys.map((key) => {
          return (
            <FriendGroup
              key={key}
              users={this.state.friends[key]}
              subheader={key}
              select={this.props.select}
              pushHandle={this.props.pushHandle}
              unPushHandle={this.props.unPushHandle}
            />
          );
        })}
      </List>
    );
  }
}

export default FriendList;
