/**
 * Created by elis on 07.09.2015.
 */

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

Scenario.prototype.getUnits = function() {
    return this._units;
};

Scenario.prototype.getUnitByName = function(unitName) {
    for (var i in this._units) {
        var unit = this._units[i];
        if (unit.name == unitName)
            return unit;
    }
};

Scenario.prototype.getUnitByUUID = function(uuid) {
    for (var i in this._units) {
        var unit = this._units[i];
        if (unit.uuid == uuid)
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
        if (conn.getID() === connId)
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


// TODO: Incorporate the following two functions into scenario model.

function changeScenarioName(oldName, newName) {
    authorSystemContent.getScenario(oldName).setName(newName);
}

// TODO: Use unit model for this.
function addUnitToScenarioModel(scenarioName, uuid) {
    authorSystemContent.getScenario(scenarioName).addUnit({
        uuid: uuid,                 // a (hopefully truly) unique id for this unit
        name:global_currentInputUnitName,            // displayed name
        description:"",             // description of the unit
        sat:"all",                  // how much context information have to be satisfied
        contextInformations:[],     // list of containing context information
        metaData:[],                // list of containing meta data
        //connections:[],           // list of connections with other units
        posX:0,                     // absolute X position in the displayed container
        posY:0                      // absolute Y position in the displayed container
    });
}