var gridjson = '{"unitID":"62fe8ba7-cd0b-498f-8063-3888d1fab6aa","ratioHeight":3,"ratioWidth":4,"padding":2,"border":true,"grids":[{"id":"gridelement8","height":100,"width":50,"x":0,"y":0,"containsMedia":"yes","media":{"mediatype":"picture","source":"uploads/mobilelearning1449652972248.jpg","id":"meN0SBfB9fQWurhw0","properties":{"fit":"cover"}}},{"id":"gridelementFxPhnyJfDGUPHA1","height":50,"width":50,"x":50.0411,"y":50,"containsMedia":"yes","media":{"mediatype":"video","source":"uploads/wissen1449652957647.mp4","id":"meHz8jrYrhmBwucFs","properties":{"autoplay":true,"controls":true,"loop":true,"muted":false,"fit":"contain"}}},{"id":"gridelementqidsPqf6m8CwVLA","height":50,"width":50,"x":50.0411,"y":0,"containsMedia":"yes","media":{"mediatype":"text","source":"","id":"mePezhf85y352e8XY","content":"Das ist ein sehr langer Text.<div>Er geht &uuml;ber mehrere &nbsp;Zeilen.</div>"}}]}';


	$( document ).ready(function() {
		loadjson();
		
		//alert($(this).val());
		
	});


	function loadjson() {
		
		
		var inputjson = jQuery.parseJSON(gridjson);
		
		$('#gridcontainer').html('');
		// nur fuer die editierbare Version notwendig
		/*$('#gridcontainer').data('aspectheight', inputjson.aspectHeight );
		$('#gridcontainer').data('aspectwidth',  inputjson.aspectWidth );	
		
		var idcounterlocal = inputjson.idcounter;
		$('#gridcontainer').data('idcounter',  idcounterlocal);
		idcounter = idcounterlocal;
		
		var uploadstring = '<form class="uploadform" action="/upload" method="post" enctype   =  "multipart/form-data"><input type="file" name="mediaelement" /><button type="submit" id="upload-button">Upload</button></form>'
		*/
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
				//var temppath = 'img/designmode/bg-' + mediatype + '.png';
				//$('#' + media.id).css("background-image","url(" +temppath+ ")");
				//alert(mediatype);
				
				if (containsmedia == 'yes') { 
				
					if (mediatype == "picture") {
						var src = media.source;		
						var fit = 'style="object-fit:' + media.properties.fit +';"';
						$('#' + media.id).html('<img class="pictureelement"' + fit + 'src='+src+' ></div>' );
					}

				
					if (mediatype == "video") {
						var controls = ''; var autoplay =''; var loop = ''; var muted = '';
						var fit = 'style="object-fit:' + media.properties.fit +';"';
						var src = media.source;
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
						var src = media.source;
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
						$('#' + media.id).html('<sound class="videoelement"' + autoplay + controls + muted + loop + fit + '><source src="'+src+'">Your browser does not support the video tag.</video><div class="infobarmedia"></div>' );
					}
				
					if (mediatype == "text") {
						$('#' + media.id).html('<div class="tomtexteditor" contenteditable="true">' + media.content  + '</div>' );
						// $('#'+tempid).html('<div class="tomtexteditor" contenteditable="true">Insert your text here</div>');
					}
				} else {
					$('#' + media.id).html(uploadstring);
				}
				
			}
		}
		
		
		// set padding
		var padding = inputjson.padding;
		if ($.isNumeric(padding)) {
				if ((padding>0) && (padding<5)) {
					$('.gridelement').css('padding', padding+'%');
				}
		}
		
		// set border visibility
		var border = inputjson.border;
		if (!border) {
				$('.gridelement').css({'-webkit-box-shadow':'inset 0px 0px 0px 0px gray'});
				$('.gridelement').css({'-moz-box-shadow':'inset 0px 0px 0px 0px gray'});
				$('.gridelement').css({'box-shadow':'inset 0px 0px 0px 0px gray'});
		}
		// (re-)bind clickevents
		//init2();

	}