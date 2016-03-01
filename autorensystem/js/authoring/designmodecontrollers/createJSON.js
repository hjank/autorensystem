	function createjson() {
		var gridJSON  = {};
		var grids = [];

		//var guiID  = "0"; // TODO;
		var unitID = currentUnitUUID;
		var ratioHeight 	= 	$('#gridcontainer').data('ratioheight'); // TODO-Rechtschreibung
		var ratioWidth 		= 	$('#gridcontainer').data('ratiowidth');
		var padding 		=   $('#gridcontainer').data('padding'); // TODO
		var idcounter 		=   $('#gridcontainer').data('idcounter');
		var border	 		= 	$('#gridcontainer').data('showborders');
		//var gridids 		= 	$('#gridcontainer').find('.gridelement');
		
		$('#gridcontainer').find('.gridelement').each(function(i) {
			//$(this).css('border','10px solid blue');
			var grid 	= {};
			/*
			grid.id 	= $(this).attr('id');
			grid.height = $(this).css('height');
			grid.width 	= $(this).css('width');
			grid.x 		= $(this).css('x');
			grid.y 		= $(this).css('y');
			*/
			
			grid.unitID = $(this).attr('id');
			grid.height = parseFloat($(this)[0].style.height);
			grid.width 	= parseFloat($(this)[0].style.width);
			grid.x 		= parseFloat($(this)[0].style.left);
			grid.y 		= parseFloat($(this)[0].style.top);
			
			var containingmedium = $(this).children();
			if ((containingmedium.hasClass('mediaelement'))) {
				var count = containingmedium.children().length;
				if (count>0) {
					grid.containsMedia = "yes";
				} else {
					grid.containsMedia = "preview";
				}
			} else {
				grid.containsMedia = "no";
			
			}
			
		//	if 
		//	grid.media  =  // yes, preview, false;
			
			
			var media = {};
			if (grid.containsMedia=="preview" || grid.containsMedia=="yes") {
				var mediatype 	= containingmedium.data('mediavalue');
				var properties = {};
				media.mediatype = mediatype;
				media.source ='';
				if (grid.containsMedia=="yes") {
					media.id = containingmedium.attr('id');
					if (mediatype == "video") {
						media.source = containingmedium.find('source').attr('src');
						properties.autoplay =  containingmedium.children().hasClass('autoplay');
						properties.controls =  containingmedium.children().hasClass('controls');
						properties.loop =  containingmedium.children().hasClass('loop');
						properties.muted =  containingmedium.children().hasClass('muted');
						//properties.fit = containingmedium.children()[0].style.object-fit;
						properties.fit = containingmedium.children().css('object-fit');
					}
					if (mediatype == "picture") {
						media.source = containingmedium.find('img').attr('src');
						properties.fit = containingmedium.children().css('object-fit');
					}
					if (mediatype == "sound") {
						media.source = containingmedium.find('source').attr('src');
						properties.autoplay =  containingmedium.children().hasClass('autoplay');
						properties.controls =  containingmedium.children().hasClass('controls');
						properties.loop =  containingmedium.children().hasClass('loop');
						properties.muted =  containingmedium.children().hasClass('muted');
					}
					if (mediatype == "text") {
						media.content = containingmedium.find('.textmediaoutput').html();
					}
				}
			} else {
				media.mediatype = "empty";
			}
			if (mediatype != "text") {
				media.properties = properties;
			}
			//parseFloat($('#'+element2)[0].style.width); 
			
			if ( media.mediatype != "empty") {
				grid.media 	= media;
			}
			
			grids.push(grid);
		});

		gridJSON.id 			= unitID;
		//gridJSON.refID 			= refID;
		gridJSON.ratioHeight 	= ratioHeight;
		gridJSON.ratioWidth  	= ratioWidth;
		gridJSON.padding 		= padding;
		gridJSON.border 		= border;
		gridJSON.grids			= grids;
		
		return JSON.stringify(gridJSON);
	}
	
	
	
	function sendguidata() {
		var data = createjson();	
		alert(data);
		$.ajax({
			type: 'POST',
			dataType: 'json',
			data: data,
			//data: JSON.stringify({"hallo":"ballo"}),
			contentType: 'application/json',
            url: 'http://localhost:3000/save',						
            success: function(data) {
                console.log('success');
                console.log(JSON.stringify(data));
            }
        });	
	}