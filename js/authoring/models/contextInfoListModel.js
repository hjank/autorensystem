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

// generates and adds a new items list from a list of JSON objects duck-typable as ContextInformation
ContextInfoList.prototype.fromJSON = function (data) {
    for (var i in data) {
        // "cast" the context items to ContextInformation and remove previously entered values
        var contextItem = new ContextInformation().fromJSON(data[i]);
        contextItem.setChosenValue("");
        contextItem.setChosenOperator("");

        // "cast" the item's parameters to Parameter and remove previously entered values
        var parameters = [], tempParams = contextItem.getParameters();
        for (var ip in tempParams) {
            var param = new Parameter().fromJSON(tempParams[ip]);
            param.setChosenValue("");
            parameters.push(param);
        }
        contextItem.setParameters(parameters);
        this._items.push(contextItem);
    }
};

ContextInfoList.prototype.initClasses = function () {
    for (var key in contextClassDictionary)
        this._classes.push(key);
};

ContextInfoList.prototype.setItems = function (items) {
    this._items = items;
};

ContextInfoList.prototype.addItem = function (item) {
    this._items.push(item);
};

ContextInfoList.prototype.getItems = function () {
    return this._items;
};

ContextInfoList.prototype.getItem = function (index) {
    return this._items[index];
};

ContextInfoList.prototype.getItemByID = function (id) {
    for (var i in this._items)
        if (this._items[i].getID() == id)
            return this._items[i];
};

ContextInfoList.prototype.getIndexByID = function (id) {
    for (var index in this._items)
        if (this._items[index].getID() == id)
            return index;
};

ContextInfoList.prototype.getClasses = function () {
    return this._classes;
};