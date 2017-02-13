import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';

import HomeIcon from './svg-icons/home';
import ExploreIcon from './svg-icons/explore';
import AddIcon from './svg-icons/add';
import MessageIcon from './svg-icons/message';
import PersonIcon from './svg-icons/person';

class TsToolBar extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    }
  }

  render() {
    return (
      <div
        className={'filter-bg-fff'}
        style={styles.root}
      >
        <IconButton
          onTouchTap={() => {
            this.context.router.replace('/home/all');
          }}
        >
          <HomeIcon color={this.state.value == 'home' ? '#0096e5' : '#9e9e9e'} />
        </IconButton>
        <IconButton
          onTouchTap={() => {
            this.context.router.replace('/find');
          }}
        >
          <ExploreIcon color={this.state.value == 'find' ? '#0096e5' : '#9e9e9e'} />
        </IconButton>
        <IconButton
          iconStyle={{
            width: 40,
            height: 40,
          }}
          style={{
            padding: 0,
            paddingBottom: 4,
          }}
          onTouchTap={() => {
            this.context.router.push('/send');
          }}
        >
          <AddIcon color={'#0096e5'} />
        </IconButton>
        <IconButton
          onTouchTap={() => {
            this.context.router.replace('/message');
          }}
        >
          <MessageIcon color={this.state.value == 'message' ? '#0096e5' : '#9e9e9e'} />
        </IconButton>
        <IconButton
          onTouchTap={() => {
            this.context.router.replace('/user');
          }}
        >
          <PersonIcon color={this.state.value == 'user' ? '#0096e5' : '#9e9e9e'} />
        </IconButton>
      </div>
    );
  }
}

const styles = {
  root: {
    position: 'fixed',
    width: '100%',
    height: 50,
    right: 0,
    bottom: -2,
    left: 0,
    boxShadow: '2px 0 4px 0 #ebebeb',
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  }
}

TsToolBar.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default TsToolBar;
