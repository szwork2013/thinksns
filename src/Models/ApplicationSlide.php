<?php

namespace App\H5\Model;

use Ts\Bases\Model;

/**
 * 客户端幻灯片数据模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class ApplicationSlide extends Model
{
    protected $table = 'application_slide';

    protected $primaryKey = 'id';

    protected $softDelete = false;

    public function src()
    {
        return $this->belongsTo('App\\H5\\Model\\Attach', 'image', 'attach_id');
    }
} // END class ApplicationSlide extends Model
