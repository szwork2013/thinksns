import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';
import ToolBar from '../tool-bar.jsx';

class Home extends Component
{

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.root}>
          <Tabs
            style={styles.Tabs}
            tabItemContainerStyle={{
              borderBottom: '#ebebeb solid 1px',
            }}
            inkBarStyle={{
              backgroundColor: '#0096e5',
            }}
            value={this.props.children.props.route.path}
          >
            <Tab
              label={'全部'}
              value={'all'}
              onActive={() => {
                this.context.router.replace('/home/all');
              }}
            />
            <Tab
              label={'关注'}
              value={'start'}
              onActive={() => {
                this.context.router.replace('/home/start');
              }}
            />
            <Tab
              label={'频道'}
              value={'channel'}
              onActive={() => {
                this.context.router.replace('/home/channel');
              }}
            />
            <Tab
              label={'推荐'}
              value={'recommend'}
              onActive={() => {
                this.context.router.replace('/home/recommend');
              }}
            />
          </Tabs>
          {this.props.children}
          <ToolBar value={'home'} />
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = {
  root: {
    paddingTop: 50,
    paddingBottom: 50,
    width: '100%',
    minHeight: '100%',
    // height: '100%',
    boxSizing: 'border-box',
    // position: 'absolute',
    // display: 'flex',
    // flexDirection: 'column',
    // overflow: 'hidden',
  },
  Tabs: {
    boxShadow: '#ebebeb 0 1px 4px 0',
    overflow: 'hidden',
    display: 'fiex',
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    width: '100%',
    maxHeight: 50,
    zIndex: 10,
  }
};

Home.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Home;
