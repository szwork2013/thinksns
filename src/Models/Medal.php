<?php

namespace App\H5\Model;

use Ts\Bases\Model;

/**
 * 勋章数据模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class Medal extends Model
{
    protected $table = 'medal';

    protected $primaryKey = 'id';

    public function getSrcAttribute()
    {
        return $this->attach->path;
    }

    public function getAttachAttribute()
    {
        $val = explode('|', $this->attributes['src']);

        return Attach::find($val[0]);
    }

    public function getSmallSrcAttribute($val)
    {
        $val = explode('|', $val);

        return $val[1];
    }
} // END class Medal extends Model
