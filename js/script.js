/*-- random color --*/
+function ($) {
  'use strict';
  var srand = '[data-dismiss="srand"]';
  var Rand   = function (el) {

    $(this).html(randomColor());
  }
   

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

  $(document).on('click.bs.alert.data-api', srand, Rand);
  
}(jQuery);


$(document).ready(function() {
  $("#btn-alert").parent().on("close.bs.alert",function  () {
      alert('close');
  })
  
  $("#btn-alert").alert('close');

})
