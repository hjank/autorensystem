var currentmarkedid;

$( document ).ready(function() {
	$(document).on("click", function(e){
		if (!(insidegridelementevent(e)) && !(insidepropertiesareaevent(e))) {
			console.log('inside: ' +  e.pageX + ' ' + e.pageY);
			unmarkmediaallmediaelements();
		}
		//alert("inside: " + insidegridelementevent(e));
		//updateHTML();
		
		$('html').keyup(function(e){
			if(e.keyCode == 46) {
				if (currentmarkedid != 0) {
					var mediavalue1 = $('#'+currentmarkedid).data('mediavalue');
					console.log("Medienwert:  " + mediavalue1);
					/*if (mediavalue1 == "picture") {
						removeMetaDataFromUnit("MD_IMAGE", $('#'+currentUnitUUID));
					}
					if (mediavalue1 == "video") {
						removeMetaDataFromUnit("MD_FILM", $('#'+currentUnitUUID));
					}
					if (mediavalue1 == "sound") {
						removeMetaDataFromUnit("MD_AUDIO", $('#'+currentUnitUUID));
					}
					if (mediavalue1 == "text") {
						removeMetaDataFromUnit("MD_TEXT", $('#'+currentUnitUUID));
					}*/
					$('#' + currentmarkedid).remove();
					unmarkmediaallmediaelements();
					updateHTML();
				}
			}
		});
		
		
	});
});

function unmarkmediaallmediaelements() {
		$('.optionsmenu').hide();
		$('#pageoptionmenu').show();
		
		currentmarkedid = 0;
		$('.mediaelement').removeClass('borderglowing');

		$( ".mediaelement" ).each(function( index ) {
			if ($(this).data('draggable'))  { // && (!$(obj).draggable('option', 'disabled');)
				$('.mediaelement').draggable('disable');
			}
		});
		
		if (mediamode) {
			$('#media-panel').show();
		}
}

function getmediabuttonsource(id) {
	var out = '<div class="editmediaelementbutton" onClick="markmediaelement(\''+ id + '\')"></div>';
	return out;
}	
	
function markmediaelement(id) {
	// show menu
	console.log(id);
	unmarkmediaallmediaelements();
	currentmarkedid = id;
	$('#'+id).addClass('borderglowing');
	$('#'+id).draggable('enable');
	var mediavalue = $('#'+id).data('mediavalue');
	$('.optionsmenu').hide();
	$('#media-panel').hide();
	switch(mediavalue) {
		case 'text':
			$('#textoptionmenu').show();
			texttoeditor();
			resizegridcontainer();
			$('#'+id).css({'background-image' : 'none'});
			break;
		case 'picture':
			//filename = 'picture';
			$('#picoptionmenu').show();
			break;
		case 'sound':
			//filename = 'sound';
			$('#soundoptionmenu').show();
			break;
		case 'video':
			$('#videooptionmenu').show();
			break;
		default:
			$('#pageoptionmenu').show();
		}


}

