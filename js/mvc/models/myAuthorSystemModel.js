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

var myAuthorSystem = [];

function changeScenarioName(oldName, newName) {
    for (var m=0; m<myAuthorSystem.length; m++) {
        if (myAuthorSystem[m].name == oldName) {
            myAuthorSystem[m].name = newName;
        }
    }
}
