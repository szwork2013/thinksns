import React, {Component} from 'react';
import request from 'superagent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import {Tabs, Tab} from 'material-ui/Tabs';
import AppBar from '../AppBar';

import WeibaIndex from './index';
import WeibaTops from './tops';

import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ActionSearch from 'material-ui/svg-icons/action/search';

class Weiba extends Component
{
  render() {
    // console.log(this.props.children.props.route.path);
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.root}>
          <AppBar
            title={'微吧'}
            iconElementLeft={
              <IconButton onTouchTap={goBack}>
                <NavigationChevronLeft />
              </IconButton>
            }
            iconElementRight={
              <IconButton
                onTouchTap={() => {
                  this.context.router.push('/weiba/all');
                }}
              >
                <ActionSearch />
              </IconButton>
            }
          />
          <Tabs
            inkBarStyle={styles.inkBarStyle}
            value={this.props.children.props.route.path}
          >
            <Tab
              label="我加入的"
              value={'join'}
              onActive={() => {
                this.context.router.replace('/weiba/join');
              }}
            />
            <Tab
              label="热帖推荐"
              value={'tops'}
              onActive={() => {
                this.context.router.replace('/weiba/tops')
              }}
            />
          </Tabs>
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = {
  root: {
    width: '100%',
    paddingTop: 50,
  },
  inkBarStyle: {
    backgroundColor: '#0096e5',
  },
}

// Weiba.defaultProps = {
//   params: {
//     type: 'join',
//   }
// }

Weiba.contextTypes = {
    router: React.PropTypes.object.isRequired
};


export default Weiba;