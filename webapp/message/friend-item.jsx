import React, {Component} from 'react';
import request from 'superagent';
import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Checkbox from 'material-ui/Checkbox';
import ToggleradiobuttonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';
import ToggleradiobuttonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';

class FriendItem extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }

  render() {
    if (this.props.select === true) {
      return (
        <ListItem
          rightAvatar={<Avatar src={this.state.data.face} />}
          leftCheckbox={
            <Checkbox
              iconStyle={{
                fill: '#b2b2b2',
              }}
              checkedIcon={<ToggleradiobuttonChecked />}
              uncheckedIcon={<ToggleradiobuttonUnchecked />}
              onCheck={(event, isInputChecked) => {
                if (isInputChecked === true) {
                  this.props.pushHandle(this.state.data.uid);
                } else {
                  this.props.unPushHandle(this.state.data.uid);
                }
              }}
            />
          }
          primaryText={this.state.data.username}
        />
      );
    }
    return (
      <ListItem
        leftAvatar={<Avatar src={this.state.data.face} />}
        primaryText={this.state.data.username}
        onTouchTap={() => {
          let load = loadTips('发起聊天...');
          request
            .post(buildURL('message', 'createRoom'))
            .field('ids', this.state.data.uid)
            .end((error, ret) => {
              if (error) {
                console.log(error);
                alert('发起聊天失败，请检查网络!');
              } else {
                this.context.router.push('/chat/' + ret.body.message);
              }
              load.hide();
            })
          ;
        }}
      />
    );
  }
}

FriendItem.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default FriendItem;
