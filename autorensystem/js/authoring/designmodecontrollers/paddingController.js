		
		
	$( document ).ready(function() {	
		$('#pageoptionspadding').on('input',function(e){
			input = $(this).val();
			if ($.isNumeric(input)) {
				if ((input>0) && (input<100)) {
					$('.gridelement').css('padding', input+'%');
					$('.gridcontainer').data('gridpadding', input);
					updateHTML();
				}
			}
			$('#gridelement').data('padding', 'input');
			//alert($(this).val());
		});
	});
	
	
	function unifypadding() {
		var padding = $('.gridcontainer').data('gridpadding');
		$('.gridelement').css('padding', input+'%');
	}
	
	
