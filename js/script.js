var fc = {


	  popbk:{
		init:function  (obj,i) {
				obj.wrap('<div class="popbk-wrap-'+i+' popbk-wrap" style="position: fixed; top: 0; left: 0; bottom: 0; right: 0; overflow: auto; z-index:100;"></div>');
				obj.wrap('<div class="popbk-'+i+' popbk" style="position: absolute; top:0; left:50%;"></div>');
				var sClose = "<a class='close' style='position:absolute;right:0;top:0;'><span class='none'>close</span></a>";
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
					fc.popbk.hide();
				})
				
				obj.parents(".popbk-wrap").hide();
		  },
		open:function  (obj,i) {
			  if (obj.length) {
				  $(".popbk-wrap").hide();
				  obj.parents(".popbk-wrap").show();
			  }
		},
		hide:function  () {
			  $(".popbk-wrap").hide();
		}
	  
	  },
	  anim:function  (obj,className,callBack) {
		obj.removeClass().addClass(className + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			if (callBack) {
				callBack();
			}
		});
	  }
	  

}


$(document).ready(function() {
	//dong something
})



