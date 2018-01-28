<?php
namespace app\register\controller;
use think\Controller;
use \think\Request;
use \think\Db;
use Captcha;
class Register extends Controller
{
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
}