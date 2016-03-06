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
    // set all available classes
    this.initClasses();

    return this;
}

// generates and adds a new items list from a list of JSON objects duck-typable as ContextInformation
ContextInfoList.prototype.fromJSON = function (data) {
    var self = this;
    data._items.forEach(function (item) {
        // "cast" the context items to ContextInformation (incl. Parameter)
        self.addItem(new ContextInformation().fromJSON(item));
    });
    return this;
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

// if list contains context items with chosen values, remove these (i.e. reset to "")
ContextInfoList.prototype.resetAllContextValues = function() {
    for (var i in this._items)
        this._items[i].resetAllValues();
};


// getter

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


/**
 * Sort context items by their respective first class.
 */
ContextInfoList.prototype.getContextItemsSortedByClass = function () {
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
    return orderedList;
};