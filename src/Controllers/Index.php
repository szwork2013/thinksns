<?php

namespace App\H5\Controller;

use App\H5\Common;
use App\H5\Base\Controller;
use App\H5\Model;
use App\H5\Model\Feed;
use App\H5\Model\Channel;

/**
 * 入口首页 - 分享.
 *
 * @author Seven Du <lovevipdsw@vip.qq.com>
 **/
class Index extends Controller
{
    // 加载类型
    const LOAD_TYPE_NEW = 'new';
    const LOAD_TYPE_LOW = 'low';

    /**
     * 获取列表数据每页的条数.
     *
     * @var int
     */
    protected static $pageLimit = 15;

    /**
     * 数据查询的排序方式.
     *
     * @var string
     */
    protected static $orderType = 'desc';

    /**
     * 分享列表.
     *
     * @author Seven Du <lovevipdsw@vp.qq.com>
     **/
    public function indexAction()
    {
        $this
            ->setTitle('首页 - 分享列表')
            ->display();
    }

    public function readAction()
    {
        $id = Common::getInput('id');
        // $id = 30;
        $feedList = Feed::where('feed_id', '=', $id)
            ->where('is_del', '=', 0)
            ->where('is_audit', '=', 1)
            ->get();

        if (!count($feedList)) {
            $this->error('您访问的分享不存在或者已经被删除!');
        }

        $data = array();

        foreach ($feedList as $feed) {
            $_data = $feed->toArray();

            $_data['time'] = date('y-m-d H:i', $feed->publish_time);
            $_data['username'] = $feed->user->uname;
            $_data['userface'] = $feed->user->face->avatar_middle;
            $_data['groupicon'] = $feed->user->group->info->icon;
            $_data['digg_feed_status'] = $feed->diggFeedStatus($this->mid);
            $_data['user_follow'] = $feed->user->followStatus($this->mid);
            $_data['digg_users'] = $feed->diggs()->take(4)->get();

            /* 收藏状态 */
            $_data['star_status'] = Model\Collection::byTable('feed')->BySid($feed->feed_id)->byUser($this->mid)->first();
            $_data['star_status'] = $_data['star_status'] ? 'true' : 'false';

            $_data = array_merge($_data, (array) $feed->{$feed->type});

            unset($_data['data'], $_data['user'], $_data['digg']);

            array_push($data, $_data);
        }

        // var_dump($_data);exit;

        $this
            ->trace('feed', $data)
            ->setTitle('分享详情')
            ->display()
        ;
    }

    /**
     * 异步获取分享全部类型列表.
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-22T11:04:55+0800
     * @homepage http://medz.cn
     */
    public function getFeedListAction()
    {
        $uid = Common::getInput('uid');
        $data = array();
        $orderType = 'desc';

        $feedList = Feed::where(function ($query) use ($uid, &$orderType) {
            if (Common::getInput('id') > 0) {
                if (strtolower(Common::getInput('type')) == 'new') {
                    $query
                        ->where('feed_id', '>', Common::getInput('id'))
                    ;
                    $orderType = 'asc';
                } else {
                    $query
                        ->where('feed_id', '<', Common::getInput('id'))
                    ;
                    $orderType = 'desc';
                }
            }

            if ($uid) {
                $query->where('uid', '=', $uid);
            }

            $query->where('is_del', '=', 0);
            $query->where('is_audit', '=', 1);
        })
            ->whereIn('type', array('post', 'postvideo', 'weiba_post', 'repost', 'postfile', 'postimage'))
            ->take(static::$pageLimit)
            ->orderBy('feed_id', $orderType)
            ->select(array('feed_id', 'type', 'app', 'from', 'publish_time as time', 'digg_count', 'comment_count', 'latitude', 'longitude', 'address', 'uid', 'app_row_id'))
            ->get()
            // ->toSql()
        ;

        // var_dump($feedList);exit;
        // 延迟加载
        $feedList->load('data', 'user', 'user.group');

        foreach ($feedList as $feed) {
            $_data = $feed->toArray();

            $_data['time'] = date('y-m-d H:i', $feed->time);
            $_data['username'] = $feed->user->uname;
            $_data['userface'] = $feed->user->face->avatar_middle;
            $_data['groupicon'] = $feed->user->group->info->icon;
            $_data['digg_feed_status'] = $feed->diggFeedStatus($this->mid);
            $_data['user_follow'] = $feed->user->followStatus($this->mid);

            $_data = array_merge($_data, (array) $feed->{$feed->type});
            $_data['content'] = mb_substr($_data['content'], 0, 255);

            unset($_data['data'], $_data['user']);

            array_push($data, $_data);
        }

        unset($feedList, $_data);

        $this->__json__($data);
    }

