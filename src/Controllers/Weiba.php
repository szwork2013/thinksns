<?php

namespace App\H5\Controller;

use App\H5\Base\Controller;
use App\H5\Model;
use App\H5\Common;

/**
 * 微吧控制器.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class Weiba extends Controller
{
    protected static $pageList = 15;

    public function postReaderAction()
    {
        $postId = Common::getInput('post_id');
        $uid = $this->mid;
        $post = Model\WeibaPost::existent()
            ->byPostId($postId)
            ->first()
        ;

        if (!$post) {
            $this->error('帖子不存在！', true);
        }

        // $post->load('weiba', 'user', 'feed');
        $post->load(array(
            'weiba',
            'user',
            'feed.diggs' => function ($query) use ($uid) {
                $query->byUser($uid);
            },
        ));

        $post->increment('read_count', 1);

        // var_dump($post->toArray());exit;

        $data = array(
            'status' => 1,
        );

        $data['user'] = array(
            'uid' => $post->user->uid,
            'username' => $post->user->uname,
            'face' => $post->user->face->avatar_big,
        );

        $data['weiba'] = array(
            'id' => $post->weiba->weiba_id,
            'name' => $post->weiba->weiba_name,
            'logo' => $post->weiba->avatar_big,
            'followStatus' => $post->weiba->follows()->byUser($this->mid)->count(),
            'threadNum' => $post->weiba->thread_count,
            'userNum' => $post->weiba->follower_count,
        );

        $data['post'] = array(
            'id' => $post->post_id,
            'title' => $post->title,
            'content' => $post->imageContent,
            'postDate' => date('Y-m-d H:i:s', $post->post_time),
            'feed_id' => $post->feed_id,
            'diggStatus' => $post->feed->diggs->count() > 0,
        );

        // var_dump($data);exit;

        $this->__json__($data);
    }

    public function getIndexAction()
    {
        $uid = $this->mid;
        $followWeibas = Model\Weiba::whereHas('follows', function ($query) use ($uid) {
            $query->where('follower_uid', $uid);
        })
            ->where('is_del', '=', 0)
            ->where('status', '=', 1)
            ->select()
            ->get()
        ;

        $tops = Model\Weiba::where('is_del', '=', 0)
            ->where('status', '=', 1)
            ->orderByRaw('rand()')
            ->take(5)
            ->select()
            ->get()
        ;

        $arr = array(
            'follow' => $followWeibas->toArray(),
            'tops' => $tops->toArray(),
        );

        $this->__json__($arr);
    }

    public function weibaFollowAction()
    {
        $weibaId = Common::getInput('weiba_id');
        $weiba = Model\Weiba::where('is_del', '=', 0)
            ->where('status', '=', 1)
            ->where('weiba_id', '=', $weibaId)
            ->first()
        ;

        if (!$weiba) {
            $this->error('关注的微吧不存在', true);
        } elseif ($weiba->follows()->byUser($this->mid)->count()) {
            $this->error('你已经关注过该微吧！', true);
        }

        $follow = new Model\WeibaFollow();
        $follow->follower_uid = $this->mid;
        $follow->level = 1;

        $weiba->follows()->save($follow);
        $weiba->increment('follower_count', 1);

        $this->success('关注成功！', true);
    }

    public function weibaUnFollowAction()
    {
        $weibaId = Common::getInput('weiba_id');
        $weiba = Model\Weiba::where('is_del', '=', 0)
            ->where('status', '=', 1)
            ->where('weiba_id', '=', $weibaId)
            ->first()
        ;

        if (!$weiba) {
            $this->error('操作的微吧不存在！', true);
        }

        // var_dump($weiba);exit;

        $follow = $weiba->follows()->byUser($this->mid)->first();

        if (!$follow) {
            $this->error('您还未关注该微吧，不能执行取消操作！', true);
        }

        $follow->delete();
        $weiba->decrement('follower_count', 1);

        $this->success('取消关注成功！', true);
    }

    public function getInfoAction()
    {
        $weibaId = Common::getInput('weiba_id');
        $weiba = Model\Weiba::where('is_del', '=', 0)
            ->where('status', '=', 1)
            ->where('weiba_id', '=', $weibaId)
            ->first()
        ;

        if (!$weiba) {
            $this->error('微吧不存在！', true);
        }

        $weibaData = $weiba->toArray();

        $weibaData['isfollow'] = $weiba->follows()->byUser($this->mid)->count();
        // $weibaData['avatar'] = $weiba->avatar->path;

        $this->success($weibaData, true);
    }

    /**
     * 获取所有微吧
     */
    public function getWeibasAction()
    {
        $weibas = Model\Weiba::where('is_del', '=', 0)
            ->where('status', '=', 1)
            ->get()
        ;

        foreach ($weibas as &$weiba) {
            $weiba->isfollow = $weiba->follows()->byUser($this->mid)->count();
        }

        $this->__json__($weibas->toArray());
    }

    public function getPostListAction()
    {
        /*
         * 参数获取
         */
        list($weibaId, $postUid, $isRec, $lasrId, $num) = Common::getInput(array('weiba_id', 'uid', 'recommend', 'last_id', 'num'));
        /*
         * 参数过滤
         */
        list($weibaId, $postUid, $isRec) = array(intval($weibaId), intval($postUid), intval($isRec));

        $type = Common::getInput('type');

        /*
         * 检查是否是推荐，转为0和1
         *
         * @var int
         */
        ($isRec == 1 || $isRec == 2) ||
        $isRec = 0;

        $num = intval($num);
        $num <= 0 &&
        $num = static::$pageList;

        $posts = Model\WeibaPost::where('is_del', 0)
            ->where(function ($query) use ($weibaId, $isRec, $type, $lasrId) {
                /* 微吧ID条件 */
                if ($weibaId) {
                    $query->where('weiba_id', '=', $weibaId);
                }
                /* 是否推荐条件 */
                if ($isRec != 0) {
                    $isRec == 2 &&
                    $isRec = 0;
                    $query->where('recommend', '=', $isRec);
                }
                /* 发表用户条件 */
                if ($postUid) {
                    $query->where('post_uid', '=', $postUid);
                }
                if ($type == 'new' && $lasrId) {
                    $query->where('post_id', '>', $lasrId);
                } elseif ($lasrId) {
                    $query->where('post_id', '<', $lasrId);
                }
            })
            ->take($num)
            ->orderBy('post_id', 'desc')
            ->select()
            ->get()
        ;

        $posts->load('user');

        $arr = array();
        foreach ($posts as $post) {
            $p = array();
            $p['title'] = $post->title;
            $p['content'] = $post->SimpleContent;
            $p['username'] = $post->user->uname;
            $p['time'] = date('Y-m-d', $post->post_time);
            $p['reply'] = $post->reply_count;
            $p['read'] = $post->read_count;
            $p['imgs'] = $post->images;
            $p['post_id'] = $post->post_id;
            $p['uid'] = $post->user->uid;

            array_push($arr, $p);
        }

        $this->__json__($arr);
    }
} // END class Weiba extends Controller
