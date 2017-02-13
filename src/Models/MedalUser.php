<?php

namespace App\H5\Model;

use Ts\Bases\Model;

/**
 * 用户勋章关系模型.
 *
 * @author Seven Du <lovevipdsw@Outlook.com>
 **/
class MedalUser extends Model
{
    protected $table = 'medal_user';

    protected $primaryKey = 'id';

    public function info()
    {
        return $this->hasOne('App\\H5\\Model\\Medal', 'id', 'medal_id');
    }
} // END class MedalUser extends Model
