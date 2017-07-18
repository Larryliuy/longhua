/**
 * Created by Orange on 2017/7/10.
 */
$(function () {

    var par = $(parent.document),
        page = par.find("#page"),
        typeBoxs = $(".typeBoxs");
    //初始化分类列表
    $.post("/location/allChildType", function (data) {
        if(data.state === 100 && data.result.length > 0){
            var res = data.result;
            $.each(res, function (index,ele) {
                var typeBox = $("<div class='typeBox'></div>"),
                    name = ele.typeName,
                    type = ele.type;

                var typeTitle = $("<div class='typeTitle' data-type='"+ type +"'>"+ name +"</div>"),
                    typeList = $("<ul class='typeList'></ul>");

                if(ele.typeList){
                    $.each(ele.typeList, function (index,ele) {
                        var typeName = ele.typeName,
                            typeId = ele.typeId;

                        var li = $("<li data-typeId='"+ typeId +"'>"+ typeName +"</li>");
                        typeList.append(li);
                    });
                }
                typeBox.append(typeTitle).append(typeList);
                typeBoxs.append(typeBox);
            });
        }
    }, "json");

    //单选
    typeBoxs.on("tap", "li", function () {
        $(this).toggleClass("active");
    });

    //全选
    typeBoxs.on("tap", ".typeTitle", function () {
        var lis = $(this).next().find("li");
        $(this).toggleClass("mark");
        if($(this).hasClass("mark")){
            lis.addClass("active");
        }else{
            lis.removeClass("active");
        }
    });

    //返回
    $(".back").on("tap", function () {
        page.hide();
    });

    //搜索
    $(".searchBtn").tap(function () {
        var form = $("form"),
            typeId = [];

        $(".active").each(function (index,ele) {
           typeId.push($(ele).data("typeid"));
        });

        var data = form.serializeArray();
        data.push({"name": "categoryIdList", "value": typeId});

        form.initResultList({data: data});
        $(".back").trigger("tap");
    });


});