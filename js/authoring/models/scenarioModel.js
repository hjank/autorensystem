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
        if (unit.getName() == unitName)
            return unit;
    }
};

Scenario.prototype.getUnitByUUID = function(uuid) {
    for (var i in this._units) {
        var unit = this._units[i];
        if (unit.getUUID() == uuid)
            return unit;
    }
};

Scenario.prototype.addUnit = function(unit) {
    this._units.push(unit);
};

Scenario.prototype.removeUnit = function(unit) {
    var index = this._units.indexOf(unit);
    if (index > -1) {
        // first, remove connections attached to that unit
        for (var i in this._connections) {
            var conn = this._connections[i];
            if (conn.connectsUnit(unit.getUUID()))
                this.removeConnection(conn.getID());
        }
        // then, remove the unit
        this._units.splice(index, 1);
    }
};

Scenario.prototype.getConnectionByID = function(connId) {
    for (var i in this._connections) {
        var conn = this._connections[i];
        if (conn.getID() == connId)
            return conn;
    }
};

Scenario.prototype.getConnections = function() {
    return this._connections;
};

Scenario.prototype.addConnection = function(conn) {
    this._connections.push(conn);
};

Scenario.prototype.removeConnection = function(connId) {
    for (var i in this._connections) {
        var conn = this._connections[i];
        if (conn.getID() == connId)
            this._connections.splice(i, 1);
    }
};

/**
 * Goes through all units of this scenario and gets (copies of) their associated context information items.
 * Chosen values will be reset to "".
 *
 * @returns {Array} A list of all context items relevant to this scenario.
 */
Scenario.prototype.getScenarioContext = function() {
    var contextList = [];
    // for each unit ...
    for (var i in this._units) {
        // ... get its associated context items
        var unitContext = this._units[i].getContextData();
        for (var j in unitContext) {
            // make a deep copy of each
            var contextItem = new ContextInformation().fromJSON(unitContext[j]);
            // reset chosen values
            contextItem.resetAllValues();

            // and add it to return list, avoiding unnecessary duplicates
            if (contextList.indexOf(contextItem) == -1)
                contextList.push(contextItem);
        }
    }
    return contextList;
};

/**
 * Find out if any context was added to any of the units in this scenario.
 * @returns {boolean} true if there is context, else false.
 */
Scenario.prototype.hasContext = function() {
    for (var i in this._units)
        if (this._units[i].getContextData().length != 0) return true;
    return false;
};


/************* JSON-LD formatting *************/

/**
 * Create an A-Box in JSON-LD for this scenario.
 * @returns {ABoxJSONLD} The A-Box.
 */
Scenario.prototype.getABoxJSONLD = function() {
    var aBoxJSONLD = new ABoxJSONLD();

    // for each unit ...
    for (var i in this._units) {
        // ... get its JSON-LD (a list of JSON-LD named individuals)
        var unitJSONLDGraph = this._units[i].getJSONLDGraph();
        // ... add all unique items (individuals) in this list to A-Box graph
        for (var j in unitJSONLDGraph) {
            var unitJSONLD = unitJSONLDGraph[j];
            // prevent unnecessary duplicates
            if (!aBoxJSONLD.containsIndividual(unitJSONLD))
                aBoxJSONLD.addToGraph(unitJSONLD);
        }
    }
    return aBoxJSONLD.getABoxJSONLD();
};