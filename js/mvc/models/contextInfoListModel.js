/**
 * Created by elis on 25.09.2015.
 */

/** Structure context informations

 array_ContextInformations = [array_ContextInformation1, array_ContextInformation2, array_ContextInformation3, ...]
 array_ContextInformation = [id, array_classes, array_contextValue, array_parameter]
 array_classes = [class1, class2, ...]
 array_contextValue = [array_contextValueAttributes, array_operators, array_posVal]
 array_contextValueAttributes = [{type:value}, ({min:value}, {max:value}, {default:value})]
 array_operators = [operator1, operator2, ...]
 array_posVal = [value1, value2, ...]
 array_parameter = [array_parameterValue1, array_parameterValue2, ...]
 array_parameterValue = [id, type, array_values]
 array_values = [value1, value2, ...]
 **/

var array_ContextInformations = new ContextInfoList().getItems();

$(function() {

    // the list of all available context information data types
    function ContextInfoList() {
        this._items = parseContextInfoXML();
        return this;
    }

    ContextInfoList.prototype.getItems = function () {
        return this._items;
    };

    return ContextInfoList;
});