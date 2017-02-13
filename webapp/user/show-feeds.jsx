import React, {Component} from 'react';
import CommonFeedList from '../feed/common-feed-list';

class ShowFeeds extends Component
{

  render() {
    if (this.props.uid <= 0) {
      return (<TipsEmpty message={this.props.emptyMessage} />);
    }
    return (<CommonFeedList
      uri={buildURL('user', 'feeds', {uid: this.props.uid})}
      cacheKeyName={'show-user-feeds-' + this.props.uid}
      emptyMessage={'暂时没有分享内容哦！'}
    />);
  }
}

export default ShowFeeds;