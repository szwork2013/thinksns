import React, {Component} from 'react';
import CommonFeedList from './common-feed-list';

class FeedAll extends Component
{

  render() {
    return (<CommonFeedList
      uri={buildURL('feed', 'getFeedListToAll')}
      cacheKeyName={'home-all-init'}
      emptyMessage={'暂时没有分享内容哦！'}
    />);
  }
}

export default FeedAll;

