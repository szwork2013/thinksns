<?php

namespace App\H5\Model;

use Ts\Models\Channel as ChannelModel;

/**
 * 频道数据模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class Channel extends ChannelModel
{
    public function feed()
    {
        return $this->hasOne('App\\H5\\Model\\Feed', 'feed_id', 'feed_id');
    }
} // END class Channel extends ChannelModel
