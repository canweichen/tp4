/**
 * Created by Administrator on 2018/1/25.
 */
$.ajax({
    url:showData,
    type:"post",
    data:{},
    dataType:'json',
    success:function(res) {
        console.log(res);
        for(var i= 0;i<res.length;i++)
        {
            if(res[i].tradesortid==1){
                var $showDiv=$('#phone');
                var $div1 = $('<div class="col-md-1"></div>');
                var $div2 = $('<div class="col-md-2"></div>');
                var $img = $('<img  style="width: 170px;height: 170px;" src="static/image/' + res[i].imgurl + '.jpg"/>');
                var $h4 = $('<h4>' + res[i].tradename + '</h4>');
                var $p1 = $('<p style="color: red">￥：' + res[i].nowprice + ' </p>');
                $showDiv.append($div2);
                $div2.append($img,$h4,$p1)
            }
            else if(res[i].tradesortid==2){
                var $showDiv=$('#elappliance');
                var $div1 = $('<div class="col-md-1"></div>');
                var $div2 = $('<div class="col-md-2"></div>');
                var $img = $('<img  style="width: 170px;height: 170px;" src="static/image/' + res[i].imgurl + '.jpg"/>');
                var $h4 = $('<h4>' + res[i].tradename + '</h4>');
                var $p1 = $('<p style="color: red">￥：' + res[i].nowprice + ' </p>');
                $showDiv.append($div2);
                $div2.append($img,$h4,$p1)
            }
            else {
                var $showDiv=$('#car');
                var $div1 = $('<div class="col-md-1"></div>');
                var $div2 = $('<div class="col-md-2"></div>');
                var $img = $('<img  style="width: 170px;height: 170px;" src="__STATIC__/image/' + res[i].imgurl + '.jpg"/>');
                var $h4 = $('<h4>' + res[i].tradename + '</h4>');
                var $p1 = $('<p style="color: red">￥：' + res[i].nowprice + ' </p>');
                $showDiv.append($div2);
                $div2.append($img,$h4,$p1)
            }

        }
    }
});
