<?php

namespace App\H5\Model;

use Ts\Bases\Model;

/**
 * 微博分享模型.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class Feed extends Model
{
    /**
     * 表名称.
     *
     * @var string
     */
    protected $table = 'feed';

    /**
     * 主键名称.
     *
     * @var string
     */
    protected $primaryKey = 'feed_id';

    /**
     * 关闭软删除.
     *
     * @var bool
     */
    protected $softDelete = false;

    /**
     * 表限定字段.
     *
     * @var array
     */
    protected $fillable = array(
        'feed_id', 'uid', 'type',
        'app', 'app_row_table', 'app_row_id',
        'publish_time', 'id_del', 'from',
        'comment_count', 'repost_count', 'comment_all_count',
        'digg_count', 'is_audit', 'latitude',
        'longitude', 'address', 'is_recommend',
        'recommend_time',
    );

    protected $hidden = array('is_del');

    protected $appends = array('images', 'video');

    public function scopeByUser($query, $uid)
    {
        return $query->where('uid', '=', $uid);
    }

    public function scopeExistent($query, $isDel = 0)
    {
        return $query->where('is_del', '=', $isDel);
    }

    public function scopeByAudit($query, $isAudit = 1)
    {
        return $query->where('is_audit', '=', $isAudit);
    }

    /**
     * 属性获取方法.
     *
     * @param string $name 属性名称
     *
     * @return miexd
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-21T13:23:49+0800
     * @homepage http://medz.cn
     */
    public function __get($name)
    {
        if (in_array(strtolower($name), array('postimage', 'weiba_post', 'repost', 'post', 'postvideo', 'postfile'))) {
            return call_user_func(array($this, $name));
        }

        return parent::__get($name);
    }

    public function comments()
    {
        return $this->hasMany('App\\H5\\Model\\Comment', 'row_id', 'feed_id');
    }

    /**
     * 数据User关系.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-22T11:05:47+0800
     * @homepage http://medz.cn
     */
    public function user()
    {
        return $this->belongsTo('App\\H5\\Model\\User', 'uid');
    }

    /**
     * 帖子详情数据关系.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-22T11:07:59+0800
     * @homepage http://medz.cn
     */
    public function data()
    {
        return $this->hasOne('App\\H5\\Model\\FeedData');
    }

    /**
     * 微吧帖子关系.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-22T11:08:43+0800
     * @homepage http://medz.cn
     */
    public function weibapost()
    {
        return $this->belongsTo('App\\H5\\Model\\WeibaPost', 'app_row_id', 'post_id');
    }

    public function diggs()
    {
        return $this->hasMany('App\\H5\\Model\\FeedDigg');
    }

    public function diggFeedStatus($uid)
    {
        return !$uid
            ? false
            : (boolean) $this
                ->diggs()
                ->where('uid', '=', $uid)
                ->count()
        ;
    }

    public function getVideoAttribute()
    {
        if ($this->type != 'postvideo') {
            return null;
        } elseif ($this->data->feed_data_object->video_id) {
            return array(
                'image' => SITE_URL.$this->data->feed_data_object->image_path,
                'src' => SITE_URL.$this->data->feed_data_object->video_path,
                'type' => 'ts',
            );
        }

        return array(
            'image' => UPLOAD_URL.$this->data->feed_data_object->flashimg,
            'link' => $this->data->feed_data_object->source,
            'type' => 'vendor',
        );
    }

    public function getImagesAttribute()
    {
        if ($this->type != 'postimage') {
            return array();
        } elseif ($this->data->feed_data_object->content) {
            $this->data->feed_content = $this->data->feed_data_object->content;
        }

        $images = array();
        if (isset($this->data->feed_data_object->attach_id[0])) {
            $attachs = Attach::whereIn('attach_id', (array) $this->data->feed_data_object->attach_id)
                ->get()
            ;
            $count = $attachs->count();
            foreach ($attachs as $image) {
                switch ($count) {
                    case 1:
                        array_push($images, array(
                            'small' => $image->imagePath(400, 255),
                            'src' => $image->path,
                            'width' => $image->width,
                            'height' => $image->height,
                        ));
                        break;

                    case 2:
                        array_push($images, array(
                            'small' => $image->imagePath(300, 300),
                            'src' => $image->path,
                            'width' => $image->width,
                            'height' => $image->height,
                        ));
                        break;

                    default:
                        array_push($images, array(
                            'small' => $image->imagePath(200, 200),
                            'src' => $image->path,
                            'width' => $image->width,
                            'height' => $image->height,
                        ));
                        break;
                }
            }
        }

        return $images;
    }

    /**
     * 图片分享关系字段.
     *
     * @return array
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-22T11:09:03+0800
     * @homepage http://medz.cn
     */
    public function postimage()
    {
        $_temp = array();

        $data = (object) unserialize($this->data->feed_data);

        $_temp['content'] = $this->data->feed_content;
        if (!$_temp['content']) {
            $_temp['content'] = $data->content ?: $data->body;
        }

        $_temp['image_count'] = count((array) $data->attach_id);
        $_temp['images'] = array();
        $_temp['image_ids'] = implode(',', (array) $data->attach_id);

        $_temp['image_count'] > 9 && $_temp['image_count'] = 'n';

        if ($_temp['image_count'] <= 0) {
            return array();
        }

        $i = 1;
        foreach (
            Attach::whereIn('attach_id', (array) $data->attach_id)
                ->select(array('save_path', 'save_name'))
                ->get()
            as $value
        ) {
            switch ($_temp['image_count']) {
                case '1':
                    array_push($_temp['images'], $value->imagePath(400, 225));
                    break;

                case '2':
                    array_push($_temp['images'], $value->imagePath(300, 300));
                    break;

                case '5':
                    if ($i = 1 || $i = 2) {
                        array_push($_temp['images'], $value->imagePath(200, 200));
                        break;
                    }
                    array_push($_temp['images'], $value->imagePath(200, 200));
                    break;

                case '3':
                case '4':
                case '6':
                case '9':
                case 'n':
                default:
                    array_push($_temp['images'], $value->imagePath(200, 200));
                    break;
            }
        }

        unset($data);

        return $_temp;
    }

    /**
     * 微吧帖子类型分享字段.
     *
     * @return array
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-22T11:09:40+0800
     * @homepage http://medz.cn
     */
    public function weiba_post()
    {
        // 帖子内容的一系列处理
        $content = $this->weibapost->content;
        $content = strip_tags($content);
        $content = trim($content);

        return array(
            'weiba_name' => $this->weibapost->weiba->weiba_name,
            'title' => $this->weibapost->title,
            'content' => $content,
        );
    }

    public function getWeibaRepostAttribute()
    {
        $data = array();
        $_data = (object) unserialize($this->data->feed_data);
        $data['content'] = $_data->content ?: $_data->body;

        return $data;

        var_dump($data);
        var_dump($this->data);
        var_dump($this->toArray());
        exit;
    }

    /**
     * 转发分享关系字段.
     *
     * @return array
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-22T11:10:00+0800
     * @homepage http://medz.cn
     */
    public function repost()
    {
        $feed = static::where('is_del', '=', 0)
            ->find($this->app_row_id)
        ;

        if (!$feed) {
            return array(
                'row' => false,
            );
        }

        $data = array(
            'row' => array(
                'username' => $feed->user->uname,
                'time' => date('y-m-d H:i', $feed->publish_time),
            ),
        );

        $data['row'] = array_merge($data['row'], (array) $feed->{$feed->type});

        $data['content'] = $feed->content ?: $feed->body;

        $data['content'] = $this->data->feed_content;
        if (!$data['content']) {
            $_data = (object) unserialize($this->data->feed_data);
            $data['content'] = $_data->content ?: $_data->body;
            unset($_data);
        }

        return $data;
    }

    /**
     * 普通分享关系字段.
     *
     * @return array
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-22T11:10:26+0800
     * @homepage http://medz.cn
     */
    public function post()
    {
        $data = array(
            'content' => $this->data->feed_content,
        );

        if (!$data['content']) {
            $_data = (object) unserialize($this->data->feed_data);
            $data['content'] = $_data->content ?: $_data->body;
            unset($_data);
        }

        return $data;
    }

    /**
     * 视频分享关系字段.
     *
     * @return array
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-03-22T11:10:47+0800
     * @homepage http://medz.cn
     */
    public function postvideo()
    {
        $_temp = (object) unserialize($this->data->feed_data);

        $data = array(
            'content' => $this->data->feed_content,
            'row_type' => isset($_temp->video_id) ? 'upload' : 'vendor',
        );

        if (!$data['content']) {
            $data['content'] = $_temp->content ?: $_temp->body;
        }

        if ($data['row_type'] == 'vendor') {
            $data['image'] = getImageUrl($_temp->flashimg);
            $data['url'] = $_temp->source;
        } else {
            $data['image'] = SITE_URL.$_temp->image_path;
            $data['url'] = SITE_URL.$_temp->video_path;
        }

        return $data;
    }

    public function postfile()
    {
        $_temp = (object) unserialize($this->data->feed_data);

        $data = array(
            'content' => $this->data->feed_content,
            'file_count' => count((array) $_temp->attach_id),
            'files' => array(),
        );

        if (!$data['content']) {
            $data['content'] = $_temp->content ?: $_temp->body;
        }

        foreach (
            Attach::whereIn('attach_id', (array) $_temp->attach_id)
                ->select('name', 'size', 'save_path', 'save_name')
                ->get()
            as $file
        ) {
            array_push($data['files'], array(
                'name' => $file->name,
                'size' => byte_format($file->size),
                'path' => $file->path,
            ));
        }

        return $data;
    }
} // END class Feed extends Model
