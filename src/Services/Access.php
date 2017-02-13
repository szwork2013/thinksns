<?php

namespace App\H5\Service;

use App\H5\Base\Service;

/**
 * 页面访问名单控制.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class Access extends Service
{
    /**
     * 储存名单.
     *
     * @var array
     **/
    protected static $access = array();

    /**
     * 前置执行动作.
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     **/
    protected function _beforeAction()
    {
        $this
            ->add('*', 'noscript')
            ->add('index', 'index')
            ->add('index', 'getFeedList')
            // ->add('index', 'getStrtFeedList')
            ->add('sign', 'up')
            ->add('sign', 'doLogin')
            ->add('sign', 'checkPhone')
            ->add('sign', 'checkPhoneCode')
            ->add('sign', 'checkUserName')
            ->add('sign', 'sendPhoneCode')
            ->add('sign', 'signInUser')
            ->add('sign', 'out')
            ->add('sign', 'weixin')

            ->add('channel', 'getAll')

            ->add('feedTopic', 'getTopicList')

            ->add('message', 'getEmotions')

            ->add('user', 'following')
            ->add('user', 'follower')
            ->add('user', 'photos')
            ->add('user', 'info')
            ->add('user', 'data')
            ->add('user', 'showData')
            ->add('user', 'feeds')

            ->add('find', 'getAllSlider')

            ->add('feed', 'getFeedListToRecomment')
            ->add('feed', 'getFeedListToChannel')
            ->add('feed', 'getFeedListToAll')
            ->add('feed', 'getFeedListToStart')
            ->add('feed', 'getFeedInfo')

            ->add('weiba', 'getIndex')
            ->add('weiba', 'getWeibas')
            ->add('weiba', 'getPostList')
            ->add('weiba', 'postReader')
            ->add('weiba', 'getInfo')

            ->add('comment', 'getList')
            ->add('topic', 'getTopicInfo')
            ->add('topic', 'getTopicFeeds')
            ->add('feedTopic', 'getHotTopics')
            ->add('channel', 'getChannelInfo')
            ->add('channel', 'getFeedList')
        ;
    }

    /**
     * 添加名单.
     *
     * @param string $controllerName 控制器名称
     * @param string $actionName     动作名称
     *
     * @return App\Service\Access
     *
     * @author Seven Du <lovevipds@outlook.com>
     **/
    public function add($controllerName, $actionName)
    {
        list($controllerName, $actionName) = array(
            strtolower($controllerName),
            strtolower($actionName),
        );

        static::$access[$controllerName][$actionName] = true;

        return $this;
    }

    /**
     * 移除名单.
     *
     * @param string $controllerName 控制器名称
     * @param string $actionName     动作名称
     *
     * @return App\Service\Access
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     **/
    public function remove($controllerName, $actionName)
    {
        list($controllerName, $actionName) = array(
            strtolower($controllerName),
            strtolower($actionName),
        );

        static::$access[$controllerName][$actionName] = false;

        return $this;
    }

    /**
     * 尝试严重是否在白名单中.
     *
     * @param string $controllerName 控制器名称
     * @param string $actionName     动作名称
     *
     * @return bool true|false
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     **/
    public static function make($controllerName, $actionName)
    {
        static::getInstance();

        list($controllerName, $actionName) = array(
            strtolower($controllerName),
            strtolower($actionName),
        );

        /* 明确查找 */
        if (
               isset(static::$access[$controllerName])
            && isset(static::$access[$controllerName][$actionName])
            && static::$access[$controllerName][$actionName]
        ) {
            return true;

        /* 二级模糊查找 */
        } elseif (
               isset(static::$access[$controllerName])
            && isset(static::$access[$controllerName]['*'])
            && static::$access[$controllerName]['*']
        ) {
            return true;

        /* 一级模糊查找 */
        } elseif (
               isset(static::$access['*'])
            && isset(static::$access['*'][$actionName])
            && static::$access['*'][$actionName]
        ) {
            return true;

        /* 全局不限制 */
        } elseif (
               isset(static::$access['*'])
            && isset(static::$access['*']['*'])
        ) {
            return true;
        }

        return false;
    }
} // END class Access extends Service
