<?php

namespace App\H5\Controller;

use App\H5\Base\Controller;
use App\H5\Model;
use App\H5\Common;

/**
 * 话题相关
 *
 * @package default
 * @author Seven Du <lovevipdsw@vip.qq.com>
 **/
class Topic extends Controller
{
    public function getTopicInfoAction()
    {
        $name = Common::getInput('name');
        $topic = Model\FeedTopic::byStatus()
            ->byLock()
            ->byName($name)
            ->first()
        ;

        if (!$topic) {
            $this->error('话题不存在！', true);
        }

        $this->__json__($topic->toArray());
    }

    public function getTopicFeedsAction()
    {
        list($name, $max, $min) = Common::getInput(array('name', 'max', 'min'));
        $topic = Model\FeedTopic::byStatus()
            ->byLock()
            ->byName($name)
            ->first()
        ;

        if (!$topic) {
            $this->error('该话题没有内容', true);
        }

        $topic->load(array(
            'links' => function ($query) use ($max, $min) {
                if ($max > 0) {
                    $query->where('feed_topic_id', '>', $max);
                } elseif ($min > 0) {
                    $query->where('feed_topic_id', '<', $min);
                }

                $query
                    ->orderBy('feed_topic_id', 'desc')
                    ->take(100)
                ;
            },
            'links.feed' => function ($query) {
                $query
                    ->existent()
                    ->byAudit()
                ;
            },
        ));

        $feeds = array();
        foreach ($topic->links as $link) {
            // var_dump($link);
            $val = array(
                'user' => array(),
                'feed' => array(),
            );

            $val['user']['uid'] = $link->feed->user->uid;
            $val['user']['username'] = $link->feed->user->uname;
            $val['user']['face'] = $link->feed->user->face->avatar_middle;
            $val['user']['groupicon'] = $link->feed->user->group->info->icon;

            $val['type'] = $link->feed->type;
            $val['date'] = date('Y-m-d H:i', $link->feed->publish_time);
            $val['linkId'] = $link->feed_topic_id;

            $val['feed']['id'] = $link->feed->feed_id;
            $val['feed']['content'] = $link->feed->data->feed_content;
            $val['feed']['from'] = $link->feed->from;

            $val['feed']['starNum'] = $link->feed->digg_count;
            $val['feed']['commentNum'] = $link->feed->comment_count;
            $val['feed']['starStatus'] = $link->feed->diggFeedStatus($this->mid);

            $val['images'] = $link->feed->images;

            array_push($feeds, $val);
        }

        // var_dump($feeds);exit;
        // var_dump($topic->links);

        $this->__json__($feeds);
    }
} // END class Topic extends Controller
