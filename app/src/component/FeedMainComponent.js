/**
 * FeedMainComponent.
 */
import React, { Component, PropTypes } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

class FeedMainComponent extends Component {

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {

    const { children } = this.props;
    const { muiTheme } = this.context;
    const { button: { iconButtonSize } } = muiTheme;

    return (
      <div
        data-node-name="FeedMainComponent"
        style={{
          paddingTop: iconButtonSize,
          width: '100%',
        }}
      >
        <Tabs
          data-node-name="FeedMainComponent,Tabs"
          style={{
            width: '100%',
            position: 'fixed',
            top: 0,
            zIndex: 1,
          }}
        >
          <Tab
            label="全部"
          />
          <Tab
            label="关注"
          />
          <Tab
            label="频道"
          />
          <Tab
            label="推荐"
          />
        </Tabs>
        {children}
      </div>
    );
  }
}

export default FeedMainComponent;
