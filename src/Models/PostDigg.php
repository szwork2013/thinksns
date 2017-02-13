<?php

namespace App\H5\Model;

use Ts\Bases\Model;

/**
 * 微吧帖子赞模型
 *
 * @package default
 * @author Seven Du <lovevipdsw@vip.qq.com>
 **/
class PostDigg extends Model
{
    protected $table = 'weiba_post_digg';

    /**
     * 主键名称.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * 关闭软删除.
     *
     * @var bool
     */
    protected $softDelete = false;

    public function scopeByUserId($query, $userId)
    {
        return $query->where('uid', '=', $userId);
    }

    public function scopeByPostId($query, $postId)
    {
        return $query->where('post_id', '=', $postId);
    }
} // END class PostDigg extends Model
