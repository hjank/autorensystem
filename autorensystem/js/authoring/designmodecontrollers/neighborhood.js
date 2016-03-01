// surrounding - alle  angerenzenden Felder (gridelements)
// neighbor - "surrounding" Felder, die gemeinsame Seitenraender (gleiche Laenge) teilen


	function getmyneighbors(me) {
		var neighborslist = [];
		var outlist = []
		$('#gridcontainer').find('.gridelement').each(function(){
			
			if (isneighbor(me, $(this))) {
				neighborslist.push($(this).attr('id'));
				outlist.push($(this));
			}
		});
		//alert(neighborslist);
		$('#infotext3').html('Nachbar: ' + neighborslist);
		return outlist;
	}

	function prox(in1, in2) {
		// TODO: funktioniert nicht, wenn alle in einer Reihe sind...
		var tv = 30;
		if (!(in1 < in2-tv) && !(in2+tv < in1)) {
			return true;
		} else {
			return false; 
		}			
	}
	
	
	
	
	// Checks if two elements are neighboring
	function isneighbor(thiselement, testedelement)  {	
		if (thiselement.attr('id') == testedelement.attr('id')) {
			return false;
		}
		//alert('Nachbarschaftsbeziehung: ' + neighboringdirection);
		return (getneighboringdirection(thiselement, testedelement) != 'undef') 
	}
	
	// gibt für eine Element an welche Richtung hin ein andere mit ihm benachbart ist.
