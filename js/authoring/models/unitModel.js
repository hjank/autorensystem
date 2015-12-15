/**
 * Created by Helena on 04.09.2015.
 */


function Unit() {

    this._name = "";                // displayed name
    this._uuid = "";                // UUID of the unit
    this._description = "";         // description of the unit
    this._sat = "all";              // how much context information have to be satisfied
    this._contextData = [];         // list containing context information
    this._metaData = [];            // list containing meta data
    this._posX = 0;                 // absolute X position in the displayed container
    this._posY = 0;                 // absolute Y position in the displayed container

    return this;
}

// getters
Unit.prototype.getName = function() {
    return this._name;
};
Unit.prototype.getUUID = function() {
    return this._uuid;
};
Unit.prototype.getDescription = function() {
    return this._description;
};
Unit.prototype.getSat = function() {
    return this._sat;
};
Unit.prototype.getPosX = function() {
    return this._posX;
};
Unit.prototype.getPosY = function() {
    return this._posY;
};
Unit.prototype.getContextData = function() {
    return this._contextData;
};
Unit.prototype.getMetaData = function() {
    return this._metaData;
};

// setters
Unit.prototype.setName = function(name) {
    this._name = name;
};
Unit.prototype.setUUID = function(uuid) {
    this._uuid = uuid;
};
Unit.prototype.setDescription = function(description) {
    this._description = description;
};
Unit.prototype.setSat = function(sat) {
    this._sat = sat;
};
Unit.prototype.setPosX = function(posX) {
    this._posX = posX;
};
Unit.prototype.setPosY = function(posY) {
    this._posY = posY;
};

// adders
Unit.prototype.addContextInfo = function(ci, index) {
    if (typeof index != "undefined")
        this._contextData[index] = ci;
    else
        this._contextData.push(ci);
};
Unit.prototype.addMetaInfo = function(mi) {
    this._metaData.push(mi);
};

// remover
Unit.prototype.removeContextInfoByIndex = function(index) {
    this._contextData.splice(index, 1);
};


/**
 * Function deletes selected unit from the working place.
 * */
function deleteUnitFromModel(unitName) {

    // get current scenario name
    var currentScenario = $("#lname")[0].innerHTML;

    // update gui
    var thisScenario = authorSystemContent.getScenario(currentScenario);
    thisScenario.removeUnit(thisScenario.getUnitByName(unitName));


  /*  for (var j=0; j<myAuthorSystem.length; j++) {
        if (myAuthorSystem[j]["name"] == currentScenario) {
            for (var k=0; k<myAuthorSystem[j]["units"].length; k++) {

                // Note: unit deletion on working place see statemachine.js
                /!*$("#stm").children("div.w").children("div.title").each(function() {
                 if (this.innerHTML == unit) {
                 $(this).parent().remove();
                 }
                 });*!/

                // delete unit in JSON structure
                if (myAuthorSystem[j]["units"][k]["name"] == unitName) {
                    myAuthorSystem[j]["units"].splice(k, 1);
                }

            }
        }
    }*/

    // all tab content invisible
    $(".tabContents").hide();
    $(".tab-Container").hide();
}



/**
 * The following function and comment are taken from:
 * https://github.com/University-of-Potsdam-MM/UP.App/blob/bdcd669ae4a75e4666b4bf7c0750a94262e9d5c1/www/js/lib/utils.js
 * (courtesy of Alexander Kiy)
 *
 * Generates a uuid v4. Code is taken from broofas answer in http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 */
var uuid4 = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};