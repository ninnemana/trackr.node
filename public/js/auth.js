$(function(){

	var validate = function(focus){
		var errors = new Array();
		$('form.in div.alert').remove();

		// Check for empty fields
		if($('#p1').val().length === 0){
			errors.push('Password is required');
			$('#p1').addClass('error');
			if(focus){
				$('#p1').focus();
			}
		}else{
			$('#p1').removeClass('error');
		}

		if($('#p2').val().length === 0){
			errors.push('Password must be confirmed');
			$('#p2').addClass('error');
			if(focus){
				$('#p2').focus();
			}
		}else{
			$('#p2').removeClass('error');
		}

		if($('#p1').val() !== $('#p2').val()){
			errors.push('Passwords do not match');
			$('#p1').addClass('error');
			$('#p2').addClass('error');
			if(focus){
				$('#p2').focus();
			}
		}

		if($('#email').val().length === 0){
			errors.push('E-mail is required');
			$('#email').addClass('error');
			if(focus){
				$('#emai').focus();
			}
		}else{
			$('#email').removeClass('error');
		}

		if($('#nick').val().length === 0){
			errors.push('Nickname is required');
			$('#nick').addClass('error');
			if(focus){
				$('#nick').focus();
			}
		}else{
			$('#nick').removeClass('error');
		}
		return errors;
	};

	$(document).on('keyup','form.in input[type=text],form.in input[type=email],form.in input[type=password]',function(){
		validate(false);
	});

	$(document).on('click','#btnCreate',function(){
		var errors = validate(true);
		if(errors.length > 0){
			var err_box = '<div class="alert alert-error"><button data-dismiss="alert" class="close">x</button><strong>Crap!</strong> You forgot something, I hate it when that happens</div>';
			$('form.in').prepend(err_box);
			return false;
		}else{
			var loader = '<div class="progress progress-striped active"><div class="bar" style="width:100%"></div></div>';
			$(this).hide();
			$('form.in').append(loader);
			//return true;
		}
	});

});