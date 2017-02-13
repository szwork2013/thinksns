<?php

namespace App\H5\Controller;

use App\H5\Base\Controller;
use App\H5\Model;
use App\H5\Common;
use Pinyin;
use Illuminate\Database\Capsule\Manager as Capsule;

/**
 * 用户控制器.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class User extends Controller
{
    public function showDataAction()
    {
        $username = Common::getInput('username');
        $info = Model\User::existent()
            ->byUserName($username)
            ->first()
        ;

        if (!$info) {
            $this->error('用户不存在!', true);
        }

        $info->load(array(
            'datas' => function ($query) {
                $query->whereIn('key', array('follower_count', 'following_count'));
            },
            'medals' => function ($query) {
                $query->take(10);
            },
            'medals.info',
            'photos' => function ($query) {
                $query->take(4);
            },
            'videos' => function ($query) {
                $query->take(4);
            },
            'followers' => function ($query) {
                $query->take(7);
            },
            'followings' => function ($query) {
                $query->take(7);
            },
            'followers.byFollower',
            'followings.byFollowing',
        ));

        $user = array(
            'status' => true,
            'uid' => $info->uid,
            'username' => $info->username,
            'intro' => $info->intro ?: '暂无简介！',
            'face' => $info->face->avatar_big,
            'sex' => $info->sex,
            'levelImg' => $info->levelImg,
            'location' => $info->location,
            'followCount' => 0,
            'starCount' => 0,
            'medals' => array(),
            'photoCount' => $info->photos()->count(),
            'videoCount' => $info->videos()->count(),
            'photos' => array(),
            'videos' => array(),
            'backgroundImage' => $info->cover,
            'followUsers' => array(),
            'starUsers' => array(),
            'is_me' => $this->mid == $info->uid,
            'followStatus' => $info->followStatus($this->mid),
        );

        foreach ($info->datas as $data) {
            if ($data['key'] == 'follower_count') {
                $user['followCount'] = $data['value'];
            } elseif ($data['key'] == 'following_count') {
                $user['starCount'] = $data['value'];
            }
        }

        foreach ($info->medals as $medal) {
            array_push($user['medals'], $medal->info->src);
        }

        foreach ($info->photos as $photo) {
            array_push($user['photos'], $photo->path);
        }

        foreach ($info->videos as $video) {
            array_push($user['videos'], array(
                'src' => $video->video_path,
                'img' => $video->image_path,
            ));
        }

        $info->followers->each(function ($follower) use (&$user) {
            array_push($user['followUsers'], array(
                'uid' => $follower->by_follower->uid,
                'username' => $follower->by_follower->username,
                'face' => $follower->by_follower->face->avatar_middle,
            ));
        });

        $info->followings->each(function ($following) use (&$user) {
            array_push($user['starUsers'], array(
                'uid' => $following->by_following->uid,
                'username' => $following->by_following->username,
                'face' => $following->by_following->face->avatar_middle,
            ));
        });

        /*var_dump($user);
        exit;*/

        $this->__json__($user);
    }

    public function dataAction()
    {
        $this->mid or
        $this->error('请先登录！', true);

        $user = Model\User::find($this->mid);

        if (!$user) {
            $this->error('系统异常，请刷新重试!', true);
        }

        $user->load(array(
            'datas' => function ($query) {
                $query->whereIn('key', array('feed_count', 'follower_count', 'following_count'));
            },
        ));

        $datas = $user->datas->toArray();
        foreach ($datas as $key => $value) {
            unset($datas[$key]);
            $datas[$value['key']] = $value;
        }

        $info = array();

        $info['uid'] = $user->uid;
        $info['username'] = $user->username;
        $info['face'] = $user->face->avatar_big;
        $info['intro'] = $user->intro ?: '暂无简介';
        $info['feedNum'] = $datas['feed_count']['value'];
        $info['followNum'] = $datas['following_count']['value'];
        $info['startNum'] = $datas['follower_count']['value'];

        $this->__json__($info);
    }

    public function infoAction()
    {
        $uid = Common::getInput('uid') ?: $this->mid;

        $uid <= 0 and
        $this->error('❌发生了错误！请返回重试。', true);

        $user = Model\User::existent()
            ->byUid($uid)
            ->first()
        ;

        !$user and
        $this->error('❌查看的用户不存在！', true);

        $user->load('tags', 'tags.tag');

        $data = array(
            'face' => $user->face->avatar_big,
            'username' => $user->username,
            'sex' => $user->sex,
            'location' => $user->location,
            'intro' => $user->intro,
            'tag' => array(),
        );

        foreach ($user->tags as $tagLink) {
            array_push($data['tag'], $tagLink->tag->name);
        }

        $data['tag'] = implode('、', $data['tag']);
        $data['level_img'] = $user->level_img;
        $data['credit'] = $user->credit['credit']['score']['value'];

        $this->__json__($data);
    }

    public function feedsAction()
    {
        list($max, $min, $uid) = Common::getInput(array('max', 'min', 'uid'));
        $uid ||
        $uid = $this->mid;

        $list = Model\Feed::existent()
            ->byAudit()
            ->byUser($uid)
            ->where(function ($query) use ($max, $min) {
                if ($max > 0) {
                    $query->where('feed.feed_id', '>', $max);
                } elseif ($min > 0) {
                    $query->where('feed.feed_id', '<', $min);
                }
            })
            ->whereIn('type', array('post', 'postvideo', 'repost', 'postfile', 'postimage'))
            ->take(10)
            ->orderBy('feed_id', 'desc')
            ->get()
        ;

        $list->load('user', 'data', 'user.group');

        $feeds = array();
        foreach ($list as $feed) {
            $val = array(
                'user' => array(
                    'uid' => $feed->user->uid,
                    'username' => $feed->user->uname,
                    'face' => $feed->user->face->avatar_middle,
                    'groupicon' => $feed->user->group->info->icon,
                ),
                'feed' => array(
                    'id' => $feed->feed_id,
                    'content' => $feed->data->feed_content,
                ),
                'date' => date('Y-m-d H:i', $feed->publish_time),
            );

            $val['feed']['from'] = $feed->from;
            $val['feed']['starNum'] = $feed->digg_count;
            $val['feed']['commentNum'] = $feed->comment_count;
            $val['feed']['starStatus'] = $feed->diggFeedStatus($this->mid);

            $val['images'] = $feed->images;
            $val['type'] = $feed->type;
            $val['video'] = $feed->video;

            array_push($feeds, $val);
        }

        $this->__json__($feeds);
    }

    public function photosAction()
    {
        list($uid, $max, $min) = Common::getInput(array('uid', 'max', 'min'));
        $attachs = Model\Attach::byUser($uid)
            ->byType('feed_image')
            ->orderBy('attach_id', 'desc')
            ->take(100)
            ->get()
        ;

        $photos = array();
        foreach ($attachs as $attach) {
            $photo = array(
                'width' => $attach->width,
                'height' => $attach->height,
                'src' => $attach->path,
                'aspectRatio' => $attach->width / $attach->height,
                'lightboxImage' => array(
                    'src' => $attach->path,
                ),
            );

            array_push($photos, $photo);
        }

        $this->__json__($photos);
    }

    /**
     * 关注
     */
    public function followingAction()
    {
        list($uid, $max, $min) = Common::getInput(array('uid', 'max', 'min'));

        $user = Model\User::existent()
            ->audit()
            ->byUid($uid)
            ->first()
        ;

        if (!$user) {
            $this->error('用户不存在！', true);
        }

        $user->load(array(
            'followings' => function ($query) {
                $query->orderBy('follow_id', 'desc');
            },
            'followings.byFollowing',
            'followings.byFollowing.followings' => function ($query) use ($uid) {
                $query->where('fid', '=', $uid);
            },
        ));

        $users = array();
        foreach ($user->followings as $following) {
            $val = array(
                'id' => $following->follow_id,
                'username' => $following->by_following->uname,
                'intro' => $following->by_following->intro ?: '暂无简介！',
                'face' => $following->by_following->face->avatar_big,
                'uid' => $following->by_following->uid,
                'state' => $following->by_following->followings->count() >= 1,
            );

            array_push($users, $val);
        }

        $this->__json__($users);
    }

    // 粉丝
    public function followerAction()
    {
        list($uid, $max, $min) = Common::getInput(array('uid', 'max', 'min'));

        $user = Model\User::existent()
            ->audit()
            ->byUid($uid)
            ->first()
        ;

        if (!$user) {
            $this->error('用户不存在！', true);
        }

        // $user->load('followers', 'followers.byFollower');
        $user->load(array(
            'followers' => function ($query) {
                $query->orderBy('follow_id', 'desc');
            },
            'followers.byFollower',
            'followers.byFollower.followers' => function ($query) use ($uid) {
                $query->where('uid', '=', $uid);
            },
        ));

        $users = array();
        foreach ($user->followers as $follower) {
            $val = array();
            $val['username'] = $follower->by_follower->uname;
            $val['intro'] = $follower->by_follower->intro ?: '暂无简介！';
            $val['face'] = $follower->by_follower->face->avatar_big;
            $val['uid'] = $follower->by_follower->uid;
            $val['state'] = $follower->by_follower->followers->count() >= 1;
            $val['id'] = $follower->follow_id;
            array_push($users, $val);
        }

        $this->__json__($users);
    }

    public function getFriendsAction()
    {
        $user = Model\User::find($this->mid);
        $user->load(array(
            'followings' => function ($query) {
                $query
                    ->join('user_follow as b', function ($query) {
                        $query
                            ->on(Capsule::raw('b.fid'), '=', 'user_follow.uid')
                            ->on(Capsule::raw('b.uid'), '=', 'user_follow.fid')
                        ;
                    })
                    ->select('user_follow.*')
                ;
            },
            'followings.byFollowing',
        ));

        $friends = array();
        $keys = array();
        foreach ($user->followings as $following) {
            $friend = array(
                'uid' => $following->by_following->uid,
                'username' => $following->by_following->uname,
                'face' => $following->by_following->face->avatar_big,
            );
            $key = Pinyin::getShortPinyin($friend['username']);
            $key = mb_substr($key, 0, 1);
            $key = strtoupper($key);

            if (!isset($friends[$key])) {
                $friends[$key] = array();
            }

            if (!in_array($key, $keys)) {
                array_push($keys, $key);
            }

            array_push($friends[$key], $friend);
        }

        asort($keys);
        $keys = array_values($keys);

        $this->__json__(array(
            'keys' => $keys,
            'friends' => $friends,
        ));
    }

    public function starAction()
    {
        $uid = Common::getInput('uid');

        if ($uid == $this->mid) {
            $this->error('不能自己关注自己', true);
        }

        $user = Model\User::existent()->audit()->find($uid);
        $me = Model\User::existent()->audit()->find($this->mid);
        $meData = $me->datas()->key('following_count')->first();

        if (!$me) {
            $meData = new Model\UserData();
            $meData->key = 'following_count';
            $me->datas()->save($meData);
        }

        if (!$user) {
            $this->error('对不起，请求的用户不存在！', true);

        /* 如果已经关注，则取消关注 */
        } elseif ($user->followStatus($this->mid)) {
            $f = $user->followers()->where('uid', '=', $this->mid)->first();
            $f->delete();

            $ud = $user->datas()->key('follower_count')->first();
            if (!$ud) {
                $ud = new Model\UserData();
                $ud->key = 'follower_count';
                $user->datas()->save($ud);
            }

            $ud->decrement('value', 1);
            $meData->decrement('value', 1);

            $this->success('取消关注成功！', true);
        } else {

            /* 没有关注，则关注该用户 */
            $f = new Model\UserFollow();
            $f->uid = $this->mid;
            $f->ctime = time();
            $f->remark = '关注';

            $ud = $user->datas()->key('follower_count')->first();
            if (!$ud) {
                $ud = new Model\UserData();
                $ud->key = 'follower_count';
                $user->datas()->save($ud);
            }

            $user->followers()->save($f);
            $ud->increment('value', 1);
            $meData->increment('value', 1);
            $this->success('关注成功！', true);
        }
    }
} // END class User extends Controller
