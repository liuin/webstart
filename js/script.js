if (typeof jQuery === 'undefined') { throw new Error('JavaScript requires jQuery') }

/* ========================================================================
 * Bootstrap: transition.js v3.2.0
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


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
    $(this).one('bsTransitionEnd', function () { console.log("222"); called = true;  })
    var callback = function () {console.log("111"); if (!called) $($el).trigger($.support.transition.end);}
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



/*-- alert --*/
+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================
  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
  
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.2.0'

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)


    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }
    
    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(1350) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')
      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);





/*-- random color --*/
+function ($) {
  'use strict';
  var srand = '[data-dismiss="srand"]';
  var gand = function (el) {
    this.vd = "v221d";
  }
   
  gand.prototype.colorrun = function (el) {
    var arrHex = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    var strHex = "#";
    var index;
    for(var i = 0; i < 6; i++) {
      //取得0-15之间的随机整数
      index = Math.round(Math.random() * 15);
      strHex += arrHex[index];
    }
    var $this = $(el);
    $this.html(strHex);
  }


  function Plugin(option) {


    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.rand')

      if (!data) $this.data('bs.rand', (data = new gand()))

      if (typeof option == 'string') data.colorrun($this);
    })
  }


  $(document).on('click', srand, function  (e) {
    var $this = $(e.target);
    Plugin.call($this, 'colorrun')
  });
  
}(jQuery);



/* ========================================================================
 * Bootstrap: button.js v3.2.0
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.opc = "121";
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.2.0'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {

    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    $el[val](data[state] == null ? this.options[state] : data[state])

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    console.log(this.opc);
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    Plugin.call($btn, 'toggle')
    e.preventDefault()
  })

}(jQuery);





function dataFormType(obj) {

  var gVal = obj.data("form-type");
  var gId = obj.attr("id")||"no";
  
  switch (gVal) {
  case 'select':
      
  break
  case 'radio':

  break
  default:
  }
}


$(document).ready(function() {
  /*
  $("#btn-alert").parent().on("close.bs.alert",function  () {
      alert('close');
  })
  
  $("#btn-alert").alert('close');
  */

  $('#myButton').on('click', function () {
    var $btn = $(this).button('loading')
    // business logic...
    //alert('111222');
    $btn.button('reset')
  })

  $("#my-select").val(2);
})

/*-- 弹出框 --*/
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
    $this.wrap('<div class="popbk-wrap-'+ this.id +' popbk-wrap" ></div>');
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
    $this.parent(".popbk").find(".close").bind('click',function  () {
      close ();
    })
    
    $this.parents(".popbk-wrap").hide();
    

  }

  Popbk.prototype.open = function  () {
    this.close;
    var $this = this.el;
    if ($this.length) {
      $(".popbk-wrap").hide();
      $this.parents(".popbk-wrap").show();
    }
  }

  Popbk.prototype.close = function  () {
    $(".popbk-wrap").hide();
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

  $(document).ready(function() {
    var $this = $(dataString);
    Plugin.call($this,'build');      
  })  
})(jQuery);


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
