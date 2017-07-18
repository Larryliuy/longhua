/**
 * Created by Orange on 2017/7/7.
 */
$(function () {

    var doc = $(parent.document),
        page =doc.find("#page"),
        footer = doc.find("#footer");

    var val = "",
        form = $("form"),//表单
        back = $(".back"),//左箭头
        searchIpt = $(".searchIpt"),//输入框
        searchTip = $(".search-tip"),//搜索结果提示
        deleteImg = $(".delete"),//叉图标
        result = $(".searchResult"),//搜索结果容器
        resultList = result.children(".list"),//搜索结果列表
        history = $(".history"),//历史记录
        historyList = history.children(".list");//历史记录列表
    
    var method = {
      req: function (val) {
          doc.find(".delete").removeClass("none");
          doc.find(".search").val(val);
          form.initResultList();
          back.trigger("tap");
      }  
    };

    //读取历史记录
    readHistory(historyList);

    //进入页面后获取焦点
    searchIpt.trigger("focus");

    //返回上一页
    back.on("tap", function () {
        page.hide();
    });

    //输入时
    searchIpt.on("keyup", function () {
        //隐藏历史记录
        history.hide();
        val = $(this).val().trim();
        var data = {searchKey: val},
            form = $(this).parents("form");
        if($(this).val() !== ""){
            deleteImg.removeClass("none");
            if(val !== ""){
                resultList.empty();
                $.post(form.data("action"), data, function (data) {
                    if(data.state === 100 && data.result.length > 0){
                        //有搜索结果
                        searchTip.addClass("none");
                        var res = data.result;
                        $.each(res, function (index, ele) {
                            var name = ele.name,
                                address = ele.address;

                            //标识出搜索结果中的关键字
                            name = name.split(val).join("<span class='hasResult'>"+ val +"</span>");

                            var li = $("<li></li>"),
                                img = $("<img src='/resources/static/images/history2.png' />"),
                                infoBox = $("<div class='infoBox'></div>"),
                                pName = $("<p class='name'>"+ name +"</p>"),
                                pAddress = $("<p>"+ address +"</p>");
                            resultList.append(li.append(img).append(infoBox.append(pName).append(pAddress)));
                        });
                        resultList.show();
                    }else{
                        //没有搜索结果
                        $(".noResult").html(val);
                        searchTip.removeClass("none");
                    }
                }, "json");
            }else{
                searchTip.addClass("none").next().hide();
            }
        }else{
            searchTip.addClass("none").next().hide();
            deleteImg.addClass("none");
            readHistory(historyList);
            history.show();
        }
    });

    //点击搜索按钮
    $(".searchBtn").on("tap", function () {
        if(val !== ""){
            var history = {type: 1, data: {searchKey: val}};
            saveHistory(history);
            method.req(val);
        }
    });

    //点击结果列表
    result.on("tap", "li", function(){
        var id = $(this).data("id"),
            searchKey = $(this).find("p").first().text(),
            address = $(this).find("p").last().text(),
            history = {type: 2, data: {"searchKey": searchKey, "address": address}};
        saveHistory(history);
        searchIpt.val(searchKey);
        method.req(searchKey);
    });

    //点击历史记录
    history.on("tap", "li", function(){
        var type = $(this).data("type"),
            searchKey = $(this).find("p").first().text(),
            history = {type: type, data: {"searchKey": searchKey}};
        if(type === 2){
            history.data["address"] = $(this).find("p").last().text();
        }
        saveHistory(history);
        searchIpt.val(searchKey);
        method.req(searchKey);
    });

    //清空历史记录
    $(".clearHistory").on("tap", function () {
        localStorage.clear("history");
        readHistory(historyList);
    });

    //点击叉
    deleteImg.on("tap", function(){
       searchIpt.val("").focus();
       readHistory(historyList);
       history.show();
       searchTip.addClass("none").next().hide();
       $(this).addClass("none");
    });

});

/**
 * 储存历史记录
 * @param obj 历史记录数据
 */
function saveHistory(obj) {
    var history = localStorage.getItem("history"),
        data = {};
    if(history){
        history = JSON.parse(history).history;
        $.each(history, function (index, ele) {
            //删除重复的历史记录
           if(ele.data.searchKey === obj.data.searchKey){
               history.remove(ele);
           }
        });
        //保留5条历史记录
        if(history.length > 4){
            //删除第一条历史记录
            history.shift();
        }
        history.push(obj);
        data = {
            history: history
        };
    }else{
        data = {
            history: [obj]
        };
    }
    localStorage.setItem("history", JSON.stringify(data));
}

/**
 * 读取历史记录
 * @param container 历史记录容器
 */
function readHistory(container) {
    container.empty();
    var history = localStorage.getItem("history"),
        his1 = [],
        his2 = [];
    if(history){

        var his = JSON.parse(history).history;
        console.log(his);
        $.each(his, function (index, ele) {
           var type = ele.type;
           if(type === 1){
               his1.push(ele);
           }
           if(type === 2){
               his2.push(ele);
           }
        });

        readHis(his2, container);
        readHis(his1, container);
    }
}

function readHis(his, container) {
    $.each(his, function (index, ele) {
        var type = ele.type,
            data = ele.data;

        var li = $("<li data-type='"+ type +"'></li>"),
            img = $("<img src='' />"),
            infoBox = $("<div class='infoBox'></div>"),
            pName = $("<p class='name'>"+ data.searchKey +"</p>");
        li.append(img).append(infoBox.append(pName));
        if(type === 1){
            img.attr("src", "/resources/static/images/history1.png");

        }
        if(type === 2){
            img.attr("src", "/resources/static/images/history2.png");
            infoBox.append($("<p>"+ data.address +"</p>"));
        }
        container.prepend(li);
    });
}

/**
 * 函数节流方法
 * @param fn 延时调用函数
 * @param data fn的参数
 * @param delay 延迟多长时间
 * @param atleast 至少多长时间触发一次
 * @return Function 延迟执行的方法
 */

function throttle(fn, data, delay, atleast) {
    var timer = null;
    var previous = null;
    return function () {
        var now = +new Date();//将时间转为数字
        if (!previous) previous = now;
        if (now - previous > atleast) {
            fn(data);
            previous = now;
        } else {
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn(data);
            }, delay);
        }
    }
}

/**
 * 获取元素在数组中引索
 * @param val 要查找的元素
 * @returns {number} 在数组中的引索
 */
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

/**
 * 删除指定元素
 * @param index 要删除的元素
 */
Array.prototype.remove = function (arr) {
    var index = this.indexOf(arr);
    if (index > -1) {
        this.splice(index, 1);
    }
};

