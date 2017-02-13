<?php

namespace App\H5\Controller;

use App\H5\Base\Controller;
use App\H5\Model;

/**
 *  发现控制器
 *
 * @package default
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class Find extends Controller
{
    public function getAllSliderAction()
    {
        $slides = array();

        foreach (Model\ApplicationSlide::all() as $slide) {
            $data = array();
            $data['src'] = $slide->src->imagePath();
            $data['type'] = $slide->type;
            $data['data'] = $slide->data;
            array_push($slides, $data);
        }

        $this->__json__($slides);
    }
} // END class Find extends Controller
