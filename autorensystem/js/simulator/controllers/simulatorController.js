/**
 * Created by Helena on 06.01.2016.
 */

var simulations;
var scenarioContextList;
var numberOfSteps = 10;

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


function updateSimulator(simulation) {
    replaceScenarioNamesWithReferences();

    var currentScenarioName = $("#lname")[0].innerHTML;
    var currentScenario = authorSystemContent.getScenario(currentScenarioName);
    var scenarioExists = !!currentScenario;


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
        /*simulatedContextList.getItems().forEach(function (simItem) {
            // not contained in scenario context -> remove
            if (!scenarioContextList.getItemByID(simItem.getID()) && !isFinishedLearningUnit(simItem))
                simulation.removeContextItem(simItem, true);
        });*/
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


    updatePropertiesView(simulation);
    updateOptionsView(simulation);


    // activate the user interface
    activateInfoPopovers(simulation);
    setTimelineEventHandlers(simulation);
    setSimulationEventHandlers(simulation);

    // render the scenario context timeline with all events
    simulation.renderTimeline();
}




function updatePropertiesView(simulation) {
    $("#simulationNameInput").val(simulation.getTitle());
    $("#simulationDescriptionInput").val(simulation.getDescription());
}

function updateOptionsView(simulation) {
    $("#simulationSpeedInput").val(simulation.getPlayBackSpeed()/1000);
}

function enterSimulationPropertiesView() {
    $("#simulatorContainer").hide();
    $("#simulatorPropertiesContainer").show();
}

function enterSimulationOptionsView() {
    $("#simulatorContainer").hide();
    $("#simulationOptionsContainer").show();
}

function returnToSimulatorMainView() {
    $(".simulator-component-template").hide();
    $("#simulatorContainer").show();

    // anticipate the common case: properties will have been changed, so do update
    updateSimulator();
}