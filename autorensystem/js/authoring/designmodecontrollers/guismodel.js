guis = [];

function createNewGUI(unitid) {
	var newGUIHTML = 	'<div id="gridcontainer" class="centered" data-ratioheight="3" data-ratiowidth="4" data-idcounter="0" data-padding="1" data-showborders="true" data-gridpadding="1" data-unitid="' + unitid + '" style="display:block"><div class="gridelement" value="0" style="width:100%;height:100%;top:0%;left:0%;" id="me' + newid() + '"></div></div>';
	//addHTML(unitid, newGUIHTML);
	$("#gridcontainer").replaceWith(newGUIHTML);
	init2();
}

function addCurrentGUI() {
	console.log("vorher: " + JSON.stringify(guis));
	var currentjson = grid2json();
	var index = getGUIIndex(currentUnitUUID);
	if (index == -1) {
		guis.push(currentjson);
		console.log("create: " + JSON.stringify(guis));
	} else {
		guis[index] = currentjson;
		console.log("updated: " + JSON.stringify(guis));
	}
	console.log('Autorensystem: ' + JSON.stringify(authorSystemContent));
}

function getGUIIndex(unitid) {
	var out = -1;
	for (var i=0; i<guis.length; i++) {
		console.log("aktuelle Gui:" + JSON.stringify(guis[i]));
		console.log("guis " + i + " = guis[i].unitid");
		console.log(guis[i].unitid + " =? " + unitid);
		if (guis[i].unitid == unitid) {
			out = i;
		}
	 }
	 return out;
}

function loadOrCreateGUIHTML(unitid) {
	if (getGUIIndex(unitid) == -1) {
		createNewGUI(unitid);
		console.log("create: " + unitid);
		console.log(JSON.stringify(guis));
	} else {
		getGUIHTML(unitid);
		console.log("load: " + unitid);
		console.log(JSON.stringify(guis));
	}
	//$('#gridcontainer').replaceWith(out);
	//init2();
}

function getGUIHTML(unitid) {
	 for (var i = 0; i < guis.length; i++) {
		 if (guis[i].unitid == unitid) {
			 json2grid(guis[i]);
		 }
	 }
}

function updateHTML() {
	addCurrentGUI();
	authorSystemContent.setGUIs(guis);
}

/* Controller */
$( document ).ready(function() {
	$( "#gridcontainer" ).find( "*" ).on("click", function(e){
			//updateHTML();
			alert(test);
		//alert("inside: " + insidegridelementevent(e));
		//updateHTML();
	});

	// Aktualisierung

	// TODO: Fehlerabfangen moeglich? (wenn grafische darstellung nichts mit dem aktuelle Typ zu tun hat)
/*	$(document).on("click", function(e){
		if (insidegridelementevent(e)) {
			//updateHTML();
			console.log('inside: ' +  e.pageX + ' ' + e.pageY);
		}
		//alert("inside: " + insidegridelementevent(e));
		//updateHTML();
	});

	$(document).on("mouseup", function(e){
		//updateHTML();
	});

	$(document).on("mousedown", function(e){
		//updateHTML();
	});
*/
 $(document).keypress(function(e) {
  if(e.which == 65) {
    for(var b in window) { 
		if(window.hasOwnProperty(b)) console.log(b); 
	}
  }
  });
  
  
  $("#showHelp").click(function(e) {
    for(var b in window) { 
		if(window.hasOwnProperty(b)) console.log(b); 
	}
  });
 
});




