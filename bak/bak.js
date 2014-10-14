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
	var obj = $(this);
	var defualts = {
			sdiv:"li",
			showbigimg: 'on',
			long: 'auto',
			wrapClass:'scollpic'
		};

	var opts = $.extend({},defualts,options);

	var wrap_obj=$('<div class="'+opts.wrapClass+'"></div>');
	wrap_obj.css({'position':'relative','height':opts.height});
	var longk = 0;
	var idbox = 0 ;
	//计算长度
	obj.each(function  () {
		//加载箭头
		if (opts.long == 'auto') {
			opts.long = $(this).find(opts.sdiv).width();
		}
		
		$(this).wrap(wrap_obj);
		var arrow_prev=$('<a href="javascript:void(0);" class="scrool-product-list-prev endprev st"><span class="v-h">prev</span></a>');
		var arrow_next=$('<a href="javascript:void(0);" class="scrool-product-list-next st"><span class="v-h">next</span></a>');
		$(this).parent().append(arrow_prev).append(arrow_next);
		$(this).wrap('<div class="scroll-warp" style="overflow:hidden;position:relative; height:'+opts.height+'px;"></div>');

	/* 长度小于一定数目时候不显示箭头
if ($(this).parents('.img_small').length > 0 && $(this).find('li').length < 6) {
			arrow_prev.hide();
			arrow_next.hide();
			$(this).parents('.scroll_warp').css('margin-left','0');
			return false;
		}


		if ($(this).find('li').length < 4) {
			arrow_prev.hide();
			arrow_next.hide();
			$(this).parents('.scroll_warp').css('margin-left','0');
			return true;
		}
*/
		arrow_prev.click(function  () {
			scoll('left',$(this).siblings('div'));
		});

		arrow_next.click(function  () {
			scoll('right',$(this).siblings('div'));
		});

		var obj_width=0;

		$(this).find(opts.sdiv).last().css("padding-right","0");
		$(this).find(opts.sdiv).each(function  () {			
			obj_width+=$(this).outerWidth();
		});
		longk = obj_width;
		$(this).css({'position':'absolute','width':obj_width});	
		

		//moblie tounch手机事件
		var currntp = 0;
		var pageX = 0;
		var ifchlick = false;
			
			$("."+opts.wrapClass).bind("touchstart",function  (e) {
				
				currntp = window.event.touches[0].pageX;
				ifchlick = true;
				e.preventDefault();
			});

		   $("."+opts.wrapClass).bind('touchend', function(e) {
			   if (pageX == 0) {
				   return false;
			   }
			   e.preventDefault();
				ifchlick = false;
				var width_step = 10;
				//alert(currntp+','+pageX);
				
				if ((Math.abs(currntp - pageX) >= width_step)) {
					if (currntp - pageX >= width_step) {
						arrow_next.trigger('click','one');
						
						//$(".show-pic .prev").trigger('click');
					} else {
						
						arrow_prev.trigger('click','one');
						//$(".show-pic .next").trigger('click');
					}
					
				}
				currntp = 0;
				pageX = 0;
				
			});

			$("."+opts.wrapClass).bind('touchmove', function(e) {
				e.preventDefault();
				if (ifchlick) {
					ifchlick = false;
					pageX = window.event.targetTouches[0].pageX;					
				}else {
					return false;
				}
			});
		
		//点击显示大图
		
		$(this).find(opts.sdiv).find("a").click(function  (e) {
			
			if (opts.showbigimg && (opts.showbigimg == 'off')) {
				
				return false;
			}else{

			


			if(ifload == true || $(this).parent().hasClass('current')){ return false;}
			idbox = obj.find(opts.sdiv+'.current').index();
			
			if ((idbox!= -1) && (idbox!= 0) && (idbox!= (obj.find(opts.sdiv).length-1))) {

				var idnow = $(this).parent().index();
				if (idbox>idnow) {
					arrow_prev.trigger('click');
				}else {
					arrow_next.trigger('click');
				}
			}

			$(this).parent().siblings('li').removeClass('current');
			$(this).parent().addClass('current');

			if (opts.loadvd) {
				opts.loadvd($(this));
				return false;
			}



			if (opts.ppscollcallbackVideo) {
				opts.ppscollcallbackVideo();
				return false;
			}

			if (opts.showbigimg) {
				show_img(opts.showbigimg,$(this).attr("href"),$(this));
			}
			
			e.preventDefault();

			}
		})
		function  checkend(objsc) {
			
			if (objsc.prev().length < 1) {
				arrow_prev.addClass("endprev");
			}else {
				arrow_prev.removeClass("endprev");
			}

			if (objsc.next().length < 1) {
				arrow_next.addClass("endnext");
			}else {
				arrow_next.removeClass("endnext");
			}

		}

		var ifload = false;
		var ajax_load = $('<div id="loading" class="loading yh"><i></i><span>加载中。。。</span></div>');
		//console.log(ajax_load);
		var show_img = function (obj,data,objlink) {
			var img = $('<img src="' + data + '" />');
			//obj.hide().attr('src', data).fadeIn();
			//console.log(img[0].complete);

			ajax_load.insertBefore(obj);
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
				if (opts.ppscollcallback) {
					opts.ppscollcallback(obj,objlink);
				}


				obj.hide().attr('src', data).fadeIn();
				
				ajax_load.detach();
				ifload = false;
				}).error(function(){
					ajax_load.detach();
					alert('很抱歉,加载失败');
					ifload = false;
				});
			}
		}

	});
	var scolllong = obj.width() - obj.parents().width() - 10;
	var that = $(this).parent().parent(); 
	//滚动函数
	function scoll(dir,obj) {
		if (dir=='right') {

			obj.animate({
				scrollLeft:'+='+opts.long
				//scrollLeft:longk-772
			},function  () {
				//console.log($(this).scrollLeft(),scolllong);
				if ($(this).scrollLeft() > scolllong) {
					that.find(".scrool-product-list-next").addClass("endnext");
				}else {
					
					that.find(".scrool-product-list-next").removeClass("endnext");
				}
				that.find(".scrool-product-list-prev").removeClass("endprev");

				if (opts.ppscollcallbackCount) {
					opts.ppscollcallbackCount(obj,Math.abs(obj.scrollLeft()/opts.long));
					return false;
				}
			});
		}
		if (dir=='left') {
			obj.animate({
				scrollLeft:'-='+opts.long
				//scrollLeft:0
			},function  () {
				
				if ($(this).scrollLeft() < 1) {
					that.find(".scrool-product-list-prev").addClass("endprev");
				}else {
					
					that.find(".scrool-product-list-prev").removeClass("endprev");
				}
				that.find(".scrool-product-list-next").removeClass("endnext");
				if (opts.ppscollcallbackCount) {
					opts.ppscollcallbackCount(obj,Math.abs(obj.scrollLeft()/opts.long));
					return false;
				}
			});
		}
	}

	

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



 /** 
* extend 图片滚动插件(无大图)
* 
* @package scbanner
* @author cuki13
	var sl = $('#slider1').scbanner({
		showType: 'scroll',
		scrollWidth: 1680,
		loop: true
	});


*/
;(function($){  
	$.fn.scbanner = function (options) {  
		var defualts = { 
			scrollWidth: 980,     //滚动距离
			warpcss: 'banner1', //外部包含CSS
			auto:	true,     //是否自动,
			speed:	5000,     //间隔5秒
			showType: 'scroll',
			slderafter : function  () {
			},
			loop:false
			
		};  
		var opts = $.extend({}, defualts, options);  
		var obj = $(this);

		//生成控制器
		obj.wrap('<div class="'+opts.warpcss+'"></div>');
		//如果循环
		if (opts.loop == true) {
			var cprev = obj.find('li').first().clone().addClass("clone");
			var cnext = obj.find('li').last().clone().addClass("clone");
			obj.append(cprev);
			obj.prepend(cnext);
		}
		//生成页码
		function  nav(obj) {
			var nav_html = '<div class="banner-nav">';
			for (var i = 0; i < obj.find('li').length; i++) {
				nav_html += '<a class="'+(i == 0 ? 'current' : '')+' sort-'+ i +' " data="'+i+'" href="javascript:void(0);"><span>'+(i+1)+'</span></a>';
			}
			nav_html += '</div>';
			return nav_html;
		}

		
		

		obj.css('width',opts.scrollWidth*obj.find('li').length);
		var timecount = '';

		

		var nav=$(nav(obj));
		var lgnav = nav.length;
		
		
		nav.find('a').click(function  (e) {
			if ($(this).hasClass('current')) {
				return false;
			}else {
				var w = $(this).attr('data');
				var that = $(this);
				obj_scroll(obj,-w,opts.showType,function  () {
					
					that.siblings('.current').removeClass('current'); 
					that.addClass('current');
					if (opts.slderafter) {
						
						var ind = that.attr("data");
						var gli = obj.find('li').eq(ind);
						opts.slderafter(gli);
						
					}
					
					if (opts.showType == 'fade') {
						return false;
					}
					
					

					if (w == '0') {
						
						opts.showType = 'noanmate';
						
						var gind = nav.find("a").length-2;
						nav.find("a").eq(gind).trigger('click');
						opts.showType = 'scroll';
						
					}

					if (w == nav.find("a").length - 1 ) {						
						opts.showType = 'noanmate';
						nav.find("a").eq(1).trigger('click');
						opts.showType = 'scroll';
					}

				});
				
			}
			e.preventDefault();	
		})
		var wpauto = true;
		//自动滚动函数

		obj.parent().parent().delegate('.'+opts.warpcss,'mouseenter',function  () {
				wpauto = false;
				clearInterval(timecount);
			}).delegate('.'+opts.warpcss,'mouseleave',function  () {
				wpauto = true;
					timecount = setInterval(function  () {
					loop_main();
				}, opts.speed);
		})

		function loop_main() {
			if (wpauto) {
				click_next();
			}
		}
		//循环
		timecount = setInterval(function  () {
			loop_main();
		}, opts.speed);
		
		function click_next() {
			var n = nav.find('a.current').next();
			if (n.length > 0) {
				n.trigger('click');
			}else {
				if (opts.loop == false){
				nav.find('a').eq(0).trigger('click');
				}
			}
		}

		function click_prev() {
			var n = nav.find('a.current').prev();
			if (n.length > 0) {
				n.trigger('click');
			}else {
				if (opts.loop == false){
				nav.find('a').last().trigger('click');
				}
			}
		}

		
		
		//moblie tounch
		var currntp = 0;
		var pageX;
		var ifchlick = false;
		
		$("."+opts.warpcss).bind("touchstart",function  (e) {
			$("."+opts.warpcss).trigger("mouseenter");
			currntp = window.event.touches[0].pageX;
			ifchlick = true;
		});

	   $("."+opts.warpcss).bind('touchend', function(e) {
			ifchlick = false;
			var width_step = 5;
			if (Math.abs(currntp - pageX) >= width_step) {
				if (currntp - pageX >= width_step) {
					click_prev();
					//$(".show-pic .prev").trigger('click');
				} else {
					click_next();
					//$(".show-pic .next").trigger('click');
				}
				$("."+opts.warpcss).trigger("mouseleave");
			}
		});

		$("."+opts.warpcss).bind('touchmove', function(e) {
			if (ifchlick) {
				ifchlick = false;
				pageX = window.event.targetTouches[0].pageX;					
			}else {
				return false;
			}
		});
		
		nav.insertAfter(obj);

		//显示
		function obj_scroll(obj,w,type,callback) {
			switch (type) {
			case 'scroll':
				
				obj.stop().animate({'left':opts.scrollWidth*w},800,'easeInOutExpo',function  () {
					if (callback) {
						callback();
					}
				});
			break
			case 'fade':
				/*
				obj.css({'left':opts.scrollWidth*w}).hide().fadeIn(function  () {
					if (callback){
						callback();
					}
				});
				*/
				
			case 'noanmate':
				
				obj.stop().css({'left':opts.scrollWidth*w});
					if (callback) {
						callback();
					}
			break
			default:
			}
		}

		if (opts.loop == true) {
			opts.showType = 'noanmate';
			nav.find("a").eq(1).trigger('click');
		
			opts.showType = 'scroll';
		}
		
		var contr = {
			"prev": function  () {
				click_prev();
			},
			"next": function  () {
				click_next();
			},
			"scroll": function  (val) {
				wpauto = val;
				if (val == 'false') {
					wpauto = false;
					clearInterval(timecount);
				}
				
			}
			
		}
		
		return contr;
	};  
})(jQuery);



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
			objshow: obj.find('.c1'),			//展示的区域 
			taglink: obj.find('.c2 a'),			//点击链接
			current_class: 'current'			//当前的样式
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

