	var pos = "right";
	var idcounter = 9;
	var clickable1 = true//false; // TODO: find better name
	var divPos = {};
	var currentdraggedtype;
	var contextmenumediasource; // ID
	var contextmenugridsource;	
	var sizemarkerdir = 'undef'; //horizontal, vertical
	var sizemarkerdragged = false;
	var sizemarkerelement1=0;
	var sizemarkerelement2=0;
	var aspectratio = 1*(4/3);
	var relativefontsize = 1;
	var preventDivisionMarker = false;
	var mediamode = false;
	const MAXGRIDELEMENTSIZE = 15; // Prozentangabe, Maximale Laenge/Breite eines Gridelements
	var bordersvisible = true;
	
	function ismediamode() {
		/*if(!($('#mediamode').is(':checked'))) { 
			//console.log('mediamode'); 
			return true;
		} else {
			return false;
		}*/
		return mediamode;
	
	}
	
	/*function addrightneighbors(gridelementid) {
		var output = [];
		var rightneighborid = getneighbor(gridelementid, 'right')
		if (getneighbor(gridelementid, 'right') !=0) {
			output = gridelementid.concat(addrightneighbors(rightneighborid));
		}
		alert(output);
		return output;
	}
	*/

	function test() {
		alert(getmyneighbor('11', 'right'));
	}

	function spaltengleichmaessigverteilen(elementidofcurrentrow) {
		hidemarker();
		//var elementidofcurrentrow = contextmenugridsource; 
		var rowelements = getmyrow(elementidofcurrentrow);
		var summedwidth = 0;
		
		for (var i in rowelements) {
			summedwidth += parseFloat($('#'+rowelements[i])[0].style.width)
		}
		var firstelementleft = parseFloat($('#'+rowelements[0])[0].style.left);
		
		var newgridelementwidth = Math.round((summedwidth/rowelements.length)*10) /10;
		var onehundredpercentcounter = summedwidth;
		//console.log('rowelements: ' + rowelements);
		//console.log($(this).attr('id') + '  ' + gridelementid + ':  ' + direccion);
		console.log('newgridelementwidth: ' + newgridelementwidth);
		alert('laenge: ' + rowelements.length);
		for (i=0; i<rowelements.length; i++) {
			console.log('rowelements.length: ' + rowelements.length);
			$('#'+rowelements[i]).css('left', newgridelementwidth*i + firstelementleft + '%');
			if (i<rowelements.length-1) {
				$('#'+rowelements[i]).css('width', newgridelementwidth + '%');
				//$('#'+rowelements[i]).css('max-width', newgridelementwidth + '%');
				onehundredpercentcounter -=	newgridelementwidth;	
			} else if (i==rowelements.length-1) {
				$('#'+rowelements[i]).css('width', onehundredpercentcounter + '%');
				//$('#'+rowelements[i]).css('max-width', onehundredpercentcounter + '%');
			}
		}
	}
	
	
	
/*	WORKS function getmyneighbor(gridelementid, direction) {
		var neighbor = '0';
		$('#gridcontainer').find('.gridelement').each(function(){
			var direccion = getneighboringdirection($(this), $('#'+gridelementid));
			console.log($(this).attr('id') + '  ' + gridelementid + ':  ' + direccion);
		});
		

		//return output;
	} 
*/		

		
	function newid() {
		/*var out = idcounter++;
		$('#gridcontainer').data('idcounter', out);
		return out;
		*/
		return  Math.uuid(15);
	}
	
	function percentage() {
	
	}
	

	
	function testtest() {
		//isneighbor($('#9'), $('#10'));	
		deletegridelement($('#9'), $('#10'))
	}
		
