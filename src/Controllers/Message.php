<?php

namespace App\H5\Controller;

use App\H5\Base\Controller;
use App\H5\Model;
use App\H5\Common;

/**
 * 消息控制器.
 *
 * @author Seven Du <lovevipdsw@outlook.com>
 **/
class Message extends Controller
{
    public function getChatsAction()
    {
        list($max, $min) = Common::getInput(array('max', 'min'));
        $max /= 1000;
        $min /= 1000;

        $list = Model\MessageMember::where('is_del', '=', 0)
            ->where('member_uid', '=', $this->mid)
            ->where(function ($query) use ($max, $min) {
                if ($max) {
                    $query->where('list_ctime', '>', $max);
                } elseif ($min) {
                    $query->where('list_ctime', '<', $min);
                }
            })
            ->orderBy('list_ctime', 'desc')
            ->take(30)
            ->select('list_id', 'new', 'list_ctime')
            ->get()
        ;

        if ($list) {
            $list->load('data');
        }

        $chats = array();
        foreach ($list as $value) {
            $chat = array(
                'listId' => $value->list_id,
                'title' => $value->data->getTitle($this->mid),
                'logo' => $value->data->getLogo($this->mid),
                'last' => $value->data->last_message,
                'time' => $value->list_ctime * 1000, // 转为js时间戳
                'num' => $value->new,
            );
            array_push($chats, $chat);
        }
        $this->__json__($chats);
    }

    public function getMessageListAction()
    {
        // logo, title, time, last, list_id
        $lastTime = Common::getInput('last_time');
        $listId = Common::getInput('list_id');

        $lists = Model\MessageMember::where('is_del', '=', 0)
            ->where('member_uid', '=', $this->uid)
            ->where(function ($query) use ($lastTime, $listId) {
                if ($lastTime) {
                    $query->where('list_ctime', '<', $lastTime);
                }
                if ($listId) {
                    $query->where('list_id', '=', $listId);
                }
            })
            // ->whereHas('data', function($query)
            // {
            //     $query->where('list_id', 'message_member.list_id');
            // })
            ->orderBy('list_ctime', 'desc')
            ->take(30)
            ->select('list_id', 'new', 'list_ctime')
            ->get()
        ;

        // var_dump($lists);exit;

        $lists->load('data');

        foreach ($lists as $key => $value) {
            // var_dump($value->data);exit;
            $lists[$key] = array(
                'list_id' => $value->list_id,
                'title' => $value->data->getTitle($this->mid),
                'logo' => $value->data->getLogo($this->mid),
                'last' => $value->data->last_message,
                'time' => $value->list_ctime,
                'showTime' => date('Y/m/d H:i', $value->list_ctime),
                'num' => $value->new,
            );
        }

        $this->__json__($lists->toArray());
    }

    /**
     * 消息首页控制器.
     *
     * @author Seven Du <lovevipdsw@outlook.com>
     * @datetime 2016-04-04T19:33:14+0800
     * @homepage http://medz.cn
     */
    public function indexAction()
    {
        $this
            ->setTitle('消息')
            ->display('index')
        ;
    }

    public function createRoomAction()
    {
        $ids = Common::getInput('ids');
        $ids = (array) explode(',', $ids);
        array_push($ids, $this->mid);

        $ids = array_unique($ids);
        asort($ids);

        if (count($ids) <= 1) {
            $this->error('非法的请求！', true);
        }

        $ids = implode('_', $ids);

        $list = Model\MessageList::where('min_max', '=', $ids)->first();

        if (!$list) {
            $ids = explode('_', $ids);

            foreach ($ids as $id) {
                // var_dump($id);
                $user = Model\User::existent()->find($id);
                if (!$user) {
                    $this->error('包含不存在的用户！', true);
                }
            }

            $list = new Model\MessageList();
            $list->from_uid = $this->mid;
            $list->member_num = count($ids);
            $list->type = $list->member_num > 2 ? 2 : 1;
            $list->min_max = implode('_', $ids);
            $list->mtime = time();
            $list->last_message = '';

            if ($list->type == 2) {
                $list->title = '群聊';
            }

            $list->save();

            foreach ($ids as $id) {
                $member = new Model\MessageMember();
                $member->member_uid = $id;
                $member->new = 0;
                $member->message_num = 0;
                $member->ctime = time();
                $member->list_ctime = time();
                $list->members()->save($member);
            }
        }

        $this->success($list->list_id, true);
    }

    public function chatAction()
    {
        $listId = Common::getInput('list_id');
        $uid = $this->mid;

        $chat = Model\MessageList::where('list_id', '=', $listId)
            ->whereHas('members', function ($query) use ($uid) {
                $query->where('member_uid', '=', $uid);
            })
            ->first()
        ;

        if (!$chat) {
            $this->error('您无法进入该聊天！');
        }

        $chat->title = $chat->getTitle($this->mid);
        $chat->logo = $chat->getLogo($this->mid);

        // var_dump($chat);exit;

        $this
            ->setTitle($chat->title)
            ->trace('chat', $chat)
            ->display('chat')
        ;
    }

