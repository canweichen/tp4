<?php
namespace app\details\controller;
use \think\Controller;
use \think\Paginator;
use \think\Session;
use \think\Cache;
use \think\Db;
class Details extends Controller
{
    public function details()
    {
        return $this->fetch("details");
    }
    public function auction(){
        return $this->fetch("auction/auction");
    }

    //类  页面加载  获取数据
    public function type_data(){
        $type_data=db('t_tradesort')->where("fid",1)->select();
        $prefectural_data=db('areas')->where("cityid",350100)->select();

        $com_data = db('t_trade,t_user')
            ->where('t_user.userid = t_trade.userid')
            ->field('t_user.userid as userid,t_user.headimg,t_user.nickname,t_trade.tradename as tradename,
            t_trade.tradeid,t_trade.originalprice as originalprice,t_trade.imgurl')
            ->order('t_trade.createtime desc' )->paginate(20);

//        $province_arr = db("provinces")->select();


        echo json_encode([$type_data,$prefectural_data,$com_data]);

//       return $this->fetch("type/type");
    }
    //nav分类
    public function nav_type(){
        $type_data=db('t_tradesort')->where("fid",null)->select();
        echo json_encode($type_data);
    }

    //点击nav分类
    public function nav_type_click(){
        $fid =input("?get.fid")?input("fid"):"";
        $cityid = input("?get.cityid")?input("cityid"):"";
        Session::set('fid',$fid);
        Session::set('cityid',$cityid);
        return $this->fetch("type/type");
    }
    //切换城市
    public function change_city(){
        $province_arr = db("provinces")->select();
        echo json_encode($province_arr);
    }
    // 类  搜索
    public function hunt_word(){
        $hunt_word = input('?get.hunt_word')?input("hunt_word"):'';
        $moneyid = input("?get.moneyid") ? input("moneyid"):"";
        $dinshi_name = input("?get.dinshi_name") ? input("dinshi_name"):"";
        $typenameid = input("?get.typenameid") ? input("typenameid"):"";
        if($typenameid=="" || $typenameid==999 || $typenameid==0){
//            $where_type = ["tradesortid"=>[13,14,15,16,17,18]];
            $where_type = null;
        }else{
            $where_type = ["t_trade.tradesortid"=>$typenameid];
        }
        if($moneyid=="" || $moneyid==999 ||$moneyid==0){
//            $where_money = ["moneyid"=>[1,2,3,4,5,6]];
            $where_money = null;
        }else{
            $where_money = ["t_trade.moneyid"=>$moneyid];
        }
        if($dinshi_name=="" || $dinshi_name=="全部"){
            $where_dinshi = null;
        }else{
            $where_dinshi = ["t_trade.areas" => $dinshi_name];
//            var_dump($where_dinshi);exit;
        }

        if($hunt_word!=''){
            $hunt_word = addslashes($hunt_word);
            $whereword = explode(" ",$hunt_word);
            $huntarr = array_filter($whereword);  // 删除空元素
            $wherelike=[];
            $wherename=[];
            if(!empty($huntarr)){
                foreach($huntarr as $v){
                    array_push( $wherelike,"%{$v}%");
                }
            }
            if(!empty($wherelike)){
                $wherename['tradename']=['like',$wherelike,'OR'];
//                Session::set('wherename',$wherename['tradename']);
            }

            $data =  db('t_trade,t_user')
                ->where('t_user.userid = t_trade.userid')->where($wherename)->where($where_dinshi)->where($where_money)->where($where_type)
                ->field('t_user.userid as userid,t_user.headimg,t_user.nickname,t_trade.tradename as tradename,
            t_trade.tradeid,t_trade.originalprice as originalprice,t_trade.imgurl')
                ->order('t_trade.createtime desc' )->paginate(20);
            echo json_encode($data);

        }


    }
    //类  分页
    public function initial_page(){
        $page = input("?get.page")?input("page"):"";
        $hunt_word = input("?get.hunt_word")?input("hunt_word"):"";

        $moneyid = input("?get.moneyid") ? input("moneyid"):"";
        $dinshi_name = input("?get.dinshi_name") ? input("dinshi_name"):"";
        $typenameid = input("?get.typenameid") ? input("typenameid"):"";
        if($typenameid=="" || $typenameid==999 || $typenameid==0){
//            $where_type = ["tradesortid"=>[13,14,15,16,17,18]];
            $where_type = null;
        }else{
            $where_type = ["t_trade.tradesortid"=>$typenameid];
        }
        if($moneyid=="" || $moneyid==999 ||$moneyid==0){
//            $where_money = ["moneyid"=>[1,2,3,4,5,6]];
            $where_money = null;
        }else{
            $where_money = ["t_trade.moneyid"=>$moneyid];
        }
        if($dinshi_name=="" || $dinshi_name=="全部"){
            $where_dinshi = null;
        }else{
            $where_dinshi = ["t_trade.areas" => $dinshi_name];
//            var_dump($where_dinshi);exit;
        }

        if($hunt_word!=""){
            $hunt_word = addslashes($hunt_word);
            $whereword = explode(" ",$hunt_word);
            $huntarr = array_filter($whereword);  // 删除空元素
            $wherelike=[];
            $wherename=[];
            if(!empty($huntarr)){
                foreach($huntarr as $v){
                    array_push( $wherelike,"%{$v}%");
                }
            }
            if(!empty($wherelike)){
                $wherename['tradename']=['like',$wherelike,'OR'];
            }
            $data =  db('t_trade,t_user')
                ->where('t_user.userid = t_trade.userid')->where($wherename)->where($where_dinshi)->where($where_money)->where($where_type)
                ->field('t_user.userid as userid,t_user.headimg,t_user.nickname,t_trade.tradename as tradename,
            t_trade.tradeid,t_trade.originalprice as originalprice,t_trade.imgurl')
                ->order('t_trade.createtime desc' )->limit(($page-1)*20,20)->select();
            echo json_encode($data);
            exit;

        }

        $com_data = db('t_trade,t_user')
            ->where('t_user.userid = t_trade.userid')->where($where_dinshi)->where($where_money)->where($where_type)
            ->field('t_user.userid as userid,t_user.headimg,t_user.nickname,t_trade.tradename as tradename,
            t_trade.tradeid,t_trade.originalprice as originalprice,t_trade.imgurl')
            ->order('t_trade.createtime desc' )->limit(($page-1)*20,20)->select();
//        var_dump($com_data);
        echo json_encode($com_data);
    }
    // 类  多级查询
    public function crumbs_data(){
        $moneyid = input("?get.moneyid") ? input("moneyid"):"";
        $dinshi_name = input("?get.dinshi_name") ? input("dinshi_name"):"";
        $typenameid = input("?get.typenameid") ? input("typenameid"):"";
        if($typenameid=="" || $typenameid==999 || $typenameid==0){
//            $where_type = ["tradesortid"=>[13,14,15,16,17,18]];
            $where_type = null;
        }else{
            $where_type = ["t_trade.tradesortid"=>$typenameid];
        }
        if($moneyid=="" || $moneyid==999 ||$moneyid==0){
//            $where_money = ["moneyid"=>[1,2,3,4,5,6]];
            $where_money = null;
        }else{
            $where_money = ["t_trade.moneyid"=>$moneyid];
        }
        if($dinshi_name=="" || $dinshi_name=="全部"){
            $where_dinshi = null;
        }else{
            $where_dinshi = ["t_trade.areas" => $dinshi_name];
//            var_dump($where_dinshi);exit;
        }
        $com_data = db('t_trade,t_user')
            ->where('t_user.userid = t_trade.userid')->where($where_dinshi)->where($where_money)->where($where_type)
            ->field('t_user.userid as userid,t_user.headimg,t_user.nickname,t_trade.tradename as tradename,
            t_trade.tradeid,t_trade.originalprice as originalprice,t_trade.imgurl')
            ->order('t_trade.createtime desc' )->paginate(20);
//        var_dump($com_data);
        echo json_encode($com_data);
    }
    //拍卖获取数据（和detail数据一起）
    public function addauction_data(){
        $auctionid=Session::get('font_auctionid');
        $auctionid = 1;
        $auction_data = db("t_auction")->where("auctionid",$auctionid)->find();
        echo json_encode($auction_data);
    }

    // 商品详情页 数据 浏览次数等
    public function details_data(){

//        $user=Session::get('user');
        //        $tradeid= cookie('tradeid');
        $tradeid= 1;
//        $userid=1;

        $trade_user_id = db("t_trade")->where("tradeid",$tradeid)->field("userid")->find();

        $user = db("t_user")->where("userid",$trade_user_id["userid"])->select();
//        var_dump($user);exit;
        //发布者id

        db("t_trade")->where("tradeid",$tradeid)->setInc("lookcount");
        $com_data = db("t_trade")->where("tradeid",$tradeid)->find();
        $user_com_data = db("t_trade")->where("userid",$user[0]['userid'])->order('t_trade.createtime desc' )->limit(0,2)->select();

        $com_img = db("t_tradeimages")->where("tradeid",$tradeid)->select();

//        $com_msg_data = db("t_message")->join("t_user")->where("t_message.tradeid",$tradeid)
//            ->where("t_user.userid",$userid)->order('t_message.msgtime desc' )->limit(0,2)->select();
        $com_msg_data = Db::table('t_message')
            ->alias('a')
            ->join('t_user b','a.userid = b.userid')
            ->where("a.tradeid",$tradeid)
            ->order('a.msgtime desc' )
            ->limit(0,2)
            ->select();

        $com_msg_count = db("t_message")->where("tradeid",$tradeid)->count();
        echo json_encode([$com_data,$com_img,$user_com_data,$user,$com_msg_data,$com_msg_count]);

    }
    //收缩分页
    public function shrink_page(){
        $tradeid = input("?get.tradeid") ? input("tradeid"):"";
        $com_msg_data = Db::table('t_message')
            ->alias('a')
            ->join('t_user b','a.userid = b.userid')
            ->where("a.tradeid",$tradeid)
            ->order('a.msgtime desc' )
            ->limit(0,2)
            ->select();
        if(!empty($com_msg_data)){
            echo json_encode($com_msg_data);
        }
    }
    //加价
    public function auction_bid(){
        $addprice = input("?get.addprice")?input("addprice"):"";
        $auctionid=Session::get('font_auctionid');
        $user=Session::get('user');
        $userid = 1;
        $auctionid = 1;
        $isAuction = db("t_refund")->where("userid",$userid)->where('auctionid',$auctionid)->where("state",1)->select();
        if(empty($isAuction)){
            return config("errorMsg")['isAuction']['code_err'];
        }
        $bool_currentprice = db("t_auction")->where("auctionid",$auctionid)->setInc('currentprice',$addprice);
        $bool_total = db("t_auction")->where("auctionid",$auctionid)->setInc('total',1);
        $payauction_data = db("t_payauction")->where("auctionid",$auctionid)->where("userid",$userid)->select();
        if(empty($payauction_data)){
            $bool_joinpeople = db("t_auction")->where("auctionid",$auctionid)->setInc('joinpeople',1);
        }
        $total_currentprice = db("t_auction")->where("auctionid",$auctionid)->select();
        $data = [
            "auctionid"=>$auctionid,
            "currentmoney"=>$total_currentprice,
            "userid"=>$userid,
            "createtime"=>date("Y-m-d H-i-s",time())
        ];
        $res=db('t_payauction')->insert($data);
        if($res == 1){
            return config("errorMsg")['isADDmoney']['code_ok'];
        }else{
            return config("errorMsg")['isADDmoney']['code_err'];
        }
    }
    //保证金 (查看是否交)
    public function cash_deposit(){
        $auctionid=Session::get('font_auctionid');
        $user=Session::get('user');
        $userid = 1;
        $auctionid = 1;
        $isAuction = db("t_refund")->where("userid",$userid)->where('auctionid',$auctionid)->where("state",1)->select();
        $config = [
            'errorMsg'=>[
                'isAuction' => [
                    'code_ok' => ['msg'=>'押金已经交了','code'=>15101,'data'=>[]],
                    'code_err' => ['msg'=>'押金没有交','code'=>15201,'data'=>["auction_data"=>$isAuction]]
                ]
            ]
        ];
        \think\config::set($config);
        $auction_data=\think\config::get('errorMsg')['isAuction']['code_ok'];
        $auction_data_err=\think\config::get('errorMsg')['isAuction']['code_err'];
        if(empty($isAuction)){
            return json($auction_data);
        }else{
            return json($auction_data_err);
        }
    }
    //交保证金
    public function to_cash_deposit(){
        $auction_password = input("?get.auction_password")?input("auction_password"):"";
        $auction_password = addslashes($auction_password);
        $auctionid=Session::get('font_auctionid');
        $user=Session::get('user');
        $userid = 1;
        $auctionid = 1;
        if($auction_password != $user.password){
            return config("errorMsg")['isPassword']["code_err"];
        }
        $cash = db("t_auction")->where('auctionid',$auctionid)->field("cash")->select();
        $cash =floatval($cash);
        $user_money =floatval($user.money);
        if($cash>$user_money){
            return config("errorMsg")['isPassword']["code_err"];
        }
        $isAuction = db("t_refund")->where("userid",$userid)->where('auctionid',$auctionid)->where("state",1)->select();
        if(!empty($isAuction)){
            return config('errorMsg')['isAuction']['code_ok'];
        }

        $data = [
            "auctionid"=>$auctionid,
            "userid"=>$userid,
            "cash"=>$cash,
            "state"=>1,
            "createtime"=>date("Y-m-d H-i-s",time())
        ];
        $res=db('t_refund')->insert($data);
        if($res == 1){
            return config('errorMsg')['isAuction']['input_code_ok'];
        }else{
            return config('errorMsg')['isAuction']['input_code_err'];
        }

    }
    //查看更多发布的商品
    public function issue_more_trade(){
        $issue_userid = input("?get.issue_userid")?input("issue_userid"):'';
        $issue_trade = db("t_trade")->where("userid",$issue_userid)->paginate(10);
//        var_dump($issue_trade);exit;
        $this->assign("issue_trade",json_encode($issue_trade));
        return $this->fetch("issue_trade/issue_trade");
    }
    //用户发布商品分页
    public function issue_page(){
        $issue_userid = input("?get.issue_userid")?input("issue_userid"):'';

        $page = input("?get.page")?input("page"):"";

        $issue_trade = db("t_trade")->where("userid",$issue_userid) ->order('createtime desc' )->limit(($page-1)*10,10)->select();

        echo json_encode($issue_trade);
    }
    //获取发布者信息
    public function issue_user(){
        $issue_userid = input("?get.issue_userid")?input("issue_userid"):'';
        $issue_user = db("t_user")->where("userid",$issue_userid)->find();
        echo json_encode($issue_user);
    }
    //单一城市切换 省
    public function provinces(){
        $province_data = db("provinces")->select();
        return $province_data;
    }
    //单一城市切换 市
    public function cities($provinceid=null,$cityid=null){
        $where_city = [];
        $where_provice = [];
        if(!empty($cityid)){
            $where_city = [
                "cityid"=>$cityid
            ];
        }
        if(!empty($cityid)){
            $where_provice = [
                "provinceid"=>$provinceid
            ];
        }
        $city_data = db("cities")->where($where_provice)->where($where_city)->select();
        return $city_data;
    }
    //单一城市切换
    public function areas($cityid=null,$areaid=null){
        $where_areas = [];
        $where_city = [];
        if(!empty($cityid)){
            $where_city = [
                "cityid"=>$cityid
            ];
        }
        if(!empty($areaid)){
            $where_areas = [
                "areaid"=>$areaid
            ];
        }
        $areas_data = db("cities")->where($where_areas)->where($where_city)->select();
        return $areas_data;
    }
    //显示更多评论
    public function more_content_data(){
//        $userid = input("?get.userid")?input("userid"):"";
        $tradeid = input("?get.tradeid")?input("tradeid"):"";
        $com_more_msg_data = Db::table('t_message')
            ->alias('a')
            ->join('t_user b','a.userid = b.userid')
            ->where("a.tradeid",$tradeid)
            ->order('a.msgtime desc' )
            ->paginate(6);

        if(!empty($com_more_msg_data)){
            echo json_encode($com_more_msg_data);
        }else{
            echo "查询失败";
        }
    }
    //评论分页
    public function content_page(){
        $page = input("?get.page")?input("page"):"";
        $tradeid = input("?get.tradeid")?input("tradeid"):"";
        $com_more_msg_data = Db::table('t_message')
            ->alias('a')
            ->join('t_user b','a.userid = b.userid')
            ->where("a.tradeid",$tradeid)
            ->order('a.msgtime desc' )
            ->limit(($page-1)*6,6)
            ->select();
        if(!empty($com_more_msg_data)){
            echo json_encode($com_more_msg_data);
        }
    }
    //购物车
    public function shopping_car(){
        $userid = input("?get.userid")?input("userid"):"";
        $tradeid = input("?get.tradeid")?input("tradeid"):"";
        $tradename = input("?get.tradename")?input("tradename"):"";
        $originalprice = input("?get.originalprice")?input("originalprice"):"";
        $user=Session::get('user');

        if(!empty($user)){
            $data=[
                "userid"=>$userid,
                "tradeid"=>$tradeid,
                "tradename"=>$tradename,
                "originalprice"=>$originalprice,
                "createtime"=>time()
            ];
            $newid=db("shoppingcar")->insertGetId($data);
            if(!empty($newid)){
                return config('errorMsg')['isADD']['code_ok'];
            }else{
                return config('errorMsg')['isADD']['code_err'];
            }
        }else{
            return config('errorMsg')['islogin']['code_err'];
        }

    }
    //l立即购买
    public function promptly(){
        $userid = input("?get.userid")?input("userid"):"";
        $tradeid = input("?get.tradeid")?input("tradeid"):"";
        $tradename = input("?get.tradename")?input("tradename"):"";
        $originalprice = input("?get.originalprice")?input("originalprice"):"";
//        var_dump($originalprice);exit;
        $user=Session::get('user');

        if(empty($user)){
            $data_order=[
                "userid"=>$userid,
                "sellerid"=>$user,
                "tradeid"=>$tradeid,
                "total"=>$originalprice,
                "createtime"=>time(),
                "orderstate"=>1
            ];

            $orderid=db("t_order")->insertGetId($data_order);
            $data_order_relation=[
                "s_orderid"=>$orderid,
                "s_tradeid"=>$tradeid,
                "s_num"=>1
            ];
            if(!empty($orderid)){
                $data_order_relation=[
                    "s_orderid"=>$orderid,
                    "s_tradeid"=>$tradeid,
                    "s_num"=>1
                ];
                db("t_order_relation")->insertGetId($data_order_relation);
                return config('errorMsg')['isADD']['code_ok'];
            }else{
                return config('errorMsg')['isADD']['code_err'];
            }
        }else{
            return config('errorMsg')['islogin']['code_err'];
        }
    }
    //收藏
    public function collect(){
        $userid = input("?get.userid")?input("userid"):"";
        $tradeid = input("?get.tradeid")?input("tradeid"):"";


        $user=Session::get('user');
        if(!empty($user)){

            $bool=db("t_trade")->where("tradeid",$tradeid)->setInc("collectcount");
            if($bool==true){
                return config('errorMsg')['isCollect']['code_ok'];
            }else{
                return config('errorMsg')['isCollect']['code_err'];
            }
        }else{
            return config('errorMsg')['islogin']['code_err'];
        }
    }
    //跳转到商品详情
    public function details_page(){
        $tradeid = input("?get.tradeid")?input("tradeid"):"";
//        var_dump($tradeid);
//        cookie('tradeid',$tradeid);  //设置cookie
        Session::set('tradeid',$tradeid);
        return $this->fetch("details/details");

    }
    //发布评论
    public function content_data(){
        $user=Session::get('user');
        if(empty($user)){
            $tradeid = input("?get.tradeid")?input("tradeid"):"";
            $userid = input("?get.userid")?input("userid"):"";

            $fabu_content = input("?get.fabu_content")?input("fabu_content"):"";
            $fabu_content = addslashes($fabu_content);
            $data = [
                "tradeid"=>$tradeid,
                "userid"=>$userid,
                "content"=>$fabu_content,
                "msgtime"=>date("Y-m-d H-i-s",time())
            ];

            $newid=db("t_message")->insertGetId($data);
            if(!empty($newid)){
                $com_msg_data = Db::table('t_message')
                    ->alias('a')
                    ->join('t_user b','a.userid = b.userid')
                    ->where("a.tradeid",$tradeid)
                    ->order('a.msgtime desc' )
                    ->limit(0,2)
                    ->select();
                $isFabu =[
                    'msg'=>'评论已发布',
                    'code'=>14103,
                    'data'=>[$com_msg_data]
                ];
                return $isFabu;
            }else{
                return config("errorMsg")["isFabu"]["code_err"];
            }
        }else{
            return config("errorMsg")['islogin']["code_err"];
        }
    }
    //获取市级
    public function cities_arr(){
        $provinceid = input("?get.provinceid")?input("provinceid"):"";
        $cities_arr = db("cities")->where("provinceid",$provinceid)->select();
        echo json_encode($cities_arr);
    }

}
