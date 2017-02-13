<?php

namespace App\H5\Controller;

use App\H5\Base\Controller;
use App\H5\Model\ApplicationSlide;

/**
 * 发现相关控制器.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class Discover extends Controller
{
    public function indexAction()
    {
        $slides = array();

        foreach (ApplicationSlide::all() as $slide) {
            $data = array();
            $data['src'] = $slide->src->imagePath();
            $data['data-type'] = $slide->type;
            $data['data-data'] = $slide->data;
            array_push($slides, $data);
        }

        $this
            ->setTitle('发现')
            ->trace('slides', $slides)
            ->display('index')
        ;
    }
} // END class Discover extends Controller
