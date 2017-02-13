<?php

namespace App\H5\Controller;

use App\H5\Base\Controller;
use App\H5\Common;

/**
 * 文件相关控制器
 *
 * @package default
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class File extends Controller
{
    public function uploadAction()
    {
        $info = Common::uploadFile('image', 'feed_image', 'gif', 'png', 'jpg', 'jpeg');

        if (count($info['info']) <= 0) {
            $this->error('没有上传图片', true);

        /* 状态 */
        } elseif ($info['status'] == false) {
            $this->error('上传失败', true);
        }

        $this->trace('attach_id', $info['info'][0]['attach_id']);
        $this->success('上传成功', true);
    }
} // END class File extends Controller
