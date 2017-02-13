<?php

namespace App\H5\Model;

use Ts\Bases\Model;
use AvatarModel as Avatar;
use CreditModel as OldTsCreditModel;
use Medz\Component\EmojiFormat;

/**
 * 用户数据模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class User extends Model
{
    protected $table = 'user';

    protected $primaryKey = 'uid';

    protected $softDelete = false;

    protected $hidden = array('password', 'login_salt');

    protected $appends = array('cover', 'face', 'username');

    protected static $instances = array();

    /**
     * 复用的存在用户范围.
     *
     * @param Illuminate\Database\Eloquent\Builder $query 查询器
     *
     * @return Illuminate\Database\Eloquent\Builder 查询器
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-04-15T23:31:40+0800
     * @homepage http://medz.cn
     */
    public function scopeExistent($query)
    {
        return $query->where('is_del', '=', 0);
    }

    /**
     * 复用的以审核通过的用户范围.
     *
     * @param Illuminate\Database\Eloquent\Builder $query 查询器
     *
     * @return Illuminate\Database\Eloquent\Builder 查询器
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-04-15T23:33:11+0800
     * @homepage http://medz.cn
     */
    public function scopeAudit($query)
    {
        return $query->where('is_audit', '=', 1);
    }

    public function scopeByPhone($query, $phone)
    {
        return $query->where('phone', '=', $phone);
    }

    public function scopeByUserName($query, $username)
    {
        $username = EmojiFormat::en($username);

        return $query->where('uname', '=', $username);
    }

    public function scopeByUid($query, $uid)
    {
        return $query->where('uid', '=', intval($uid));
    }

    public function scopeByEmail($query, $email)
    {
        return $query->where('email', '=', $email);
    }

    public function setUnameAttribute($username)
    {
        $this->attributes['uname'] = EmojiFormat::en($username);
    }

    public function getUnameAttribute($username)
    {
        return EmojiFormat::de($username);
    }

    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = md5(md5($password).$this->login_salt);
    }

    public function setFirstLetterAttribute($firstLetter)
    {
        $firstLetter = strtoupper(mb_substr($firstLetter, 0, 1));

        if (!preg_match('/^[a-zA-Z0-9](.*)/', $firstLetter)) {
            $firstLetter = '#';
        }

        $this->attributes['first_letter'] = $firstLetter;
    }

    public function setSearchKeyAttribute($key)
    {
        $this->attributes['search_key'] = EmojiFormat::en($key);
    }

    public function getSearchKeyAttribute($key)
    {
        return EmojiFormat::de($key);
    }

    public function setIntroAttribute($intro)
    {
        $this->attributes['intro'] = EmojiFormat::en($intro);
    }

    public function getIntroAttribute($intro)
    {
        return EmojiFormat::de($intro);
    }

    public function getUsernameAttribute()
    {
        return $this->uname;
    }

    public function setUsernameAttribute($username)
    {
        $this->uname = $username;
    }

    /**
     * 取得用户卡片数据.
     *
     * @return object 数据对象
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-04-15T23:34:52+0800
     * @homepage http://medz.cn
     */
    public function getCardAttribute()
    {
        return (object) array(
            'face' => $this->face->avatar_big,
            'username' => $this->uname,
            'intro' => $this->intro,
        );
    }

    public function getVideoNumAttribute()
    {
        return $this->videos()->count();
    }

    public function getCoverAttribute()
    {
        $bg = $this
            ->datas()
            ->key('application_user_cover')
            ->first()
            ->cover
        ;

        if (!$bg) {
            return false;
        }

        return $bg;
    }

    /**
     * 获取当前查询用户的头像.
     *
     * @return object 用户头像数据
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-21T13:22:39+0800
     * @homepage http://medz.cn
     */
    public function getFaceAttribute()
    {
        $classNamme = 'Avatar';
        if (!isset(static::$instances[$classNamme]) || !static::$instances[$classNamme] instanceof Avatar) {
            static::$instances[$classNamme] = new Avatar();
        } elseif (!$this->uid) {
            return $this;
        }

        return (object) static::$instances[$classNamme]
            ->init($this->uid)
            ->getUserAvatar()
        ;
    }

    public function getCreditAttribute()
    {
        if (!isset(static::$instances['OldTsCreditModel']) || !static::$instances['OldTsCreditModel'] instanceof OldTsCreditModel) {
            static::$instances['OldTsCreditModel'] = new OldTsCreditModel();
        }

        return static::$instances['OldTsCreditModel']->getUserCredit($this->uid);
    }

    public function getLevelImgAttribute()
    {
        return $this->credit['level']['src'];
    }

    public function videos()
    {
        return $this->hasMany('App\\H5\\Model\\Video', 'uid', 'uid');
    }

    public function photos()
    {
        return $this
            ->hasMany('App\\H5\\Model\\Attach', 'uid', 'uid')
            ->byType('feed_image')
            ->orderBy('attach_id', 'desc')
        ;
    }

    /**
     * 用户用户组关系字段.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-22T11:15:40+0800
     * @homepage http://medz.cn
     */
    public function group()
    {
        return $this->belongsTo('App\\H5\\Model\\UserGroupLink', 'uid', 'uid');
    }

    public function datas()
    {
        return $this->hasMany('App\\H5\\Model\\UserData', 'uid');
    }

    public function medals()
    {
        return $this->hasMany('App\\H5\\Model\\MedalUser', 'uid', 'uid');
    }

    /* 粉丝 */
    public function followers()
    {
        return $this->hasMany('App\\H5\\Model\\UserFollow', 'fid', 'uid');
    }

    /* 关注的用户 */
    public function followings()
    {
        return $this->hasMany('App\H5\\Model\\UserFollow', 'uid', 'uid');
    }

    public function tags()
    {
        return $this
            ->hasMany('App\\H5\\Model\\AppTag', 'row_id', 'uid')
            ->byApp('public')
            ->byTable('user')
        ;
    }

    /**
     * 检查用户是否否关注了内容用户.
     *
     * @param int $uid 需要检查的用户
     *
     * @return bool
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-22T13:02:20+0800
     * @homepage http://medz.cn
     */
    public function followStatus($uid)
    {
        return $this->uid == $uid
            ?: (bool) $this->followers()
                ->where('uid', '=', $uid)
                ->count(array('follow_id'))
        ;
    }

    public function checkPassword($password)
    {
        return $this->password == md5(md5($password).$this->login_salt);
    }
} // END class User extends Model
