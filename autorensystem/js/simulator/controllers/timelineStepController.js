/**
 * Created by Helena on 09.03.2016.
 */


var situationClipboard;

function handleStepLabelClick(e) {

    var simulation = e.data;
    var status = simulation.getStatus();
    var selectedStepIndex = getRowIDOfCell(this);
    var selectedStep = $(this).closest(".timeline-step");

    // when simulation is running
    if (status != STOPPED) {
        // point the simulation to selected step
        simulation.getTimeline().setSelectedStep(selectedStepIndex);
        // and simulate
        simulateSelectedSituation(simulation);
    }
    // otherwise
    else if (!$(selectedStep).hasClass("selected-step")) {
        highlightStep(selectedStepIndex);
        $(selectedStep).popover("show");
    }

    else {
        removeStepHighlighting();
        $(selectedStep).popover("hide");
    }

    e.stopPropagation();
}


function handleStepOptionClick(e) {
    var simulation = e.data;
    var timeline = simulation.getTimeline();

    var selectedStep = $(".selected-step");
    var stepIndex = $(selectedStep).index();


    if ($(this).hasClass("fui-copy")) {
        situationClipboard = timeline.getSelectedStepEvents();
    }

    else {

        if ($(this).hasClass("fui-plus")) {
            timeline.addStep(stepIndex + 1);
        }

        else if ($(this).hasClass("fui-trash")) {
            timeline.removeStep(stepIndex);
        }

        simulation.renderTimeline();
    }

    $(this).tooltip("hide");
    $(".popover").popover("hide");
}

function handleAddStepMouseenter(e) {
    var selectedStep = $(".selected-step");

    $(selectedStep).children().css({"border-bottom":"1px double red"});
    $(selectedStep).next().children().css({"border-top":"1px double red"});
}

function handleAddStepMouseleave(e) {
    var selectedStep = $(".selected-step");

    $(selectedStep).children().css({"border-bottom":""});
    $(selectedStep).next().children().css({"border-top":""});
}
