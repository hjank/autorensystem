/**
 * Created by Helena on 24.02.2016.
 */



function setSimulationEventHandlers(simulation) {

    /**** simulation selection ****/

    var simulationSelectElement = $("#simulationSelection");
    $(simulationSelectElement).on("select2:select", function (e) {
        //updateSimulator(simulationSelectElement.select2("data").id);
        updateSimulator(e.val());
    });

    /**** simulator info button and popover ****/

    $("#simulatorInfo, #timelineInfo")
        .on("shown.bs.popover", function (e) {
            $(e.target).tooltip("destroy");
            extendSimulatorInfoPopover($(e.target).data("bs.popover").$tip);
            setSimulatorInfoEventHandler();
        })
        .on("hide.bs.popover", function (e) {
            $(e.target).tooltip({
                container: "body",
                placement: "left"
            });
        });


    function extendSimulatorInfoPopover(popover) {

        var closeX = $('<a href="#" title="Schließen" class="simulator-info-close">X</a>').tooltip({
            container: "body",
            placement: "bottom"
        });
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


    function setSimulatorInfoEventHandler() {
        $(".popover .simulator-info-close").on("click", hideAllPopovers);
    }



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


/**
 * This function highlights the given unit element by using a lightbox.
 * The background is dimmed with the unit "lifted" on top of it in a light color.
 *
 * @param unitUUID The ID of the DOM Element representing the selected unit.
 */
function lightboxUnit(unitUUID) {

    $("div.body").first().prepend(
        $("<div>").addClass("lightbox-overlay")
            .on("mousedown", function (e) {
                $("div.lightbox-overlay").remove();
            })
    );

    //$("#" + unitUUID).addClass("unit-selected");
    $(".w").first().addClass("unit-selected").css({
        "background": "",
        "color": ""
    });
}