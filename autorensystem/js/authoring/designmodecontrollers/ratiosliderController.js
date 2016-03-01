		var activeratio = "4:3";
		var ratiovalues = ["16:9", "16:10", "3:2", "4:3", "1:1", "3:4", "2:3", "10:16", "9:16"];

$(function() {
		$(".ratioslider").slider({min:0, max:8, orientation: "horizontal", step:1, value:3,
        // default properties
        create: function() {
            valueSlider = 0;
            scaleSlider = 0;
        },
		slide: function(event, ui) {
			aspectratio = ratiovalues[ui.value];
			$("#chosenratio").text( aspectratio );
		},
        change: function(event, ui) {
			var width = 0;
			var height = 0; 
			
			aspectratio = ratiovalues[ui.value];
			$("#chosenratio").text( aspectratio );
			//aspectratio = ratiovalues[ui.value] * 1;
			
			
			switch (ui.value) {
				case 0:
					width = 16;
					height = 9;
					break;
				case 1:
					width = 16;
					height = 10;
					break;
				case 2:
					width = 3;
					height = 2;
					break;
				case 3:
					width = 4;
					height = 3;
					break;
				case 4:
					width = 1;
					height = 1;
					break;
				case 5:
					width = 3;
					height = 4;
					break;
				case 6:
					width = 2;
					height = 3;
					break;
				case 7:
					width = 10;
					height = 16;
					break;
				case 8:
					width = 9;
					height = 16;
					break;
			}
			//aspectratio = 1 * aspectratio;
			//alert(aspectratio);
			
			aspectratio = width / height;
			resizegridcontainer();
			
			//$('#gridcontainer').data('ratiowidth', 123);
			//$('#gridcontainer').data('ratioheight', 1234);
			
			$('#gridcontainer').attr('data-ratiowidth', width);
			$('#gridcontainer').attr('data-ratioheight', height);
			
			//updateHTML();
			
			
        }})
        // add pips and label to slider
        .slider("pips", {first:"label", last:"label", labels:{"first":"-", "last":"+"}});
});		


function setratioslider(ratioWidth, ratioHeight) {
	activeratio = ratioWidth + ":" + ratioHeight;
	aspectratio = 1*(ratioWidth/ratioHeight);
	console.log("activatio: " + activeratio);
	var tempstepindex = $.inArray(activeratio, ratiovalues);
	console.log("Stepindex: " + tempstepindex);
	$(".ratioslider").slider( "option", "value", tempstepindex);
}