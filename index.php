<?php $page="home";$title="首页"; include("inc/header.php"); ?>

<style type="text/css">
  * {
    margin:0;
    padding:0;
  }
  .scrolllist li{
    float:left;
    width:157px;
    list-style-type:none;
  }
  .scrolllist img {
    width:100%;
    height:100%;
  }
  .scroll-warp {
    width:300px;
  }
  .v-h {
    visibility:visible;
  }
</style>
<div class="container">
  <ul class="scrolllist" id="scrollpic">
    <li><a href="#"><img src="images/all-car-g5.png" alt="" /></a></li>
    <li><a href="#"><img src="images/all-car-g5.png" alt="" /></a></li>
    <li><a href="#"><img src="images/all-car-g5.png" alt="" /></a></li>
    <li><a href="#"><img src="images/all-car-g5.png" alt="" /></a></li>
    <li><a href="#"><img src="images/all-car-g5.png" alt="" /></a></li>
    <li><a href="#"><img src="images/all-car-g5.png" alt="" /></a></li>
  </ul><!-- /scrolllist -->

</div><!-- /.container -->


  

<script type="text/javascript">

$(document).ready(function() {
   $("#scrollpic").scollpic({
    itemTag : "li",
    itemWidth : 157,
    itemHeight : 250,
    bigImg : 'off',
    scollBack : function  (img , obj) {
      //执行完回调事件处理
    }
   
   });
})


/* ========================================================================
 * Bootstrap: transition.js v3.2.0
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== 
 $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(150) :
removeElement()
 
 */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);


/** 
* extend 图片滚动插件(有大图)
* 
* @package jquery
* @author cuki13

  $("#stroystroylist1").scollpic({
    sdiv:"li",
    long : 157,
    height:150,
    showbigimg: $("#stroystroylist1-img"), //显示大图的位置
    wrapClass:'stroystroylist-list-wrap',
    ppscollcallback:function  (objimg,obj) {
      
      //回调事件处理
    }
  });

*/

