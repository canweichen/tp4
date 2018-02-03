var bus = new Vue();
var auction_vue = new Vue({
    el:"#auction_vue",
    data : {
        collect_url:static_url+"images/honx.png",
        default_img :"",
        tradeid:"",
        img_arr:[],
        tradename:'',
        //originalprice:0,
        tradedegree:"",
        areas:"",
        lookcount:0,
        collectcount:0,
        tradedescribe:"",
        userid:'',
        issue_userid :"",
        static_url : static_url,
        msgcount : 0,
        msg_content:"",
        more :"查看更多",
        user_nickname:"",
        msgtime :"",
        user_headimg:"",

        user_com_arr:[],
        com_msg_arr :[],
        pagetotal:0,
        current_page:1,

        //拍卖
        addprice : 0,
        total : 0,
        joinpeople : 0,
        startprice :0,
        currentprice:0,
        auction_cash:0,
        auctionModal:"",
        //城市
        province_arr:[],
        cities_arr:[],
        provinceid :'110000',
        cityid :"110100",
        city_name:"福州",
        //类
        big_type :""

    },
    methods:{
        //nav，分类
        to_type :function(res){
            console.log(res);
            window.location.href=nav_type_click+"?fid="+res+"&cityid="+this.cityid;
        },
        //加价
        auction_bid :function(){
            var _this =this;
            $.ajax({
                url :auction_bid_url,
                type :"get",
                data :"addprice="+this.addprice,
                dataType :"json",
                success :function(res){
                    console.log(res);
                    if(res.code==15100){
                        var currentprice =Number(_this.currentprice);
                        var addprice =Number(_this.addprice );
                        _this.currentprice = currentprice+addprice;
                        var total=Number(_this.total);
                        _this.total++;
                    }
                    layui.use('layer', function(){
                        var layer = layui.layer;
                        layer.msg(res.msg);
                    });


                }
            })
        },
        //判断保证金
        cash_deposit: function(){
            var _this =this;
            $.ajax({
                url:auction_cash_deposit_url,
                data:"",
                type:"get",
                dataType:"json",
                success:function(res)
                {
                    console.log(res);
                    if(res.code==15201){
                        _this.auction_cash = res.data.auction_data[0].cash;
                        //$('#auctionModal').show();
                        $('#auctionModal').modal('show');
                        //_this.auctionModal="auctionModal"
                    }

                    layui.use('layer', function(){
                        var layer = layui.layer;
                        layer.msg(res.msg);
                    });
                }
            })
        },
        //交保证金
        to_cash_deposit :function(){
            var auction_password = $("#auction_password").val();
            var _this =this;
            $.ajax({
                url:auction_to_cash_deposit_url,
                data:"auction_password="+auction_password,
                type:"get",
                dataType:"json",
                success:function(res)
                {
                    console.log(res);
                    if(res.code==15201){
                        _this.auction_cash = res.data.auction_data[0].cash;
                        //$('#auctionModal').show();
                        $('#auctionModal').modal('show');
                        //_this.auctionModal="auctionModal"
                    }
                    //alert(res.msg);
                    layui.use('layer', function(){
                        var layer = layui.layer;
                        layer.msg(res.msg);
                    });
                }
            })
        },

        //切换城市
        province_option: function () {
            console.log(event);
            var _this = this;
            $.ajax({
                url:details_cities_arr_url,
                type:"get",
                data :"provinceid="+this.provinceid,
                dataType :"json",
                success:function(res){
                    console.log(res);
                    _this.cities_arr = res;
                    if(res!=""){
                        _this.cityid =res[0].cityid;
                    }
                }
            })
        },
        //q切换城市
        change_city:function(){
            //$("#show_hide").toggle();
            var _this = this;
            $.ajax({
                url:details_change_city_url,
                data:"",
                type:"get",
                dataType:"json",
                success:function(res)
                {
                    console.log(res);
                    _this.province_arr=res;
                    console.log(_this.province_arr);
                    //_this.provinceid =res[0].provinceid;
                    _this.province_option()
                }
            })
        },
        to_change_city:function(){
            console.log(this.provinceid,this.cityid);
            for(var i=0;i<this.cities_arr.length;i++){
                if(this.cityid==this.cities_arr[i].cityid){
                    this.city_name = this.cities_arr[i].city;
                }
            }
        },
        //收藏
        collect:function(){
            var _this =this;
            $.ajax({
                url:details_collect_url,
                data:{"tradeid":this.tradeid,"userid":this.userid},
                type:"get",
                dataType:"json",
                success:function(res)
                {
                    if(res.code==14102){
                        _this.collect_url =static_url+ "images/honxin.png";
                    }
                    console.log(res);
                    layui.use('layer', function(){
                        var layer = layui.layer;
                        layer.msg(res.msg);
                    });
                }
            })

        },
        //查看更多用户发布的商品
        look_user_more_trade :function(){
            console.log(this.issue_userid);
            window.location.href = issue_more_trade +"?issue_userid="+ this.issue_userid;
        },
        //发布评论
        btn_content:function(){
            var _this=this;
            var fabu_content = $("#fabu_content").html();
            if(fabu_content!=''){
                $.ajax({
                    url:details_content_url,
                    data:{"tradeid":this.tradeid,"userid":this.userid,"fabu_content":fabu_content},
                    type:"get",
                    dataType:"json",
                    success:function(res)
                    {
                        console.log(res);
                        if(res.code==14103){
                            _this.com_msg_arr = res.data[0];
                            $("#fabu_content").empty();
                            layui.use('layer', function(){
                                var layer = layui.layer;
                                layer.msg(res.msg);
                            });
                        }else {
                            layui.use('layer', function(){
                                var layer = layui.layer;
                                layer.msg(res.msg);
                            });
                        }
                    }
                })
            }
        },
        small_big_img:function(url){
            this.default_img=static_url+url;
        },
        //查看更多评论
        more_msg : function () {
            $("#content_page").toggle();
            $("#look_more").toggle();
            $("#shrink").toggle();
            var _this = this;
            $.ajax({
                url:details_more_content_url,
                data:{"tradeid":this.tradeid,"userid":this.userid},
                type:"get",
                dataType:"json",
                success:function(res)
                {
                    console.log(res);
                    if(res=="查询失败"){
                        layui.use('layer', function(){
                            var layer = layui.layer;
                            layer.msg("没有更多了");
                        });
                    }else {

                        _this.com_msg_arr = res.data;
                        console.log(res.data);
                        if(res.per_page!=0){
                            _this.pagetotal=Math.ceil(res.total/res.per_page);
                        }

                    }
                }
            })

        },
        //商品详情
        com_details:function(tradeid){
            window.location.href = details_page+"?tradeid="+tradeid;
        },
        shrink_msg :function(){
            $("#content_page").toggle();
            $("#look_more").toggle();
            $("#shrink").toggle();
            var _this = this;
            $.ajax({
                url:details_shrink_page_url,
                data:{"tradeid":this.tradeid,"userid":this.userid},
                type:"get",
                dataType:"json",
                success:function(res)
                {
                    console.log(res);
                    _this.com_msg_arr = res;
                }
            })
        },
        prev:function(){
            var _this = this;
            this.current_page = this.current_page-1 > 0 ? this.current_page-1 : 1;
            console.log(this.current_page);
            $.ajax({
                url:details_content_page_url,
                type:"get",
                data:{"page":this.current_page,"tradeid":this.tradeid},
                dataType:"json",
                success:function(res){
                    _this.com_msg_arr = res;
                }

            })
        },
        next :function(){
            var _this=this;
            this.current_page = this.current_page+1 < this.pagetotal ? this.current_page+1 : this.pagetotal;
            console.log(this.current_page);
            $.ajax({
                url:details_content_page_url,
                type:"get",
                data:{"page":this.current_page,"tradeid":this.tradeid},
                dataType:"json",
                success:function(res){
                    _this.com_msg_arr = res;
                }

            })
        },
        to_page:function(page){
            console.log(page);
            var _this=this;

            $.ajax({
                url:details_content_page_url,
                type:"get",
                data:{"page":page,"tradeid":this.tradeid},
                dataType:"json",
                success:function(res){
                    console.log(res);
                    _this.com_msg_arr = res;
                }

            })
        }

    },
    beforeCreate:function(){

    },
    created:function(){

    },
    beforeMount:function(){

    },

    mounted:function(){
        var _this = this;
        $.ajax({
            url:details_data_url,
            data:"",
            type:"get",
            dataType:"json",
            success:function(res)
            {
                console.log(res);
                _this.img_arr = res[1];
                for(var i=0;i<res[1].length;i++){
                    if(res[1][i].defaultflag==1){
                        _this.default_img =static_url+res[1][i].imagesurl
                    }
                }
                _this.tradename = res[0].tradename;
                _this.areas = res[0].areas;
                _this.collectcount = res[0].collectcount;
                _this.lookcount = res[0].lookcount;
                //_this.originalprice = res[0].originalprice;
                _this.tradeid = res[0].tradeid;
                _this.tradedegree = res[0].tradedegree;
                _this.tradedescribe = res[0].tradedescribe;
                _this.userid = res[0].userid;

                _this.user_headimg = static_url+res[3][0].headimg;
                _this.user_nickname = res[3][0].nickname;
                _this.issue_userid = res[3][0].userid;
                console.log(res[3],"user");
                _this.user_com_arr = res[2];

                _this.com_msg_arr= res[4];
                _this.msgcount= res[5];

            }
        });
        $.ajax({
            url :details_addauction_url,
            type :"get",
            data : "",
            dataType :"json",
            success :function(res){
                console.log(res);
                _this.addprice = res.addprice;
                _this.total = res.total;
                _this.joinpeople = res.joinpeople;
                _this.startprice = res.startprice;
                _this.currentprice = res.currentprice;

                bus.$emit('id-selected',res.endtime)
            }
        });
        //分类组
        $.ajax({
            url :nav_type_url,
            type :"get",
            data : "",
            dataType :"json",
            success :function(res){
                console.log(res);
                _this.big_type = res;

            }
        })
    }


});

