/**
 * Created by Machenike on 2018/1/25.
 */
$(function(){
    layui.use('element', function(){
        var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
        //监听导航点击
        element.on('nav(demo)', function(elem){
        });
    });
    //模态框添加点击事件-->隐藏移动端menu
    $("#mobile").click(function(){
        console.log(window);
        $(".content_left").css("display","none");
        $("#mobile").css("display","none");
    });
    //显示移动端menu
    $(".open_mobile").click(function(){
        $(".content_left").css("display","block");
        $("#mobile").css("display","block");
    });
    var $dd=$(".content").find("dd");
    var $div=$(".content_right").children("div");
    //菜单栏的标签/页面切换
    $dd.click(function(){
        $div.css({display:"none"});
        $div.eq($(this).attr('id')-1).css({display:"block"});
    });
    //清空多张商品图片--普通商品
    $(".clear_picture").click(function(){
       $("#more_picture").html("");
    });
    $("#end_action").click(function(){
       alert(123);
    });
    //上传图片
    layui.use('upload', function() {
        var $ = layui.jquery ,
            upload = layui.upload;
        //普通图片上传
        var uploadInst = upload.render({
            elem: '#heading',
            url: '/upload/',
            before: function (obj) {
                //预读本地文件示例，不支持ie8
                console.log(obj);
                obj.preview(function (index, file, result) {
                    $('#images').attr('src', result); //图片链接（base64）
                });
            },
            done: function (res) {
                //如果上传失败
                if (res.code > 0) {
                    return layer.msg('上传失败');
                }
                //上传成功
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

        //上传商品默认图片--拍卖商品
        upload.render({
            elem: '#action_default',
            url: '/upload/',
            before: function (obj) {
                //预读本地文件示例，不支持ie8
                console.log(obj);
                obj.preview(function (index, file, result) {
                    $('#action_default_img').attr('src', result); //图片链接（base64）
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

        //上传详情商品--多张--拍卖商品
        upload.render({
            elem: '#moreAction_pic_btn',
            url: '/upload/',
            multiple: true,
            before: function(obj){
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result){
                    $('#moreAction_picture').append('<img src="'+ result +'" alt="'+ file.name +'" class="layui-upload-img" style="width: 120px;height: 120px">');
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
});
var app=new Vue({
    el:'#my_app',
    data:{
        judge:false,//判断活动商品的时间选项是否显示
        selected:'',//定义select框的默认值
        type:[
            {name:"普通商品",op:1},
            {name:"拍卖商品",op:2}
        ]//option数据
    },
    methods:{
        actionType:function(){
            if(this.selected==2){
             this.judge=true;
            }else{
                this.judge=false;
            }
        }
    }
});