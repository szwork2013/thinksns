import React, {Component} from 'react';
import ChatItem from './chat-item';

class MessageChatItemImage extends Component
{
  render() {
    return (
      <ChatItem {...this.props}>
        <img src={this.props.data.image} width={'100%'} />
      </ChatItem>
    );
  }
}

export default MessageChatItemImage;