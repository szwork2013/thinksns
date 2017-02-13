import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import { Tabs, Tab } from 'material-ui/Tabs';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

import AppBar from './AppBar.jsx';

class ChannelPager extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			tabIndex: "探索频道",
			channel: {
				all: [],
				follows: []
			},
			dialog: {
				open: false,
				message: '',
			},
			snackbar: {
        open: false,
        message: '',
      }
		};
	}

	componentDidMount() {
		appNode.style.display = 'block';

		var load = loadTips('正在加载数据...');
		$.ajax({
			url: buildURL('channel', 'getAll'),
			type: 'GET',
			dataType: 'json',
		})
		.done(function(data) {
			this.state.channel = data;
			data = null;
		}.bind(this))
		.fail(function() {
			this.state.snackbar.open = true;
			this.state.snackbar.message = '初始化数据失败!';
		}.bind(this))
		.always(function() {
			load.hide();
			this.setState(this.state);
		}.bind(this));
	}

	handleTabChange(value) {
		this.state.tabIndex = value;
		this.setState(this.state);
	}

	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div style={styles.root}>
					<AppBar
						title="频道"
						iconElementLeft={
							<IconButton onTouchTap={goBack}>
								<FontIcon className="material-icons">chevron_left</FontIcon>
							</IconButton>
						}
					/>
					<Tabs
						value={this.state.tabIndex}
						onChange={this.handleTabChange.bind(this)}
						tabItemContainerStyle={styles.tabs.barBox}
						inkBarStyle={styles.tabs.inkBarStyle}
						contentContainerStyle={styles.tabs.barBox}
					>
						<Tab label="探索频道" value="探索频道" style={styles.tabs.barText} >
							<List>
								{this.state.channel.all.map(function(channel, key) {
									return ([
										<ListItem
											key={channel.id}
											leftAvatar={<Avatar>{channel.name[0]}</Avatar>}
											primaryText={channel.name}
											secondaryText={"已有" + channel.feedNum + "条分享！"}
											rightIconButton={
												<IconButton
													onTouchTap={this.handleFollow.bind(this, key, channel)}
												>
													<FontIcon
														className="material-icons"
														color={channel.followState
															? '#F44336'
															: '#03A9F4'
														}
													>
														{channel.followState
															? 'favorite'
															: 'favorite_border'
														}
													</FontIcon>
												</IconButton>
											}
											onTouchTap={() => {
												if (channel.feedNum > 0) {
													this.context.router.push('/channel/reader/' + channel.id);
												} else {
													this.state.snackbar.open = true;
													this.state.snackbar.message = '该频道没有分享内容！';
													this.setState(this.state);
												}
											}}
										/>,
										<Divider inset={true} />
									]);
								}.bind(this))}
							</List>
						</Tab>
						<Tab label="已经关注频道" value="已经关注频道" style={styles.tabs.barText} >
							<List>
								{this.state.channel.follows.map(function(channel) {
									return ([
										<ListItem
											leftAvatar={<Avatar>{channel.name[0]}</Avatar>}
											primaryText={channel.name}
											secondaryText={"已有" + channel.feedNum + "条分享！"}
											rightIcon={<FontIcon className="material-icons">chevron_right</FontIcon>}
											onTouchTap={() => {
												if (channel.feedNum > 0) {
													this.context.router.push('/channel/reader/' + channel.id);
												} else {
													this.state.snackbar.open = true;
													this.state.snackbar.message = '该频道没有分享内容！';
													this.setState(this.state);
												}
											}}
										/>,
										<Divider inset={true} />
									]);
								}.bind(this))}
							</List>
						</Tab>
					</Tabs>
					<Dialog
						open={this.state.dialog.open}
						modal={false}
						actions={[
							(<FlatButton label="重试" primary={true} />),
							(<FlatButton label="关闭" primary={true} />)
						]}
					>
						{this.state.dialog.message}
					</Dialog>
					<Snackbar
            open={this.state.snackbar.open}
            message={this.state.snackbar.message}
            autoHideDuration={1500}
            onRequestClose={() => {
              this.state.snackbar.open = false;
              this.setState(this.state);
            }}
          />
				</div>
			</MuiThemeProvider>
		);
	}

	handleFollow(key, channel) {
		let url = buildURL('channel', 'follow');
		if (channel.followState == true) {
			url = buildURL('channel', 'unFollow');
		}
		
		let load = loadTips('操作中...');
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: {channel_id: channel.id},
		})
		.done(function(data) {
			if (data.status == true) {
				channel.followState = !channel.followState;
				this.state.channel.all[key] = channel;
			}
			this.state.snackbar.open = true;
			this.state.snackbar.message = data.message;
		}.bind(this))
		.fail(function() {
			this.state.snackbar.open = true;
			this.state.snackbar.message = '网络好像出了点问题哦！';
		}.bind(this))
		.always(function() {
			load.hide();
			this.setState(this.state);
		}.bind(this));
	}
}

ChannelPager.contextTypes = {
    router: React.PropTypes.object.isRequired
};

const styles = {
	root: {
		paddingTop: '50px',
	},
	tabs: {
		barBox: {
			backgroundColor: '#fff',
		},
		barText: {
			color: '#555',
		},
		inkBarStyle: {
			backgroundColor: '#0096e5',
		}
	},
	item: {
		backgroundColor: '#fff',
	}
};

export default ChannelPager;
