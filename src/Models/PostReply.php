<?php

namespace App\H5\Model;

use Ts\Bases\Model;
use Medz\Component\EmojiFormat;

/**
 * 微吧帖子回复数据模型
 *
 * @package default
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class PostReply extends Model
{
    protected $table = 'weiba_reply';

    /**
     * 主键名称.
     *
     * @var string
     */
    protected $primaryKey = 'reply_id';

    /**
     * 关闭软删除.
     *
     * @var bool
     */
    protected $softDelete = false;

    public function setContentAttribute($content)
    {
        $this->attributes['content'] = EmojiFormat::en((string) $content);
    }

    public function getContentAttribute($content)
    {
        return EmojiFormat::de($content);
    }
} // END class PostReply extends Model
