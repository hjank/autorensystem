	function initdividefunctions() {
		$( '.gridelement' ).click(function() {
			dividegridelement($(this)); 
		});	
		$('.gridelement').css('font-size', relativefontsize + 'em');
	};

	$(document).mousemove(function(e) {
		if (!(insidegridelementevent(e))) {
			$('#divisionmarker').hide();
			$('#sizemarker').hide();
		}
	});
	
	// Darstellung des Teilungs-Markers
	function setdivisionmarker(id) {
		var elementoffset = $('#' + id).offset();
		$('#divisionmarker').show();
		/*if (pos=='left') {
			$('#divisionmarker').height($('#' + id).height());
			$('#divisionmarker').width(2);
			$('#divisionmarker').offset( {top: elementoffset.top, left: elementoffset.left + 3} ) ;
		}
		
		if (pos=='right') {
			$('#divisionmarker').height($('#' + id).height());
			$('#divisionmarker').width(2);
			$('#divisionmarker').offset( {top: elementoffset.top, left: elementoffset.left+$('#' + id).width()} ) ;
		}
		
		if (pos=='top') {
			$('#divisionmarker').width($('#' + id).width());
			$('#divisionmarker').height(2);
			$('#divisionmarker').offset( {top: elementoffset.top + 3, left: elementoffset.left} ) ;
		}
		
		if (pos=='bottom') {
			$('#divisionmarker').width($('#' + id).width());
			$('#divisionmarker').height(2);
			$('#divisionmarker').offset( {top: elementoffset.top + +$('#' + id).height(), left: elementoffset.left} ) ;
		}
		*/
		
		if ((pos=='right') || (pos=='left')) {
			$('#divisionmarker').height($('#' + id).outerHeight());
			$('#divisionmarker').width(2);
			$('#divisionmarker').offset( {top: elementoffset.top, left: (elementoffset.left+$('#' + id).outerWidth()/2)} ) ;
		}
		
		if ((pos=='top') || (pos=='bottom')) {
			$('#divisionmarker').width($('#' + id).outerWidth());
			$('#divisionmarker').height(2);
			$('#divisionmarker').offset( {top: elementoffset.top+($('#' + id).outerHeight()/2), left: elementoffset.left} ) ;
		}
		
		
	}
	
	
	
	
	// Position innerhalb eines Gridelements (left, right, top, bottom)
	// (Gridelement wird dazu durch die Diagonalen in vier Teile geteilt)
	function getdirection(id,mouse) {
		var left = 0;
		var top = 0;
		var height = $('#'+id).height();
		var width= $('#'+id).width();
		//alert(id + ' ' + height + ' ' + width);
		var slope = height/width;
		var positioncode1 = 0;
		var positioncode2 = 0;

		
		if ((slope*mouse.left) > mouse.top) {
			positioncode1 = 1;
			// unterhalb 	=> rechts oder oben
		} else {
			positioncode1 = 2; 
			// oberhalb  	=> links oder unten
		}
		
		
		// reverse 
		if ((slope*(width-mouse.left)) > (mouse.top)) {
			positioncode2 = 10;
			// unterhalb 	=>  links oder oben
		} else {
			positioncode2 = 20;
			// oberhalb 	=> 	rechts oder unten
		}
		
		pcsum = positioncode1 + positioncode2;
		

		
		switch(pcsum) {
		case 11:
			//pos = 'top';
			pos = 'left';
			break;
		case 12:
			pos = 'top';
			//pos = 'left';
			break;
		case 21:
			pos = 'bottom';
			//pos = 'right';
			break;
		case 22:
			pos = 'right';
			//pos = 'bottom';
			break;
		default:
			pos = 'undef';
		} 
		
		return pos;
	}
		
		// Erzeugung eines neuen Gridelements -> Effekt des Aufteilens in zwei gleich grosse Gridelemente
		// Urspruengliches Gridelement wird halbiert, neues davor oder dahinter hinzugefuegt
		function dividegridelement(thiselement) {
				// prefix: ne - New Element, oe - OriginalElement
			var oeformerwidth   = parseFloat(thiselement[0].style.width); 	// alte Breite in Prozent 
			var oenewwidth 		= (oeformerwidth/2);						// neue Breite in Prozent
			oenewwidth 			= Math.round(oenewwidth*10) /10;					// Prozentwerte werden auf eine Nachkommastelle gerundet
			var oeformerheight  = parseFloat(thiselement[0].style.height);
			var oenewheight 	= (oeformerheight/2);
			oenewheight 		= Math.round(oenewheight*10) /10;				
			var oeformerleft	= parseFloat(thiselement[0].style.left); 	// alte Position in Prozent
			var oeformertop		= parseFloat(thiselement[0].style.top);		 
			var neid = newid();												// ID des neuen Elements

		
			//getmyneighbors($(this));		
				
			if (clickable1) {
				$('#divisionmarker').hide();
				if (pos=='right') {
					thiselement.css({'width' : oenewwidth+'%'});
					thiselement.css({'width-max' : oenewwidth+'%'});
					thiselement.after( '\n<div class="gridelement" id="gridelement' + neid +'"></div>\n' );
					// Size:
					$('#gridelement'+neid).css({'width' 	 : 	(oeformerwidth-oenewwidth)+'%'}); 
					$('#gridelement'+neid).css({'width-max' : 	(oeformerwidth-oenewwidth)+'%'});
					$('#gridelement'+neid).css({'height' 	 : 	oeformerheight+'%'}); 
					$('#gridelement'+neid).css({'width-max' : 	oeformerheight+'%'});
					// Position:
					$('#gridelement'+neid).css({'left' : oenewwidth+oeformerleft + '%'}); 
					$('#gridelement'+neid).css({'top'  : oeformertop  + '%'});
					//alert('Position: ' + relativeposleft + ' ; ' + relativepostop);	
				}
				
				
				if (pos=='left') {
					thiselement.css({'width' : oenewwidth+'%'});
					thiselement.css({'width-max' : oenewwidth+'%'});
					thiselement.after( '\n<div class="gridelement" id="gridelement' + neid +'"></div>\n' );
					// Size:
					$('#gridelement'+neid).css({'width' 	 : 	(oeformerwidth-oenewwidth)+'%'}); 
					$('#gridelement'+neid).css({'width-max' : 	(oeformerwidth-oenewwidth)+'%'});
					$('#gridelement'+neid).css({'height' 	 : 	oeformerheight+'%'}); 
					$('#gridelement'+neid).css({'height-max' : oeformerheight+'%'});
					// Position:
					$('#gridelement'+neid).css({'left' : oeformerleft + '%'}); 
					$('#gridelement'+neid).css({'top'  : oeformertop  + '%'});
					thiselement.css({'left' : (oeformerleft+oeformerwidth-oenewwidth) + '%'}); 
					thiselement.css({'top'  : oeformertop  + '%'});
					//alert('Position: ' + relativeposleft + ' ; ' + relativepostop);		
				}
				
				
				if (pos=='bottom') {
					thiselement.css({'height' : oenewheight+'%'});
					thiselement.css({'width-max' : oenewheight+'%'});
					thiselement.after( '\n<div class="gridelement" id="gridelement' + neid +'"></div>\n' );
					// Size:
					$('#gridelement'+neid).css({'width' 	 : 	oeformerwidth+'%'}); 
					$('#gridelement'+neid).css({'width-max' : 	oeformerwidth+'%'});
					$('#gridelement'+neid).css({'height' 	 : 	(oeformerheight-oenewheight)+'%'}); 
					$('#gridelement'+neid).css({'height-max' : (oeformerheight-oenewheight)+'%'});
					// Position:
					$('#gridelement'+neid).css({'left' : oeformerleft + '%'}); 
					$('#gridelement'+neid).css({'top'  : (oeformertop + oenewheight) + '%'});
					thiselement.css({'left' : oeformerleft + '%'}); 
					thiselement.css({'top'  : oeformertop + '%'});
					//alert('Position: ' + relativeposleft + ' ; ' + relativepostop);		
				}
				
				
				if (pos=='top') {
					thiselement.css({'height' : oenewheight+'%'});
					thiselement.css({'width-max' : oenewheight+'%'});
					thiselement.after( '\n<div class="gridelement" id="gridelement' + neid +'"></div>\n' );
					// Size:
					$('#gridelement'+neid).css({'width' 	 : 	oeformerwidth+'%'}); 
					$('#gridelement'+neid).css({'width-max' : 	oeformerwidth+'%'});
					$('#gridelement'+neid).css({'height' 	 : 	(oeformerheight-oenewheight)+'%'}); 
					$('#gridelement'+neid).css({'height-max' : (oeformerheight-oenewheight)+'%'});
					// Position:
					$('#gridelement'+neid).css({'left' : oeformerleft + '%'}); 
					$('#gridelement'+neid).css({'top'  : oeformertop  + '%'});
					thiselement.css({'left' : oeformerleft + '%'}); 
					thiselement.css({'top'  : oeformertop + (oeformerheight-oenewheight)+ '%'});
					//alert('Position: ' + relativeposleft + ' ; ' + relativepostop);		
				}
				
				updateHTML();
				
				
			}
			unifyborderdesign();
			$('.gridelement').unbind();
			init2();
			$('.gridelement').trigger('create');

		
		}