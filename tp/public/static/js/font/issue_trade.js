

var issue_trade = new Vue({
    el:"#issue_trade",
    data : {
        issue_userid :"",
        user_headimg:"",
        user_nickname:"",
        issue_arr:[],
        big_type :[],
        pagetotal:[],
        static_url :static_url

    },
    methods:{
        //商品详情
        com_details:function(tradeid){
            window.location.href = details_page+"?tradeid="+tradeid;
        },
        //nav，分类
        to_type :function(res){
            console.log(res);
            window.location.href=nav_type_click+"?fid="+res+"&cityid="+this.cityid;
        },

        prev:function(){
            var _this = this;
            this.current_page = this.current_page-1 > 0 ? this.current_page-1 : 1;
            console.log(this.current_page);
            $.ajax({
                url:issue_page,
                type:"get",
                data:{"page":this.current_page,"issue_userid":this.issue_userid},
                dataType:"json",
                success:function(res){
                    _this.issue_arr = res;
                }

            })
        },
        next :function(){
            var _this=this;
            this.current_page = this.current_page+1 < this.pagetotal ? this.current_page+1 : this.pagetotal;
            console.log(this.current_page);
            $.ajax({
                url:issue_page,
                type:"get",
                data:{"page":this.current_page,"issue_userid":this.issue_userid},
                dataType:"json",
                success:function(res){
                    _this.issue_arr = res;
                }
            })
        },
        to_page:function(page){
            console.log(page);
            var _this=this;
            $.ajax({
                url:issue_page,
                type:"get",
                data:{"page":page,"issue_userid":this.issue_userid},
                dataType:"json",
                success:function(res){
                    console.log(res);
                    _this.issue_arr = res;
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
        this.issue_arr = issue_data.data;
        this.issue_userid = issue_data.data[0].userid;
        //alert(issue_data.data.)
        this.pagetotal=Math.ceil(issue_data.total/issue_data.per_page);

        var _this = this;
        $.ajax({
            url:issue_user,
            data:"issue_userid="+this.issue_userid,
            type:"get",
            dataType:"json",
            success:function(res)
            {
                console.log(res,"pp");

                _this.user_headimg = res.headimg;
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






