/**
 * Created by Helena on 04.09.2015.
 */


function Unit() {

    this._name = "";                // displayed name
    this._description = "";         // description of the unit
    this._sat = "all";              // how much context information have to be satisfied
    this._contextData = [];         // list containing context information
    this._metaData = [];            // list containing meta data
    this._posX = 0;                 // absolute X position in the displayed container
    this._posY = 0;                 // absolute Y position in the displayed container

    return this;
}

// getter
Unit.prototype.getName = function() {
    return this._name;
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

// setter
Unit.prototype.setName = function(name) {
    this._name = name;
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
Unit.prototype.addContextInfo = function(ci) {
    this._contextData.push(ci);
};
Unit.prototype.addMetaInfo = function(mi) {
    this._metaData.push(mi);
};



/**
 * Function deletes selected unit from the working place.
 * */
function deleteUnitFromModel() {

    // get current scenario name
    var currentScenario = $("#lname")[0].innerHTML;

    // update gui
    for (var j=0; j<myAuthorSystem.length; j++) {
        if (myAuthorSystem[j]["name"] == currentScenario) {
            for (var k=0; k<myAuthorSystem[j]["units"].length; k++) {

                // Note: unit deletion on working place see statemachine.js
                /*$("#stm").children("div.w").children("div.title").each(function() {
                 if (this.innerHTML == unit) {
                 $(this).parent().remove();
                 }
                 });*/

                // delete unit in JSON structure
                if (myAuthorSystem[j]["units"][k]["name"] == unit) {
                    myAuthorSystem[j]["units"].splice(k, 1);
                }

            }
        }
    }

    // all tab content invisible
    $(".tabContents").hide();
    $(".tab-Container").hide();
}