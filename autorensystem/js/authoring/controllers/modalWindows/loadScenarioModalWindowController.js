/**
 * Created by Helena on 06.09.2015.
 */

$(function() {
    // set the trigger for the load scenarios modal window
    $("#loadScenario").on("click", showLoadScenario);

    // triggered if load button was clicked in modal window load scenario
    $("#btnLoadScenario").on("click", loadScenario);
});

/**
 * Function shows the load scenario modal window.
 * */
function showLoadScenario() {
    showModalWindow($("#modal-load-szenario"));

    // delete scenarios
    $("#listLoadScenarios > option").each(function() {
        $(this).remove();
    });

    var checkName = false;

    // put all scenarios in selection bar
    var allScenarios = authorSystemContent.getScenarios();
    for (var i in allScenarios) {
        var option = $("<option>").attr("value", "val" + allScenarios[i].getName());
        option.html(allScenarios[i].getName());
        $("#listLoadScenarios").append(option);
        if (allScenarios[i].getName() == "Testszenario") {
            checkName = true;
        }
    }


/*    for (var i = 0; i < myAuthorSystem.length; i++) {
        var option = $("<option>").attr("value", "val" + myAuthorSystem[i].name);
        option.html(myAuthorSystem[i].name);
        $("#listLoadScenarios").append(option);

        // only for testing --> add check variable
        if (myAuthorSystem[i].name == "Testszenario") {
            checkName = true;
        }
    }*/

    // only for testing --> add a fix scenario
    if (!checkName) {
        option = $("<option>").attr("value", "val" + "Testszenario");
        option.html("Testszenario");
        $("#listLoadScenarios").append(option);
    }
}

/**
 * Loads the selected scenario.
 */
function loadScenario() {
    //TODO: check if obsolete
    /*
    // get name of the selected scenario
    var selectedScenario = $("#s2id_listLoadScenarios")[0].innerText.slice(0, -1);

    var thisScenario = authorSystemContent.getScenario(selectedScenario);
    localStorage.setItem("saveData", JSON.stringify(thisScenario));
    // add name in URL
    $(location).attr("href", "?" + selectedScenario);
    */

   /* // find right scenario
    for (var i=0; i<myAuthorSystem.length; i++) {
        if (myAuthorSystem[i].name == selectedScenario) {
            // save scenario object in JSON structure
            localStorage.setItem("saveData", JSON.stringify(myAuthorSystem[i]));

            // add name in URL
            $(location).attr("href", "?" + selectedScenario);
        }
    }*/

    /*
    // only for testing
    if (selectedScenario == "Testszenario") {
        // add name in URL
        $(location).attr("href", "?" + selectedScenario);
    }
    */
}