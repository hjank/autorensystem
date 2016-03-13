/**
 * Created by Helena on 09.03.2016.
 */



function situationClipboardIsEmpty() {
    return (!situationClipboard || situationClipboard.length == 0);
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
        $(".timeline-step-label").tooltip("destroy");

        //handlePopoverElementMouseleave(e);
    }
}

function handleStepLabelClick(e) {

    var simulation = e.data;
    var timeline = simulation.getTimeline();
    var status = simulation.getStatus();
    var selectedStepIndex = getRowIDOfCell(this);
    var selectedStep = $(this).closest(".timeline-step");

    // when simulation is running
    if (status != STOPPED) {
        // point the simulation to selected step
        timeline.setSelectedStep(selectedStepIndex);
        // and simulate
        simulateSelectedSituation(simulation);
    }

    // otherwise
    else {

        var copying = !situationClipboardIsEmpty();

        var stepOptionsPopover = $(this).data("bs.popover").$tip;
        var stepOptions = $(stepOptionsPopover).find(".btn");

        if ($(stepOptionsPopover).hasClass("in"))
            $(this).popover("hide");
        else
            $(this).popover("show");


        // situation options are shown

        // when situation has been copied and is can be pasted
        if (copying) {
            $(stepOptions).filter(".fui-clipboard").show();
            $(stepOptions).filter(".fui-cross-circle").show();
            $(stepOptionsPopover).find(".btn-separator").show();
            $(stepOptions).filter(".fui-copy").hide();

        }
        else {
            $(stepOptions).filter(".fui-clipboard").hide();
            $(stepOptions).filter(".fui-cross-circle").hide();
            $(stepOptionsPopover).find(".btn-separator").hide();
        }

        // selected situation has no context values yet
        if (timeline.getStepEvents(selectedStepIndex).length == 0) {
            // nothing there to copy
            $(stepOptions).filter(".fui-copy").hide();
        }

    }
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

        $(this).tooltip({
            container: "body",
            title: "Der Kontext der Situation wurde kopiert. Bitte wählen Sie eine Situation zum Einfügen.",
            trigger: "manual"
        }).tooltip("show");

        var self = this;
        setTimeout(function () {
            $(self).tooltip('destroy');
        }, 3000);
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
                if (!expectsLearningUnit(event.getContextInfo()))
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
