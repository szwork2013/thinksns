<?php

namespace App\H5\Model;

use Ts\Bases\Model;
use Medz\Component\EmojiFormat;

/**
 * 消息列表数据模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class MessageList extends Model
{
    protected $table = 'message_list';

    protected $primaryKey = 'list_id';

    public function getLogo($uid)
    {
        if ($this->type == 2) {
            return $this->logo;
        }

        return $this
            ->members()
            ->where('member_uid', '!=', $uid)
            ->select('member_uid')
            ->first()
            ->user
            ->face
            ->avatar_big
        ;
    }

    public function getTitle($uid)
    {
        if ($this->type == 2) {
            return EmojiFormat::de($this->title);
        }

        return EmojiFormat::de($this
            ->members()
            ->where('member_uid', '!=', $uid)
            ->select('member_uid')
            ->first()
            ->user
            ->uname
        );
    }

    public function getLogoAttribute()
    {
        $logo = null;
        if ($this->type == 2) {
            $logo = $this->attach->path;
        }

        if (!$logo) {
            return false;
        }

        return $logo;
    }

    public function setLogoAttribute($attachId)
    {
        $this->attributes['logo'] = intval($attachId);
    }

    public function getTitleAttribute($title)
    {
        return EmojiFormat::de($title);
    }

    public function setTitleAttribute($title)
    {
        $this->attributes['title'] = EmojiFormat::en($title);
    }

    public function setLastMessageAttribute($content)
    {
        $content = serialize($content);
        $this->attributes['last_message'] = EmojiFormat::en($content);
    }

    public function getLastMessageAttribute($content)
    {
        $content = EmojiFormat::de($content);
        $content = unserialize($content);
        if ($content['content']) {
            $content = $content['content'];
        } else {
            $content = '';
        }

        return EmojiFormat::de($content);
    }

    public function contents()
    {
        return $this->hasMany('App\\H5\\Model\\MessageContent', 'list_id', 'list_id');
    }

    public function members()
    {
        return $this->hasMany('App\\H5\\Model\\MessageMember', 'list_id', 'list_id');
    }

    public function attach()
    {
        return $this->hasOne('App\\H5\\Model\\Attach', 'attach_id', 'logo');
    }
} // END class MessageList extends Model
