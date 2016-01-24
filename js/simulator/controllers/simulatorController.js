/**
 * Created by Helena on 06.01.2016.
 */

// TODO: Consider switching between scenarios!
function initSimulator() {

    var simulation = new Simulation();
    var simulatedContextList = simulation.getSimulatedContextList();

    // get relevant context - default: scenario context
    simulatedContextList.fromJSON(contextList.getItemsOfClass("CC_SCENARIO").concat(contextList.getItemsOfClass("CC_SITUATIONAL")));
    simulatedContextList.resetAllContextValues();

    var currentScenarioName = $("#lname")[0].innerHTML;
    if (currentScenarioName) {

        var currentScenario = authorSystemContent.getScenario(currentScenarioName);
        simulation.setScenario(currentScenario);

        // get a list of all context information items added in this scenario
        currentScenario.getScenarioContext().forEach(function(item) {
            for (var i in simulatedContextList.getItems()) {
                if (!simulatedContextList.getItemByID(item.getID()))
                    simulatedContextList.addItem(new ContextInformation().fromJSON(item));
            }
        });
    }

    showSimulatorTab();
    initTimeline(simulation);
}