//ctx.globalCompositeOperation = 'destination-out';
//ctx.globalCompositeOperation = 'source-out';

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
* extend 绝对定位
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
* extend 图片滚动插件(CSS3滚动)
* 
* @package jquery
* @author cuki13



*/
+(function($){

$.fn.scollpic= function (options) {
	var obj = $(this);
	var defualts = {
			sdiv:"li",
			showbigimg: 'off',
			long: 'auto',
			wrapClass:'scollpic'
		};
	var gtras = 0;
	var opts = $.extend({},defualts,options);

	var wrap_obj=$('<div class="'+opts.wrapClass+'"></div>');
	wrap_obj.css({'position':'relative','height':opts.height});
	var longk = 0;
	var idbox = 0 ;
	//计算长度
	obj.each(function  () {
		//加载箭头
		if (opts.long == 'auto') {
			opts.long = $(this).find(opts.sdiv).width();
		}
		
		$(this).wrap(wrap_obj);
		var arrow_prev=$('<a href="javascript:void(0);" class="scrool-product-list-prev endprev st"><span class="v-h">prev</span></a>');
		var arrow_next=$('<a href="javascript:void(0);" class="scrool-product-list-next st"><span class="v-h">next</span></a>');
		$(this).parent().append(arrow_prev).append(arrow_next);
		$(this).wrap('<div class="scroll-warp" style="overflow:hidden;position:relative; height:'+opts.height+'px;"></div>');

	/* 长度小于一定数目时候不显示箭头
if ($(this).parents('.img_small').length > 0 && $(this).find('li').length < 6) {
			arrow_prev.hide();
			arrow_next.hide();
			$(this).parents('.scroll_warp').css('margin-left','0');
			return false;
		}


		if ($(this).find('li').length < 4) {
			arrow_prev.hide();
			arrow_next.hide();
			$(this).parents('.scroll_warp').css('margin-left','0');
			return true;
		}
*/
		
		arrow_prev.click(function  (e) {
			
			scoll('left',$(this).siblings('div'));
		});

		arrow_next.click(function  () {
			scoll('right',$(this).siblings('div'));
		});

		var obj_width=0;

		$(this).find(opts.sdiv).last().css("padding-right","0");
		$(this).find(opts.sdiv).each(function  () {			
			obj_width+=140;
		});
		longk = obj_width;
		$(this).css({'position':'absolute','width':obj_width});	
		

		//moblie tounch
		/*
		var currntp = 0;
		var pageX = 0;
		var ifchlick = false;
			
			$("."+opts.wrapClass).bind("touchstart",function  (e) {
				
				currntp = window.event.touches[0].pageX;
				ifchlick = true;
				e.preventDefault();
			});

		   $("."+opts.wrapClass).bind('touchend', function(e) {
			   if (pageX == 0) {
				   return false;
			   }
			   e.preventDefault();
				ifchlick = false;
				var width_step = 10;
				//alert(currntp+','+pageX);
				
				if ((Math.abs(currntp - pageX) >= width_step)) {
					if (currntp - pageX >= width_step) {
						arrow_next.trigger('click','one');
						
						//$(".show-pic .prev").trigger('click');
					} else {
						
						arrow_prev.trigger('click','one');
						//$(".show-pic .next").trigger('click');
					}
					
				}
				currntp = 0;
				pageX = 0;
				
			});
			*/

			$("."+opts.wrapClass).bind('touchmove', function(e) {
				e.preventDefault();
				if (ifchlick) {
					ifchlick = false;
					pageX = window.event.targetTouches[0].pageX;					
				}else {
					return false;
				}
			});

		
		/*
		function getCenter (objlk) {
			
			var wid = $(window).width();
			
			if (wid > 420) {
				return false;
			}
			var centerpos = wid - 140;
			centerpos = centerpos/2; 
			var trlong = centerpos - objlk.offset().left - Math.abs(gtras);
			console.log(trlong,gtras);
			gtras = trlong;
			$("#imglist").css({
				"transition" : "0.5s",
				"transform" : "translateX("+ trlong +"px)"
			})
			
		}
		*/
		$("#imglist").css({
				"transition" : "0.5s"
		})
		function getCenter (objlk) {
			
			var wid = $(window).width();
			
			if (wid > 700) {
				return false;
			}
			var centerpos = wid - 140;
			centerpos = centerpos/2; 
			var trlong = objlk.offset().left - centerpos;
						
			$("#imglist").css({
				"transform" : "translateX("+ (gtras - trlong) +"px)"
			})
			gtras = gtras - trlong;
			
		}
		
		//点击显示大图
		
		$(this).find(opts.sdiv).find("label").click(function  (e) {
			
			if (opts.showbigimg && (opts.showbigimg == 'off')) {
				$(this).find("input").attr("checked","checked").change();
				return true;
			}else{
			if(ifload == true || $(this).parent().hasClass('current')){ return true;}
			idbox = obj.find(opts.sdiv+'.current').index();
			var idnow = $(this).parent().index();
			if (idbox>idnow) {
				//arrow_prev.trigger('click');
			}else {
				//arrow_next.trigger('click');
			}
			
			$(this).find("input").attr("checked","checked").change();

			$(this).parent().siblings('li').removeClass('current');
			$(this).parent().addClass('current');
			
			getCenter($(this));

				return false;
			if (opts.loadvd) {
				opts.loadvd($(this));
				return true;
			}



			if (opts.ppscollcallbackVideo) {
				opts.ppscollcallbackVideo();
				return true;
			}

			if (opts.showbigimg) {
				show_img(opts.showbigimg,$(this).attr("rel"),$(this));
				return true;
			}
				
			
			

			}
		})
		function  checkend(objsc) {
			
			if (objsc.prev().length < 1) {
				arrow_prev.addClass("endprev");
			}else {
				arrow_prev.removeClass("endprev");
			}

			if (objsc.next().length < 1) {
				arrow_next.addClass("endnext");
			}else {
				arrow_next.removeClass("endnext");
			}

		}

		var ifload = false;
		var ajax_load = $('#loading');
	
		var show_img = function (obj,data,objlink) {
			var img = $('<img src="' + data + '" />');
			//obj.hide().attr('src', data).fadeIn();
			//console.log(img[0].complete);

			ajax_load.show();
			ifload = true;
			
			if (img[0].complete) {
				if (opts.ppscollcallback) {
					opts.ppscollcallback(obj,objlink);
				}
				obj.hide().attr('src', data).fadeIn();
				ajax_load.hide();
				ifload = false;

			}else {
				img.load(function  () {
				if (opts.ppscollcallback) {
					opts.ppscollcallback(obj,objlink);
				}


				obj.hide().attr('src', data).fadeIn();
				
				ajax_load.hide();
				ifload = false;
				}).error(function(){
					ajax_load.hide();
					alert('很抱歉,加载失败');
					ifload = false;
				});
			}
		}

	});
	var scolllong = obj.width() - obj.parents().width() - 10;
	var that = $(this).parent().parent(); 
	//滚动函数

	var goscoll= true;
	function scoll(dir,obj) {
		/*
		if (goscoll == false) {
			return false;
		}

		goscoll = false;
		*/
		var wid = $(window).width();
		

		if (dir=='right') {
			if (gtras < (obj.find("li").length*(-140) + wid)) {
        return false;
      }
			$("#imglist").css({
				"transform" : "translateX("+ (gtras - 140) +"px)"
			})
			gtras = gtras - 140;
			return false;
			obj.animate({
				scrollLeft:'+='+opts.long
				//scrollLeft:longk-772
			},function  () {
				//console.log($(this).scrollLeft(),scolllong);
				if ($(this).scrollLeft() > scolllong) {
					that.find(".scrool-product-list-next").addClass("endnext");
				}else {
					
					that.find(".scrool-product-list-next").removeClass("endnext");
				}
				that.find(".scrool-product-list-prev").removeClass("endprev");

				if (opts.ppscollcallbackCount) {
					opts.ppscollcallbackCount(obj,Math.abs(obj.scrollLeft()/opts.long));
					return false;
				}

				goscoll = true;
			});
		}
		if (dir=='left') {
      if (gtras >= 0) {
        return false;
      }
			$("#imglist").css({
				"transform" : "translateX("+ (gtras + 140) +"px)"
			})
			gtras = gtras + 140;
			return false;
			obj.animate({
				scrollLeft:'-='+opts.long
				//scrollLeft:0
			},function  () {
				
				if ($(this).scrollLeft() < 1) {
					that.find(".scrool-product-list-prev").addClass("endprev");
				}else {
					
					that.find(".scrool-product-list-prev").removeClass("endprev");
				}
				that.find(".scrool-product-list-next").removeClass("endnext");
				if (opts.ppscollcallbackCount) {
					opts.ppscollcallbackCount(obj,Math.abs(obj.scrollLeft()/opts.long));
					return false;
				}

				goscoll = true;
			});
		}
	}

	

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
function dataFormType(obj) {

	var gVal = obj.data("form-type");
	var gId = obj.attr("id")||"no";
	
	switch (gVal) {
	case 'select':
		obj.css("opacity","0");	    
		obj.wrap("<span class='selectstyle'></span>");
		var gettxt = '<span class="val textb" >'+obj.find("option:eq(0)").html()+'<i class="none"></i></span>';
		gettxt = $(gettxt);				
		gettxt.insertBefore(obj);
		//gettxt.width(obj.width());
		//obj.parents(".selectstyle").width(obj.width()).addClass("select-"+ind);
		obj.parents(".selectstyle").addClass("select-"+ gId);
		obj.bind("change changeval",function  () {
			var vl = $(this).find("option:selected").html();
			$(this).prev('.val').html(vl);
			$(this).parents(".selectstyle").find('.val').html(vl);
		})
		obj.trigger('changeval');				
	break
	case 'radio':
		var setCss = {
			"opacity":"0",
			"position":"absolute"
		}
		obj.css(setCss);
		var idiv = $('<i></i>');
		idiv.insertBefore(obj);
		obj.parent("label").css("position","relative");
		obj.bind("change changeval",function  () {			
				$(this).parent("label").addClass("ck-select").siblings("label").removeClass("ck-select");			
		});
	break
	default:
	}
}


/** 
* extend 弹出框
* @author cuki13
	$(obj).popbk();
	.popbk-wrap {position: fixed; top: 0; left: 0; bottom: 0; right: 0; overflow: auto; z-index:100;}
	.popbk {position: absolute; top:0; left:50%;}
	.popbk .close {position:absolute;right:0;top:0;}

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



/** 
* extend css3过度效果
* @author cuki13
*/
function anim(obj,className,callBack){
	obj.removeClass().addClass(className + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			if (callBack) {
				callBack();
			}
	});

}


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
					//clonetb.find("tr:eq(0)").siblings().remove();
					
					obj.wrap('<div class="fixhead-box"></div>');
					obj.wrap('<div class="fixhead-ct"></div>');
					
					
					clonetb.insertBefore(obj.parent());
					clonetb.wrap('<div class="fixhead-hd"></div>');
					obj.find("tr").last().find("td").css("border-bottom","0");
					
					
				}
			})

			
		}

		
