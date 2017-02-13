<?php

namespace App\H5\Model;

use Ts\Bases\Model;

/**
 * 用户拓展信息数据模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class UserData extends Model
{
    protected $table = 'user_data';

    protected $primaryKey = 'id';

    protected $softDelete = false;

    /**
     * 复用的单个拓展值限制.
     *
     * @param Illuminate\Database\Eloquent\Builder $query 查询器
     * @param string                               $key   限定的值
     *
     * @return Illuminate\Database\Eloquent\Builder
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-04-15T23:53:13+0800
     * @homepage http://medz.cn
     */
    public function scopeKey($query, $key)
    {
        return $query->where('key', '=', $key);
    }

    /**
     * 如果获取的数据对象是用户主页背景图，则快捷属性取得.
     *
     * @return string 图片URL
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-04-16T03:54:29+0800
     * @homepage http://medz.cn
     */
    public function getCoverAttribute()
    {
        if ($this->key == 'application_user_cover') {
            return Attach::find($this->value)
                ->path
            ;
        }

        return;
    }
} // END class UserData extends Model
