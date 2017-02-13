<?php

namespace App\H5\Controller;

use App\H5\Common;
use App\H5\Base\Controller;
use App\H5\Model;

/**
 * 分享相关控制器.
 *
 * @author Seven Du <lovveipdsw@outlook.com>
 **/
class Feed extends Controller
{
    public function getFeedInfoAction()
    {
        $feedId = Common::getInput('feed_id');
        $info = Model\Feed::existent()
            ->byAudit(1)
            ->find($feedId)
        ;

        if (!$info) {
            $this->error('分享不存在或者已经被删除!', true);
        }

        $info->load(array(
            'data',
            'user',
            'diggs' => function ($query) {
                $query->take(5);
            },
            'diggs.user',
        ));

        $feed = array();
        $feed['feedId'] = $info->feed_id;
        $feed['type'] = $info->type;
        $feed['date'] = friendlyDate($info->publish_time);
        $feed['content'] = $info->data->feed_content;
        $feed['diggCount'] = $info->digg_count;
        $feed['user'] = array(
            'username' => $info->user->username,
            'face' => $info->user->face->avatar_big,
        );
        $feed['users'] = array();

        $info->diggs->map(function ($digg) use (&$feed) {
            array_push($feed['users'], array(
                'uid' => $digg->uid,
                'face' => $digg->user->face->avatar_big,
            ));
        });
        $feed['from'] = $info->from;

        $feed['followStatus'] = $info->diggFeedStatus($this->mid);
        $feed['starStatus'] = Model\Collection::byTable('feed')->BySid($info->feed_id)->byUser($this->mid)->first() ? true : false;

        $feed['images'] = $info->images;
        $feed['video'] = $info->video;

        // var_dump($feed);
        // var_dump($info->toArray());
        // exit;

        $this->__json__($feed);
    }

    public function getFeedListToRecommentAction()
    {
        list($max, $min) = Common::getInput(array('max', 'min'));

        $list = Model\Feed::existent()
            ->byAudit(1)
            // ->join('feed_top', function($join) {
            //     $join->on('feed.feed_id', '=', 'feed_top.feed_id');
            // })
            ->where(function ($query) use ($max, $min) {
                if ($max > 0) {
                    $query->where('feed.feed_id', '>', $max);
                } elseif ($min > 0) {
                    $query->where('feed.feed_id', '<', $min);
                }
            })
            ->whereIn('type', array('post', 'postvideo', 'repost', 'postfile', 'postimage'))
            ->where('is_recommend', '=', 1)
            ->take(10)
            ->orderBy('feed.feed_id', 'desc')
            ->get()
        ;

        $list->load('data', 'user', 'user.group');

        $feeds = array();
        foreach ($list as $feed) {
            $val = array(
                'user' => array(),
                'feed' => array(),
            );

            $val['user']['uid'] = $feed->user->uid;
            $val['user']['username'] = $feed->user->uname;
            $val['user']['face'] = $feed->user->face->avatar_middle;
            $val['user']['groupicon'] = $feed->user->group->info->icon;

            $val['type'] = $feed->type;
            $val['date'] = date('Y-m-d H:i', $feed->publish_time);

            $val['feed']['id'] = $feed->feed_id;
            $val['feed']['content'] = $feed->data->feed_content;
            $val['feed']['from'] = $feed->from;
            $val['feed']['starNum'] = $feed->digg_count;
            $val['feed']['commentNum'] = $feed->comment_count;
            $val['feed']['starStatus'] = $feed->diggFeedStatus($this->mid);

            $val['images'] = $feed->images;
            $val['video'] = $feed->video;

            array_push($feeds, $val);
        }

        $this->__json__($feeds);
    }

    public function getFeedListToChannelAction()
    {
        list($max, $min) = Common::getInput(array('max', 'min'));

        $list = Model\Feed::existent()
            ->byAudit(1)
            ->leftJoin('channel', function ($join) {
                $join->on('channel.feed_id', '=', 'feed.feed_id');
            })
            ->join('channel_category', function ($join) {
                $join->on('channel.channel_category_id', '=', 'channel_category.channel_category_id');
            })
            ->where('channel.status', '=', 1)
            ->where(function ($query) use ($max, $min) {
                if ($max) {
                    $query->where('feed.feed_id', '>', $max);
                } elseif ($min) {
                    $query->where('feed.feed_id', '<', $min);
                }
            })
            ->whereIn('type', array('post', 'postvideo', 'repost', 'postfile', 'postimage'))
            ->take(10)
            ->orderBy('feed.feed_id', 'desc')
            ->get()
        ;

        $list->load('data', 'user', 'user.group');

        $feeds = array();
        foreach ($list as $feed) {
            $val = array(
                'user' => array(),
                'feed' => array(),
            );

            $val['user']['uid'] = $feed->user->uid;
            $val['user']['username'] = $feed->user->uname;
            $val['user']['face'] = $feed->user->face->avatar_middle;
            $val['user']['groupicon'] = $feed->user->group->info->icon;

            $val['type'] = $feed->type;
            $val['date'] = date('Y-m-d H:i', $feed->publish_time);

            $val['feed']['id'] = $feed->feed_id;
            $val['feed']['content'] = $feed->data->feed_content;
            $val['feed']['from'] = $feed->title;
            $val['feed']['starNum'] = $feed->digg_count;
            $val['feed']['commentNum'] = $feed->comment_count;
            $val['feed']['starStatus'] = $feed->diggFeedStatus($this->mid);

            $val['images'] = $feed->images;
            $val['video'] = $feed->video;

            array_push($feeds, $val);
        }

        $this->__json__($feeds);
    }

