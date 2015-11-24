/**
 * Created by Helena on 04.09.2015.
 */



// the list of all available context information data types
function ContextInformation() {

    this._id = "";
    this._classes = [];
    this._type = "";
    this._min = "";
    this._max = "";
    this._default = "";
    this._inputValue = "";
    this._operators = [];
    this._enums = [];
    this._parameters = [];

    return this;
}

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

ContextInformation.prototype.getInputValue = function () {
    return this._inputValue;
};

ContextInformation.prototype.getOperators = function () {
    return this._operators;
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

ContextInformation.prototype.setInputValue = function (value) {
    this._inputValue = value;
};

ContextInformation.prototype.setOperators = function (operators) {
    this._operators = operators;
};

ContextInformation.prototype.setEnums = function (enums) {
    this._enums = enums;
};

ContextInformation.prototype.setParameters = function (parameters) {
    this._parameters = parameters;
};

