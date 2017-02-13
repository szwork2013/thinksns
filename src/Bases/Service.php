<?php

namespace App\H5\Base;

/**
 * 服务模型基类.
 *
 * @author Seven Du <lovevipdsw@vip.qq.com>
 **/
abstract class Service
{
    /**
     * 实例化之后，所有操作之前的动作.
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    abstract protected function _beforeAction();

    /**
     * 储存单例对象
     *
     * @var object self
     **/
    protected static $_instalce;

    /**
     * 构造方法.
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    final protected function __construct()
    {
        $this->_beforeAction();
    }

    /**
     * 析构方法.
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    final public function __destruct()
    {
        static::$_instalce = null;
    }

    /**
     * 获取当前单例对象
     *
     * @return object self
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    final public static function getInstance()
    {
        if (!(static::$_instalce instanceof static)) {
            static::$_instalce = null; // 第一次覆盖不了~ The why?
            static::$_instalce = new static();
        }

        return static::$_instalce;
    }
} // END abstract class Service
