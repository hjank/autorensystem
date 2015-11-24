/**
 * Created by elis on 24.11.2015.
 */


function Parameter() {
    this._id = "";
    this._type = "";
    this._min = "";
    this._max = "";
    this._default = "";
    this._inputValue = "";
    this._enums = [];

    return this;
}

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

Parameter.prototype.getInputValue = function () {
    return this._inputValue;
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

Parameter.prototype.setInputValue = function (value) {
    this._inputValue = value;
};

Parameter.prototype.setEnums = function (enums) {
    this._enums = enums;
};