/**
 * Created by Helena on 06.01.2016.
 */

var simulations;
var scenarioContextList;
var numberOfSteps = 30;

function initSimulator() {

    simulations = authorSystemContent.getTestcases();
    scenarioContextList = new ContextInfoList();

    // init the simulation editor timeline
    // 1. fetch and append html
    $.get( "js/simulator/view/simulator.html", function( data ) {
        $( "#tab5" ).html( data );

        showSimulatorTab();
    });
}


function getNewInitializedSimulation() {
    var simulation = new Simulation();
    simulations.push(simulation);
    simulation.initTimeline(numberOfSteps);

    return simulation;
}

function updateSimulator(simulation) {

    var currentScenarioName = $("#lname")[0].innerHTML;
    var currentScenario = authorSystemContent.getScenario(currentScenarioName);
    var scenarioExists = !!currentScenario;

    replaceScenarioNamesWithReferences();


    /*** first, choose the right (test case for) simulation, which is supposed to model the current scenario ***/

    if (!simulation) {

        // if no test cases exist yet -> create first one
        if (simulations.length == 0)
            simulation = getNewInitializedSimulation();


        // re-use previously selected simulation test case (if not just deleted) or the new one just added
        var selectedSimIdx = $("#simulationSelection").val();
        simulation = simulations[(selectedSimIdx && selectedSimIdx < simulations.length) ? selectedSimIdx : 0];


        // if this does not match the current scenario, find the first one that does and choose it instead
        var simulatedScenario = simulation.getScenario();
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

            // no match found and open simulation already belongs somewhere else --> create a new test case for this scenario
            if (!foundMatch && simulatedScenario.constructor == Scenario)
                simulation = getNewInitializedSimulation();

        }
    }

    /*** then, get all relevant context for current scenario (if it exists) ***/

    if (scenarioExists) {

        // new or old simulation is not associated with any scenario yet --> do just that
        simulation.setScenario(currentScenario);

        var simulatedContextList = simulation.getSimulatedContextList();
        scenarioContextList.setItems(currentScenario.getScenarioContext());

        // get a list of all context information items added in this scenario
        scenarioContextList.getItems().forEach(function(item) {
            // add uniquely new items (no duplicates)
            if (!simulatedContextList.getItemByID(item.getID())) {
                var contextInfo = new ContextInformation().fromJSON(item);
                simulation.addContextItem(contextInfo);
            }
        });
        // remove context items not relevant for this scenario from simulated context list
        simulatedContextList.getItems().forEach(function (simItem) {
            // not contained in scenario context -> remove
            if (!scenarioContextList.getItemByID(simItem.getID()) && !expectsLearningUnit(simItem))
                simulation.removeContextItem(simItem, true);
        });
    }

    // make sure changes in learning app will be registered on next simulation start
    simulation.stop();

    // and, finally, render the user interface
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
            if (option.id) {
                var text, descr;
                if (option.id == simulations.length) {
                    text = "<b class='fui-plus'/>" + option.text;
                    descr = "";
                }
                else {
                    text = option.text;
                    descr = simulations[option.id].getDescription();
                }
                return "<div title ='" + descr + "'>" + text + "</div>";
            }
            else return option.text;
        }
    });


    /*** buttons, tooltips and popovers ***/

    /*$("#simulatorInfo, #simulationTitle .btn").tooltip({
        container: "body",
        placement: "auto"
    });

    $("#simulationToolbar *, #simulatorPropertiesContainer *, #simulationOptionsContainer *").tooltip({
        container: "body",
        placement: "auto top"
    });*/



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
            //$(e.target).tooltip("destroy");
            extendSimulatorInfoPopover($(e.target).data("bs.popover").$tip);
        });
        /*.off("hide.bs.popover").on("hide.bs.popover", function (e) {
            $(e.target).tooltip({
                container: "body",
                placement: "left"
            });
        })*/


    // activate the user interface
    setTimelineEventHandlers(simulation);
    setSimulationEventHandlers(simulation);

    // render the scenario context timeline with all events
    simulation.renderTimeline();
}


// add "X" to popover (right corner) for closing
function addCloseXToPopoverTitle(popover) {
    var closeX = $('<a href="#" title="Schließen" class="popover-close">X</a>');
    $(popover).children("h3.popover-title").append(closeX);
}

// let popover title show only what popover displays, without action associated with opening it
function replaceActionVerbInTitle(popover) {
    var titleElement = $(popover).children("h3.popover-title");
    var titleText = $(titleElement).text();

    titleText = titleText.replace(" anzeigen", "");
    $(titleElement).text(titleText);
}
