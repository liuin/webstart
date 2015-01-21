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
* extend 图片循环
* 
* @package jquery
* @author cuki13
   $("#scrollpic").scollpic({
    itemTag : "li",
    itemWidth : 157,
    itemHeight : 250,
    bigImg : 'off',
    scollBack : function  (img , obj) {
      //执行完回调事件处理
    }
   });

  //css
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
*/

+(function($){
/**
 * Checks for CSS support.
 * @private
 * @param {Array} array - The CSS properties to check for.
 * @returns {Array} - Contains the supported CSS property name and its index or `false`.
 */
function isStyleSupported(array) {
  var p, s, fake = document.createElement('div'), list = array;
  for (p in list) {
    s = list[p];
    if (typeof fake.style[s] !== 'undefined') {
      fake = null;
      return [ s, p ];
    }
  }
  return [ false ];
}

/**
 * Checks for CSS transition support.
 * @private
 * @todo Realy bad design
 * @returns {Number}
 */
function isTransition() {
  return isStyleSupported([ 'transition', 'WebkitTransition', 'MozTransition', 'OTransition' ])[0];
}

/**
 * Checks for CSS transform support.
 * @private
 * @returns {String} The supported property name or false.
 */
function isTransform() {
  return isStyleSupported([ 'transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform' ])[0];
}

$.fn.scollpic= function (options) {
  //计算长度
  $(this).each(function  () {
    var $this = $(this);
    var defualts = {
      itemTag : "li",
      itemWidth : 157,
      itemHeight : 150,
      itemCount: 4,
      bigImg : 'off',
      loop : true,
      wrapClass :'scrollpic-wrap',
      parenWidth : 'auto',
      playSpeed : 3000,
      autoPlay : false
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

    var $arrowPrev=$('<a href="javascript:void(0);" class="scroll-item-list-prev endprev st"><span class="v-h">prev</span></a>');
    var $arrowNext=$('<a href="javascript:void(0);" class="scroll-item-list-next st"><span class="v-h">next</span></a>');

    $this.parent().append($arrowPrev).append($arrowNext);

    $this.wrap('<div class="scroll-warp" style="overflow:hidden; position:relative; height:' + opts.itemHeight + 'px; width:' + opts.parenWidth + 'px;"></div>');

    $arrowPrev.click(function  () {
      scoll('left',$this);
    });

    $arrowNext.click(function  () {
      scoll('right',$this);
    });

    //页码
    var navItemCount = $this.find(opts.itemTag).length / opts.itemCount;
    function  nav() {
      var html = '<div class="banner-nav">';
      for (var i = 0; i < navItemCount; i++) {
        html += '<a class="' + (i == 0 ? 'current' : '' ) + ' sort-' + i + ' " data="'+ i +'" href="javascript:void(0);"><span>'+(i+1)+'</span></a>';
      }
      html += '</div>';
      return $(html);
    }
    var $nav = nav();

    $nav.appendTo($this.parent().parent());
    $nav.find("a").click(function  () {
      if ($(this).hasClass("current")) {
        return false;
      }else {
        $(this).addClass("current").siblings().removeClass("current");
        var ind = $(this).index();
        var scrollWidth = $(this).index() * opts.itemCount * opts.itemWidth;
        scrollWidth = scrollWidth + (opts.itemCount * opts.itemWidth);
        console.log(scrollWidth,ind);
        scoll('nav', $this, scrollWidth);
      }
    })

    //如果循环
    if (opts.loop == true) {
      var totleCount = $this.find(opts.itemTag).length;
      var $prevClone = $this.find(opts.itemTag + ':gt(' + (totleCount - opts.itemCount - 1) + ')').clone().addClass("clone");
      var $nextClone = $this.find(opts.itemTag + ':lt(' + opts.itemCount + ')').clone().addClass("clone");
      $nextClone.appendTo($this);
      $prevClone.prependTo($this);
    }

    //总长度
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

    //循环
    var onHover = false;
    $this.hover(function  () {
      onHover = true;
    },function  () {
      onHover = false;
    })

    function loopMain() {
      if (opts.autoPlay == true) {
        if (onHover == false) {
          $arrowNext.trigger('click');
        }
      }
    }
    
    var timecount = setInterval(function  () {
      loopMain();
    }, opts.playSpeed);
    
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

    var scrollEg = isTransform() ? isTransform()  : 'left';
    
    var leftVal = 0;

    //预设循环模式
    function  loopRest() {
      if (opts.loop == true) {
        $this.css("transition","0"); 
        scrollObj($this, -(opts.itemCount*opts.itemWidth),'nav', function  () {
          $this.css("transition","0.5s");
        });
      }
    }

    function  loopRestEnd() {
      if (opts.loop == true) {
        $this.css("transition","0"); 
        scrollObj($this, -(itemTotal - (opts.itemCount*opts.itemWidth)*2),'nav', function  () {
          $this.css("transition","0.5s");
        });
      }
    }


    loopRest();

    //滚动模式
    function  scrollObj(obj, value, navlong, callback) {
      if (navlong) {
         leftVal = 0;
      }
      cssSet = {};
      if (scrollEg != 'left') {
        var noPos = obj.css("");

        switch (scrollEg) {
        case 'transform':
            cssSet = {'transform' : 'translateX(' + (leftVal + value) + 'px)'};
        break
        case 'WebkitTransform':
            cssSet = {'WebkitTransform' : 'translateX(' + (leftVal + value) + 'px)'};
        break
        case 'MozTransform':
            cssSet = {'MozTransform' : 'translateX(' + (leftVal + value) + 'px)'};
        break
        case 'OTransform':
            cssSet = {'OTransform' : 'translateX(' + (leftVal + value) + 'px)'};
        break
        case 'msTransform':
            cssSet = {'msTransform' : 'translateX(' + (leftVal + value) + 'px)'};
        break 
        default:
        }
        obj.css(cssSet).one('bsTransitionEnd', function(){
          ifScroll = false;
          leftVal += value;
          if (callback) {
            callback();
          }
          checkEnd();
        })
        if (navlong) {
          obj.emulateTransitionEnd(10);
        } 
        
      }else {
        obj.animate({
          "left": (leftVal + value)
        },function  () {
          ifScroll = false;
          leftVal += value;
          checkEnd();
        })
      }
    }

    //滚动函数
    function scoll(dir,obj,moveWidth) {
      if (ifScroll == true) {
        return false;
      }
      ifScroll = true;
      if (dir=='left') {
        if (leftVal >= 0) {
          ifScroll = false;
          return false;
        }
        scrollObj(obj,opts.itemWidth);
      }

      if (dir=='right') {
        if (leftVal <= - (itemTotal-opts.parenWidth)) {
          ifScroll = false;
          return false;
        }
        scrollObj(obj,-opts.itemWidth);
      }

      if (dir == 'nav') {
        scrollObj(obj, -moveWidth,'nav');
      }
    }

    function checkEnd () {
      $this.parents("."+opts.wrapClass).find(".scroll-item-list-next").removeClass("endnext");
      $this.parents("."+opts.wrapClass).find(".scroll-item-list-prev").removeClass("endprev");

      if ($this.position().left >= 0 ) {
        $this.parents("."+opts.wrapClass).find(".scroll-item-list-prev").addClass("endprev");
        if (opts.loop = true) {
          loopRestEnd();
        }
      }
      if ($this.position().left <= - (itemTotal-opts.parenWidth) ) {
        $this.parents("."+opts.wrapClass).find(".scroll-item-list-next").addClass("endnext");

        if (opts.loop == true) {
          loopRest();
        }

      }
    }
  });
};

})(jQuery);


// 鼠标延迟执行方法
/*
$(this).hoverDelay({
  hoverEvent: function(){},
  outEvent:function  () {}
})
*/
+(function($){
  $.fn.hoverDelay = function(options){
    var defaults = {
      hoverDuring: 200,
      outDuring: 200,
      hoverEvent: function(){
        $.noop();
      },
      outEvent: function(){
        $.noop();    
      }
    };
    var sets = $.extend(defaults,options || {});
    var hoverTimer, outTimer, that = this;
    return $(this).each(function(){
      $(this).hover(function(){
        clearTimeout(outTimer);
        hoverTimer = setTimeout(function(){sets.hoverEvent.apply(that)}, sets.hoverDuring);
      },function(){
        clearTimeout(hoverTimer);
        outTimer = setTimeout(function(){sets.outEvent.apply(that)}, sets.outDuring);
      });
    });
  }      
})(jQuery);


/* jQuery EasIng v1.1.2 - http://gsgd.co.uk/sandbox/jquery.easIng.php
*
* Uses the built In easIng capabilities added In jQuery 1.1
* to offer multiple easIng options
*
* Copyright (c) 2007 George Smith
* Licensed under the MIT License:
*   http://www.opensource.org/licenses/mit-license.php
*/
// t: current time, b: begInnIng value, c: change In value, d: duration 动画特效

jQuery.extend(jQuery.easing, {
  easeInQuad : function(x, t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  easeOutQuad : function(x, t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  easeInOutQuad : function(x, t, b, c, d) {
    if((t /= d / 2) < 1)
      return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  },
  easeInCubic : function(x, t, b, c, d) {
    return c * (t /= d) * t * t + b;
  },
  easeOutCubic : function(x, t, b, c, d) {
    return c * (( t = t / d - 1) * t * t + 1) + b;
  },
  easeInOutCubic : function(x, t, b, c, d) {
    if((t /= d / 2) < 1)
      return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  },
  easeInQuart : function(x, t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
  },
  easeOutQuart : function(x, t, b, c, d) {
    return -c * (( t = t / d - 1) * t * t * t - 1) + b;
  },
  easeInOutQuart : function(x, t, b, c, d) {
    if((t /= d / 2) < 1)
      return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  },
  easeInQuint : function(x, t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  easeOutQuint : function(x, t, b, c, d) {
    return c * (( t = t / d - 1) * t * t * t * t + 1) + b;
  },
  easeInOutQuint : function(x, t, b, c, d) {
    if((t /= d / 2) < 1)
      return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  },
  easeInSine : function(x, t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  },
  easeOutSine : function(x, t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  },
  easeInOutSine : function(x, t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  },
  easeInExpo : function(x, t, b, c, d) {
    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  },
  easeOutExpo : function(x, t, b, c, d) {
    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
  },
  easeInOutExpo : function(x, t, b, c, d) {
    if(t == 0)
      return b;
    if(t == d)
      return b + c;
    if((t /= d / 2) < 1)
      return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  easeInCirc : function(x, t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  easeOutCirc : function(x, t, b, c, d) {
    return c * Math.sqrt(1 - ( t = t / d - 1) * t) + b;
  },
  easeInOutCirc : function(x, t, b, c, d) {
    if((t /= d / 2) < 1)
      return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  },
  easeInElastic : function(x, t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if(t == 0)
      return b;
    if((t /= d) == 1)
      return b + c;
    if(!p)
      p = d * .3;
    if(a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else
      var s = p / (2 * Math.PI) * Math.asin(c / a);
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  },
  easeOutElastic : function(x, t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if(t == 0)
      return b;
    if((t /= d) == 1)
      return b + c;
    if(!p)
      p = d * .3;
    if(a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else
      var s = p / (2 * Math.PI) * Math.asin(c / a);
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
  },
  easeInOutElastic : function(x, t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if(t == 0)
      return b;
    if((t /= d / 2) == 2)
      return b + c;
    if(!p)
      p = d * (.3 * 1.5);
    if(a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else
      var s = p / (2 * Math.PI) * Math.asin(c / a);
    if(t < 1)
      return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
  },
  easeInBack : function(x, t, b, c, d, s) {
    if(s == undefined)
      s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },
  easeOutBack : function(x, t, b, c, d, s) {
    if(s == undefined)
      s = 1.70158;
    return c * (( t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
  easeInOutBack : function(x, t, b, c, d, s) {
    if(s == undefined)
      s = 1.70158;
    if((t /= d / 2) < 1)
      return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
  },
  easeInBounce : function(x, t, b, c, d) {
    return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
  },
  easeOutBounce : function(x, t, b, c, d) {
    if((t /= d) < (1 / 2.75)) {
      return c * (7.5625 * t * t) + b;
    } else if(t < (2 / 2.75)) {
      return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
    } else if(t < (2.5 / 2.75)) {
      return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
    } else {
      return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
    }
  },
  easeInOutBounce : function(x, t, b, c, d) {
    if(t < d / 2)
      return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
      return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
  }
});


/*-- loading --*/
+function ($) {
  'use strict';
  //全局加载按钮
  $(function () {
    $.loadingHide = function  () {
      blockHide($("#loading-wrap"));
    };
    $.loadingShow = function  () {
      blockShow($("#loading-wrap"),'none');
    };
    $.loadingHide();
  })
}(jQuery);


/** 
* extend tag切换
* 
* @package tagshow
* @author cuki13

  $('.mysp-tag').tagshow({
    objshow: $(this).find('.mysp-tagbox-section'),
    taglink: $(this).find('.mysp-taglink a'),
    current_class: 'active'
  });

*/
+(function($){  
  $.fn.tagshow = function (options) {
    var obj=$(this);

    var defualts = {
      objshow: obj.find('.c1'),     //展示的区域 
      taglink: obj.find('.c2 a'),     //点击链接
      current_class: 'current'      //当前的样式
    };

    var opts = $.extend({}, defualts, options);  

    var is_fade=false;   //判断效果是否在执行
    opts.taglink.click(function  (e) {
      
      
      if ($(this).hasClass(opts.current_class)) {
        return false;
      }else {
        if (is_fade) {
          return false;
        }
        var e=$(this).attr('rel');
        is_fade=true;
        
          opts.objshow.addClass('none').hide();
          $("#"+e).fadeIn(200).removeClass('none');
          is_fade=false;
        

        opts.taglink.removeClass(opts.current_class);
        $(this).addClass(opts.current_class);
      }
      return false;
    });

    
  };  
})(jQuery);

/** 
* extend 刮刮看代码
*/
function  guagua() {
  //$("#canvas1").remove();
  //$(".content-box").append('<canvas id="canvas1" style=" background-repeat:no-repeat; background-position:center center;" />');
(function(bodyStyle) {
  
bodyStyle.mozUserSelect = 'none';
bodyStyle.webkitUserSelect = 'none';

var img = new Image();

var canvas = document.getElementById('canvas1');
var canvasbg = document.getElementById('canvasbg');


img.addEventListener('load', function(e) {
var ctx;
var ctxbg;
var w = ($(window).width()>640)?640:$(window).width(),
h = w/(625/425);
var offsetX = canvas.offsetLeft,
offsetY = canvas.offsetTop;
var mousedown = false;

function getTransparentPercent(ctx, width, height) {
  var imgData = ctx.getImageData(0, 0, width, height),
    pixles = imgData.data,
    transPixs = [];
  for (var i = 0, j = pixles.length; i < j; i += 4) {
    var a = pixles[i + 3];
    if (a < 128) {
      transPixs.push(i);
    }
  }
  rate=(transPixs.length / (pixles.length / 4) * 100).toFixed(2);
   return rate
}


function layer(ctx) {
var img1 = new Image();
img1.onload = function() {
  
  ctx.drawImage(img1, 0, 0, w, h);
  ctxbg.drawImage(img, (w-img.width)/2, (h-img.height)/2, img.width, img.height);
  
  //canvas.style.backgroundImage='url('+img.src+')';
  ctx.globalCompositeOperation = 'destination-out';
  
};

img1.src = 'images/kag.png';
//ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, w, h);
}

function eventDown(e){
e.preventDefault();

mousedown=true;
}

function eventUp(e){
e.preventDefault();
mousedown=false;
}

function eventMove(e){
e.preventDefault();
if(mousedown) {
if(e.changedTouches){
e=e.changedTouches[e.changedTouches.length-1];
}
var x = (e.clientX + document.body.scrollLeft || e.pageX) - offsetX || 0,
y = (e.clientY + document.body.scrollTop || e.pageY) - offsetY || 0;


with(ctx) {
  
beginPath();
var radgrad = ctx.createRadialGradient(x, y, 0, x, y, 30);
radgrad.addColorStop(0, 'rgba(0,0,0,1)');
radgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
ctx.fillStyle = radgrad;



arc(x, y, 30, 0, Math.PI * 2);
//ctx.clearRect(x, y, 440, 440);
fill();
}
}
}

canvas.width=w;
canvasbg.width=w;
canvas.height=h;
canvasbg.height=h;

ctx=canvas.getContext('2d');
ctxbg=canvasbg.getContext('2d');
ctx.fillStyle='transparent';
ctx.fillRect(0, 0, w, h);
layer(ctx);

canvas.addEventListener('touchstart', eventDown);
canvas.addEventListener('touchend', eventUp);
canvas.addEventListener('touchmove', eventMove);
canvas.addEventListener('mousedown', eventDown);
canvas.addEventListener('mouseup', eventUp);
canvas.addEventListener('mousemove', eventMove);
});
img.src = hideimg;

})(document.body.style);

}


/** 
* extend 绝对定位
* @author cuki13
*/
+(function($){  
  $.fn.posab = function (options) {
    var obj=$(this);
    var defualts = {
    };
    var opts = $.extend({}, defualts, options);  

    var getVal = obj.data("pos-ab").split(",");
    var setCss ={
      "position":"absolute",
      "width":parseInt(getVal[0]),
      "height":parseInt(getVal[1]),
      "top":parseInt(getVal[2]),
      "left":parseInt(getVal[3]),
      "visibility":"visible"
    }
    obj.css(setCss);
  };  
})(jQuery);



/** 
* extend ifIE6
* @author cuki13
*/
function ie6() {
  var isIe6 = false;
  if (/msie/.test(navigator.userAgent.toLowerCase())) {
    if (jQuery.browser && jQuery.browser.version && jQuery.browser.version == '6.0') {
      isIe6 = true
    } else if (!$.support.leadingWhitespace) {
      isIe6 = true;
    }
  }
  return isIe6;
}

/** 
* extend 向上每隔几秒滚动
* @author cuki13
  $(obj).scollUp({
    speed:3000,
    scolldiv:'.scolldiv'
  })
*/
+(function($){
  $.fn.scollUp = function (options) {
    var obj=$(this);
    var defualts = {
      scolldiv:'.scolldiv'
    };
    var opts = $.extend({}, defualts, options);  

    var MyMar = 0;
    var scolldiv = obj.find(opts.scolldiv);
    var objclone = obj.find(opts.scolldiv).clone();
    objclone.appendTo(obj);
    function Marquee() {
       if(objclone.offset().top - obj.offset().top <=0){
          obj.scrollTop(0);
         }else{
           if ((obj.scrollTop())%(objclone.height()/2) == 0) {
            clearInterval(MyMar);
            setTimeout(
              function(){
                clearInterval(MyMar);
                MyMar=setInterval(Marquee,speed);
              }, 3000)

           }
            var k = obj.scrollTop();
            obj.scrollTop(k+1);
         }
    }

     MyMar=setInterval(Marquee,speed);

     obj.hover(function  () {
      clearInterval(MyMar);
     },function  () {
      clearInterval(MyMar);
      MyMar=setInterval(Marquee,speed);
     })
    
  };  
})(jQuery);


/** 
* extend 表单控件自定义
* @author cuki13  
  .selectstyle {position:relative; border:1px solid #ccc; height:30px;display:inline-block;line-height:30px; width:100px; overflow:hidden;}
  .selectstyle select {position:absolute;left:0; top:0px; height:30px; margin:0; padding:0; width:100%; height:38px; }
  .selectstyle .val {display:block;}
  obj.each(function (n) {
      dataFormType($(this));
  })

*/
/*-- 表单select [data-form="select"]--*/
+function ($) {
  'use strict';
  var formSting = '[data-form="select"]';
  
  var Select = function  (number) {
    this.id = number;
  }

  Select.prototype.build = function  (el) {
    var $this = $(el);
    $this.css("opacity","0");
    $this.wrap("<span class='selectstyle'></span>");
    var gettxt = '<span class="val textb" >'+ $this.find("option:eq(0)").html()+'<i class="none"></i></span>';
    gettxt = $(gettxt);       
    gettxt.insertBefore($this);
    $this.parents(".selectstyle").addClass("select-"+ this.id);
    $this.on("change.resize",function  () {
      var vl = $(this).find("option:selected").html();
      $(this).prev('.val').html(vl);
      $(this).parents(".selectstyle").find('.val').html(vl);
    })
    $this.trigger('change.resize');
  }

  function Plugin(option) {
    return this.each(function (n) {
      var $this   = $(this)
      var number = $this.attr('id') || n 
      var data    = $this.data('ck.select')
      var options = typeof option == 'object' && option
      if (!data) $this.data('ck.select', (data = new Select(number)))
      if (option == 'build') data.build($(this))
      else if (option) data.setState(option)
    })
  }

  $(document).on('ready.ck.select', function (e) {
    var $this = $(formSting);
    Plugin.call($this,'build');
  })
  
}(jQuery); 


/*-- 表单radio [data-form="radio"] --*/
+function ($) {
  'use strict';
  var formSting = '[data-form="radio"]';
  
  var Radio = function  (number) {
    this.id = number;
  }

  Radio.prototype.build = function  (el) {
    var setCss = {
      "opacity":"0",
      "position":"absolute"
    }
    var $this = $(el);
    $this.css(setCss);
    var idiv = $('<i></i>');
    idiv.insertBefore($this);
    $this.parent("label").css("position","relative");
    $this.on("change.resize",function  () {      
        $(this).parent("label").addClass("ck-select").siblings("label").removeClass("ck-select");     
    });
  }

  function Plugin(option) {
    return this.each(function (n) {
      var $this   = $(this)
      var number = $this.attr('id') || n 
      var data    = $this.data('ck.select')
      var options = typeof option == 'object' && option
      if (!data) $this.data('ck.select', (data = new Radio(number)))
      if (option == 'build') data.build($(this))
      else if (option) data.setState(option)
    })
  }

  $(document).on('ready.ck.radio', function (e) {
    var $this = $(formSting);
    Plugin.call($this,'build');
  })
  
}(jQuery); 

/** 
* extend 弹出框
* @author cuki13
  $(obj).popbk();
  .popbk-wrap {position: fixed; top: 0; left: 0; bottom: 0; right: 0; overflow: auto; z-index:100;}
  .popbk {position: absolute; top:0; left:50%;}
  .popbk .close {position:absolute;right:0;top:0;}
  .fade.in { opacity: 1; }
  .fade{opacity: 0;-webkit-transition: opacity .15s linear;-o-transition: opacity .15s linear;transition: opacity .15s linear;}
  $("#popbk2").data('ck.pokbk').open();
  $("#popbk2").data('ck.pokbk').close();
*/

+(function($){
  var dataString = '[data-box="popbk"]';
  
  var Popbk = function  (el, number ,options) {
    this.el = $(el)
    this.id = number
    this.options = $.extend({}, this.defualts, options); 
  }
  
  Popbk.defualts = {};

  Popbk.prototype.build = function  (el) {
    
    var $this = $(el);
    $this.wrap('<div class="popbk-wrap-'+ this.id +' popbk-wrap fade" ></div>');
    $this.wrap('<div class="popbk-'+ this.id +' popbk" ></div>');

    var sClose = "<a class='close'><span class='none'>close</span></a>";
    sClose = $(sClose);
    sClose.insertAfter($this);
    var ml = $this.width()/2;     
    $this.parent(".popbk").css("margin-left",-ml);
    
    var wh = $this.height();
    if ($(window).height < wh) {
      $this.parent(".popbk").css("top","30px");
    }else {
      $this.parent(".popbk").css({
        "margin-top":-wh/2,
        "top":'50%'
      });
    }
    $this.parent(".popbk").find(".close").on('click',function  () {
      $this.data('ck.pokbk').close();
    })    
    $this.parents(".popbk-wrap").hide();
  }

  Popbk.prototype.open = function  () {
    this.close;
    var $this = this.el;
    if ($this.length) {
      $this.parents(".popbk-wrap").show();
      $this.parents(".popbk-wrap")[0].offsetWidth;
      $this.parents(".popbk-wrap").addClass("in");
    }
  }

  Popbk.prototype.close = function  () {
    var $this = this.el;
    var $parent = $this.parents(".popbk-wrap");
    if ($.support.transition && $parent.hasClass('fade')) {
      $parent.removeClass("in");
      $parent.one('bsTransitionEnd', function  () {
          $parent.hide();
        }).emulateTransitionEnd(150);
    }else {
      $parent.hide();
    }
  }

  function Plugin(option) {
    return this.each(function (n) {
      var $this   = $(this)
      var data    = $this.data('ck.pokbk')
      var number = $this.attr('id') || n 
      var options = typeof option == 'object' && option
      if (!data) $this.data('ck.pokbk', (data = new Popbk(this,number)))
      if (option == 'build') data.build($(this))
      else if (option) data.setState(option)
    })
  }

  $(document).on('ready.popbk', function  () {
    var $this = $(dataString);
    Plugin.call($this,'build');
  })
})(jQuery);


/*固定表格
fixhead($(".fixhead"));
<style type="text/css">
  .fixhead-box {width:800px; position:relative; border:1px solid #000;
  }
  .fixhead {width:800px;}
  .fixhead td,.fixhead th{border-bottom:1px solid #000;border-left:1px solid #000;}

  .fixhead-ct {height:170px; overflow:auto; overflow-x:hidden;}
  .fixhead-ct .trhd {visibility:hidden; display:none;}
  .fixhead-hd {height:22px; overflow:hidden; background:#fff; position:relative;}
</style>
*/
function fixhead(obj) {
  var clonetb = '';
  obj.find("th").each(function (n) {
      $(this).outerWidth($(this).outerWidth());
    obj.find("tr:eq(1) td:eq("+n+")").outerWidth($(this).outerWidth());
    if (n == obj.find("th").length-1) {
      clonetb = obj.clone();      
      obj.wrap('<div class="fixhead-box"></div>');
      obj.wrap('<div class="fixhead-ct"></div>');
            
      clonetb.insertBefore(obj.parent());
      clonetb.wrap('<div class="fixhead-hd"></div>');
      obj.find("tr").last().find("td").css("border-bottom","0");
    }
  })      
}

/* 取随机颜色 */
+function ($) {
  'use strict';
  var srand = '[data-dismiss="srand"]';
  var Rand   = function () {}
  Rand.prototype.rcolor = function  () {
    //16进制方式表示颜色0-F
    var arrHex = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    var strHex = "#";
    var index;
    for(var i = 0; i < 6; i++) {
      //取得0-15之间的随机整数
      index = Math.round(Math.random() * 15);
      strHex += arrHex[index];
    }

    var $this = $(this);
    $this.html(strHex);
  }
  $(document).on('click', srand, Rand.prototype.rcolor);
}(jQuery);


/* 移动端版本兼容 */
+(function(){
  'use strict';
  var Fixmobile = function  () {
    this.viwep();
  }
  Fixmobile.width = 640;
  Fixmobile.prototype.viwep = function  (e) {
    var phoneWidth = parseInt(window.screen.width),
    phoneScale = phoneWidth/Fixmobile.width,
    ua = navigator.userAgent,
    headmate;
    if (/Android (\d+\.\d+)/.test(ua)){
      var version = parseFloat(RegExp.$1);
      // andriod 2.3
      if(version > 2.3){
        document.write('<meta name="viewport" content="width=' + Fixmobile.width + ', minimum-scale = ' + phoneScale + ', maximum-scale = '+phoneScale+', target-densitydpi=device-dpi">');
      // andriod 2.3以上
      }else{
        document.write('<meta name="viewport" content="width=' + Fixmobile.width + ', target-densitydpi=device-dpi">');
      }
      // 其他系统
    } else {
      document.write('<meta name="viewport" content="width=' + Fixmobile.width + ', user-scalable=no, target-densitydpi=device-dpi">');
    }
  }
  var newviewport = new Fixmobile();
})();
 
/*-- 层显示 --*/
+function ($) {
  'use strict';
   $.blockShow = function blockShow(objIn, objOut, callBack) {
    if (!objOut) {
      objIn.show();
      objIn[0].offsetWidth;
      objIn.addClass("in").one('bsTransitionEnd',function  () {
        $(this).removeClass("in");
      }).emulateTransitionEnd(220);
    }else {
      objOut.addClass("out").one('bsTransitionEnd', function  () {

      $(this).hide();
      $(this)[0].offsetWidth;
      $(this).removeClass("out");

      objIn.show();
      $(this)[0].offsetWidth;
      objIn.addClass("in").one('bsTransitionEnd',function  () {
        $(this).removeClass("in");
      }).emulateTransitionEnd(220);
      if (callBack) {
        callBack();
      }
      }).emulateTransitionEnd(220);
    }
  }

  $.blockHide = function blockHide(objOut, callBack) {
    objOut.addClass('out').one('bsTransitionEnd', function  () {
    $(this).hide().removeClass("out");

    if (callBack) {
      callBack();
    }
    }).emulateTransitionEnd(350);
  }
}(jQuery);

/*-- 表格copy exl帮手 --*/
$(document).ready(function() {
  $("#adress p").each(function(n){
    var gVal = $(this).html();
    $(".table-biz tr").eq(n).append('<td>' + gVal + '</td>');
  })

  var tbCount = 0;
  $(".area p").each(function (n) {
      var count = $(this).data("itemcount");
      for (var i = 0;  i < count ; i++) {
        if (i == 0) {
          var ghtml = '<td rowspan="'+ count +'">' + $(this).html() + '</td>';
          $(".table-biz tr").eq(tbCount).prepend(ghtml);
        }
        tbCount++;
      }
  })
})


//移动监测动力
+function ($) {
  'use strict';
  if (!velocityPrevPosition) velocityPrevPosition = _this.touches.current;
  if (!velocityPrevTime) velocityPrevTime = (new Date()).getTime();
  _this.velocity = (_this.touches.current - velocityPrevPosition) / ((new Date()).getTime() - velocityPrevTime) / 2;
  if (Math.abs(_this.touches.current - velocityPrevPosition) < 2) _this.velocity = 0;
  velocityPrevPosition = _this.touches.current;
  velocityPrevTime = (new Date()).getTime();
}(jQuery);


/* ========================================================================
滚动控制效果
 */
+function ($) {
  "use strict";
  var scrollEffe = function  (groudEl) {
    this.groudEl = groudEl;
    this.$el = [];
    this.$parentEl = [];
    this.startPro = [];
    for (var i = 0;  i<groudEl.length ; i++) {
      this.$el[i] = groudEl[i][0];
      this.$parentEl[i] = groudEl[i][1];
      this.startPro[i] = groudEl[i][5];
      this.initPosFun(this.$el[i],groudEl[i][2],groudEl[i][3],groudEl[i][4]);
    }

    this.initScroll();

  }

  scrollEffe.prototype.initPosFun =function  ($dom,tempX,tempY,type) {
    if (!type) {
      type = "moveblock";
    }
    tempX = tempX || 0;
    tempY = tempY || 0;
    $dom.data("endX",parseFloat($dom.css("left")));
    $dom.data("startX",parseFloat($dom.css("left"))+tempX);
    $dom.data("tempX",tempX);

    $dom.data("endY",parseFloat($dom.css("top")));
    $dom.data("startY",parseFloat($dom.css("top"))+tempY);
    $dom.data("tempY",tempY);

    $dom.css({"left":$dom.data("startX"),"top":$dom.data("startY")});
  }

  scrollEffe.prototype.posMoveFun = function($dom,$domParent,plong)
  {
      var permb = 0;
      if (plong) {
        permb = plong;
      }else {
        permb = 0;
      }
      //父级到窗口上边缘的距离
      var tempY = $(document).scrollTop()-$domParent.position().top + permb;
      var per = Math.max(-tempY/800,0);
      var targetX = $dom.data("endX")+$dom.data("tempX")*per;
      var targetY = $dom.data("endY")+$dom.data("tempY")*per;
      $dom.css({"left":targetX,"top":targetY});
  }


  scrollEffe.prototype.opacity = function($dom,$domParent,ease)
  {
    //父级到窗口上边缘的距离
    var tempY = $(document).scrollTop()-$domParent.position().top;
    var opacity = Math.min(tempY*0.008,1);
    $dom.css("opacity",opacity);
  };

  scrollEffe.prototype.scale = function($dom,$domParent,ease)
  {
    //父级到窗口上边缘的距离
    var tempY = $(document).scrollTop()-$domParent.position().top + $(window).height()/2;

    var scale = Math.min(tempY*0.003,1);
    if (scale < 0) {
      scale = 0
    }
    $dom.css("transform","scale(" + scale + ")");
  };


  scrollEffe.prototype.initScroll = function  () {
    var $this = this;
    $(window).bind("scroll",function(){
      for (var i = 0;  i<$this.groudEl.length ; i++) {
        switch ($this.groudEl[i][4]) {
        case 'moveblock':
          $this.posMoveFun($this.$el[i],$this.$parentEl[i],$this.startPro[i]);
        break
        case 'opacity':
         $this.opacity($this.$el[i],$this.$parentEl[i]);
        case 'scale':
         $this.scale($this.$el[i],$this.$parentEl[i]);
        break
        default:
        }
           
      }
    })
  }

  $(document).ready(function() {
      //控制模块
      if ($('body.home').length > 0) {
        var blockSilder = [
          [$(".server-block1"),$("#server-container"),-700,-600-300,'moveblock'],
          [$(".server-block2"),$("#server-container"),-1500,-600+300,'moveblock'],
          [$(".server-block3"),$("#server-container"),0,500,'moveblock'],
          [$(".server-block4"),$("#server-container"),300,-600-300,'moveblock'],
          [$(".server-box-top"),$("#server-container"),0, -1200,'moveblock'],
          [$(".advantage-ct-pk"),$("#advantage-container"),0.5, 1,'scale'],
          [$(".advantage-cir-active"),$("#advantage-container"),-500, 0,'moveblock'],
          [$(".advantage-cir-media"),$("#advantage-container"),0, -500,'moveblock'],
          [$(".advantage-cir-design"),$("#advantage-container"),-300, 500,'moveblock'],
          [$(".advantage-cir-power"),$("#advantage-container"),-300, -500,'moveblock'],
          [$(".advantage-cir-brand"),$("#advantage-container"),300, -500,'moveblock'],
          [$(".advantage-cir-res"),$("#advantage-container"),-300, 500,'moveblock'],
          [$(".team-box-txt"),$("#team-container"),-600, 0,'moveblock'],
          [$(".team-ld"),$("#team-container"),600, 0,'moveblock'],
          [$(".news-list"),$("#news-container"),0, 700,'moveblock'],
          [$(".contact-adress"),$("#contact-container"),-500, 0,'moveblock',500],
          [$(".share-box"),$("#contact-container"),500, 0,'moveblock',500]
        ]
        var $serverBlock1 = new scrollEffe(blockSilder);
      }
  })
}(jQuery);


/** 
* extend 无刷新加载
* 
* @package jquery
* @author cuki13
*/
+(function($){
  'use strict';
  var ajax = null;
  var urlLink = function  (el) {
    this.$el = $(el) || null;
    this.url = $(el).attr("href") || null;
  }

  urlLink.prototype.jump = function  () {
    
    var $this = this;
    $.ajax({
      type: "POST",
      url: $this.url,
      //dataType: 'json',
      success: function(data){
       $.blockHide($("#loading-wrap"));
        var cotenData = null;
        var data = $(data);
        var gTitle = null;
        $(data).each(function (n) {
          var findContainer = $(data)[n];
          var container = $(findContainer);
          if (container.is("title")) {
            gTitle = $($(data)[n]).html();
          }
          if (container.hasClass("container")) {
            cotenData = findContainer.outerHTML;
           
            if ($.support.transition) {
              $(".container").addClass("out").one('bsTransitionEnd',function  () {
                $(".container").removeClass("out");
                $(".container").replaceWith(container);
                
                container.addClass("in");
                setTimeout(
                  function(){
                    container.removeClass("in");
                  }, 320);
              }).emulateTransitionEnd(320);
            }else {
              $(".container").replaceWith(container);
            }
            return false;
          }
        })
        document.title = gTitle;
        var state = {
          url: $this.url,
          title: document.title,
          getHtml: cotenData
        };

        history.pushState(state,gTitle,$this.url);
        ajax = true;
      },
      error:function  () {
        alert('很抱歉加载失败，请重新刷新页面');
        $.blockHide($("#loading-wrap"));
      },
      beforeSend:function  () {
        $.blockShow($("#loading-wrap"));
      }
    });
  }

  $(document).ready(function() {
    urlLink.currentState = {
      url : document.location.href,
      title :  document.title,
      getHtml : $(".container")[0].outerHTML
    }

    //history.pushState(urlLink.currentState,document.title,location.href);
    $("body").on('click','[data-url="true"]',function  (e) {
      e.preventDefault();
      $(this).data("url",new urlLink(this));
      $(this).data("url").jump();
    })
  })



  window.addEventListener("popstate",function(event){
    if(event && event.state){
      var gcontent = $(event.state.getHtml);
      $(".container").replaceWith(gcontent);
      $(".container").removeClass("out");
      document.title = event.state.title;
    }else{
      if (ajax == null) {
        return false;
      }
      document.title = urlLink.currentState.title;
      $(".container").replaceWith(urlLink.currentState.getHtml);
      $(".container").removeClass("out");
    }
  });

 $.pUrl = function (url) {
   var blink = new urlLink();
   blink.url = url;
   blink.jump();
 }

})(jQuery);


///** 
* extend 雪花效果
* 
* @package jquery
* @author cuki13
  */

(function () {
    var addEvent = function (t, c, tf) {
        if (document.addEventListener) {
            document.addEventListener(t, c, tf);
        } else if (document.attachEvent) {
            document.attachEvent('on' + t, c);
        }
    }
    var app = {};
    var js_canvas_box_id = 'js_theme_christmas_2014_canvas_snow', j;
    var christmas_2014 = function () {
        function r(a) {
            return a * Math.random()
        }

        function s() {
            return document.createElement("canvas")
        }

        function t() {
            var a;
            for (var d = 0; d < m; d++)a = d < m * .6 ? 0 : d < m * .8 ? 1 : d < m * .9 ? 2 : d < m * .98 ? 3 : 4, o[d] = [r(b), r(c), a]
        }

        function u() {
            var a, d, e, f;
            p += .01, d = Math.sin(p);
            for (a = 0; a < m; a++) {
                f = o[a], e = Math.sin(4 * p + a), f[1] += f[2] / 2 + (2 + e), f[0] += 6 * (d + e / 2) / (10 / f[2]), f[1] > c && (f[1] = -n, f[0] = r(b));
                if (f[0] > b || f[0] < -n)d > 0 ? f[0] = -n : f[0] = b;
                o[a] = f
            }
        }

        function v() {
            var a;
            k.fillStyle = l, k.clearRect(0, 0, b, c), k.beginPath();
            for (a = 0; a < m; a++) {
                k.drawImage(i[o[a][2]], o[a][0], o[a][1]);
            }

            k.fill();
            u();
        }

        function w(a) {
            b = window.innerWidth,
            c = window.innerHeight,
            j !== undefined && (j.width = b, j.height = c, m = b * c / 6e3,
            l = k.createLinearGradient(0, 0, 0, c), t())
        }

        function x() {
            $(window).on('resize', function () {
                christmas_2014.resizeHandler();
            });
            j = document.createElement("canvas");

            j.style.position = "fixed";
            j.style.top = "0px";
            j.style.left = "0px";
            j.style.pointerEvents = "none";
            j.id = js_canvas_box_id;
            document.querySelector(".animate-layer").appendChild(j);

            k = j.getContext("2d");
            k.strokeStyle = "none";
            d = s(), e = s(), f = s(), g = s(), h = s(), i = [d, e, f, g, h];

            y({
                canvas: d,
                width: n * .4,
                height: n * .4,
                color: "#FFF",
                soft: .05
            });

            y({canvas: e, width: n * .5, height: n * .5, color: "#FFF", soft: .05});
            y({
                canvas: f,
                width: n * .6,
                height: n * .6,
                color: "#FFF",
                soft: .3
            });
            y({canvas: g, width: n * .8, height: n * .8, color: "#FFF", soft: .2}), y({
                canvas: h,
                width: n,
                height: n,
                color: "#FFF",
                soft: .05
            });

            w(null);

            app.snowTimer = setInterval(function () {
                q(christmas_2014.draw)
            }, 50);
        }

        function y(a) {
            var b, c, d, e, f, g, h, i, j;
            d = a.width || 30,
                e = a.height || 30,
                f = d / 2, g = e / 2,
                i = a.color || "#FFF",
                h = a.soft || 0, b = a.canvas, b.width = d, b.height = d, c = b.getContext("2d"), c.clearRect(0, 0, d, e), j = c.createRadialGradient(f, g, 0, f, g, f), j.addColorStop(0, i), j.addColorStop(.1, i), j.addColorStop(.85, z(i, h)), j.addColorStop(1, z(i, 0)), c.fillStyle = j, c.fillRect(0, 0, d, e)
        }

        function z(a, b) {
            var c, d, e;
            return a = a.replace(/^s*#|s*$/g, ""), a.length === 3 && (a = a.replace(/([0-9a-fA-F])/g, "$1$1")), d = parseInt(a.substr(2, 2), 16), e = parseInt(a.substr(4, 2), 16), c = parseInt(a.substr(0, 2), 16), "rgba(" + c + ", " + d + ", " + e + ", " + b + ")"
        }

        var b, c, d, e, f, g, h, i = [], j, k, l, m, n = 20, o = [], p = 0,
            q = function () {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
                    window.setTimeout(a, 62.5)
                }
            }();
        return {
            init: x,
            draw: v,
            stop: function () {
                if (app.snowTimer) window.clearInterval(app.snowTimer);
                if(j){
                    j.parentNode.removeChild(j);
                    j = false;
                }
            },
            resizeHandler: w}
    }();

    if (!window['THEME_SCRIPT']) {
        window['THEME_SCRIPT'] = {};
    }
    window['THEME_SCRIPT'].christmas_2014 = {
        start: function () {
            if($.browser.mozilla || $.browser.webkit || ($.browser.msie && $.browser.version > 9) || window.navigator.userAgent.indexOf('rv:11') != -1){
                christmas_2014.init();
            }
        },
        stop: function () {
            if($.browser.mozilla || $.browser.webkit || ($.browser.msie && $.browser.version > 9) || window.navigator.userAgent.indexOf('rv:11') != -1){
                christmas_2014.stop();
            }
        }
    }
    christmas_2014.init();
})();


// 加入收藏夹
function SetFavorite() {
    var sTitle = document.title;
    var sURL = document.location.href;
    try {
        window.external.addFavorite(sURL, sTitle);
    } catch (e) {
        try {
            window.sidebar.addPanel(sTitle, sURL, "");
        } catch (e) {
            alert("加入收藏失败,请使用Ctrl+D进行添加.");
        }
    }
}

//设为首页
function myhomepage() {
    if (document.all) {
        document.body.style.behavior = "url(#default#homepage)";
        document.body.setHomePage('http://www.taiweifeng.com/');
    }
    else {
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        }
        catch (e) {
            try { //Firefox
                var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                prefs.setCharPref('browser.startup.homepage', pageURL);
            } catch (e) {
                alert("您的浏览器不支持该操作，请使用浏览器菜单手动设置.");
            }
        }
    }
}

//延迟加载
 <img class="lazy" src="images/grey.gif" data-original="http://img.taiweifeng.com//product/2015/01/13/201501131402478.jpg">
$("img.lazy").lazyload();


 //分享函数
var sns_share = function(type, href, title, word, pic, uid){
	//分享到163
	if(type == 'netease' || type == '163') {
		var u = 'http://t.163.com/article/user/checkLogin.do?link=http://news.163.com/&source=' + encodeURIComponent('tudou') + '&info='+ encodeURIComponent(title + "\n" + word + ' ' + href) +
				'&'+ new Date().getTime() + '&images=' + encodeURIComponent(pic);
		var w = window.open(u, "163", 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=840,height=430,left=' + (screen.width - 840) / 2 + ',top=' + (screen.height - 430) / 2);
		setTimeout(function(){w}, 1000);		
	}
	//分享到QQ空间
	if(type == 'qq' || type == 'qzone' || type == 'qqzone') {
		var u = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + encodeURIComponent(href) + "&summary=" + encodeURIComponent(word) + '&title='+ encodeURIComponent(title) + "&pics=" +
				 encodeURIComponent(pic) ;
		var w = window.open(u, "qzone", 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=840,height=430,left='+(screen.width - 840) / 2 + ',top=' + (screen.height - 430) / 2);
		setTimeout(function(){w}, 1000);		
	}
	//分享到新浪微博
	if(type == 'weibo' || type == 'sina') {
		var u = 'http://v.t.sina.com.cn/share/share.php?c=spr_web_bd_tudou_weibo&title=' + encodeURIComponent(title+"\n"+word) + '&url=' + encodeURIComponent(href) + '&source=' +
				encodeURIComponent('优酷土豆集团') + '&content=gb2312&pic=' + encodeURIComponent(pic) + '&ralateUid='+(uid == null ? '1642270165' : uid);
		var w = window.open(u, "wb", 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=840,height=430,left=' + (screen.width - 840) / 2 + ',top=' + (screen.height - 430) / 2);
		setTimeout(function(){w}, 1000);		
	}
	//分享到QQ微博
	if(type == 'qqweibo' || type == 'qweibo' || type == 'tencentweibo') {
		var u = 'http://v.t.qq.com/share/share.php?title=' + encodeURIComponent(title+"\n"+word) + '&url=' + encodeURIComponent(href) + '&appkey=3be7a91cc641445fb33e2b83557b75bc&pic=' +
				encodeURIComponent(pic) + '&site=' + encodeURIComponent('优酷土豆集团');
		var w = window.open(u, "qweibo", 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=840,height=430,left='+(screen.width - 840)/ 2 + ',top=' + (screen.height - 430) / 2);
		setTimeout(function(){w}, 1000);		
	}
	//分享到白社会
	if(type == 'bsh') {
		var u = 'http://bai.sohu.com/share/blank/addbutton.do?from=tudou&link=' + encodeURIComponent(href) + '&title=' + encodeURIComponent(title);
		var w = window.open(u, "bsh", 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=840,height=430,left='+(screen.width - 840)/ 2 + ',top=' + (screen.height - 430) / 2);
		setTimeout(function(){w}, 1000);		
	}
	//分享到搜狐
	if(type == 'sohu' || type == 'sohuweibo') {
		var u = 'http://t.sohu.com/third/post.jsp?url=' + encodeURIComponent(href) + '&title=' + encodeURIComponent(title+"\n"+word) + '&&content=utf-8';
		var w = window.open(u, "sohu", 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=840,height=430,left='+(screen.width - 840)/ 2 + ',top=' + (screen.height - 430) / 2);
		setTimeout(function(){w}, 1000);		
	}
	//分享到开心网
	if(type == 'kaixin') {
		var u = 'http://www.kaixin001.com/repaste/share.php?rtitle=' + encodeURIComponent(title) + '&rurl=' + encodeURIComponent(href) + '&rcontent=' + encodeURIComponent(word);
		var w = window.open(u, "kaixin", 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=840,height=430,left='+(screen.width - 840)/ 2 + ',top=' + (screen.height - 430) / 2);
		setTimeout(function(){w}, 1000);		
	}
	//分享到人人网
	if(type == 'renren') {
		var u = 'http://widget.renren.com/dialog/share?resourceUrl=' + encodeURIComponent(href) + '&title=' + encodeURIComponent(title) + '&content=' + encodeURIComponent(word) +
				'&pic=' + encodeURIComponent(pic);
		var w = window.open(u, "renren", 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=840,height=430,left='+(screen.width - 840)/ 2 + ',top=' + (screen.height - 430) / 2);
		setTimeout(function(){w}, 1000);		
	}
	//分享到豆瓣
	if(type == 'douban') {
//		var u = 'http://www.douban.com/recommend/?url=' + encodeURIComponent(href) + '&title=' + encodeURIComponent(title) + "&image=" + encodeURIComponent(pic) + '&text='+encodeURIComponent(word);
		var u = 'http://shuo.douban.com/!service/share?href=' + encodeURIComponent(href) + '&name=' + encodeURIComponent(title) + "&image=" + encodeURIComponent(pic) + '&text='+encodeURIComponent(word);
		var w = window.open(u, "douban", 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=840,height=430,left='+(screen.width - 840)/ 2 + ',top=' + (screen.height - 430) / 2);
		setTimeout(function(){w}, 1000);		
	}
	//分享到飞信
	if(type == 'feixin') {
		var u = 'http://i3.feixin.10086.cn/apps/share/share?appkey=&source='+encodeURIComponent('优酷土豆集团')+'&content=' + encodeURIComponent(word) + '&pageid=&url=' + encodeURIComponent(href) + '&title=' + encodeURIComponent(title) + "&pic=" + encodeURIComponent(pic);
		var w = window.open(u, "feixin", 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=840,height=430,left='+(screen.width - 840)/ 2 + ',top=' + (screen.height - 430) / 2);
		setTimeout(function(){w}, 1000);		
	}
	//分享到51说客
	if(type == '51sns') {
		var u = 'http://share.51.com/share/share.php?type=8&vaddr=' + encodeURIComponent(href) + '&title=' + encodeURIComponent(title) ;
		var w = window.open(u, "51sns", 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=840,height=430,left='+(screen.width - 840)/ 2 + ',top=' + (screen.height - 430) / 2);
		setTimeout(function(){w}, 1000);		
	}
	//百度贴吧
	if(type == 'baidu') {
		var u = 'http://tieba.baidu.com/f/commit/share/openShareApi?comment='+encodeURIComponent('优酷土豆集团')+'&desc=' + encodeURIComponent(word) + '&url=' + encodeURIComponent(href) + '&title=' + encodeURIComponent(title) + "&pic=" + encodeURIComponent(pic) ;
		var w = window.open(u, "baidu", 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=840,height=430,left='+(screen.width - 840)/ 2 + ',top=' + (screen.height - 430) / 2);
		setTimeout(function(){w}, 1000);		
	}
	//139说客
	if(type == '10086') {
		var u = 'http://talk.shequ.10086.cn/apps/vshare/share.php?app_key=4f0a69e59b11c6d6eb98ba5e9a8ce1fb&url=' + encodeURIComponent(href) + '&title=' + encodeURIComponent(title + "\n" +word)  ;
		var w = window.open(u, "10086", 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=840,height=430,left='+(screen.width - 840)/ 2 + ',top=' + (screen.height - 430) / 2);
		setTimeout(function(){w}, 1000);		
	}
	//微信
	if(type == 'qweixin') {
		var u = 'http://v.youku.com/v_wechatShare/?url=' + encodeURIComponent(href) + '&content=' + encodeURIComponent(title + "\n" +word)  ;
		var w = window.open(u, "qweixin", 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=840,height=430,left='+(screen.width - 840)/ 2 + ',top=' + (screen.height - 430) / 2);
		setTimeout(function(){w}, 1000);		
	}
}

/*等比例缩放图片*/
function AutosizeImage(ImgD, maxwidth, maxheight) {
    var image = new Image();
    image.src = ImgD.src;
    if (image.width > 0 && image.height > 0) {
        flag = true;
        if (image.width / image.height >= maxwidth / maxheight) {
            if (image.width > maxwidth) {
                ImgD.width = maxwidth;
                ImgD.height = (image.height * maxwidth) / image.width;
            } else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
        }
        else {
            if (image.height > maxheight) {
                ImgD.height = maxheight;
                ImgD.width = (image.width * maxheight) / image.height;
            } else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
        }
    }
}

/*-- cooki操作 --*/
function addCookie(objName,objValue,objHours){
var str = objName + "=" + escape(objValue);
if(objHours > 0){
  var date = new Date();
  var ms = objHours*3600*1000;
  date.setTime(date.getTime() + ms);
  str += "; expires=" + date.toGMTString();
}
document.cookie = str;
}

function getCookie(objName){
var arrStr = document.cookie.split("; ");
for(var i = 0;i < arrStr.length;i ++){
  var temp = arrStr[i].split("=");
  if(temp[0] == objName) return unescape(temp[1]);
} 
}