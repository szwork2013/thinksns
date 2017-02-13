<?php

namespace App\H5\Controller;

use App\H5\Base\Controller;
use App\H5\Model;
use App\H5\Common;

/**
 * 微吧帖子控制器
 *
 * @package default
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class Post extends Controller
{
    public function addCommentAction()
    {
        list($postId, $content) = Common::getInput(array('post_id', 'content'));

        if (!$postId) {
            $this->error('系统错误，请刷新重试！', true);
        } elseif (!$content) {
            $this->error('评论内容不能为空！', true);
        } elseif (Common::strlen($content) > 140) {
            $this->error('评论内容超出系统限制！', true);
        }

        $uid = $this->mid;
        $post = Model\WeibaPost::existent()
            ->byPostId($postId)
            ->first()
        ;

        if (!$post) {
            $this->error('评论的帖子存在异常！', true);
        }

        $post->load('feed');

        if (!$post->feed) {
            $this->error('帖子数据异常，无法评论！', true);
        }

        $feedComment = new Model\Comment;
        $feedComment->type = 1;
        $feedComment->app = 'weiba';
        $feedComment->table = 'feed';
        $feedComment->row_id = $post->feed->feed_id;
        $feedComment->uid = $uid;
        $feedComment->app_uid = $post->post_uid;
        $feedComment->content = $content;
        $feedComment->to_comment_id = 0;
        $feedComment->to_uid = 0;
        $feedComment->data = '';
        $feedComment->ctime = time();
        $feedComment->is_del = 0;
        $feedComment->client_type = 4;
        $feedComment->is_audit = 1;
        $feedComment->storey = 0;
        $feedComment->app_detail_url = '';
        $feedComment->app_detail_summary = '';
        $feedComment->client_ip = '';
        $feedComment->client_port = '';
        $feedComment->digg_count = 0;

        $post->feed->comments()->save($feedComment);

        $comment = new Model\PostReply;
        $comment->weiba_id = $post->weiba_id;
        $comment->post_uid = $post->post_uid;
        $comment->uid = $uid;
        $comment->to_reply_id = 0;
        $comment->to_uid = 0;
        $comment->ctime = time();
        $comment->content = $content;
        $comment->is_del = 0;
        $comment->comment_id = $feedComment->comment_id;
        $comment->storey = 0;
        $comment->attach_id = 0;
        $comment->digg_count = 0;

        $post->replys()->save($comment);

        $post->feed->increment('comment_count', 1);
        $post->increment('reply_count', 1);

        $this->trace('commentId', $feedComment->comment_id);
        $this->trace('time', date('Y-m-d H:i:s', $feedComment->ctime));
        $this->success('评论成功！', true);
    }

    public function addDiggAction()
    {
        $postId = Common::getInput('id');
        $uid = $this->mid;

        $post = Model\WeibaPost::existent()
            ->byPostId($postId)
            ->first()
        ;

        if (!$post) {
            $this->error('帖子不存在！', true);
        }

        $post->load(array(
            'feed.diggs' => function ($query) use ($uid) {
                $query->byUser($uid);
            },
            'diggs' => function ($query) use ($uid) {
                $query->byUserId($uid);
            },
        ));

        if (!$post->feed) {
            $this->error('帖子存在异常！', true);
        }

        if (!$post->feed->diggs->count()) {
            $digg = new Model\FeedDigg;
            $digg->uid = $uid;
            $digg->cTime = time();
            $post->feed->diggs()->save($digg);
        }

        if (!$post->diggs->count()) {
            $digg = new Model\PostDigg;
            $digg->uid = $uid;
            $digg->cTime = time();
            $post->diggs()->save($digg);
        }

        $post->feed->increment('digg_count', 1);

        $this->success('操作成功！', true);
    }

    public function removeDiggAction()
    {
        $uid = $this->mid;
        $postId = Common::getInput('id');

        $post = Model\WeibaPost::existent()
            ->byPostId($postId)
            ->first()
        ;

        if (!$post) {
            $this->error('帖子不存在！', true);
        }

        $post->load(array(
            'feed.diggs' => function ($query) use ($uid) {
                $query->byUser($uid);
            },
            'diggs' => function ($query) use ($uid) {
                $query->byUserId($uid);
            },
        ));

        $digg = $post->feed->diggs->first();
        if ($digg) {
            $digg->delete();
        }

        $digg = $post->diggs->first();
        if ($digg) {
            $digg->delete();
        }

        $post->feed->decrement('digg_count', 1);

        $this->success('操作成功！', true);
    }
} // END class Post extends Controller
