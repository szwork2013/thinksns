<?php

namespace App\H5\Controller;

use App\H5\Base\Controller;
use App\H5\Model;
use App\H5\Common;

/**
 * 频道相关
 *
 * @package default
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class Channel extends Controller
{
    public function unFollowAction()
    {
        $uid = $this->mid;
        $channelId = Common::getInput('channel_id');
        $channel = Model\ChannelCategory::find($channelId);

        !$channel and
        $this->error('频道不存在！', true);

        $channel->load(array(
            'follows' => function ($query) use ($uid) {
                $query->byUser($uid);
            },
        ));

        if ($channel->follows->first()) {
            $channel->follows->first()->delete();
        }

        $this->success('取消关注成功！', true);
    }

    public function followAction()
    {
        $uid = $this->mid;
        $channelId = Common::getInput('channel_id');
        $channel = Model\ChannelCategory::find($channelId);

        $channel or
        $this->error('频道不存在！', true);

        $channel->load(array(
            'follows' => function ($query) use ($uid) {
                $query->byUser($uid);
            },
        ));

        if (!$channel->follows->first()) {
            $follow = new Model\ChannelFollow;
            $follow->uid = $uid;

            $channel->follows()->save($follow);
        }

        $this->success('关注成功！', true);
    }

    public function getAllAction()
    {
        $allChannelCategorys = Model\ChannelCategory::get();

        $all = array();

        foreach ($allChannelCategorys as $channelCategory) {
            $cc = array();
            $cc['name'] = $channelCategory->title;
            $cc['id'] = $channelCategory->channel_category_id;
            $cc['feedNum'] = $channelCategory->channels()->count();
            $cc['followState'] = $channelCategory->follows()->byUser($this->mid)->count() > 0;
            array_push($all, $cc);
        }

        $followChannel = Model\ChannelFollow::byUser($this->mid)->get();
        $followChannel->load('channelCategory');

        $follows = array();
        foreach ($followChannel as $follow) {
            $cc = array();
            $cc['name'] = $follow->channelCategory->title;
            $cc['id'] = $follow->channelCategory->channel_category_id;
            $cc['feedNum'] = $follow->ChannelCategory->channels()->count();
            array_push($follows, $cc);
        }

        $this->__json__(array(
            'all' => $all,
            'follows' => $follows,
        ));
    }

    public function getChannelInfoAction()
    {
        $channelCategoryId = Common::getInput('id');
        $channelCategory = Model\ChannelCategory::find($channelCategoryId);

        if (!$channelCategory) {
            $this->__json__(array());
        }

        $this->__json__($channelCategory->toArray());
    }

    public function getFeedListAction()
    {
        list($id, $max, $min) = Common::getInput(array('id', 'max', 'min'));
        $channelCategory = Model\ChannelCategory::find($id);

        if (!$channelCategory) {
            $this->error('频道不存在！', true);
        }

        $channelCategory->load(
            array(
                'channels' => function ($query) use ($max, $min) {
                    if ($max > 0) {
                        $query->where('feed_channel_link_id', '>', $max);
                    } elseif ($min > 0) {
                        $query->where('feed_channel_link_id', '<', $min);
                    }

                    $query->orderBy('feed_channel_link_id', 'desc');
                    $query->take(100);
                },
                'channels.feed' => function ($query) {
                    $query
                        ->existent()
                        ->byAudit()
                    ;
                },
            )
        );
        // $channelCategory->load(
        // 	array('channels.feed' => function($query) {
        // 		return $query
        // 			->existent()
        // 			->byAudit()
        // 		;
        // 	})
        // );

        // var_dump($channelCategory->toArray());exit;

        $feeds = array();
        foreach ($channelCategory->channels as $channel) {
            if (!$channel->feed->feed_id) {
                $channel->delete();
                continue;
            }

            $val = array(
                'user' => array(),
                'feed' => array(),
                'channel' => array(),
            );

            $val['user']['uid'] = $channel->feed->user->uid;
            $val['user']['username'] = $channel->feed->user->uname;
            $val['user']['face'] = $channel->feed->user->face->avatar_middle;
            $val['user']['groupicon'] = $channel->feed->user->group->info->icon;

            $val['type'] = $channel->feed->type;
            $val['date'] = date('Y-m-d H:i', $channel->feed->publish_time);

            $val['feed']['id'] = $channel->feed->feed_id;
            $val['feed']['content'] = $channel->feed->data->feed_content;
            $val['feed']['from'] = $channel->feed->from;

            $val['feed']['starNum'] = $channel->feed->digg_count;
            $val['feed']['commentNum'] = $channel->feed->comment_count;
            $val['feed']['starStatus'] = $channel->feed->diggFeedStatus($this->mid);

            $val['images'] = $channel->feed->images;

            $val['channel']['linkId'] = $channel->feed_channel_link_id;

            array_push($feeds, $val);
        }

        // var_dump($feeds);exit;

        $this->__json__($feeds);
    }
} // END class Channel extends Controller