+(function($){

$.fn.scollpic= function (options) {
  //计算长度
  $(this).each(function  () {
    var $this = $(this);
    var defualts = {
      itemTag : "li",
      itemWidth : 157,
      itemHeight : 150,
      itemCount: 3,
      bigImg : 'off',
      wrapClass :'scrollpic-wrap',
      parenWidth : 'auto'
    };

    var opts = $.extend({},defualts,options);

    var ifLoad = false; //是否加载
    var currentItemIndex = 0 ; //当前item索引
    if (opts.parenWidth == 'auto') {
      opts.parenWidth = parseInt(opts.itemCount * opts.itemWidth);
    }

    var $wrapObj=$('<div class="' + opts.wrapClass + '"></div>');

    $wrapObj.css({'position':'relative','height':opts.itemHeight});
    
    //加载箭头
    if (opts.itemWidth == 'auto') {
      opts.itemWidth = $(this).find(opts.sdiv).width();
    }
    
    $this.wrap($wrapObj);

    var $arrowPrev=$('<a href="javascript:void(0);" class="scrool-item-list-prev endprev st"><span class="v-h">prev</span></a>');
    var $arrowNext=$('<a href="javascript:void(0);" class="scrool-item-list-next st"><span class="v-h">next</span></a>');

    $this.parent().append($arrowPrev).append($arrowNext);

    $this.wrap('<div class="scroll-warp" style="overflow:hidden;position:relative; height:' + opts.itemHeight + 'px; width:' + opts.parenWidth + 'px;"></div>');

    $arrowPrev.click(function  () {
      scoll('left',$this);
    });

    $arrowNext.click(function  () {
      scoll('right',$this);
    });

    var itemTotal=0;

    $this.find(opts.itemTag).last().css("padding-right","0");
    $this.find(opts.itemTag).each(function  () {     
      itemTotal+=$(this).outerWidth();
    });
    $this.css({'position':'relative','width':itemTotal}); 
    

    //moblie tounch手机事件
    var currntp = 0;
    var pageX = 0;
    var ifchlick = false;
      
    $this.parents("."+opts.wrapClass).bind("touchstart",function  (e) {
       currntp = window.event.touches[0].pageX;
       ifchlick = true;
       e.preventDefault();
     });

    $this.parents("."+opts.wrapClass).bind('touchend', function(e) {
      if (pageX == 0) {
        return false;
      }
      e.preventDefault();
      ifchlick = false;
      var widthStep = 10;
      
      if ((Math.abs(currntp - pageX) >= width_step)) {
        if (currntp - pageX >= width_step) {
          $arrowNext.trigger('click');          
        } else {          
          $arrowPrev.trigger('click');
        }
      }
      currntp = 0;
      pageX = 0;
      
    });

    $this.parents("."+opts.wrapClass).bind('touchmove', function(e) {
      e.preventDefault();
      if (ifchlick) {
        ifchlick = false;
        pageX = window.event.targetTouches[0].pageX;
      }else {
        return false;
      }
    });
    
    //点击显示大图
    
    $this.find(opts.itemTag).find("a").click(function  (e) {
      var $item = $(this);
      if (opts.bigImg && (opts.bigImg == 'off')) {
        return false;
      }else{

      if(ifLoad == true || $item.parent().hasClass('current')){ return false;}

      currentItemIndex = $this.find(opts.itemTag + '.current').index();
      
      if ((currentItemIndex!= -1) && (currentItemIndex!= 0) && (currentItemIndex!= ($this.find(opts.itemTag).length-1))) {

        var itemIndex = $item.parent().index();
        if (currentItemIndex > itemIndex) {
          $arrowPrev.trigger('click');
        }else {
          $arrowNext.trigger('click');
        }
      }

      $item.parent().siblings('li').removeClass('current');
      $item.parent().addClass('current');

      if (opts.bigImg) {
        showImg(opts.bigImg,$item.attr("href"),$item);
      }      
      e.preventDefault();
      }
    })

    function  checkend(objsc) {      
      if (objsc.prev().length < 1) {
        $arrowPrve.addClass("endprev");
      }else {
        $arrowPrve.removeClass("endprev");
      }

      if (objsc.next().length < 1) {
        $arrowNext.addClass("endnext");
      }else {
        $arrowNext.removeClass("endnext");
      }
    }

    
    var ajaxLoad = $('<div id="loading" class="loading yh"><i></i><span>加载中。。。</span></div>');
    var showImg = function (obj,data,objlink) {
      var img = $('<img src="' + data + '" />');
      ajaxLoad.insertBefore(obj);
      ifload = true;
      
      if (img[0].complete) {
        if (opts.ppscollcallback) {
          opts.ppscollcallback(obj,objlink);
        }
        obj.hide().attr('src', data).fadeIn();
        ajax_load.detach();
        ifload = false;

      }else {
        img.load(function  () {
        if (opts.scollBack) {
          opts.scollBack(obj,objlink);
        }
        obj.hide().attr('src', data).fadeIn();
        ajaxLoad.detach();
        ifload = false;
        }).error(function(){
          ajaxLoad.detach();
          alert('很抱歉,加载失败');
          ifload = false;
        });
      }
    }

    var ifScroll = false;

    //滚动函数
    function scoll(dir,obj) {
      if (ifScroll == true) {
        return false;
      }

      ifScroll = true;
      if (dir=='left') {
        if (obj.position().left >= 0) {
          ifScroll = false;
          return false;
        }
        obj.animate({
          left:'+='+opts.itemWidth
        },function  () {
          ifScroll = false;          
          if (obj.position().left >= 0 ) {
            $this.find(".scrool-product-list-prev").addClass("endnext");
          }else {
            $this.find(".scrool-product-list-prev").removeClass("endnext");
          }
          $this.find(".scrool-product-list-next").removeClass("endprev");
        });
      }

      if (dir=='right') {
        console.log(obj.position().left, opts.parenWidth);
        if (obj.position().left <= -opts.parenWidth) {
          ifScroll = false;
          return false;
        }
        obj.animate({
          left:'-='+opts.itemWidth
        },function  () {
          ifScroll = false;

          if (obj.position().left <= -opts.parenWidth) {
            $this.parents("."+opts.wrapClass).find(".scrool-product-list-prev").addClass("endprev");
          }else {
            $this.parents("."+opts.wrapClass).find(".scrool-product-list-prev").removeClass("endprev");
          }
          $this.parents("."+opts.wrapClass).find(".scrool-product-list-next").removeClass("endnext");
          
        });
      }
    }
  });
};

})(jQuery);

</script>



<?php include("inc/footer.php"); ?>