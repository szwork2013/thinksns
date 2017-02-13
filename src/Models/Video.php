<?php

namespace App\H5\Model;

use Ts\Bases\Model;

/**
 * 视频数据模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class Video extends Model
{
    protected $table = 'video';

    protected $primaryKey = 'video_id';

    public function scopeByMp4($query)
    {
        return $query->where('extension', '=', 'mp4');
    }

    public function getImagePathAttribute($value)
    {
        return sprintf('%s/%s', SITE_URL, $value);
    }

    public function getVideoPathAttribute($value)
    {
        return sprintf('%s/%s', SITE_URL, $value);
    }
} // END class Video extends Model