    /**
     * 获取关注的人的微博列表.
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-26T18:48:51+0800
     * @homepage http://medz.cn
     */
    public function getStrtFeedListAction()
    {
        list($type, $id) = Common::getInput(array('type', 'id'));
        $uid = $this->mid;
        $orderType = 'desc';

        $feedList = Feed::leftJoin('user_follow', function ($join) {
            $join
                ->on('feed.uid', '=', 'user_follow.fid')
            ;
        })
            ->where(function ($query) use ($uid, $type, $id, &$orderType) {
                $query
                    ->where('user_follow.uid', '=', $uid)
                    ->where('feed.is_del', '=', 0)
                    ->where('feed.is_audit', '=', 1)
                ;

                if ($id > 0) {
                    if (strtolower($type) == 'new') {
                        $query
                            ->where('feed.feed_id', '>', $id)
                        ;
                        $orderType = 'asc';
                    } else {
                        $query
                            ->where('feed.feed_id', '<', $id)
                        ;
                        $orderType = 'desc';
                    }
                }
            })
            ->whereIn('type', array('post', 'postvideo', 'weiba_post', 'repost', 'postfile', 'postimage'))
            ->take(static::$pageLimit)
            ->orderBy('feed.feed_id', $orderType)
            ->select(array('feed.*'))
            ->get()
        ;

        // 延迟加载
        $feedList->load('data', 'user', 'user.group');
        $data = array();

        foreach ($feedList as $feed) {
            $_data = $feed->toArray();

            $_data['time'] = date('y-m-d H:i', $feed->publish_time);
            $_data['username'] = $feed->user->uname;
            $_data['userface'] = $feed->user->face->avatar_middle;
            $_data['groupicon'] = $feed->user->group->info->icon;
            $_data['digg_feed_status'] = $feed->diggFeedStatus($this->mid);
            $_data['user_follow'] = $feed->user->followStatus($this->mid);

            $_data = array_merge($_data, (array) $feed->{$feed->type});

            $_data['content'] = mb_substr($_data['content'], 0, 255);

            unset($_data['data'], $_data['user'], $_data['is_recommend'], $_data['recommend_time'], $_data['is_repost'], $_data['is_audit'], $_data['publish_time']);

            array_push($data, $_data);
        }

        unset($feedList, $_data);

        $this->__json__($data);
    }

