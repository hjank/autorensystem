/**
 * Created by Helena on 24.02.2016.
 */



function setSimulationEventHandlers(simulation) {

    var timeline = simulation.getTimeline();
    var scenario = simulation.getScenario();

    var simulatorMainContainerElement = $("#simulatorContainer");
    var simulationSelectElement = $("#simulationSelection");
    var simulationNameInputElement = $("#simulationNameInput");
    var simulationDescriptionInputElement = $("#simulationDescriptionInput");
    var simulationSpeedInputElement = $("#simulationSpeedInput");



    /**** simulation selection ****/

   /* $(simulationSelectElement).off("select2-selecting").on("select2-open", function (e) {
        $(simulationSelectElement.data("select2").dropdown).find("*").tooltip({
            container: "body",
            placement: "bottom"
        });
    });*/

    $(simulationSelectElement).off("select2-selecting").on("select2-selecting", function (e) {

        var selectedTestcase;

        // "+ Neue Vorlage"
        if (e.val == simulations.length) {
            selectedTestcase = getNewInitializedSimulation();
            selectedTestcase.setScenario(scenario);

            updateSimulator(selectedTestcase);
        }
        // existing testcase
        else {
            selectedTestcase = simulations[e.val];

            // chosen from another scenario -> make a copy
            if (selectedTestcase.getScenario() != scenario) {
                var testcaseCopy = selectedTestcase.getCopy();
                testcaseCopy.setScenario(scenario);

                // reset all finished learning unit events since those do not apply here
                var copiedTimeline = testcaseCopy.getTimeline();
                copiedTimeline.getColumnEvents(0).forEach(function (fluEvt) { // FLU always comes first (see simulation init)
                    copiedTimeline.removeEvent(fluEvt);
                });

                simulations.push(testcaseCopy);

                updateSimulator(testcaseCopy);
            }

            // common case: testcase for scenario
            else
                updateSimulator(selectedTestcase);
        }

        e.preventDefault();
    });



    /**** simulation properties: name, description, delete ****/

    $("#btnSimulationProperties").off("click").on("click", function (e) {
        $(simulationNameInputElement).val(simulation.getTitle());
        $(simulationDescriptionInputElement).val(simulation.getDescription());

        enterSimulationPropertiesView();
    });

    $("#btnDeleteSimulation").off("click").on("click", function (e) {
        simulations.splice(simulations.indexOf(simulation), 1);

        returnToSimulatorMainView();
    });

    /**** simulation options ****/

    $("#btnSimulatorOptions").off("click").on("click", function (e) {
        $(simulationSpeedInputElement).val(simulation.getPlayBackSpeed()/1000);

        enterSimulationOptionsView();
    });


    /**** return home to simulator from properties or options ****/

    $(".btn.back-to-simulator").off("click").on("click", function (e) {

        var simulationName = $(simulationNameInputElement).val();
        var simulationDescription = $(simulationDescriptionInputElement).val();
        var playBackSpeedInSeconds = $(simulationSpeedInputElement).val();

        if (simulationName) simulation.setTitle(simulationName);
        if (simulationDescription) simulation.setDescription(simulationDescription);
        if (playBackSpeedInSeconds) simulation.setPlayBackSpeed(playBackSpeedInSeconds * 1000);

        returnToSimulatorMainView();
    });


    /**** convenience wrappers ****/

    function enterSimulationPropertiesView() {
        simulatorMainContainerElement.hide();
        $("#simulatorPropertiesContainer").show();
    }

    function enterSimulationOptionsView() {
        simulatorMainContainerElement.hide();
        $("#simulationOptionsContainer").show();
    }

    function returnToSimulatorMainView() {
        $(".simulator-component-template").hide();
        simulatorMainContainerElement.show();

        // anticipate the common case: properties will have been changed, so do update
        updateSimulator();
    }



    /**** playback controls ****/


    $("#btnBackToStart").off("click").on("click", function (e) {
        simulation.stop();
        highlightCurrentSituation(simulation);

        $("#timelineTableWindow").animate({scrollTop: 0}, 500);
    });

    $("#btnBackward").off("click").on("click", function (e) {
        timeline.decrementSelectedStep();
        highlightCurrentSituation(simulation);
        simulateSelectedSituation(simulation);
    });

    $("#btnForward").off("click").on("click", function (e) {
        timeline.incrementSelectedStep();
        highlightCurrentSituation(simulation);
        simulateSelectedSituation(simulation);
    });


    $("#btnPlaySimulation").off("click").on("click", function (e) {

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

function simulateSelectedSituation(simulation) {
    var status = simulation.getStatus();

    if (status != STOPPED) {
        // stop simulation from running on
        simulation.pause();

        // re-run simulation of selected situation
        simulation.run();

        // do not restart simulation when it has been paused before step was clicked
        if (status == PAUSED) {
            simulation.pause();
            // and re-set selected step which was incremented at the end of _run()
            simulation.getTimeline().decrementSelectedStep();
        }
    }
}

function setPlaybackButtonToPlay () {

    var playbackButton = $("#btnPlaySimulation");
    $(playbackButton).removeClass("fui-pause").addClass("fui-play")
        .attr("title", "Simulation fortsetzen")
        .tooltip("fixTitle");
}

function setPlaybackButtonToPause () {

    var playbackButton = $("#btnPlaySimulation");
    $(playbackButton).removeClass("fui-play").addClass("fui-pause")
        .attr("title", "Simulation anhalten")
        .tooltip("fixTitle");
}

function resetPlaybackButton () {

    var playbackButton = $("#btnPlaySimulation");
    $(playbackButton).removeClass("fui-pause").addClass("fui-play")
        .attr("title", "Simulation starten")
        .tooltip("fixTitle");
}




function showSimulationStartNotification() {
    var notificationModal = $(".modal.simulation-notification");
    $(notificationModal).modal("show");
}

function hideSimulationStartNotification() {
    var notificationModal = $(".modal.simulation-notification");
    $(notificationModal).modal("hide");
}


function showAdaptationEngineSelection(unitUUID) {
    lightboxUnit(unitUUID);
}

/**
 * This function highlights the given unit element by using a lightbox.
 * The background is dimmed with the unit "lifted" on top of it in a light color.
 *
 * @param unitUUID The ID of the DOM Element representing the selected unit.
 */
function lightboxUnit(unitUUID) {

    $("#container").prepend(
        $("<div>").addClass("lightbox-overlay")
            .on("mousedown", function (e) {
                $("div.lightbox-overlay").remove();
            })
    );

    $("#" + unitUUID).addClass("unit-selected").css({
        "background": "",
        "color": ""
    });
}


function undoLightboxing() {
    $("div.lightbox-overlay").remove();
    $(".unit-selected").removeClass("unit-selected");
}