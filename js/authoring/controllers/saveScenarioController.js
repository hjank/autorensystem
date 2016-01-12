/**
 * Created by tobias on 14.10.15.
 */

$(function() {
    // sets the trigger for if save scenario was clicked
    $("#saveScenario").on("click", function() {
        showSaveScenario();
    });
});

/**
 * Function saves current open scenario as a JSON file.
 */
function showSaveScenario() {

    // get current scenario name
    var currentScenario = $("#lname")[0].innerHTML;
    if (currentScenario == "") {
        alert("Sie müssen erst ein Szenario erstellen, bevor Sie es speichern können.");
        return false;
    }

    var jsonFile = null;

    // workaround
    replaceScenarioReferencesWithNames();

    // find current scenario in all scenarios
    var json = JSON.stringify(authorSystemContent.getScenario(currentScenario));
    //var jsonLD = JSON.stringify(json ? json.getABoxJSONLD() : {});

    // set blob with JSON data
    var data = new Blob([json], {type: "text/json;charset=utf8"});

    // if file will be replaced by another one --> avoid memory leak
    if (jsonFile !== null) {
        window.URL.revokeObjectURL(jsonFile);
    }
    // set JSON file
    jsonFile = window.URL.createObjectURL(data);

    var saveScenarioElement = $("#saveScenario");
    // change file name to current scenario name
    saveScenarioElement.children("a")[0].download = currentScenario + ".json";
    // add link and open download view
    saveScenarioElement.children("a")[0].href = jsonFile;


    // show json in new window
    /*var url = "data:text/json;charset=utf8," + encodeURIComponent(JSON.stringify(myAuthorSystem));
     window.open(url, "_blank");
     window.focus();*/

}

// circular structures cannot be converted to string, thus replace scenario reference in unit (for now)
function replaceScenarioReferencesWithNames () {
    var scenarios = authorSystemContent.getScenarios();
    for (var i in scenarios) {
        var units = scenarios[i].getUnits();
        for (var j in units) {
            units[j].setScenarioReference(scenarios[i].getName());
        }
    }
}
