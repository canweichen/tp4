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
            $this->error("非法闯入，跳转到网站首页","login/Login/login","",10);
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
    public function information(){
        return $this->fetch('information');
    }
    public function checkEmail(){
        if($this->check_session()[1]){
            $email=input('?post.email')?input("email"):'';
            $res=Db::table('t_user')->where(['`email`' => $email])->select();
            if(empty($res)){
                echo json_encode(config('errorMsg')['register']['register_email_ok']);
            }else{
                echo json_encode(config('errorMsg')['register']['register_email']);
            }
        }else{
            $this->error("非法闯入，跳转到网站登陆页面","login/Login/login","",10);
            exit();
        }
    }
    public function checkIDNum(){
        if($this->check_session()[1]){
            $ID=input('?post.ID')?input("ID"):'';
            $res=Db::table('t_user')->where(['`idCard`' => $ID])->select();
            if(empty($res)){
                echo json_encode(config('errorMsg')['register']['register_email_ok']);
            }else{
                echo json_encode(config('errorMsg')['register']['register_email']);
            }
        }else{
            //$this->error("非法闯入，跳转到网站登陆页面","login/Login/login","",10);
            exit("登陆超时");
        }
    }
    public function getProvince(){
        if($this->check_session()[1]){
            $res=Db::table('provinces')->select();
            echo json_encode($res);
        }else{
            exit("登陆超时");
        }
    }
    public function getCity(){
        $province=input('?post.province')?input('province'):'';
        if($this->check_session()[1]){
            $res=Db::table('cities')->where(['`provinceid`' => $province])->select();
            echo json_encode($res);
        }else{
            exit("登陆超时");
        }
    }
    public function getAreas(){
        $city=input('?post.city')?input('city'):'';
        if($this->check_session()[1]){
            $res=Db::table('areas')->where(['`cityid`' => $city])->select();
            echo json_encode($res);
        }else{
            exit("登陆超时");
        }
    }
    public function saveUser(){
        $session=$this->check_session();
        if($session[1]){
        $name=input('?post.name')?input('name'):'';
        $email=input('?post.email')?input('email'):'';
        $id=input('?post.id')?input('id'):'';
        $sex=input('?post.sex')?input('sex'):'';
        $province=input('?post.province')?input('province'):'';
        $city=input('?post.city')?input('city'):'';
        $area=input('?post.area')?input('area'):'';
        $birthday=input('?post.birthday')?input('birthday'):'';
        $pro=Db::table('provinces')->where(['`provinceid`' => $province])->select();
        $ci=Db::table('cities')->where(['`cityid`' => $city])->select();
        $ar=Db::table('areas')->where(['`areaid`' => $area])->select();
        $data=[
            'nickname' => $name ,
            'sex' => $sex,
            'provinces' => $pro[0]['province'] ,
            'cities' => $ci[0]['city'] ,
            'areas' => $ar[0]['area'] ,
            'birthday' => $birthday ,
            'idcard' => $id,
            'email' => $email
        ];
            $res=Db::table('t_user')->where('`userid`' , $session[0][0]['userid'])->update($data);
            if($res){
                echo json_encode(config('errorMsg')['register']['info_ok']);
            }else{
                echo json_encode(config('errorMsg')['register']['info_err']);
            }
        }
    }
}
