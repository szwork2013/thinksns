import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { List, ListItem } from 'material-ui/List';
import {
	Dialog,
	FlatButton,
	FontIcon,
	IconButton,
	IconMenu,
	MenuItem,
	Divider,
	Avatar,
	Subheader,
} from 'material-ui';
import TextField from 'material-ui/TextField';
import AppBar from './AppBar.jsx';
import CommentBox from './comment-box.jsx';

class WeibaPostReader extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			commentBefore: [],
			weiba: {
				'id': 0,
				name: '',
				follerStatus: false,
				logo: '',
			},
			post: {
				title: '',
				content: '',
				id: 0,
				postDate: '',
				feed_id: 0,
				diggStatus: false,
			},
			user: {},
			comments: [],
			dialog: {
				open: false,
				message: '',
			},
			weibaDialogOpen: false,
			postDiggOpen: false,
			postCommentOpen: false,
			comment: {
				error: '',
				floatingLabelText: '请输入评论内容',
			}
		};
		this.state.post.id = props.params.postId;
		this.commentContent = '';
	}

	componentDidMount() {
		this.updatePostData();
		// console.log(History.push('/demo'));
	}

	componentWillReceiveProps(props) {
		this.props = props;
		this.updatePostData();
	}

	updatePostData() {
		var load = loadTips('正在加载基础数据...');
		$.ajax({
			url: buildURL('weiba', 'postReader'),
			type: 'POST',
			dataType: 'json',
			data: {post_id: this.props.params.postId},
		})
		.done(function(data) {
			if (data.status != 1) {
				this.state.dialog.open = true;
				this.state.dialog.message = data.message
			} else {
				this.state.weiba = data.weiba;
				this.state.post = data.post;
				this.state.user = data.user;
			}
		}.bind(this))
		.fail(function() {
			this.state.dialog.open = true;
			this.state.dialog.message = '网络错误！';
		}.bind(this))
		.always(function() {
			load.hide();
			this.setState(this.state);
		}.bind(this));

		appNode.style.display = 'block';
		appNode.style.height = '100%';
	}

	render() {
		// console.log(this.state.commentBefore);
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div style={styles.root}>
					<AppBar
						title={this.state.post.title}
						iconElementLeft={
							<IconButton onTouchTap={goBack}>
								<FontIcon className="material-icons">chevron_left</FontIcon>
							</IconButton>
						}
						iconElementRight={
							<IconMenu
								iconButtonElement={
									<IconButton>
										<FontIcon className="material-icons">more_horiz</FontIcon>
									</IconButton>
								}
								targetOrigin={{horizontal: 'right', vertical: 'top'}}
						        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
							>
								<MenuItem
									primaryText="评论"
									leftIcon={
										<FontIcon className="material-icons">border_color</FontIcon>
									}
									onTouchTap={() => {
										this.state.postCommentOpen = true;
										this.setState(this.state);
									}}
								/>
								<Divider />
								<MenuItem
									primaryText={this.state.post.diggStatus == false ? '喜欢' : '取消喜欢'}
									leftIcon={
										<FontIcon className="material-icons">{this.state.post.diggStatus == false ? 'favorite_border' : 'favorite'}</FontIcon>
									}
									onTouchTap={this.handlePostDigg.bind(this)}
								/>
							</IconMenu>
						}
					/>
					<Dialog
						open={this.state.dialog.open}
						modal={false}
						actions={
							<FlatButton label="关闭" primary={true} onTouchTap={this.handleDialogClose.bind(this)} />
						}
					>
						{this.state.dialog.message}
					</Dialog>
					<div style={styles.body}>
						<div>
							<List>
								<ListItem
									leftAvatar={
										<Avatar
											src={this.state.user.face}
											size={40}
										/>
									}
									disabled={true}
									primaryText={
										<div style={styles.userheader}>
											<span style={styles.username}>{this.state.user.username}</span>
											<span style={styles.date}>{this.state.post.postDate}</span>
										</div>
									}
									secondaryText={this.state.weiba.name}
								/>
							</List>
							<Subheader style={{fontSize: '18px', color: '#333'}}>{this.state.post.title}</Subheader>
							<div dangerouslySetInnerHTML={{__html: this.state.post.content}}></div>

							<div
								style={styles.weiba}
							>
								<div
									style={styles.weibaLogo}
								>
									<img src={this.state.weiba.logo} style={styles.weibaLogoImg} />
								</div>
								<div style={styles.weibaInfo}>
									<div style={styles.weibaName}>{this.state.weiba.name}</div>
									<div style={styles.weibaMore}>
										成员&nbsp;{this.state.weiba.userNum}&nbsp;&nbsp;&nbsp;帖子&nbsp;{this.state.weiba.threadNum}
									</div>
								</div>
								<div style={styles.weibaLine}>
									<span style={styles.weibaLineSpan} />
								</div>
								<div
									style={styles.weibaFollow}
									onTouchTap={this.handleWeibaFollow.bind(this)}
								>
									{this.state.weiba.followStatus ? '已关注': '＋关注'}
								</div>
							</div>
							<CommentBox feedId={this.state.post.feed_id} before={this.state.commentBefore} />
						</div>
					</div>
					<Dialog
						open={this.state.weibaDialogOpen}
						modal={false}
						actions={[
							<FlatButton label="关闭" primary={true} onTouchTap={() => {
								this.state.weibaDialogOpen = false;
								this.setState(this.state);
							}} />,
							<FlatButton
								label="取消关注"
								primary={true}
								keyboardFocused={true}
								onTouchTap={this.handleWeibaUnFollow.bind(this)}
							/>
						]}	
					>
						是否取消关注“{this.state.weiba.name}”?
					</Dialog>
					<Dialog
						open={this.state.postDiggOpen}
						modal={false}
						actions={[
							<FlatButton
								label={'关闭'}
								primary={true}
								onTouchTap={() => {
									this.state.postDiggOpen = false;
									this.setState(this.state);
								}}
							/>,
							<FlatButton
								label={'取消喜欢'}
								primary={true}
								keyboardFocused={true}
								onTouchTap={this.handleRemovePostDigg.bind(this)}
							/>
						]}
					>
						是否要取消喜欢该帖子？
					</Dialog>
					<Dialog
						open={this.state.postCommentOpen}
						modal={false}
						autoScrollBodyContent={true}
						title={'评论帖子'}
						actions={[
							<FlatButton
								label={'关闭'}
								primary={true}
								onTouchTap={() => {
									this.state.comment.floatingLabelText = '请输入评论内容！';
									this.state.postCommentOpen = false;
									this.setState(this.state);
								}}
							/>,
							// <IconButton>
							// 	<ContentSend />
							// </IconButton>
							<FlatButton
								label={'评论'}
								primary={true}
								keyboardFocused={true}
								onTouchTap={this.handleSendPostComment.bind(this)}
							/>
						]}
					>
						<TextField
							type={'text'}
							hintText={'评论内容不能大于140字符！'}
							floatingLabelText={this.state.comment.floatingLabelText}
							fullWidth={true}
							multiLine={true}
							rows={2}
							rowsMax={4}
							underlineShow={false}
							ref={'postCommentTextField'}
							errorText={this.state.comment.error}
							onChange={() => {
								this.commentContent = this.refs.postCommentTextField.getValue();
								if (!this.commentContent) {
									this.state.comment.floatingLabelText = '请输入评论内容！';
								} else {
									this.state.comment.floatingLabelText = '还可以输入' + (140 -this.commentContent.length) + '字符！';
								}
								this.state.comment.error = '';
								this.setState(this.state);
							}}
						/>
					</Dialog>
				</div>
			</MuiThemeProvider>
		);
	}

	handleSendPostComment() {
		this.commentContent = this.refs.postCommentTextField.getValue();
		if (!this.commentContent) {
			this.state.comment.error = '请输入评论内容!';
		} else if (this.commentContent.length > 140) {
			this.state.comment.error = '评论内容超过140字符!';
		} else {
			this.state.postCommentOpen = false;
			let load = loadTips('发送评论中...');
			$.ajax({
				url: buildURL('post', 'addComment'),
				type: 'POST',
				dataType: 'json',
				data: {
					post_id: this.state.post.id,
					content: this.commentContent,
				},
			})
			.done(function(data) {
				if (data.status == true) {
					this.state.dialog.open = false;
					let comment = {
						user: {
							uid: TS.UID,
							username: TS.USER_NAME,
							face: TS.FACE.avatar_big
						},
						comment_id: data.commentId,
						content: this.commentContent,
						time: data.time
					};
					this.state.commentBefore.unshift(comment);
				} else {
					this.state.dialog.open = true;
					this.state.dialog.message = data.message;
				}
			}.bind(this))
			.fail(function() {
				this.state.dialog.open = true;
				this.state.dialog.message = '网络貌似有点问题！！！';
			}.bind(this))
			.always(function() {
				load.hide();
				this.setState(this.state);
			}.bind(this));
		}
		this.setState(this.state);
	}

	handleRemovePostDigg() {
		this.state.postDiggOpen = false;
		this.setState(this.state);

		var load = loadTips('正在取消喜欢...');
		$.ajax({
			url: buildURL('post', 'removeDigg'),
			type: 'POST',
			dataType: 'json',
			data: {id: this.state.post.id},
		})
		.done(function(data) {
			if (data.status == true) {
				this.state.post.diggStatus = false;
			} else {
				this.state.dialog.open = true;
				this.state.dialog.message = data.message;
			}
		}.bind(this))
		.fail(function() {
			this.state.dialog.open = true;
			this.state.dialog.message = '网络貌似有点问题！！！';
		}.bind(this))
		.always(function() {
			load.hide();
			this.setState(this.state);
		}.bind(this));
		
	}

	handlePostDigg() {
		if (this.state.post.diggStatus == true) {
			this.state.postDiggOpen = true;
			this.setState(this.state);
		} else {
			let load = loadTips('请稍等...');
			$.ajax({
				url: buildURL('post', 'addDigg'),
				type: 'POST',
				dataType: 'json',
				data: {id: this.state.post.id},
			})
			.done(function(data) {
				if (data.status == true) {
					this.state.post.diggStatus = true;
				} else {
					this.state.dialog.open = true;
					this.state.dialog.message = data.message;
				}
			}.bind(this))
			.fail(function() {
				this.state.dialog.open = true;
				this.state.dialog.message = '网络貌似有点问题！！！';
			}.bind(this))
			.always(function() {
				load.hide();
				this.setState(this.state);
			}.bind(this));
			
		}
	}

	handleWeibaFollow() {
		if (this.state.weiba.followStatus == true) {
			this.state.weibaDialogOpen = true;
			this.setState(this.state);
		} else {
			var load = loadTips('正在关注...');
			$.ajax({
				url: buildURL('weiba', 'weibaFollow'),
				type: 'POST',
				dataType: 'json',
				data: {weiba_id: this.state.weiba.id},
			})
			.done(function(data) {
				if (data.status == true) {
					this.state.weiba.followStatus = true;
				} else {
					this.state.dialog.open = true;
					this.state.dialog.message = data.message;
				}
			}.bind(this))
			.fail(function() {
				this.state.dialog.open = true;
				this.state.dialog.message = '关注微吧“' + this.state.weiba.name + '”失败！';
			}.bind(this))
			.always(function() {
				load.hide();
				this.setState(this.state);
			}.bind(this));
		}
	}

	handleWeibaUnFollow() {
		var load = loadTips('正在取消关注...');
		this.state.weibaDialogOpen = false;
		this.setState(this.state);
		$.ajax({
			url: buildURL('weiba', 'weibaUnFollow'),
			type: 'POST',
			dataType: 'json',
			data: {weiba_id	: this.state.weiba.id},
		})
		.done(function(data) {
			if (data.status == true) {
				this.state.weiba.followStatus = false;
			} else {
				this.state.dialog.open = true;
				this.state.dialog.message = data.message;
			}
		}.bind(this))
		.fail(function() {
			this.state.dialog.open = true;
			this.state.dialog.message = '取消关注微吧“' + this.state.weiba.name + '”失败！请检查网络。';
		}.bind(this))
		.always(function() {
			load.hide();
			this.setState(this.state);
		}.bind(this));
	}

	handleDialogClose() {
		this.state.dialog.open = false;
		this.setState(this.state);
	}
}