    public function sendImageAction()
    {
        $listId = Common::getInput('list_id');
        $uid = $this->mid;

        $list = Model\MessageList::whereHas('members', function ($query) use ($uid) {
            $query->where('member_uid', '=', $uid);
        })
            ->find($listId)
        ;

        if (!$list) {
            $this->error('你没有权限发送该聊天', true);
        }

        /* 上传附件 */
        $info = Common::uploadFile('image', 'message_image', 'gif', 'png', 'jpg', 'jpeg');

        if ($info['status'] == false) {
            $this->error($info['info'], true);
        } elseif (count($info['info']) <= 0) {
            $this->error('请选择上传的文件', true);
        }

        $message = new Model\MessageContent();
        $message->content = '[图片]';
        $message->from_uid = $this->mid;
        $message->type = 'image';
        $message->mtime = time();
        $message->attach_ids = array('attach_id' => $info['info'][0]['attach_id']);

         /* 将消息模型保存到数据库 */
        $message = $list->contents()->save($message);
        $list->last_message = $message->toArray();
        $list->members()->increment('new', 1);
        $list->members()->increment('message_num', 1);
        $list->members()->update(array(
            'list_ctime' => $message->mtime,
        ));
        $list->mtime = $message->mtime;
        $list->save();

        $this->success($message->message_id, true);
    }

    public function sendTextAction()
    {
        list($listId, $content) = Common::getInput(array('list_id', 'content'));
        $uid = $this->mid;

        $list = Model\MessageList::whereHas('members', function ($query) use ($uid) {
            $query->where('member_uid', '=', $uid);
        })
            ->find($listId)
        ;

        if (!$list) {
            $this->error('你没有权限发送该聊天', true);
        }

        /* 创建下消息模型 */
        $message = new Model\MessageContent();
        $message->content = $content;
        $message->from_uid = $this->mid;
        $message->type = 'text';
        $message->mtime = time();

        /* 将消息模型保存到数据库 */
        $message = $list->contents()->save($message);

        $list->last_message = $message->toArray();
        $list->members()->increment('new', 1);
        $list->members()->increment('message_num', 1);
        $list->members()->update(array(
            'list_ctime' => $message->mtime,
        ));
        $list->mtime = $message->mtime;
        $list->save();

        $this->success($message->message_id, true);
    }

    public function getRoomMessageListAction()
    {
        list($listId, $lastId, $order) = Common::getInput(array('list_id', 'last_id', 'order'));
        $uid = $this->mid;

        !in_array($order, array('asc', 'desc')) &&
        $order = 'asc';

        $lists = Model\MessageContent::where('is_del', '=', 0)
            ->whereHas('members', function ($query) use ($uid) {
                $query->where('member_uid', '=', $uid);
            })
            ->where('list_id', '=', $listId)
            ->whereIn('type', array('text', 'card', 'image', 'voice', 'position'))
            ->where(function ($query) use ($lastId, $order) {
                if ($lastId && $order == 'desc') {
                    $query->where('message_id', '<', $lastId);
                } elseif ($lastId) {
                    $query->where('message_id', '>', $lastId);
                }
            })
            ->take(30)
            ->orderBy('message_id', 'desc')
            ->get();

        /* 把自身消息数量清空 */
        Model\MessageMember::where('is_del', '=', 0)
            ->where('member_uid', '=', $uid)
            ->where('list_id', '=', $listId)
            ->update(array('new' => 0))
        ;

        $messages = array();

        foreach ($lists as $message) {
            array_push($messages, array(
                'face' => $message->face,
                'type' => $message->type,
                'uid' => $message->from_uid,
                'content' => $message->content,
                'date' => date('Y-m-d H:i:s', $message->mtime),
                'is_me' => $message->from_uid == $this->mid,
                'time' => $message->mtime,
                'message_id' => $message->message_id,
                'image' => $message->image,
            ));
        }

        $this->__json__($messages);
    }

    public function getMessageListNumAction()
    {
        $messages = array();

        $uid = $this->mid;

        // foreach (Model\UserData::where(function ($query) use ($uid) {
        //     $query
        //         ->where('uid', '=', $uid)
        //         ->whereIn('key', array('unread_comment', 'unread_digg', 'unread_atme'))
        //     ;
        // })
        //     ->select('key', 'value')
        //     ->get()
        //     as $data
        // ) {
        //     $messages[$data->key] = $data->value;
        // }

        foreach (Model\MessageMember::where('new', '!=', 0)
            ->where('is_del', '=', 0)
            ->where('member_uid', '=', $this->uid)
            ->orderBy('list_ctime', 'desc')
            ->select('list_id', 'new')
            ->get()
            as $data
        ) {
            $messages[$data->list_id] = $data->new;
        }

        $this->__json__($messages);
    }
} // END class Message extends Controller
