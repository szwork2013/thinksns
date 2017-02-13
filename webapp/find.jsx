import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import AppBar from './AppBar.jsx';
import ToolBar from './tool-bar.jsx';
import FindBanner from './find-banner.jsx';

import find_weiba from '../app/images/find/weiba.png';
import find_topic from '../app/images/find/topic.png';
import find_channel from '../app/images/find/channel.png';

class Find extends Component
{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    appNode.style.display = 'block';
    $('.mdl-layout__container').hide();
  }

  componentWillReceiveProps() {
    this.componentDidMount();
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.root}>
          <AppBar
            title={'发现'}
            showMenuIconButton={false}
            zDepth={0}
          />
          <FindBanner />
          <Divider />
          <List
            style={styles.List}
          >
            <ListItem
              leftAvatar={<Avatar src={find_weiba} />}
              rightIcon={<NavigationChevronRight />}
              primaryText={'微吧 Weiba'}
              secondaryText={'开启你的微吧之路'}
              onTouchTap={() => {
                this.context.router.push('/weiba');
              }}
            />
            <Divider />
            <ListItem
              leftAvatar={<Avatar src={find_topic} />}
              rightIcon={<NavigationChevronRight />}
              primaryText={'话题 Topic'}
              secondaryText={'快速参与讨论吧'}
              onTouchTap={() => {
                this.context.router.push('/topic');
              }}
            />
            <Divider />
            <ListItem
              leftAvatar={<Avatar src={find_channel} />}
              rightIcon={<NavigationChevronRight />}
              primaryText={'频道 Channel'}
              secondaryText={'发现你所感兴趣的'}
              onTouchTap={() => {
                this.context.router.push('/channel');
              }}
            />
            <Divider />
          </List>
          <ToolBar value={'find'} />
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = {
  root: {
    boxSizing: 'border-box',
    width: '100%',
    minHeight: '100%',
    paddingTop: 50,
    paddingBottom: 50,
    // backgroundColor: '#f1f1f1',
  },
  List: {
    backgroundColor: '#fff',
  }
};

Find.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Find;
