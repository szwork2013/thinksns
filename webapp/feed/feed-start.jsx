import React, {Component} from 'react';
import CommonFeedList from './common-feed-list';

class FeedStart extends Component
{

  render() {
    return (<CommonFeedList
      uri={buildURL('feed', 'getFeedListToStart')}
      cacheKeyName={'home-start-init'}
      emptyMessage={'暂时没有关注内容哦！'}
    />);
  }
}

export default FeedStart;
