/**
 * Created by Machenike on 2018/1/25.
 */
$(function(){
  /*  layui.use('element', function(){
        var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
        //监听导航点击
        element.on('nav(demo)', function(elem){
        });
    });*/
    //我的地址鼠标悬乎事件
    var $address=$(".address").children("div");
    $address.eq(1).css({borderColor:"lightBlue",boxShadow:"0px 0px  10px 5px lightBlue"});
    $address.mouseover(function(){
       $address.css({borderColor:"lightGray",boxShadow:"0px 0px  0px 0px lightGray"});
        $(this).css({borderColor:"lightBlue",boxShadow:"0px 0px  10px 5px lightBlue"});
    });
    //我的收藏鼠标悬乎事件
    var $collect=$(".collect").children("div");
    $collect.eq(0).css({borderColor:"orange",boxShadow:"0px 0px  10px 5px orange"});
    $collect.mouseover(function(){
        $collect.css({borderColor:"lightGray",boxShadow:"0px 0px  0px 0px lightGray"});
        $(this).css({borderColor:"orange",boxShadow:"0px 0px  10px 5px orange"});
    });
    //收藏删除按钮悬乎事件
    var $tag_i=$(".delStyle");
    var $i=$(".delCol");
    $tag_i.mouseover(function(){
        $i.css("opacity",0) ;
        $i.eq($(this).index()-1).css("opacity",1);
    });
    //地址按钮隐藏显示
    var $ope_btn = $(".operation_btn");
    $(".show_address").mouseover(function(){
        $ope_btn.css("opacity",0);
        $ope_btn.eq($(this).index()-2).css("opacity",1);
    });
    //我的订单删除按钮显示隐藏
    var $tr=$(".showOrderIcon");
    var $wait=$(".waitTr");
    $wait.mousemove(function(){
        $tr.css('opacity',0);
        $(this).children('td').css('opacity',1);
    });
    $wait.mouseout(function(){
        $tr.css('opacity',0);
    });
    //模态框添加点击事件-->隐藏移动端menu
    $("#mobile").click(function(){
        $(".content_left").css("display","none");
        $("#mobile").css("display","none");
    });
    //显示移动端menu
    $(".open_mobile").click(function(){
        $(".content_left").css("display","block");
        $("#mobile").css("display","block");
    });
   /* var $dd=$(".content").find("dd");
    var $div=$(".content_right").children("div");*/
    //菜单栏的标签/页面切换
   /* $dd.click(function(){
        $div.css({display:"none"});
        $div.eq($(this).attr('id')-1).css({display:"block"});
    });*/
    //清空多张商品图片--普通商品
    $(".clear_picture").click(function(){
       $("#more_picture").html("");
    });
    $("#end_action").click(function(){
       //alert(123);
    });
    //上传图片
    layui.use('upload', function() {
        var $ = layui.jquery ,
            upload = layui.upload;
        //修改头像
        var uploadInst = upload.render({
            elem: '#heading',
            url: alter_heading,
            before: function (obj) {
                //预读本地文件示例，不支持ie8
                console.log(obj);
                obj.preview(function (index, file, result) {
                    $('#images').attr('src', result); //图片链接（base64）
                });
            },
            done: function (res) {
                //如果上传失败
                layer.msg('头像'+res.msg);
                if(res.code==0){
                    location.reload();
                }
            },
            error: function () {
                //演示失败状态，并实现重传
                var demoText = $('#demoText');
                demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-mini demo-reload">重试</a>');
                demoText.find('.demo-reload').on('click', function () {
                    uploadInst.upload();
                });
            }
        });
        //上传商品默认图片--普通商品
        upload.render({
            elem: '#default',
            url: '/upload/',
            before: function (obj) {
                //预读本地文件示例，不支持ie8
                console.log(obj);
                obj.preview(function (index, file, result) {
                    $('#default_img').attr('src', result); //图片链接（base64）
                });
            },
            done: function (res) {
                //如果上传失败
                if (res.code > 0) {
                    return layer.msg('上传失败');
                }
                //上传成功
            }
        });

        //上传详情商品--多张--普通商品
        upload.render({
            elem: '#more_pic_btn',
            url: '/upload/',
            multiple: true,
            before: function(obj){
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result){
                    $('#more_picture').append('<img src="'+ result +'" alt="'+ file.name +'" class="layui-upload-img" style="width: 120px;height: 120px">');
                });
            },
            done: function(res){
                //上传完毕
            }
        });
    });
    //财务明细的起始终止时间
    layui.use('laydate', function() {
        var laydate = layui.laydate;
       //我的财务开始结束时间
        laydate.render({
            elem: '#start_record'
            ,type: 'datetime'
        });
        laydate.render({
            elem: '#end_record'
            ,type: 'datetime'
        });
        //活动拍卖商品开始结束时间的选择
        laydate.render({
            elem: '#start_action'
            ,type: 'datetime'
        });
        laydate.render({
            elem: '#end_action'
            ,type: 'datetime'
        });
        //我的消息开始结束时间
        laydate.render({
            elem: '#start_message'
            ,type: 'datetime'
        });
        laydate.render({
            elem: '#end_message'
            ,type: 'datetime'
        });
    });
   //设置性别默认选中状态
    $("#openShade").click(function(){
       if(go_sex=='女'){
           $('input[name="uSex"]:last').attr("checked",'checked');
       }
    });
    //修改用户个人资料 姓名 生日 性别
    $("#alterUser").click(function(){
        var name=$("input[name='uName']").val();
        var birth=$("input[name='uBirth']").val();
        var sex=$("input[name='uSex']:checked").val();
        if(name!='' && birth!='' && sex!=''){
            $.ajax({
                type:'post',
                url:go_alter_user,
                data:{name:name,birth:birth,sex:sex},
                success:function(res){
                    var result=JSON.parse(res);
                    layer.msg(result.msg ,{icon:6} , function(){
                        if(result.code==0){
                            location.reload();
                        }
                    });
                }
            });
        }else{
          layer.msg("姓名不能为空" ,{icon:0});
        }
    });
});
getUrlWho();
/*锚点标签页的跳转 2018/1/30 陈灿伟
* 标志位获取 页面切换 样式切换*/
function getUrlWho(){
    //获取菜单标志位#009688
    var who=location.href.substr(location.href.indexOf('who')+4,1);
    var whoLg=location.href.substr(location.href.indexOf('lg')+3,1);
    var $div=$(".content_right").children("div");
    $div.css('display','none');
    var $dd=$(".content_left").find("dd");
    $dd.css('background','none');
    if(location.href.indexOf('who')!=-1){
       //我的订单标签页
        if(location.href.indexOf('lg')!=-1){
           var $body=$(".orderCont").children('div');
           $body.css('display','none');
           $body.eq(whoLg).css('display','block');
           var $li=$(".orderTab").children('li');
           $li.removeClass("layui-this");
           $li.eq(whoLg).addClass("layui-this");
       }
        $div.eq(who-1).css('display','block');
        $dd.eq(who-1).css('background','#009688');
    }else{
        $div.eq(0).css('display','block');
        $dd.eq(0).css('background','#009688');
    }
}
var app=new Vue({
    el:'#my_app',
    data:{
        judge:false,//判断活动商品的时间选项是否显示
        selected:'',//定义select框的默认值
        type:[
            {name:"普通商品",op:1},
            {name:"拍卖商品",op:2}
        ],//option数据
        //初始化省市区绑定数据数组
        navMessage:'',
        seem:true,
        provinceList:[],
        cityList:[],
        areasList:[],
        //默认选中的地址
        money:'',
        province:110000,
        city:110100,
        area:110101,
        defaultAdd:false,
        receiver:'',
        telephone:'',
        details:'',
        address_id:'',
        addressList:show_to_address,
        //收藏商品
        showCollect:show_to_collect,
        //待支付订单
        showWait:show_to_wait,
        showWaitRelation:show_to_waitRelation,
        //待支付订单
        showAlready:show_to_already,
        showAlreadyRelation:show_to_alreadyRelation
    },
    methods:{
        //充值
        addMoney:function(){
          if(this.money!='' && this.money>0){
              var m=layer.load();
              $.ajax({
                  type:'post',
                  url:go_add_money,
                  data:{money:this.money},
                  success:function(res){
                      layer.close(m);
                      var result=JSON.parse(res);
                      if(result.code=='2000'){
                          layer.msg(result.msg,{icon:1,time:1000},function(){
                              location.reload();
                          })
                      }else{
                          layer.msg(result.msg,{icon:2});
                      }
                  }
              });
          }else{
              layer.msg('充值金额必须合法',{icon:0,time:2000});
          }
        },
        //拍卖商品和普通商品发布页面切换
        actionType:function(){
            if(this.selected==2){
             this.judge=true;
            }else{
                this.judge=false;
            }
        },
        //退出登陆事件
        exitLogin:function(){
            layer.confirm("确定退出登陆？",{icon:3, title:'提示信息'},function(){
                $.ajax({
                    type:'post',
                    url:exit_login,
                    dataType:'text',
                    success:function(res){
                        var result=JSON.parse(res);
                        var shut=layer.open({
                            content:result.msg,
                            closeBtn:false,
                            yes:function(){
                                if(result.code==0){
                                    location.href=go_login;
                                }else{
                                    layer.close(shut);
                                }
                            }
                        })
                    }
                });
            });
        },
        //获取省份
        getProvince:function(id){
            $.ajax({
                type:'post',
                url:get_province,
                success:function(res){
                    this.provinceList=JSON.parse(res);
                    if(id[0]==1){
                        this.province = JSON.parse(res)[0].provinceid;
                        this.getCity([1,2,3]);
                    }else{
                        this.province = id[0];
                        this.getCity(id);
                    }
                }.bind(this)
            });
        },
        //获取市区
        getCity:function(id){
            $.ajax({
                type:'post',
                url:get_city,
                data:{"province":this.province},
                success:function(res){
                    this.cityList=JSON.parse(res);
                    if(id[0]==1){
                        this.city = JSON.parse(res)[0].cityid;
                        this.getArea([1,1,3]);
                    }else{
                        this.getArea(id);
                        this.city = id[1];
                    }
                }.bind(this)
            });
        },
        //获取区县
        /*--if判断为识别标志位 有条件按条件进行（用于修改地址 修改商品） 没条件按没条件进行操作（添加地址 添加商品 完善个人资料）--*/
        getArea:function(id){
            if(id[1]!=1){
                this.city = id[1];
            }
            if(this.city!=""){
                $.ajax({
                    type:'post',
                    url:get_areas,
                    data:{"city":this.city},
                    success:function(res){
                        this.areasList=JSON.parse(res);
                        if(id[1]==1){
                            this.area = JSON.parse(res)[0].areaid;
                        }else{
                            this.area = id[2];
                        }
                    }.bind(this)
                });
            }
        },
        //姓名正则
        checkName:function(){
            if(this.receiver==""){
                layer.msg('姓名不能为空',{icon:0});
                return false;
            }else{
                var regName =/^[\u4e00-\u9fa5]{2,4}$/;
                if(!regName.test(this.receiver)){
                    layer.msg('姓名不合法',{icon:0});
                    return false;
                }else{
                    return true;
                }
            }
        },
        //正则手机号
        checkPhone:function(){
            if(this.telephone!=""){
                var regu =/^1[3|4|5|7|8][0-9]{9}$/;
                var re = new RegExp(regu);
                if(re.test(this.telephone)){
                    return true;
                }else{
                    layer.msg("手机号不合法",{icon:0});
                    return false;
                }
            }else{
                layer.msg("手机号不为空",{icon:0});
                return false;
            }
        },
        //添加地址
        addAddress:function(){
            this.province=110000;
            this.city=110100;
            this.area=110101;
            this.getProvince([1]);
            this.navMessage='添加收货地址';
            this.seem=true;
            this.defaultAdd=false;
            this.receiver='';
            this.telephone='';
            this.details='';
        },
        //保存地址-新建
        saveAddress:function(){
            if(this.checkName() && this.checkPhone()){
                var checkB=0;
                if(this.defaultAdd){
                    checkB=1;
                }
                var data={
                    name:this.receiver,
                    phone:this.telephone,
                    province:this.province,
                    city:this.city,
                    area:this.area,
                    checkBox:checkB,
                    details:this.details
                };
                $.ajax({
                    type:'post',
                    url:go_to_address,
                    data:data,
                    success:function(res){
                        var result=JSON.parse(res);
                        if(result.code==0){
                            layer.msg(result.msg,{icon:1,time:500},function(){
                                location.reload();
                            })
                        }else{
                            layer.msg(result.msg,{icon:3});
                        }
                    }
                })
            }
        },
        //删除地址
        deleteAddress:function(id){
            var m=layer.confirm("删除后无法找回，是否确定删除？",{icon: 3, title:'删除前温馨提示'},function(){
                layer.close(m);
                var index = layer.load();
                $.ajax({
                    type:'post',
                    url:go_address_delete,
                    data:{'id':id},
                    success:function(res){
                        layer.close(index);
                        var result=JSON.parse(res);
                        if(result.code==0){
                            layer.msg(result.msg,{icon:1,time:500},function(){
                                location.reload();
                            });
                        }else{
                            layer.msg(result.msg,{icon:2});
                        }
                    }
                });
            });
        },
        //设为默认地址
        defaultAddress:function(id){
            var m=layer.confirm("是否将该地址设为默认地址",{icon:0},function(){
                layer.close(m);
                var index=layer.load();
                $.ajax({
                    type:'post',
                    url:go_address_default,
                    data:{id:id},
                    success:function(res){
                        layer.close(index);
                        var result=JSON.parse(res);
                        if(result.code==0){
                            layer.msg(result.msg,{icon:1,time:500},function(){
                                location.reload();
                            });
                        }else{
                            layer.msg(result.msg,{icon:2});
                        }
                    }
                });
            })
        },
        //已是默认地址
        alreadyAddress:function(){
            layer.msg('老铁，已经是你想要的结果咯',{icon:6,time:1500});
        },
        //修改地址
        alterAddress:function(id){
            this.address_id=id;
            this.navMessage='修改当前地址';
            this.seem=0;
            $.ajax({
                type:'post',
                url:go_get_address_information,
                data:{id:id},
                success:function(res){
                    var result=JSON.parse(res);
                    //this.province=result[1];
                    this.getProvince([result[1],result[2],result[3]]);
                    //this.getCity([result[2],result[3]]);
                    if(result[0][0].addressflag){
                       this.defaultAdd=true;
                   }else{
                        this.defaultAdd=false;
                    }
                    this.receiver=result[0][0].receivername;
                    this.telephone=result[0][0].phone;
                    this.details=result[0][0].content;
                }.bind(this)
            });
        },
        //保存修改后的地址
        alterFromAddress:function(){
            if(this.checkName() && this.checkPhone()){
                var checkB=0;
                if(this.defaultAdd){
                    checkB=1;
                }
                var data={
                    name:this.receiver,
                    phone:this.telephone,
                    province:this.province,
                    city:this.city,
                    area:this.area,
                    checkBox:checkB,
                    details:this.details,
                    id:this.address_id
                };
                $.ajax({
                    type:'post',
                    url:go_address_alter,
                    data:data,
                    success:function(res){
                        var result=JSON.parse(res);
                        if(result.code==0){
                            layer.msg(result.msg,{icon:1,time:500},function(){
                                location.reload();
                            })
                        }else{
                            layer.msg(result.msg,{icon:3});
                        }
                    }
                })
            }
        },
        //删除收藏
        deleteCollect:function(id){
            var m=layer.confirm("是否残忍的取消当前收藏",{icon:0,title:'删除警示'},function(){
                layer.close(m);
                var index=layer.load();
                $.ajax({
                    type:'delete',
                    url:go_to_deleteCollect,
                    data:{id:id},
                    success:function(res){
                        layer.close(index);
                        var result=JSON.parse(res);
                        if(result.code==0){
                            layer.msg(result.msg,{icon:1,time:1500},function(){
                                location.reload();
                            });
                        }else{
                            layer.msg(result.msg,{icon:2,time:1500});
                        }
                    }
                });
            })
        },
        //取消订单
        cancelOrder:function(id){
            var m=layer.confirm('确定取消当前订单',{icon:0},function(){
                layer.close(m);
                var index=layer.load();
                $.ajax({
                    type:'delete',
                    url:go_to_delete_wait,
                    data:{id:id},
                    success:function(res){
                        layer.close(index);
                        var result=JSON.parse(res);
                        if(result.code == 0){
                            layer.msg(result.msg,{icon:1,time:1000},function(){
                               location.reload();
                            });
                        }else{
                            layer.msg(result,{icon:2});
                        }
                    }
                });
            })
        },
        //付款
        goToPay:function(id){
            //支付页面的跳转
            //location.href=go_pay+"?xx="+id;
            var m=layer.load();
            $.ajax({
                type:'post',
                url:go_pay,
                data:{id:id},
                success:function(res){
                    layer.close(m);
                    var result=JSON.parse(res);
                    if(result.code=='2000'){
                        layer.msg(result.msg,{icon:1,time:2000},function(){
                            location.reload();
                        });
                    }else if(result.code=='2003'){
                        layer.confirm(result.msg+"，是否前往充值",{icon:5},function(){
                            location.href=go_user;
                        });
                    }else{
                        layer.msg(result.msg,{icon:2,time:2000});
                    }
                }
            });
        },
        //删除订单下的某个商品
        cancelChildTrade:function(nodeId,orderId){
            var m=layer.confirm("确定移除该商品",{icon:0},function(){
                layer.close(m);
                var index=layer.load();
                $.ajax({
                    type:'delete',
                    url:go_delete_childTrade,
                    data:{cid:nodeId,oid:orderId},
                    success:function(res){
                        layer.close(index);
                        var result=JSON.parse(res);
                        if(result.code == 0){
                            layer.msg(result.msg,{icon:1,time:1000},function(){
                                location.reload();
                            });
                        }else if(result.code == '1004'){
                            layer.msg('每个订单至少一个商品',{icon:5});
                        }else{
                            layer.msg(result,{icon:2});
                        }
                    },error:function(res){
                        alert(res);
                    }
                });
            });
        },
        //获取已付款订单
        waitOrder:function(){
            location.href=get_wait_order;
        },
        //获取已付款订单
        alreadyOrder:function(){
            location.href=get_already_order;
        },
        //获取全部订单
        allOrder:function(){
            location.href=get_all_order;
        },
        //确认收货
        receipt:function(id){
            //layui框架的弹层 pass为空不执行回掉
            layer.prompt({title: '验证登陆密码',formType: 1,anim: 1}, function(pass,index){
                layer.close(index);
                var m=layer.load();
                $.ajax({
                    type:'post',
                    url:go_to_receipt,
                    data:{psd:pass,id:id},
                    success:function(res){
                        layer.close(m);
                        var result=JSON.parse(res);
                        if(result.code=='2004'){
                            layer.msg(result.msg,{icon:2,anim:1});
                        }else if(result.code=='2000'){
                            layer.msg(result.msg,{icon:1,anim:1,time:1500},function(){
                                location.reload();
                            });
                        }else{
                            layer.msg(result.msg,{icon:5,anim:1});
                        }
                    }
                });
            });
        }
    },
    mounted: function () {
       //加载完成后执行内容区
        //this.getProvince(1);
    }
});

