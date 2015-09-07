/**
 * Created by Helena on 06.09.2015.
 */


// trigger new scenario modal window
/**
 * Function shows the new scenario modal window.
 * */
function showNewScenario() {

    // set focus to scenario name input field
    $("#modal-new-szenario").on("shown.bs.modal", function () {
        $("#sname").focus();
    });

    // show modal window
    $("#modal-new-szenario").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });

}


// triggered after clicking save button in scenario creation
/**
 * Function creates a new scenario.
 * It adds the name in the menu bar and in the header above the working place.
 * Is Triggered after clicking save button in modal window scenario creation.
 * */
function saveCloseSzenario() {

    // get name from input field
    var scenarioName = $("#sname").val();

    // write scenario name on the little navigation bar
    $("#lname").html(scenarioName);

    // count number of scenarios (needed for different ids)
    global_ScenarioLiNumber = global_ScenarioLiNumber + 1;

    // create new container to see new scenario in menu bar
    var liClass = $('<li>').addClass('last');
    liClass.attr("id", "menu-scenario-" + global_ScenarioLiNumber);
    var aClass = $('<a>').attr('href', '#');
    var spanClass = $('<span>').addClass('title');

    // append container in html file
    spanClass.append(scenarioName);
    aClass.append(spanClass);
    liClass.append(aClass);
    $("#cssmenu > ul").append(liClass);

    // update scenario list and canvas
    updateScenario(scenarioName);
    setLabelBtnScenarioDeletion();

    // remove all units from state machine container
    $("#stm").empty();

    // defines DOM as jsPlump container
    jsPlumb.setContainer($("#stm"));

    // activate quick add learning unit button (little navbar right)
    $("#navadd").css("pointer-events", "");
    $("#navadd").css("color", "rgb(102,102,102)");

    // activate learning unit dropdown menu (big navigation bar)
    $("#navbarLearningUnit").css("pointer-events", "");
    $("#navbarLearningUnit").css("color", "");
}