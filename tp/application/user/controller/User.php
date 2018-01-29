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
    /**operation:判断session是否存在
 * * user:陈灿伟
 * name:check_session
 * params:[]
 * return:用户信息
 * time:2018.1.27
 * */
    //检测是否处于登陆状态 2018/1/27 陈灿伟
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
    //个人中心 2018/1/27 陈灿伟
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
            $this->error("非法闯入，跳转到登陆页面","login/Login/login","",10);
           exit();
        }
    }
    //修改用户头像 2018/1/27 陈灿伟
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
    //个人高级信息修改页面 2018/1/29 陈灿伟
    public function information(){
        $session=$this->check_session();
        if($session[1]){
            $where=['userid' => $session[0][0]['userid']];
            $user=Db::table('t_user')->where($where)->select();
            //判断用户是否有邮箱验证 没有验证进行资料完善  验证了高级密码修改服务
            if($user[0]['emailcheck']){
                $show=[
                    'show' => false ,
                    'hide' => true
                ];
            }else{
                $show=[
                    'show' => true ,
                    'hide' => false
                ];
            }
            $data=[
                'info' =>$user ,
                'show_hide' => $show
            ];
            $this->assign("info",$data);
            return $this->fetch('information');
        }else{
            $this->error("登陆超时，请重新登陆","login/Login/login","",10);
            exit();
        }
    }
    //验证邮箱是否被占用 2018/1/28 陈灿伟
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
    //验证身份证是否被占用 2018/1/28 陈灿伟
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
    //获取省份 2018/1/28 陈灿伟
    public function getProvince(){
        if($this->check_session()[1]){
            $res=Db::table('provinces')->select();
            echo json_encode($res);
        }else{
            exit("登陆超时");
        }
    }
    //获取市区 2018/1/28 陈灿伟
    public function getCity(){
        $province=input('?post.province')?input('province'):'';
        if($this->check_session()[1]){
            $res=Db::table('cities')->where(['`provinceid`' => $province])->select();
            echo json_encode($res);
        }else{
            exit("登陆超时");
        }
    }
    //获取地区 2018/1/28 陈灿伟
    public function getAreas(){
        $city=input('?post.city')?input('city'):'';
        if($this->check_session()[1]){
            $res=Db::table('areas')->where(['`cityid`' => $city])->select();
            echo json_encode($res);
        }else{
            exit("登陆超时");
        }
    }
    //保存资料完善中的个人信息 2018/1/28 陈灿伟
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
    //修改个人中心的个人信息 2018/1/29 陈灿伟
    public function alterUser(){
        $session=$this->check_session();
        if($session[1]){
            $name=input('?post.name')?input('name'):'';
            $birth=input('?post.birth')?input('birth'):'';
            $sex=input('?post.sex')?input('sex'):'';
            $data=[
                'nickname' => $name ,
                'birthday' => $birth,
                'sex' => $sex
            ];
            $res=Db::table('t_user')->where('userid',$session[0][0]['userid'])->update($data);
            if($res){
                echo json_encode(config('errorMsg')['operation']['update']['code_ok']);
            }else{
                echo json_encode(config('errorMsg')['operation']['update']['code_fail']);
            }
        }else{
            exit('登陆超时');
        }
    }
    //修改旧密码 2018/1/29 陈灿伟
    public function checkOldPsd(){
        $session=$this->check_session();
        if($session[1]){
            $old=input('?post.old')?input('old'):'';
            $enOld=md5($old);
            $where=[
                'userid' => $session[0][0]['userid'],
                'password' => $enOld
            ];
            $res=Db::table('t_user')->where($where)->select();
            if(!empty($res)){
                echo json_encode(config('errorMsg')['register']['info_password_ok']);
            }else{
                echo json_encode(config('errorMsg')['register']['info_password_fail']);
            }
        }else{
            exit('登陆超时');
        }
    }
    //保存修改后的密码 2018/1/29 陈灿伟
    public function keepPassword(){
        $session=$this->check_session();
        if($session[1]){
            $newPsd=input('?post.newPsd')?input('newPsd'):'';
            $enNewPsd=md5($newPsd);
            $where=[
                'password' => $enNewPsd
            ];
            $res=Db::table('t_user')->where('userid',$session[0][0]['userid'])->update($where);
            if(!empty($res)){
                echo json_encode(config('errorMsg')['operation']['update']['code_ok']);
            }else{
                echo json_encode(config('errorMsg')['operation']['update']['code_fail']);
            }
        }else{
            exit('登陆超时');
        }
    }
}
