import React, {Component} from 'react';
import CommonFeedList from './common-feed-list';

class FeedRecommend extends Component
{

  render() {
    return (<CommonFeedList
      uri={buildURL('feed', 'getFeedListToRecomment')}
      cacheKeyName={'home-recommend-init'}
      emptyMessage={'暂时没有推荐数据'}
    />);
  }
}

export default FeedRecommend;
