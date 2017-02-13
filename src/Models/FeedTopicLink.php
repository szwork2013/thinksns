<?php

namespace App\H5\Model;

use Ts\Bases\Model;

/**
 * 分享话题的关联模型
 *
 * @package default
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class FeedTopicLink extends Model
{
    protected $table = 'feed_topic_link';

    protected $primaryKey = 'feed_topic_id';

    public function feed()
    {
        return $this->hasOne('App\H5\Model\Feed', 'feed_id', 'feed_id');
    }
} // END class FeedTopicLink extends Model
