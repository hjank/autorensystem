/**
 * Created by Helena on 24.02.2016.
 */



function setSimulationEventHandlers(simulation) {

    var simulatorMainContainerElement = $("#simulatorContainer");
    var simulationSelectElement = $("#simulationSelection");
    var simulationNameInputElement = $("#simulationNameInput");
    var simulationDescriptionInputElement = $("#simulationDescriptionInput");
    var simulationSpeedInputElement = $("#simulationSpeedInput");



    /**** simulation selection ****/

    $(simulationSelectElement).off().on("select2-selecting", function (e) {
        updateSimulator(simulations[e.val]);
        e.preventDefault();
    });


    /**** simulator and timeline info buttons and popovers ****/

    $("#simulatorInfo, #timelineInfo")
        .on("shown.bs.popover", function (e) {
            $(e.target).tooltip("destroy");
            extendSimulatorInfoPopover($(e.target).data("bs.popover").$tip);
        })
        .on("hide.bs.popover", function (e) {
            $(e.target).tooltip({
                container: "body",
                placement: "left"
            });
        });

    function extendSimulatorInfoPopover(popover) {

        var closeX = $('<a href="#" title="Schließen" class="simulator-info-close">X</a>')
            .tooltip({
                container: "body",
                placement: "bottom"
            })
            .off("click").on("click", hideAllPopovers);

        $(popover).children("h3.popover-title").append(closeX);

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


    /**** simulation properties: name, description, delete ****/

    $("#btnSimulationProperties").off("click").on("click", function (e) {
        $(simulationNameInputElement).val(simulation.getTitle());
        $(simulationDescriptionInputElement).val(simulation.getDescription());

        simulatorMainContainerElement.hide();
        $("#simulatorPropertiesContainer").show();
    });


    /**** simulation options ****/

    $("#btnSimulatorOptions").off("click").on("click", function (e) {

        $(simulationSpeedInputElement).val(simulation.getPlayBackSpeed()/1000);
        simulatorMainContainerElement.hide();
        $("#simulationOptionsContainer").show();
    });


    /**** return home to simulator from properties or options ****/

    $(".btn.back-to-simulator").off("click").on("click", function (e) {

        var simulationName = $(simulationNameInputElement).val();
        var simulationDescription = $(simulationDescriptionInputElement).val();
        var playBackSpeedInSeconds = $(simulationSpeedInputElement).val();

        if (simulationName) simulation.setTitle(simulationName);
        if (simulationDescription) simulation.setDescription(simulationDescription);
        if (playBackSpeedInSeconds) simulation.setPlayBackSpeed(playBackSpeedInSeconds * 1000);

        $(".simulator-component-template").hide();
        simulatorMainContainerElement.show();
        updateSimulator();
    });



    /**** playback controls ****/

    var timeline = simulation.getTimeline();


    $("#btnBackToStart").off("click").on("click", function (e) {
        simulation.stop();
        highlightSelectedStep(simulation);

        $("#timelineTableWindow").animate({scrollTop: 0}, 500);
    });

    $("#btnBackward").off("click").on("click", function (e) {
        timeline.decrementSelectedStep();
        highlightSelectedStep(simulation);
    });

    $("#btnForward").off("click").on("click", function (e) {
        timeline.incrementSelectedStep();
        highlightSelectedStep(simulation);
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