bus.$on('id-selected',function (time) {
    downtime(time);
});

function downtime(time){
    var time_now_server,time_now_client,time_end,time_server_client,timerID;
    time_end=new Date(time);
    time_end=time_end.getTime();
    time_now_server=new Date;
    time_now_server=time_now_server.getTime();

    time_now_client=new Date();
    time_now_client=time_now_client.getTime();

    time_server_client=time_now_server-time_now_client;
    setInterval( function()
        {
            var timer = $("#timer")[0];
            if(!timer){
                return ;
            }
            timer.innerHTML =time_server_client;
            var time_now,time_distance,str_time;
            var int_day,int_hour,int_minute,int_second;
                time_now=new Date();
            time_now=time_now.getTime()+time_server_client;
            time_distance=time_end-time_now;
            if(time_distance>0)
            {
                int_day=Math.floor(time_distance/86400000);
                time_distance-=int_day*86400000;
                int_hour=Math.floor(time_distance/3600000);
                time_distance-=int_hour*3600000;
                int_minute=Math.floor(time_distance/60000);
                time_distance-=int_minute*60000;
                int_second=Math.floor(time_distance/1000);
                if(int_hour<10){
                    int_hour="0"+int_hour;
                }
                if(int_minute<10){
                    int_minute="0"+int_minute;
                }
                if(int_second<10){
                    int_second="0"+int_second;
                }
                str_time = int_day+"天 "+ int_hour+"小时 "+ int_minute+"分钟 "+ int_second+"秒";
                timer.innerHTML=str_time;
            }
            else
            {
                timer.innerHTML ="拍卖结束";
                clearTimeout(timerID);
            }
        }
        ,1000);
}

//联系客服
function customer_service(){

}
//var ws = new WebSocket('ws://127.0.0.1:8888');
//ws.onopen=function(){
//    console.log('连接上服务器了');
//    var temporary=JSON.parse(localStorage.HF170712msg);
//    user_sender=temporary.sender;
//
//    var msg={
//        sender:user_sender,
//        receiver:'server',
//        type:temporary.type,
//        content:temporary.content,
//        msgid:111,
//        msgtime:(new Date()).getTime()
//    };
//    //msg是个对象，，，需要将这个对象转换为JSON格式字符串
//    var msgString=JSON.stringify(msg);
//    console.log(msgString);
//    ws.send(msgString);//发送给服务器
//};
//ws.onmessage=function(msg){
//    var msgObj=JSON.parse(msg.data);
//    console.log(msgObj,msgObj.content);
//    switch (msgObj.type){
//        case 'comdetailsResp':{
//
//        }
//            break;
//    }
//};
//ws.onclose=function(){
//    console.log('服务器关闭了')
//};






