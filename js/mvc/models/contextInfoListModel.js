/**
 * Created by elis on 25.09.2015.
 */

/** Structure context informations:


array_ContextInformations = [contextInformation1, contextInformation2, contextInformation3, ...]

contextInformationI : {
        name : {
            translation,
            original
        },
        classes : [class1, class2, ...].name = "Context Classes",
        value : {
            name :"Context Value",
            attributes : {
                type,
                min,
                max,
                default
            },
            operators : [operator1, operator2, ..., operatorN].name = "Operators",
            enums : [value1, value2, ..., valueN].name = "Possible Values"
        },
        parameters : [parameter1, paramater2, ..., parameterN].name = "Parameters (id, type, values)"
}

parameterI : {
    name : "Parameter",
    id : {
        translation,
        original
    },
    type,
    values : [value1, value2, ..., valueN].name = "Possible Values"      // enum
            || [{min, max}].name = "Minimum and Maximum Values"          // float
}

valueI : {
    translation,
    original
},

 **/


// the list of all available context information data types
function ContextInfoList() {

    this._items = [];
    this._classes = ["Lernszenario", "Persönlich", "Situationsbezogen",
        "Infrastruktur", "Umwelt", "Ortung"];

    return this;
}

ContextInfoList.prototype.init = function () {
    parseContextInfoXML();
};

ContextInfoList.prototype.setItems = function (items) {
    this._items = items;
};

ContextInfoList.prototype.getItems = function () {
    return this._items;
};

ContextInfoList.prototype.getItem = function (index) {
    return this._items[index];
};

ContextInfoList.prototype.getClasses = function () {
    return this._classes;
};