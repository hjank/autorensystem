/**
 * Created by Helena on 06.01.2016.
 */

var simulations = [];
var numberOfSteps = 80;

function initSimulator() {

    // TODO: Save/load simulations
    var simulation = new Simulation();
    simulations.push(simulation);


    /*
    TODO: remove when ready to deploy -- test purpose only!

    var simulatedContextList = simulation.getSimulatedContextList();

    simulatedContextList.addItem(new ContextInformation()
        .fromJSON(contextList.getItemByID("CI_USER_DESTINATION")));
    simulatedContextList.addItem(new ContextInformation()
        .fromJSON(contextList.getItemByID("CI_USER_DID_PERFORM_ACTION")));

    simulatedContextList.resetAllContextValues();
    simulatedContextList.setItems(simulatedContextList.getContextItemsSortedByClass());
    */


    simulation.initTimeline(numberOfSteps);

    // init the simulation editor timeline
    // 1. fetch and append html
    $.get( "js/simulator/view/simulator.html", function( data ) {
        $( "#tab5" ).html( data );

        renderSimulator(simulation);
        showSimulatorTab();

        setUnloadEventHandler();
    });
}



function updateSimulator(simulation) {

    var currentScenarioName = $("#lname")[0].innerHTML;
    var currentScenario = authorSystemContent.getScenario(currentScenarioName);
    var scenarioExists = !!currentScenario;

    /*** first, choose the right (testcase for) simulation, which is supposed to model the current scenario ***/

    if (!simulation) {

        // re-use previously selected simulation testcase
        var simulationSelectElement = $("#simulationSelection");
        simulation = simulations[simulationSelectElement.val()];

        var simulatedScenario = simulation.getScenario();

        // if this does not match the current scenario, find the first one that does and choose it instead
        if (simulatedScenario != currentScenario) {
            var foundMatch = false;
            for (var i in simulations) {
                var sim = simulations[i];
                if (sim.getScenario() == currentScenario) {
                    simulation = sim;
                    foundMatch = true;
                    break;
                }
            }

            // no match found but open simulation already belongs somewhere --> create a new one
            if (!foundMatch && simulatedScenario.constructor == Scenario) {
                simulation = new Simulation();
                simulation.setTitle(simulation.getTitle() + " (" + simulations.push(simulation) + ")");
                simulation.initTimeline(numberOfSteps);
            }

            // new or old simulation is not associated with any scenario yet --> do just that
            if (scenarioExists)
                simulation.setScenario(currentScenario);
        }
    }

    /*** then, get all relevant context for current scenario (if it exists) ***/

    if (scenarioExists) {
        var simulatedContextList = simulation.getSimulatedContextList();

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


    /*** simulation testcase selection ***/

    var simulationSelectElement = $("#simulationSelection");
    var currentScenarioName = $("#lname")[0].innerHTML;
    var currentScenario = authorSystemContent.getScenario(currentScenarioName);

    // clear selection
    simulationSelectElement.select2("destroy").children().each(function (i, optgroup) {
        $(optgroup).empty();
    });

    // re-fill selection and set current simulation selected
    simulations.forEach(function (sim, index) {
        if (sim == simulation)
            $(simulationSelectElement.children()[0]).append(new Option(sim.getTitle(), index, false, true));
        else if (sim.getScenario() == currentScenario)
            $(simulationSelectElement.children()[0]).append(new Option(sim.getTitle(), index));
        else
            $(simulationSelectElement.children()[1]).append(new Option(sim.getTitle(), index));
    });

    simulationSelectElement.select2();


    /*** buttons, tooltips and popovers ***/

    var getNameDescriptionPopoverContent = function () {
        var nameDescrPopover = $("#popoverContentTemplate > div.popover-simulation-name-description").clone();
        $(nameDescrPopover.find(".popover-simulation-name")).val(simulation.getTitle());
        $(nameDescrPopover.find(".popover-simulation-description")).val(simulation.getDescription());
        return nameDescrPopover;
    };

    $("#btnSimulatorDescription")
        .popover("destroy")
        .popover({
            container: "body",
            content: getNameDescriptionPopoverContent(),
            html: true,
            placement: "bottom"
        });


    $("#simulatorInfo, #btnSimulatorDescription").tooltip({
        container: "body",
        placement: "left"
    });

    $("#simulationToolbar *").tooltip({
        container: "body",
        placement: "auto top"
    });


    var getSimulatorInfoText = function (scenario) {
        var scenarioName = (scenario.constructor == Scenario) ? scenario.getName() : "";
        var infoText = infotexts.intro.replace("SCENARIO", scenarioName);

        var infoTextDiv = $("<div>").addClass("simulator-info-text").html(infoText);

        return infoTextDiv;
    };

    $("#simulatorInfo")
        .popover("destroy")
        .popover({
            container: "body",
            content: getSimulatorInfoText(simulation.getScenario()),
            html: true,
            placement: "left"
        });


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