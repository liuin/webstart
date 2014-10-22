<?php $page="home";$title="首页"; include("inc/header.php"); ?>
<style type="text/css">
  .alert {
    padding:1em;
    border:1px solid #000;
  }
  .active {
    background:red;
  }
</style>
<div class="container">
  <div class="row">
    <div class="col-md-9">
      <div class="alert">
        <button id="btn-alert" data-dismiss="alert"><span>button</span></button>
        <button type="button" class="btn btn-primary" data-toggle="button" autocomplete="off">
          Single toggle
        </button>
        
      </div>

      <span class="color" data-dismiss="srand">color</span>
      <span class="color" data-dismiss="srand">color</span>
    </div>
  </div>
</div>



<?php include("inc/footer.php"); ?>