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

    // workaround
    replaceScenarioReferencesWithNames();

    // find current scenario in all scenarios
    var json = JSON.stringify(authorSystemContent.getScenario(currentScenario));
    //var jsonLD = JSON.stringify(json ? json.getABoxJSONLD() : {});

    $.ajax({
        url: "/saveData",
        type: "POST",
        data: {"json": JSON.stringify(authorSystemContent)},
        success: function() {
            alert("Daten wurden gespeichert.");

            replaceScenarioNamesWithReferences();
        }
    });
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

    authorSystemContent.getTestcases().forEach(function(testcase) {
        Simulation.makeSerializable(testcase);
    });
}
