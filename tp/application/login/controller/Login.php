<?php
namespace app\login\controller;
use think\Controller;
use \think\Request;
use \think\Db;
use Captcha;
use think\Session;
class Login extends Controller
{
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
}