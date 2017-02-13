<?php

namespace App\H5\Model;

use Ts\Bases\Model;

/**
 * 微吧粉丝表.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class WeibaFollow extends Model
{
    protected $table = 'weiba_follow';

    protected $primaryKey = 'id';

    protected $softDelete = false;

    public function scopeByUser($query, $uid)
    {
        return $query->where('follower_uid', '=', intval($uid));
    }
} // END class WeibaFollow extends Model
