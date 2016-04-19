/**
 * Created by Helena on 22.02.2016.
 *
 * @fileOverview This file provides functionality for rendering and manipulating
 * timeline cells which are occupied by context events.
 */

/**
 * Get the timeline cells which are occupied by a context event.
 *
 * @param contextEvent A ContextEvent object.
 * @returns {*} A jQuery iterable object containing all cell elements occupied by the context event
 * - or only the first of them if the context event is of type CI_FINISHED_LEARNING_UNIT
 */
function getContextEventCells(contextEvent) {
    var cells = $();
    for (var step = contextEvent.getStart(); step <= contextEvent.getEnd(); step++)
        cells = cells.add($("#timelineTable").find(".timeline-step").eq(step)
            .children(".timeline-cell").eq(contextEvent.getColumn()));

    return isFinishedLearningUnit(contextEvent.getContextInfo()) ? $(cells).first() : cells;
}

/**
 * Adds markup to a timeline cell occupied by a context event.
 *
 * @param contextEvent The ContextEvent object to be marked up.
 * @param simulation The current simulation. Used to get at timeline for tooltip title creation.
 */
function addOccupiedMarkup (contextEvent, simulation) {

    var timeline = simulation.getTimeline();

    var cells = getContextEventCells(contextEvent);
    var firstCell = $(cells).first();
    var lastCell = $(cells).last();

    $(cells)
        .removeClass("timeline-cell-marked")
        .tooltip("destroy")
        .tooltip(getContextTooltipOptions(getContextTooltipTitle(contextEvent, timeline)));


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

        var colID = contextEvent.getColumn();
        getColumnCells(colID).each(function (index, cell) {
            if (index > contextEvent.getStart())
                $(cell).not(".timeline-cell-occupied").addClass("finished-units")
                    .tooltip("destroy")
                    .tooltip(getContextTooltipOptions(getContextTooltipTitle(timeline.getEventAt(index, colID), timeline)));
        });
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


/**
 * Get the tooltip title for a context event's cells: displays the event's context information's type and values.
 *
 * @param contextEvent A ContextEvent object which is to be rendered.
 * @param timeline The current timeline. Needed to access all CI_FINISHED_LEARNING_UNIT context events.
 * @returns {string} The title of the tooltip displayed on the context event's cells.
 */
function getContextTooltipTitle (contextEvent, timeline) {

    var tooltipTitle = "";
    var contextInfo = contextEvent.getContextInfo();
    var chosenValue = contextInfo.getChosenValue();

    if (isFinishedLearningUnit(contextInfo)) {
        tooltipTitle = infoTexts.fLU + "<br><br>";

        // go through all the other CI_FINISHED_LEARNING_UNIT context events
        var finishedLearningUnitEvents = timeline.getColumnEvents(contextEvent.getColumn());
        sortContextEventsChronologically(finishedLearningUnitEvents).forEach(function (event) {
            if (event.getStart() <= contextEvent.getStart()) {
                chosenValue = event.getContextInfo().getChosenValue();
                if (!event.isVisible())
                    tooltipTitle += "(";
                tooltipTitle += translate_unitUUIDToName(chosenValue);
                if (!event.isVisible())
                    tooltipTitle += ")";
                tooltipTitle += "<br>";
            }
        });
    }

    else {
        tooltipTitle = contextInfo.getTranslatedID() + " ist " +
            translate_possibleValue(chosenValue) + "<br>";
        contextInfo.getParameters().forEach(function (param) {
            tooltipTitle += "<br>" + translate_parameter(param.getID()) + ": ";
            tooltipTitle += translate_parameterValue(param.getChosenValue()) + "<br>";
        });
    }

    return tooltipTitle;
}


/**
 * Get the quick-edit icon DOM.
 *
 * @returns {*|jQuery} The element DOM.
 */
function createContextEventEditDOM() {
    return $("<a>").addClass("fui-new")
        .attr("href", "#")
        .attr("title", "Wert ändern");
}

/**
 * Get the quick-delete icon DOM.
 *
 * @returns {*|jQuery} The element DOM.
 */
function createContextEventDeleteDOM() {
    return $("<a>").addClass("fui-trash")
        .attr("href", "#")
        .attr("title", "Wert löschen");
}

/**
 * Get the quick-copy icon DOM.
 *
 * @returns {*|jQuery} The element DOM.
 */
function createContextEventCopyDOM() {
    return $("<a>").addClass("fui-copy")
        .attr("href", "#")
        .attr("title", "Wert kopieren");
}

/**
 * Get the quick-hide icon DOM.
 *
 * @returns {*|jQuery} The element DOM.
 */
function createContextEventHideDOM() {
    return $("<a>").addClass("fui-eye-blocked")
        .attr("href", "#")
        .attr("title",infoTexts.ignore);
}


/**
 * Handles the mouse event 'click' on a quick-access icon in a timeline cell occupied by a context event, i.e.:
 * handles editing, copying, deleting, or hiding/showing a context event.
 *
 * @param e The 'click' mouse event.
 */
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
    }

    else if ($(this).hasClass("fui-eye-blocked")) {
        hideContextEvent(contextEvent);

        $(this).removeClass("fui-eye-blocked").addClass("fui-eye")
            .attr("title", infoTexts.detect);
    }

    else if ($(this).hasClass("fui-eye")) {
        showContextEvent(contextEvent);

        $(this).removeClass("fui-eye").addClass("fui-eye-blocked")
            .attr("title", infoTexts.ignore);
    }
}