/**
 * Created by Machenike on 2018/1/27.
 */
$(function(){
    //验证码更新切换
    $(".changeImg").click(function(){
        $(this).attr("src",img_src);
    });
    var $account=$("input[name='user']");
    var $psd=$("input[name='password']");
    $account.blur(checkLoginAccount);
    $psd.blur(checkLoginPassword);
    $("input[name='code']").blur(checkLoginCode);
    //登陆请求
    $("#loginBtn").click(function(){
        if(checkLoginAccount() && checkLoginPassword() && checkLoginCode()){
            //获取表单数据
            $data={
                "user":$("input[name='user']").val(),
                "psd":$("input[name='password']").val(),
                "code":$("input[name='code']").val()
            };
            $.ajax({
                type:'post',
                url:check_login,
                data:$data,
                success:function(res){
                    var result=JSON.parse(res);
                    var index=layer.open({
                        title:'登陆信息提示',
                        content:result.msg,
                        yes:function(){
                            if(result.code==0){
                                location.href=go_userCenter;
                            }else{
                                layer.close(index);
                            }
                        }
                    });
                }
            })
        }
    });
    //跳转到首页
    $("#exit").click(function(){
        //window.location.href='{{:url("user/user/exitLogin")}}';
    });
    //跳转到注册页面
    $(".go_create").click(function(){
        location.href=go_register;
    });
});

/*
 *operation:登陆信息正则验证-账号
 * * user:陈灿伟
 * name:checkLoginAccount
 * params:account
 * return:bool
 * time:2018.1.27
 * */
function checkLoginAccount(){
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
            $reg1.text("");
            $reg1.css({color:"darkGreen",fontSize:"13px"});
            return true;
        }else{
            $reg1.text("用户账号不合法");
            $reg1.css({color:"red",fontSize:"13px"});
            return false;
        }
    }
}
/*
 *operation:登陆密码校验
 * user:陈灿伟
 * name:checkLoginPassword
 * params:password
 * return:bool
 * time:2018.1.27
 * */
function checkLoginPassword(){
    var $reg2=$(".check").eq(1);
    var psd=$("input[name='password']").val();
    if(psd==''){
        $reg2.text("用户密码不能为空");
        $reg2.css({fontSize:"13px",color:"red"});
        return false;
    }else{
        $reg2.text("");
        $reg2.css({fontSize:"13px",color:"darkGreen"});
        return true;
    }
}
/*
 *operation:登陆验证码校验
 * * user:陈灿伟
 * name:checkLoginCode
 * params:code
 * return:bool
 * time:2018.1.27
 * */
function checkLoginCode(){
    var $reg4=$(".check").eq(2);
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