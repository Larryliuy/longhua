/**
 * Created by Orange on 2017/6/30.
 */
$(function () {

    var page = $("#page"),
        footer = $("#footer"),//底部iframe
        drag = $(".drag"),//底部拖动列表
        bar = drag.find(".drag_bar"),
        searchIpt = $(".search");//头部输入框

    /*触摸顶部输入框进入综合搜搜索页面*/
    searchIpt.tap(function () {
        page.attr("src", "/mobile/search").show();
    });

    var imgGroup = $(".imgGroup");//地图图标组
    //展开或收起地图图标
    imgGroup.on("tap", ".show", function () {
        $(this).siblings().toggleClass("show");
    });

    //地图图标变色,选择图标
    imgGroup.on("touchstart", "img", function () {
        var imgSrc = $(this).attr("src");
        $(this).attr("src", imgSrc.replace(/.png/,"1.png"));
    });
    imgGroup.on("touchend", "img", function () {
        var imgSrc = $(this).attr("src");
        $(this).attr("src", imgSrc.replace(/1.png/,".png"));
    });

    //输入框右边的叉
    $(".delete").on("tap", function () {
        searchIpt.val("");
        //底部加载高级搜索页面
        footer.attr("src", "/mobile/advancedSearch");
        $(this).addClass("none");
    });

    //底部iframe加载成功后
    footer.on("load", function () {
        var src = $(this).attr("src");
        //高级搜索
        if(src.indexOf("advanced") !== -1){
            drag.drag({
                fold: true
            });
        }
        //结果列表
        if(src.indexOf("resultList") !== -1){
            drag.drag();
            var doc = footer.contents(),
                list = doc.find(".resultList"),
                content = doc.find("body"),
                form = page.contents().find("form");

            var startY = 0,//手指滑动起点
                endY = 0,//终点
                top = 0,//margin-top、margin-bottom
                pageNo,//页码
                pages,//总页数
                prev = false,//是否请求上一页
                next = false,//是否请求下一页
                minH = bar.height();
            doc.on("touchstart", function (e) {
                if(!pageNo){
                    pageNo = parseInt(list.data("pageno"));
                }
                if(!pages){
                    pages = parseInt(list.data("pages"));
                }
                list.css("transition", "margin 0ms");
                var touch = e.targetTouches[0];
                startY = touch.pageY;
            });
            doc.on("touchmove", function (e) {
                var scorll = content.scrollTop();
                // console.log(scorll);
                var touch = e.targetTouches[0];
                endY = touch.pageY;
                if (scorll === 0) {
                    e.preventDefault();
                    top += Math.ceil(endY - startY);
                    list.css("marginTop", top);
                    if (top >= 100) {
                        // console.log("松手加载上一页");
                        prev = true;
                    }
                }
                if (scorll >= parseInt(list.css("height")) - parseInt(drag.css("height")) + minH - 1) {
                    e.preventDefault();
                    top += -Math.ceil(endY - startY);
                    list.css("marginBottom", top);
                    if (top >= 100) {
                        // console.log("松手加载下一页");
                        next = true;
                    }
                }
                startY = endY;
            });
            doc.on("touchend", function () {
                if (prev) {
                    if (pageNo > 1) {
                        pageNo--;
                        getData(page, pageNo);
                    }
                    prev = false;
                }
                if (next) {
                    if (pageNo < pages) {
                        pageNo++;
                        getData(page, pageNo);
                        content.scrollTop(0);
                    }
                    next = false;
                }
            });
        }
        //模拟演练
        if(src.indexOf("simulation") !== -1){
            var height = parseInt(footer.contents().find(".modelBox").css("height")) + parseInt(bar.css("height"));
            drag.drag({
                height: height,
                move: false
            });
        }
    });

});

//分页请求时，获取表单数据
function getData(page, pageNo) {
    var doc =  page.contents(),
        form = doc.find("form"),
        arg = form.serializeArray();
    arg.push({"name": "pageNo", "value": pageNo});
    if(page.attr("src") === "/mobile/searchAround"){
        var typeId = [];
        doc.find(".active").each(function (index,ele) {
            typeId.push($(ele).data("typeid"));
        });
        arg.push({"name": "categoryIdList", "value": typeId});
    }
    form.initResultList({
        data: arg
    });
}
