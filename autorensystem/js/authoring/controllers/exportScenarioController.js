/**
 * Created by tobias on 13.01.16.
 */

$(function() {
    // sets the trigger for if save scenario was clicked
    $("#exportScenario").on("click", function() {
        exportScenario();
    });
});

function exportScenario(callback) {
    // get current scenario name
    var currentScenario = $("#lname")[0].innerHTML;
    if (currentScenario == "") {
        alert("Sie müssen erst ein Szenario erstellen, bevor Sie es exportieren können.");
        return false;
    }

    replaceScenarioNamesWithReferences();

    var JSONLD = authorSystemContent.getScenario(currentScenario).getABoxJSONLD();

    replaceScenarioReferencesWithNames();

    //console.log(JSON.stringify(JSONLD, null, ' '));


    $.ajax({
        url: "http://localhost:9998/noderules/get-adaptation-rules",
        type: "POST",
        cache: false,
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {"ontologyABox": JSON.stringify(JSONLD, null, ' ')},
        dataType: "text",
        success: function(response) {
            console.log(response);

            // simulator will create adaptation engine from rules
            if (typeof callback == "function")
                callback(response);

            // common export: data are saved to disk
            else
                $.ajax({
                    url: "/saveExport",
                    type: "POST",
                    data: {
                        rules: response,
                        content: JSON.stringify(authorSystemContent)
                    },
                    success: function(response) {
                        alert("Export war erfolgreich.")
                    },
                    error: function(err, textStatus) {
                        console.log(textStatus);
                        alert("Fehler beim Speichern des Exports.")
                    }
                });
        },
        error: function(err, textStatus) {
            console.log(textStatus);
            alert("Fehler beim Erstellen der Adaptionsregeln.")
        }
    });
}