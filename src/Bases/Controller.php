<?php

namespace App\H5\Base;

use Ts\Bases\Controller as BaseController;
use App\H5\Common;
use App\H5\Service\Access;
use App\H5\Model;

/**
 * 控制器基类.
 *
 * @author Seven Du <lovevipdsw@vip.qq.com>
 **/
abstract class Controller extends BaseController
{
    protected function classConstructBefore()
    {
        /* is main */
        $this->trace('_home_', strtolower(MODULE_NAME) == 'index' && strtolower(ACTION_NAME) == 'index');
        $this->trace('_discover_', strtolower(MODULE_NAME) == 'discover' && strtolower(ACTION_NAME) == 'index');
        $this->trace('_message_', strtolower(MODULE_NAME) == 'message' && strtolower(ACTION_NAME) == 'index');
        $this->trace('_user_', strtolower(MODULE_NAME) == 'user' && strtolower(ACTION_NAME) == 'index');
    }

    /**
     * 初始化方法.
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    protected function classConstructAfter()
    {
        Common::setHeader('text/html');

        $face = array();
        $username = '';
        if (
            !$this->mid &&
            method_exists($this, sprintf('%sAction', ACTION_NAME)) &&
            Access::make(MODULE_NAME, ACTION_NAME) === false
        ) {
            $this->error('请先登录！', false, '#/sign/up', 1);
        } elseif ($this->mid) {
            $user = Model\User::find($this->mid);
            $face = $user->face;
            $username = $user->uname;
        }
        $this->trace('face', $face);
        $this->trace('username', $username);
    }

    /**
     * 设置网页标题.
     *
     * @param string $title 网页标题
     *
     * @return self object
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     **/
    public function setTitle($title = '')
    {
        $this->trace('_title', $title);

        return $this;
    }

    /**
     * 设置网页关键词.
     *
     * @param array|string $keywords 关键词
     *
     * @return self
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     **/
    public function setKeywords($keywords = '')
    {
        is_array($keywords) and
        $keywords = implode(',', $keywords);
        $this->trace('_keywords', $keywords);

        return $this;
    }

    /**
     * 设置网页描述.
     *
     * @param string $description 描述
     *
     * @return self
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     **/
    public function setDescription($description = '')
    {
        $this->trace('_description', $description);

        return $this;
    }

    /**
     * 将设置的传递变量以json方式输出.
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    protected function __json__($data = false)
    {
        ob_end_clean();
        ob_start(function ($buffer, $mode) {
            if (extension_loaded('zlib') and function_exists('ob_gzhandler')) {
                return ob_gzhandler($buffer, $mode);
            }

            return $buffer;
        });
        Common::setHeader('application/json');
        echo json_encode(
            $data !== false ? $data : $this->trace
        );
        ob_end_flush();
        exit;
    }

    protected function trace($name, $value = '')
    {
        parent::trace($name, $value);

        return $this;
    }

    /**
     * 渲染视图，封装对ajax请求的支持
     *
     * @param string $templateFile 模板文件
     *
     * @return miexd
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-21T11:53:55+0800
     * @homepage http://medz.cn
     */
    protected function display()
    {
        /* 不支持javascript的时候调的页面 */
        Common::getInput('act') == 'noscript' and
        $this->noscript();

        $this->tVar = array_merge($this->tVar, $this->trace);

        echo $this->fetch(dirname(dirname(__DIR__)).'/dist/index.html', 'utf-8', 'text/html');
    }

    /**
     * 显示错误消息.
     *
     * @param string $message  消息
     * @param bool   $isAjax   是否是异步返回
     * @param string $jumpUrl  跳转地址
     * @param int    $jumpTime 跳转等待时间 秒
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    protected function error($message, $isAjax = false, $jumpUrl = null, $jumpTime = 3)
    {
        $this->setTitle('Error');
        $jumpTime < 0 and
        $jumpTime = 3;
        $this->trace(array(
            'status' => 0,
            'message' => $message,
            'jumpUrl' => $jumpUrl,
            'jumpTime' => intval($jumpTime),
        ));
        $this->__json__();
    }

    /**
     * 显示正确消息.
     *
     * @param string $message  消息
     * @param bool   $isAjax   是否是异步返回
     * @param string $jumpUrl  跳转地址
     * @param int    $jumpTime 跳转等待时间 秒
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    protected function success($message, $isAjax = false, $jumpUrl = null, $jumpTime = 3)
    {
        $this->setTitle('Success');
        $jumpTime < 0 and
        $jumpTime = 3;
        $this->trace(array(
            'status' => 1,
            'message' => $message,
            'jumpUrl' => $jumpUrl,
            'jumpTime' => intval($jumpTime),
        ));
        $this->__json__();
    }

    /**
     * 网页404消息输出
     * 兼容底层基类.
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     **/
    protected function page404($message)
    {
        $this->error($message);
    }

    /**
     * 不支持JavaScript执行的控制器.
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    public function noscript()
    {
        parent::display(__DIR__.'/../../dist/noscript.html');
    }

    /**
     * 重载方法之前.
     *
     * @param string $method 操作方法
     *
     * @return true
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     **/
    protected function classCallBefore($method)
    {
        $this->error(sprintf('当前访问的动作“%s”不存在。', $method));

        return true;
    }
} // END abstract class Controller extends BaseController
