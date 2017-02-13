import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import SocialPerson from 'material-ui/svg-icons/social/person';
import AppBar from '../AppBar.jsx';
import checkLoginStatus from '../util/check-login-status.jsx';

import sign_logo from '../../app/images/icons/sign-logo.png';

class UserSignUp extends Component
{

  constructor(props) {
    super(props);
    this.state = {
      username: {
        error: '',
      },
      password: {
        error: '',
      },
      Snackbar: {
        open: false,
        message: '',
      }
    };
    this.set = true;
  }

  componentDidMount() {
    if (checkLoginStatus()) {
      this.context.router.goBack();
    }
  }

  render() {
    appNode.style.display = 'block';
    $('.mdl-layout__container').hide();
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.root}>
          <AppBar
            title={'登录'}
            iconElementLeft={
              <IconButton onTouchTap={() => {
                this.context.router.push('/');
              }}>
                <NavigationChevronLeft/>
              </IconButton>
            }
            iconElementRight={
              <FlatButton
                label={'注册'}
                onTouchTap={() => {
                  this.context.router.push('/sign/in');
                }}
              />
            }
          />
          <div style={styles.logoBox}>
            <img style={styles.logo} src={sign_logo} />
          </div>
          <List>
            <ListItem
              primaryText={
                <TextField
                  floatingLabelText={'请输入用户名、手机号码、邮箱'}
                  fullWidth={true}
                  errorText={this.state.username.error}
                  ref={'username'}
                />
              }
              disabled={true}
              style={{
                paddingBottom: 0,
              }}
            />
            <ListItem
              primaryText={
                <TextField
                  floatingLabelText={'请输入账户密码'}
                  fullWidth={true}
                  errorText={this.state.password.error}
                  ref={'password'}
                  type={'password'}
                />
              }
              disabled={true}
            />
            <ListItem
              primaryText={
                <RaisedButton
                  style={styles.loginButtom}
                  label={'登录'}
                  fullWidth={true}
                  labelColor={'#fff'}
                  backgroundColor={'#0096e5'}
                  onTouchTap={this.handleSubmit.bind(this)}
                />
              }
              disabled={true}
              style={{
                paddingBottom: 0,
              }}
            />
          </List>
          <Snackbar
            open={this.state.Snackbar.open}
            message={this.state.Snackbar.message}
            autoHideDuration={1500}
          />
        </div>
      </MuiThemeProvider>
    );
  }

  handleSubmit() {
    let username = this.refs.username.getValue();
    let password = this.refs.password.getValue();
    let load = loadTips('登录中...');
    $.ajax({
      url: buildURL('sign', 'doLogin'),
      type: 'POST',
      dataType: 'json',
      data: {
        user: username,
        password: password,
      },
      timeout: 5000,
    })
    .done(function(data) {
      if (data.status == true) {
        this.state.Snackbar.open = true;
        this.state.Snackbar.message = '登录成功！';
        TS.MID = data.uid;
        this.setState(this.state);
        this.set = false;
        // this.context.router.push('/');
        window.location.href = buildURL('index', 'index');
      } else if (data.message.status == 2) {
        this.state.username.error = data.message.message;
        this.state.password.error = '';
      } else if (data.message.status == 3) {
        this.state.password.error = data.message.message;
        this.state.username.error = '';
      } else if (data.message.status == 1) {
        this.state.Snackbar.open = true;
        this.state.Snackbar.message = data.message.message;
        this.state.username.error = '';
        this.state.password.error = '';
      }
    }.bind(this))
    .fail(function() {
      this.state.Snackbar.open = true;
      this.state.Snackbar.message = '请求超时，请检查网络!';
    }.bind(this))
    .always(function() {
      load.hide();
      this.set === true && this.setState(this.state);
    }.bind(this));
  }
}

const styles = {
  root: {
    paddingTop: 50,
  },
  logoBox: {
    width: '100%',
    boxSizing: 'border-box',
    textAlign: 'center',
    paddingTop: 20,
  },
  logo: {
    height: 42,
  },
  loginButtom: {
    width: '100%',
    height: 42,
  }
}

UserSignUp.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default UserSignUp;