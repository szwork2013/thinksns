<?php

namespace App\H5\Model;

use Ts\Bases\Model;

/**
 * 频道关注模型
 *
 * @package default
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class ChannelFollow extends Model
{
    protected $table = 'channel_follow';

    protected $primaryKey = 'channel_follow_id';

    protected $softDelete = false;

    public function scopeByUser($query, $uid)
    {
        return $query->where('uid', '=', $uid);
    }

    public function channelCategory()
    {
        return $this->hasOne('App\H5\Model\ChannelCategory', 'channel_category_id', 'channel_category_id');
    }

    public function user()
    {
        return $this->hasOne('App\H5\Model\User', 'uid', 'uid');
    }
} // END class ChannelFollow extends Model
