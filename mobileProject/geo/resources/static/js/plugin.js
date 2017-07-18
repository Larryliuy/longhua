/**
 * Created by Orange on 2017/6/30.
 */
(function ($) {

    //初始化下拉菜单
    $.fn.initSelect = function () {
        return $.each(this, function (index, ele) {
            var $this = $(ele),
                url = $(ele).data("url"),
                arg = $(ele).data("arg");
            $.post(url, {"isImportant": parseInt(arg)}, function (data) {
                var res = data.result;
                if (res.length > 0) {
                    $.each(res, function (index, ele) {
                        var id = ele.id || ele.typeId,
                            name = ele.name || ele.typeName;
                        var option = $("<option value='" + id + "'>" + name + "</option>");
                        //选中默认值
                        if ($this.data("val") && id === $this.data("val")) {
                            option.attr("selected", true);
                        }
                        $this.append(option);
                    });
                }
            }, "json");
        });
    };

    //初始化结果列表
    $.fn.initResultList = function (opts) {

        var par = $(parent.document),
            footer = par.find("#footer"),
            bar = par.find(".drag_bar"),
            container;

        var method = {
            init: function (data) {
                var num = data.count || 0;
                var total = "总共搜索出<span class='total'>" + num + "</span>条结果";
                bar.html(total);
                container.empty().attr({"data-pageNo": data.pageNo, "data-pages": data.pageCount});
                if (data.state === 100 && data.result.length > 0) {
                    var res = data.result;
                    $.each(res, function (index, ele) {
                        var name = ele.name,
                            a, b, c, d;

                        //道路显示起点和终点
                        if (ele.startAddress) {
                            a = "起点";
                            b = ele.startAddress;
                            c = "终点";
                            d = ele.endAddress;
                        }

                        //区域显示联系人和联系电话
                        if (ele.contactName) {
                            a = "联系人";
                            b = ele.contactName;
                            c = "联系电话";
                            d = ele.contactNum;
                        }

                        //其他的显示类型和地址（wifi是高度）
                        if (ele.typeName || ele.categoryName) {
                            a = "类型";
                            b = ele.typeName || ele.categoryName;

                            if (ele.height) {
                                c = "高度";
                                d = ele.height;
                            }
                            if (ele.address) {
                                c = "地址";
                                d = ele.address;
                            }

                        }

                        var li = $("<li></li>"),
                            infoBox = $("<div class='infoBox'></div>"),
                            iconBox = $("<div class='iconBox' data-lat='" + ele.lat + "' data-lon='" + ele.lon + "' data-z='" + ele.z + "'></div>"),
                            pName = $("<p class='name'>" + name + "</p>"),
                            pA = $("<p>" + a + "：" + b + "</p>"),
                            pC = $("<p>" + c + "：" + d + "</p>"),
                            near = $("<div class='near'><img src='/resources/static/images/near.png' alt=''><p>搜周边</p></div>"),
                            position = $("<div class='position'><img src='/resources/static/images/position.png' alt=''><p>定位</p></div>");

                        li.append(infoBox.append(pName).append(pA).append(pC));
                        var url = defaults.url;
                        //区域、道路、建筑、电子围栏、政府单位没有周边搜索
                        if (url.indexOf("area") === -1 && url.indexOf("road") === -1 && url.indexOf("building") === -1 && url.indexOf("eFence") === -1 && url.indexOf("govOffice") === -1) {
                            li.append(iconBox.append(near).append(position));
                        }
                        container.append(li);
                    });
                }
            }
        };

        var defaults = {
            url: this.data("action"),
            data: this.serializeArray(),
            type: this.attr("method"),
            dataType: "json",
            success: method.init

        };

        if (opts) {
            $.extend(defaults, opts);
        }

        $.ajax({
            url: defaults.url,
            data: defaults.data,
            type: defaults.type,
            dataType: defaults.dataType,
            success: function (data) {
                footer.attr("src", "/mobile/resultList").on("load", function () {
                    if (footer.attr("src") === "/mobile/resultList") {
                        container = footer.contents().find(".resultList");
                        defaults.success(data);
                    }
                });
            }
        });
    };

    //选择区域
    $.fn.getList = function (url) {

        var lists = this.find(".select-list"),
            titles = this.find(".select-title"),
            cancel = this.find(".cancel"),
            sure = this.find(".sure"),
            $this = this,
            ajax = null;

        var method = {

            /*添加列表*/
            addList: function (arg) {

                //上一次请求没有完成则返回
                if(ajax){
                    if(!(ajax.readyState === 4 && ajax.status === 200)){
                        // alert("请求未完成");
                        return false;
                    }
                }

                ajax = $.ajax({
                    url: url,
                    data: arg,
                    type: "post",
                    dataType: "json",
                    beforeSend: function () {
                        lists.append($("<div class='mid loading'><img src='/resources/static/images/loading.gif'></div>"));
                    },
                    success: function (data) {
                        var res = data.result;
                        if (data.state === 100 && res.length > 0) {
                            titles.children().removeClass("cur");
                            titles.append("<li class='cur'>请选择</li>");
                            var ul = $("<ul></ul>");
                            $.each(res, function (index, ele) {
                                var li = $("<li></li>");
                                li.attr("data-id", ele.id);
                                li.html(ele.name);
                                ul.append(li);
                            });
                            lists.children().hide();
                            lists.append(ul);
                        }

                        $(".loading").remove();
                    }
                });
            },

            /*显示下级列表*/
            show: function (index) {
                lists.children().hide().eq(index).show();
                titles.children().removeClass("cur").eq(index).addClass("cur");
            },

            /*移除下级列表*/
            remove: function (index) {
                var length = titles.children().length;

                for (var i = index; i < length; i++) {
                    titles.children().eq(index).remove();
                    lists.children().eq(index).remove();
                }
            }
        };

        //初始化区域列表
        method.addList();

        //查询下级区域
        lists.on("tap", "li", function () {
            var $this = $(this),
                id = $this.data("id"),
                title = $this.html(),
                index = $this.parent().index();

            $this.addClass("target").siblings().removeClass("target");
            titles.children().eq(index).html(title).attr("data-id", id);
            method.remove(index + 1);
            method.addList({"parentId": id});

        });

        //区域列表tab选项卡
        titles.on("tap", "li", function () {
            var index = $(this).index();
            method.show(index);
        });

        //取消
        cancel.on("tap", function () {
            //若果请求没有完成，取消请求
            if(ajax){
                if(!(ajax.readyState === 4 && ajax.status === 200)){
                    ajax.abort();
                }
            }
            $this.hide();
        });

        //确定
        sure.on("tap", function () {
            var title = titles.children(),
                id = -1,
                address = "";
            $.each(title, function (index, ele) {
                if($(ele).data("id")){
                    address += $(ele).html();
                    id = $(ele).data("id");
                }
            });
            //下级区域
            if(url.indexOf("area") !== -1){
                $("#areaName").val(address);
                $("#areaId").val(id);
            }
            //下级单位
            if(url.indexOf("police") !== -1){
                $("#unitName").val(address);
                $("#unitId").val(id);
            }
            $this.hide();
        });

    };

    //设置height
    $.fn.setHeight = function (a) {
        this.height(a.css("height"));
    }
})(Zepto);