/**
 * Created by Helena on 04.09.2015.
 */

/** -- JSON Structure for the personal author system data --
 *  myAuthorSystem = [scenario1, scenario2, ..., scenarioN, options]
 *      scenario = {name:name, units:[unit1, unit2, ...], connections:[connect1, connect2, ...]}
 *          unit = {name:name, description:text,
 *            contextInformations:[contextInformation1, contextInformation2, ...],
 *            sat:choice,
 *            metaData:[metaData1, metaData2, ...],
 *
 *            posX:number,
 *            posY:number
 *          }
 *              contextInformation = {name:name, operator:name, value:value,
 *                input1:value, input2:value, inputString:value,
 *                parameter1:value, parameter2:value,
 *                icon:path
 *              }
 *              metaData = {name:name, icon:path}
 *      options = {option1:text, option2:text, ...}
 *  **/


function AuthorSystemContent() {

    this._scenarioList = [];
    this._options = {};
    this._guis = [];

    return this;
}

AuthorSystemContent.prototype.getScenarios = function() {
    return this._scenarioList;
};

AuthorSystemContent.prototype.getUnitByUUID = function(uuid) {
    for (var i in this._scenarioList) {
        var unit = this._scenarioList[i].getUnitByUUID(uuid);
        if (unit)
            return unit;
    }
};

AuthorSystemContent.prototype.getGUIs = function() {
    return this._guis;
};

AuthorSystemContent.prototype.getScenario = function(scenarioName) {
    for (var i in this._scenarioList) {
        var scenario = this._scenarioList[i];
        if (scenario.getName() == scenarioName)
            return scenario;
    }
};

AuthorSystemContent.prototype.setGUIs = function(guis) {
    this._guis = guis;
};

/**
 *  Adds a new scenario object to the authoring system.
 *
 * @param {Scenario} scenario
 */
AuthorSystemContent.prototype.addScenario = function (scenario) {
    this._scenarioList.push(scenario);
};

AuthorSystemContent.prototype.removeScenario = function(scenarioName) {
    for (var i in this._scenarioList) {
        var scenario = this._scenarioList[i];
        if (scenario.getName() == scenarioName)
            this._scenarioList.splice(i, 1);
    }
};

// returns a list of all context items added in all scenarios, chosen values reset to ""
AuthorSystemContent.prototype.getContextInformation = function() {
    var contextList = [];
    for (var i in this._scenarioList) {
        var scenarioContext = this._scenarioList[i].getScenarioContext();
        for (var j in scenarioContext)
            contextList.push(scenarioContext[j]);
    }
    return contextList;
};

/**
 * Same as in scenarioModel, only for whole content (i.e. all scenarios).
 * @returns {boolean} true if any conntext has been added, else false.
 */
AuthorSystemContent.prototype.hasContext = function() {
    for (var i in this._scenarioList)
        if (this._scenarioList[i].hasContext()) return true;
    return false;
};