<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=Edge">

<meta name="renderer" content="webkit">
<meta name="description" content="">
<meta name="author" content="cuki13">
<!-- 移动mate
<meta name="apple-mobile-web-app-capable" content="yes">  
<meta name="apple-mobile-web-app-status-bar-style" content="black"> 
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"> 
-->


<title><?php if(isset($title)){echo $title;} ?></title>
<!-- <link rel="icon" href="images/favicon.ico">-->
<!-- <link rel="stylesheet" href="css/reset.css" /> -->
<!-- <link rel="stylesheet" href="css/animate.css" /> -->
<link rel="stylesheet" href="css/bootstrap.css" />
<link rel="stylesheet" href="css/style.css" /> 
<script type="text/javascript">
<!--
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
//-->
</script>
<script src="js/jquery.js"></script>

<!-- <script src="js/bootstrap.min.js"></script> -->
<script src="js/script.js"></script>

<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
   <script src="js/html5.min.js"></script>
   <script src="js/respond.js"></script>
<![endif]-->
<!--[if IE 8]>
	<link href="css/ie.css" rel="stylesheet" media="all" type="text/css" />
<![endif]-->


<!--[if lt IE 8]>
	<link href="css/ie.css" rel="stylesheet" media="all" type="text/css" />
<![endif]-->
<!--[if IE 6]>
	<script type="text/javascript" src="js/DD_belatedPNG_0.0.8a.js"></script>
	<script type="text/javascript">
		//<![CDATA[
		DD_belatedPNG.fix('.png');
		//]]></script>
<![endif]-->
	<?php
	    //加载less
		require "less.php/lessc.inc.php";
		$less = new lessc;		
		$less->checkedCompile("less/bootstrap.less", "css/bootstrap.css");
		$less->checkedCompile("less/style.less", "css/style.css");
		$less->checkedCompile("less/ie.less", "css/ie.css");
	?>
</head>

<body class="<?php if(isset($page)){echo $page;} ?>">
<noscript>
   
    <strong>你的浏览器似乎禁用了 JavaScript。</strong><br />您必须在浏览器中启用JavaScript才能使用本网站的功能。
  
</noscript>