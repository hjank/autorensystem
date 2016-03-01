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
    this._scenario = {};            // a reference to the scenario this unit belongs to (needed to get at connections)

    return this;
}

// support "casting" a duck-typed JSON object to Parameter
Unit.prototype.fromJSON = function(item, scenario) {
    // copy all values (shallow copy)
    for (var i in item) this[i] = item[i];

    // "cast" units to type Unit (deep copy)
    var contextData = [];
    for (var ic in this._contextData) {
        contextData.push(new ContextInformation().fromJSON(this._contextData[ic]));
    }
    this._contextData = contextData;
    this._scenario = scenario;

    return this;
};

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
Unit.prototype.getScenario = function() {
    return this._scenario;
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
Unit.prototype.setScenarioReference = function(scenario) {
    this._scenario = scenario;
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


/***** JSON-LD formatting *****/

/**
 * Produce a sub-graph for this unit (array of JSON-LD objects) to be added to JSON-LD
 * NOTE: Metadata are not yet included in JSON-LD since a matching of this._metadata and T-Box predicates is needed first.
 * @returns {Array} A sub-graph (array) containing one named JSON-LD individuals for: unit, contextInfos, parameters.
 */
Unit.prototype.getJSONLDGraph = function () {
    // the sub-graph to be returned
    var graphJSONLD = [];

    // for this unit, create a new JSON-LD named individual object
    var unitJSONLD = {
        "@id" : "abox:"+this._uuid,
        "@type" : [ "kno:LearningUnit", "owl:NamedIndividual" ],
        "kno:hasLID" : this._uuid,
        "kno:hasLogicalOperator" : (this._sat == "all") ? "AND" : "OR"
    };

    // if this unit has context information, get JSON-LD named individual objects for context items (incl. parameters)
    var contextReferenceJSONLDList = [];
    for (var i in this._contextData) {
        // get a JSON-LD-containing object for each context item
        var contextJSONLD = this._contextData[i].getJSONLD();

        // add references to these named JSON-LD individuals to the unit individual
        contextReferenceJSONLDList.push( {"@id" : contextJSONLD.contextInfoJSONLD["@id"]} );

        // add the context info JSON-LD individual to the partial ontology graph
        graphJSONLD.push(contextJSONLD.contextInfoJSONLD);
        // add each parameter JSON-LD individual to the partial ontology graph
        for (var j in contextJSONLD.parameterJSONLD)
            graphJSONLD.push(contextJSONLD.parameterJSONLD[j]);
    }
    // add context reference(s) to unit JSON-LD individual, if existent
    if (contextReferenceJSONLDList.length == 1)
        unitJSONLD["kno:hasMeasurableContextInformation"] = contextReferenceJSONLDList[0];
    else if (contextReferenceJSONLDList.length > 1)
        unitJSONLD["kno:hasMeasurableContextInformation"] = contextReferenceJSONLDList;


    // metadata - only high-level placeholder at this point.
    // NOTE: There are no metadata yet. In case there will be - TODO: metadata must match with T-Box!
    for (var m in this._metaData)
        unitJSONLD["kno:hasMetaData"] = this._metaData[m];

    // relations
    var connections = this._scenario.getConnections();
    for (var c in connections) {
        var connection = connections[c];

        // if this unit is the source of a connection, add statement "[unit] kno:has... [target]"
        if (connection.hasSource(this._uuid))
            unitJSONLD[translate_relationLabelForward(connection.getLabel())] = {
                "@id" : "abox:"+connection.getTargetId()
            };

        // if this unit is the target of a connection, add statement "[unit] kno:is...Of [source]"
        if (connection.hasTarget(this._uuid))
            unitJSONLD[translate_relationLabelBackward(connection.getLabel())] = {
                "@id" : "abox:"+connection.getSourceId()
            };
    }

    // add the unit's JSON-LD individual
    graphJSONLD.push(unitJSONLD);

    return graphJSONLD;
};