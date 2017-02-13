import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

import AppBar from './AppBar.jsx';

class UserSeting extends React.Component
{
   constructor(props) {
    super(props);
    this.state = {
      Snackbar: {
        open: false,
        message: '',
      }
    };
  }

    componentDidMount() {
        appNode.style.display = 'block';
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.root}>
                    <AppBar
                        title="设置"
                        iconElementLeft={
                            <IconButton onTouchTap={goBack}>
                                <FontIcon className="material-icons">chevron_left</FontIcon>
                            </IconButton>
                        }
                    />
                    <div style={styles.outSignBox}>
                        <FlatButton
                            style={styles.outSignButton}
                            label="退出登陆"
                            backgroundColor="#0096e5"
                            hoverColor="#0096e5"
                            rippleColor="#fff"
                            onTouchTap={this.handleSignOut.bind(this)}
                        />
                    </div>
                    <Snackbar
                      open={this.state.Snackbar.open}
                      message={this.state.Snackbar.message}
                      autoHideDuration={1500}
                      onRequestClose={() => {
                        this.state.Snackbar.open = false;
                        this.setState(this.state);
                      }}
                    />
                </div>
            </MuiThemeProvider>
        );
    }

    handleSignOut() {
        var load = loadTips('正在注销...');
        $.ajax({
            url: buildURL('sign', 'out'),
            type: 'POST',
            dataType: 'json',
            data: {param1: 'value1'},
        })
        .done(function() {
            window.location.href = buildURL('index', 'index');
        })
        .fail(function() {
          this.setState({
            Snackbar: {
              open: true,
              message: '请求失败，请检查网络!',
            }
          });
        }.bind(this))
        .always(function() {
            load.hide();
        });
    }
}

const styles = {
    root: {
        paddingTop: '50px',
    },
    outSignBox: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '0 24px',
        marginTop: '15px',
    },
    outSignButton: {
        width: '100%',
        color: '#fff',
    }
};

export default UserSeting;
