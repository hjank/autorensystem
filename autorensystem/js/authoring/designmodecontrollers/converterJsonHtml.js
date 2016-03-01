function grid2json () {
		var gridJSON  = {};
		var grids = [];

		//var guiID  = "0"; // TODO;
		var unitID = currentUnitUUID;
		var ratioHeight 	= 	$('#gridcontainer').data('ratioheight'); // TODO-Rechtschreibung
		var ratioWidth 		= 	$('#gridcontainer').data('ratiowidth');
		
			
		//var ratioHeight 	= 	$('#gridcontainer').attr('data-ratioheight'); // TODO-Rechtschreibung
		//var ratioWidth 		= 	$('#gridcontainer').attr('data-ratiowidth');
		
		console.log("HEIGHT AND WIDTH: " + ratioHeight + ' ' + ratioWidth);
		
		var padding 		=   $('#gridcontainer').data('padding'); // TODO
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
			
			grid.id = $(this).attr('id');
			grid.height = parseFloat($(this)[0].style.height);
			grid.width 	= parseFloat($(this)[0].style.width);
			grid.x 		= parseFloat($(this)[0].style.left);
			grid.y 		= parseFloat($(this)[0].style.top);
			
			var containingmedium = $(this).find('.mediaelement');
			console.log("find mediaelement: " + containingmedium.attr('id'));
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
			
			
			var media = {};
			if (grid.containsMedia=="preview" || grid.containsMedia=="yes") {
				var mediatype 	= containingmedium.data('mediavalue');
				var properties = {};
				media.mediatype = mediatype;
				media.source ='';
				media.id = containingmedium.attr('id');
				if (grid.containsMedia=="yes") {
					if (mediatype == "video") {
						media.source = containingmedium.find('source').attr('src').replace(/\/uploads\//, "");
						properties.autoplay =  containingmedium.children().hasClass('autoplay');
						properties.controls =  containingmedium.children().hasClass('controls');
						properties.loop =  containingmedium.children().hasClass('loop');
						properties.muted =  containingmedium.children().hasClass('muted');
						//properties.fit = containingmedium.children()[0].style.object-fit;
						properties.fit = containingmedium.children().css('object-fit');
					}
					if (mediatype == "picture") {
						media.source = containingmedium.find('img').attr('src').replace(/\/uploads\//, "");
						properties.fit = containingmedium.children().css('object-fit');
					}
					if (mediatype == "sound") {
						media.source = containingmedium.find('source').attr('src').replace(/\/uploads\//, "");
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

		gridJSON.unitid 		= unitID;
		//gridJSON.refID 			= refID;
		gridJSON.ratioHeight 	= ratioHeight;
		gridJSON.ratioWidth  	= ratioWidth;
		gridJSON.padding 		= padding;
		gridJSON.border 		= border;
		gridJSON.grids			= grids;
		
		return gridJSON;	
}

function json2grid(inputjson) {
		//var inputjson = jQuery.parseJSON(gridjson);
		
		var ratioHeight = inputjson.ratioHeight;
		var ratioWidth  = inputjson.ratioWidth;
		
		$('#gridcontainer').html('');
		$('#gridcontainer').data('ratioheight', ratioHeight );
		$('#gridcontainer').data('ratiowidth',  ratioWidth);	
		
		
		console.log("setratioslider(" + ratioWidth + ", " + ratioHeight + ")");
		
		setratioslider(ratioWidth, ratioHeight);
		
		
		var uploadstring = '<form class="uploadform" action="/upload" method="post" enctype   =  "multipart/form-data"><input type="file" name="mediaelement" /><button type="submit" id="upload-button">Upload</button></form>'
		var grids = []; 
		grids = inputjson.grids;
		
		//alert("Länge " + grids.length);
		for (i=0; i<grids.length ; i++) {
			$('#gridcontainer').append('<div class="gridelement" id="'+ grids[i].id + '">');
			$('#' + grids[i].id).css('width',  grids[i].width + '%');
			$('#' + grids[i].id).css('height', grids[i].height + '%');
			$('#' + grids[i].id).css('top',    grids[i].y + '%');
			$('#' + grids[i].id).css('left',   grids[i].x + '%');
			
			var containsmedia = grids[i].containsMedia;
			
			
			if ((containsmedia == 'preview') || (containsmedia == 'yes')) {
				var media = grids[i].media;
				var mediatype = media.mediatype;
				$('#' + grids[i].id).html('<div id="'+media.id+'" class="mediaelement" style="">');
				$('#' + media.id).data('mediavalue',mediatype);
				var temppath = 'img/designmode/bg-' + mediatype + '.png';
				if (mediatype=="picture") {
					temppath = 'img/designmode/bg-pic.png';
				}
				$('#' + media.id).css("background-image","url(" +temppath+ ")");
				//alert(mediatype);
				
				if (containsmedia == 'yes') { 
				
					if (mediatype == "picture") {
						var src = '/uploads/' + media.source;
						var fit = 'style="object-fit:' + media.properties.fit +';"';
						$('#' + media.id).html('<img class="pictureelement"' + fit + 'src='+src+' ></div>' );
					}

				
					if (mediatype == "video") {
						var controls = ''; var autoplay =''; var loop = ''; var muted = '';
						var fit = 'style="object-fit:' + media.properties.fit +';"';
						var src = '/uploads/' + media.source;
						if (media.properties.autoplay) {
							autoplay = ' autoplay ';
						}
						if (media.properties.controls) {
							controls = ' controls ';
						}
						if (media.properties.muted) {
							muted = ' muted ';
						}
						if (media.properties.loop) {
							loop = ' loop ';
						}			
						$('#' + media.id).html('<video class="videoelement"' + autoplay + controls + muted + loop + fit + '><source src="'+src+'">Your browser does not support the video tag.</video><div class="infobarmedia"></div>' );
					}
				
					if (mediatype == "sound") {
						var controls = ''; var autoplay =''; var loop = ''; var muted = '';
						var src = '/uploads/' + media.source;
						if (media.properties.autoplay) {
							autoplay = ' autoplay ';
						}
						if (media.properties.controls) {
							controls = ' controls ';
						}
						if (media.properties.muted) {
							muted = ' muted ';
						}
						if (media.properties.loop) {
							loop = ' loop ';
						}			
						$('#' + media.id).html('<audio class="soundelement"' + autoplay + controls + muted + loop + '><source src="'+src+'">Your browser does not support the audio tag.</audio><div class="infobarmedia"></div>' );
					}
				
					if (mediatype == "text") {
						$('#' + media.id).html('<div class="textmediaoutput">' + media.content  + '</div>' );
						// $('#'+tempid).html('<div class="tomtexteditor" contenteditable="true">Insert your text here</div>');
					}
				} 
				
			}
		}
		
		// (re-)bind clickevents
		init2();
	}	
