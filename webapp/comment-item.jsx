import React from 'react';
import {Link} from 'react-router';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import Expression from './util/expression';
import AtUser from './util/at-user';
import guid from './util/guid';

class CommentItem extends React.Component
{

	constructor(props) {
		super(props);
		this.state = {
			dialog: {
				open: false,
				floatingLabelText: '请输入评论内容！',
				error: '',
			},
			Snackbar: {
				open: false,
				message: '',
			}
		};
	}

	render() {
		let content = this.props.comment.content;
		content = this.formatExpression(content);
		content = this.formatAtUser(content);
		return (
			<ListItem
				leftAvatar={<Avatar src={this.props.comment.user.face} />}
				primaryText={
					<div style={styles.comment}>
						<span style={styles.username}>{this.props.comment.user.username}</span>
						<span style={styles.date}>{this.props.comment.time}</span>
					</div>
				}
				secondaryText={content}
				secondaryTextLines={2}
				rightIconButton={
					<IconButton onTouchTap={() => {
						this.state.dialog.open = true;
						this.setState(this.state);
					}}>
						<FontIcon className="material-icons" color={'#b2b2b2'}>reply</FontIcon>
					</IconButton>
				}
			>
				<Dialog
					open={this.state.dialog.open}
					title={'回复评论'}
					modal={false}
					autoScrollBodyContent={true}
					actions={[
						<FlatButton
							label={'关闭'}
							primary={true}
							onTouchTap={() => {
								this.state.dialog.open = false;
								this.state.dialog.error = '';
								this.state.dialog.floatingLabelText = '请输入评论内容！'
								this.setState(this.state);
							}}
						/>,
						<FlatButton
							label={'回复'}
							primary={true}
							keyboardFocused={true}
							onTouchTap={this.handleSendReply.bind(this)}
						/>
					]}
				>
					<TextField
						type={'text'}
						hintText={'评论内容不能大于140字符！'}
						floatingLabelText={this.state.dialog.floatingLabelText}
						errorText={this.state.dialog.error}
						fullWidth={true}
						multiLine={true}
						rows={2}
						rowsMax={4}
						underlineShow={false}
						ref={'postCommentTextField'}
						defaultValue={'回复@' + this.props.comment.user.username + '：'}
						onChange={() => {
							if (!this.refs.postCommentTextField.getValue()) {
								this.state.dialog.floatingLabelText = '请输入评论内容！';
							} else {
								this.state.dialog.floatingLabelText = '还可以输入' + (140 - this.refs.postCommentTextField.getValue().length) + '个字符！';
							}
							this.state.dialog.error = '';
							this.setState(this.state);
						}}
					/>
				</Dialog>
				<Snackbar
					open={this.state.Snackbar.open}
					message={this.state.Snackbar.message}
					autoHideDuration={1000}
					onRequestClose={() => {
						this.state.Snackbar.open = false;
						this.state.Snackbar.message = '';
						this.setState(this.state);
					}}
				/>
			</ListItem>
		);
	}

	formatAtUser(content) {
    return AtUser(content, (username) => {
      username = username.substr(1);
      return (<Link key={guid()} style={styles.link} to={'/user/' + username}>@{username}</Link>);
    });
  }

  formatExpression(content) {
    return Expression.buildDOM(content, (path) => (
      <img
        src={path}
        key={guid()}
        style={styles.expression}
      />
    ));
  }

	handleSendReply() {
		let content = this.refs.postCommentTextField.getValue();
		if (!content) {
			this.state.dialog.error = '评论内容不能为空！';
		} else if (content.length > 140) {
			this.state.dialog.error = '评论内容字符不能超过140个！';
		} else {
			this.state.dialog.error = '';
			this.state.dialog.open = false;
			let load = loadTips('发送中...');
			$.ajax({
				url: buildURL('comment', 'postFeedComment'),
				type: 'POST',
				dataType: 'json',
				data: {
					feed_id: this.props.feedId,
					to_cid: this.props.comment.comment_id,
					content: content
				},
			})
			.done(function(data) {
				if (data.status == true) {
					this.state.Snackbar.open = true;
					this.state.Snackbar.message = '回复成功！';
				} else {
					this.state.Snackbar.open = true;
					this.state.Snackbar.message = data.message;
				}
			}.bind(this))
			.fail(function() {
				this.state.Snackbar.open = true;
				this.state.Snackbar.message = '哎哟，好像忘了不给力哦！😫';
			}.bind(this))
			.always(function() {
				load.hide();
				this.setState(this.state);
			}.bind(this));
		}
		this.setState(this.state);
	}
}

CommentItem.defaultProps = {
	comment: {
		user: {
			uid: 0,
			username: '系统',
			face: 'http://thinksns.io/data/upload/2016/0512/12/5734012da6b354328c95_200_200.jpg'
		},
		time: '2016-05-21 12:00',
		comment_id: 0,
		content: '内容'
	},
	feedId: 0,
};

const styles = {
	expression: {
    width: 14,
    height: 14,
  },
  link: {
    color: '#0096e5',
    textDecoration: 'blink',
  },
  comment: {
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

export default CommentItem;