/*	window.oncontextmenu = function() {
		return false;
	};
*/	

	function directiontranslatorakkusativ(direction) {
		if (direction == 'right') return 'rechten';
		if (direction == 'left') return 'linken';
		if (direction == 'top') return 'oberen';
		if (direction == 'bottom') return 'unteren';
	}


	function uploadlistener() {
		$( '.uploadform' ).submit( function( e ) {
		//alert($(this).attr('id'));#
		e.preventDefault();
		var id = currentmarkedid;
		if (id != 0) {
			var classname = $('#'+currentmarkedid).data('mediavalue') + 'element';
			$.ajax( {
			  url: 'upload/',
			  type: 'POST',
			  data: new FormData( this ),
			  processData: false,
			  contentType: false,
			  success: function(data){ 
				//alert('<img src="'+data+'">');				
				if (classname == "pictureelement") {
					$('#'+id).html('<img src="/uploads/'+data+'" class="'+classname+'">');
					document.getElementById('picfileinput').value='';
				}
				
				if (classname == "videoelement") {
					$('#'+id).html('<video class="videoelement" controls="controls"><source src="/uploads/'+data+'">Your browser does not support the video tag.</video><div class="infobarmedia"></div>');
					document.getElementById('vidfileinput').value="";
				}
				
				if (classname == "soundelement") {
					$('#'+id).html('<audio class="soundelelement" controls="controls"><source src="/uploads/'+data+'" type="audio/mpeg">Your browser does not support the audio tag.</audio><div class="infobarmedia"></div>');
					document.getElementById('soundfileinput').value="";
				}
				$('#'+id).css('background-image', 'none');
				//$('#'+id).css('background-color', 'transparent');
				updateHTML();
				//$('.uploadform').reset();
				//document.getElementById(".uploadform").reset();
				//document.getElementById('your_input_id').value=''
			  },
			  
			  error: function(){
				alert('error!');
			  }
			} );
		} else {
			alert('Medienelementauswahl konnte nicht ermittelt werden.');
		}
	  } );
		
	/*	
			$( '#viduploadform' ).submit( function( e ) {
		//alert($(this).attr('id'));#
		e.preventDefault();
		var id = currentmarkedid;
		if (id != 0) {
			var classname = $('#'+currentmarkedid).data('mediavalue') + 'element';
			$.ajax( {
			  url: 'upload/',
			  type: 'POST',
			  data: new FormData( this ),
			  processData: false,
			  contentType: false,
			  success: function(data){ 
				//alert('<img src="'+data+'">');
				if (classname == "pictureelement") {
					$('#'+id).html('<img src="'+data+'" class="'+classname+'">');
					document.getElementById('picfileinput').value='';
				}
				
				if (classname == "videoelement") {
					$('#'+id).html('<video class="videoelement" controls="controls"><source src="'+data+'">Your browser does not support the video tag.</video><div class="infobarmedia"></div>');
					document.getElementById('vidfileinput').value="";
				}
				
				if (classname == "soundelement") {
					$('#'+id).html('<audio class="soundelelement" controls="controls"><source src="'+data+'" type="audio/mpeg">Your browser does not support the audio tag.</audio><div class="infobarmedia"></div>');
					document.getElementById('soundfileinput').value="";
				}
				//$('.uploadform').reset();
				//document.getElementById(".uploadform").reset();
				//document.getElementById('your_input_id').value=''
			  },
			  
			  error: function(){
				alert('error!');
			  }
			} );
		} else {
			alert('Medienelementauswahl konnte nicht ermittelt werden.');
		}
	  } );	
		
		
	}
	
	
	// alt
	function binduploadlistener(id, classname) {
	
		$( '#'+id + ' .uploadform' ).submit( function( e ) {
		//alert($(this).attr('id'));
		e.preventDefault();
		$.ajax( {
		  url: 'upload/',
		  type: 'POST',
		  data: new FormData( this ),
		  processData: false,
		  contentType: false,
		  success: function(data){ 
		    //alert('<img src="'+data+'">');
			if (classname == "pictureelement") {
				$('#'+id).html('<img src="'+data+'" class="'+classname+'">');
			}
			
			if (classname == "videoelement") {
				$('#'+id).html('<video class="videoelement" controls="controls"><source src="'+data+'">Your browser does not support the video tag.</video><div class="infobarmedia"></div>');
			}
			
			if (classname == "soundelement") {
				$('#'+id).html('<audio class="soundelelement" controls="controls"><source src="'+data+'" type="audio/mpeg">Your browser does not support the sound tag.</audio><div class="infobarmedia"></div>');
			}
		  },
		  
		  error: function(){
			alert('error!');
		  }
		} );

	  } );
	
	*/
	
	}

	
	
	$( document ).ready(function() {
		uploadlistener();
		init2();
		
		
		$(document).on("click", function(e){
			if ($('.mycontextmenu').length > 0) {
				if (!(insidecontextmenu(e))) {
					$('.mycontextmenu').remove();
					//alert("notinsidecontextmenu: " + insidecontextmenu(e));
				}
			}
		//updateHTML();
		});
		
		
		
		$('#media-panel').hide();
		$('#padding-panel').show();
		$('#ratio-panel').show();
		
		
		// TODO: optimize
		$('#mediamode').on('click', function () {
			console.log("changing");
			//if($(this).checked) {
				mediamode=true;
				$('#media-panel').show();
				$('#padding-panel').hide();
				$('#ratio-panel').hide();	
				//addborders();
			//} 
		});
		
		$('#layoutmode').on('click', function () {
			//console.log("changing");
			//if($(this).checked) {
				mediamode=false;
				console.log("checked true");

				
				$('#media-panel').hide();
				$('#padding-panel').show();
				$('#ratio-panel').show();
				
				//addborders();
			//} 
		});
		
		
		$('#gridbordercheckbox').change(function() {
			if(this.checked) {
				bordersvisible = true;
				//$('#gridcontainer').data('showborders','true');
				//addborders();
			} else {
				bordersvisible = false;
				//$('#gridcontainer').data('showborders','false');
				//removeborders();
			}
			unifyborderdesign();
		});
		
		$(function() {
			$( '#contextmenumedia' ).menu();
			//$( '#contextmenugrid' ).menu();
		});
		

		
		
		
	/*	$(".ratioslider").slider({ 
			min: 0, 
			max: ratiovalues.length-1, 
			value: activeratio 
		})

		$(".ratioslider").slider("pips", {
				rest: "label",
				labels: ratiovalues
			})
			*/

				
	/*$( window ).resize(function() {
		//alert( "<div>Handler for .resize() called.</div>" );

		$('#gridcontainer').css('min-width', '70%');
		$('#gridcontainer').css('max-width', '70%');
		$('#gridcontainer').css('left', '10%');
		$('#gridcontainer').css('right', '20%');
		var newheight =  $('#gridcontainer').width()/aspectratio;
		//alert(aspectratio + '; ' + $('#gridcontainer').width() + '; '+ newheight);
		$('#gridcontainer').css('height', newheight);
	});	
	*/

		
	$( '#container' ).resize(function() {
		//alert( "ratio: " + aspectratio );
		resizegridcontainer();
	});	

	
	$( document ).click(function( event ) {
		//classstring = event.target.className;
		
		//alert( "clicked: " + event.target.className );
		if (!($(event.target).hasClass('.contextmenu')))  {
			$('.contextmenu').hide();
		}
		
	if ((!($(event.target).hasClass('.textbar')))  
			&&(!($(event.target).hasClass('.tomtexteditor')))
			&&(!($(event.target).hasClass('.mediaelement')))
			&&(!($(event.target).hasClass('.gridelement')))) 
			{
			$('.textbar').hide();
		}

	});
		



		
		$('input[name=picformat]:radio').change(function () {
			var picformat = $(this).attr('value');
			//alert(picformat + ' ' +  currentmarkedid);
			switch(picformat) {
				case 'filled':
					//alert("filled");
					$('#'+currentmarkedid).children().css({'object-fit': 'fill'});
					break;
				case 'aspectratio':
					$('#'+currentmarkedid).children().css({'object-fit': 'contain'});
					//$('#'+currentmarkedid).children().addClass('contain');
					break;
				case 'panscan':
					$('#'+currentmarkedid).children().css({'object-fit': 'cover'});
					break;
				default:
			}
			updateHTML();
		});
		
		
		$('.videooptions').change(function () {
			var option = $(this).attr('name');
			//alert(picformat + ' ' +  currentmarkedid);
			if ($(this).prop( 'checked' )) {
				$('#' + currentmarkedid).children().first().addClass(option);
			} else {
				$('#' + currentmarkedid).children().first().removeClass(option);
			}		
			setmediaicons(currentmarkedid);
		});
		
		
		$('input[name=videoformat]:radio').change(function () {
			var videoformat = $(this).attr('value');
			//alert(videoformat + ' ' +  currentmarkedid);
			switch(videoformat) {
				case 'filled':
					$('#'+currentmarkedid).children().css({'object-fit': 'fill'});
					break;
				case 'aspectratio':
					$('#'+currentmarkedid).children().css({'object-fit': 'contain'});
					break;
				case 'panscan':
					$('#'+currentmarkedid).children().css({'object-fit': 'cover'});
					break;
				default:
			} 
		});
		
		
		$('.soundoptions').change(function () {
			var option = $(this).attr('name');
			//alert(picformat + ' ' +  currentmarkedid);
			if ($(this).prop( 'checked' )) {
				$('#' + currentmarkedid).children().first().addClass(option);
			} else {
				$('#' + currentmarkedid).children().first().removeClass(option);
			}		
			setmediaicons(currentmarkedid);
		});
		
		
		
		$('.textformat').click(function () {
			var format = $(this).data('texttag');
			value = true;
			if (format=='heading') {
				value='h1';
			}
			if (format=='formatBlock') {
				value='div';
			}
			
			document.execCommand("styleWithCSS", true, null);
			document.execCommand(format,false,value);
			
		});
		
    });
	
	/*
	function findneighboringgridelement(gridelement) {
		var array = new Array();
		$('div','#gridcontainer').each(function(){
			array.push($(this).attr('id'));		
			if ($(this).val() == '') && 
				($(this).width() == gridelement.
		});
		childelements = array.toString();
		alert(childelements);	
	}
	*/

	function setmediaicons(thismediaelementid) { 
		var thiselement = $('#'+thismediaelementid);
		thiselement.find('.infobarmedia').html('');
		if (thiselement.data('mediavalue') == 'video' || thiselement.data('mediavalue') == 'sound') {
			// TODO: verkuerzen
			if (thiselement.children().first().hasClass('muted')) {
				thiselement.find('.infobarmedia').append('<img class="mediaicon" src="img/designmode/video-muted-icon.png" alt="muted" title="Ton aus">');
			}
			if (thiselement.children().first().hasClass('loop')) {
				thiselement.find('.infobarmedia').append('<img class="mediaicon" src="img/designmode/video-loop-icon.png" alt="loop" title="Das Video wird in einer Endlosschleife abgespielt.">');
			}
			if (thiselement.children().first().hasClass('controls')) {
				thiselement.find('.infobarmedia').append('<img class="mediaicon" src="img/designmode/video-controls-icon.png" alt="controls" title="Dem Nutzer werden die Kontrollelemente angezeigt.">');
			}
			if (thiselement.children().first().hasClass('autoplay')) {
				thiselement.find('.infobarmedia').append('<img class="mediaicon" src="img/designmode/video-autoplay-icon.png" alt="autostart" title="Das Video startet automatisch." >');
			}
		}
	}

	function init2() {
		$('#gridcontainer').data('showborders','true');
			
		function unifypadding() {
			$('.gridelement').css('padding', input+'%');
			$('.gridcontainer').data('gridpadding');
		}
	
		$('#pageoptionspadding').on('input',function(e){
			input = $(this).val();
			if ($.isNumeric(input)) {
				if ((input>0) && (input<100)) {
					$('.gridelement').css('padding', input+'%');
				}
			}
			//alert($(this).val());
		});

		$('#aspectwidth').on('input',function(e){
			setpageaspectratio();
			
			//alert($(this).val());
		});

		$('#aspectheight').on('input',function(e){
			setpageaspectratio();
		});

		$('.mediaelement').mousedown(function() {
			if ($(this).attr('id') != currentmarkedid) {
				$(this).draggable({ disabled: true });
			} else {
				/*$(this).draggable({
					start: function( event, ui ) {
						$(this).css({'z-index':'100000001'});
						$(this).css({'overflow' : 'visible'});
					},
					drag: function( event, ui ) {
						$(this).css({'overflow' : 'visible'});
					},
					stack: ".mediaelement",
					stop : function( event, ui )	
					{
						$(this).css({'z-index':'10000000'});
					}
				});
				*/
				$(this).draggable("enable");
			}
		});
	
/*	
		$( ".tomtexteditor" ).mouseout(function() {
			//$('#textbar').hide();
		});
		
		$( ".tomtexteditor" ).mouseenter(function() {
				$('#textbar').show();
				var left1 = $(this).parent().offset().left;
				var top1  = $(this).parent().offset().top-$('#textbar').height();
				//$('#textbar').offset({ left:1, top:3});
				//alert("Test");
				$('#textbar').offset({ left:left1, top:top1});
				$('#textbar').css({'z-index':'99999999'});
		});
		
*/
	
	
		$('.gridelement').unbind();
		$( '.contextmenumedia' ).unbind();
		//$( '.mediaelement' ).unbind();
	
		$( '#contextmenumedia' ).click(function() {
			$( '#contextmenumedia' ).hide();
		});

		initcontextmenu(); // right click

		$( '.draggablemenuitem').draggable( {
			helper: "clone",
			appendTo: "body",
			start: function( event, ui ) {
				//clickable = false;
				$( '.gridelement').unbind('click');
				currentdraggedtype = $(this).attr('value');
			},
			stop : function( event, ui ) {
				var parentid = ($(this).parent().attr('class'));
				// TODO verkuerzen -> value
				var filename;
				switch(parentid) {
					case 'mediamenuitem1':
						filename = 'text';
						break;
					case 'mediamenuitem2':
						filename = 'picture';
						break;
					case 'mediamenuitem3':
						filename = 'sound';
						break;
					case 'mediamenuitem4':
						filename = 'video';
						break;
					default:
						filename = 'undef';
				} 
				//var filename = ($(this).parent().attr('value'));
				//$(this).remove();
				$(ui.helper).remove();
				$('#' + parentid).append('<img src="img/designmode/icon-'+ filename + '.png" height="100" class="draggablemenuitem" value="'+ filename +'">');
				$( 'body' ).unbind();
				init2();
				//$('.gridelement').trigger('create');
			}
		});
		
		$('.contextmenu').click(function() { 
			$('.contextmenu').hide();
		});
		
		$( '.mediaelement').draggable({
			// clone helper because z-index doesn't work here
			// set correct size of helper via .me-draggable-helper
			helper: "clone",
			appendTo: "body",

			stack: "div",
			start: function( event, ui ) {
				//$(this).css({'z-index':'100000001'});
				$(this).css({'overflow' : 'visible'});
				console.log($(this).attr('id'));
				$('#gridelement').trigger("create");
				$(ui.helper).addClass("me-draggable-helper");
				var cwidth  = $(this).width();
				var cheight = $(this).height();
				$('.me-draggable-helper').width(cwidth);
				$('.me-draggable-helper').height(cheight);
				$(this).hide();
			},
			drag: function( event, ui ) {
				$(this).css({'overflow' : 'visible'});
			},
			stack: ".mediaelement",
			stop : function( event, ui )	
			{
				$(this).show();
				//$(this).css({'z-index':'10000000'});
			}
		});

		/*
		$( '.mediaelement' ).click(function() {  
			if ($(this).data('mediavalue')=='text') {
				$('#textbar').show();
				var left1 = $(this).offset().left;
				var top1  = $(this).offset().top-$('#textbar').height();
				//$('#textbar').offset({ left:1, top:3});
				//alert("Test");
				$('#textbar').offset({ left:left1, top:top1});
				$('#textbar').css({'z-index':'99999999'});
			} else {
				$('#textbar').hide();
			}	
		});
		*/
		
		
		
		$( '.mediaelement').mousemove(function(e) {
			
		});
		
		$( '.videoelement').click(function(e) {
			 e.preventDefault();
		});
		
		$( '.videoelement').dblclick(function(e) {
			 e.preventDefault();
		});
		

		// Anzeigen und Aktivierung des rotes "Dividers", und des Elements zur Groessenverschiebung der Grenze
		$( '.gridelement' ).mousemove(function(e) {
			var offset = $(this).offset();
			var elementoffset = offset;
			var tolerancearea = 40; // pixels
			var ta = tolerancearea;
			var neighbor;
			divPos = {
				left: e.pageX - offset.left,
				top: e.pageY - offset.top
			};
			var thisgridelement = $(this);
			
			$('#infotext').html('ID: ' + $(this).attr('id') + '; Koordinate: '+divPos.left+'; ' + divPos.top + ' last dragged: ' + currentdraggedtype);
			
			
			var widthpercent	= parseFloat($(this)[0].style.width); //(thiselement.position().left / $('#gridcontainer').width()) * 100;
			var heightpercent	= parseFloat($(this)[0].style.height);
			//console.log(widthpercent + ' ' + heightpercent);
			clickable1 =false;
			
			// V0.1: Margins of the Grid Element as Sensitive Areas 
			// changed: Sensitive Areas are set to an inner Rectangle
			$('#infotext2').html('width = ' + $(this).outerWidth());
			getdirection($(this).attr('id'), divPos);
			// Teilen wird nur dann aktiviert, wenn Feld noch eine bestimmte Groesse hat
			if ((!ismediamode()) && (!sizemarkerdragged)) {
				if ((heightpercent > 30) || (widthpercent > 30)) {
					if (!((thisgridelement.find('.mediaelement').length>0) && ($(thisgridelement.find('.mediaelement')[0]).attr('id') == currentmarkedid))) {
						if ((((divPos.left<($(this).width()/2)+ta)) && ((divPos.left>($(this).width()/2)-ta))) || (((divPos.top)<(($(this).height()/2)+ta)) && ((divPos.top)>(($(this).height()/2)-ta)))) {
							clickable1 = true;
							if ((pos == 'right') || (pos == 'left')) {
								if (widthpercent > 30) {
									setdivisionmarker($(this).attr('id')); 
								} else {
									clickable1 = false;
								}
							}
							if ((pos == 'top') || (pos == 'bottom')) {
								if ((heightpercent > 30)) {
									setdivisionmarker($(this).attr('id')); 
								} else {
									clickable1 = false;
								}
							}
							 // setzt globale Variable (TODO: evil)
						} else {
							//clickable1=true;
							clickable1 = false;
							$('#divisionmarker').hide();				
						}
					//} else {
						
						//clickable1 = false;
					//}
					}
				} 
			}
		//	getdirection($(this).attr('id'), divPos);
			// Marker zur Groessenveraenderung
			// Touchable Areas at the borders
			// get direction
			var borderdir = 'undef';
			
			if ((!ismediamode()) && (!sizemarkerdragged)) {
				var tol=5; // Toleranz-Wert
				if (((divPos.left)<tol) || ((divPos.left)>($(this).outerWidth()-tol)) || ((divPos.top)<tol) || ((divPos.top)>($(this).outerHeight()-tol))) {
					if (divPos.left<tol) {
						borderdir = 'left';
					}
					if (divPos.left>($(this).outerWidth()-tol)) {
						borderdir = 'right';
					}
					if (divPos.top<tol) {
						borderdir = 'top';
					}
					if ((divPos.top)>($(this).outerHeight()-tol)) {
						borderdir = 'bottom';
					}
				} else {
					$('#infotext4').html("Border Untouched");
				}

				$('#infotext4').html("BorderDir" + borderdir);
				
				//$('#sizemarker').;
				var maxwidth = (MAXGRIDELEMENTSIZE * $('#gridcontainer').width()) / 100;
				var maxheight = (MAXGRIDELEMENTSIZE * $('#gridcontainer').height()) / 100;
				
				
				if (borderdir=='left') {
					if ((neighbor=getneighbor($(this), 'left'))!='0') { 
						sizemarkerelement2 = $(this).attr('id');
						sizemarkerelement1 = neighbor;
						sizemarkerdir = 'horizontal';
						$('#sizemarker').draggable({ 
							snap: '.resizesnapper',
							axis: 'x', 
							containment:  [$('#'+sizemarkerelement1).offset().left+maxwidth, $('#'+sizemarkerelement1).offset().top, $('#'+sizemarkerelement2).offset().left+$('#'+sizemarkerelement2).outerWidth()-maxwidth, $('#'+sizemarkerelement1).offset().top+$('#'+sizemarkerelement1).outerHeight()] 
						});
						$('#sizemarker').show();
						$('#sizemarker').height($(this).outerHeight());
						$('#sizemarker').width(5);
						$('#sizemarker').offset( {top: elementoffset.top, left: elementoffset.left-3} ) ;
						$('#sizemarker').css(  {'cursor': 'e-resize' } ) ;
					}
				}
				
				if (borderdir=='right') {
					if ((neighbor=getneighbor($(this), 'right'))!='0') { 
						sizemarkerelement1 = $(this).attr('id');
						sizemarkerelement2 = neighbor;
						sizemarkerdir = 'horizontal';
						$('#sizemarker').draggable({ 
						    snap: '.resizesnapper',
							axis: 'x', 
							containment:  [$('#'+sizemarkerelement1).offset().left+maxwidth, $('#'+sizemarkerelement1).offset().top, $('#'+sizemarkerelement2).offset().left+$('#'+sizemarkerelement2).outerWidth()-maxwidth, $('#'+sizemarkerelement1).offset().top+$('#'+sizemarkerelement1).outerHeight()] 
						});
						$('#sizemarker').show();
						$('#sizemarker').height($(this).outerHeight());
						$('#sizemarker').width(5);
						$('#sizemarker').offset( {top: elementoffset.top, left: elementoffset.left+$(this).outerWidth()-3});
						$('#sizemarker').css(  {'cursor': 'e-resize' } ) ;
					}
				}
				
			
				if (borderdir=='top') {
					if ((neighbor=getneighbor($(this), 'top'))!='0') { 
						sizemarkerelement2 = $(this).attr('id');
						sizemarkerelement1 = neighbor;
						sizemarkerdir = 'vertical';
						$('#sizemarker').draggable({ 
						    snap: '.resizesnapper',
							axis: 'y', 
							containment:  [$('#'+sizemarkerelement1).offset().left, $('#'+sizemarkerelement1).offset().top+maxheight, $('#'+sizemarkerelement2).offset().left+$('#'+sizemarkerelement2).width(), $('#'+sizemarkerelement2).offset().top+$('#'+sizemarkerelement2).outerHeight()-maxheight] 
						});
						$('#sizemarker').draggable({ axis: 'y' });
						$('#sizemarker').show();
						$('#sizemarker').width($(this).outerWidth());
						$('#sizemarker').height(5);
						$('#sizemarker').offset( {top: elementoffset.top-3, left: elementoffset.left} ) ;
						$('#sizemarker').css(  {'cursor': 'n-resize' } ) ;
					}
				}
				
				if (borderdir=='bottom') {
					if ((neighbor=getneighbor($(this), 'bottom'))!='0') {
						sizemarkerelement1 = $(this).attr('id');
						sizemarkerelement2 = neighbor;
						sizemarkerdir = 'vertical';
						$('#sizemarker').draggable({ 
						    snap: '.resizesnapper',
							axis: 'y', 
							containment:  [$('#'+sizemarkerelement1).offset().left, $('#'+sizemarkerelement1).offset().top+maxheight, $('#'+sizemarkerelement2).offset().left+$('#'+sizemarkerelement2).width(), $('#'+sizemarkerelement2).offset().top+$('#'+sizemarkerelement2).outerHeight()-maxheight] 
						});
						$('#sizemarker').show();
						$('#sizemarker').width($(this).outerWidth());
						$('#sizemarker').height(5);
						$('#sizemarker').offset( {top: elementoffset.top+$(this).outerHeight()-3, left: elementoffset.left} );
						$('#sizemarker').css(  {'cursor': 'n-resize' } ) ;
					}
				}
				
				if ((borderdir=='undef') || (borderdir==0))  {
					if (!(sizemarkerdragged)) {
						$('#sizemarker').hide();
					}
				}
				
				$('#infotext4').html("Sizemarker1: " + sizemarkerelement1 + "; Sizemarker2: " + sizemarkerelement2);
			}
			
		});

		initdividefunctions();
		initmediaelementfunctions();
	}
	
	function togglegridvisibility() {
			/*if ($('#togglegridview').html()=='true') {
				$('#togglegridview').html('false');	
				removeborders();
		

			} else {
				$('#togglegridview').html('true');
				addborders();
			}
	*/
	}
	
	function unifyborderdesign() {
		//addborders();
		//var visible = $('#gridcontainer').data('showborders');
		if (bordersvisible) {
			addborders();
		} else {
			removeborders();
		}
	}
	
	function removeborders() {
				$('.gridelement').css({'-webkit-box-shadow':'inset 0px 0px 0px 0px gray'});
				$('.gridelement').css({'-moz-box-shadow':'inset 0px 0px 0px 0px gray'});
				$('.gridelement').css({'box-shadow':'inset 0px 0px 0px 0px gray'});
	
	}
	
	function addborders() {
				$('.gridelement').css({'-webkit-box-shadow':'inset 0px 0px 0px 3px gray'});
				$('.gridelement').css({'-moz-box-shadow':'inset 0px 0px 0px 3px gray'});
				$('.gridelement').css({'box-shadow':'inset 0px 0px 0px 3px gray'});
	
	}
	
	function divide() {
		
	}
	
	function removemediaelementmarks() {
		$('.mediaelement').removeClass('borderglowing');
	}
	
	
	function getHtml() {
		//$('#row2').html("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
		var temptext = $('#gridcontainer').html();

		
		alert(temptext);
	}
	
	function setdir(str) {
		pos=str;
		$('#status').text(str);
	}
	
	function deletemediaelement() {
		$('#' + contextmenumediasource).remove(); 
	}
	
	// aufgerufen wenn die groesse / scope des gridelements (fenster) veraendert wird
	// 600 px als basishoehe -> zu Berechnung der Schriftgroesse
	function resizegridcontainer() {
		hidemarker();
		var containerratio = $('#container').width()/$('#container').height();
		if (containerratio < aspectratio) {
			$('#gridcontainer').css('min-width', '70%');
			$('#gridcontainer').css('max-width', '70%');
			$('#gridcontainer').css('left', '10%');
			$('#gridcontainer').css('right', '20%');
			var newheight =  $('#gridcontainer').width()/aspectratio;
			//alert(aspectratio + '; ' + $('#gridcontainer').width() + '; '+ newheight);
			$('#gridcontainer').css('max-height', newheight);
			$('#gridcontainer').css('min-height', newheight);
		} else {
			var containerheight = $('#container').height();
			$('#gridcontainer').css('min-height', containerheight*0.8);
			$('#gridcontainer').css('max-height', containerheight*0.8);
			$('#gridcontainer').css('top', containerheight*0.1);
			//$('#gridcontainer').css('bottom', '10%');
			var newwidth =  $('#gridcontainer').height()*aspectratio;
			// alert(newwidth + '   ' + $('#container').height());
			//alert(aspectratio + '; ' + $('#gridcontainer').width() + '; '+ newheight);
			$('#gridcontainer').css('max-width', newwidth);
			$('#gridcontainer').css('min-width', newwidth);
		}
		var gridcontainerheight = $('#gridcontainer').height();
		// 600 px containerheight = font-size 1em
		relativefontsize = gridcontainerheight / 600;
		$('.gridelement').css('font-size', relativefontsize + 'em');
		//$('.textmediaoutput').css('font-size', (relativefontsize * 1.72222) + 'em');
		$('.textmediaoutput').css('font-size', '100%');
		$('.textmediaoutput').css('line-height', '150%');
		
	//	$('.textmediaoutput').css('line-height', relativefontsize*() + 'em');
		
	}
	
	function setpageaspectratio() {
		inputwidth = $('#aspectwidth').val();
		inputheight = $('#aspectheight').val();
		if ($.isNumeric(inputwidth) && $.isNumeric(inputheight)) {
			if ((inputwidth*1>inputheight*1)) {
				$('#gridcontainer').css('height', 600*(inputheight/inputwidth));
				$('#gridcontainer').css('width',  600);
			} else {
				$('#gridcontainer').css('height',  600);
				$('#gridcontainer').css('width', 600*(inputwidth/inputheight));
			
			}
		}		
	}
	
	function deletegridelement(deletedelementid, otherelementid) {
		console.log(deletedelementid + ' ' + otherelementid)
		var deletedelement = $('#' +deletedelementid);
		var otherelement = $('#' +otherelementid);
		// Set new size		
		var deletedelementwidth = parseFloat(deletedelement[0].style.width);
		var otherelementwidth  	= parseFloat(otherelement[0].style.width);
		var deletedelementheight = parseFloat(deletedelement[0].style.height);
		var otherelementheight 	= parseFloat(otherelement[0].style.height);
		var gridcontainerheight = parseFloat($('#gridcontainer')[0].style.height);
		var gridcontainerwidth 	= parseFloat($('#gridcontainer')[0].style.width);
		var deletedleft 		= parseFloat(deletedelement[0].style.left);
		var deletedtop 			= parseFloat(deletedelement[0].style.top);
		var othertop 			= parseFloat(otherelement[0].style.top);
		var otherleft 			= parseFloat(otherelement[0].style.left);
		//var deletedelementleft	= (deletedelement.position().left 	/ gridcontainerwidth)  * 100;
		//var deletedelementtop	= (deletedelement.position().top  	/ gridcontainerheight) * 100;
		//var otherelementleft	= (otherelement.position().left 	/  gridcontainerwidth) 	* 100;
		//var otherelementtop		= (otherelement.position().top  	/  gridcontainerheight) * 100;
		
		
	//	if (deletedelementheight == otherelementheight) {
		if (deletedelement.position().top  == otherelement.position().top) {
			otherelement.css({'width' 	 	: (otherelementwidth+deletedelementwidth) + '%'}); 
			otherelement.css({'width-max' 	: (otherelementwidth+deletedelementwidth) +'%'});
		} else {
			otherelement.css({'height' 	 	: (otherelementheight+deletedelementheight) + '%'}); 
			otherelement.css({'height-max' 	: (otherelementheight+deletedelementheight) +'%'});
		}
		
		
		console.log("LEFT: " + deletedleft + "; RIGHT: " + otherleft);
		otherelement.css({'left' : Math.min(deletedleft, otherleft) + '%'}); 
		otherelement.css({'top'  : Math.min(deletedtop,  othertop) + '%'});
		
		deletedelement.remove();
		updateHTML();
	}
	
	
	function unmarkmediaallmediaelements() {
		$('.optionsmenu').hide();
		$('#pageoptionmenu').show();
		
		currentmarkedid = 0;
		$('.mediaelement').removeClass('borderglowing');
		$('.mediaelement').draggable('disable');
	}
	
	
	function hidetextbar() {
		$('#textbar').hide();
	}

	
	function hidemarker() {
		$('#divisionmarker').hide();
	
	}