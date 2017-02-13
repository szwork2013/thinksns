<?php

namespace App\H5\Controller;

use App\H5\Base\Controller as Controller;

/**
 * 空控制器的时候这些的控制器.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class None extends Controller
{
    /**
     * 实例化后的执行.
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     **/
    protected function classConstructAfter()
    {
        $this->error(sprintf('访问的控制器：“%s”不存在。', MODULE_NAME));
    }
} // END class None extends Controller
