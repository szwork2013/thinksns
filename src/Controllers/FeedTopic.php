<?php

namespace App\H5\Controller;

use App\H5\Base\Controller;
use App\H5\Model;
use App\H5\Common;

/**
 * 话题控制器
 *
 * @package default
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class FeedTopic extends Controller
{
    public function getHotTopicsAction()
    {
        $recommend = 1; // 是否推荐
        $this->getTopicListAction(null, $recommend);
    }

    public function getTopicListAction($take = 30, $recommend = 0)
    {
        $topicName = Common::getInput('key');
        $list = Model\FeedTopic::byStatus(0)
            ->byLock(0)
            ->byRecommend($recommend)
            ->where(function ($query) use ($topicName) {
                if ($topicName) {
                    $query->where('topic_name', 'LIKE', '%'.$topicName.'%');
                }
            })
            ->orderBy('topic_id', 'desc')
            ->take($take)
            ->select()
            ->get()
        ;

        $topics = array();
        foreach ($list as $topic) {
            $val = array();
            $val['name'] = $topic->topic_name;
            $val['id'] = $topic->topic_id;
            $val['feedNum'] = $topic->links()->count();
            array_push($topics, $val);
        }

        $this->__json__($topics);
    }
} // END class FeedTopic extends Controller
