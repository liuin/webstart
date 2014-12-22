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
function blockShow(objIn, objOut, callBack) {
  if (objOut == 'none') {
    objIn.show();
    objIn[0].offsetWidth;
    objIn.addClass("in");
  }else {
    objOut.removeClass("in").one('bsTransitionEnd', function  () {
    $(this).hide();
    objIn.show();
    $(this)[0].offsetWidth;
    objIn.addClass("in");
    if (callBack) {
      callBack();
    }
    }).emulateTransitionEnd(350);
  }
}

function blockHide(objOut, callBack) {
  objOut.removeClass("in").one('bsTransitionEnd', function  () {
  $(this).hide();
  if (callBack) {
    callBack();
  }
  }).emulateTransitionEnd(350);
}

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