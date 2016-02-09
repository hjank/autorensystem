/**
 * Created by Helena on 06.01.2016.
 */

var simulations = [];

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

    $("#btnBackward").on("click", function (event) {
        timeline.decrementSelectedStep();
        highlightSelectedStep(timeline.getSelectedStep());
    });

    $("#btnForward").on("click", function (event) {
        timeline.incrementSelectedStep();
        highlightSelectedStep(timeline.getSelectedStep());
    });


    $("#btnPlaySimulation").on("click", function (event) {
        // simulation is not running, either not yet or paused
        if (!simulation.isRunning()) {
            // first run
            if (timeline.getSelectedStep() == -1) simulation.start();
            // rerun after pause
            else simulation.run();


            $(this).removeClass("fui-play").addClass("fui-pause")
                .tooltip("destroy")
                .attr("title", "Simulation anhalten")
                .tooltip({container: "body"});
        }
        // running --> pause
        else {
            simulation.stop();

            $(this).removeClass("fui-pause").addClass("fui-play")
                .tooltip("destroy")
                .attr("title", "Simulation fortsetzen")
                .tooltip({container: "body"});
        }
    });

}

function resetPlayback () {
    $("#btnPlaySimulation").removeClass("fui-pause").addClass("fui-spinner11")
        .tooltip("destroy")
        .attr("title", "Simulation starten")
        .tooltip({container: "body"});
}