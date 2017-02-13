<?php

namespace App\H5\Model;

use Ts\Bases\Model;

/**
 * 用户用户组模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class UserGroup extends Model
{
    protected $table = 'user_group';

    protected $primaryKey = 'user_group_id';

    protected $softDelete = false;

    /**
     * 用户组图标关系字段.
     *
     * @return string|null
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-22T11:13:25+0800
     * @homepage http://medz.cn
     */
    public function getIconAttribute()
    {
        if ($this->user_group_icon !== null and $this->user_group_icon != '-1') {
            return sprintf('%s/image/usergroup/%s', THEME_PUBLIC_URL, $this->user_group_icon);
        }

        return;
    }
} // END class UserGroup extends Model
