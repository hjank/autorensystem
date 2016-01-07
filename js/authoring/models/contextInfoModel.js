/**
 * Created by Helena on 04.09.2015.
 */

// the data structure of a context item
function ContextInformation() {

    this._id = "";
    this._classes = [];
    this._type = "";
    this._min = "";
    this._max = "";
    this._default = "";
    this._chosenValue = ""; // set by the author in unit editing
    this._operators = [];
    this._chosenOperator = "";  // set by the author in unit editing
    this._enums = [];
    this._parameters = [];

    return this;
}

// support "casting" a duck-typed JSON object to ContextInformation
ContextInformation.prototype.fromJSON = function(item) {
    // copy all values (shallow copy)
    for (i in item) this[i] = item[i];

    // "cast" parameters to type Parameter (deep copy)
    var parameters = [], tempParams = this._parameters;
    for (var ip in tempParams) {
        var param = new Parameter().fromJSON(tempParams[ip]);
        parameters.push(param);
    }
    this._parameters = parameters;

    return this;
};

// getters
ContextInformation.prototype.getID = function () {
    return this._id;
};

ContextInformation.prototype.getClasses = function () {
    return this._classes;
};

ContextInformation.prototype.getType = function () {
    return this._type;
};

ContextInformation.prototype.getMin = function () {
    return this._min;
};

ContextInformation.prototype.getMax = function () {
    return this._max;
};

ContextInformation.prototype.getDefault = function () {
    return this._default;
};

ContextInformation.prototype.getChosenValue = function () {
    return this._chosenValue;
};

ContextInformation.prototype.getOperators = function () {
    return this._operators;
};

ContextInformation.prototype.getChosenOperator = function () {
    return this._chosenOperator;
};

ContextInformation.prototype.getEnums = function () {
    return this._enums;
};

ContextInformation.prototype.getParameters = function () {
    return this._parameters;
};

// setters
ContextInformation.prototype.setID = function (id) {
    this._id = id;
};

ContextInformation.prototype.setClasses = function (classes) {
    this._classes = classes;
};

ContextInformation.prototype.setType = function (type) {
    this._type = type;
};

ContextInformation.prototype.setMin = function (min) {
    if (min)
        this._min = min;
};

ContextInformation.prototype.setMax = function (max) {
    if (max)
        this._max = max;
};

ContextInformation.prototype.setDefault = function (def) {
    if (def)
        this._default = def;
};

ContextInformation.prototype.setChosenValue = function (value) {
    this._chosenValue = value;
};

ContextInformation.prototype.setOperators = function (operators) {
    this._operators = operators;
};

ContextInformation.prototype.setChosenOperator = function (operator) {
    this._chosenOperator = operator;
};

ContextInformation.prototype.setEnums = function (enums) {
    this._enums = enums;
};

ContextInformation.prototype.setParameters = function (parameters) {
    this._parameters = parameters;
};

// reset all chosen values
ContextInformation.prototype.resetAllValues = function() {
    this._chosenOperator = "";
    this._chosenValue = "";
    for (var i in this._parameters)
        this._parameters[i].resetValue();
};


/***** JSON-LD formatting *****/

ContextInformation.prototype.getJSONLD = function () {
    if (this._chosenValue == "") return false;

    // for this context information, create a new JSON-LD named individual object
    var contextInfoJSONLD = {
        "@id" : "abox:ContextInfo"+uuid4(),
        "@type" : [ "kno:ContextInformation", "owl:NamedIndividual" ],
        "kno:hasCID" : this._id,
        "kno:hasValue" : formatJSONLDValue(this._type, this._chosenValue),
        "kno:hasValueOperator" : this._chosenOperator
    };

    // if this context information has parameters, get their JSON-LD named individual objects
    var parameterJSONLDList = [];
    var parameterReferenceJSONLDList = [];
    for (var i in this._parameters) {
        var parameterJSONLD = this._parameters[i].getJSONLD();
        // add references to these named individuals to the context information individual
        parameterReferenceJSONLDList.push( {"@id" : parameterJSONLD["@id"]} );
        // add each parameter individual to the partial ontology graph
        parameterJSONLDList.push(parameterJSONLD);
    }
    if (parameterReferenceJSONLDList.length == 1)
        contextInfoJSONLD["kno:hasContextInformationParameter"] = parameterReferenceJSONLDList[0];
    else if (parameterReferenceJSONLDList.length > 1)
        contextInfoJSONLD["kno:hasContextInformationParameter"] = parameterReferenceJSONLDList;

    return {
        contextInfoJSONLD : contextInfoJSONLD,
        parameterJSONLD : parameterJSONLDList
    }
};