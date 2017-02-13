import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Avatar from 'material-ui/Avatar';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import ShowDate from './showDate';
import stylesMe from './styles/chat-item-me';
import styles from './styles/chat-item';

class ChatItem extends Component
{
  constructor(props) {
    super(props);
    if (props.data.is_me == true) {
      this.styles = stylesMe;
    } else {
      this.styles = styles;
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <ShowDate show={this.props.showDate} date={this.props.data.date} />
          <div style={this.styles.body}>
            <div style={this.styles.AvatarBox}>
              <Avatar src={this.props.data.face} />
            </div>
            <div style={this.styles.textBox}>
              <AvPlayArrow style={this.styles.AvPlayArrow} color={this.styles.AvPlayArrowColor} />
              <div style={this.styles.content}>
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

ChatItem.defaultProps = {
  data: {
    face: "",
    uid: "",
    date: "",
    is_me: true,
  },
  showDate: false,
}

export default ChatItem;