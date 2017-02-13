import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Badge from 'material-ui/Badge';
import TimeAgo from 'react-timeago';

import Cache from '../util/cache.jsx';
import Expression from '../util/expression';
import guid from '../util/guid';

import chat_group from '../../app/images/message/ic_chat_group.png';

class ChatList extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      chats: []
    };
  }

  componentDidMount() {
    if (Cache.hasItem('message-chats')) {
      this.state.chats = Cache.getItem('message-chats');
      this.setState(this.state);
    } else {
      let load = loadTips('加载中...');
      $.ajax({
        url: buildURL('message', 'getChats'),
        type: 'POST',
        dataType: 'json',
        data: {param1: 'value1'},
      })
      .done(function(data) {
        if (data.status !== 0) {
          this.state.chats = data;
          Cache.setItem('message-chats', data);
        }
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
    } else if (this.state.chats.length <= 0) {
      return (
        <TipsEmpty message={'暂时没有聊天记录哦！'} />
      );
    }
    return (
      <List>
        {this.state.chats.map((chat, index) => {
          return [
            (<ListItem
              key={guid()}
              primaryText={
                <div>
                  {chat.title}
                  <span style={styles.TimeAgo}>
                    <TimeAgo
                      live={true}
                      date={chat.time}
                      formatter={(value, unit, suffix, date) => {
                        let d = new Date;
                        if ((d.getTime() - date) >  604800000) {
                          d.setTime(date);
                          return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours() + 1}:${d.getMinutes()}`
                        }

                        unit = {
                          second: '秒',
                          minute: '分钟',
                          hour: '小时',
                          day: '天',
                          week: '周',
                          month: '月',
                          year: '年',
                        }[unit];

                        if (suffix == 'ago') {
                          suffix = '前';
                        } else {
                          suffix = '后';
                        }

                        return value+unit+suffix;

                      }}
                    />
                  </span>
                </div>
              }
              leftAvatar={chat.num <= 0
                ? (<Avatar src={chat.logo || chat_group} />)
                : (
                  <Badge
                    style={styles.Badge}
                    badgeStyle={styles.badgeStyle}
                    badgeContent={chat.num > 9 ? '9+' : chat.num}
                    primary={true}
                  >
                    <Avatar src={chat.logo || chat_group} />
                  </Badge>
                )
              }
              secondaryText={this.handleBuildEmoticonDOM(chat.last)}
              onTouchTap={() => {
                this.state.chats[index].num = 0;
                Cache.setItem('message-chats', this.state.chats);
                this.context.router.push('/chat/' + chat.listId);
              }}
            />),
            (<Divider inset={true} />)
          ];
        })}
      </List>
    );
  }

  handleBuildEmoticonDOM(content) {
    return Expression.buildDOM(content, (path) => (
      <img
        src={path}
        key={guid()}
        style={styles.expression}
      />
    ));
  }
}

const styles = {
  TimeAgo: {
    position: 'absolute',
    right: 14,
    marginTop: -10,
    color: '#b0b0b0',
    fontSize: 12,
    fontWeight: 200
  },
  Badge: {
    padding: 0,
  },
  badgeStyle: {
    top: -6,
    right: -6,
  },
  expression: {
    width: 14,
    height: 14,
  },
}

ChatList.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default ChatList;