/*
	function getneighboringdirection(thiselement, testedelement) {
		neighboringdirection = 'undef';
		if (thiselement.attr('id') == testedelement.attr('id')) {
			return false;
		}
		if (thiselement.offset().top == testedelement.offset().top) {
			if (thiselement.height() == testedelement.height()) {
				if (prox(testedelement.offset().left+testedelement.width(), thiselement.offset().left)) {
					neighboringdirection = 'right';
				} else if (prox(testedelement.offset().left, thiselement.offset().left+thiselement.width())) {
					neighboringdirection = 'left';
				}
			}
		} else if (thiselement.offset().left == testedelement.offset().left) {
			if (thiselement.width() == testedelement.width()) {
				if (prox(testedelement.offset().top+testedelement.height(), thiselement.offset().top)) {
					neighboringdirection = 'bottom';
				} else if (prox(testedelement.offset().top, thiselement.offset().top+thiselement.height())) {
					neighboringdirection = 'top';
				}
			}
		}
		return neighboringdirection;
	}
*/
	
	
	
	function getneighboringdirection(testedelement, thiselement) {
		neighboringdirection = 'undef';	
		if (thiselement.attr('id') == testedelement.attr('id')) {
			return 'undef';
		}
		var thisTL = [ parseFloat(thiselement[0].style.top), parseFloat(thiselement[0].style.left) ];
		var thisTR = [ parseFloat(thiselement[0].style.top), parseFloat(thiselement[0].style.left)+parseFloat(thiselement[0].style.width) ];
		var thisBL = [ parseFloat(thiselement[0].style.top) + parseFloat(thiselement[0].style.height), parseFloat(thiselement[0].style.left) ];
		var thisBR = [ parseFloat(thiselement[0].style.top) + parseFloat(thiselement[0].style.height), parseFloat(thiselement[0].style.left)+parseFloat(thiselement[0].style.width) ];
		
		//console.log(JSON.stringify(thisTL) + '  ' + JSON.stringify(thisTR) + '  ' + JSON.stringify(thisBL) + '  ' + JSON.stringify(thisBR));
		
		var testedTL = [ parseFloat(testedelement[0].style.top), parseFloat(testedelement[0].style.left) ];
		var testedTR = [ parseFloat(testedelement[0].style.top), parseFloat(testedelement[0].style.left)+parseFloat(testedelement[0].style.width) ];
		var testedBL = [ parseFloat(testedelement[0].style.top) + parseFloat(testedelement[0].style.height), parseFloat(testedelement[0].style.left) ];
		var testedBR = [ parseFloat(testedelement[0].style.top) + parseFloat(testedelement[0].style.height), parseFloat(testedelement[0].style.left)+parseFloat(testedelement[0].style.width) ];
		
		//console.log(JSON.stringify(testedTL) + '  ' + JSON.stringify(testedTR) + '  ' + JSON.stringify(testedBL) + '  ' + JSON.stringify(testedBR));
		
		
		if ((thisTL.equals(testedBL)) && (thisTR.equals(testedBR))) {
			neighboringdirection = 'top';
		} 
		
		if ((thisTL.equals(testedTR)) && (thisBL.equals(testedBR))) {
			neighboringdirection = 'left';
		}
		
		if ((thisBL.equals(testedTL)) && (thisBR.equals(testedTR))) {
			neighboringdirection = 'bottom';
		} 
		
		if ((thisTR.equals(testedTL)) && (thisBR.equals(testedBL))) {
			neighboringdirection = 'right';
		} 
		//console.log("direction: " + neighboringdirection);
		return neighboringdirection;
	}	
	
	
	function addrightneighbors(gridelementid) {
		var output = [];
		var rightneighborid = getneighbor(gridelementid, 'right')
		if (getneighbor(gridelementid, 'right') !=0) {
			output = gridelementid.concat(addrightneighbors(rightneighborid));
		}
		//alert(output);
		return output;
	}
		
	function getcurrentrow(gridelementid) {
		var rightneighbors = [];
		var leftneighbors = [];
		
		return rightneighbors.concat(gridelementid.concat(leftneighbors));
	}	
	
	
	
	
		function findright(inlist) {
		var lastid = inlist[inlist.length-1];
		var list = [];
		$('#gridcontainer').find('.gridelement').each(function(){
			var direccion = getneighboringdirection($(this), $('#'+lastid));
			if (direccion == 'right') {
				list = list.concat($(this).attr('id'));
				list = list.concat(findright(list));
				console.log('right: ' + $(this).attr('id'));
			}
		});
		return list;
	}
	
	function findleft(inlist) {
		var lastid = inlist[inlist.length-1];
		var list = [];
		$('#gridcontainer').find('.gridelement').each(function(){
			var direccion = getneighboringdirection($(this), $('#'+lastid));
			if (direccion == 'left') {
				list = list.concat(findleft(list.concat($(this).attr('id'))));
				list = list.concat($(this).attr('id'));
				console.log('right: ' + $(this).attr('id'));
			}
		});
		return list;
	}
	
	
	// Gibt Liste alle Elemente aus, die sie sich mit dem Eingabe-Element in einer Reihe befinden (d.h. Nachbarn, Nachbarsnachbarn etc. mit der selben Hoehe)
	// Liste in der Reihenfolge von links nach rechts
	function getmyrow(gridelementid) {
		var neighbor = '0';
		var leftlist =	[];
		var rightlist = [];
		var outlist = [];
		$('#gridcontainer').find('.gridelement').each(function(){
			var direccion = getneighboringdirection($(this), $('#'+gridelementid));
			if (direccion == 'right') {
				rightlist = rightlist.concat($(this).attr('id'));
				rightlist = rightlist.concat(findright(rightlist));
				console.log('right: ' + $(this).attr('id'));
				console.log('Rechte Liste: ' + rightlist);
			} 
			if (direccion == 'left') {
				leftlist = leftlist.concat(findleft(leftlist.concat($(this).attr('id'))));
				leftlist = leftlist.concat($(this).attr('id'));
				console.log('left: ' + $(this).attr('id'));
				console.log('Linke Liste: ' + leftlist);
			} 			
			console.log($(this).attr('id') + '  ' + gridelementid + ':  ' + direccion);
		});
		outlist = leftlist.concat(gridelementid).concat(rightlist); //leftlist.push(rightlist.push(gridelementid));
		//alert(JSON.stringify(outlist));
		return outlist;
		//return output;
	} 
	
	
	
		function hasneighbor(thiselement, dir) {
		var neighbors= getmyneighbors(thiselement);
		var containsdir = false;
		for (i=0; i<neighbors.length;i++) {
			if (dir == getneighboringdirection(neighbors[i], thiselement)) {
				constainsdir = true;
				return true;
			}
		}
		return containsdir;
	}
	
	
	function getneighbor(thiselement, dir) {
		var neighbors= getmyneighbors(thiselement);
		var neighborid = '0';
		for (i=0; i<neighbors.length;i++) {
			if (dir == getneighboringdirection(neighbors[i], thiselement)) {
				neighborid = neighbors[i].attr('id');
				return neighborid;
			}
		}
		return neighborid;
	}
	
	
	
	
		// Array-Vergleich
	// Quelle: http://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
		// Warn if overriding existing method
	if(Array.prototype.equals)
		console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
	// attach the .equals method to Array's prototype to call it on any array
	Array.prototype.equals = function (array) {
		// if the other array is a falsy value, return
		if (!array)
			return false;

		// compare lengths - can save a lot of time 
		if (this.length != array.length)
			return false;

		for (var i = 0, l=this.length; i < l; i++) {
			// Check if we have nested arrays
			if (this[i] instanceof Array && array[i] instanceof Array) {
				// recurse into the nested arrays
				if (!this[i].equals(array[i]))
					return false;       
			}           
			else if (this[i] != array[i]) { 
				// Warning - two different object instances will never be equal: {x:20} != {x:20}
				return false;   
			}           
		}       
		return true;
	}
	// Hide method from for-in loops
	Object.defineProperty(Array.prototype, "equals", {enumerable: false});