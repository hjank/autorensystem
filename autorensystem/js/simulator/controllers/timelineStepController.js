/**
 * Created by Helena on 09.03.2016.
 */



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

    if ($(this).hasClass("fui-plus")) {
        timeline.addStep(getRowIDOfCell(selectedStep) + 1);
    }

    else if ($(this).hasClass("fui-copy")) {
    }

    else if ($(this).hasClass("fui-trash")) {
    }


    $(this).tooltip("hide");
    $(".popover").popover("hide");

    simulation.renderTimeline();
}

function handleAddStepMouseenter(e) {

    var labelCell = $(this).parent();
    $(labelCell).tooltip("hide");

    $(labelCell).parent().children().css({"border-bottom":"1px double red"});
    $(labelCell).parent().next().children().css({"border-top":"1px double red"});

    e.stopPropagation();
}

function handleAddStepMouseleave(e) {
    var labelCell = $(this).parent();
    $(labelCell).tooltip("show");

    $(labelCell).parent().children().css({"border-bottom":""});
    $(labelCell).parent().next().children().css({"border-top":""});
}
