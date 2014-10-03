<?php $page="home";$title="首页"; include("inc/header.php"); ?>
<div class="container">
	<div class="row">
		<div class="col-md-9">
			<button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">
		      Launch demo modal
		    </button>

			<!-- Modal -->
			<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			  <div class="modal-dialog">
				<div class="modal-content">
				  <div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
					<h4 class="modal-title" id="myModalLabel">Modal title</h4>
				  </div>
				  <div class="modal-body">
					...
				  </div>
				  <div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary">Save changes</button>
				  </div>
				</div>
			  </div>
			</div>

			<div id="opv">
				<div class="dropdown">
				  <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Dropdown trigger
				   <span class="caret"></span>
				  </button>
				  <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">
					<li><a href="#">1111</a></li>
					<li><a href="#">2222</a></li>
					<li><a href="#">3333</a></li>
				  </ul>
				</div>
			</div>

			<button type="button" class="btn tipbin btn-default" data-toggle="tooltip" data-placement="left" title="Tooltip on left">Tooltip on left</button>

			<button type="button" class="btn tipbin btn-default" data-toggle="tooltip" data-placement="right" title="Tooltip on left">Tooltip on left</button>


			<button type="button" class="btn-pop btn btn-lg btn-danger" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?">Click to toggle popover</button>

			<div class="btn-group" data-toggle="buttons">
			  <label class="btn btn-primary active">
				<input type="checkbox" autocomplete="off" checked> Checkbox 1 (pre-checked)
			  </label>
			  <label class="btn btn-primary">
				<input type="checkbox" autocomplete="off"> Checkbox 2
			  </label>
			  <label class="btn btn-primary">
				<input type="checkbox" autocomplete="off"> Checkbox 3
			  </label>
			</div>

			<form class="form-inline" role="form">
			  <div class="form-group">
				<label class="sr-only" for="exampleInputEmail2">Email address</label>
				<input type="email" class="form-control" id="exampleInputEmail2" placeholder="Enter email">
			  </div>
			  <div class="form-group">
				<div class="input-group">
				  <div class="input-group-addon">@</div>
				  <input class="form-control" type="email" placeholder="Enter email">
				</div>
			  </div>
			  <div class="form-group">
				<label class="sr-only" for="exampleInputPassword2">Password</label>
				<input type="password" class="form-control" id="exampleInputPassword2" placeholder="Password">
			  </div>
			  <div class="checkbox">
				<label>
				  <input type="checkbox"> Remember me
				</label>
			  </div>
			  <button type="submit" class="btn btn-default">Sign in</button>
			</form>


			<div id="pop">
				fdsjflajds fdsafkljas f fdskljas f
			</div>

		</div>
	</div>
</div>





<?php include("inc/footer.php"); ?>


	