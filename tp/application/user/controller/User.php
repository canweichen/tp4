<?php
namespace app\user\controller;
use think\Controller;
use \think\Request;
use \think\Db;
use Captcha;
use think\Session;
use \think\File;
use think\Paginator;
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
        $tag=input('?get.who')?input('who'):'';
        $lg=input('?get.lg')?input('lg'):'';
       if($get_session[1]){
           $res=Session::get('user');
           $where=['userid' => $res[0]['userid']];
           $user=Db::table('t_user')->where($where)->select();
           if($tag==2){
               //实现默认地址优先于其它地址
               $address=Db::table('t_address')->where($where)->order('addressflag desc')->paginate(8,false,[
                   'query' => ['who' => 2]
               ]);
               $page = $address->render();
               $this->assign('pageToAddress', $page);
               $data=[
                   'info' =>$user ,
                   'address' => json_encode($address)
               ];
           }else if($tag==3){
               $collect = Db::table(['t_collect'=>'collect','t_trade'=>'trade'])
                   ->where('collect.tradeid = trade.tradeid')
                   ->where('collect.userid' , $res[0]['userid'])
                   ->order('collecttime desc')
                   ->paginate(8,false,[
                       'query' => ['who' => 3]
                   ]);
               $page = $collect->render();
               $this->assign('pageToCollect',$page);
               $data=[
                   'info' =>$user ,
                   'collect' => json_encode($collect)
               ];
           }else if($tag==4){
               $data=[
                   'info' =>$user
               ];
           }else if($tag==5){
               $data=[
                   'info' =>$user
               ];
           }else if($tag==6){
               if($lg==1){
                   /*---a表的全部字段 b表的全部字段 将a表的某个字段重命名为任意不重复字段---*/
                   //3表示已支付订单
                   $yet = Db::table(['t_order'=>'yet','t_trade'=>'trade'])
                       ->field("yet.*,trade.*,yet.createtime time")
                       ->where('yet.tradeid = trade.tradeid')
                       ->where('yet.userid' , $res[0]['userid'])
                       ->where('yet.orderstate',['=',3],['=',4],'or')
                       ->order('yet.createtime desc')
                       ->paginate(2,false,[
                           'query' => ['who' => 6 ,'lg'=>1]
                       ]);
                   //判断一下这个值是否存在 存在输出 不存在提醒
                   if(isset($yet[0])){
                       //获取该用户的所有订单id
                       $list = [];
                       for($i=0;$i<count($yet);$i++){
                           $list[] = $yet[$i]['orderid'];
                       }
                       //in内嵌式查询
                       $relation = Db::table(['t_order_relation' => 'a' , 't_trade' => 'b'])
                           ->where('a.s_tradeid = b.tradeid')
                           ->where(array('a.s_orderid'=>array('IN',$list)))
                           ->select();
                       $page = $yet->render();
                       $this->assign('pageToAlready',$page);
                       $data=[
                           'info' =>$user,
                           'already' => json_encode([$yet,$relation])
                       ];
                   }else{
                       $data=[
                           'info' =>$user
                       ];
                   }
               }else if($lg==2){
                   $yet = Db::table(['t_order'=>'yet','t_trade'=>'trade'])
                       ->field("yet.*,trade.*,yet.createtime time")
                       ->where('yet.tradeid = trade.tradeid')
                       ->where('yet.userid' , $res[0]['userid'])
                       ->where('yet.orderstate',['=',1],['=',2],['=',3],['=',4],['=',5],'or')
                       ->order('yet.createtime desc')
                       ->paginate(2,false,[
                           'query' => ['who' => 6 ,'lg'=>2]
                       ]);
                   //判断一下这个值是否存在 存在输出 不存在提醒
                   if(isset($yet[0])){
                       //获取该用户的所有订单id
                       $list = [];
                       for($i=0;$i<count($yet);$i++){
                           $list[] = $yet[$i]['orderid'];
                       }
                       //in内嵌式查询
                       $relation = Db::table(['t_order_relation' => 'a' , 't_trade' => 'b'])
                           ->where('a.s_tradeid = b.tradeid')
                           ->where(array('a.s_orderid'=>array('IN',$list)))
                           ->select();
                       $page = $yet->render();
                       $this->assign('pageToAll',$page);
                       $data=[
                           'info' =>$user,
                           'already' => json_encode([$yet,$relation])
                       ];
                   }else{
                       $data=[
                           'info' =>$user
                       ];
                   }
               }else{
                   /*---a表的全部字段 b表的全部字段 将a表的某个字段重命名为任意不重复字段---*/
                   $wait = Db::table(['t_order'=>'wait','t_trade'=>'trade'])
                       ->field("wait.*,trade.*,wait.createtime time")
                       ->where('wait.tradeid = trade.tradeid')
                       ->where('wait.userid' , $res[0]['userid'])
                       ->where('wait.orderstate = 1')
                       ->order('wait.createtime desc')
                       ->paginate(2,false,[
                           'query' => ['who' => 6 ]
                       ]);
                   if(isset($wait[0])) {
                       //获取该用户的所有订单id
                       $list = [];
                       for ($i = 0; $i < count($wait); $i++) {
                           $list[] = $wait[$i]['orderid'];
                       }
                       //in内嵌式查询
                       $relation = Db::table(['t_order_relation' => 'a', 't_trade' => 'b'])
                           ->where('a.s_tradeid = b.tradeid')
                           ->where(array('a.s_orderid' => array('IN', $list)))
                           ->select();
                       $page = $wait->render();
                       $this->assign('pageToWait', $page);
                       $data = [
                           'info' => $user,
                           'wait' => json_encode([$wait, $relation])
                       ];
                   }else{
                       $data = [
                           'info' => $user
                       ];
                   }
               }
           }else if($tag==7){

               $data=[
                   'info' =>$user
               ];
           }else if($tag==8){
               $data=[
                   'info' =>$user
               ];
           }else if($tag==9){
               $data=[
                   'info' =>$user
               ];
           }else{
               $data=[
                   'info' =>$user
               ];
           }
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
                        $this->changeSession();
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
    //获取省份 2018/1/28 陈灿伟 可以将该数据存入缓存中
    public function getProvince(){
        if($this->check_session()[1]){
            $res=Db::table('provinces')->select();
            echo json_encode($res);
        }else{
            exit("登陆超时");
        }
    }
    //获取市区 2018/1/28 陈灿伟 可以将该数据存入缓存中
    public function getCity(){
        $province=input('?post.province')?input('province'):'';
        if($this->check_session()[1]){
            $res=Db::table('cities')->where(['`provinceid`' => $province])->select();
            echo json_encode($res);
        }else{
            exit("登陆超时");
        }
    }
    //获取地区 2018/1/28 陈灿伟 可以将该数据存入缓存中
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
                $this->changeSession();
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
                $this->changeSession();
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
                $this->changeSession();
                echo json_encode(config('errorMsg')['operation']['update']['code_ok']);
            }else{
                echo json_encode(config('errorMsg')['operation']['update']['code_fail']);
            }
        }else{
            exit('登陆超时');
        }
    }
    //添加地址 2018/1/29 陈灿伟
    public function saveAddress(){
        $session=$this->check_session();
        if($session[1]){
            $name=input('?post.name')?input('name'):'';
            $phone=input('?post.phone')?input('phone'):'';
            $province=input('?post.province')?input('province'):'';
            $city=input('?post.city')?input('city'):'';
            $area=input('?post.area')?input('area'):'';
            $details=input('?post.details')?input('details'):'';
            $checkBox=input('?post.checkBox')?input('checkBox'):0;
            if($checkBox){
                Db::table('t_address')->where('userid',$session[0][0]['userid'])->update(['addressflag' => 0]);
            }
            //优化：1、将省市区的数据存入缓存然后根据id直接获取 2、页面直接获取到他们的名字
            $pro=Db::table('provinces')->where(['`provinceid`' => $province])->select();
            $ci=Db::table('cities')->where(['`cityid`' => $city])->select();
            $ar=Db::table('areas')->where(['`areaid`' => $area])->select();
            $data=[
                'userid' => $session[0][0]['userid'],
                'phone' => $phone ,
                'provinces' => $pro[0]['province'] ,
                'cities' => $ci[0]['city'] ,
                'areas' => $ar[0]['area'] ,
                'content' => $details,
                'receivername' => $name ,
                'addressflag' => $checkBox
            ];
            $res=Db::table('t_address')->insert($data);
            if($res){
               echo json_encode(config('errorMsg')['operation']['add']['code_ok']) ;
            }else{
                echo json_encode(config('errorMsg')['operation']['add']['code_fail']) ;
            }
        }else{
            exit('登陆超时');
        }
    }
    //删除地址 2018/1/30 陈灿伟
    public function deleteAddress(){
        $session=$this->check_session();
        $id=input('?post.id')?input('id'):'';
        //条件：1、用户处于登陆状态 2、地址主键id不为空
        if($session[1] && isset($id)){
            //根据主键删除
            $res=Db::table('t_address')->delete($id);
            if($res){
                echo json_encode(config('errorMsg')['operation']['delete']['code_ok']);
            }else{
                echo json_encode(config('errorMsg')['operation']['delete']['code_fail']);
            }
        }else{
            exit('登陆超时');
        }
    }
    //默认地址设置 2018/1/30 陈灿伟
    public function defaultAddress(){
        $session=$this->check_session();
        $id=input('?post.id')?input('id'):'';
        //条件：1、用户处于登陆状态 2、地址主键id不为空
        if($session[1] && isset($id)){
            //根据主键删除
            $data=Db::table('t_address')->where('userid',$session[0][0]['userid'])->update(['addressflag' => 0]);
            if($data){
                $res=Db::table('t_address')->where('addressid',$id)->update(['addressflag' => 1]);
                if($res){
                    echo json_encode(config('errorMsg')['operation']['update']['code_ok']);
                }else{
                    echo json_encode(config('errorMsg')['operation']['update']['code_fail']);
                }
            }else{
                echo json_encode(config('errorMsg')['operation']['update']['code_fail']);
            }
        }else{
            exit('登陆超时');
        }
    }
    //通过id获取地址信息 2018/1/30 陈灿伟
    public function getAddressById(){
        $session=$this->check_session();
        if($session[1]){
            $id=input('?post.id')?input('id'):'';
            $res=Db::table('t_address')->where(['addressid' => $id])->select();
            $pro=Db::table('provinces')->where(['province' => $res[0]['provinces']])->select();
            $ci=Db::table('cities')->where(['city' => $res[0]['cities']])->select();
            $ar=Db::table('areas')->where(['area' => $res[0]['areas']])->select();
            echo json_encode([$res,$pro[0]['provinceid'],$ci[0]['cityid'],$ar[0]['areaid']]);
          /*  if(!empty($res)){
                echo json_encode(config('errorMsg')['result']['code_ok']);
            }else{
                echo json_encode(config('errorMsg')['result']['code_fail']);
            }*/
        }else{
            exit('登陆超时');
        }
    }
    //保存修改后的地址 2018/1/30 陈灿伟
    public function alterAddress(){
        $session=$this->check_session();
        if($session[1]){
            $name=input('?post.name')?input('name'):'';
            $phone=input('?post.phone')?input('phone'):'';
            $province=input('?post.province')?input('province'):'';
            $city=input('?post.city')?input('city'):'';
            $area=input('?post.area')?input('area'):'';
            $details=input('?post.details')?input('details'):'';
            $checkBox=input('?post.checkBox')?input('checkBox'):0;
            $id=input('?post.id')?input('id'):'';
            if($checkBox){
                //如果复选框的值为1，那就先更新当前用户的所以地址标志位为0 否则不操作
                Db::table('t_address')->where('userid',$session[0][0]['userid'])->update(['addressflag' => 0]);
            }
            //优化：1、将省市区的数据存入缓存然后根据id直接获取 2、页面直接获取到他们的名字
            $pro=Db::table('provinces')->where(['`provinceid`' => $province])->select();
            $ci=Db::table('cities')->where(['`cityid`' => $city])->select();
            $ar=Db::table('areas')->where(['`areaid`' => $area])->select();
            $data=[
                'phone' => $phone ,
                'provinces' => $pro[0]['province'] ,
                'cities' => $ci[0]['city'] ,
                'areas' => $ar[0]['area'] ,
                'content' => $details,
                'receivername' => $name ,
                'addressflag' => $checkBox
            ];
            $res=Db::table('t_address')->where('addressid',$id)->update($data);
            if($res){
                echo json_encode(config('errorMsg')['operation']['update']['code_ok']) ;
            }else{
                echo json_encode(config('errorMsg')['operation']['update']['code_fail']) ;
            }
        }else{
            exit('登陆超时');
        }
    }
    //取消收藏 2018/1/31 陈灿伟
    public function deleteCollect(){
        $session=$this->check_session();
        $id=input('?delete.id')?input('id'):'';
        //条件：1、用户处于登陆状态 2、地址主键id不为空
        if($session[1] && isset($id)){
            //根据主键删除
            $res=Db::table('t_collect')->delete($id);
            if($res){
                echo json_encode(config('errorMsg')['operation']['delete']['code_ok']);
            }else{
                echo json_encode(config('errorMsg')['operation']['delete']['code_fail']);
            }
        }else{
            exit('登陆超时');
        }
    }
    //取消待支付订单 2018/2/1 陈灿伟
    public function deleteWait(){
        $session=$this->check_session();
        if($session[1]){
            $id=input('?delete.id')?input('id'):'';
            //取消后的订单状态为 2
            $res=Db::table('t_order')->where('orderid',$id)->update(['orderstate' => 2]);
            if($res){
                echo json_encode(config('errorMsg')['operation']['cancel']['code_ok']);
            }else{
                echo json_encode(config('errorMsg')['operation']['cancel']['code_fail']);
            }
        }else{
            exit('登陆超时');
        }
    }
    //删除订单子商品 2018/2/1 陈灿伟
    public function deleteChildTrade(){
        $session = $this->check_session();
        if($session[1]) {
            //需要删除商品的关联id
            $cid = input('?delete.cid') ? input('cid') : '';
            //订单id
            $oid = input('?delete.oid') ? input('oid') : '';
            $exist = Db::table('t_order_relation')->where('s_orderid', $oid)->count();
            //判断该订单下的商品数量是否大一？删除商品：提示不删除
            if ($exist == 1) {
                echo json_encode(config('errorMsg')['operation']['cancel']['code_err']);
            } else {
            //通过订单关联表查找该订单和号和商品 将订单金额更正 删除关联表的这条记录 商品数量++
                $res = Db::table('t_order_relation')->where(['s_id' => $cid])->select();
                $trade = Db::table('t_trade')->where(['tradeid' => $res[0]['s_tradeid']])->select();
                $money = $res[0]['s_num'] * $trade[0]['nowprice'];
                //是否引入事物处理事件 更新订单金额
                $data = Db::table('t_order')->where('orderid', $res[0]['s_orderid'])->setDec('total', $money);
                if ($data) {
                    //删除该商品
                    $result = Db::table('t_order_relation')->delete($cid);
                    if ($result) {
                        echo json_encode(config('errorMsg')['operation']['cancel']['code_ok']);
                    } else {
                        echo json_encode(config('errorMsg')['operation']['cancel']['code_fail']);
                    }
                }else{
                    echo json_encode(config('errorMsg')['operation']['cancel']['code_fail']);
                }
            }
        }else{
            exit('登陆超时');
        }
    }
    //更新session 2018/2/2 陈灿伟
    public function changeSession(){
        $session=$this->check_session();
        $res=Db::table('t_user')->select($session[0][0]['userid']);
        Session::delete('user');
        if(!Session::has('user')){
            Session::set('user',$res);
        }
    }
    //充值 2018/2/2 陈灿伟
    public function addMoney(){
        $session=$this->check_session();
        if($session[1]){
            $money=input('?post.money')?input('money'):'';
            $res=Db::table('t_user')->where('userid',$session[0][0]['userid'])->setInc('money',$money);
            if($res){
                //更新session值
                $this->purchase($session[0][0]['userid'],null,2,$money);
                $this->changeSession();
                echo json_encode(config('errorMsg')['operation']['recharge']['code_ok']);
            }else{
                echo json_encode(config('errorMsg')['operation']['recharge']['code_fail']);
            }
        }else{
            exit('登陆超时');
        }
    }
    //前往支付页面1是待支付订单 2是交易关闭订单 3是已支付未发货 4是已支付且发货 5是已收货订单关闭 6是退款审核状态 7退款成功
    //订单付款 2018/2/2 陈灿伟
    public function pay(){
        $session=$this->check_session();
        if($session[1]){
            $id=input('?post.id')?input('id'):'';
            $data=Db::table('t_order')->select($id);
            if((int)$session[0][0]['money'] >= (int)$data[0]['total']){
                $res=$this->startTrans($id,$session[0][0]['userid'],(int)$data[0]['total']);
                if($res){
                    //更新用户session信息 事物处理成功执行
                    $this->purchase($session[0][0]['userid'],(int)$data[0]['orderid'],1,(int)$data[0]['total']);
                    $this->changeSession();
                    echo json_encode(config('errorMsg')['operation']['pay']['code_ok']);
                }else{
                    echo json_encode(config('errorMsg')['operation']['pay']['code_fail']);
                }
            }else{
                echo json_encode(config('errorMsg')['operation']['pay']['code_err']);
            }
            //return $this->fetch('pay');
        }else{
            exit('登陆超时');
        }
    }
    //事物操作 2018/2/2 陈灿伟
    public function startTrans($id,$userid,$money){
        Db::startTrans();
        $time=date('Y-m-d:H:i:s',time());
        $res1 = Db::table('t_order')->where('orderid',$id)->update(['orderstate'=>3,'paytime'=>$time]);
        $res2 = Db::table('t_user')->where('userid',$userid)->setDec('money',$money);
        if($res1 && $res2){
            Db::commit();   //只有$res1 和  $res2  都执行成功是才真正执行上面的数据库操作
            return true;
        }else{
            Db::rollback();  //  条件不满足，回滚
            return false;
        }
    }
    //收货 2018/2/2 陈灿伟
    public function receipt(){
        $session=$this->check_session();
        if($session[1]){
            $id=input('?post.id')?input('id'):'';
            $psd=input('?post.psd')?input('psd'):'';
            $enPsd=md5($psd);
            if($session[0][0]['password'] == $enPsd){
                $res=Db::table('t_order')->where('orderid',$id)->update(['orderstate'=>5 ,'takedeliver_time'=>date('Y-m-d H:i:s',time())]);
                if($res){
                    echo json_encode(config('errorMsg')['operation']['pay']['code_receipt_ok']);
                }else{
                    echo json_encode(config('errorMsg')['operation']['pay']['code_receipt_fail']);
                }
            }else{
                echo json_encode(config('errorMsg')['operation']['pay']['code_password']);
            }
        }else{
            exit('登陆超时');
        }
    }
    //消费记录
    public function purchase($user=null,$order=null,$type=null,$money=null){
        $time=date("Y-m-d H:i:s",time());
       /* if($operation==1){
            $type = '购买';
        }else if($operation==2){
            $type ='充值';
        }else{
            $type = '退款';
        }*/
        $data=[
            'p_userid' => $user,
            'p_orderid' => $order,
            'p_type' => $type,
            'p_money' => $money,
            'p_time' => $time
        ];
        $res=Db::table('t_purchase')->insert($data);
        return $res;
    }
}