    public function getFeedListToStartAction()
    {
        list($max, $min) = Common::getInput(array('max', 'min'));

        $list = Model\Feed::leftJoin('user_follow', function ($join) {
            $join->on('feed.uid', '=', 'user_follow.fid');
        })
            ->existent()
            ->byAudit(1)
            ->where('user_follow.uid', '=', $this->mid)
            ->where(function ($query) use ($max, $min) {
                if ($max) {
                    $query->where('feed.feed_id', '>', $max);
                } elseif ($min) {
                    $query->where('feed.feed_id', '<', $min);
                }
            })
            ->whereIn('type', array('post', 'postvideo', 'repost', 'postfile', 'postimage'))
            ->take(10)
            ->orderBy('feed.feed_id', 'desc')
            ->select(array('feed.*'))
            ->get()
        ;

        // var_dump($list->toArray());exit;

        $list->load('data', 'user', 'user.group');

        $feeds = array();
        foreach ($list as $feed) {
            $val = array(
                'user' => array(),
                'feed' => array(),
            );

            $val['user']['uid'] = $feed->user->uid;
            $val['user']['username'] = $feed->user->uname;
            $val['user']['face'] = $feed->user->face->avatar_middle;
            $val['user']['groupicon'] = $feed->user->group->info->icon;

            $val['type'] = $feed->type;
            $val['date'] = date('Y-m-d H:i', $feed->publish_time);

            $val['feed']['id'] = $feed->feed_id;
            $val['feed']['content'] = $feed->data->feed_content;
            $val['feed']['from'] = $feed->from;
            $val['feed']['starNum'] = $feed->digg_count;
            $val['feed']['commentNum'] = $feed->comment_count;
            $val['feed']['starStatus'] = $feed->diggFeedStatus($this->mid);

            $val['images'] = $feed->images;
            $val['video'] = $feed->video;

            array_push($feeds, $val);
        }

        $this->__json__($feeds);
    }

    public function getFeedListToAllAction()
    {
        list($max, $min) = Common::getInput(array('max', 'min'));

        $list = Model\Feed::existent()
            ->byAudit(1)
            ->where(function ($query) use ($max, $min) {
                if ($max > 0) {
                    $query->where('feed_id', '>', $max);
                } elseif ($min > 0) {
                    $query->where('feed_id', '<', $min);
                }
            })
            ->whereIn('type', array('post', 'postvideo', 'repost', 'postfile', 'postimage'))
            ->take(10)
            ->orderBy('feed_id', 'desc')
            ->get()
        ;

        $list->load('data', 'user', 'user.group');

        $feeds = array();
        foreach ($list as $feed) {
            $val = array(
                'user' => array(),
                'feed' => array(),
            );

            $val['user']['uid'] = $feed->user->uid;
            $val['user']['username'] = $feed->user->uname;
            $val['user']['face'] = $feed->user->face->avatar_middle;
            $val['user']['groupicon'] = $feed->user->group->info->icon;

            $val['type'] = $feed->type;
            $val['date'] = date('Y-m-d H:i', $feed->publish_time);

            $val['feed']['id'] = $feed->feed_id;
            $val['feed']['content'] = $feed->data->feed_content;
            $val['feed']['from'] = $feed->from;
            $val['feed']['starNum'] = $feed->digg_count;
            $val['feed']['commentNum'] = $feed->comment_count;
            $val['feed']['starStatus'] = $feed->diggFeedStatus($this->mid);

            $val['images'] = $feed->images;
            $val['video'] = $feed->video;

            array_push($feeds, $val);
        }

        $this->__json__($feeds);
    }

