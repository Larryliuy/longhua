/**
 * Created by Orange on 2017/7/10.
 */
$(function () {

    var doc = $(parent.document),
        page   = doc.find("#page"),
        footer = doc.find("#footer");

    //初始化下拉菜单
    $(".dynaSelect").initSelect();

    //选择区域
    $("#areaName").on("focus", function () {
        var area = $("#select-area");
        if(!area.find(".select-list").children().length > 0){
            area.getList("/area/child");
        }
        area.show();
    });

    //选择上级单位
    $("#unitName").on("focus", function () {
        var unit = $("#select-unit");
        if(!unit.find(".select-list").children().length > 0){
            unit.getList("/police/child");
        }
        unit.show();
    });

    //道路模糊查询
    var roadList = $(".roadList");
    $("#roadName").on("keyup", function () {
        var val = $(this).val();
        roadList.empty();
       $.post("/road/search", {"searchKey": val}, function (data) {
           if(data.state === 100 && data.result.length > 0){
               var res = data.result;
               $.each(res, function (index, ele) {
                   var name = ele.name,
                       id = ele.id;

                   var li = $("<li data-id='"+ id +"'>"+ name +"</li>");
                   roadList.append(li);
               })
           }
       }, "json")
    });

    roadList.on("tap", "li", function () {
        var $this = $(this);
        $("#roadName").val($this.html());
        $("#roadId").val($this.data("id"));
        roadList.empty();
    });


    //返回主页
    $(".back").on("tap", function () {
        page.hide();
    });

    $(".submit").on("tap", function(){
        $("form").initResultList();
        $(".back").trigger("tap");
    });
});