/**
 * Created by pvwl on 2017/7/13.
 * author:larry
 */
$(function () {

    //个人中心入口*
    $('.user').on('tap',function (e) {
        window.location.href = '/mobile/personalCenter';
    });
    var hrefStr = window.location.href;
    console.log(hrefStr.substring(hrefStr.length-3,hrefStr.length));
    if(hrefStr.substring(hrefStr.length-3,hrefStr.length) == 's=1'){
        $('#footer').attr('src','http://10.1.1.178:9608/mobile/simulationModel');
        $('.drag_bar').text('模型');
        console.log(window.innerHeight);
    }
});
