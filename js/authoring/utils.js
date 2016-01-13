/**
 * Created by elis on 07.01.2016.
 */



/**
 * The following function and comment are taken from:
 * https://github.com/University-of-Potsdam-MM/UP.App/blob/bdcd669ae4a75e4666b4bf7c0750a94262e9d5c1/www/js/lib/utils.js
 * (courtesy of Alexander Kiy)
 *
 * Generates a uuid v4. Code is taken from broofas answer in http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 */
var uuid4 = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};


/**
 * Group context items by their first class.
 *
 * @param contextList
 * @returns {{}} A map with classes as keys and arrays of context items als values.
 */
function getContextInfosMappedToFirstClass(contextList) {
    var contextMap = {};

    for (var i in contextList) {
        var contextItem = contextList[i];
        var firstClass = contextItem.getClasses()[0];
        if (typeof contextMap[firstClass] == "undefined")
            contextMap[firstClass] = [contextItem];
        else contextMap[firstClass].push(contextItem);
    }
    return contextMap;
}