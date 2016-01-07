/**
 * Created by tobias on 14.10.15.
 */

$(function() {
    // sets the trigger for if save scenario was clicked
    $("#saveScenario").on("click", showSaveScenario);
});

/**
 * Function saves current open scenario as a JSON file.
 */
function showSaveScenario() {
    var saveScenarioElement = $("#saveScenario");

    // get current scenario name
    var currentScenario = $("#lname")[0].innerHTML;
    var json;
    var jsonFile = null;

    // find current scenario in all scenarios
    json = JSON.stringify(authorSystemContent.getScenario(currentScenario));

    // set blob with JSON data
    var data = new Blob([json], {type: "text/json;charset=utf8"});

    // if file will be replaced by another one --> avoid memory leak
    if (jsonFile !== null) {
        window.URL.revokeObjectURL(jsonFile);
    }
    // set JSON file
    jsonFile = window.URL.createObjectURL(data);

    // change file name to current scenario name
    saveScenarioElement.children("a")[0].download = currentScenario + ".json";

    // add link and open download view
    saveScenarioElement.children("a")[0].href = jsonFile;

    // show json in new window
    /*var url = "data:text/json;charset=utf8," + encodeURIComponent(JSON.stringify(myAuthorSystem));
     window.open(url, "_blank");
     window.focus();*/
}