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
