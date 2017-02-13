import React, {Component} from 'react';
import request from 'superagent';
import FlatButton from 'material-ui/FlatButton';
import guid from '../util/guid';

import MapsRateReview from 'material-ui/svg-icons/maps/rate-review';
import ActionVisibility from 'material-ui/svg-icons/action/visibility';

class Posts extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    }
  }

  componentDidMount() {
    request
      .post(buildURL('weiba', 'getPostList'))
      .field('recommend', this.props.recommend ? 1 : 0)
      .field('num', this.props.num)
      .field('weiba_id', this.props.weibaId || 0)
      .end((error, ret) => {
        if (error) {
        } else {
          this.state.posts = ret.body;
          this.setState(this.state);
        }
      })
    ;
  }

  render() {
    if (this.state.posts.length <= 0) {
      return <TipsEmpty />;
    }
    return (
      <div ref={'weibaListBox'} style={styles.root}>
        {this.state.posts.map((post) => {
          return (
            <div key={guid()} style={styles.itemBox}>
              <div style={styles.itemHeader} onTouchTap={this.handleGoToPost.bind(this, post.post_id)}>{post.title}</div>
              <div style={styles.itemBody} onTouchTap={this.handleGoToPost.bind(this, post.post_id)} dangerouslySetInnerHTML={{__html: post.content}} />
              <div style={styles.itemFooter}>
                <span style={styles.footerUser} onTouchTap={this.handleGoToUser.bind(this, post.username)}>{post.username} {post.time}</span>
                <FlatButton
                  style={{
                    color: '#b2b2b2',
                    minWidth: 70,
                    width: 70,
                  }}
                  labelStyle={{
                    display: 'inline-block',
                    boxSizing: 'border-box',
                    minWidth: 33,
                    paddingRight: 0,
                  }}
                  icon={<MapsRateReview />}
                  label={post.reply || '0'}
                  onTouchTap={this.handleGoToPost.bind(this, post.post_id)}
                />
                <FlatButton
                  style={{
                    color: '#b2b2b2',
                  }}
                  icon={<ActionVisibility />}
                  label={post.read || '0'}
                  onTouchTap={this.handleGoToPost.bind(this, post.post_id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  handleGoToPost(postId) {
    this.context.router.push(`/weiba/post/${postId}`);
  }

  handleGoToUser(username) {
    this.context.router.push(`/user/${username}`);
  }
}
  
const styles = {
  root: {
    width: '100%',
    height: 'auto',
  },
  itemBox: {
    boxSizing: 'border-box',
    width: '100%',
    height: 'auto',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingRight: 12,
    paddingBottom: 0,
    paddingLeft: 12,
    marginTop: 12,
  },
  itemHeader: {
    paddingBottom: 6,
    fontSize: 20,
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: '0.02em',
  },
  itemBody: {
    fontSize: 14,
    fontWeight: 300,
    letterSpacing: 0,
  },
  itemFooter: {
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    color: '#9e9e9e',
  },
  footerUser: {
    flexGrow: 1,
  }
}

Posts.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default Posts;