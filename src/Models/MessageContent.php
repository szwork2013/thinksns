<?php

namespace App\H5\Model;

use Ts\Bases\Model;
use Medz\Component\EmojiFormat;

/**
 * 聊天室消息记录数据模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class MessageContent extends Model
{
    protected $table = 'message_content';

    protected $primaryKey = 'message_id';

    protected $appends = array('data', 'face');

    public function user()
    {
        return $this->belongsTo('App\\H5\\Model\\User', 'from_uid', 'uid');
    }

    public function getContentAttribute($value)
    {
        return EmojiFormat::de($value);
    }

    public function setContentAttribute($value)
    {
        $this->attributes['content'] = EmojiFormat::en($value);
    }

    public function getDataAttribute()
    {
        $funcName = strtolower($this->type);

        return $this->$funcName;
    }

    public function getFaceAttribute()
    {
        return $this->user->face->avatar_big;
    }

    public function getTextAttribute()
    {
        return;
    }

    public function getCardAttribute()
    {
        if (strtolower($this->type) == 'card') {
            return User::find($this->attach_ids)->card;
        }

        return null;
    }

    public function getImageAttribute()
    {
        if (strtolower($this->type) != 'image' || !$this->attach_ids || !$this->attach_ids->attach_id) {
            return null;
        }

        return Attach::find($this->attach_ids->attach_id)->path;
    }

    public function getVoiceAttribute()
    {
        if (strtolower($this->type) != 'voice') {
            return null;
        }
        $voice = Attach::find($this->attach_ids->attach_id)->path;
        if ($voice) {
            return (object) array(
                'url' => $voice,
                'length' => $this->attach_ids->length,
            );
        }

        return null;
    }

    public function getPositionAttribute()
    {
        $address = $this->attach_ids;
        $address->image = Attach::find($address->attach_id)->path;

        return $address;
    }

    public function getAttachIdsAttribute($value)
    {
        // return (object) unserialize('a:3:{s:11:"notify_type";s:17:"create_group_room";s:11:"member_list";a:4:{i:0;a:2:{s:3:"uid";i:37355;s:5:"uname";s:6:"一天";}i:1;a:2:{s:3:"uid";i:39246;s:5:"uname";s:15:"那都不是事";}i:2;a:2:{s:3:"uid";i:35567;s:5:"uname";s:12:"青春足记";}i:3;a:2:{s:3:"uid";i:38194;s:5:"uname";s:12:"栉風沐雨";}}s:15:"room_member_num";i:4;}');

        $value = EmojiFormat::de($value);
        $value = unserialize($value);

        return $value ? (object) EmojiFormat::de($value) : $value;
    }

    public function setAttachIdsAttribute(array $value)
    {
        $value = serialize($value);
        $this->attributes['attach_ids'] = EmojiFormat::en($value);
    }

    public function room()
    {
        return $this->belongsTo('App\\H5\\Model\\MessageList', 'list_id');
    }

    public function members()
    {
        return $this->hasMany('App\\H5\Model\\MessageMember', 'list_id', 'list_id');
    }
} // END class MessageContent extends Model
