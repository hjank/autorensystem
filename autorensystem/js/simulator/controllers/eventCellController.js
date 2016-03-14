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
    var firstCell = $(cells).first();
    var lastCell = $(cells).last();

    $(cells)
        .removeClass("timeline-cell-marked")
        .tooltip("destroy")
        .tooltip(getContextTooltipOptions(getContextTooltipTitle(contextEvent, simulation.getTimeline())));


    $(firstCell)
        .css("border-top", "1px solid")
        .append(createContextEventEditDOM());



    // "finished learning unit" is implicitly valid till the end of all time...
    var doesExpectLearningUnit = isFinishedLearningUnit(contextEvent.getContextInfo());

    if (!doesExpectLearningUnit)
        $(firstCell).append(createContextEventCopyDOM());

    $(firstCell)
        .append(createContextEventDeleteDOM())
        .append(createContextEventHideDOM());


    if (doesExpectLearningUnit) {
        $(firstCell)
            .removeClass("finished-units")
            .addClass("timeline-cell-occupied")
            .css("border-bottom", "1px solid");
        $(cells).not(".timeline-cell-occupied").addClass("finished-units");
    }
    // ...hence only "common" context information events shall be resizable
    else {
        var resizeHandle = $("<div>").addClass("occupied-resize-handle");
        $(lastCell).css("border-bottom", "1px solid")
            .append(resizeHandle);
        $(cells).addClass("timeline-cell-occupied")
            .on("mouseenter", function (e) {
                $(resizeHandle).css("border-bottom", "1px solid");
            })
            .on("mouseleave", function (e) {
                $(resizeHandle).css("border-bottom", "");
            });
    }

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
        .tooltip(getContextTooltipOptions(getContextUnknownTooltipTitle(contextEvent.getContextInfo())));
}



function getContextTooltipTitle (contextEvent, timeline) {

    var tooltipTitle = "";
    var contextInfo = contextEvent.getContextInfo();
    var chosenValue = contextInfo.getChosenValue();

    if (isFinishedLearningUnit(contextInfo)) {
        tooltipTitle = infoTexts.fLU + "<br><br>";
        var columnEvents = timeline.getColumnEvents(contextEvent.getColumn());
        for (var i in columnEvents) {
            var event = columnEvents[i];
            if (event.getStart() <= contextEvent.getStart()) {
                chosenValue = event.getContextInfo().getChosenValue();
                //if (!contextEvent.isVisible()) tooltipTitle += "(";
                tooltipTitle += authorSystemContent.getUnitByUUID(chosenValue).getName();
                //if (!contextEvent.isVisible()) tooltipTitle += ")";
                tooltipTitle += "<br>";
            }
        }
    }

    else {
        tooltipTitle = contextInfo.getTranslatedID() + " ist " +
            translate_possibleValue(chosenValue) + "<br><br>";
        contextInfo.getParameters().forEach(function (param) {
            tooltipTitle += translate_parameter(param.getID()) + ": ";
            tooltipTitle += translate_parameterValue(param.getChosenValue()) + "<br>";
        });
    }

    return tooltipTitle;
}


function createContextEventEditDOM() {
    return $("<a>").addClass("fui-new")
        .attr("href", "#")
        .attr("title", "Wert ändern");
}

function createContextEventDeleteDOM() {
    return $("<a>").addClass("fui-trash")
        .attr("href", "#")
        .attr("title", "Wert löschen");
}

function createContextEventCopyDOM() {
    return $("<a>").addClass("fui-copy")
        .attr("href", "#")
        .attr("title", "Wert kopieren");
}

function createContextEventHideDOM() {
    return $("<a>").addClass("fui-eye-blocked")
        .attr("href", "#")
        .attr("title",infoTexts.ignore);
}

function handleOccupiedCellAnchorLeave(e) {
    $(this).closest(".timeline-cell-occupied").tooltip("show");
}

function handleOccupiedCellAnchorClickEvent(e) {

    var simulation = e.data;
    var timeline = simulation.getTimeline();
    var firstCell = $(this).parent();
    var contextEvent = timeline.getEventAt(getRowIDOfCell(firstCell), getColIDOfCell(firstCell));
    var cells = getContextEventCells(contextEvent);

    if ($(this).hasClass("fui-new")) {
        $(firstCell).popover("show");
    }

    else if ($(this).hasClass("fui-copy")) {
        copying = true;
        eventClipboard = contextEvent.getCopy();

        $(cells).addClass("copied-event");
    }

    else if ($(this).hasClass("fui-trash")) {
        deleteContextEvent(contextEvent, simulation);
        //simulation.renderTimeline();
    }

    else if ($(this).hasClass("fui-eye-blocked")) {
        hideContextEvents([contextEvent]);

        $(this).removeClass("fui-eye-blocked").addClass("fui-eye")
            .attr("title", infoTexts.detect);
            //.tooltip("fixTitle");
    }

    else if ($(this).hasClass("fui-eye")) {
        showContextEvents([contextEvent]);

        $(this).removeClass("fui-eye").addClass("fui-eye-blocked")
            .attr("title", infoTexts.ignore);
            //.tooltip("fixTitle");
    }
}