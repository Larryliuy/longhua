/**
 * Created by Orange on 2017/7/10.
 */
$(function () {
    var par = $(parent.document),
        page = par.find("#page");

    //周边
    $(".resultList").on("tap", ".near", function(){
        var position = $(this).parent(),
            lat = position.data("lat"),
            lon = position.data("lon"),
            z = position.data("z");
        page.attr("src", "/mobile/searchAround");
        page.on("load", function () {
            var doc = page.contents();
            doc.find("#lat").val(lat);
            doc.find("#lon").val(lon);
            doc.find("#z").val(z);
            $(this).show();
        });
    });

    //定位
    $(".resultList").on("tap", ".position", function(){
        var position = $(this).parent(),
            lat = position.data("lat"),
            lon = position.data("lon"),
            z = position.data("z");
        console.log("lat:"+lat);
        console.log("lon:"+lon);
        console.log("z:"+z);
    });
});