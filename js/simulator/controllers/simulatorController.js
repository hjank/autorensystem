/**
 * Created by Helena on 06.01.2016.
 */

// set the list of context items to be modelled for simulation
var simulatedContextList = new ContextInfoList();


// TODO: Consider switching between scenarios!
function initSimulator() {

    var simulation = new Simulation();

    // get relevant context - default: scenario context
    simulatedContextList.initClasses();
    simulatedContextList.fromJSON(contextList.getItemsOfClass("CC_SCENARIO"));
    simulatedContextList.resetAllContextValues();

    var currentScenarioName = $("#lname")[0].innerHTML;
    if (currentScenarioName) {

        var currentScenario = authorSystemContent.getScenario(currentScenarioName);
        simulation.setScenario(currentScenario);

        // get a list of all context information items added in this scenario
        currentScenario.getScenarioContext().forEach(
            function() {
                for (var i in simulatedContextList.getItems()) {
                    if (!simulatedContextList.getItemByID(this.getID()))
                        simulatedContextList.addItem(this);
                }
            }
        );
    }
}


/**
 * Initialize timeline
 */
function initTimeline() {

    var timeline = new Timeline();
    timeline.setSimulationTitle("");

    // init the simulation editor timeline
    // 1. fetch and append html
    $.get( "js/simulator/view/simulator.html", function( data ) {
        $( "#tab5" ).html( data );

        // create a column for each ContextInformation object
        createColumns();

        // set event handlers for these generated cells
        setCellEventHandlers();

        showSimulatorTab();
    });
}