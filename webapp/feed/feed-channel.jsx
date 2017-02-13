import React, {Component} from 'react';
import CommonFeedList from './common-feed-list';

class FeedChannel extends Component
{

  render() {
    return (<CommonFeedList
      uri={buildURL('feed', 'getFeedListToChannel')}
      cacheKeyName={'home-channel-init'}
      emptyMessage={'暂时没有频道内容哦！'}
    />);
  }
}

export default FeedChannel;


