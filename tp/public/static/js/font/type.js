/**
 * Created by 07 on 2018/1/27.
 */


//面包屑
var type_body = new Vue({
    el:"#type_body",
    data : {
        static_url:static_url,
        //面包屑
        crumbs_arr :[],
        type_data_vue : [],
        prefectural_data_vue : [],
        show_dinshi_type:"",
        show_typename:"",
        show_money_type:0,
        crumbs_url:"",
        moneyid : 0,
        dinshi_typeid :0,
        typenameid :0,
        //xianshisanpin
        show_com : [],
        show_page : [],
        currentPage :1,
        totalpage : 0,
        //城市
        province_arr:[],
        cities_arr:[],
        provinceid :'110000',
        cityid :"110100",
        city_name:"福州"
    },
    methods:{
        to_change_city:function(){
            console.log(this.provinceid,this.cityid);
            for(var i=0;i<this.cities_arr.length;i++){
                if(this.cityid==this.cities_arr[i].cityid){
                    this.city_name = this.cities_arr[i].city;
                }
            }
        },
        province_option:function(event){

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

        type_name :function(typeid,typename){
            var _this = this;
            //console.log(typeid,typename);
            if(typename!=99){
               $("#show_typename").show();
                this.show_typename=typename;
            }else {
                this.show_typename='全部';
                $("#show_typename").hide();
            }
            this.typenameid=typeid;
            console.log(this.typenameid,this.moneyid,this.dinshi_typeid,1);
            $.ajax({
                url:crumbs_url,
                data:{"typenameid":this.typenameid,"moneyid":this.moneyid,"dinshi_name":this.show_dinshi_type},
                type:"get",
                dataType:"json",
                success:function(res)
                {
                    console.log(res);
                    _this.show_com=res.data;
                    _this.show_page= Math.ceil(res.total/res.per_page);
                    _this.totalpage=Math.ceil(res.total/res.per_page);

                }
            })

        },
        //区间内的金额
        type_money:function(moneyid){
            var _this=this;
            var money = $(event.target).html();
            //console.log(money);
            if(money!="全部"){
                $("#show_money").show();
                this.show_money_type=money;
            }else {
                this.show_money_type='全部';
                $("#show_money").hide();
            }
            this.moneyid=moneyid;
            console.log(this.typenameid,this.moneyid,this.show_dinshi_type,2);
            $.ajax({
                url:crumbs_url,
                data:{"typenameid":this.typenameid,"moneyid":this.moneyid,"dinshi_name":this.show_dinshi_type},
                type:"get",
                dataType:"json",
                success:function(res)
                {
                    console.log(res);
                    _this.show_com=res.data;
                    _this.show_page= Math.ceil(res.total/res.per_page);
                    _this.totalpage=Math.ceil(res.total/res.per_page);

                }
            })

        },
        type_dishi :function(typeid,typename){
            var _this=this;
            if(typename!=99){
                $("#show_dinshi").show();
                this.show_dinshi_type=typename;
            }else {
                this.show_dinshi_type='全部';
                $("#show_dinshi").hide();
            }
            this.dinshi_typeid=typeid;
            console.log(this.typenameid,this.moneyid,this.show_dinshi_type,3);
            $.ajax({
                url:crumbs_url,
                data:{"typenameid":this.typenameid,"moneyid":this.moneyid,"dinshi_name":this.show_dinshi_type},
                type:"get",
                dataType:"json",
                success:function(res)
                {
                    console.log(res);
                    _this.show_com=res.data;
                    _this.show_page= Math.ceil(res.total/res.per_page);
                    _this.totalpage=Math.ceil(res.total/res.per_page);

                }
            })

        },
        //搜索
        hunt:function(){
            var _this=this;
            var hunt_word=$("#hunt_word").val();
            //$("#hunt_word").empty();
            //console.log(hunt_word);
            if(hunt_word!='' ){
                $.ajax({
                    url:hunt_word_url,
                    data:{"hunt_word":hunt_word,"typenameid":this.typenameid,"moneyid":this.moneyid,"dinshi_name":this.show_dinshi_type},
                    type:"get",
                    dataType:"json",
                    success:function(res)
                    {
                        console.log(res);
                        _this.show_com=res.data;
                        _this.show_page= Math.ceil(res.total/res.per_page);
                        _this.totalpage=Math.ceil(res.total/res.per_page);

                    }
                 })
            }


        },
        //点击查看商品详情
        com_details:function(tradeid){

            window.location.href = details_data_url+"?tradeid="+tradeid;

            console.log(tradeid);
        },
        //点击查看发布者信息
        com_promulgator :function(userid){
            console.log(userid)
        },
        //上一页
        prev:function(){
            var _this=this;
            this.currentPage = this.currentPage - 1 >0 ?this.currentPage - 1:1;
            var hunt_word=$("#hunt_word").val();
            console.log(hunt_word);
            if(hunt_word!=''){
                var find_word=hunt_word;
            }
            $.ajax({
                url:initial_page_url,
                data:{'page':this.currentPage,'hunt_word':find_word,"typenameid":this.typenameid,"moneyid":this.moneyid,"dinshi_name":this.show_dinshi_type},
                type:"get",
                dataType:"json",
                success:function(res)
                {
                    console.log(res);
                    _this.show_com=res;
                }
            })
        },
        //下一页
        next:function(){
            var _this=this;
            this.currentPage = this.currentPage +1 <this.totalpage?this.currentPage +1:this.totalpage;
            var hunt_word=$("#hunt_word").val();
            console.log(hunt_word);
            if(hunt_word!=''){
                var find_word=hunt_word;
            }
            $.ajax({
                url:initial_page_url,
                data:{'page':this.currentPage,'hunt_word':find_word,"typenameid":this.typenameid,"moneyid":this.moneyid,"dinshi_name":this.show_dinshi_type},
                type:"get",
                dataType:"json",
                success:function(res)
                {
                    console.log(res);
                    _this.show_com=res;
                }
            })
        },
        //到相应数字页
        to_page:function(page_num){
            console.log(page_num);
            var _this=this;
            var hunt_word=$("#hunt_word").val();
            console.log(hunt_word);
            if(hunt_word!=''){
                var find_word=hunt_word;
            }
            $.ajax({
                url:initial_page_url,
                data:{'page':page_num,'hunt_word':find_word,"typenameid":this.typenameid,"moneyid":this.moneyid,"dinshi_name":this.show_dinshi_type},
                type:"get",
                dataType:"json",
                success:function(res)
                {
                    console.log(res);
                    _this.show_com=res;
                }
            })

        }
    },
    beforeCreate:function(){

    },
    created:function(){
        var _this=this;
        $.ajax({
            url:type_data_url,
            type : "get",
            data : "",
            dataType : "json",
            success : function(res){
                console.log(res);
                _this.type_data_vue=res[0];
                _this.prefectural_data_vue = res[1];
                _this.show_com= res[2].data;
                _this.show_page= Math.ceil(res[2].total/res[2].per_page);
                _this.totalpage=Math.ceil(res[2].total/res[2].per_page);
                //console.log(typeof (res[2].total),res[2].total/res[2].per_page)

                //_this.province_arr=res[3];
                //console.log(_this.province_arr);
                //console.log(_this.show_page,res[2].total,res[2].per_page)
            }
        });


    },
    beforeMount:function(){

    },
    mounted:function(){

    }

});

