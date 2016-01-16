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
    // all context items mapped to their first class
    this._contextMap = {};

    return this;
}

// generates and adds a new items list from a list of JSON objects duck-typable as ContextInformation
ContextInfoList.prototype.fromJSON = function (data) {
    for (var i in data) {
        // "cast" the context items to ContextInformation (incl. Parameter)
        this.addItem(new ContextInformation().fromJSON(data[i]));
    }
};

ContextInfoList.prototype.initClasses = function () {
    for (var key in contextClassDictionary) {
        this._classes.push(key);
        this._contextMap[key] = [];
    }
};

ContextInfoList.prototype.setItems = function (items) {
    this._items = [];
    this._contextMap = {};

    for (var i in items)
        this.addItem(items[i]);

};

ContextInfoList.prototype.addItem = function (item) {
    this._items.push(item);

    var firstClass = item.getClasses()[0];
    if (typeof this._contextMap[firstClass] == "undefined")
        this._contextMap[firstClass] = [item];
    else this._contextMap[firstClass].push(item);
};

// if list contains context items with chosen values, remove these (i.e. reset to "")
ContextInfoList.prototype.resetAllContextValues = function() {
    for (var i in this._items) this._items[i].resetAllValues();
};


// getter

ContextInfoList.prototype.getItems = function () {
    var orderedList = [];
    for (var i in this._contextMap)
        for (var j in this._contextMap[i])
            orderedList.push(this._contextMap[i][j]);
    return orderedList;
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

ContextInfoList.prototype.getItemsOfClass = function (contextClass) {
    return this._contextMap[contextClass];
};



/**
 * Sort context items by their respective first class.
 * DEPRECATED.
 */
ContextInfoList.prototype.sortContextItemsByClasses = function () {
    // 1. map each item to its first class
    var contextMap = {};
    for (var i in this._items) {
        var contextItem = this._items[i];
        var firstClass = contextItem.getClasses()[0];
        if (typeof contextMap[firstClass] == "undefined")
            contextMap[firstClass] = [contextItem];
        else contextMap[firstClass].push(contextItem);
    }

    // 2. iterate through all values of that map and put them in a new list
    var orderedList = [];
    for (var i in contextMap)
        for (var j in contextMap[i])
            orderedList.push(contextMap[i][j]);

    // 3. replace this list's items with the new ordered list
    this._items = orderedList;
};