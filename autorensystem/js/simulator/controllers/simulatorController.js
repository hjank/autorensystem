/**
 * Created by Helena on 06.01.2016.
 */

var simulations = [];
var numberOfSteps = 80;

function initSimulator() {

    simulations = authorSystemContent.getTestcases();

    // init the simulation editor timeline
    // 1. fetch and append html
    $.get( "js/simulator/view/simulator.html", function( data ) {
        $( "#tab5" ).html( data );

        showSimulatorTab();
    });
}



function updateSimulator(simulation) {

    var currentScenarioName = $("#lname")[0].innerHTML;
    var currentScenario = authorSystemContent.getScenario(currentScenarioName);
    var scenarioExists = !!currentScenario;


    /*** first, choose the right (testcase for) simulation, which is supposed to model the current scenario ***/

    if (!simulation) {

        if (simulations.length == 0) {
            simulation = new Simulation();
            simulations.push(simulation);

            simulation.initTimeline(numberOfSteps);
        }

        // re-use previously selected simulation testcase
        var simulationSelectElement = $("#simulationSelection");
        simulation = simulations[simulationSelectElement.val() || simulations.length-1];

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

    renderSimulator(simulation);
}



function renderSimulator(simulation) {


    /*** simulation testcase selection ***/

    var simulationSelectElement = $("#simulationSelection");
    var thisScenarioSimulationOptgroup = $(simulationSelectElement).children()[0];
    var otherScenarioSimulationOptgroup = $(simulationSelectElement).children()[1];

    var currentScenarioName = $("#lname")[0].innerHTML;
    var currentScenario = authorSystemContent.getScenario(currentScenarioName);

    // clear selection
    simulationSelectElement.select2("destroy").children().empty();

    // re-fill selection and set current simulation selected
    simulations.forEach(function (sim, index) {
        if (sim == simulation)
            $(thisScenarioSimulationOptgroup).append(new Option(sim.getTitle(), index, false, true));
        else if (sim.getScenario() == currentScenario)
            $(thisScenarioSimulationOptgroup).append(new Option(sim.getTitle(), index));
        else
            $(otherScenarioSimulationOptgroup).append(new Option(sim.getTitle(), index));
    });
    $(thisScenarioSimulationOptgroup).append(new Option(" Neue Vorlage", simulations.length));

    simulationSelectElement.select2({
        formatResult: function (option) {
            if (option.id == simulations.length) option.text = "<b class='fui-plus'/>" + option.text;
            return option.text;
        }
    });


    /*** buttons, tooltips and popovers ***/

    $("#simulatorInfo, #simulationTitle .btn").tooltip({
        container: "body",
        placement: "auto"
    });

    $("#simulationToolbar *, #simulatorPropertiesContainer *, #simulationOptionsContainer *").tooltip({
        container: "body",
        placement: "auto top"
    });



    /**** simulator info button tooltip and popover ****/

    var getSimulatorInfoText = function (scenario) {
        var scenarioName = (scenario.constructor == Scenario) ? scenario.getName() : "";
        var infoText = infotexts.intro.replace("SCENARIO", scenarioName);

        var infoTextDiv = $("<div>").addClass("simulator-info-text").html(infoText);

        return infoTextDiv;
    };

    var extendSimulatorInfoPopover = function (popover) {

        replaceActionVerbInTitle(popover);
        addCloseXToPopoverTitle(popover);

        $(".simulator-info-text a#simulator-info-scenario").tooltip({
            container: "body",
            html: true,
            placement: "auto top",
            title: infotexts.scenario
        });
        $(".simulator-info-text a#simulator-info-context").tooltip({
            container: "body",
            html: true,
            placement: "auto top",
            title: infotexts.context
        });
    };

    $("#simulatorInfo")
        .popover("destroy")
        .popover({
            container: "body",
            content: getSimulatorInfoText(simulation.getScenario()),
            html: true,
            placement: "left"
        })
        .off("shown.bs.popover").on("shown.bs.popover", function (e) {
            $(e.target).tooltip("destroy");
            extendSimulatorInfoPopover($(e.target).data("bs.popover").$tip);
        })
        .off("hide.bs.popover").on("hide.bs.popover", function (e) {
            $(e.target).tooltip({
                container: "body",
                placement: "left"
            });
        });



    setTimelineEventHandlers(simulation);
    setSimulationEventHandlers(simulation);

    simulation.renderTimeline();
}



function addCloseXToPopoverTitle(popover) {
    var closeX = $('<a href="#" title="Schließen" class="popover-close">X</a>')
        .tooltip({
            container: "body",
            placement: "bottom"
        });
    $(popover).children("h3.popover-title").append(closeX);
}

function replaceActionVerbInTitle(popover) {
    var titleElement = $(popover).children("h3.popover-title");
    var titleText = $(titleElement).text();

    titleText = titleText.replace(" anzeigen", "");
    $(titleElement).text(titleText);
}