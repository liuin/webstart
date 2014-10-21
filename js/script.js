/** 
* extend 弹出框
* @author cuki13
  
  

*/
+(function($){  
  var i = 0;
  $.fn.popbk = function (options) {
    var obj=$(this);
    var defualts = {
      
    };
    var opts = $.extend({}, defualts, options);  
    

    obj.wrap('<div class="popbk-wrap-'+i+' popbk-wrap" ></div>');
    obj.wrap('<div class="popbk-'+i+' popbk" ></div>');
    i++;
    var sClose = "<a class='close'><span class='none'>close</span></a>";
    sClose = $(sClose);
    sClose.insertAfter(obj);
    var ml = obj.width()/2;     
    obj.parent(".popbk").css("margin-left",-ml);
    
    var wh = obj.height();
    if ($(window).height < wh) {
      obj.parent(".popbk").css("top","30px");
    }else {
      obj.parent(".popbk").css({
        "margin-top":-wh/2,
        "top":'50%'
      });
    }
    obj.parent(".popbk").find(".close").bind('click',function  () {
      close ();
    })
    
    obj.parents(".popbk-wrap").hide();
    
    function open() {
      close ();
      if (obj.length) {
          $(".popbk-wrap").hide();
          obj.parents(".popbk-wrap").show();
      }
    }

    function close () {
      $(".popbk-wrap").hide();
    }

    return {
      "open": function  () {
        open();
      },
        
      "close":function  () {
        close();
      }
        
      
    
    }

  };  
})(jQuery);


$(document).ready(function() {
  //dong something
  //var pop = $("#pop").popbk();
  //pop.open();
  
  
  
})



