/**
 * Created by Helena on 06.01.2016.
 */

var simulations = [];
var numberOfSteps = 80;

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

        initTimeline(simulation);
        renderSimulator(simulation);
        showSimulatorTab();
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

    $("#simulatorInfo, #timelineInfo").tooltip({
        container: "body",
        placement: "auto bottom"
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
            container: "#tab5",
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
            container: "#tab5",
            content: infotexts.timeline,
            html: true,
            placement: "left"
        });


    setSimulationEventHandlers(simulation);
}


function setSimulationEventHandlers(simulation) {

    var timeline = simulation.getTimeline();

    /**** simulator info button and popover ****/

    $("#simulatorInfo, #timelineInfo")
        .on("shown.bs.popover", function (event) {
            $(event.target).tooltip("destroy");
            extendSimulatorInfoPopover($(event.target).data("bs.popover").$tip);
            setSimulatorInfoEventHandler();
        })
        .on("hide.bs.popover", function (event) {
            $(event.target).tooltip({
                container: "body",
                placement: "left"
            });
        });


    function extendSimulatorInfoPopover(popover) {

        var closeX = $('<a href="#" title="Schließen" class="simulator-info-close">X</a>').tooltip({
            container: "body",
            placement: "bottom"
        });
        var titleElement = $(popover).children("h3.popover-title");
        if ($(titleElement).find("a.simulator-info-close").length == 0)
            titleElement.append(closeX);

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
    }


    function setSimulatorInfoEventHandler() {
        $(".popover .simulator-info-close").on("click", hideAllPopovers);
    }



    /**** playback controls ****/


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



/**
 * This function highlights the given unit element by using a lightbox.
 * The background is dimmed with the unit "lifted" on top of it in a light color.
 *
 * @param unitUUID The ID of the DOM Element representing the selected unit.
 */
function lightboxUnit(unitUUID) {

    $("div.body").first().prepend(
        $("<div>").addClass("lightbox-overlay")
            .on("mousedown", function (event) {
                $("div.lightbox-overlay").remove();
            })
    );

    //$("#" + unitUUID).addClass("unit-selected");
    $(".w").first().addClass("unit-selected").css({
        "background": "",
        "color": ""
    });
}