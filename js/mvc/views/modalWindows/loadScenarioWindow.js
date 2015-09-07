/**
 * Created by Helena on 06.09.2015.
 */

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