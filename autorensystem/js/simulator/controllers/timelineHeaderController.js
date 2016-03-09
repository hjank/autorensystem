/**
 * Created by Helena on 04.03.2016.
 */



function handleColumnHeaderEnter(e) {
    $(this).css("border", "1px solid grey");
}

function handleColumnHeaderLeave(e) {
    $(this).css("border", "").children("div.timeline-header-options").hide();
    $(".timeline-cell").css("background-image", "");
}

function handleColumnHeaderClick(e) {

    var colIndex = $(this).parent().children().not(".timeline-step-label").index(this);
    getColumnCells(colIndex).css({"background-image": "repeating-linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.3))"});
}


function handleColumnHeaderOptionClick(e) {
    var simulation = e.data;
    var timeline = simulation.getTimeline();

    var timelineHeaderElement = $(this).parents(".popover").data("bs.popover").$element;
    var thisColumn = $(".timeline-header th").not(".timeline-step-label").index(timelineHeaderElement);
    var contextInfo = timeline.getColumnContext(thisColumn);
    var columnEvents = timeline.getColumnEvents(thisColumn);


    if ($(this).hasClass("fui-eye-blocked")) {
        hideContextEvents(columnEvents);

        $(this).removeClass("fui-eye-blocked").addClass("fui-eye").attr("title", infotexts.detectAll).tooltip("fixTitle");
    }

    else if ($(this).hasClass("fui-eye")) {
        showContextEvents(columnEvents);

        $(this).removeClass("fui-eye").addClass("fui-eye-blocked").attr("title", infotexts.ignoreAll).tooltip("fixTitle");
    }

    else if ($(this).hasClass("fui-trash")) {
        if (timeline.getColumnsForContextInfo(contextInfo).length > 1)
            timeline.removeColumn(thisColumn);
        else
            columnEvents.forEach(function (event) {
                timeline.removeEvent(event);
            });
        simulation.renderTimeline();
    }

    else if ($(this).hasClass("fui-plus")) {
        timeline.addColumn(contextInfo);
        simulation.renderTimeline();
    }

    $(this).tooltip("hide");
    $(".popover").popover("hide");
}