function initmediaelementfunctions() {
	$('.mediaelement').click(function(e) {
		if (ismediamode()) {
			markmediaelement($(this).attr('id'));
		}
	});

	$( '.gridelement' ).droppable({
		drop: function( event, ui ) {
			var draggedelement=$(ui.draggable);

			if (!(draggedelement.attr('id') == 'sizemarker')) {
				tempid = 'me' + newid();
				if (draggedelement.hasClass('mediaelement')) {
					//alert('Draggedelement: ' + draggedelement.attr('id'));
					// switche media elements
					var draggableparent = draggedelement.parent();
					console.log ("Draggable Parent: " + draggableparent.attr('id'));
					var mediaelement1 = $(this).html();
					var mediaelement2 = draggedelement.html();
					//draggableparent.html(mediaelement1);

					draggableparent.html(mediaelement1);
					$(this).html('');
					$(draggedelement).appendTo($(this));
					$(draggedelement).css({'top' : '0px'});
					$(draggedelement).css({'left' : '0px'});
					$(draggedelement).css({'height' : '100%'});
					$(draggedelement).css({'width' : '100%'});
				} else {
					$( '#infotext' ).append('gedroppt');
					if (currentdraggedtype == 'text') {
						$( this ).html('<div class="mediaelement" id="'+tempid+'" data-mediavalue="text"></div>');
						$('#'+tempid).css({'background-image' : "url('img/designmode/bg-text.png')"});
						$('#'+tempid).html('<div class="textmediaoutput">Insert your text here</div>');
						//addMetaDataToUnit("MD_TEXT", $('#'+currentUnitUUID));
					}
					if (currentdraggedtype == 'picture') {
						$( this ).html('<div class="mediaelement" id="'+tempid+'" data-mediavalue="picture"></div>');
						//$('#'+tempid).css({'background-color' : 'LightBlue'});
						$('#'+tempid).css({'background-image' : "url('img/designmode/bg-pic.png')"});
						//$('#'+tempid).css({'background' : 'LightBlue'});
						//binduploadlistener(tempid, 'pictureelement');
						//$('#'+tempid).html('<img src="img/designmode/potsdam2.jpg" class="pictureelement">');
						//addMetaDataToUnit("MD_IMAGE", $('#'+currentUnitUUID));
						$('#'+tempid).data('mediavalue', 'picture');
					}

					if (currentdraggedtype == 'sound') {
						$( this ).html('<div class="mediaelement" id="'+tempid+'" data-mediavalue="sound"></div>');
						$('#'+tempid).css({'background-image' : "url('img/designmode/bg-sound.png')"});
						$('#'+tempid).css({'background-color' : 'orange'});
						//addMetaDataToUnit("MD_AUDIO", $('#'+currentUnitUUID));
						$('#'+tempid).data('mediavalue', 'sound');
					}

					if (currentdraggedtype == 'video') {
						$( this ).html('<div class="mediaelement" id="'+tempid+'" data-mediavalue="video"></div>');
						$('#'+tempid).css({'background-image' : "url('img/designmode/bg-video.png')"});
						/*$('#'+tempid).html('<video class="videoelement" controls="controls"><source src="tagesschau.mp4" type="video/mp4">Your browser does not support the video tag.</video><div class="infobarmedia"></div>');
						*/
						//binduploadlistener(tempid, 'videoelement');
						//addMetaDataToUnit("FILM", $('#'+currentUnitUUID));
						$('#'+tempid).data('mediavalue', 'video');
						//autoplay controls loop mute
					}
					setmediaicons(tempid);
					/*$('#'+tempid).append('<div class="editmediaelementbutton" onClick="markmediaelement(\''+ tempid + '\')"></div>');
					*/
				}
				updateHTML();
				$( 'body' ).unbind();
				init2();
				unmarkmediaallmediaelements();
				hidemarker();
				$('#'+tempid).draggable('disable');
			}
		  //.addClass( "bgcolor" )
		}
	});
}


// TODO -> Zusammenfassen
function insidegridelementevent(e) {
	if (!(typeof e === "undefined")) {
		return insidegridelement(e.pageX, e.pageY);
	} else {
		console.log("achtung undefined");
		return false;
	}
}

function insidegridelement(mx, my) {
	//console.log("Test: " +  mx + ' ' + my );
	if (!((typeof mx === "undefined") || (typeof my === "undefined"))) {
		var gridtop 	= $('#gridcontainer').offset().top;
		var gridbottom 	= $('#gridcontainer').offset().top  + $('#gridcontainer').height();
		var gridleft 	= $('#gridcontainer').offset().left;
		var gridright 	= $('#gridcontainer').offset().left + $('#gridcontainer').width();
		
		return ((mx>gridleft && mx<gridright) && (my>gridtop && my<gridbottom));	
	} 
	else {
		console.log('undefined'); 
		return false;
	}
}

function insidepropertiesareaevent(e) {
	return insidepropertiesarea(e.pageX, e.pageY);
}

function insidepropertiesarea(mx, my) {
	//console.log("Test: " +  mx + ' ' + my );
	var gridtop 	= $('.properties').offset().top;
	var gridbottom 	= $('.properties').offset().top  + $('.properties').height();
	var gridleft 	= $('.properties').offset().left;
	var gridright 	= $('.properties').offset().left + $('.properties').width();
	
	return ((mx>gridleft && mx<gridright) && (my>gridtop && my<gridbottom));	
}

