/**
 * Created by BRUCE CHEN on 2018/1/28.
 */

function checkName(){
    var regName =/^[\u4e00-\u9fa5]{2,4}$/;
    if(!regName.test(name)){
          alert('真实姓名填写有误');
           return false;
    }
}
function checkIDNumber(){
    var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(!regIdNo.test(idNo)){
        alert('身份证号填写有误');
        return false;
    }
}

var app=new Vue({
    el:'#information',
    data:{
        //初始化提示语 姓名 电子邮箱 身份证号
        userName:'',
        userEmail:'',
        idCard:'',
        //绑定表单数据 姓名 电子邮箱 身份证号 性别
        name:'',
        email:'',
        IDNum:'',
        sex:'男',
        //初始化省市区联动
        provinceList:[],
        cityList:[],
        areasList:[],
        province:110000,
        city:110100,
        area:110101,
        ID:false,
        em:false
    },
    methods:{
        checkName:function(){
            var name=this.name;
            if(name==""){
                this.userName='姓名不能为空';
                return false;
            }else{
                var regName =/^[\u4e00-\u9fa5]{2,4}$/;
                if(!regName.test(name)){
                    this.userName='真实姓名填写有误';
                    return false;
                }else{
                    this.userName='';
                    return true;
                }
            }
        },
        checkEmail:function(){
            var email=this.email;
            if(email==""){
                this.userEmail='邮箱不能为空';
                return false;
            }else{
                var szReg=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                if(!szReg.test(email)){
                    this.userEmail='邮箱不合法';
                    return false;
                }else{
                    $.ajax({
                        type:'post',
                        url:check_email,
                        data:{"email":email},
                        success:function(res){
                            var result=JSON.parse(res);
                            if(result.code=='9000'){
                                this.userEmail='';
                                this.em = true;
                            }else{
                                this.userEmail='邮箱已被占用';
                                return false;
                            }
                        }.bind(this)
                    })
                }
            }
        },
        checkIDNum:function(){
            var idNo=this.IDNum;
            if(idNo==""){
                this.idCard='证件号不能为空';
                return false;
            }else{
                var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if(!regIdNo.test(idNo)){
                    this.idCard='填写合法证件号';
                    return false;
                }else{
                    $.ajax({
                        type:'post',
                        url:check_IDNum,
                        data:{"ID":idNo},
                        success:function(res){
                            var result=JSON.parse(res);
                            if(result.code=='9000'){
                                this.idCard='';
                                this.ID = true;
                            }else{
                                this.idCard='身份证号已被占用';
                                return false;
                            }
                        }.bind(this)
                    });
                }
            }
        },
        getProvince:function(){
            $.ajax({
                type:'post',
                url:get_province,
                success:function(res){
                    return JSON.parse(res);
                }
            });
        },
        getCity:function(){
            $.ajax({
                type:'post',
                url:get_city,
                data:{"province":this.province},
                success:function(res){
                    this.cityList=JSON.parse(res);
                    this.city = JSON.parse(res)[0].cityid
                }.bind(this)
            });
        },
        getArea:function(){
            if(this.city!=""){
                $.ajax({
                    type:'post',
                    url:get_areas,
                    data:{"city":this.city},
                    success:function(res){
                        alert(123);
                        this.areasList=JSON.parse(res);
                        this.area = JSON.parse(res)[0].areaid
                    }.bind(this)
                });
            }else{
                alert(456);
            }
        },
        spliceArr:function(){
            var arr=this.IDNum.substr(6,8).split('');
            var str='';
            for(var i=0;i<arr.length;i++){
                if(i%2==0 && i!=0 && i!=2){
                    str+='-'+arr[i];
                }else{
                    str+=arr[i];
                }
            }
            return str;
        },
        saveUser:function(){
            if(this.checkName() && this.em && this.ID){
                var data={
                    name:this.name,
                    email:this.email,
                    id:this.IDNum,
                    sex:this.sex,
                    province:this.province,
                    city:this.city,
                    area:this.area,
                    birthday:this.spliceArr()
                };
                $.ajax({
                    type:'post',
                    url:save_user,
                    data:data,
                    success:function(res){
                        var result=JSON.parse(res);
                        var index=layer.open({
                            content:result.msg,
                            closeBtn:false,
                            yes:function(){
                                if(result.code=='9000'){
                                    location.href=go_userCenter;
                                }else{
                                    layer.close(index);
                                }
                            }
                        });
                    }
                })
            }
        }
    },
    mounted: function () {
        //初始化省市区
        $.ajax({
            type:'post',
            url:get_province,
            success:function(res){
                this.provinceList=JSON.parse(res);
            }.bind(this)
        });
        $.ajax({
            type:'post',
            url:get_city,
            data:{"province":110000},
            success:function(res){
                this.cityList=JSON.parse(res);
            }.bind(this)
        });
        $.ajax({
            type:'post',
            url:get_areas,
            data:{"city":110100},
            success:function(res){
                this.areasList=JSON.parse(res);
            }.bind(this)
        });
    }
});


