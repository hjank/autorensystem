/**
 * Created by Helena on 06.01.2016.
 */


/**
 * Initialize timeline
 */
function initTimeline() {

    showSimulatorTab();



    // event handler listening for click on "Kontextsimulation" in horizontal menu (top)
    // TODO: Consider switching between scenarios!

    var currentScenarioName = $("#lname")[0].innerHTML;
    var scenarioContextList;

    if (currentScenarioName) {
        // get a list of all context information items added in this scenario, with chosen values reset to ""
        scenarioContextList = authorSystemContent.getScenario(currentScenarioName).getScenarioContext();
    }

    // init the simulation editor timeline
    $.get( "simulator.html", function( data ) {
        $( "#tab5" ).html( data );

        // create a column for each ContextInformation object
        createColumns(scenarioContextList);

        // set event handlers for these generated cells
        setCellEventHandlers();

        //showSimulatorTab();
    });
}