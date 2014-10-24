<?php $page="home";$title="首页"; include("inc/header.php"); ?>
<style type="text/css">
  .alert {
    padding:1em;
    border:1px solid #000;
  }
  .active {
    background:red;
  }

  .selectstyle {position:relative; border:1px solid #ccc; height:30px;display:inline-block;line-height:30px; width:100px; overflow:hidden;}
  .selectstyle select {position:absolute;left:0; top:0px; height:30px; margin:0; padding:0; width:100%; height:38px; }
  .selectstyle .val {display:block;}

  label {
    display:inline-block;
    width:50px;
    height:50px;
    background:red;
  }
  .ck-select {
    background:#f60;
  }
</style>
<div class="container">
  <div class="row">
    <div class="col-md-9">
      <div class="alert">
        <div class="fade in">
          <button id="btn-alert" data-dismiss="alert"><span>button</span></button>
        </div>
        <button type="button" class="btn btn-primary" data-toggle="button" autocomplete="off">
          Single toggle
        </button>
        <select name="" data-form="select" id="my-select">
          <option value="1">select1</option>
          <option value="2">select2</option>
          <option value="3">select3</option>
          <option value="4">select4</option>
        </select>

        <select name="" data-form="select" id="my-select1">
          <option value="1">select1</option>
          <option value="2">select2</option>
          <option value="3">select3</option>
          <option value="4">select4</option>
        </select>
        
        <div>
          <label for="rd1"><input data-form="radio" type="radio" value="1" name="rd1" id="rd1" /></label>
          <label for="rd2"><input data-form="radio" type="radio" value="2" name="rd1" id="rd2" /></label>
          <label for="rd3"><input data-form="radio" type="radio" value="3" name="rd1" id="rd3" /></label>
        </div>

      </div>

      <span class="color" data-dismiss="srand">color</span>
      <span class="color" data-dismiss="srand">color</span>
    </div>
  </div>
</div>


<div id="popbk1" data-box="popbk">
  <h3>popk1</h3>
  <p>
    text text text text
  </p>
</div>

<div id="popbk2" data-box="popbk">
  <h3>popk1</h3>
  <p>
    text text text text
  </p>
</div>


<?php include("inc/footer.php"); ?>