const styles = {
	root: {
		display: 'flex',
		width: '100%',
		height: '100%',
		paddingTop: 50,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		backgroundColor: '#fff',
	},
	body: {
		flexGrow: 1,
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		overflowY: 'scroll',
		boxSizing: 'border-box',
		padding: '0 10px 5px 10px',
		WebkitOverflowScrolling: 'touch'
	},
	weiba: {
    boxSizing: 'border-box',
    display: 'flex',
    width: '100%',
    height: 80,
    marginTop: 6,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #ebebeb',
    overflow: 'hidden',
	},
	weibaLogo: {
		boxSizing: 'border-box',
		width: 54,
		minWidth: 54,
		height: 54,
		overflow: 'hidden',
	},
	weibaLogoImg: {
		width: '100%',
	},
	weibaLine: {
    boxSizing: 'border-box',
    width: '1px',
    minWidth: '1px',
    height: '100%',
    paddingTop: 12,
    paddingBottom: 12,
	},
	weibaLineSpan: {
		display: 'inline-block',
		width: '100%',
		height: '100%',
		backgroundColor: '#b2b2b2',
	},
	weibaFollow: {
    minWidth: 62,
    textAlign: 'right',
	},
	weibaInfo: {
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    paddingLeft: 12,
    paddingRight: 12,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
	},
	weibaName: {
    width: '100%',
    height: 30,
    lineHeight: '30px',
    fontSize: 24,
    fontWeight: 300,
    color: '#444',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
	},
	weibaMore: {
    display: 'inline-flex',
    width: '100%',
    height: 24,
    alignItems: 'flex-end',
    fontSize: 12,
    color: '#b3b3b3',
	},
	userheader: {
  	display: 'flex',
  	width: '100%',
  	flexDirection: 'row',
  	justifyContent: 'space-between',
  },
  username: {
    boxSizing: 'border-box',
    flexGrow: 1,
    paddingRight: 12,
    fontSize: 18,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  date: {
    whiteSpace: 'nowrap',
    fontSize: 12,
    fontWeight: 200,
  }

};

export default WeibaPostReader;
