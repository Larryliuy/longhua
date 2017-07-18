/**
 * Created by pvwl on 2017/7/12.
 */
(function (win,doc) {
    function setSize() {
        var winWidth = document.documentElement.clientWidth,
            fontSize = 0;
        if( winWidth <=640 && winWidth > 320){
            fontSize=20*winWidth/320;
        }else if(winWidth > 640){
            fontSize=20*640/320;
        }else{
            fontSize = 20*320/320;
        }
        doc.documentElement.style.fontSize=fontSize +'px';
    }
    setSize();
    win.addEventListener('resize',setSize,false)
})(window,document);