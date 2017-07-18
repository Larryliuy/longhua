/**
 * 可拖动列表插件(依赖zepto)
 * html: 使用flex布局，drag设置display:flex; drag_bar固定高度，drag_content设置flex=1
 * options可选参数：
 *   minH: 容器最小高度
 *   maxH: 容器最大高度
 *   height: 容器默认高度
 *   fold：列表默认状态，true表示折叠,false表示展开
 *   move: 是否开启拖动,默认开启
 *   paging: 是否开启分页
 *   init : 分页函数
 */
(function ($) {

    $.fn.drag = function (options) {

        var defaults = {
            minH: this.children(".drag_bar").height(),
            maxH: $(window).height()*0.8,
            height: $(window).height()*0.5,
            fold: false,
            move: true,
            paging: false,
            init: function () {}
        };

        if(options) {
            $.extend(defaults, options);
        }

        /*fold: 容器折叠状态，false表示展开*/
        var drag = this,
            drag_bar = this.find(".drag_bar"),
            defHeight = defaults.height,
            fold = defaults.fold,
            minH = defaults.minH,
            maxH = defaults.maxH;

        //defHeight：容器初始化高度
        var height = defHeight;
        drag.height(fold === true ? minH : height);

        //触摸时展开或收起列表
        drag_bar.off("tap");
        drag_bar.on("tap", function () {
            fold = !fold;
            drag.height(fold === true ? minH : height);
        });

        /*
         startY: 起始坐标
         endY: 结束坐标
         Y: 手指移动距离
         */
        var startY = 0,
            endY = 0,
            Y = 0;

        //上下拖动列表
        if(defaults.move){
            drag_bar.off("touchstart");
            drag_bar.on("touchstart", function (e) {
                var touch = e.targetTouches[0];
                drag.css("transition", "height 0s");
                startY = touch.pageY;
            });
            drag_bar.off("touchmove");
            drag_bar.on("touchmove", function (e) {
                e.preventDefault();
                height = parseInt(drag.css("height"));
                if (height < maxH && height > minH) {
                    var touch = e.targetTouches[0];
                    endY = touch.pageY;
                    Y = -Math.ceil(endY - startY);
                    startY = endY;
                    height += Y;
                    drag.height(height);
                }

                /*//判断list高度是否小于列表容器的高度,
                 var scroll = drag_content.scrollTop();
                 console.log(scroll);
                 if (scroll === 0) {
                 drag_content.scrollTop(1);
                 if (drag_content.scrollTop() !== 1) {
                 list.height(height - minH);
                 } else {
                 drag_content.scrollTop(scroll);
                 }
                 }*/
            });
            drag_bar.off("touchend");
            drag_bar.on("touchend", function () {
                drag.css("transition", "height 500ms");

                //拖到底部
                if (height <= minH) {
                    drag.height(minH);
                    height = defHeight;
                    fold = true;
                }

                //拖到顶部
                if (height >= maxH) {
                    height = maxH - 1;
                    drag.height(height);
                }
            });
        }

        if(defaults.paging){
            
        }
    }
})(Zepto);