/**
 * Created by Machenike on 2018/1/27.
 */
$(function(){
    //返回网站首页
    $("#exit").click(function(){
        //window.location.href='{{:url("user/user/exitLogin")}}';
    });
    //前往登陆页面
    $(".gologin").click(function(){
        location.href=go_login;
    });
    /*
    * 注册页面的失焦验证事件*/
    var $account=$("input[name='user']");
    var $psd=$("input[name='password']");
    var $rePsd=$("input[name='rePassword']");
    $account.blur(checkAccount);
    $psd.blur(checkPassword);
    $rePsd.blur(checkRePassword);
    $("input[name='code']").blur(checkCode);
    /*
     *operation:注册表单提交事件
     * * user:陈灿伟
     * name:用户注册
     * params:account password repassword code
     * return:json
     * time:2018.1.27
     * */
    $(".register").click(function(){
       if(accountOk && checkPassword() && checkRePassword() && checkCode()){
           $data={
               "user":$("input[name='user']").val(),
               "psd":$("input[name='password']").val(),
               "code":$("input[name='code']").val()
           };
           $.ajax({
               type:'post',
               url:go_register,
               data:$data,
               success:function(res){
                   var result=JSON.parse(res);
                   var index=layer.open({
                       title:'注册提示信息',
                       content:result.msg,
                       yes:function(){
                           if(result.code=='9000'){
                               location.href=go_login;
                           }else{
                               layer.close(index);
                           }
                       }
                   });
               }
           })
       }
    });
});


/*
*operation:注册信息正则验证-账号
* * user:陈灿伟
* name:checkAccount
* params:account
* return:bool
* time:2018.1.27
* */
var accountOk;
function checkAccount(){
    var $createAccount= $("input[name='user']");
    var createAccount=$createAccount.val();
    var $reg1=$(".check").eq(0);
    if(createAccount==''){
        $reg1.text("用户账号不能为空");
        $reg1.css({color:"red",fontSize:"13px"});
        return false;
    }else{
        var regu =/^1[3|4|5|7|8][0-9]{9}$/;
        var re = new RegExp(regu);
        var bool0=re.test(createAccount);
        if(bool0){
            $.ajax({
                type:'post',
                url:check_account,
                data:{'id':createAccount},
                dataType:'text',
                success:function(res){
                    if(JSON.parse(res).code=='9000'){
                        $reg1.text("用户账号合法");
                        $reg1.css({color:"darkGreen",fontSize:"13px"});
                        accountOk= true;
                    }else{
                        $reg1.text("用户账号已被注册");
                        $reg1.css({color:"red",fontSize:"13px"});
                        accountOk= false;
                    }
                }
            });
        }else{
            $reg1.text("手机号不合法");
            $reg1.css({color:"red",fontSize:"13px"});
            return false;
        }
    }
}
/*
 *operation:注册密码校验
 * user:陈灿伟
 * name:checkPassword
 * params:password
 * return:bool
 * time:2018.1.27
 * */
function checkPassword(){
    var $reg2=$(".check").eq(1);
    var psd=$("input[name='password']").val();
    if(psd==''){
        $reg2.text("用户密码不能为空");
        $reg2.css({fontSize:"13px",color:"red"});
        return false;
    }else{
        if(psd.length>=6 && psd.length<=16){
            var regu = "^[0-9a-zA-Z]+$";
            var re = new RegExp(regu);
            var bool2=re.test(psd);
            if(bool2){
                $reg2.text("用户密码安全");
                $reg2.css({fontSize:"13px",color:"darkGreen"});
                return true;
            }else{
                $reg2.text("用户密码只能由数字和字母组成,不能由特殊字符");
                $reg2.css({fontSize:"13px",color:"red"});
                return false;
            }
        }else{
            $reg2.text("用户密码长度由6-22位字符串组成");
            $reg2.css({fontSize:"13px",color:"red"});
            return false;
        }
    }
}

/*
 *operation:注册再次输入密码校验
 * * user:陈灿伟
 * name:checkRePassword
 * params:password
 * return:bool
 * time:2018.1.27
 * */
function checkRePassword(){
    var $reg3=$(".check").eq(2);
    var psd=$("input[name='password']").val();
    var repsd=$("input[name='rePassword']").val();
    if(repsd==''){
        $reg3.text("用户密码不能为空");
        $reg3.css({fontSize:"13px",color:"red"});
        return false;
    }else{
        if(psd==repsd){
            $reg3.text("用户密码一致");
            $reg3.css({fontSize:"13px",color:"darkGreen"});
            return true;
        } else{
            $reg3.text("用户密码不一致，重新输入");
            $reg3.css({fontSize:"13px",color:"red"});
            return false;
        }
    }
}

/*
 *operation:注册验证码校验
 * * user:陈灿伟
 * name:checkCode
 * params:code
 * return:bool
 * time:2018.1.27
 * */
function checkCode(){
    var $reg4=$(".check").eq(3);
    var checkN=$("input[name='code']").val();
    if(checkN==''){
        $reg4.text("验证码不能为空");
        $reg4.css({fontSize:"13px",color:"red"});
        return false;
    }else{
        $reg4.text("");
        $reg4.css({fontSize:"13px",color:"green"});
        return true;
    }
}