    /**
     * 获取频道分享列表.
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-30T18:05:17+0800
     * @homepage http://medz.cn
     */
    public function getChannelFeedListAction()
    {
        list($id, $type) = Common::getInput('id', 'type');
        $orderType = 'desc';

        $feedList = Feed::leftJoin('channel', function ($join) {
            $join
                ->on('channel.feed_id', '=', 'feed.feed_id')
            ;
        })
            ->join('channel_category', function ($join) {
                $join
                    ->on('channel.channel_category_id', '=', 'channel_category.channel_category_id')
                ;
            })
            ->where(function ($query) {
                $query
                    ->where('channel.status', '=', 1)
                    ->where('feed.is_del', '=', 0)
                    ->where('feed.is_audit', '=', 1)
                ;
            })
            ->where(function ($query) use ($id, $type, &$orderType) {
                if ($id > 0) {
                    if (strtolower($type) == 'new') {
                        $query
                            ->where('feed.feed_id', '>', $id)
                        ;
                        $orderType = 'asc';
                    } else {
                        $query
                            ->where('feed.feed_id', '<', $id)
                        ;
                        $orderType = 'desc';
                    }
                }
            })
            ->whereIn('type', array('post', 'postvideo', 'weiba_post', 'repost', 'postfile', 'postimage'))
            ->take(static::$pageLimit)
            ->orderBy('feed.feed_id', $orderType)
            ->select(array('feed.*', 'channel_category.title as from'))
            ->get()
        ;

        $feedList->load('data', 'user', 'user.group');

        $data = array();

        foreach ($feedList as $feed) {
            $_data = $feed->toArray();

            $_data['time'] = date('y-m-d H:i', $feed->publish_time);
            $_data['username'] = $feed->user->uname;
            $_data['userface'] = $feed->user->face->avatar_middle;
            $_data['groupicon'] = $feed->user->group->info->icon;
            $_data['digg_feed_status'] = $feed->diggFeedStatus($this->mid);
            $_data['user_follow'] = $feed->user->followStatus($this->mid);

            $_data = array_merge($_data, (array) $feed->{$feed->type});
            $_data['content'] = mb_substr($_data['content'], 0, 255);

            unset($_data['data'], $_data['user'], $_data['is_recommend'], $_data['recommend_time'], $_data['is_repost'], $_data['is_audit'], $_data['publish_time']);

            array_push($data, $_data);
        }

        unset($feedList, $_data);

        $this->__json__($data);
    }

    /**
     * 获取推荐分享列表.
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-30T19:07:58+0800
     * @homepage http://medz.cn
     */
    public function getRecommentFeedListAction()
    {
        list($id, $type) = Common::getInput(array('id', 'type'));
        $orderType = 'desc';

        $feedList = Feed::where(function ($query) use ($id, $type, &$orderType) {
            if ($id > 0) {
                if (strtolower($type) == static::LOAD_TYPE_NEW) {
                    $query
                        ->where('feed.feed_id', '>', $id)
                    ;
                    $orderType = 'asc';
                } else {
                    $query
                        ->where('feed.feed_id', '<', $id)
                    ;
                    $orderType = 'desc';
                }
            }
        })
            ->where(function ($query) {
                $query
                    // ->where('is_recommend', '=', 1)
                    ->where('is_del', '=', 0)
                    ->where('is_audit', '=', 1)
                ;
            })
            ->whereIn('type', array('post', 'postvideo', 'weiba_post', 'repost', 'postfile', 'postimage'))
            ->join('feed_top', function ($query) {
                $query->on('feed.feed_id', '=', 'feed_top.feed_id');
            })
            ->take(static::$pageLimit)
            ->orderBy('feed_id', $orderType)
            ->select(array('feed.*', 'feed.publish_time as time'))
            ->get()
        ;

        // var_dump($feedList);exit;

        // 延迟加载
        $feedList->load('data', 'user', 'user.group');
        $data = array();

        foreach ($feedList as $feed) {
            $_data = $feed->toArray();

            $_data['time'] = date('y-m-d H:i', $feed->time);
            $_data['username'] = $feed->user->uname;
            $_data['userface'] = $feed->user->face->avatar_middle;
            $_data['groupicon'] = $feed->user->group->info->icon;
            $_data['digg_feed_status'] = $feed->diggFeedStatus($this->mid);
            $_data['user_follow'] = $feed->user->followStatus($this->mid);

            $_data = array_merge($_data, (array) $feed->{$feed->type});
            $_data['content'] = mb_substr($_data['content'], 0, 255);

            unset($_data['data'], $_data['user']);

            array_push($data, $_data);
        }

        unset($feedList, $_data);

        $this->__json__($data);
    }
} // END class Index extends Controller
