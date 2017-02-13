import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import List from 'material-ui/List/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import request from 'superagent';
import CommentItem from './comment-item.jsx';
import guid from './util/guid';
import Cache from './util/cache';

class CommentBox extends React.Component
{
	constructor(props) {
		super(props);

		this.feedId = 0;

    this.state = {
    	befores: props.before,
			comments: [],
		};
		this.scroll = true;
    this.max;
    this.min;
    this.scrollHandle;
	}

	componentDidMount() {
    this.scrollHandle = this.handleScroll.bind(this);
    document.addEventListener('scroll', this.scrollHandle);
		this.componentWillReceiveProps(this.props);
	}

  componentWillUnmount() {
    document.removeEventListener('scroll', this.scrollHandle);
  }

	componentWillReceiveProps(props) {
    this.props = props;
		this.cacheKeyName = 'feed-comment-'+props.feedId;

		if (Cache.hasItem(this.cacheKeyName)) {
			this.state.comments = Cache.getItem(this.cacheKeyName);
			this.state.befores = props.before;
      this.setMinHandle(this.state.comments);
			this.setState(this.state);
      this.scroll = true;
		} else if (this.feedId != props.feedId) {
      this.scroll = false;
			$.ajax({
				url: buildURL('comment', 'getList'),
				type: 'POST',
				dataType: 'json',
				data: {
					row_id: props.feedId,
					num: 10,
				},
			})
			.done(function(data) {
				this.state.befores = props.before;
				this.state.comments = this.state.comments.concat(data);
				this.feedId = props.feedId;
				Cache.setItem(this.cacheKeyName, this.state.comments);
        this.setMinHandle(this.state.comments);
			}.bind(this))
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				this.setState(this.state);
        this.scroll = true;
			}.bind(this));
		}

    document.body.scrollTop = 0;
	}

	render() {
		var feedId = this.props.feedId;

		return (
			<List>
				<Subheader>所有评论：</Subheader>
				{this.state.befores.map(function(comment) {
					return [
						(<CommentItem key={guid()} comment={comment} feedId={feedId} />),
						(<Divider inset={true} />)
					];
				})}
        {this.state.comments.map(function(comment, index) {
          return [
            (<CommentItem key={guid()} comment={comment} feedId={feedId} />),
            (<Divider inset={true} />)
          ];
        })}
        <div
          ref={'dataBox'}
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
			</List>
		);
	}

  setMaxHandle(datas) {
    if (datas[0]) {
      this.max = datas[0].comment_id;
    }
  }

  setMinHandle(datas) {
    let index = datas.length - 1;
    if (datas[index]) {
    this.min = datas[index].comment_id;
    }
  }

  handleScroll() {
    if (this.scroll == true) {
      let top = document.body.scrollTop + document.body.clientHeight;
      let height = document.body.scrollHeight;
      if (height == top || height - top < 10) {
        this.scroll = false;
        request
          .post(buildURL('comment', 'getList'))
          .field('row_id', this.props.feedId)
          .field('min_id', this.min)
          .field('num', 30)
          .end((error, ret) => {
            ret.body.forEach((comment) => {
              this.min = comment.comment_id;
              this.handleAppendCommentItem(comment, this.props.feedId);
            });
            this.scroll = true;
          })
        ;
      }
    }
  }

  handleAppendCommentItem(data, feedId) {
    let divDOM = document.createElement('div');
    divDOM.style.width = '100%';
    divDOM.style.height = 'auto';
    this.refs.dataBox.appendChild(divDOM);
    ReactDOM.render(
      (<MuiThemeProvider muiTheme={muiTheme}>
        <div
          style={{
            width: '100%',
            height: 'auto',
          }}
        >
          <CommentItem key={guid()} comment={data} feedId={feedId} />
          <Divider inset={true} />
        </div>
      </MuiThemeProvider>),
      divDOM
    );
  }

}

CommentBox.defaultProps = {
	feedId: 0,
	before: []
}

export default CommentBox;
