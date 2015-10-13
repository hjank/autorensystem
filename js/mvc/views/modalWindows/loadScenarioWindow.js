/**
 * Created by Helena on 06.09.2015.
 */



$(function() {

    // triggered if load button was clicked in modal window load scenario
    $("#btnLoadScenario").on("click", function() {

        // get name of the selected scenario
        var selectedScenario = $("#s2id_listLoadScenarios")[0].innerText.slice(0, -1);

        // find right scenario
        for (var i=0; i<myAuthorSystem.length; i++) {
            if (myAuthorSystem[i].name == selectedScenario) {
                // save scenario object in JSON structure
                localStorage.setItem("saveData", JSON.stringify(myAuthorSystem[i]));

                // add name in URL
                $(location).attr("href", "?" + selectedScenario);
            }
        }

        // only for testing
        if (selectedScenario == "Testszenario") {

            // add name in URL
            $(location).attr("href", "?" + selectedScenario);
        }

    });

    // set the trigger for the load scenarios modal window
    $("#loadScenario").on("click", showLoadScenario);
});



// trigger load scenarios modal window
/**
 * Function shows the load scenario modal window.
 * */
function showLoadScenario() {

    // show modal window
    $("#modal-load-szenario").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });

    // delete scenarios
    $("#listLoadScenarios > option").each(function() {
        $(this).remove();
    });

    var checkName = false;

    // put all scenarios in selection bar
    for (var i = 0; i < myAuthorSystem.length; i++) {
        var option = $("<option>").attr("value", "val" + myAuthorSystem[i].name);
        option.html(myAuthorSystem[i].name);
        $("#listLoadScenarios").append(option);

        // only for testing --> add check variable
        if (myAuthorSystem[i].name == "Testszenario") {
            checkName = true;
        }

    }

    // only for testing --> add a fix scenario
    if (!checkName) {
        option = $("<option>").attr("value", "val" + "Testszenario");
        option.html("Testszenario");
        $("#listLoadScenarios").append(option);
    }

}