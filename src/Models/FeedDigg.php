<?php

namespace App\H5\Model;

use Ts\Bases\Model;

/**
 * 分享点赞模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class FeedDigg extends Model
{
    protected $table = 'feed_digg';

    protected $primaryKey = 'id';

    protected $softDelete = false;

    public function scopeByUser($query, $uid)
    {
        return $query->where('uid', '=', $uid);
    }

    public function user()
    {
        return $this->belongsTo('App\\H5\\Model\\User', 'uid', 'uid');
    }
} // END class FeedDigg extends Model
