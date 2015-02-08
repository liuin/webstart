
<script type="text/javascript">
  var a = 1;
  function  animate1() {
    console.log(a++);
    window.webkitRequestAnimationFrame(animate1);
  }

</script>