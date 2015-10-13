/**
 * Created by elis on 07.09.2015.
 */


// probably shouldn't be here
$(function() {
    // sets the trigger for if save scenario was clicked
    $("#saveScenario").on("click", showSaveScenario);
});

function Scenario() {

    this._name = "";
    this._units = [];
    this._connections = [];

    return this;

}

Scenario.prototype.getName = function() {
    return this._name;
};
Scenario.prototype.setName = function(name) {
    this._name = name;
};

Scenario.prototype.getUnit = function(unitName) {
    for (var i in this._units) {
        var unit = this._units[i];
        if (unit.name == unitName)
            return unit;
    }
};

Scenario.prototype.addUnit = function(unit) {
    this._units.push(unit);
};

Scenario.prototype.removeUnit = function(unit) {
    var index = this._units.indexOf(unit);
    if (index > -1)
        this._units.splice(index, 1);
};

Scenario.prototype.getConnection = function(connId) {
    for (var i in this._connections) {
        var conn = this._connections[i];
        if (conn.connId == connId)
            return conn;
    }
};

Scenario.prototype.getConnections = function() {
    return this._connections;
};

Scenario.prototype.addConnection = function(conn) {
    this._connections.push(conn);
};

Scenario.prototype.removeConnection = function(conn) {
    var index = this._connections.indexOf(conn);
    if (index > -1)
        this._connections.splice(index, 1);
};


function changeScenarioName(oldName, newName) {
    for (var m=0; m<myAuthorSystem.length; m++) {
        if (myAuthorSystem[m].name == oldName) {
            myAuthorSystem[m].name = newName;
        }
    }
}

function addUnitToScenarioModel(scenarioName) {

    for (var k=0; k<myAuthorSystem.length; k++) {
        if (myAuthorSystem[k]["name"] == scenarioName) {
            myAuthorSystem[k]["units"].push(
                {   name:global_currentInputUnitName,            // displayed name
                    description:"",             // description of the unit
                    sat:"all",                  // how much context information have to be satisfied
                    contextInformations:[],     // list of containing context information
                    metaData:[],                // list of containing meta data
                    //connections:[],           // list of connections with other units
                    posX:0,                     // absolute X position in the displayed container
                    posY:0                      // absolute Y position in the displayed container
                }
            );
        }
    }
}

// triggered if save scenario was clicked
/**
 * Function saves current open scenario as a JSON file.
 */
function showSaveScenario() {

    // get current scenario name
    var currentScenario = $("#lname")[0].innerHTML;
    var json;
    var jsonFile = null;

    // find current scenario in all scenarios
    for (var i=0; i<myAuthorSystem.length; i++) {
        if (myAuthorSystem[i].name == currentScenario) {
            json = JSON.stringify(myAuthorSystem[i]);
            break;
        }
    }

    // set blob with JSON data
    var data = new Blob([json], {type: "text/json;charset=utf8"});

    // if file will be replaced by another one --> avoid memory leak
    if (jsonFile !== null) {
        window.URL.revokeObjectURL(jsonFile);
    }
    // set JSON file
    jsonFile = window.URL.createObjectURL(data);

    // change file name to current scenario name
    $("#saveScenario").children("a")[0].download = currentScenario + ".json";

    // add link and open download view
    $("#saveScenario").children("a")[0].href = jsonFile;

    // show json in new window
    /*var url = "data:text/json;charset=utf8," + encodeURIComponent(JSON.stringify(myAuthorSystem));
     window.open(url, "_blank");
     window.focus();*/
}