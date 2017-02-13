<?php

namespace App\H5\Model;

use Ts\Bases\Model;
use Medz\Component\EmojiFormat;

/**
 * 评论数据模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class Comment extends Model
{
    protected $table = 'comment';

    protected $primaryKey = 'comment_id';

    protected $softDelete = false;

    public function user()
    {
        return $this->belongsTo('App\\H5\\Model\\User', 'uid', 'uid');
    }

    public function setContentAttribute($content)
    {
        $this->attributes['content'] = EmojiFormat::en((string) $content);
    }

    public function getContentAttribute($content)
    {
        return EmojiFormat::de($content);
    }

    public function setDataAttribute($data)
    {
        $this->attributes['data'] = EmojiFormat::en(serialize($data));
    }

    public function getDataAttribute($data)
    {
        return unserialize(EmojiFormat::de($data));
    }
} // END class Comment extends Model
