<?php

namespace App\H5\Controller;

use App\H5\Common;
use App\H5\Error;
use App\H5\Base\Controller;
use App\H5\Service\Sign as SignService;
use App\H5\Model;
use Pinyin;
use Illuminate\Database\QueryException;

/**
 * 用户认证模块.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class Sign extends Controller
{
    const APP_ID = 'wxc50b6d3673d0c77f';
    const APP_SECREF = 'a83b0a82238b53098cd18607d2c4ead7';

    public function weixinAction()
    {
        $openId = session('wx_open_id');
        $redirectUri = urlencode(U('h5/sign/weixin'));
        $code = Common::getInput('code');

        if (/*!$openId && */!$code) {
            $oauth2Url = sprintf('https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect', static::APP_ID, $redirectUri);
            redirect($oauth2Url);
        // } elseif ($openId) {
            # code...
        } elseif ($code) {
            // 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code '
            $data = file_get_contents(sprintf('https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code', static::APP_ID, static::APP_SECREF, $code));
            $data = json_decode($data);
            session('wx_open_id', $data->openid);
        }

        U('h5/sign/up', '', true);
    }

    public function checkPhoneAction()
    {
        $phone = Common::getInput('phone');
        $this->trace('type', 'phone');

        if (!$phone) {
            $this->error('请输入手机号码！', true);
        } elseif (!\MedzValidator::isTelNumber($phone)) {
            $this->error('手机号码不正确', true);
        } elseif (Model\User::existent()->byPhone($phone)->count()) {
            $this->error('该手机号码已被注册！', true);
        }

        $this->success('可以注册！', true);
    }

    public function checkPhoneCodeAction()
    {
        list($phone, $code) = Common::getInput(array('phone', 'code'));
        $this->trace('type', 'phone');

        if (!$phone) {
            $this->error('非法操作！', true);
        } elseif (!model('Sms')->CheckCaptcha($phone, $code)) {
            $this->error(model('Sms')->getMessage(), true);
        }

        $this->success('success', true);
    }

    public function checkUserNameAction()
    {
        $username = Common::getInput('username');
        $this->trace('type', 'username');

        if (!$username) {
            $this->error('用户名不能为空！', true);
        } elseif (Model\User::byUserName($username)->count()) {
            $this->error('该用户名已被使用！', true);
        }

        $this->success('success', true);
    }

    public function sendPhoneCodeAction()
    {
        $phone = Common::getInput('phone');

        if (!$phone) {
            $this->trace('type', 'phone');
            $this->error('请输入手机号码！', true);
        } elseif (!\MedzValidator::isTelNumber($phone)) {
            $this->trace('type', 'phone');
            $this->error('手机号码不正确', true);
        } elseif (Model\User::existent()->byPhone($phone)->count()) {
            $this->trace('type', 'phone');
            $this->error('该手机号码已被注册！', true);
        } elseif (!model('Sms')->sendCaptcha($phone, false)) {
            $this->trace('type', 'dialog');
            $this->error(model('Sms')->getMessage(), true);
        }

        $this->success('success', true);
    }

    public function signInUserAction()
    {
        list($phone, $code, $username, $password) = Common::getInput(array('phone', 'code', 'username', 'password'), 'post');
        $this->trace('type', 'dialog');

        if (!$phone) {
            $this->trace('type', 'phone');
            $this->error('手机号码不能为空！', true);
        } elseif (!$code) {
            $this->trace('type', 'code');
            $this->error('验证码不能为空！', true);
        } elseif (!$username) {
            $this->trace('type', 'username');
            $this->error('用户名不能为空！', true);
        } elseif (!$password) {
            $this->trace('type', 'password');
            $this->error('密码不能为空！', true);
        } elseif (!model('Sms')->CheckCaptcha($phone, $code)) {
            $this->trace('type', 'code');
            $this->error(model('Sms')->getMessage(), true);
        } elseif (Model\User::existent()->byPhone($phone)->count()) {
            $this->trace('type', 'phone');
            $this->error('该手机号码已被注册！', true);
        } elseif (Model\User::byUserName($username)->count()) {
            $this->trace('type', 'username');
            $this->error('该用户名已被使用！', true);
        } else {
            $user = new Model\User;
            $user->phone = $phone;
            $user->uname = $username;
            $user->login_salt = rand(10000, 99999);
            $user->password = $password;
            $user->sex = 0;
            $user->is_audit = 1;
            $user->is_active = 1;
            $user->is_init = 1;
            $user->identity = 1;
            $user->ctime = time();
            $user->domain = '';
            $user->province = 0;
            $user->city = 0;
            $user->area = 0;
            $user->is_del = 0;
            $user->last_post_time = 0;
            $user->is_fixed = 1;
            $user->first_letter = Pinyin::getShortPinyin($username);
            $user->search_key = sprintf('%s %s', $username, Pinyin::getPinyin($username));

            try {
                $user->save();
                $uid = $user->uid;

                model('Credit')->setUserCredit($uid, 'init_default');

                $registerConfig = model('Xdata')->get('admin_Config:register');
                $userGroup = empty($registerConfig['default_user_group']) ? C('DEFAULT_GROUP_ID') : $registerConfig['default_user_group'];
                model('UserGroupLink')->domoveUsergroup($uid, implode(',', $userGroup));

                $this->success('success', true);
            } catch (QueryException $e) {
                $this->trace('type', 'dialog');
                $this->error($e->getMessage(), true);
            } catch (\BadMethodCallException $e) {
                $this->trace('type', 'dialog');
                $this->error($e->getMessage(), true);
            } catch (\Exception $e) {
                $this->trace('type', 'dialog');
                $this->error($e->getMessage(), true);
            }
        }
    }

    /**
     * 用户签字认证
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    public function upAction()
    {
        $this->setTitle('登录')
             ->display('sign-up');
    }

    /**
     * 执行登录.
     *
     * @request string user     用户登录标识 userName | email | phone
     * @request string password 用户登录密码
     *
     * @author Seven Du <lovevipdsw@vip.qq.com>
     **/
    public function doLoginAction()
    {
        list($user, $password) = Common::getInput(array('user', 'password'), 'post');
        if (($error = SignService::getInstance()->userLogin($user, $password)) instanceof Error) {
            $this->error($error->getError(), true);
        }

        $this->trace('uid', $error);
        $this->success('登录成功！', true);
    }

    public function outAction()
    {
        model('Passport')->logoutLocal();
        session('wx_open_id', null);
        $_SESSION['mid'] = $_SESSION['uid'] = 0;
        $this->success('注销成功！', true);
    }
} // END class Sign extends Controller
