/**
 * Created by elis on 24.11.2015.
 */


function Parameter() {
    this._id = "";
    this._type = "";
    this._min = "";
    this._max = "";
    this._default = "";
    this._chosenValue = "";
    this._enums = [];

    return this;
}

// support "casting" a duck-typed JSON object to Parameter
Parameter.prototype.fromJSON = function(item) {
    for (i in item) this[i] = item[i];
    return this;
};

// getters
Parameter.prototype.getID = function () {
    return this._id;
};

Parameter.prototype.getType = function () {
    return this._type;
};

Parameter.prototype.getMin = function () {
    return this._min;
};

Parameter.prototype.getMax = function () {
    return this._max;
};

Parameter.prototype.getDefault = function () {
    return this._default;
};

Parameter.prototype.getChosenValue = function () {
    return this._chosenValue;
};

Parameter.prototype.getEnums = function () {
    return this._enums;
};


// setters
Parameter.prototype.setID = function (id) {
    this._id = id;
};

Parameter.prototype.setType = function (type) {
    this._type = type;
};

Parameter.prototype.setMin = function (min) {
    if (min)
        this._min = min;
};

Parameter.prototype.setMax = function (max) {
    if (max)
        this._max = max;
};

Parameter.prototype.setDefault = function (def) {
    if (def)
        this._default = def;
};

Parameter.prototype.setChosenValue = function (value) {
    this._chosenValue = value;
};

Parameter.prototype.setEnums = function (enums) {
    this._enums = enums;
};

Parameter.prototype.resetValue = function () {
    this._chosenValue = "";
};


// JSON-LD formatting

Parameter.prototype.getJSONLD = function () {
    if (this._chosenValue == "") return false;

    return {
        "@id" : "abox:Parameter"+uuid4(),
        "@type" : [ "kno:ContextInformationParameter", "owl:NamedIndividual" ],
        "kno:hasPID" : this._id,
        "kno:hasValue" : formatJSONLDValue(this._type, this._chosenValue)
    };
};
