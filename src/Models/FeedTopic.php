<?php

namespace App\H5\Model;

use Ts\Bases\Model;
use Medz\Component\EmojiFormat;

/**
 * 分享话题模型
 *
 * @package default
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class FeedTopic extends Model
{
    protected $table = 'feed_topic';

    protected $primaryKey = 'topic_id';

    protected $appends = array('image');

    public function scopeByStatus($query, $status = 0)
    {
        return $query->where('status', '=', $status);
    }

    public function scopeByLock($query, $lock = 0)
    {
        return $query->where('lock', '=', $lock);
    }

    public function scopeByRecommend($query, $recommend = 0)
    {
        return $query->where('recommend', '=', $recommend);
    }

    public function scopeByName($query, $name)
    {
        return $query->where('topic_name', '=', $name);
    }

    public function links()
    {
        return $this->hasMany('App\H5\Model\FeedTopicLink', 'topic_id', 'topic_id');
    }

    public function getTopicNameAttribute($name)
    {
        return EmojiFormat::de($name);
    }

    public function setTopicNameAttribute($name)
    {
        $this->attributes['topic_name'] = EmojiFormat::en($name);
    }

    public function getNoteAttribute($note)
    {
        return EmojiFormat::de($note);
    }

    public function setNoteAttribute($note)
    {
        $this->attributes['note'] = EmojiFormat::en($note);
    }

    public function getImageAttribute()
    {
        if ($this->pic > 0) {
            return Attach::find($this->pic)->path;
        }

        return null;
    }
} // END class FeedTopic extends Model
