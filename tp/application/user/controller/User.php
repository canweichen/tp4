<?php
namespace app\user\controller;
use think\Controller;
use \think\Request;
use \think\Db;
use Captcha;
use think\Session;
use \think\File;
class User extends Controller
{
    public function index()
    {
        //return '<style type="text/css">*{ padding: 0; margin: 0; } .think_default_text{ padding: 4px 48px;} a{color:#2E5CD5;cursor: pointer;text-decoration: none} a:hover{text-decoration:underline; } body{ background: #fff; font-family: "Century Gothic","Microsoft yahei"; color: #333;font-size:18px} h1{ font-size: 100px; font-weight: normal; margin-bottom: 12px; } p{ line-height: 1.6em; font-size: 42px }</style><div style="padding: 24px 48px;"> <h1>:)</h1><p> ThinkPHP V5<br/><span style="font-size:30px">十年磨一剑 - 为API开发设计的高性能框架</span></p><span style="font-size:22px;">[ V5.0 版本由 <a href="http://www.qiniu.com" target="qiniu">七牛云</a> 独家赞助发布 ]</span></div><script type="text/javascript" src="http://tajs.qq.com/stats?sId=9347272" charset="UTF-8"></script><script type="text/javascript" src="http://ad.topthink.com/Public/static/client.js"></script><thinkad id="ad_bd568ce7058a1091"></thinkad>';
    }
    public function login(){
        return $this->fetch('login');
    }
    public function checkLogin(){
        $account=input('?post.user')?input('post.user'):"";
        $psd=input('?post.psd')?input('post.psd'):"";
        $code=input('?post.code')?input('post.code'):"";
        $enPsd=md5($psd);
        $where=[
            'userid' => $account,
            'password' => $enPsd
        ];
        if(captcha_check($code)){
            $data=Db::name('t_user')->where($where)->select();
            //判断查询结果是否存在
            if(!empty($data)){
                //判断是否被锁定
                if($data[0]['state']==1){
                    //设置session
                    Session::set('user',$data);
                    echo json_encode(config('errorMsg')['login']['code_ok']);
                }else{
                    echo json_encode(config('errorMsg')['login']['code_lock']);
                }
            }else{
                echo json_encode(config('errorMsg')['login']['code_fail']);
            }
        }else{
            echo json_encode(config('errorMsg')['login']['code_err']);
        }
    }
    public function exitLogin(){
        // 删除（当前作用域）
        Session::delete('user');
        if(!Session::has("user")){
            echo json_encode(config('errorMsg')['exitLogin']['code_ok']);
        }else{
            echo json_encode(config('errorMsg')['exitLogin']['code_fail']);
        }
    }
    /**operation:判断session是否存在
 * * user:陈灿伟
 * name:check_session
 * params:[]
 * return:用户信息
 * time:2018.1.27
 * */
    public function check_session(){
        // 判断think作用域下面是否赋值
        $bool=Session::has('user');
        if($bool){
            //获取session
            return [Session::get('user'),1];
        }else{
            return ['',0];
        }
    }
    public function register(){
        return $this->fetch('register');
    }
    public function checkAccount(){
        //判断账号是否存在，存在使用，不存在赋予空
        $account=input('?post.id')?input('post.id'):"";
        $where=[
          'userid' => $account
        ];
        $data=Db::name('t_user')->where($where)->select();
        if(empty($data)){
            //账号不存在
            echo json_encode(config('errorMsg')['register']['account_ok']);
        }else{
            //账号存在
            echo json_encode(config('errorMsg')['register']['account_err']);
        }
    }
    public function goRegister(){
        //获取数据
        $account=input('?post.user')?input('post.user'):"";
        $psd=input('?post.psd')?input('post.psd'):"";
        $code=input('?post.code')?input('post.code'):'';
        //MD5加密
        $enPsd=md5($psd);
        $data=[
            'userid' => $account,
            'password' => $enPsd,
            'headimg' => '__STATIC__/images/excellent15.png',
            'nickname' => '',
            'sex' => '',
            'provinces' => '',
            'cities' => '',
            'areas' => '',
            'birthday' =>'',
            'idcard' => '',
            'phone' => '',
            'money' => 0,
            'createtime' =>date('Y-m-d H:i:s',time()),
            'email' => '',
            'emailcheck' => '',
            'state' => 1
        ];
        if(captcha_check($code)){
            $data=Db::name('t_user')->insert($data);
            if($data){
                echo json_encode(config('errorMsg')['register']['register_ok']);
            }else{
                echo json_encode(config('errorMsg')['register']['register_fail']);
            }
        }else{
            echo json_encode(config('errorMsg')['register']['register_code']);
        }
    }
    public function userCenter(){
        $get_session=$this->check_session();
       if($get_session[1]){
           $res=Session::get('user');
           $where=['userid' => $res[0]['userid']];
           $user=Db::table('t_user')->where($where)->select();
           $data=[
               'info' =>$user
           ];
            $this->assign("info",$data);
            return $this->fetch('userCenter');
        }else{
            $this->error("非法闯入，跳转到网站首页","user/user/login","",10);
           exit();
        }
    }
    public function alterHead(){
        // 获取表单上传文件 例如上传了001.jpg
        $file = request()->file('file');
        // 移动到框架应用根目录/public/uploads/ 目录下
        if($file){
            $info = $file->move(ROOT_PATH . 'public' . DS . 'static');
            if($info){
                // 成功上传后 获取上传信息
                // 输出 jpg
               // echo $info->getExtension();
                // 输出 20160820/42a79759f284b767dfcb2a0197904287.jpg
                $path="__STATIC__/".$info->getSaveName();
                if(Session::has('user')){
                    $user=Session::get('user');
                    $id=isset($user[0]['userid'])?$user[0]['userid']:'';
                    // 输出 42a79759f284b767dfcb2a0197904287.jpg
                    //echo $info->getFilename();
                    $res=Db::table('t_user')->where('userid',$id)->update(['headimg' => $path]);
                    if($res){
                        echo json_encode(config('errorMsg')['operation']['update']['code_ok']);
                    }else{
                        echo json_encode(config('errorMsg')['operation']['update']['code_fail']);
                    }
                }
            }else{
                // 上传失败获取错误信息
                echo $file->getError();
            }
        }
    }
}
