/*!
* jQuery JavaScript Library v1.4.2
* http://jquery.com/
* http://www.wobumang.com/FenXiang/jquery/wDragSort
* wDragSort 1.0 by xusion create 2011-03-10 jQuery的拖曳排序函数 
* 使用方法：$(selector).wDragSort(opts)
*/

$.fn.extend({
    wDragSort: function (opts) {
        //默认设置
        opts = $.extend({
            undrager: null,  //不允许拖动对象/选择器
            start: function (selector, drager) { },                     //自定义事件：开始事件-> drager:被拖动对象
            move: function (selector, drager, targeter, helper) { },    //自定义事件-> 移动事件 drager:被拖动对象 targeter:目标对象 helper:助对象
            end: function (selector, drager) { }                        //自定义事件：线束事件-> drager:被拖动对象
        }, opts || {});

        //初始化
        var cssDrag = "wdragsort";
        var cssUndrag = "wdragsort-undrags";
        var cssHelper = "wdragsort-helper";
        var $selector = $(this);
        $selector.each(function (index) {
            $(this).attr(cssDrag, index).addClass(cssDrag);
        });

        //不允许拖动对象
        if (opts.undrager) {
            $(opts.undrager).addClass(cssUndrag);
        }

        //绑定事件
        $selector.filter(":not(." + cssUndrag + ")").unbind("mousedown", mouseDown).mousedown(mouseDown);


        function mouseDown(e) {
            var oriX, oriY;   //要移动的li的初始值；
            var setX, setY;   //鼠标按下处和li的左上角的距离；
            var $theli = $(this);  //要拖动的li对象
            var $helpli = $theli.clone(); //辅助li对象
            $(document.body).css('-webkit-user-select', 'none');
            //获取坐标
            oriX = $theli.position().left;
            oriY = $theli.position().top
            setX = e.clientX - oriX;
            setY = e.clientY - oriY;
            $helpli.css({ position: "absolute", top: oriY, left: oriX }).attr(cssDrag, cssHelper).addClass(cssHelper);
            $theli.css({ visibility: "hidden" }).after($helpli);
            //自定义事件 开始事件
            try { var re = opts.start($selector, $theli);
            	if(re === false) {
            		 $theli.css({ visibility: "" }).before($helpli);
                     $helpli.remove();
                     return false;
            	}
            } catch (ex) { throw ex; }

            //绑定事件
            $(document).mousemove(mouseMove);
            $(document).mouseup(mouseUp);


            function mouseMove(e) {
                //移动辅助对象
                var liX = e.clientX - setX;
                var liY = e.clientY - setY;
                $helpli.css({ "left": liX, "top": liY });
                deisabledSelection();

                //查找目标
                $selector.each(function () {
                    var pST = $(document).scrollTop();
                    var pSL = $(document).scrollLeft();
                    var pXL = $(this).offset().left - pSL;
                    var pXM = pXL + $(this).width() / 2;
                    var pXR = pXL + $(this).width();
                    var pYT = $(this).offset().top - pST ;
                    var pYB = pYT + $(this).height();

                    if ($(this).attr(cssDrag) != $theli.attr(cssDrag) && $(this).attr(cssDrag) != cssHelper) {
                        if (pYT <= e.clientY && e.clientY <= pYB) {
                            var $target = null;
                            if (pXL <= e.clientX && e.clientX <= pXM) {
                                $target = $(this).before($theli);
                            }
                            else if (pXM <= e.clientX && e.clientX <= pXR) {
                                $target = $(this).after($theli);
                            }

                            //自定义事件 移动事件
                            if ($target != null) {
                                try { opts.move($selector, $theli, $target, $helpli); } catch (ex) { throw ex; }
                            }
                        }
                    }
                });
            };

            function mouseUp(e) {
            	$(document.body).css('-webkit-user-select', 'auto');
                //移动目标
                $theli.css({ visibility: "" }).before($helpli);
                $helpli.remove();

                //清除事件
                $(document).unbind("mousemove", mouseMove);
                $(document).unbind("mouseup", mouseUp);

                //自定义事件 结束事件
                try { opts.end($selector, $theli); } catch (ex) { throw ex; }
            };
        };

        //防止拖动中选中
        function deisabledSelection() {
            if (document.selection) {//IE ,Opera
                if (document.selection.empty) { document.selection.empty(); } //IE               
                else { document.selection = null; } //Opera                
            }
            else if (window.getSelection) {//FF,Safari
                window.getSelection().removeAllRanges();
            }
        }
    }
});

