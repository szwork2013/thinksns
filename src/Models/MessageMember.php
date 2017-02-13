<?php

namespace App\H5\Model;

use Ts\Bases\Model;

/**
 * 聊天消息数量模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class MessageMember extends Model
{
    protected $table = 'message_member';

    protected $primaryKey = 'id';

    public function data()
    {
        return $this->hasOne('App\\H5\\Model\\MessageList', 'list_id', 'list_id');
    }

    public function user()
    {
        return $this->belongsTo('App\\H5\\Model\\User', 'member_uid', 'uid');
    }
} // END class MessageMember extends Model
