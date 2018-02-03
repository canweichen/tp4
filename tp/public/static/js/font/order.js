/**
 * Created by Administrator on 2018/1/30.
 */
var t = $(".join");
$(function(){
    $(".add").eq(0).click(function() {
        t.eq(0).val(parseInt(t.eq(0).val()) + 1); //点击加号输入框数值加1
    });
    $(".min").eq(0).click(function(){
        t.eq(0).val(parseInt(t.eq(0).val())-1); //点击减号输入框数值减1
        if(t.eq(0).val()<=0){
            t.eq(0).val(parseInt(t.eq(0).val())+1); //最小值为1
        }
    });
});

$(function() {
    // 初始化省市区
    initAddress();
    // 更改省份后的操作
    $("select[name='province']").change(function() {
        var provCode = $("select[name='province']").val();
        console.log(provCode);
        getCity(provCode);

    });

    // 更改城市后的操作
    $("select[name='city']").change(function() {
        var cityCode = $("select[name='city']").val();
        getArea(cityCode);
    });
});
function initAddress() {
    var firstProvCode;
    // ajax请求所有省份
    $.ajax({
        url:showSite,
        type:"post",
        data:{},
        dataType:'json',
        success:function(data){
            console.log(data);
        $.each(data, function(i, d) {
            $("select[name='province']").append(
                "<option value='"+d.provinceid+"'>" + d.province
                + "</option>");
        });
        // 获取第一个省份的code
        firstProvCode = data[0].provinceid;
            console.log(firstProvCode);
        // 根据第一个省份code获取对应城市列表
        getCity(firstProvCode);
    }
    });
}

//获取对应城市列表（里面包括获取第一个城市的区县列表）
function getCity(provCode) {
    var firstCityCode;
    // ajax请求所有市级单位
    $.ajax({
        url:showCity,
        type:"post",
        data:{provCode:provCode},
        dataType:'json',
        success: function(res1){
            console.log(res1);
        // 先清空城市下拉框
        $("select[name='city']").empty();
        $.each(res1, function(i, d) {
            $("select[name='city']").append(
                "<option value='"+d.cityid+"'>" + d.city + "</option>");
        });
        // 获取第一个城市的code
        firstCityCode = res1[0].cityid;
        // 根据第一个城市code获取对应区县列表
        getArea(firstCityCode);
    }
    });
}

function getArea(cityCode){
    // ajax请求所有区县单位
    $.ajax({
            url:showArea,
            type:"post",
            data:{cityCode:cityCode},
            dataType:'json',
        success: function(data){
        // 先清空区县下拉框
        $("select[name='area']").empty();
        $.each(data, function(i, d) {
            $("select[name='area']").append(
                "<option value='"+d.areaid+"'>" + d.area + "</option>");
        });
    }
    });
}
/*
$.ajax({
    url:showOrder,
    type:'post',
    data:{},
    dataType:json,
    success:function(res){

    }
});*/
