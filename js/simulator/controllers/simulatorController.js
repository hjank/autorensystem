/**
 * Created by Helena on 06.01.2016.
 */

var simulations = [];
var numberOfSteps = 80;

// TODO: Save/load simulations
function initSimulator() {

    var simulation = new Simulation();

    var simulatedContextList = simulation.getSimulatedContextList();

    simulatedContextList.addItem(new ContextInformation()
        .fromJSON(contextList.getItemByID("CI_FINISHED_LEARNING_UNIT")));
    simulatedContextList.addItem(new ContextInformation()
        .fromJSON(contextList.getItemByID("CI_USER_DESTINATION")));
    simulatedContextList.addItem(new ContextInformation()
        .fromJSON(contextList.getItemByID("CI_USER_DID_PERFORM_ACTION")));

    simulatedContextList.resetAllContextValues();
    simulatedContextList.setItems(simulatedContextList.getContextItemsSortedByClass());

    simulations.push(simulation);

    // init the simulation editor timeline
    // 1. fetch and append html
    $.get( "js/simulator/view/simulator.html", function( data ) {
        $( "#tab5" ).html( data );

        initTimeline(simulation);

        renderSimulator(simulation);
        showSimulatorTab();

        setUnloadEventHandler();
    });
}



function updateSimulator(simulation) {

    if (!simulation) {
        for (var i in simulations)
            if (simulations[i].getTitle() == $("#simulationName").text())
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
                }
            }
        });
    }

    simulation.renderTimeline();

    renderSimulator(simulation);
}


function renderSimulator(simulation) {

    $("#simulationName").text(simulation.getTitle());

    $("#btnSimulatorDescription")
        .popover("destroy")
        .popover({
            container: "body",
            content: "Here be name and description.",
            html: true,
            placement: "bottom"
        });


    $("#simulatorInfo").tooltip({
        container: "body",
        placement: "auto left"
    });

    $("#simulationToolbar *").tooltip({
        container: "body",
        placement: "auto top"
    });

    $("#simulatorContainer *").not("#simulatorInfo").tooltip({
        container: "body",
        placement: "auto bottom"
    });

    $("#simulatorInfo")
        .popover("destroy")
        .popover({
            container: "body",
            content: getSimulatorInfoText(simulation.getScenario()),
            html: true,
            placement: "left"
        });


    function getSimulatorInfoText(scenario) {
        var scenarioName = (scenario.constructor == Scenario) ? scenario.getName() : "";
        var infoText = infotexts.intro.replace("SCENARIO", scenarioName);

        var infoTextDiv = $("<div>").addClass("simulator-info-text").html(infoText);

        return infoTextDiv;
    }

    $("#timelineInfo")
        .popover("destroy")
        .popover({
            container: "body",
            content: infotexts.timeline,
            html: true,
            placement: "left"
        });


    $("#btnSimulatorOptions")
        .popover("destroy")
        .popover({
            container: "body",
            content: "Here be options.",
            html: true,
            placement: "left"
        });


    setSimulationEventHandlers(simulation);
}




function setUnloadEventHandler() {
    $(window).bind('beforeunload', function(){

    });
}