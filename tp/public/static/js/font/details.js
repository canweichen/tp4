var auction_vue = new Vue({
    el:"#auction_vue",
    data : {
        collect_url:static_url+"images/honx.png",
        default_img :"",
        tradeid:"",
        img_arr:[],
        tradename:'',
        originalprice:0,
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
        //城市
        province_arr:[],
        cities_arr:[],
        provinceid :'110000',
        cityid :"110100",
        city_name:"福州"


    },
    methods:{
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
        //立即购买
        promptly:function(){
            var _this =this;
            $.ajax({
                url:details_promptly_url,
                data:{"tradeid":this.tradeid,"userid":this.userid,"tradename":this.tradename,"originalprice":this.originalprice},
                type:"get",
                dataType:"json",
                success:function(res)
                {
                    console.log(res);
                    layui.use('layer', function(){
                        var layer = layui.layer;
                        layer.msg(res.msg);
                    });

                }
            })

        },
        //加入购物车
        shopping_cart:function(){
            var _this =this;
            $.ajax({
                url:details_shopping_url,
                data:{"tradeid":this.tradeid,"userid":this.userid,"tradename":this.tradename,"originalprice":this.originalprice},
                type:"get",
                dataType:"json",
                success:function(res)
                {
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
        //商品详情
        com_details:function(tradeid){
            window.location.href = details_page+"?tradeid="+tradeid;
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
                        }
                        layui.use('layer', function(){
                            var layer = layui.layer;
                            layer.msg(res.msg);
                        });
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
                _this.originalprice = res[0].originalprice;
                _this.tradeid = res[0].tradeid;
                _this.tradedegree = res[0].tradedegree;
                _this.tradedescribe = res[0].tradedescribe;
                _this.userid = res[0].userid;

                _this.user_headimg = static_url+res[3][0].headimg;
                _this.user_nickname = res[3][0].nickname;
                _this.issue_userid = res[3][0].userid;

                _this.user_com_arr = res[2];

                _this.com_msg_arr= res[4];
                _this.msgcount= res[5];
                console.log(_this.com_msg_arr)



            }
        })
    }

});
