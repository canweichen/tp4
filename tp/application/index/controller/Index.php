<?php
namespace app\index\controller;

use \think\Controller;
//数据库操作
use \think\Db;

class Index extends Controller{

    public function index(){
        /*
           想要实例化视图文件，首先控制器要继承tp框架的基类，要继承基类，要先通过use关键字，引用基类命名空间
      */
        /*
             fetch()方法是thinkphp 去加载试图界面的一个函数，如果不加参数，thinkphp会根据你的控制器名字和方法名字去找
             view文件夹下的 控制器名文件夹/方法名.html
        */
        return $this->fetch('index');
    }

    public function showData(){
        // 首页显示商品
        $res=Db::table('t_trade')->where('tradesortid','=',2)->limit(5)->select();
        $res1=Db::table('t_trade')->where('tradesortid','=',1)->limit(5)->select();
        $res2=Db::table('t_trade')->where('tradesortid','=',3)->limit(5)->select();
        $res3=array_merge($res,$res1,$res2);
        return $res3;
    }
    public function order(){
        /*
           想要实例化视图文件，首先控制器要继承tp框架的基类，要继承基类，要先通过use关键字，引用基类命名空间
      */
        /*
             fetch()方法是thinkphp 去加载试图界面的一个函数，如果不加参数，thinkphp会根据你的控制器名字和方法名字去找
             view文件夹下的 控制器名文件夹/方法名.html
        */
        return $this->fetch('order');
    }
    public function showSite(){
        $res=Db::table('provinces')->select();
        return $res;
    }
    public function showCity(){
        //$provCode=$_POST['param.provCode'];
        $provCode=input('?post.provCode')?input('provCode'):'';

        $res1=Db::table('cities')->where(['provinceid'=>$provCode])->select();
//        var_dump($res1,"w");
        echo json_encode($res1) ;
    }
    public function showArea(){
        $cityCode=input('?post.cityCode')?input('cityCode'):'';
        $res2=Db::table('areas')->where(['cityid'=>$cityCode])->select();
        echo json_encode($res2);
    }
    public function shoppingCar(){
        /*
           想要实例化视图文件，首先控制器要继承tp框架的基类，要继承基类，要先通过use关键字，引用基类命名空间
      */
        /*
             fetch()方法是thinkphp 去加载试图界面的一个函数，如果不加参数，thinkphp会根据你的控制器名字和方法名字去找
             view文件夹下的 控制器名文件夹/方法名.html
        */
        return $this->fetch('shoppingCar/shoppingCar');
    }
    public function showCar(){
        $res=Db::table()->where()->select();
        echo json_encode($res);
    }
    /*public function showOrder(){

    }*/
}