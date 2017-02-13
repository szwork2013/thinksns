import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import {
	IconButton,
	FlatButton,
	RaisedButton,
	FontIcon,
	TextField,
	Dialog
} from 'material-ui';

import AppBar from './AppBar.jsx';

const styles = {
	box: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		boxSizing: 'border-box',
		padding: '0 10px',
	},
	boxItem: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'nowrap',
	},
	fontIcon: {
		marginRight: '15px',
		color: '#757575',
	},
	root: {
		paddingTop: '50px',
	}
};

class UserSignIn extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			phone: {
				error: '',
				value: ''
			},
			code: {
				error: '',
				value: ''
			},
			username: {
				error: '',
				value: ''
			},
			password: {
				error: '',
				value: ''
			},
			pwd: {
				error: '',
				value: ''
			},
			dialog: {
				open: false,
				message: ''
			},
			codeButton:{
				text: '获取',
				disabled: true,
				interval: null,
				timeout: 60,
			}
		};
	}

	handleHasPhone(event) {
		this.state.phone.value = event.target.value;

		if (this.state.phone.value.match(/^\+?[0\s]*[\d]{0,4}[\-\s]?\d{4,12}$/)) {
			$.ajax({
				url: buildURL('sign', 'checkPhone'),
				type: 'POST',
				dataType: 'json',
				data: {phone: this.state.phone.value},
			})
			.done(function(data) {
				if (data.status != 1) {
					this.state.phone.error = data.message;
				} else {
					this.state.phone.error = '';
					this.state.codeButton.disabled = false;
				}
			}.bind(this))
			.fail(function() {
				this.state.dialog.open = true;
				this.state.dialog.message = '网络请求失败！';
				this.state.phone.error = '验证失败';
			}.bind(this))
			.always(function() {
				this.setState(this.state);
			}.bind(this));
		} else {
			this.state.phone.error = '请先输入正确的手机号码！';
			this.setState(this.state);
		}
	}

	handleDialogClose() {
		this.state.dialog.open = false;
		this.setState(this.state);
	}

	handleHasCode(event) {
		this.state.code.value = event.target.value;
		if (this.state.code.value.length < 4) {
			this.state.code.error = '请输入至少四位验证码！';
			this.setState(this.state);

		} else if(this.state.phone.error != '') {
			this.state.code.error = '请先输入正确的手机号码！';
			this.setState(this.state);

		} else {
			$.ajax({
				url: buildURL('sign', 'checkPhoneCode'),
				type: 'POST',
				dataType: 'json',
				data: {
					code: this.state.code.value,
					phone: this.state.phone.value
				},
			})
			.done(function(data) {
				if (data.status != 1) {
					this.state.code.error = data.message;
				} else {
					this.state.code.error = '';
				}
			}.bind(this))
			.fail(function() {
				this.state.dialog.open = true;
				this.state.dialog.message = '网络请求失败！';
				this.state.code.error = '验证失败';
			}.bind(this))
			.always(function() {
				this.setState(this.state);
			}.bind(this));
		}
	}

	handleSendPhoneCode(event) {

		if (!this.state.phone.value) {
			this.state.phone.error = '请输入您的手机号码！';

			this.setState(this.state);
		} else if (this.state.phone.error != '') {
			this.state.dialog.open = true;
			this.state.dialog.message = this.state.phone.error;

			this.setState(this.state);
		} else {
			var load = loadTips('正在获取...');
			$.ajax({
				url: buildURL('sign', 'sendPhoneCode', {'client_debuging': 1}),
				type: 'POST',
				dataType: 'json',
				data: {phone: this.state.phone.value},
			})
			.done(function(data) {
				if (data.status != 1) {
					this.state.dialog.open = true;
					this.state.dialog.message = data.message;
				} else {
					this.state.codeButton.disabled = true;
					this.state.codeButton.text = this.state.codeButton.timeout + 'S';

					clearInterval(this.state.codeButton.interval);
					this.state.codeButton.interval = setInterval(function() {
						this.state.codeButton.timeout -= 1;
						this.state.codeButton.text = this.state.codeButton.timeout + 'S';
						this.setState(this.state);
					}.bind(this), 1000);
				}
			}.bind(this))
			.fail(function() {
				this.state.dialog.open = true;
				this.state.dialog.message = '网络请求失败！';
				this.state.code.error = '获取验证码失败！';
			}.bind(this))
			.always(function() {
				load.hide();
				this.setState(this.state);
			}.bind(this));
		}
	}

	handleHasUserName(event) {
		this.state.username.value = event.target.value;

		/*if (!this.state.username.value) {
			this.state.username.error = '用户名不能为空！';

		} else */if (this.state.username.value.match(/^\d+/)) {
			this.state.username.error = '用户名不能是数字开头！';
			this.setState(this.state);

		} else {
			$.ajax({
				url: buildURL('sign', 'checkUserName'),
				type: 'POST',
				dataType: 'json',
				data: {username: this.state.username.value},
			})
			.done(function(data) {
				if (data.status != 1) {
					this.state.username.error = data.message;
				} else {
					this.state.username.error = '';
				}
			}.bind(this))
			.fail(function() {
				this.state.dialog.open = true;
				this.state.dialog.message = '网络请求失败！';
				this.state.username.error = '验证失败';
			}.bind(this))
			.always(function() {
				this.setState(this.state);
			}.bind(this));
		}
	}

	handelHasPassword(event) {
		this.state.password.value = event.target.value;

		if (!this.state.password.value.match(/^[a-zA-Z]\w{5,}$/)) {
			this.state.password.error = '密码必须大于6位且必须字母开头！';
		} else {
			this.state.password.error = '';
		}

		if (this.state.pwd.value == '') {
			this.state.pwd.error = '请输入你的密码确认！';
		} else if (this.state.pwd.value != this.state.password.value) {
			this.state.pwd.error = '两次输入的密码不一致！';
		} else {
			this.state.pwd.error = '';
		}

		this.setState(this.state);
	}

	handleHasPwd2(event) {
		this.state.pwd.value = event.target.value;

		if (this.state.pwd.value != this.state.password.value) {
			this.state.pwd.error = '两次输入的密码不一致！';
		} else {
			this.state.pwd.error = '';
		}

		this.setState(this.state);
	}

	handleSignInUser() {

		var map = [
			{key:'phone', value:'请输入手机号码！'}, 
			{key:'code', value:'请输入验证码！'}, 
			{key:'username', value:'用户名不能为空！'}, 
			{key:'password', value:'用户密码不能为空！'}, 
			{key:'pwd', value:'确认密码不能为空！'},
		];

		var ok = false;
		var data = {};

		for (var i in map) {
			if (this.state[map[i].key].value == '') {
				this.state[map[i].key].error = map[i].value;
				this.state.dialog.open = true;
				this.state.dialog.message = map[i].value;
				this.setState(this.state);
				ok = false;
				break;

			} else if (this.state[map[i].key].error != '') {
				this.state.dialog.open = true;
				this.state.dialog.message = this.state[map[i].key].error;
				this.setState(this.state);
				ok = false;
				break;
			} else {
				data[map[i].key] = this.state[map[i].key].value;
				ok = true;
			}
		}

		if (ok === true) {
			var load = loadTips('注册中...');
			$.ajax({
				url: buildURL('sign', 'signInUser'),
				type: 'POST',
				dataType: 'json',
				data: data,
			})
			.done(function(data) {
				if (data.status == 1) {
					this.context.router.push('/sign/up');
				} else if (data.type == 'dialog') {
					this.state.dialog.open = true;
					this.state.dialog.message = data.message;
					this.setState(this.state);
				} else {
					this.state[data.type].error = data.message;
					this.setState(this.state);
				}
			}.bind(this))
			.fail(function() {
				this.state.dialog.open = true;
				this.state.dialog.message = '网络请求失败！';
				this.setState(this.state);
			}.bind(this))
			.always(function() {
				load.hide();
			});
		}
	}

	componentDidUpdate() {
		if (this.state.codeButton.timeout <= 0) {
			clearInterval(this.state.codeButton.interval);
			this.state.codeButton.text = '获取';
			this.state.codeButton.timeout = 60;
			this.state.codeButton.disabled = false;

			this.setState(this.state);
		}
	}

	render() {
		appNode.style.display = 'block';
    $('.mdl-layout__container').hide();
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div style={styles.root}>
					<AppBar
						title={'注册'}
						iconElementLeft={<IconButton onTouchTap={goBack}><NavigationClose /></IconButton>}
						iconElementRight={<FlatButton label="注册" onTouchTap={this.handleSignInUser.bind(this)} />}
					/>
					<div style={styles.box}>
						<div style={styles.boxItem}>
							<FontIcon className="material-icons" style={styles.fontIcon}>phone</FontIcon>
							<TextField
								fullWidth={true}
								floatingLabelText="请输入手机号码"
								errorText={this.state.phone.error}
								onChange={this.handleHasPhone.bind(this)}
							/>
						</div>
						<div style={styles.boxItem}>
							<FontIcon className="material-icons" style={styles.fontIcon}>visibility</FontIcon>
							<TextField
								fullWidth={true}
								floatingLabelText="请输入验证码"
								errorText={this.state.code.error}
								onChange={this.handleHasCode.bind(this)}
							/>
							<RaisedButton
								label={this.state.codeButton.text}
								onTouchTap={this.handleSendPhoneCode.bind(this)}
								disabled={this.state.codeButton.disabled}
							/>
						</div>
						<div style={styles.boxItem}>
							<FontIcon className="material-icons" style={styles.fontIcon}>person</FontIcon>
							<TextField
								fullWidth={true}
								floatingLabelText="请设置你的用户名称"
								hintText="非数字开头的任意字符"
								errorText={this.state.username.error}
								onChange={this.handleHasUserName.bind(this)}
							/>
						</div>
						<div style={styles.boxItem}>
							<FontIcon className="material-icons" style={styles.fontIcon}>visibility_off</FontIcon>
							<TextField
								fullWidth={true}
								floatingLabelText="请设置你的账户密码"
								type="password"
								errorText={this.state.password.error}
								onChange={this.handelHasPassword.bind(this)}
							/>
						</div>
						<div style={styles.boxItem}>
							<FontIcon className="material-icons" style={styles.fontIcon}>visibility_off</FontIcon>
							<TextField
								fullWidth={true}
								floatingLabelText="确认你设置的密码"
								type="password"
								errorText={this.state.pwd.error}
								onChange={this.handleHasPwd2.bind(this)}
							/>
						</div>
					</div>
					<Dialog
						open={this.state.dialog.open}
						modal={false}
						actions={
							<FlatButton label="关闭" primary={true} onTouchTap={this.handleDialogClose.bind(this)} />
						}
					>
						{this.state.dialog.message}
					</Dialog>
				</div>
			</MuiThemeProvider>
		);
	}
}

UserSignIn.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default UserSignIn;