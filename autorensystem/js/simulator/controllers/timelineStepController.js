/**
 * Created by Helena on 09.03.2016.
 */



function situationClipboardIsEmpty() {
    return (!situationClipboard || situationClipboard.length == 0);
}



function getStepOptionsContent() {

    var timelineStepOptionsContent = $("<div>").addClass("popover-step-options");

    // when situation has been copied and can now be pasted
    if (!situationClipboardIsEmpty()) {
        timelineStepOptionsContent
            .append($("<span>").addClass("btn btn-sm fui-clipboard").attr("title", "Kopierte Situation einfügen"))
            .append($("<span>").addClass("btn btn-sm fui-cross-circle").attr("title", "Kopieren abbrechen"));
    }
    else {
        timelineStepOptionsContent
            .append($("<span>").addClass("btn btn-sm fui-plus").attr("title", "Neue Situation einfügen"))
            .append($("<span>").addClass("btn btn-sm fui-copy").attr("title", "Situation kopieren"))
            .append($("<span>").addClass("btn btn-sm fui-trash").attr("title", "Situation löschen"));
    }
    return timelineStepOptionsContent;
}




function handleStepLabelEnter(e) {

    if (e.data.getStatus() == STOPPED) {
        var selectedStepIndex = getRowIDOfCell(this);
        highlightStep(selectedStepIndex);

        //handlePopoverElementMouseenter(e);
    }
}

function handleStepLabelLeave(e) {

    if (e.data.getStatus() == STOPPED) {

        var stepOptionsPopover = $(this).data("bs.popover").$tip;
        if (!$(stepOptionsPopover).hasClass("in") ||
            $(e.relatedTarget).closest(".selected-step, .popover").length == 0) {
            removeStepHighlighting();
            $(this).popover("hide");
        }

        //handlePopoverElementMouseleave(e);
    }
}


function handleStepLabelClick(e) {

    var simulation = e.data;
    var timeline = simulation.getTimeline();
    var selectedStepIndex = getRowIDOfCell(this);


/*  NOTE:
    NO TEST USER EVER USED THIS BECAUSE OF FORWARD/BACKWARD STEPPING FUNCTIONALITY.
    BUT: THOSE USERS WHO HAD DISCOVERED STEP OPTIONS WERE CONFUSED IF THEY WERE NOT SHOWN ANYMORE IN SIMULATION MODE.
    REMEMBER: MODES = INCONSISTENCY = BAD.


    // when simulation is running
    var status = simulation.getStatus();
    if (status != STOPPED) {
        // point the simulation to selected step
        timeline.setSelectedStep(selectedStepIndex);
        // and simulate
        simulateSelectedSituation(simulation);
    }
    // otherwise
    else {
       */


    // show little popover displaying options for step (or hide it on follow-up click)
    var stepOptionsPopover = $(this).data("bs.popover").$tip;
    if (stepOptionsPopover && $(stepOptionsPopover).hasClass("in"))
        $(this).popover("hide");
    else 
        $(this).popover("show");


    //}
}


function handleStepOptionClick(e) {
    var simulation = e.data;
    var timeline = simulation.getTimeline();

    var selectedStep = $(".selected-step");
    var stepIndex = $(selectedStep).index();
    var selectedStepEvents = timeline.getStepEvents(stepIndex);

    if ($(this).hasClass("fui-copy")) {

        situationClipboard = selectedStepEvents;
        copying = true;

        hideAllPopovers();
        markSelectedStepAsCopied();
        removeStepHighlighting();

        $(".timeline-step-label").tooltip("disable");
    }

    else {

        var newSituationIndex = stepIndex + 1;

        if ($(this).hasClass("fui-plus")) {
            timeline.addStep(newSituationIndex);
        }

        else if ($(this).hasClass("fui-trash")) {
            timeline.removeStep(stepIndex);
        }

        else if ($(this).hasClass("fui-clipboard")) {
            selectedStepEvents.forEach(function (event) {
                if (!isFinishedLearningUnit(event.getContextInfo()))
                    timeline.spliceEventAt(event, stepIndex);
            });
            timeline.addStep(newSituationIndex);
            timeline.copyEventsTo(situationClipboard, newSituationIndex);
        }

        // also click on "X" cancel copy


        situationClipboard = [];
        copying = false;


        simulation.renderTimeline();
    }
}

function handleAddStepMouseenter(e) {

    if ($(this).hasClass("fui-plus") || $(this).hasClass("fui-clipboard")) {
        var selectedStep = $(".selected-step");

        $(selectedStep).children().css({"border-bottom":"1px double red"});
        $(selectedStep).next().children().css({"border-top":"1px double red"});
    }
}

function handleAddStepMouseleave(e) {

    if ($(this).hasClass("fui-plus") || $(this).hasClass("fui-clipboard")) {
        var selectedStep = $(".selected-step");

        $(selectedStep).children().css({"border-bottom":""});
        $(selectedStep).next().children().css({"border-top":""});
    }
}
