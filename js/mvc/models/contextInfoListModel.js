/**
 * Created by elis on 25.09.2015.
 */

/** Structure context informations:


array_ContextInformations = [contextInformation1, contextInformation2, contextInformation3, ...]

contextInformationI : {
        name,
        classes : [class1, class2, ...],
        value : {
            attributes : {
                type,
                min,
                max,
                default
            },
            operators : [operator1, operator2, ..., operatorN],
            enums : [value1, value2, ..., valueN]
        },
        parameters : [parameter1, paramater2, ..., parameterN]
}

parameterI : {
    id,
    type,
    values : [value1, value2, ..., valueN]    // enum
            || [{min, max}]                // float
}

 **/


// the list of all available context information data types
function ContextInfoList() {

    // all measurable context infos
    this._items = [];
    // all available context classes' IDs ("CC_...")
    this._classes = [];

    return this;
}

ContextInfoList.prototype.init = function () {
    parseContextInfoXML();

    for (var key in contextClassDictionary)
        this._classes.push(key);
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