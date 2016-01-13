/**
 * Created by Helena on 06.01.2016.
 */


// set the list of context items to be modelled for simulation
var simulatedContextList = new ContextInfoList();


/**
 * Initialize timeline
 */
function initTimeline() {

    showSimulatorTab();
    // TODO: Consider switching between scenarios!

    // init the simulation editor timeline
    // 1. fetch and append html
    $.get( "simulator.html", function( data ) {
        $( "#tab5" ).html( data );

        // 2. get relevant context - default: scenario context
        simulatedContextList.initClasses();
        simulatedContextList.setItems(contextList.getItemsOfClass("CC_SCENARIO"));
        
        var currentScenarioName = $("#lname")[0].innerHTML;
        if (currentScenarioName) {
            // get a list of all context information items added in this scenario
            authorSystemContent.getScenario(currentScenarioName).getScenarioContext().forEach(
                function() {
                    for (var i in simulatedContextList.getItems()) {
                        if (!simulatedContextList.getItemByID(this.getID()))
                            simulatedContextList.addItem(this);
                    }
                }
            );
        }

        // create a column for each ContextInformation object
        createColumns();

        // set event handlers for these generated cells
        setCellEventHandlers();

        //showSimulatorTab();
    });
}