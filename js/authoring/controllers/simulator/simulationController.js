/**
 * Created by Helena on 06.01.2016.
 */


/**
 * Initialize timeline
 */
$(function() {

    // event handler listening for click on "Kontextsimulation" in horizontal menu (top)
    // TODO: Consider switching between scenarios!
    $("#contextSimulation").on("click", function() {

        var currentScenarioName = $("#lname")[0].innerHTML;
        var scenarioContextList;

        if (currentScenarioName) {
            // get a list of all context information items added in this scenario, with chosen values reset to ""
            scenarioContextList = authorSystemContent.getScenario(currentScenarioName).getScenarioContext();
        }

        // init the simulation editor timeline
        $.get( "simulator.html", function( data ) {
            $( "#simulatorContainer" ).html( data );

            // create a column for each ContextInformation object
            createColumns(scenarioContextList ? scenarioContextList.length : 0);

            // set event handlers for these generated cells
            setCellEventHandlers();
        });

    });

});