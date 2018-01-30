/**
 * Created by BRUCE CHEN on 2018/1/28.
 */
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
        //ajax请求定义全局变量 正则结果
        ID:false,
        em:false,
        //修改用户密码
        old:'',
        newPsd:'',
        newRePsd:'',
        oldPs:false,
        show:go_show,
        hide:go_hide
    },
    methods:{
        //用户姓名正则验证
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
        //电子邮箱正则验证
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
        //身份证正则验证
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
        //验证旧密码是否正确
        checkOldPsd:function(){
            if(this.old!=""){
                $.ajax({
                    type:'post',
                    url:check_old_psd,
                    data:{old:this.old},
                    success:function(res){
                        $result=JSON.parse(res);
                        if($result.code!='9000'){
                            layer.msg('密码不匹配',{icon:2});
                        }else{
                            this.oldPs = true;
                        }
                    }.bind(this)
                });
            }else{
                layer.msg("密码不为空",{icon:0});
            }
        },
        //验证新密码的正则
        checkNewPsd:function(){
            if(this.newPsd!="" && this.old != this.newPsd){
                if(this.newPsd.length>=6 && this.newPsd.length<=16){
                    var regu = "^[0-9a-zA-Z]+$";
                    var re = new RegExp(regu);
                    var bool2=re.test(this.newPsd);
                    if(bool2){
                        return true;
                    }else{
                        layer.msg("用户密码只能由数字和字母组成,不能由特殊字符",{icon:0});
                        return false;
                    }
                }else{
                    layer.msg("用户密码长度由6-22位字符串组成",{icon:0});
                    return false;
                }
            }else{
                layer.msg("新密码不为空或者新旧密码不能一致",{icon:0});
            }
        },
        //两次密码是否一致
        checkNewRePsd:function(){
          if(this.newRePsd != ""){
              if(this.newPsd == this.newRePsd){
                  return true;
              }else{
                  layer.msg('两次密码不一致',{icon:2});
                  return false;
              }
          }else{
              layer.msg('不为空',{icon:0});
              return false;
          }
        },
        //提交修改密码
        keepPassword:function(){
            if(this.checkNewPsd() && this.checkNewRePsd() && this.oldPs){
                var data={
                    newPsd:this.newPsd
                };
                $.ajax({
                    type:'post',
                    url:go_to_keep_password,
                    data:data,
                    success:function(res){
                        var result=JSON.parse(res);
                        if(result.code==0){
                            layer.msg(result.msg,{icon:6},function(){
                                location.reload();
                            });
                        }else{
                            layer.msg(result.msg , {icon:5});
                        }
                    }
                });
            }
        },
        //获取省份
        getProvince:function(){
            $.ajax({
                type:'post',
                url:get_province,
                success:function(res){
                    this.provinceList=JSON.parse(res);
                    this.province = JSON.parse(res)[0].provinceid;
                    this.getCity();
                }.bind(this)
            });
        },
        //获取市区
        getCity:function(){
            $.ajax({
                type:'post',
                url:get_city,
                data:{"province":this.province},
                success:function(res){
                    this.cityList=JSON.parse(res);
                    this.city = JSON.parse(res)[0].cityid;
                    this.getArea();
                }.bind(this)
            });
        },
        //获取区县
        getArea:function(){
            if(this.city!=""){
                $.ajax({
                    type:'post',
                    url:get_areas,
                    data:{"city":this.city},
                    success:function(res){
                        this.areasList=JSON.parse(res);
                        this.area = JSON.parse(res)[0].areaid
                    }.bind(this)
                });
            }
        },
        //通过省份正号截取出生年月日
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
        //保存用户资料信息
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
        this.getProvince();
     /*   $.ajax({
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
        });*/
    }
});


