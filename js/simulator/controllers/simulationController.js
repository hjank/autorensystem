/**
 * Created by Helena on 24.02.2016.
 */



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


    $("#btnBackToStart").off("click").on("click", function (event) {
        simulation.stop();
        highlightSelectedStep(simulation);

        $("#timelineTableWindow").animate({scrollTop: 0}, 500);
    });

    $("#btnBackward").off("click").on("click", function (event) {
        timeline.decrementSelectedStep();
        highlightSelectedStep(simulation);
    });

    $("#btnForward").off("click").on("click", function (event) {
        timeline.incrementSelectedStep();
        highlightSelectedStep(simulation);
    });


    $("#btnPlaySimulation").off("click").on("click", function (event) {

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