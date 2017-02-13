import React, {Component} from 'react';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import FriendItem from './friend-item.jsx';
// import guid from '../util/guid.jsx';

class FriendGroup extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      users: props.users,
      key: props.subheader,
    };
    // console.log(this.state.users, props);
  }

  render() {
    return (
      <div>
        <Subheader>{this.state.key}</Subheader>
        {this.state.users.map((user, index) => {
          return [
            (<FriendItem
              key={user.uid}
              data={user}
              select={this.props.select}
              pushHandle={this.props.pushHandle}
              unPushHandle={this.props.unPushHandle}
            />),
            (<Divider inset={true} />)
          ];
          // return (<FriendItem key={user.uid} data={user} />);
        })}
        <Divider inset={false} />
      </div>
    );
  }
}

export default FriendGroup;
