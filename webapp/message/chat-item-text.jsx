import React, {Component} from 'react';
import ChatItem from './chat-item';
import Expression from '../util/expression';
import guid from '../util/guid';

class MessageChatItemText extends Component
{
  render() {
    return (
      <ChatItem {...this.props}>
        {Expression.buildDOM(this.props.data.content, (src) => <img key={guid()} src={src} style={{height: 20}} />)}
      </ChatItem>
    );
  }
}

export default MessageChatItemText;
