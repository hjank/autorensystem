/**
 * Created by Helena on 06.01.2016.
 */

var simulations = [];
var numberOfSteps = 20;

// TODO: Consider switching between scenarios!
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

        $("#simulationTitle > span")[0].innerText = simulation.getTitle();

        initTimeline(simulation);

        setSimulationEventHandlers(simulation);

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
                    var index = simulation.addContextItem(contextInfo);

                    simulation.renderTimeline();
                }
            }
        });
    }
}


function setSimulationEventHandlers(simulation) {

    var timeline = simulation.getTimeline();

    $("#simulatorContainer *").tooltip({container: "body"});

    $("#btnSimulatorInfo")
        .popover({
            container: "#tab5",
            content: "Hier können Sie das Verhalten der Lernanwendung simulieren. Dazu modellieren Sie den Kontext des Lernszenarios.",
            //html: true,
            placement: "auto top",
            template: '<div class="popover" role="tooltip">' +
                '<div class="arrow"></div>' +
                '<h3 class="popover-title"></h3>' +
                '<div class="popover-content"></div>' +
                '</div>',
            title: "",
            viewport: "#simulatorHeader"
        });

    $("#btnBackToStart").on("click", function (event) {
        simulation.stop();
        highlightSelectedStep(timeline);
    });

    $("#btnBackward").on("click", function (event) {
        timeline.decrementSelectedStep();
        highlightSelectedStep(timeline);
    });

    $("#btnForward").on("click", function (event) {
        timeline.incrementSelectedStep();
        highlightSelectedStep(timeline);
    });


    $("#btnPlaySimulation").on("click", function (event) {

        switch (simulation.getStatus()) {

            case PAUSED:
                simulation.run();

                setPlaybackButtonToPause();
                break;

            case RUNNING:
                simulation.pause();

                setPlaybackButtonToPlay();
                break;

            case STOPPED:
                simulation.start();

                setPlaybackButtonToPause();
                break;
        }
    });
}


function setPlaybackButtonToPlay () {

    var playbackButton = $("#btnPlaySimulation");
    $(playbackButton).removeClass("fui-pause").addClass("fui-play")
        .tooltip("destroy")
        .attr("title", "Simulation fortsetzen")
        .tooltip({container: "body"});
}

function setPlaybackButtonToPause () {

    var playbackButton = $("#btnPlaySimulation");
    $(playbackButton).removeClass("fui-play").addClass("fui-pause")
        .tooltip("destroy")
        .attr("title", "Simulation anhalten")
        .tooltip({container: "body"});
}

function resetPlaybackButton () {

    var playbackButton = $("#btnPlaySimulation");
    $(playbackButton).removeClass("fui-pause").addClass("fui-play")
        .tooltip("destroy")
        .attr("title", "Simulation starten")
        .tooltip({container: "body"});
}