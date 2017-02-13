<?php

namespace App\H5;

/**
 * 错误消息抛出类.
 *
 * @author Seven Du <lovevipdsw@vip.qq.com>
 **/
class Error
{
    /**
     * 消息储存成员.
     *
     * @var string
     **/
    protected $message;

    /**
     * 构造方法.
     *
     * @param string $message 消息
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    public function __construct($message)
    {
        $this->message = $message;
    }

    /**
     * 获取错误消息.
     *
     * @return string
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    public function getError()
    {
        return $this->message;
    }
} // END class Error
