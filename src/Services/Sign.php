<?php

namespace App\H5\Service;

use App\H5\Error;
use App\H5\Base\Service;

/**
 * 用户登录serbice.
 *
 * @author Seven Du <lovevipdsw@vip.qq.com>
 **/
class Sign extends Service
{
    /**
     * 用户登录模块.
     *
     * @param string $user     用户登录标识
     * @param string $password
     *
     * @return new Error|boolean
     *
     * @author SevenＤu <lovevipdsw@outlok.com>
     **/
    public function userLogin($user, $password)
    {
        /* 检查用户标识是否为空 */
        if (!$user) {
            return new Error(array(
                'status' => 2,
                'message' => '用户名不能为空！',
            ));

        /* 检查密码是否为空 */
        } elseif (!$password) {
            return new Error(array(
                'status' => 3,
                'message' => '密码不能为空！',
            ));

        /* 检查用户是否存在 */
        } elseif (!($users = model('User')->hasUser($user)) || !$users->count()) {
            return new Error(array(
                'status' => 2,
                'message' => '当前登录的用户不存在！',
            ));

        /* 执行用户登录 */
        } else {
            foreach ($users as $user) {
                if ($user->checkPassword($password) === true) {
                    model('Passport')->noPasswordLogin($user->uid, true);

                    return $user->uid;
                }
            }
        }

        // } elseif (!model('Passport')->loginLocal($user, $password, true)) {
        //     return new Error(model('Passport')->getError());
        // }

        $error = model('Passport')->getError();

        return new Error(array(
            'status' => 1,
            'message' => $error ? $error : '用户名或密码错误',
        ));
    }

    /**
     * service前置执行方法.
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     **/
    protected function _beforeAction()
    {
    }
} // END class Sign extends Service
