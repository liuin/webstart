<?php $page="home";$title="首页"; include("inc/header.php"); ?>

<div class="container">
  <input type="radio" id="" name="rad1" class="ckiput" />1<br />
  <input type="radio" id="" name="rad1" class="ckiput" />2<br />
  <input type="radio" id="" name="rad1" class="ckiput" />3<br />
  <input type="radio" id="" name="rad1" class="ckiput" />4<br />
  <input type="radio" id="" name="rad1" class="ckiput" />5
</div> <!-- /container -->

<script type="text/javascript">
<!--
  $(document).ready(function() {
    $(".ckiput").eq(2).prop('checked',true);
  })
//-->
</script>