var guis = [];

function getGUIByUnitID(id) {
	var currentGUI = {};
	for (var index in guis) {
		if (guis[index].unitID == id) {
			return gui;
		}
	}
	return {};
}

function insertGUI(gui) {
	var id = gui.unitID();
	var oldgui = getGUIByUnitID(gui.unitID);
	if ($.isEmptyObject(oldgui)) {	
		guis.push(gui);
	} else {
		removeGUIByUnitID(gui);
		guis.push(gui);
	}
}


function removeGUIByUnitID(id) {
	gui = getGUIByUnitID(id);
	var index = guis.indexOf(gui);
	if (index > -1) {
		guis.splice(index, 1);
	}
}

