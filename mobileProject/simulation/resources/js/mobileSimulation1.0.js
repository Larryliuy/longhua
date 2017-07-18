/**
 * Created by pvwl on 2017/6/1.
 */
$(function () {
    // document.domain='longmap.com';
    function preventDef() {
        if(event.cancelable){
            event.preventDefault();
        }
    }
    function stopBubble() {
        if(event.cancelable){
            event.stopPropagation();
        }
    }
    document.addEventListener('touchmove',function(event) {
        preventDef();
    });
    //初始化iframe高度
    var liArr =  $('.modelTypeUl').find('li');
    var winWidth = window.screen.width;
    var winHeight = window.screen.height;
    $('body, #mapBox').css('width',winWidth);
    $('body, #mapBox').css('height',winHeight);
    function InitModelTypeUlWH(len) {
        $('.modelTypeUl').find('li').css('width',winWidth/4);
        $('.modelTypeUl').css('width',len*winWidth/4);
    }
    function InitModelUlWH(len) {
        $('.modelUl').css('width',winWidth*len);
        $('table').css('width',winWidth);
        //调整table中模型个数不满8个时的显示方式
        var lastTrLen = $('.modelUl table').last().find('tr').length;
        var lastTdLen = $('.modelUl table').last().find('tr').last().find('td').length;
        if(lastTrLen == 1){
            $('.modelUl table').last().css('width',lastTrLen*winWidth/4);
        }
    }
    //调整宽高
    var modelLen = 0,modeTypeLen = 0;
    window.onresize = function () {
        winWidth = window.innerWidth;
        winHeight = window.innerHeight;
        // window.location.reload();
        $('body, #mapBox').css('width',winWidth);
        $('body, #mapBox').css('height',winHeight);
        $('table').css('width',winWidth);
        InitModelTypeUlWH(modeTypeLen);
        // InitModelUlWH(modelLen);
        $('.modelUl').css('width',winWidth*modeTypeLen);
        $('table').css('width',winWidth);
        //调整table中模型个数不满8个时的显示方式
        var lastTrLen = $('.modelUl table').last().find('tr').length;
        var lastTdLen = $('.modelUl table').last().find('tr').last().find('td').length;
        if(lastTrLen == 1){
            $('.modelUl table').last().css('width',lastTrLen*winWidth/4);
        }
        $('table').find('td').css('width',winWidth/4);
    };
    //模型类型滑动显示更多
    //计算滑动的距离
    function addModelTypeSwipe(len) {
        var moveLen = 0;
        (function () {
            var modelTypeDom = document.getElementById('modelTypeUl'),
                startPos = 0 , endPos = 0;
            modelTypeDom.addEventListener('touchstart', function (e) {
                startPos = e.touches[0].pageX;
            });
            modelTypeDom.addEventListener('touchmove', function (e) {
                endPos = e.touches[0].pageX;
                moveLen = parseInt(endPos) - parseInt(startPos);
            });
        })();
        var leftLen = 0;
        var maxSwipeLen =  -len*winWidth/4+winWidth;
        $('.modelTypeUl').swipe(function () {
            leftLen += moveLen;
            if(leftLen < -maxSwipeLen){
                leftLen = -maxSwipeLen;
            }
            if(moveLen > 0 && leftLen > 0){
                leftLen = 0;
            }
            console.log("moveLen:" + moveLen);
            console.log("leftLen:" + leftLen);
            $(this).css('margin-left',leftLen);
            console.log($(this).css('margin-left'));
        });
    }
    //模型类型tap事件
    function addModelTypeTap() {
        curTable = 1;
        getModelByTypeId('all');
        $('.modelType ul').on('tap',function (event) {
        // document.getElementById('modelTypeUl').addEventListener('touchstart',function () {
            stopBubble();
            curTable = 1;
            // console.log(event.target.innerHTML);
            $(event.target).css('background-color','#989898');
            $(event.target).siblings().css('background-color','#DBDBDB');
            //获取类型ID请求模型数据
            var typeId = $(event.target).val();
            getModelByTypeId(typeId);
        });
        $('.modelType ul li:first-child').css('background-color','#989898');
        addModelTap();
    }
    function getModelByTypeId(typeid) {
        $.post('/simulation/model/search',{searchKey:'',categoryId:typeid},function (data) {
            var htmlStr = "<li><table><tr class='row'>";
            //获取类型数据，模型url拼接dom字符串
            var dataJson = JSON.parse(data);
            for(var i = 0 , len = dataJson.result.length; i < len ; i++ ){
                var modelUrl = dataJson.result[i].img;
                modelUrl = "http://file.longmap.com" + modelUrl.substring(modelUrl.indexOf(',')+1,modelUrl.length);
                if(i % 8 == 0 && i != 0){
                    htmlStr += "</tr></table></li><li><table><tr class='row'>";
                }else if(i % 4 == 0 && i != 0){
                    htmlStr += "</tr><tr class='row'>";
                }
                htmlStr += "<td class='col-md-3'><img src=" + modelUrl + "><p class='modeName'>"+dataJson.result[i].name+"</p></td>";
            }
            htmlStr += "</tr></table></li>";
            $('.modelUl').empty().append(htmlStr);
            modelLen = Math.ceil(dataJson.result.length/8);
            addModelUlSwipe(modelLen);
            showCurDot(modelLen,curTable);
        })
    }
    //获取模型类型
    $.post('/simulation/model/type/search',{searchKey:''},function (data) {
        var htmlStr = "<li value='all'>全部</li>";
        //获取类型数据，模型url拼接dom字符串
        var dataJson = JSON.parse(data),
            resultLen = dataJson.result.length;
        for(var i = 0 ; i < resultLen ; i++ ){
            htmlStr += "<li value=" + dataJson.result[i].id + ">" + dataJson.result[i].name + "</li>";
        }
        if(resultLen < 3){
            htmlStr += "<li value='other'>其他</li>";
        }
        $('.modelTypeUl').append(htmlStr);
        InitModelTypeUlWH(resultLen+1);
        addModelTypeSwipe(resultLen+1);
        addModelTypeTap();
        modeTypeLen = resultLen+1;
    });

    //模型滑动显示更多模型
    var curTable = 1;
    function addModelUlSwipe(len) {
        var pageCount = len;
        var curPage = 0;
        modelLen = len;
        $('.modelUl').css('margin-left','0px');
        InitModelUlWH(pageCount);
        //调整table中模型个数不满8个时的显示方式
        var lastTrLen = $('.modelUl table').last().find('tr').length;
        var lastTdLen = $('.modelUl table').last().find('tr').last().find('td').length;
        if(lastTrLen == 1){
            $('.modelUl table').last().css('width',winWidth);
        }
        $('table').find('td').css('width',winWidth/4);
        $('.modelUl').off('swipeLeft').on('swipeLeft',function () {
            if(curPage < pageCount-1){
                curTable++;
                $(this).css('margin-left',-(parseInt(winWidth))*++curPage + 'px');
                showCurDot(modelLen,curTable);
            }
            stopBubble()
        });
        $('.modelUl').off('swipeRight').on('swipeRight',function () {
            if(curPage > 0){
                curTable--;
                $(this).css('margin-left',-(parseInt(winWidth))*--curPage + 'px');
                showCurDot(modelLen,curTable);
            }
            stopBubble()
        });
    }
    //模型tap事件
    function addModelTap() {
        $('.modelUl').tap(function (event) {
            var targetDom = event.target;
            if(targetDom.tagName.toLowerCase() == 'img'){
                var modelUrl = $(targetDom).attr('src');
                console.log(modelUrl);
                //将模型Url传给地图
                var data={
                    type:'simulation_addmodel',
                    url:modelUrl
                };
                //console.log(window.parent.frames);
                window.parent.sendToMap(data);
            }
            stopBubble()
        });
    }
    //第几个table的dot显示
    function showCurDot(countNum,CurNum) {
        var domStr = "";
        for(var i = 0 ; i < countNum ; i++ ){
            if(i != CurNum-1){
                domStr += "<span><img src='/resources/img/mobile/unselect.png'></span>";
            }else{
                domStr += "<span><img src='/resources/img/mobile/selected.png'></span>"
            }
        }
        $('.dotBox').empty().append(domStr);
    }
    $('.dotBox').tap(
        function () {
            stopBubble();
        }
    );
    // setTimeout(function () {
    showCurDot(modelLen,curTable);
    // },200);

    //window.addEventListener('message',function (event) {
    //    if("http://10.1.1.243:9208" == event.data){
    //        alert(event.data);
    //        console.log(event.data);
    //    }
    //});
});

