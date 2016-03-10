/**
 * Created by Helena on 09.03.2016.
 */



function handleStepMouseover(e) {
    if (situationClipboardIsEmpty()) return;


    hideAllTooltips();

    var timeline = e.data.getTimeline();
    var stepIndex = $(this).index();
    var thisSituation = timeline.getStepEvents(stepIndex);

    if (thisSituation.length == 0) {
        hideAllPopovers();
        $(this).popover("show");
        var stepOptionsPopover = $(this).data("bs.popover").$tip;
        stepOptionsPopover.css("top", $(stepOptionsPopover).offset().top + 10);
        var stepOptions = $(stepOptionsPopover).find(".btn");
        stepOptions.hide();
        $(stepOptions).filter(".fui-check").show().tooltip(getInteractionTooltipOptions("Kontext der kopierten Situation einfügen"));
        $(stepOptions).filter(".fui-cross").show().tooltip(getInteractionTooltipOptions("Kopieren abbrechen"));
    }
    else {
        var tooltipTitle = "In diese Situation kann nicht kopiert werden, da bereits Werte existieren.";
        $(this).attr("title", tooltipTitle).tooltip("fixTitle").tooltip("show");
        $(this).find("*").css("cursor", "no-drop")
    }
}


function situationClipboardIsEmpty() {
    return (!situationClipboard || situationClipboard.length == 0);
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

        // another than the selected step's label is clicked
        if (!$(selectedStep).hasClass("selected-step")) {

            highlightStep(selectedStepIndex);
            $(selectedStep).popover("show");

            var stepOptionsPopover = $(selectedStep).data("bs.popover").$tip;
            var stepOptions = $(stepOptionsPopover).find(".btn");

            // situation options are shown

            // when situation has been copied and is can be pasted
            if (copying) {
                $(stepOptions).filter(".fui-check").show();
                $(stepOptions).filter(".fui-cross").show();
                $(stepOptionsPopover).find(".btn-separator").show();
            }
            else {
                $(stepOptions).filter(".fui-check").hide();
                $(stepOptions).filter(".fui-cross").hide();
                $(stepOptionsPopover).find(".btn-separator").hide();
            }

            // selected situation has no context values yet
            if (timeline.getStepEvents(selectedStepIndex).length == 0) {
                // nothing there to copy
                $(stepOptions).filter(".fui-copy").hide();
            }
        }

        // this is the selected and highlighted step whose label is clicked again
        else {
            removeStepHighlighting();
            $(selectedStep).popover("hide");
        }
    }

    e.stopPropagation();
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

        // just to be cautious, situationClipboard cannot be empty (see handleStepLabelClick)
        if (situationClipboard.length > 0) {
            hideAllPopovers();
            markStep(stepIndex);
            removeStepHighlighting();

            var selectedStepTooltipOptions = $(selectedStep).data("bs.tooltip").options;
            selectedStepTooltipOptions.delay = { show: 100, hide: 500 };
            selectedStepTooltipOptions.title = "Der Kontext der Situation wurde kopiert. Bitte wählen Sie eine Situation zum Einfügen.";
            $(selectedStep).tooltip("show");
        }
    }

    else {

        var newSituationIndex = stepIndex + 1;

        if ($(this).hasClass("fui-plus")) {
            timeline.addStep(newSituationIndex);
        }

        else if ($(this).hasClass("fui-trash")) {
            timeline.removeStep(stepIndex);
        }

        else if ($(this).hasClass("fui-check")) {
            selectedStepEvents.forEach(function (event) {
                timeline.spliceEventAt(event, stepIndex);
            });
            timeline.addStep(newSituationIndex);
            timeline.copyEventsTo(situationClipboard, newSituationIndex);
        }

        // also click on "X" cancel copy


        situationClipboard = [];
        copying = false;

        hideAllTooltips();
        simulation.renderTimeline();
    }

}

function handleAddStepMouseenter(e) {

    if ($(this).hasClass("fui-plus") || $(this).hasClass("fui-check")) {
        var selectedStep = $(".selected-step");

        $(selectedStep).children().css({"border-bottom":"1px double red"});
        $(selectedStep).next().children().css({"border-top":"1px double red"});
    }
}

function handleAddStepMouseleave(e) {

    if ($(this).hasClass("fui-plus") || $(this).hasClass("fui-check")) {
        var selectedStep = $(".selected-step");

        $(selectedStep).children().css({"border-bottom":""});
        $(selectedStep).next().children().css({"border-top":""});
    }
}
