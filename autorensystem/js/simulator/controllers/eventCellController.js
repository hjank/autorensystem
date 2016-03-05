/**
 * Created by Helena on 22.02.2016.
 */



function getContextEventCells(contextEvent) {
    var cells = $();
    for (var step = contextEvent.getStart(); step <= contextEvent.getEnd(); step++)
        cells = cells.add($("#timelineTable").find(".timeline-step").eq(step)
            .children(".timeline-cell").eq(contextEvent.getColumn()));
    return cells;
}



function addOccupiedMarkup (contextEvent, simulation) {

    var cells = getContextEventCells(contextEvent);

    $(cells)
        .removeClass("timeline-cell-marked")
        .tooltip("destroy")
        .tooltip({
            animation: false,
            container: "body",
            html: true,
            title: getTooltipTitle(contextEvent, simulation.getTimeline()),
            viewport: "#timelineContainer"
        });

    var doesExpectLearningUnit = expectsLearningUnit(contextEvent.getContextInfo());
    var firstCell = $(cells).first();

    // "finished learning unit" is implicitly valid till the end of all time...
    if (doesExpectLearningUnit)
        cells = firstCell;

    $(cells)
        .addClass("timeline-cell-occupied");

    $(firstCell)
        .css("border-top", "1px solid")
        .append($("<a>").attr("href","#").addClass("fui-new"))
        .append(createContextEventHideDOM())
        .append(createContextEventDeleteDOM());

    var lastCell = $(cells).last();
    $(lastCell).css("border-bottom", "1px solid");

    // ...hence only "common" context information events shall be resizable
    if (!doesExpectLearningUnit)
        $(lastCell).append($("<div>").addClass("occupied-resize-handle"));


    if (!contextEvent.isVisible())
        $(firstCell).find("a.fui-eye-blocked").trigger("click");
}


function removeOccupiedMarkup (contextEvent) {
    var cells = getContextEventCells(contextEvent);

    $(cells).removeClass("timeline-cell-occupied")
        .empty()
        .css({
            "border-top": "",
            "border-bottom": ""
        })
        .popover("destroy")
        .tooltip("destroy")
        .tooltip(getTopTooltipOptions(
            translate_contextInformation(contextEvent.getContextInfo().getID()) + infotexts.unknownValue
        ));
}



function getTooltipTitle (contextEvent, timeline) {

    var tooltipTitle = "";
    var contextInfo = contextEvent.getContextInfo();
    var chosenValue = contextInfo.getChosenValue();

    if (expectsLearningUnit(contextInfo)) {
        tooltipTitle = "Abgeschlossene Lerneinheiten:<br><br>";
        var columnEvents = timeline.getColumnEvents(contextEvent.getColumn());
        for (var i in columnEvents) {
            var event = columnEvents[i];
            if (event.getStart() <= contextEvent.getStart()) {
                chosenValue = event.getContextInfo().getChosenValue();
                tooltipTitle += authorSystemContent.getUnitByUUID(chosenValue).getName() + "<br>";
            }
        }
    }

    else {
        tooltipTitle = translate_contextInformation(contextInfo.getID()) + " ist " +
            translate_possibleValue(chosenValue) + "<br><br>";
        contextInfo.getParameters().forEach(function (param) {
            tooltipTitle += translate_parameter(param.getID()) + ": ";
            tooltipTitle += translate_parameterValue(param.getChosenValue()) + "<br>";
        });
    }

    return tooltipTitle;
}


function createContextEventDeleteDOM () {
    return $("<a>")
        .attr("href", "#")
        .addClass("fui-trash")
        .attr("title", "Löschen")
        .tooltip();
}

function createContextEventCopyDOM () {
    return $("<a>")
        .attr("href", "#")
        .addClass("fui-copy")
        .attr("title", "Duplizieren")
        .tooltip();
}

function createContextEventHideDOM () {
    return $("<a>")
        .attr("href", "#")
        .addClass("fui-eye-blocked")
        .attr("title", infotexts.ignore)
        .on("mouseover", function (e) {
            $(this).parent().tooltip("hide");
        })
        .tooltip({
            animation: false,
            container: "body"
        });
}




function handleOccupiedCellAnchorClickEvent (e) {

    var simulation = e.data;
    var timeline = simulation.getTimeline();
    var firstCell = $(this).parent();
    var contextEvent = timeline.getEventAt(getRowIDOfCell(firstCell), getColIDOfCell(firstCell));
    var cells = getContextEventCells(contextEvent);

    if ($(this).hasClass("fui-new")) {
        $(firstCell).popover("show");
    }

    else if ($(this).hasClass("fui-eye-blocked")) {
        hideContextEvents([contextEvent]);

        $(this).removeClass("fui-eye-blocked").addClass("fui-eye")
            .attr("title", infotexts.detect)
            .tooltip("fixTitle");
    }

    else if ($(this).hasClass("fui-eye")) {
        showContextEvents([contextEvent]);

        $(this).removeClass("fui-eye").addClass("fui-eye-blocked")
            .attr("title", infotexts.ignore)
            .tooltip("fixTitle");
    }

    else if ($(this).hasClass("fui-trash")) {
        deleteContextEvent(contextEvent, timeline);
        simulation.renderTimeline();
    }
}