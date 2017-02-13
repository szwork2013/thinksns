<?php

namespace App\H5;

defined('SITE_PATH') || exit('Forbidden');
/**
 * 公用库.
 *
 * @author Seven Du <lovevipdsw@vip.qq.com>
 **/
class Common
{
    /**
     * 文件加载列表.
     *
     * @var array
     **/
    protected static $_includes = array();

    /**
     * 加载的文件对象列表.
     *
     * @var array
     **/
    protected static $_loads = array();

    /**
     * 加载文件.
     *
     * @param string $filePath 文件地址
     *
     * @return bool
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    public static function import($filePath)
    {
        $filePath = str_replace('\\', DIRECTORY_SEPARATOR, $filePath);
        $filePath = str_replace('/', DIRECTORY_SEPARATOR, $filePath);

        if (in_array($filePath, self::$_includes)) {
            return true;
        } elseif (file_exists($filePath)) {
            array_push(self::$_includes, $filePath);

            return include $filePath;
        }

        return false;
    }

    /**
     * 根据命名空间加载并返回实例.
     *
     * @param string $namespace 命名空间
     *
     * @return object
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    public static function load($namespace)
    {
        if (self::$_loads[$namespace]) {
            return self::$_loads[$namespace];
        } elseif (self::autoLoader($namespace)) {
            self::$_loads[$namespace] = new $namespace();

            return self::$_loads[$namespace];
        }

        return false;
    }

    /**
     * 设置头部文本输出类型.
     *
     * @param string $type    设置文本类型
     * @param string $charset 设置字符集
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    public function setHeader($type = 'text/html', $charset = 'utf-8')
    {
        header('Content-type:'.$type.';charset='.$charset);
    }

    /**
     * 获取表单数据.
     *
     * @param string|array $name 数组或者键名，不传则返回所有数据
     * @param string 获取的类型 默认只有request|get|post三种
     *
     * @return data 返回的数据
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    public static function getInput($name = null, $method = 'request')
    {
        $method = strtolower($method);
        if (is_array($name)) {
            foreach ($name as $key => $value) {
                $name[$key] = self::getInput($value, $method);
            }

            return $name;
        } elseif (!$name && $method == 'get') {
            return $_GET;
        } elseif (!$name && $method == 'post') {
            return $_POST;
        } elseif (!$name && $method == 'request') {
            return $_REQUEST;
        } elseif ($method == 'get' && isset($_GET[$name])) {
            return $_GET[$name];
        } elseif ($method == 'post' && isset($_POST[$name])) {
            return $_POST[$name];
        } elseif (isset($_REQUEST[$name])) {
            return $_REQUEST[$name];
        }

        return;
    }

    /**
     * 求取字符串位数（非字节），以UTF-8编码长度计算.
     *
     * @param string $string 需要被计算位数的字符串
     *
     * @return int
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    public static function strlen($string)
    {
        $length = strlen($string);
        $index = $num = 0;
        while ($index < $length) {
            $str = $string[$index];
            if ($str < "\xC0") {
                $index += 1;
            } elseif ($str < "\xE0") {
                $index += 2;
            } elseif ($str < "\xF0") {
                $index += 3;
            } elseif ($str < "\xF8") {
                $index += 4;
            } elseif ($str < "\xFC") {
                $index += 5;
            } else {
                $index += 6;
            }
            $num += 1;
        }

        return $num;
    }

    /**
     * 更具表达式返回内容.
     *
     * @param PHP condition $condition PHP条件
     * @param unknow        $yes       表达式成立返回内容
     * @param unknow        $no        表达式不成立返回内容
     *
     * @return unkonw
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    public static function hasEcho($condition, $yes = '', $no = '')
    {
        return $condition ? $yes : $no;
    }

    public static function isAjax()
    {
        if (isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
            if ('xmlhttprequest' == strtolower($_SERVER['HTTP_X_REQUESTED_WITH'])) {
                return true;
            }
        }
        if (!empty($_POST[C('VAR_AJAX_SUBMIT')]) || !empty($_GET[C('VAR_AJAX_SUBMIT')])) {
            return true;
        }

        return false;
    }

    /**
     * 上传文件
     *
     * @param string $uploadType 上传文件的类型
     * @param string $attachType 保存文件的类型
     * @param string [$param, $param ...] 限制文件上传的类型
     * @return array
     * @author Medz Seven <lovevipdsw@outlook.com>
     **/
    public function uploadFile($uploadType, $attachType)
    {
        $ext = func_get_args();
        array_shift($ext);
        array_shift($ext);

        $option = array(
            'attach_type' => $attachType,
        );
        count($ext) and $option['allow_exts'] = implode(',', $ext);

        $info = model('Attach')->upload(array(
            'upload_type' => $uploadType,
        ), $option);

        return $info;
    }

    /**
     * 发送邮件通知.
     *
     * @param int    $uid     用户UID
     * @param string $content 发送的内容
     * @param int    $formUid 发送给用户的UID
     *
     * @return bool 是否成功
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-16T17:35:53+0800
     * @homepage http://medz.cn
     */
    public static function sendMessage($uid, $content, $formUid = 0)
    {
        $message = D('notify_message');

        $messageData = array();
        $messageData['uid'] = $uid;
        $messageData['from_uid'] = $formUid;
        $messageData['appname'] = 'h5';
        $messageData['title'] = 'Web Application';
        $messageData['ctime'] = time();
        $messageData['is_read'] = '0';
        $messageData['body'] = $content;

        return $message->add($messageData);
    }
} // END class Common
