<?php

namespace App\H5\Model;

use Ts\Bases\Model;

/**
 * 收藏相关表.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class Collection extends Model
{
    protected $table = 'collection';

    protected $primaryKey = 'collection_id';

    public function scopeByTable($query, $tableName)
    {
        return $query->where('source_table_name', '=', $tableName);
    }

    public function scopeBySid($query, $sid)
    {
        return $query->where('source_id', '=', $sid);
    }

    public function scopeByUser($query, $uid)
    {
        return $query->where('uid', '=', $uid);
    }
} // END class Collection extends Model
