/**
 * Created by Helena on 06.01.2016.
 */

var simulations = [];

// TODO: Consider switching between scenarios!
function initSimulator() {

    var simulation = new Simulation();

    var simulatedContextList = simulation.getSimulatedContextList();

    // get relevant context - default: scenario context
    //simulatedContextList.fromJSON(contextList.getItemsOfClass("CC_SCENARIO"));
    simulatedContextList.addItem(new ContextInformation()
        .fromJSON(contextList.getItemByID("CI_FINISHED_LEARNING_UNIT")));
    simulatedContextList.resetAllContextValues();

    simulations.push(simulation);

    // init the simulation editor timeline
    // 1. fetch and append html
    $.get( "js/simulator/view/simulator.html", function( data ) {
        $( "#tab5" ).html( data );

        $("#simulationTitle > span")[0].innerText = simulation.getTitle();

        initTimeline(simulation);
        
        setSimulationEventHandlers();
        showSimulatorTab();
    });
}


function updateSimulator(simulation) {

    if (!simulation) {
        for (var i in simulations)
            if (simulations[i].getTitle() == $("#simulationTitle > span")[0].innerText)
                simulation = simulations[i];
    }

    var simulatedContextList = simulation.getSimulatedContextList();

    var currentScenarioName = $("#lname")[0].innerHTML;
    if (currentScenarioName) {
        var currentScenario = authorSystemContent.getScenario(currentScenarioName);
        simulation.setScenario(currentScenario);

        // get a list of all context information items added in this scenario
        currentScenario.getScenarioContext().forEach(function(item) {
            for (var i in simulatedContextList.getItems()) {
                if (!simulatedContextList.getItemByID(item.getID())) {
                    var contextInfo = new ContextInformation().fromJSON(item);
                    simulation.addContextItem(contextInfo);

                    createColumnForContextInfo(contextInfo);
                }
            }
        });
    }
}


function setSimulationEventHandlers() {

    $("#btnSimulatorInfo").on("click", showInfo);
}

function showInfo() {
    $("#simulatorInfoText").text("Hier können Sie das Verhalten der Lernanwendung simulieren. Dazu modellieren Sie den Kontext des Lernszenarios.");
}