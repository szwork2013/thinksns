import React from 'react';
import { Route, Link, Redirect, IndexRedirect } from 'react-router';
import WeibaPostReader from './WeibaPostReader';
import ChannelPager from './channel-pager';
import ChannelReader from './channel-reader';
import TopicPager from './topic-pager';
import TopicReader from './topic-reader';
import UserSeting from './user-seting';
import UserShowList from './user-show-list';
import UserPhotoList from './user-photo-list';
import UserFeedList from './user-feed-list';
import UserInfo from './user-info';
import UserSignIn from './UserSignIn';

import Home from './feed/home';
import Find from './find';
import User from './user';
import Message from './message/message';
import Weiba from './weiba/weiba';

import FeedReader from './feed/reader';
import UserShow from './user/show';
import UserSignUp from './sign/up';
import FeedSend from './feed/send';
import MessageChat from './message/chat';
import WeibaIndex from './weiba/index';
import WeibaTops from './weiba/tops';
import WeibaAllBox from './weiba/weiba-all-box';
import WeibaReader from './weiba/weiba-reader';

import FeedAll from './feed/feed-all';
import FeedStart from './feed/feed-start';
import FeedChannel from './feed/feed-channel';
import FeedRecommend from './feed/feed-recommend';
import FeedComment from './feed/comment';

import history from '../app/src/util/history';

class NoMatch extends React.Component
{
	render() {
		return (
			<Link to="/">Go to home page!</Link>
		);
	}
}

window.router = history;
window.goBack = history.goBack;

const App = (
	<Route path="/">
		{/* 根 */}
		<IndexRedirect to="/home/all" />
		{/* 首页 */}
		<Route path={'/home'} component={Home}>
			<IndexRedirect to={'all'} />
			<Route path={'all'} component={FeedAll} />
			<Route path={'start'} component={FeedStart} />
			<Route path={'channel'} component={FeedChannel} />
			<Route path={'recommend'} component={FeedRecommend} />
		</Route>
		{/* 微吧 */}
		<Route path={'/weiba/post/:postId'} component={WeibaPostReader} />
		<Route path={'/weiba/all'} component={WeibaAllBox} />
		<Route path={'/weiba/reader/:weibaId'} component={WeibaReader} />
		<Route path={'/weiba'} component={Weiba} >
			<IndexRedirect to={'join'} />
			<Route path={'join'} component={WeibaIndex} />
			<Route path={'tops'} component={WeibaTops} />
		</Route>
		{/* 频道 */}
		<Route path={'/channel'} component={ChannelPager} />
		<Route path={'/channel/reader/:id'} component={ChannelReader} />
		{/* 话题 */}
		<Route path={'/topic'} component={TopicPager} />
		<Route path={'/topic/reader/:name'} component={TopicReader} />
		{/* 用户 */}
		<Route path={'/user'} component={User} />
		<Route path={'/user/seting'} component={UserSeting} />
		<Route path={'/user/photo/:uid'} component={UserPhotoList} />
		<Route path={'/user/feed'} component={UserFeedList} />
		<Route path={'/user/info/:uid'} component={UserInfo} />
		<Route path={'/user/more/:controller/:action/:userId(/:title)'} component={UserShowList} />
		<Route path={'/user/:user(/:type)'} component={UserShow} />
		{/* 分享 */}
		<Route path={'/feed/reader/:feedId'} component={FeedReader} />
		<Route path={'/feed/comment/:feedId(/:cid)'} component={FeedComment} />
		{/* 发现 */}
		<Route path={'/find'} component={Find} />
		{/* 消息 */}
		<Route path={'/message'} component={Message} />
		<Route path={'/chat/:roomId'} component={MessageChat} />
		{/* sign */}
		<Route path={'/sign/in'} component={UserSignIn} />
		<Route path={'/sign/up'} component={UserSignUp} />
		{/* 发布分享 */}
		<Route path={'/send(/:type/:data)'} component={FeedSend} />
		{/* 没有路由匹配页面 */}
		<Route path="*" component={NoMatch} />
	</Route>
);

export default App;