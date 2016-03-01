

// slider
var valueSlider, scaleSlider, diffSlider;

$(function() {
	var paddingvalues = ["1", "2", "3", "4", "5"];
    // slider properties and functionalities
    $(".paddingslider").slider({max:4, min:0, value:4, orientation: "horizontal", step:1,
        // default properties
        create: function() {
            valueSlider = 4;
            scaleSlider = 1;
        },
        // if slider is used, change size of all elements in working place

		slide: function(event, ui) {
			padding = paddingvalues[ui.value];
			$('#chosenpadding').text( padding );
			$('.gridelement').css('padding', padding/2+'%');
		},

        change: function(event, ui) {
			padding = paddingvalues[ui.value];
			$('.gridelement').css('padding', padding/2+'%');
        }})
        // add pips and label to slider
        .slider("pips", {first:"label", last:"label", labels:{"first":"-", "last":"+"}});
});



/*
		$('#pageoptionspadding').on('input',function(e){
			input = $(this).val();
			if ($.isNumeric(input)) {
				if ((input>0) && (input<100)) {
					$('.gridelement').css('padding', input+'%');
				}
			}
			
			//alert($(this).val());
		});
*/