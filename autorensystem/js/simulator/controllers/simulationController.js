/**
 * Created by Helena on 24.02.2016.
 */


function setSimulationEventHandlers(simulation) {

    var timeline = simulation.getTimeline();
    var scenario = simulation.getScenario();

    var simulationSelectElement = $("#simulationSelection");
    var simulationNameInputElement = $("#simulationNameInput");
    var simulationDescriptionInputElement = $("#simulationDescriptionInput");
    var simulationSpeedInputElement = $("#simulationSpeedInput");



    /**** simulation selection ****/

    $(simulationSelectElement)
        .off("select2-open").on("select2-open", function (e) {

            // enable tooltips displaying test case description
            $(simulationSelectElement.data("select2").dropdown).find("*").tooltip({
                container: "body",
                placement: "left"
            });
        })
        .off("select2-selecting").on("select2-selecting", function (e) {

            hideAllTooltips();

            var selectedTestcase;

            // if "+ Neue Vorlage" was selected --> create new simulation for current scenario
            if (e.val == simulations.length) {
                selectedTestcase = getNewInitializedSimulation();
                selectedTestcase.setScenario(scenario);

                updateSimulator(selectedTestcase);
            }

            // else: if an existing test case was selected
            else {
                selectedTestcase = simulations[e.val];

                // if chosen test case belongs to another scenario --> make a copy
                if (selectedTestcase.getScenario() != scenario) {
                    var testcaseCopy = selectedTestcase.getCopy();
                    testcaseCopy.setScenario(scenario);

                    // reset all finished learning unit events since those do not apply here
                    var copiedTimeline = testcaseCopy.getTimeline();
                    // FLU always comes first (see simulation init)
                    copiedTimeline.getColumnEvents(0).forEach(function (fluEvt) {
                        copiedTimeline.removeEvent(fluEvt);
                    });

                    // add copy
                    simulations.push(testcaseCopy);
                    // update everything
                    updateSimulator(testcaseCopy);
                }

                // the more common case: existing test case for current scenario
                else
                    updateSimulator(selectedTestcase);
            }

            e.preventDefault();
        });



    /**** enter simulation properties: name, description, copy, delete ****/

    $("#btnSimulationProperties").off("click").on("click", function (e) {
        enterSimulationPropertiesView();
    });

    /**** enter simulation options: playback speed ****/

    $("#btnSimulatorOptions").off("click").on("click", function (e) {
        enterSimulationOptionsView();
    });


    /*** inside properties: copy or delete test case ***/

    $("#btnCopySimulation").off("click").on("click", function (e) {
        var copy = simulation.getCopy();
        simulations.push(copy);

        updateSimulator(copy);
        returnToSimulatorMainView();
    });
    $("#btnDeleteSimulation").off("click").on("click", function (e) {
        simulations.splice(simulations.indexOf(simulation), 1);

        returnToSimulatorMainView();
    });


    /**** save changes and return home to simulator from properties or options ****/

    $(".btn.back-to-simulator").off("click").on("click", function (e) {

        var simulationName = $(simulationNameInputElement).val();
        var simulationDescription = $(simulationDescriptionInputElement).val();
        var playBackSpeedInSeconds = $(simulationSpeedInputElement).val();

        if (simulationName) simulation.setTitle(simulationName);
        if (simulationDescription) simulation.setDescription(simulationDescription);
        if (playBackSpeedInSeconds) simulation.setPlayBackSpeed(playBackSpeedInSeconds * 1000);

        returnToSimulatorMainView();
    });



    /**** playback controls ****/


    $("#btnBackToStart").off("click").on("click", function (e) {
        simulation.stop();

        highlightCurrentSituation(simulation);
        undoLightboxing();
        hideSimulationMatchNotification();

        $("#timelineTableWindow").animate({scrollTop: 0}, 500);
    });

    $("#btnBackward").off("click").on("click", function (e) {
        if (simulation.getStatus() == RUNNING) {
            simulation.pause();
            timeline.decrementSelectedStep();
        }
        timeline.decrementSelectedStep();
        highlightCurrentSituation(simulation);
        setPlaybackButtonToPlay();
        simulateSelectedSituation(simulation);
    });

    $("#btnForward").off("click").on("click", function (e) {
        if (simulation.getStatus() == RUNNING) {
            simulation.pause();
            timeline.decrementSelectedStep();
        }
        timeline.incrementSelectedStep();
        highlightCurrentSituation(simulation);
        setPlaybackButtonToPlay();
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
                showNoMatchNotification();
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
        .attr("title", "Simulation fortsetzen");
}

function setPlaybackButtonToPause () {

    var playbackButton = $("#btnPlaySimulation");
    $(playbackButton).removeClass("fui-play").addClass("fui-pause")
        .attr("title", "Simulation anhalten");
}

function resetPlaybackButton () {

    var playbackButton = $("#btnPlaySimulation");
    $(playbackButton).removeClass("fui-pause").addClass("fui-play")
        .attr("title", "Simulation starten");
}



/*** display notification window on simulation start ***/

function showSimulationStartNotification() {
    var notificationModal = $(".modal.simulation-start-notification");
    $(notificationModal).modal("show");
}

function updateSimulationStartNotification() {
    var notificationModal = $(".modal.simulation-start-notification");
    $(notificationModal).find(".modal-body").html("Regeln wurden erfolgreich generiert! Starte Adaptation Engine...");
}

function hideSimulationStartNotification() {
    var notificationModal = $(".modal.simulation-start-notification");
    $(notificationModal).modal("hide");
    $(notificationModal).find(".modal-body").html("Die Regeln werden generiert, einen Moment Geduld bitte.");
}



function getNewInitializedSimulation() {
    var simulation = new Simulation();
    simulations.push(simulation);
    simulation.initTimeline(numberOfSteps);

    return simulation;
}
