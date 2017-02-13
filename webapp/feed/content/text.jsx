import React, {Component} from 'react';
import Expression from '../../util/expression';
import AtUser from '../../util/at-user';
import formatURL2DOM from '../../util/formatURL2DOM';
import TagBuild2DOM from '../../util/tag';
import guid from '../../util/guid';
import Link from '../../util/link';

class FeedContentText extends Component
{
  render() {
    let content = formatURL2DOM(this.props.content, (url) => (
      <a key={guid()} style={styles.link} href={url} target={'_blank'}>访问链接+</a>
    ));
    content = this.formatExpression(content);
    content = this.formatAtUser(content);
    content = this.formatTag(content);
    return (
      <div
        style={styles.root}
        onTouchTap={(event) => {
          if (event.target.tagName != 'A') {
            window.router.push('/feed/reader/' + this.props.feedId);
          }
        }}
      >
        {content}
      </div>
    );
  }

  formatTag(content) {
    return TagBuild2DOM(content, (tag) => (
      <Link key={guid()} style={styles.link} to={'/topic/reader/' + tag.split('#')[1]}>{tag}</Link>
    ));
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

}

const styles = {
  root: {
    fontSize: 16,
    paddingLeft: 12,
    paddingRight: 12,
    lineHeight: 1.6,
    letterSpacing: 0.5,
    fontWeight: 300,
    wordWrap: 'break-word',
  },
  expression: {
    width: 14,
    height: 14,
  },
  link: {
    color: '#0096e5',
    textDecoration: 'blink',
  }
}

export default FeedContentText;