/* 随机颜色 */
	function randomColor() {
		//16进制方式表示颜色0-F
		var arrHex = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
		var strHex = "#";
		var index;
		for(var i = 0; i < 6; i++) {
			//取得0-15之间的随机整数
			index = Math.round(Math.random() * 15);
			strHex += arrHex[index];
		}
		return strHex;
	}


/* 几秒后返回 
subTime(obj,count);
*/
var getId404=document.getElementById("sec_404");
function subTime (obj,num_g) {		
	if (num_g==0) {
		window.location.href='http://www.lanye.com.au/';
	}else {
		var n=num_g-1;
		obj.html(n);
		setTimeout(function  () {subTime(n);},1000);
	}
}

/* 移动端版本兼容 */
(function(){
	var dfWidth = 640;
	var phoneWidth = parseInt(window.screen.width),
		phoneScale = phoneWidth/dfWidth,
		ua = navigator.userAgent;

	if (/Android (\d+\.\d+)/.test(ua)){
		var version = parseFloat(RegExp.$1);
		// andriod 2.3
		if(version > 2.3){
			document.write('<meta name="viewport" content="width='+dfWidth+', minimum-scale = '+phoneScale+', maximum-scale = '+phoneScale+', target-densitydpi=device-dpi">');
		// andriod 2.3以上
		}else{
			document.write('<meta name="viewport" content="width='+dfWidth+', target-densitydpi=device-dpi">');
		}
		// 其他系统
	} else {
		document.write('<meta name="viewport" content="width='+dfWidth+', user-scalable=no, target-densitydpi=device-dpi">');
	}
})();


	

