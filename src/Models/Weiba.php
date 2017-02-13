<?php

namespace App\H5\Model;

use Ts\Bases\Model;

/**
 * 微吧数据模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class Weiba extends Model
{
    protected $table = 'weiba';

    /**
     * 主键名称.
     *
     * @var string
     */
    protected $primaryKey = 'weiba_id';

    /**
     * 关闭软删除.
     *
     * @var bool
     */
    protected $softDelete = false;

    public function follows()
    {
        return $this->hasMany('App\\H5\\Model\\WeibaFollow', 'weiba_id', 'weiba_id');
    }

    public function avatar()
    {
        return $this->hasOne('App\\H5\\Model\\Attach', 'attach_id', 'logo');
    }
} // END class Weiba extends Model
