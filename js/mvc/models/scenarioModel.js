/**
 * Created by elis on 07.09.2015.
 */


function Scenario() {

    this._name = "";
    this._units = [];
    this._connections = [];

    return this;
}





// triggered if save scenario was clicked
/**
 * Function saves current open scenario as a JSON file.
 */
function showSaveScenario() {

    // get current scenario name
    var currentScenario = $("#lname")[0].innerHTML;
    var json;
    var jsonFile = null;

    // find current scenario in all scenarios
    for (var i=0; i<myAuthorSystem.length; i++) {
        if (myAuthorSystem[i].name == currentScenario) {
            json = JSON.stringify(myAuthorSystem[i]);
            break;
        }
    }

    // set blob with JSON data
    var data = new Blob([json], {type: "text/json;charset=utf8"});

    // if file will be replaced by another one --> avoid memory leak
    if (jsonFile !== null) {
        window.URL.revokeObjectURL(jsonFile);
    }
    // set JSON file
    jsonFile = window.URL.createObjectURL(data);

    // change file name to current scenario name
    $("#saveScenario").children("a")[0].download = currentScenario + ".json";

    // add link and open download view
    $("#saveScenario").children("a")[0].href = jsonFile;

    // show json in new window
    /*var url = "data:text/json;charset=utf8," + encodeURIComponent(JSON.stringify(myAuthorSystem));
     window.open(url, "_blank");
     window.focus();*/
}