    public function sendAction()
    {
        list($content, $aids, $type, $data) = Common::getInput(array('content', 'aids', 'type', 'data'));

        if (!$content) {
            $this->error('分享内容不能为空！', true);

        /* 判断长度 */
        } elseif (Common::strlen($content) > 140) {
            $this->error('分享内容长度不能大于140个字符！');
        }

        if (is_string($aids)) {
            $aids = explode(',', $aids);
        }
        $aids = (array) $aids;
        $aids = array_filter($aids);

        $feed = new Model\Feed();
        $feed->uid = $this->mid;
        $feed->app = 'public';
        $feed->app_row_table = 'feed';
        $feed->publish_time = time();
        $feed->latitude = '';
        $feed->longitude = '';
        $feed->address = '';
        $feed->type = count($aids) > 0 ? 'postimage' : 'post';
        $feed->from = 6;
        $feed->is_repost = 0;

        if ($type == 'repoeat') {
            if (!Model\Feed::find($data)) {
                $this->error('转发的原分享被删除或者不存在!', true);
            }

            $feed->type = 'repost';
            $feed->is_repost = 1;
            $feed->app_row_id = intval($data);
        }

        $feed_data = $feed->toArray();
        $feed_data['attach_id'] = $aids;
        $content = preg_replace("/#[\s]*([^#^\s][^#]*[^#^\s])[\s]*#/is", '#'.trim('${1}').'#', $content);
        $feed_data['content'] = $feed_data['body'] = $content;
        $data = new Model\FeedData();
        $data->feed_content = $content;
        $data->feed_data = $feed_data;

        $feed->save();

        if (!$feed->feed_id) {
            $this->error('发布失败！', true);
        }

        $feed->data()->save($data);
        // 添加话题
        model('FeedTopic')->addTopic(html_entity_decode($content, ENT_QUOTES, 'UTF-8'), $feed->feed_id, $type);
        $feedCount = $feed
            ->user
            ->datas()
            ->key('feed_count')
            ->first()
            // ->increment('value', 1)
        ;
        if (!$feedCount) {
            $feedCount = new Model\UserData;
            $feedCount->key = 'feed_count';
            $feedCount->value = 0;
            $feedCount->mtime = date('Y-m-d H:i:s', time());
            $feed->user->datas()->save($feedCount);
        }
        $feedCount->increment('value', 1);

        $this->success('发布成功！', true);
    }

    public function readDiggUsersAction()
    {
        $feedId = Common::getInput('feed_id');

        $feed = Model\Feed::existent()->find($feedId);

        if (!$feed) {
            $this->error('该分享不存在或者已经被删除！');
        }

        $feed->load('diggs');

        // var_dump($feed->diggs[0]->user->followStatus(5));exit;

        $this
            ->setTitle('赞列表')
            ->trace('diggs', $feed->diggs)
            ->trace('uid', $this->mid)
            // ->trace('feed', $feed)
            ->display('read-digg-users')
        ;
    }

    public function diggAction()
    {
        $feedId = Common::getInput('feed_id');
        $uid = $this->mid;

        $feed = Model\Feed::existent()->find($feedId);

        if (!$feed) {
            $this->error('该分享不存在或者已经被删除', true);
        }

        $digg = $feed->diggs()->byUser($uid)->first();
        if ($digg) {
            $this->error('你已经赞过该分享！', true);
        }

        model('FeedDigg')->addDigg($feedId, $uid);

        $this->success('操作成功', true);
    }

    public function unDiggAction()
    {
        $feedId = Common::getInput('feed_id');
        $uid = $this->mid;

        $feed = Model\Feed::existent()->find($feedId);

        if (!$feed) {
            $this->error('该分享不存在或者已经被删除', true);
        }

        $digg = $feed->diggs()->byUser($uid)->first();
        if (!$digg) {
            $this->error('你没有赞过该分享，无法取消赞操作', true);
        }

        model('FeedDigg')->delDigg($feedId, $uid);

        // $feed->decrement('digg_count', 1);
        // $digg->delete();
        // model('Feed')->cleanCache($feedId);
        // model('FeedDigg')->setDiggCache($uid, $feedId, 'del');

        $this->success('操作成功', true);
    }

    public function starAction()
    {
        $feedId = Common::getInput('feed_id');
        $feed = Model\Feed::existent()->find($feedId);
        if (!$feed) {
            $this->error('该分享不存在或者已经被删除', true);
        }

        $star = Model\Collection::byTable('feed')->BySid($feed->feed_id)->byUser($this->mid)->first();

        if ($star) {
            $this->error('你已经收藏过该分享', true);
        }

        $star = new Model\Collection();
        $star->uid = $this->mid;
        $star->source_table_name = 'feed';
        $star->source_id = $feed->feed_id;
        $star->source_app = 'public';
        $star->source_table_name = 'feed';
        $star->ctime = time();
        $star->save();

        $this->success('操作成功', false);
    }

    public function unStarAction()
    {
        $feedId = Common::getInput('feed_id');
        $feed = Model\Feed::existent()->find($feedId);
        if (!$feed) {
            $this->error('该分享不存在或者已经被删除', true);
        }

        $star = Model\Collection::byTable('feed')->BySid($feed->feed_id)->byUser($this->mid)->first();
        if (!$star) {
            $this->error('您没有收藏过该分享', true);
        }

        $star->delete();
        $this->success('操作成功', true);
    }
} // END class Feed extends Controller
