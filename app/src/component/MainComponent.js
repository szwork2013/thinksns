/**
 * MainComponent
 */
import React, { Component, PropTypes } from 'react';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';

// icons
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionExplore from 'material-ui/svg-icons/action/explore';
import CommunicationMessage from 'material-ui/svg-icons/communication/message';
import SocialPerson from 'material-ui/svg-icons/social/person';
import ContentAdd from 'material-ui/svg-icons/content/add';

class MainComponent extends Component {

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    const { children } = this.props;
    const { muiTheme } = this.context;
    const { bottomNavigation: { height } } = muiTheme;

    return (
      <div
        data-node-name="MainComponent"
        style={{
          width: '100%',
          paddingBottom: height,
        }}
      >
        {children}
        <Paper
          zDepth={1}
          data-node-name="MainComponent,Paper"
          style={{
            position: 'fixed',
            width: '100%',
            bottom: 0,
            zIndex: 1,
          }}
        >
          <BottomNavigation
            selectedIndex={1}
            data-node-name="MainComponent,Paper,BottomNavigation"
          >
            <BottomNavigationItem
              icon={
                <ActionHome />
              }
              label="主页"
            />
            <BottomNavigationItem
              icon={
                <ActionExplore />
              }
              label="发现"
            />
            <FloatingActionButton
              style={{
                marginTop: '-12px',
                height: height,
                maxHeight: height,
                minHeight: height,
                width: height,
                maxWidth: height,
                minWidth: height,
              }}
              secondary={true}
            >
              <ContentAdd />
            </FloatingActionButton>
            <BottomNavigationItem
              icon={
                <CommunicationMessage />
              }
              label="消息"
            />
            <BottomNavigationItem
              icon={
                <SocialPerson />
              }
              label="我的"
            />
          </BottomNavigation>
        </Paper>
      </div>
    );
  }
}

export default MainComponent;
