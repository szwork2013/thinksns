<?php

namespace App\H5\Model;

use Ts\Bases\Model;
use Medz\Component\EmojiFormat;

/**
 * 微吧帖子数据模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class WeibaPost extends Model
{
    protected $table = 'weiba_post';

    /**
     * 主键名称.
     *
     * @var string
     */
    protected $primaryKey = 'post_id';

    /**
     * 关闭软删除.
     *
     * @var bool
     */
    protected $softDelete = false;

    /**
     * 微吧关系字段.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-22T11:12:18+0800
     * @homepage http://medz.cn
     */
    public function weiba()
    {
        return $this->belongsTo('App\\H5\\Model\\Weiba', 'weiba_id');
    }

    public function user()
    {
        return $this->belongsTo('App\\H5\Model\\User', 'post_uid', 'uid');
    }

    public function feed()
    {
        return $this->hasOne('App\\H5\\Model\\Feed', 'feed_id', 'feed_id');
    }

    public function diggs()
    {
        return $this->hasMany('App\\H5\\Model\\PostDigg', 'post_id', 'post_id');
    }

    public function replys()
    {
        return $this->hasMany('APP\\h5\\Model\\PostReply', 'post_id', 'post_id');
    }

    public function scopeExistent($query)
    {
        return $query->where('is_del', '=', 0);
    }

    public function scopeByPostId($query, $postId)
    {
        return $query->where('post_id', '=', $postId);
    }

    public function setContentAttribute($content)
    {
        $this->attributes['content'] = EmojiFormat::en($content);
    }

    public function getContentAttribute($value)
    {
        $value = static::formatEmoji($value);
        $value = EmojiFormat::de($value);

        return $value;
    }

    public function setTitleAttribute($title)
    {
        $this->attributes['title'] = EmojiFormat::en($title);
    }

    public function getTitleAttribute($title)
    {
        return EmojiFormat::de($title);
    }

    /**
     * 取得保留表情的格式化简介
     * 保留帖子表情.
     *
     * @return string 格式化后的内容
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-04-11T02:31:40+0800
     * @homepage http://medz.cn
     */
    public function getSimpleContentAttribute()
    {
        $data = $this->content;
        $data = preg_replace('/<img class="emoji" src="(.*?)">/is', '[e:$1]', $data);
        $data = t($data);
        $data = mb_substr($data, 0, 255);
        $data = preg_replace('/\[e\:(.*?)\]/is', '<img class="emoji" src="$1">', $data);

        return $data;
    }

    // public function getThContentAttribute()
    // {
    //     return mb_substr($this->simpleContent, 0, 255);
    // }

    public function getImagesAttribute()
    {
        return static::getImages($this->content, 3);
    }

    public function getImageContentAttribute()
    {
        $data = $this->content;
        $data = preg_replace('/\<[\/]?p\>/is', '', $data);
        $data = preg_replace('/<img class="emoji" src="(.*?)">/is', '[:$1:]', $data);
        $data = preg_replace('/\<img(.*?)src="(.*?)"(.*?)\>/is', '<img src="$2" style="width: 100%; height:auto;">', $data);
        $data = preg_replace('/\[\:(.*?)\:\]/is', '<img class="emoji" src="$1">', $data);

        return $data;
    }

    /**
     * 帖子表情解析.
     *
     * @param string $data 数据
     *
     * @return string 解析后的数据
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-04-11T01:15:24+0800
     * @homepage http://medz.cn
     *
     * <img src="http://thinksns.local.medz.cn/addons/theme/stv1/_static/js/um/dialogs/emotion/images/location/12.gif" _src="http://thinksns.local.medz.cn/addons/theme/stv1/_static/js/um/dialogs/emotion/images/location/12.gif"/>
     */
    public static function formatEmoji($data)
    {
        $data = preg_replace_callback(
            '/\<img(.*?)src=\"(.*?)\"(.*?)\>/is',
            function ($data) {
                if (preg_match('/http(s?)\:\/\/(.*?)dialogs\/emotion(.*)/is', $data[2], $data['emoji'])) {
                    return sprintf('<img class="emoji" src="%s">', $data['emoji'][0]);
                }

                return $data[0];
            },
            $data
        );

        return $data;
    }

    /**
     * 获取帖子内容的图片.
     *
     * @param string $data 帖子数据
     * @param int    $num  获取的数量
     *
     * @return array 图片列表
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-04-11T02:00:26+0800
     * @homepage http://medz.cn
     */
    public static function getImages($data, $num = 3)
    {
        // 需要把内容的表情格式化
        $data = static::formatEmoji($data);

        preg_match_all('/\<img(.*?)src=\"(.*?)\"(.*)\_src=\"(.*?)\"(.*?)\>/is', $data, $data);

        $data = $data[2];

        return array_slice($data, 0, $num);
    }
} // END class WeibaPost extends Model
