	function setdivisionmarker(id) {
		var elementoffset = $('#' + id).offset();
		$('#divisionmarker').show();
		
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

	function hidedivisionmarker(id) {
		$('#divisionmarker').show();
	}
	
	