/* {"id":"0","refID":"0","aspectHeight":3,"aspectWidth":4,"grids":[{"id":"gridelement8","height":50,"width":50,"x":50,"y":50,"containsMedia":"yes","media":{"mediatype":"video","id":"me12","source":"uploads/tagesschau-englisch1448503484638.mp4","properties":{"autoplay":false,"controls":false,"loop":false,"mute":false,"fit":"contain"}}},{"id":"gridelement11","height":50,"width":50,"x":50,"y":0,"containsMedia":"yes","media":{"mediatype":"text","id":"me19","content":"Insert your text hewqeqeqweqwe<br><br><br>dqwwq<br><br><br>d<br>qwdre"}},{"id":"gridelement9","height":100,"width":25,"x":0,"y":0,"containsMedia":"no","media":{"mediatype":"empty"}},{"id":"gridelement10","height":100,"width":25,"x":25,"y":0,"containsMedia":"no","media":{"mediatype":"empty"}}]}

*/


/*
 <div id="gridcontainer" data-aspectwidth="4" data-aspectheight="3">
	<div class="gridelement ui-droppable" value="0" style="width: 50%; height: 50%; top: 50%; left: 50%; box-shadow: 0px 0px 0px 3px gray inset;" id="gridelement8"><div style="background-image: url(&quot;bg-video.png&quot;);" class="mediaelement ui-draggable ui-draggable-handle ui-draggable-disabled" id="me12" data-mediavalue="video"><video class="videoelement" controls="controls"><source src="uploads/tagesschau-englisch1448503484638.mp4">Your browser does not support the video tag.</video><div class="infobarmedia"></div></div></div>
<div style="width: 50%; height: 50%; left: 50%; top: 0%; box-shadow: 0px 0px 0px 3px gray inset;" class="gridelement ui-droppable" id="gridelement11"><div style="background-image: url(&quot;bg-text.png&quot;);" class="mediaelement ui-draggable ui-draggable-handle ui-draggable-disabled" id="me19" data-mediavalue="text"><div class="tomtexteditor" contenteditable="true">Insert your text hewqeqeqweqwe<br><br><br>dqwwq<br><br><br>d<br>qwdre</div></div></div>

<div style="width: 25%; height: 100%; left: 0%; top: 0%; box-shadow: 0px 0px 0px 3px gray inset;" class="gridelement ui-droppable" id="gridelement9">Ein neues linkes Element: 9</div>
<div style="width: 25%; height: 100%; left: 25%; top: 0%; box-shadow: 0px 0px 0px 3px gray inset;" class="gridelement ui-droppable" id="gridelement10">Ein neues rechtes Element: 10</div>
*/


var gridjson = '{"id":"0","refID":"0","aspectHeight":3,"aspectWidth":4,"grids":[{"id":"gridelement8","height":50,"width":50,"x":50,"y":50,"containsMedia":"yes","media":{"mediatype":"video","id":"me12","source":"http://localhost:3000/uploads/tagesschau-englisch1448503484638.mp4","properties":{"autoplay":true,"controls":true,"loop":false,"muted":false,"fit":"fit"}}},{"id":"gridelement11","height":50,"width":50,"x":50,"y":0,"containsMedia":"yes","media":{"mediatype":"text","id":"me19","content":"Insert your text" }},{"id":"gridelement9","height":100,"width":25,"x":0,"y":0,"containsMedia":"no","media":{"mediatype":"empty"}},{"id":"gridelement10","height":100,"width":25,"x":25,"y":0,"containsMedia":"no","media":{"mediatype":"empty"}}]}';


	function getuploadstring(mediatype) {
		var filetypecontraints;
		if (mediatype == "picture") {
			filetypecontraints = 'accept=".jpg,.gif,.png"';
		}
		if (mediatype == "video") {
			filetypecontraints = 'accept=".mpg,.mp4,.ogg"';
		}
		if (mediatype == "sound") {
			filetypecontraints = 'accept=".mp3,.wav"';
		}
		
		
		var uploadstring = '<form class="uploadform" action="/upload" method="post" enctype   =  "multipart/form-data" ' + filetypeconstraints + '><input type="file" name="mediaelement" /><button type="submit" id="upload-button">Upload</button></form>'
		return uploadstring
	}

	function loadjson(gridjson) {
		
		
		var inputjson = jQuery.parseJSON(gridjson);
		
		$('#gridcontainer').html('');
		$('#gridcontainer').data('aspectheight', inputjson.aspectHeight );
		$('#gridcontainer').data('aspectwidth',  inputjson.aspectWidth );	
		
		var idcounterlocal = inputjson.idcounter;
		$('#gridcontainer').data('idcounter',  idcounterlocal);
		idcounter = idcounterlocal;
		
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
				$('#' + media.id).css("background-image","url(" +temppath+ ")");
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
						$('#' + media.id).html('<audio class="soundelement"' + autoplay + controls + muted + loop + '><source src="'+src+'">Your browser does not support the audio tag.</audeo><div class="infobarmedia"></div>' );
					}
				
					if (mediatype == "text") {
						$('#' + media.id).html('<div class="textmediaoutput">' + media.content  + '</div>' );
						// $('#'+tempid).html('<div class="tomtexteditor" contenteditable="true">Insert your text here</div>');
					}
				} else {
					$('#' + media.id).html(getuploadstring(mediatype));
				}
				
			}
		}
		
		// (re-)bind clickevents
		init2();

	}


	function loadguidata() {
		//var data = createjson();	
		//alert(data);
		$.ajax({
			type: 'POST',
			dataType: 'json',
			//data: data,
			//data: JSON.stringify({"hallo":"ballo"}),
			contentType: 'application/json',
            url: 'http://localhost:3000/load',						
            success: function(data) {
                alert(JSON.stringify(data));
            }
        });	
	}