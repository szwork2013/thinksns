<?php

namespace App\H5\Model;

use Ts\Bases\Model;
use Medz\Component\EmojiFormat;

/**
 * 用户分享详情模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class FeedData extends Model
{
    protected $table = 'feed_data';

    /**
     * 主键名称.
     *
     * @var string
     */
    protected $primaryKey = 'feed_id';

    /**
     * 关闭软删除.
     *
     * @var bool
     */
    protected $softDelete = false;

    public function setFeedDataAttribute($value)
    {
        if (!is_string($value)) {
            $value = serialize($value);
        }
        $value = EmojiFormat::en($value);
        $this->attributes['feed_data'] = $value;
    }

    public function getFeedDataAttribute($value)
    {
        return EmojiFormat::de($value);
    }

    public function setFeedContentAttribute($value)
    {
        $this->attributes['feed_content'] = EmojiFormat::en($value);
    }

    public function getFeedContentAttribute($value)
    {
        return EmojiFormat::de($value);
    }

    public function getFeedDataObjectAttribute()
    {
        return (object) unserialize($this->feed_data);
    }
} // END class FeedData extends Model
