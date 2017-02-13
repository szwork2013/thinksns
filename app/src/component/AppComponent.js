/**
 * AppComponent
 */
import React, { Component, cloneElement } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../util/thinksnsBaseTheme';
import DialogProvider from '../provider/DialogProvider';

class AppComponent extends Component {
  render() {

    const { children, location, ...props } = this.props;
    const { pathname } = location;

    return (
      <MuiThemeProvider muiTheme={theme}>
        <div
          data-node-name="AppComponent"
          style={{
            width: '100%',
            height: 'auto',
            minHeight: '100vh',
          }}
        >
          {
            cloneElement(children, {
              key: pathname,
            })
          }
          <DialogProvider />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default AppComponent;
