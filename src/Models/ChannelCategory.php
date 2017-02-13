<?php

namespace App\H5\Model;

use Ts\Bases\Model;
use Medz\Component\EmojiFormat;

/**
 * 频道分类模型
 *
 * @package default
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class ChannelCategory extends Model
{
    protected $table = 'channel_category';

    protected $primaryKey = 'channel_category_id';

    protected $softDelete = false;

    protected $appends = array('image', 'desc');

    public function getExtAttribute($ext)
    {
        $ext = EmojiFormat::de($ext);
        if (is_string($ext)) {
            $ext = unserialize($ext);
        }

        return $ext;
    }

    public function setExtAttribute($ext)
    {
        if (!is_string($ext)) {
            $ext = serialize($ext);
        }

        $ext = EmojiFormat::en($ext);
        $this->attributes['ext'] = $ext;
    }

    public function getTitleAttribute($title)
    {
        return EmojiFormat::de($title);
    }

    public function setTitleAttribute($title)
    {
        $title = EmojiFormat::en($title);
        $this->attributes['title'] = $title;
    }

    public function getImageAttribute()
    {
        if (isset($this->ext['attach'])) {
            return Attach::find($this->ext['attach'])->path;
        }

        return null;
    }

    public function getDescAttribute()
    {
        if (isset($this->ext['desc'])) {
            return $this->ext['desc'];
        }

        return null;
    }

    // public function scopeById($query, $channelCategoryId)
    // {
    //     return $query->where('channel_category_id', '=', $channelCategoryId);
    // }

    public function channels()
    {
        return $this->hasMany('App\H5\Model\Channel', 'channel_category_id', 'channel_category_id');
    }

    public function follows()
    {
        return $this->hasMany('App\H5\Model\ChannelFollow', 'channel_category_id', 'channel_category_id');
    }
} // END class ChannelCategory extends Model
